# Architecture

## Goals

- Keep feature growth easy as new learning modes are added.
- Preserve high code quality with strict typing and clear boundaries.
- Enable fast Android-first development without expensive rebuild cycles.

## Layers

- `app/`: Expo Router routes and screen composition.
- `src/features`: feature modules (cards, dashboard, settings).
- `src/domain`: framework-agnostic language learning logic.
- `src/data`: demo and seed data sources.
- `src/core`: cross-cutting providers and shared infrastructure.

## Core design choices

- Expo-managed workflow for fast iteration and future iOS support.
- Tamagui as design system + shared tokens.
- Zustand for local app state and predictable state transitions.
- Reanimated + Gesture Handler for performant card animations.

## Extension path

Near-term:
- Add persistence repository with Expo SQLite for durable progress.
- Add progress history snapshots for richer dashboard charts.
- Add i18n namespace split for English and Assyrian UI strings.

Mid-term:
- Introduce new learning modes while reusing the same domain scheduling layer.
- Add optional cloud sync abstraction without coupling to UI.

## Quality gates

- `npm run typecheck`
- `npm run lint`
- CI workflow should run both for all PRs.
