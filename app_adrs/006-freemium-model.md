# ADR 006 — Freemium Monetization Model

**Date:** 2025-05-02  
**Status:** Accepted  
**Deciders:** Founding team

---

## Context

We need a monetization strategy that works at small scale (Phase 1: ~500 users) but can scale to ₹10L+/month revenue. We are targeting both Indian families (price-sensitive) and NRI families (willing to pay premium).

---

## Decision

We will use a **freemium model** with multiple paid tiers activated progressively as the product matures.

| Tier | Price | Activation |
|------|-------|-----------|
| Free | ₹0 | Day 1 — always |
| Premium Individual | ₹99/month or ₹799/year | Month 4 |
| One-time Lifetime | ₹499 (1 child) | Month 5 |
| NRI Premium | $4.99/month | Month 6 |
| School License | ₹500/student/year | Month 9+ |

---

## Rationale

We are not activating paid tiers until Month 4 deliberately. The first 3 months are for building habit and word-of-mouth. Charging too early (before the product is good enough to retain users) creates refund requests and negative reviews that damage Play Store ranking.

**Why not a pure free model (ad-supported):**

Ads in a children's app create regulatory risk (COPPA) and brand damage. Advertisers targeting children's apps are typically toy and junk food brands — misaligned with our product values. Supabase free tier is sufficient until we have paying users, so we do not need ad revenue to survive Phase 1.

**Why not a paid-only model:**

Indian parents will not pay for an app they have not tried with their child. The free tier is the trial. Our target conversion rate is 8–10% of MAU to premium — consistent with B2C EdTech benchmarks (BYJU'S, Vedantu started similar).

**School licensing is deferred:**

School deals require a teacher dashboard, bulk account provisioning, and a sales process. This is a significant product investment that is only viable once we have a stable consumer product and social proof.

---

## Consequences

- Free content must be genuinely good — not a crippled trial. 3 full stories and 2 complete games are free forever.
- Premium gate is on breadth (more languages, more stories) not on core experience quality.
- Razorpay integrated for Indian payments. Stripe considered and rejected — worse UPI support.
- NRI pricing in USD handled via Play Store and App Store regional pricing, not Razorpay.