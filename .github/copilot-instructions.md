# Copilot Workspace Instructions

You are working in the vocabs repository.

## Project Context
- Mobile app lives in `apps/mobile`.
- Stack: Expo Router, React Native, Tamagui, Zustand, Reanimated.
- Architecture notes live in `docs/ARCHITECTURE.md`.

## Coding Rules
- Keep changes focused and small.
- Preserve existing file structure and naming conventions.
- Prefer strict TypeScript-safe changes.
- Do not introduce transliteration field unless explicitly requested.
- Keep UI copy in English unless explicitly requested otherwise.

## Validation
For code changes in `apps/mobile`, run:
1. `npm run typecheck`
2. `npm run lint`

Run commands from `apps/mobile`.

## Git Hygiene
- Never rewrite history unless explicitly asked.
- Do not revert unrelated user changes.
- Use clear, conventional commit messages.
