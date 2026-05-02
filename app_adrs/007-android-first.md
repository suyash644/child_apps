# ADR 007 — Android-First Launch

**Date:** 2025-05-02  
**Status:** Accepted  
**Deciders:** Founding team

---

## Context

We are building for Android and iOS (React Native supports both), but cannot afford the time and cost to launch both simultaneously in Phase 1. We must choose a primary platform.

---

## Decision

We will launch **Android-only in Phase 1**. iOS will follow in Phase 2.

---

## Rationale

- Android holds ~95% smartphone market share in India (our Phase 1 market)
- Apple Developer Program costs $99/year (~₹8,200) — not a deal-breaker, but saved for Phase 2
- iOS TestFlight and App Store review processes add 2–4 weeks to the launch timeline
- Our target demographic (₹20k–₹60k household income) is overwhelmingly on Android
- NRI users (who are more likely to be on iOS) are a Phase 2 target market anyway

**The risk:** We cannot capture iOS users until Phase 2. Given the Indian market composition, this is an acceptable trade-off.

---

## Consequences

- Expo build targets Android only in Phase 1: `eas build --platform android`
- Web app (Next.js) provides a fallback for iOS users who find the app — they can use the web version
- iOS-specific APIs (e.g. StoreKit for in-app purchases) deferred to Phase 2
- No iOS-specific UI testing in Phase 1. We will need a UI review pass before iOS launch.