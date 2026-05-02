# ADR 003 — Google Cloud TTS for Voice Narration

**Date:** 2025-05-02  
**Status:** Accepted  
**Deciders:** Founding team

---

## Context

Voice narration is the core differentiating feature of Dharma Seekho. Children (especially ages 3–6) cannot read, so the quality and naturalness of the voice directly affects engagement and retention. We need TTS that supports at minimum Hindi and English, and eventually all 8 target languages.

Budget constraint: Phase 1 audio generation budget is under ₹500 total.

---

## Decision

We will use **Google Cloud Text-to-Speech (Wavenet voices)** for Phase 1. We will evaluate ElevenLabs for Phase 2 if user feedback indicates voice quality is a retention blocker.

---

## Rationale

**Options evaluated:**

| Provider | Hindi support | Quality | Cost | All 8 langs |
|----------|--------------|---------|------|-------------|
| Google Cloud TTS (Wavenet) | ✅ hi-IN-Wavenet-D | Good | ₹0.33/1k chars | ✅ All 8 |
| ElevenLabs | ⚠️ Hindi via multilingual model | Excellent | ~$0.30/1k chars (~₹25) | ⚠️ Inconsistent |
| AWS Polly | ✅ Aditi (hi-IN) | Acceptable | $0.016/1k chars | ⚠️ 5 of 8 |
| Azure TTS | ✅ hi-IN-SwaraNeural | Very good | $0.016/1k chars | ✅ All 8 |
| OpenAI TTS | ❌ No Indian language voices | N/A | — | ❌ |

**Why Google over Azure (the closest alternative):**

Google's `hi-IN-Wavenet-D` voice is specifically tuned for Hindi storytelling. Azure Neural voices are competitive but Google's regional Indian language coverage (Tamil, Telugu, Kannada, Bengali) is more mature and has been in production longer. The Supabase + Google Cloud pairing also simplifies billing — both under one GCP project.

**Why not ElevenLabs in Phase 1:**

ElevenLabs produces the most natural-sounding voices, but at ~75× the cost per character. For Phase 1, we are generating ~31,000 characters across 20 stories in 2 languages. Google cost: ~₹20. ElevenLabs cost: ~₹1,500. At scale this difference compounds. We will revisit ElevenLabs for character voices (Ganesh, Krishna, Hanuman having distinct personalities) in Phase 2 once we have subscription revenue.

---

## Implementation Note

Audio is **pre-generated and stored**, not generated at request time. See [ADR 005](005-pre-generated-audio.md) for that decision. This makes the per-character cost a one-time expense, not a per-play cost.

---

## Consequences

- Google Cloud project required. TTS API must be enabled.
- Service account key (`gcloud-key.json`) stored securely, never committed to git.
- First 1 million characters per month are free on Google TTS. Our Phase 1 volume (~62,000 chars total) is entirely within free tier.
- Voice quality will be "good" not "excellent". Acceptable for MVP. We track user feedback explicitly on voice quality in Phase 1 surveys.

---

## Review Trigger

Revisit this decision if: (a) user retention surveys cite voice quality as a top-3 concern, or (b) monthly revenue exceeds ₹1L (at which point ElevenLabs cost is < 2% of revenue).
