# ADR 004 — Multilingual Content via JSON Columns

**Date:** 2025-05-02  
**Status:** Accepted  
**Deciders:** Founding team

---

## Context

The app targets 8 languages. Every piece of user-facing text — story titles, slide content, quiz questions, badge names, shloka meanings — must be available in each supported language. We need a data model that handles this without becoming a maintenance burden.

---

## Decision

We will store multilingual text as **JSONB columns** on each content table, keyed by language code.

```sql
-- Example: title column on stories table
title JSONB  -- { "hi": "राम और रावण", "en": "Rama & Ravana", "gu": "..." }
```

---

## Rationale

**Options considered:**

**Option A: Separate translation table**
```sql
-- stories table
id, category, age_group, ...

-- story_translations table  
story_id, language_code, title, description
```
Standard i18n pattern. Clean normalisation. But requires a JOIN on every content fetch, and adds complexity to the admin panel (two tables to update per story).

**Option B: Separate column per language**
```sql
title_hi, title_en, title_gu, title_mr, title_ta, title_te, title_bn, title_kn
```
Adding a new language requires an ALTER TABLE migration. Eight columns per text field becomes unwieldy quickly. Rejected immediately.

**Option C: JSONB column per field (chosen)**
```sql
title JSONB  -- { "hi": "...", "en": "...", "gu": "..." }
```
One column, one query, no joins. Adding a new language requires no schema change — just populate the new key. The admin panel writes to one field. The app reads with a simple helper: `getText(row.title, userLang)`.

**Trade-offs accepted:**

- JSONB columns cannot be indexed on a specific language key without a functional index. For our access patterns (fetch story by ID, filter by category/age_group), we never filter on translated text, so this is not a concern.
- No foreign-key enforcement on language codes inside JSON. We enforce valid language codes at the application layer and admin panel validation.
- PostgreSQL `jsonb_pretty` makes the admin panel readable without additional tooling.

---

## Consequences

- Every content query returns full multilingual JSON. The client picks the correct language with `getText(field, lang)`.
- Fallback chain: `field[userLang] ?? field['hi'] ?? field['en'] ?? ''`. Hindi is always the source language and is always populated first.
- New languages in Phase 2 require no migrations — only content population via the admin panel.
- Supabase's built-in table editor renders JSONB as an expandable object, making manual edits feasible without a custom UI.
