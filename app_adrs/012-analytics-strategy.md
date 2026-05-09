# ADR 012 — Analytics Strategy: PostHog

**Date:** 2026-05-09  
**Status:** Accepted  
**Deciders:** Founding team

---

## Context

We need to understand how users engage with the app: which stories they complete, where they drop off, which age group converts to premium, and whether a new language drives retention. Without analytics, we are building blind.

Special constraints:
- The app targets children under 13 — analytics must not collect personally identifiable information (PII) or expose data to third-party ad networks (COPPA/DPDP compliance)
- Budget is minimal in Phase 1
- We need both product analytics (funnels, retention) and simple usage dashboards visible to the content team

---

## Decision

We will use **PostHog** (cloud, free tier) for product analytics. Events are captured in the mobile app and web app. No third-party analytics SDK is used. User identity is pseudonymous — we track by `user_id` (UUID from Supabase), never by name or phone number.

---

## Rationale

**Options evaluated:**

| Tool | Free tier | COPPA-safe | Self-hostable | Funnel/retention | Indian latency |
|------|-----------|------------|---------------|-----------------|----------------|
| Firebase Analytics | ✅ Unlimited | ⚠️ Shares data with Google ad network | ❌ | ⚠️ Limited funnels | ✅ Good |
| Mixpanel | ⚠️ 20M events/month | ✅ If configured | ❌ | ✅ Excellent | ✅ Good |
| Amplitude | ⚠️ 10M events/month | ✅ | ❌ | ✅ Excellent | ✅ Good |
| PostHog | ✅ 1M events/month | ✅ No ad network | ✅ Can self-host | ✅ Good | ✅ Good |
| Custom (Supabase table) | ✅ Free | ✅ Full control | ✅ | ❌ Must build dashboards | ✅ |

**Why PostHog over Firebase Analytics:**

Firebase Analytics is the obvious choice given we already use Firebase FCM. However, Firebase shares analytics data with Google's advertising infrastructure. For a children's app, this creates COPPA/DPDP exposure even if we do not run ads ourselves. PostHog explicitly does not sell or share event data.

**Why PostHog over Mixpanel/Amplitude:**

PostHog's free tier (1M events/month) covers our entire Phase 1 and Phase 2 scale. Mixpanel and Amplitude both have generous free tiers but are closed-source. PostHog can be self-hosted on a ₹500/month VPS if cloud costs become a concern, giving us a migration path without losing historical data.

**Why not a custom Supabase analytics table:**

Writing raw events to Supabase is free and fully private, but requires building all dashboards ourselves. PostHog's out-of-the-box funnel analysis, session recordings (web only), and retention curves would take months to replicate. We use PostHog for now and can pipe raw events to Supabase in parallel if we need custom SQL queries.

---

## Key Events to Track

| Event | Properties | Purpose |
|-------|-----------|---------|
| `story_started` | story_id, lang, age_group | Content popularity |
| `story_completed` | story_id, lang, duration_sec | Completion rate |
| `story_abandoned` | story_id, slide_index | Drop-off slide identification |
| `quiz_answered` | quiz_id, correct (bool) | Difficulty calibration |
| `shloka_played` | shloka_id, lang | Audio engagement |
| `subscription_started` | plan, price, currency | Conversion tracking |
| `subscription_cancelled` | plan, reason | Churn analysis |
| `language_switched` | from_lang, to_lang | Language preference data |

No names, phone numbers, or device identifiers are included in any event.

---

## Consequences

- PostHog JS SDK added to mobile app (via `posthog-react-native`) and web app.
- All events use `user_id` (Supabase UUID) as the distinct ID. Anonymous users get a random UUID stored in AsyncStorage.
- A PostHog dashboard is shared read-only with the content team and `analytics_viewer` admin role.
- PostHog session recordings are disabled on the mobile app. Enabled only on the web admin panel for UX debugging.
- We do not use PostHog feature flags in Phase 1 — all feature gating is handled in Supabase via the subscription table.

---

## Review Trigger

Revisit if: (a) monthly events exceed 800k (approaching free tier limit), or (b) self-hosting becomes necessary for DPDP compliance audit.

---

## Related ADRs

- [ADR 006](006-freemium-model.md) — Subscription conversion events are a primary analytics goal
- [ADR 011](011-admin-rbac.md) — `analytics_viewer` role accesses PostHog dashboard read-only
