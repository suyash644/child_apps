# ADR 010 — Content Workflow: Draft → Review → Published

**Date:** 2026-05-09  
**Status:** Accepted  
**Deciders:** Founding team

---

## Context

Content editors and translators will create stories, quizzes, and shlokas inside the admin panel. We need a defined lifecycle so that:

- Incomplete or unreviewed content never reaches users
- Audio is only generated for content that is approved and final (not wasted on drafts)
- Editors can work on content in parallel without stepping on each other

---

## Decision

All content tables will carry a `status` column with three states: `draft`, `review`, `published`. Only `published` rows are returned to the mobile/web app.

```sql
status TEXT NOT NULL DEFAULT 'draft'
  CHECK (status IN ('draft', 'review', 'published'))
```

---

## Rationale

**Why three states, not two (draft / published):**

Two states work until a second content editor joins. Without a `review` state, a content editor either publishes directly (risky) or the developer has to manually check before publishing (bottleneck). The `review` state lets an editor signal "this is ready for approval" without giving them publish rights.

**Why not a full CMS-style versioning system:**

Version history (storing every edit) adds significant schema complexity and is not needed at Phase 1. The risk of a bad edit going live is low because only admins can publish, and Supabase table backups cover disaster recovery. We can add versioning in Phase 3 if content editors frequently need to roll back.

**Audio generation is gated on `published` status:**

Running the TTS script on draft content wastes money and storage. The "Generate Audio" button in the admin panel is only enabled when `status = 'published'`. If published content is later edited, the button re-enables and shows a warning: "Audio may be out of sync — regenerate?"

**Workflow per role (see ADR 011):**

| Action | Content Editor | Translator | Super Admin |
|--------|---------------|------------|-------------|
| Create draft | ✅ | ✅ (lang fields only) | ✅ |
| Move to Review | ✅ | ✅ | ✅ |
| Move to Published | ❌ | ❌ | ✅ |
| Delete content | ❌ | ❌ | ✅ |

---

## Consequences

- All Supabase RLS policies for the mobile/web app include `WHERE status = 'published'` — draft content is invisible to end users regardless of client-side code.
- The admin panel shows all three states. The mobile app never queries draft or review rows.
- When a published story's text is edited, its `status` is automatically reset to `review` to force re-approval and audio regeneration. This is enforced by a Supabase database trigger.
- Content editors are notified (via admin panel badge, not email in Phase 1) when their submitted content is approved or sent back.

---

## Related ADRs

- [ADR 005](005-pre-generated-audio.md) — Audio generation is triggered only after content reaches `published` state
- [ADR 009](009-admin-panel-nextjs.md) — The admin panel UI surfaces the status workflow
- [ADR 011](011-admin-rbac.md) — Roles determine who can transition between states
