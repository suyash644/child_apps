# ADR 009 — Admin Panel as Custom Next.js App

**Date:** 2026-05-09  
**Status:** Accepted  
**Deciders:** Founding team

---

## Context

The app requires non-technical content editors to add stories, quizzes, shlokas, and translations without touching the database directly. The admin panel must support:

- Creating and editing multilingual content (8 languages)
- Triggering audio generation after content is saved
- Managing user subscriptions and access
- Viewing basic engagement data

The audience is internal — content writers and translators, not developers.

---

## Decision

We will build the admin panel as a **custom Next.js 14 app** (`apps/admin/`) deployed on Vercel, authenticated via Supabase Auth with an `is_admin` role flag.

---

## Rationale

**Options evaluated:**

| Option | Pros | Cons |
|--------|------|------|
| Supabase Table Editor (built-in) | Zero build cost | No custom workflows, raw JSON editing, no audio trigger, no role separation |
| Retool / Appsmith (no-code) | Fast to set up | $10–50/user/month, not self-hostable, limited multilingual field UX |
| Custom Next.js app | Full control over UX, multilingual editor, audio trigger button, free to host | Takes 1–2 weeks to build initial version |
| Directus / Payload CMS | Headless CMS with admin UI out of the box | Schema must match our existing Supabase tables — migration complexity too high |

**Why custom Next.js over no-code tools:**

The multilingual JSONB fields (see ADR 004) require a custom editor component — a single form with 8 language tabs per field. No-code tools cannot render this without hacks. The "Generate Audio" trigger (see ADR 005) requires calling a Supabase Edge Function after save — a workflow no off-the-shelf CMS supports natively without custom plugins.

Next.js was already chosen for the web app, so we have no new tooling to learn. The admin app shares the `packages/shared/` types and Supabase client configuration.

**Why not a separate admin auth system:**

Supabase Auth is already integrated. We add an `is_admin` boolean column to the `profiles` table and enforce it at both the RLS policy level and in middleware. No second auth system to maintain.

---

## Consequences

- Admin panel is deployed separately from the web app at `admin.dharmaseeho.com`.
- A Supabase RLS policy blocks all admin-only tables for users where `is_admin = false`.
- Next.js middleware redirects unauthenticated requests to `/login` before any page renders.
- The initial admin build scope is: story CRUD, quiz CRUD, translation tab per language, and the Generate Audio button. User management and analytics views come in Phase 2.
- Admin app is not public — no SEO, no public routes.

---

## Related ADRs

- [ADR 002](002-supabase-as-backend.md) — Supabase Auth and RLS underpin admin authentication
- [ADR 004](004-multilingual-json-columns.md) — JSONB multilingual fields drive the admin editor UI design
- [ADR 005](005-pre-generated-audio.md) — Audio generation is triggered from the admin panel
- [ADR 010](010-content-workflow.md) — Content lifecycle states managed in the admin panel
- [ADR 011](011-admin-rbac.md) — Role separation enforced within the admin panel
