# ADR 002 — Supabase as Backend

**Date:** 2025-05-02  
**Status:** Accepted  
**Deciders:** Founding team

---

## Context

We need a backend that provides: relational database, authentication (phone OTP), file storage (audio/images), row-level security, and an API layer — all without a dedicated backend engineer in Phase 1.

---

## Decision

We will use **Supabase** as our backend platform (PostgreSQL + Auth + Storage + Edge Functions).

---

## Rationale

The core constraint is that we have no dedicated backend engineer in Phase 1. We need a platform that gives us production-grade infrastructure with minimal ops overhead.

**Why Supabase over Firebase:**

| Criteria | Supabase | Firebase |
|----------|----------|----------|
| Database | PostgreSQL — relational, supports complex queries for leaderboards, progress analytics | Firestore — document model, complex queries are painful |
| Row-level security | ✅ Native RLS policies in SQL | ❌ Security rules are a separate DSL, harder to reason about |
| Schema migrations | ✅ SQL migrations, version controlled | ❌ Schema-less, migrations are manual |
| Free tier generosity | ✅ 500MB DB, 5GB storage, 50k MAU | ⚠️ Spark plan limits are tighter |
| Self-hostable | ✅ Can move to self-hosted if costs rise | ❌ Vendor locked |
| SQL familiarity | ✅ Standard SQL | ❌ Custom query syntax |

**Why not a custom Node.js + PostgreSQL backend:**

Building and maintaining our own API server requires a backend engineer and ops work (server provisioning, SSL, scaling). Supabase handles all of this. The trade-off is some vendor lock-in, which we accept at this stage.

---

## Consequences

- All database schema changes go through versioned SQL migration files in `supabase/migrations/`.
- Row-level security policies enforce data isolation — a parent can only read their own children's data, even if the anon key is exposed client-side.
- Supabase free tier supports ~50,000 active users before we hit limits. At that scale we will have revenue to cover the Pro plan (~$25/month).
- Edge Functions (Deno) handle webhooks (Razorpay payment events, badge triggers) without a separate server.

---

## Migration Path

If Supabase pricing becomes prohibitive at scale, the PostgreSQL database can be exported and moved to a self-hosted Supabase instance or a managed PostgreSQL service (Neon, RDS). The application code talks to standard PostgreSQL — no Supabase-specific query syntax in the data layer.
