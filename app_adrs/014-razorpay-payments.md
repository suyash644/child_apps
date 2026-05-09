# ADR 014 — Razorpay for Indian Payment Processing

**Date:** 2026-05-09  
**Status:** Accepted  
**Deciders:** Founding team

---

## Context

We need a payment gateway to handle Indian rupee subscriptions (₹99/month, ₹799/year, ₹499 lifetime) and eventually USD payments for NRI users. The gateway must support:

- UPI (mandatory — largest payment method in India)
- Recurring subscriptions with auto-debit
- In-app purchase flow compatible with React Native
- Webhook events for payment success/failure (to activate premium in Supabase)
- Low failure rate on Indian banking infrastructure

---

## Decision

We will use **Razorpay** for all INR payments. NRI USD payments are handled via **Play Store and App Store in-app purchases** (not Razorpay), to comply with Google and Apple's payment policies for in-app content.

---

## Rationale

**Indian payment gateway comparison:**

| Gateway | UPI | Subscriptions | RN SDK | Failure rate | Settlement |
|---------|-----|--------------|--------|-------------|------------|
| Razorpay | ✅ All UPI apps | ✅ Recurring mandate | ✅ Official | Low | T+2 days |
| Cashfree | ✅ | ✅ | ⚠️ Community | Low | T+2 days |
| PayU | ✅ | ✅ | ⚠️ Outdated | Medium | T+3 days |
| PhonePe Gateway | ✅ | ❌ No subscriptions | ❌ No RN SDK | Low | T+3 days |
| Stripe | ❌ No UPI | ✅ | ✅ Official | Low | T+7 days (India) |
| Instamojo | ✅ | ❌ | ❌ | Medium | T+3 days |

**Why Razorpay:**

Razorpay has the best React Native SDK, official subscription (recurring mandate) support for UPI AutoPay, and the lowest observed payment failure rate on Indian networks based on published EdTech benchmarks. It is the dominant gateway for Indian consumer apps (BYJU'S, Vedantu, Unacademy all use Razorpay).

**Why not Stripe:**

Stripe's international card support is excellent but UPI is not supported. Our Phase 1 users are Indian families — UPI is their primary payment method. Stripe's India settlement takes up to 7 days vs. Razorpay's 2 days, which matters for cash flow.

**Why Play Store / App Store for NRI:**

Apple and Google mandate that in-app purchases within iOS and Android apps use their native payment systems. Routing NRI users through Razorpay for in-app purchases would violate both store policies and risk app removal. Play Store and App Store pricing handles USD → INR conversion automatically for NRI users.

**Webhook architecture:**

Razorpay sends payment events (success, failure, subscription renewal, cancellation) to a Supabase Edge Function endpoint. The Edge Function verifies the Razorpay webhook signature, then updates the `subscriptions` table. This means premium activation is server-driven, not client-driven — a client cannot fake a successful payment.

---

## Consequences

- Razorpay account requires GST registration. Business registration must be completed before enabling live payments.
- `react-native-razorpay` package integrated in the mobile app. This package is within Expo managed workflow compatibility (no native module ejection needed).
- Supabase Edge Function `handle-razorpay-webhook` handles all payment events. Razorpay webhook secret is stored in Supabase Vault, not in environment variables.
- Test mode is active until Phase 1 launch. All development and QA uses Razorpay test credentials.
- Razorpay charges 2% per transaction (no monthly fee). At ₹99/month with 500 subscribers, that is ₹990/month in fees — acceptable.
- NRI in-app purchases via Play Store incur Google's 15–30% commission. This is priced into the NRI tier ($4.99 vs ₹99 equivalent at ~₹415).

---

## Migration Path

If Razorpay pricing becomes unfavourable at scale (>10,000 subscribers), Cashfree is the closest alternative with comparable UPI subscription support. The webhook handler and subscription table schema are gateway-agnostic; only the SDK and webhook signature verification would change.

---

## Related ADRs

- [ADR 006](006-freemium-model.md) — Defines the pricing tiers and activation timeline that Razorpay implements
- [ADR 002](002-supabase-as-backend.md) — Edge Functions handle Razorpay webhook verification and subscription state updates
