# Dharma Seekho 🕉️

A gamified learning platform for children to explore Sanatan Dharma through interactive games, voice-narrated stories, shlokas, and quizzes — available in 8 Indian languages across Android, iOS, and Web.

---

## Table of Contents

- [Overview](#overview)
- [Age Groups](#age-groups)
- [Languages](#languages)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Development](#development)
- [Deployment](#deployment)
- [ADRs](#adrs)
- [Contributing](#contributing)

---

## Overview

**Problem:** No quality app exists to teach Sanatan Dharma to children in a modern, engaging way.

**Solution:** Age-appropriate games, AI-narrated stories with word-level highlighting, shloka chanting, and quizzes — all in the child's mother tongue.

**Monetization:** Freemium (₹99/month India · $4.99/month NRI · ₹500/student/yr school license)

---

## Age Groups

| Group | Age | Focus |
|-------|-----|-------|
| Tiny Devotees | 3–6 | Visual games, voice-only stories, shloka chanting |
| Young Scholars | 7–11 | Word puzzles, epic timelines, quizzes, pair matching |
| Dharma Scholars | 11–15 | Gita wisdom scenarios, Sanskrit decoder, deep knowledge |

---

## Languages

| Code | Language | Script | Phase |
|------|----------|--------|-------|
| `hi` | Hindi | Devanagari | Phase 1 |
| `en` | English | Latin | Phase 1 |
| `gu` | Gujarati | Gujarati | Phase 2 |
| `mr` | Marathi | Devanagari | Phase 2 |
| `ta` | Tamil | Tamil | Phase 2 |
| `te` | Telugu | Telugu | Phase 2 |
| `bn` | Bengali | Bengali | Phase 3 |
| `kn` | Kannada | Kannada | Phase 3 |

All content fields are stored as multilingual JSON objects: `{ "hi": "...", "en": "...", "gu": "..." }`.

---

## Architecture

```
┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐
│  Mobile App     │   │  Web App        │   │  Admin Panel    │
│  React Native   │   │  Next.js 14     │   │  Next.js 14     │
│  Expo SDK 50    │   │  (same content) │   │  (content mgmt) │
└────────┬────────┘   └────────┬────────┘   └────────┬────────┘
         │                     │                     │
         └─────────────────────┼─────────────────────┘
                               │
                    ┌──────────▼──────────┐
                    │     Supabase        │
                    │  PostgreSQL + Auth  │
                    │  + Storage + RLS    │
                    └──────────┬──────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
    ┌─────────▼──┐   ┌────────▼──────┐   ┌─────▼──────────┐
    │ Google TTS │   │ Firebase FCM  │   │ Razorpay       │
    │ (voice)    │   │ (push notifs) │   │ (payments)     │
    └────────────┘   └───────────────┘   └────────────────┘
```

**Key decisions:** See [ADRs](#adrs) for rationale behind each major choice.

---

## Project Structure

```
dharma-seekho/
├── apps/
│   ├── mobile/          # React Native (Expo) app
│   │   ├── src/
│   │   │   ├── screens/
│   │   │   ├── components/
│   │   │   ├── navigation/
│   │   │   ├── lib/         # supabase.js, i18n.js, audio.js
│   │   │   └── hooks/
│   │   └── app.json
│   ├── web/             # Next.js web app (same Supabase backend)
│   └── admin/           # Next.js admin panel
├── packages/
│   └── shared/          # Shared types, constants, i18n helpers
├── supabase/
│   ├── migrations/      # SQL migration files
│   ├── functions/       # Edge functions
│   └── seed.sql         # Seed data (badges, game configs)
├── scripts/
│   └── generate-audio.js  # Google TTS batch audio generator
├── docs/
│   ├── adr/             # Architecture Decision Records
│   └── api/             # API reference
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- Expo CLI: `npm install -g expo-cli eas-cli`
- Supabase account (free tier)
- Google Cloud project with Text-to-Speech API enabled

### Setup

```bash
# 1. Clone and install
git clone https://github.com/your-org/dharma-seekho
cd dharma-seekho
npm install

# 2. Set up Supabase
# Create a project at supabase.com, then:
supabase link --project-ref YOUR_PROJECT_REF
supabase db push   # runs all migrations

# 3. Copy env file
cp apps/mobile/.env.example apps/mobile/.env
# Fill in SUPABASE_URL, SUPABASE_ANON_KEY, etc.

# 4. Run on phone
cd apps/mobile
npx expo start
# Scan QR with Expo Go
```

---

## Environment Variables

### Mobile (`apps/mobile/.env`)

```
EXPO_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJ...
EXPO_PUBLIC_RAZORPAY_KEY=rzp_live_...
```

### Audio generator (`scripts/.env`)

```
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJ...           # service role key, not anon
GOOGLE_APPLICATION_CREDENTIALS=./gcloud-key.json
```

---

## Development

```bash
# Mobile app
cd apps/mobile && npx expo start

# Admin panel
cd apps/admin && npm run dev

# Generate audio for new stories (run after adding content to DB)
cd scripts && node generate-audio.js --lang hi,en

# Run Supabase locally
supabase start
```

### Adding a new language

1. Add the language code to `language_enum` in `supabase/migrations/`
2. Add voice config to `scripts/generate-audio.js`
3. Add to `LANGUAGES` map in `packages/shared/i18n.ts`
4. Run audio generator for new lang: `node generate-audio.js --lang gu`
5. Translate content via Admin panel → Translations

---

## Deployment

### Mobile (Android)

```bash
cd apps/mobile
eas build --platform android --profile production
eas submit --platform android
```

### Mobile (iOS)

```bash
eas build --platform ios --profile production
eas submit --platform ios
```

### Web + Admin (Vercel)

Both Next.js apps deploy automatically on push to `main` via Vercel GitHub integration.

### Database migrations

```bash
supabase db push  # applies pending migrations to production
```

---

## ADRs

Architecture Decision Records live in `app_adrs/`. Each ADR documents a significant technical decision, its context, and the rationale.

| # | Title | Status |
|---|-------|--------|
| [001](001-react-native-over-flutter.md) | React Native over Flutter | Accepted |
| [002](002-supabase-as-backend.md) | Supabase as backend | Accepted |
| [003](003-google-tts-for-voice.md) | Google TTS for voice narration | Accepted |
| [004](004-multilingual-json-columns.md) | Multilingual JSON columns | Accepted |
| [005](005-pre-generated-audio.md) | Pre-generated audio over real-time TTS | Accepted |
| [006](006-freemium-model.md) | Freemium monetization model | Accepted |
| [007](007-android-first.md) | Android-first launch | Accepted |
| [008](008-expo-managed-workflow.md) | Expo managed workflow | Accepted |
| [009](009-admin-panel-nextjs.md) | Admin panel as custom Next.js app | Accepted |
| [010](010-content-workflow.md) | Content workflow: Draft → Review → Published | Accepted |
| [011](011-admin-rbac.md) | Admin role-based access control | Accepted |
| [012](012-analytics-strategy.md) | Analytics strategy: PostHog | Accepted |
| [013](013-offline-caching-strategy.md) | Offline and caching strategy | Accepted |
| [014](014-razorpay-payments.md) | Razorpay for Indian payment processing | Accepted |

---

## Contributing

This is a private project. Internal team only during Phase 1.

- Branch naming: `feat/`, `fix/`, `chore/`
- PRs require 1 review before merge to `main`
- All new content must go through the admin panel, not direct DB writes

---

## License

Private — All rights reserved © 2025 Dharma Seekho
