# ADR 001 — React Native over Flutter

**Date:** 2025-05-02  
**Status:** Accepted  
**Deciders:** Founding team

---

## Context

We need a cross-platform mobile framework to build Dharma Seekho for Android and iOS from a single codebase. The two main contenders are React Native (with Expo) and Flutter.

The team has prior JavaScript experience. Budget is ₹50k–₹5L, so minimising ramp-up time matters as much as raw technical capability.

---

## Decision

We will use **React Native with Expo Managed Workflow**.

---

## Rationale

| Criteria | React Native + Expo | Flutter |
|----------|--------------------|---------| 
| Team familiarity | ✅ JS/TS already known | ❌ Dart is a new language to learn |
| Expo Go for testing | ✅ Scan QR, instant on phone | ❌ Requires full build each time |
| Web target (same codebase) | ✅ React Native Web | ⚠️ Flutter Web exists but immature |
| Supabase JS SDK | ✅ First-class support | ⚠️ Community Dart package |
| Ecosystem maturity | ✅ Large, well-documented | ✅ Growing fast |
| OTA updates (EAS Update) | ✅ JS bundle updates without store review | ❌ Dart code must go through store |
| Audio playback (`expo-av`) | ✅ Well-supported | ⚠️ More setup required |
| Hindi / Devanagari rendering | ✅ Native text engine | ✅ Custom font required |

The OTA update capability is particularly valuable — we can push content and bug fixes to users without a Play Store review cycle, which matters when adding new languages and stories frequently.

---

## Consequences

- We share a JS/TS codebase across mobile and web, reducing duplication.
- Expo managed workflow limits some native module access. If we need a custom native module (e.g. background audio in Phase 3), we will eject to Expo bare workflow at that point.
- Flutter's performance advantage (Skia-rendered UI) is not a concern for our use case — our UI is standard list/card layouts, not GPU-intensive games.

---

## Alternatives Considered

**Flutter:** Rejected primarily due to team Dart unfamiliarity and the absence of a scan-and-test equivalent to Expo Go. Would revisit if we hire a Flutter-specialist developer in Phase 3.

**Native Android (Kotlin) + Native iOS (Swift):** Rejected. Doubles development time and cost. Not viable at current budget.
