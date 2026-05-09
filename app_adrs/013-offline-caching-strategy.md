# ADR 013 — Offline and Caching Strategy

**Date:** 2026-05-09  
**Status:** Accepted  
**Deciders:** Founding team

---

## Context

Our target users are in India on mobile networks that range from stable 4G to 2G-equivalent connections in tier-2 and tier-3 cities. A child losing audio mid-story because of a network blip is a high-churn event. We need a clear decision on what works offline and what requires connectivity.

Full offline-first is not achievable in Phase 1 — it requires significant native module work (see ADR 008 on Expo managed workflow limits). We need a pragmatic middle ground.

---

## Decision

We will implement **partial offline support with aggressive audio pre-caching**. Specifically:

- Audio files for the current story are downloaded to device before playback begins
- The last 3 played stories are retained in local cache automatically
- User progress (XP, badges, quiz scores) is written to Supabase only when online; local state is the source of truth during a session
- Content metadata (story list, categories) is cached with a 24-hour TTL using React Query
- Authentication and subscription status require connectivity on first load; subsequent launches use cached session

---

## Rationale

**What must work offline (non-negotiable for UX):**

A child who has opened a story should be able to complete it without interruption. The biggest failure mode is audio stopping mid-narration. Downloading audio before playback starts costs a few seconds upfront but eliminates mid-story failures.

**What can require connectivity:**

- Fetching new stories the child hasn't seen before
- Leaderboard and family group features
- Subscription verification on first launch of the day

**Caching tiers:**

| Data type | Cache location | TTL | Library |
|-----------|---------------|-----|---------|
| Story metadata (title, slides list) | React Query in-memory + AsyncStorage | 24 hours | `@tanstack/react-query` + `react-query-persist-client` |
| Audio MP3 files | Device filesystem (`expo-file-system`) | Until cache cleared or 7 days | `expo-file-system` |
| User progress (XP, current story) | AsyncStorage (local-first) | Session + synced on connectivity | Custom sync hook |
| Auth session | Supabase AsyncStorage adapter | Supabase token expiry | Built-in Supabase client |
| Images (story illustrations) | `expo-image` built-in cache | Automatic (LRU) | `expo-image` |

**Why not a full offline-first approach (e.g. SQLite sync):**

Full offline sync (SQLite on device + Supabase sync) requires conflict resolution logic, background sync jobs, and native modules beyond Expo managed workflow. This is a Phase 3 consideration, specifically if we add the shloka karaoke feature which requires local scoring without connectivity.

**Why not rely on the OS HTTP cache alone:**

HTTP caching (ETags, Cache-Control) works for images but is unreliable for large audio files on Android's WebView/fetch layer. Explicitly downloading MP3s to the filesystem via `expo-file-system` gives us predictable, inspectable cache state.

---

## Implementation

```
Audio pre-cache flow:
1. User opens a story → app checks if all slide MP3s exist in expo-file-system cache
2. Missing files are downloaded in background before slide 1 starts playing
3. A loading indicator shows only if network is slow (> 3 seconds for first audio file)
4. Subsequent slides play from local cache — no network dependency

Cache eviction:
- Story audio cache is capped at 150MB total
- When cap is reached, LRU stories are deleted (oldest last-played first)
- User's current active story is never evicted
```

---

## Consequences

- `expo-file-system` is used for audio file management. This is within Expo managed workflow capabilities.
- React Query with AsyncStorage persistence is the data-fetching layer — no direct `fetch` calls in components.
- A `useNetworkStatus` hook wraps `expo-network` to show an offline banner when connectivity is lost. Features requiring live data are disabled gracefully, not hidden.
- Progress sync uses an optimistic update pattern: local state updates immediately, Supabase write happens in background. On next app open, Supabase state wins (server is source of truth for persisted data).
- Phase 3 revisit: full SQLite offline sync if background audio and shloka karaoke are built.

---

## Related ADRs

- [ADR 005](005-pre-generated-audio.md) — Pre-generated MP3s are what makes device-level audio caching viable
- [ADR 008](008-expo-managed-workflow.md) — Expo managed workflow boundaries constrain the offline approach; native background sync is out of scope until ejection
