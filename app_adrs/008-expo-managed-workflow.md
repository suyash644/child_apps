# ADR 008 — Expo Managed Workflow

**Date:** 2025-05-02  
**Status:** Accepted  
**Deciders:** Founding team

---

## Context

Expo offers two workflows: Managed (Expo handles native builds) and Bare (eject to full React Native with native code access). We must choose before writing any native-dependent code.

---

## Decision

We will use **Expo Managed Workflow** for Phase 1 and Phase 2. We will eject to bare workflow only if a specific Phase 3 feature requires a native module not available in Expo SDK.

---

## Rationale

Managed workflow provides:
- `expo-av` for audio playback (covers our story narration needs completely)
- `expo-notifications` for push notifications via FCM
- `expo-haptics` for tactile feedback in games
- EAS Build — cloud builds without needing Xcode or Android Studio locally
- EAS Update — OTA JS bundle updates without store review

**The key constraint of managed workflow** is that we cannot write custom native (Kotlin/Swift) modules. The features that might require this in Phase 3 are:

- Background audio playback (shloka karaoke) — may need native background audio session
- Microphone-based shloka scoring — may need lower-level audio access
- Offline content sync — may need background fetch

None of these are Phase 1 or Phase 2 concerns. We commit to managed workflow now and revisit at Phase 3 planning.

**Eject cost:** Ejecting from managed to bare workflow is a one-way operation that takes 1–2 developer days and requires setting up local Xcode and Android Studio. Acceptable when the time comes.

---

## Consequences

- No custom native modules in Phase 1 or Phase 2.
- All native capabilities must come from Expo SDK or well-maintained Expo-compatible community packages.
- EAS Build is required for production APK/IPA generation (replaces local `expo build`).
- The `app.json` Expo config is the source of truth for native configuration — no `android/` or `ios/` directories in the repo.