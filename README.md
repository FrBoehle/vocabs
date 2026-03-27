# vocabs

Cross-platform Assyrian language tutor built with React Native and Tamagui.

## Current status

Initial implementation is in place:
- Expo-managed React Native setup for Android-first iteration.
- Tamagui-powered UI foundation with custom theme tokens.
- Dashboard tab with progress metrics.
- Study tab with animated index cards:
  - Tap-to-flip front/back.
  - Swipe right for learned well.
  - Swipe left for review again.
  - Red/green swipe affordances.
- Settings tab with demo progress reset.
- Demo Assyrian vocabulary dataset.
- Strict TypeScript and working lint/typecheck scripts.

## Project structure

- `apps/mobile`: mobile app code.
- `docs/ARCHITECTURE.md`: architecture and extension strategy.

## AI-ready setup

This repository includes AI customization files for consistent agent behavior:
- `.github/copilot-instructions.md`: workspace-wide coding guidance.
- `.github/instructions/mobile-app.instructions.md`: file-scoped rules for `apps/mobile`.
- `.github/prompts/mobile-release-check.prompt.md`: reusable release-readiness prompt.
- `.github/skills/mobile-feature-workflow/SKILL.md`: reusable feature delivery workflow.

## Local development (macOS + Android)

Prerequisites:
- Node.js 20+
- Android Studio with emulator OR Android phone with USB debugging

Run:

```bash
cd apps/mobile
npm install
npm run android
```

Fast iteration tips:
- Keep Metro running; use Fast Refresh on save.
- Use emulator or connected Android device via ADB for immediate updates.
- Avoid rebuilding APK during daily development.
- Build APK only for milestone testing and release candidates.

Useful commands:

```bash
cd apps/mobile
npm run start
npm run android
npm run typecheck
npm run lint
```
