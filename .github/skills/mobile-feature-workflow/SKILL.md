---
name: mobile-feature-workflow
description: "Use when implementing or refactoring mobile features in apps/mobile, including UI changes, store updates, and validation."
---

# Mobile Feature Workflow

Use this workflow for feature work in `apps/mobile`.

## 1. Locate Impacted Areas
- Find screen-level changes in `app/(tabs)` or other route files.
- Find state/domain impact in `src/features` and `src/domain`.
- Check if copy/config updates are needed in `app.json`, `README.md`, or docs.

## 2. Implement Minimal Change
- Keep edits scoped to the requested behavior.
- Prefer updating existing components over introducing new abstractions.
- Maintain current naming and style conventions.

## 3. Validate
From `apps/mobile` run:
- `npm run typecheck`
- `npm run lint`

## 4. Report Clearly
Include:
- What changed
- Which files were touched
- Validation outcome
- Any follow-up suggestion
