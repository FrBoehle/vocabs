---
description: "Use when editing the Expo mobile app in apps/mobile (UI, state, navigation, and config)."
applyTo: "apps/mobile/**/*.{ts,tsx,js,json}"
---

## Mobile App Instruction Set

### Structure
- UI screens: `apps/mobile/app/**`
- Business/domain logic: `apps/mobile/src/domain/**`
- Feature logic/state: `apps/mobile/src/features/**`
- App providers/core infra: `apps/mobile/src/core/**`

### Preferred Patterns
- Keep domain logic framework-agnostic in `src/domain`.
- Keep screen components mostly compositional.
- Put shared state updates in Zustand store actions.
- Preserve existing Tamagui usage and token-driven styles.

### UI/UX Constraints
- Keep interactions responsive on mobile.
- Avoid adding heavy dependencies for small UI needs.
- Reuse existing components before creating new ones.

### Required Checks
After edits touching `apps/mobile`:
- `npm run typecheck`
- `npm run lint`
