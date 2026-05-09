# ADR 011 — Admin Role-Based Access Control (RBAC)

**Date:** 2026-05-09  
**Status:** Accepted  
**Deciders:** Founding team

---

## Context

The admin panel will be used by people with different responsibilities — a content writer should not be able to delete stories or access payment data. A translator should only see language fields, not game configuration. As the content team grows, uncontrolled access creates both accidental-damage risk and data-privacy risk.

---

## Decision

We will define **four admin roles** stored in a `admin_role` column on the `profiles` table. Permissions are enforced at two layers: Supabase RLS policies (data layer) and Next.js middleware (UI layer).

```sql
admin_role TEXT CHECK (admin_role IN (
  'super_admin',
  'content_manager',
  'translator',
  'analytics_viewer'
))
```

A `NULL` value means the user is a regular app user with no admin access.

---

## Rationale

**Why four roles:**

| Role | Who holds it | What they can do |
|------|-------------|-----------------|
| `super_admin` | Founder / lead dev | Everything — publish, delete, manage users, view payments |
| `content_manager` | Content writer | Create/edit stories, quizzes, shlokas; submit for review; trigger audio generation |
| `translator` | Language specialist | Edit only the language-keyed fields of published/review content for their assigned language |
| `analytics_viewer` | Growth / marketing | Read-only access to engagement dashboards; no content or user data |

A translator having write access to game configuration or badge data would be dangerous. A content manager seeing subscription payment records is a privacy concern. Separating roles prevents both.

**Why not Supabase's built-in role system:**

Supabase's built-in roles (`postgres`, `authenticated`, `service_role`) are infrastructure roles, not application roles. Mixing application-level permissions into Postgres roles creates confusion and limits our ability to add fine-grained rules later. A column on `profiles` is readable by our RLS policies and by the Next.js middleware — one source of truth.

**Enforcement at two layers:**

RLS alone is not enough — a misconfigured query could still leak data. The Next.js middleware checks `admin_role` on every request and redirects unauthorised users before the page loads. Both layers must agree for access to be granted.

---

## Consequences

- `profiles` table gains `admin_role TEXT` and `admin_role_langs TEXT[]` columns. The `admin_role_langs` array limits translators to specific language codes (e.g. `['ta', 'te']`).
- RLS policies on admin-facing tables check `auth.jwt() -> 'admin_role'` using Supabase's JWT custom claims.
- Super admin assignment is done directly via Supabase SQL — there is no self-serve way to escalate to `super_admin`.
- The admin panel shows/hides navigation sections based on role. A `translator` sees only the Translations section; an `analytics_viewer` sees only the Dashboard section.
- Role changes take effect on next login (JWT refresh).

---

## Related ADRs

- [ADR 002](002-supabase-as-backend.md) — RLS is the data enforcement layer for role checks
- [ADR 009](009-admin-panel-nextjs.md) — Admin panel Next.js middleware enforces roles at the UI layer
- [ADR 010](010-content-workflow.md) — Workflow state transitions are gated by role
