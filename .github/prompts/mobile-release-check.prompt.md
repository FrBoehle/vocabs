---
mode: ask
description: "Run a quick release-readiness check for the mobile app."
---

Check whether the mobile app is release-ready.

## Steps
1. Summarize relevant modified files in `apps/mobile`.
2. Run quality gates:
   - `npm run typecheck`
   - `npm run lint`
3. Confirm app naming and package values in `apps/mobile/app.json`.
4. Confirm EAS profiles in `apps/mobile/eas.json`.
5. Report:
   - Blocking issues
   - Non-blocking risks
   - Recommended next action
