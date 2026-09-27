<!-- Title: <type>(<scope>): <subject>   e.g. fix(taca): reload cup data when switching seasons -->

## Summary

<!-- What does this PR do and why? 1–3 sentences. -->

## Plan step / backlog

<!-- e.g. Plan 0.2.1 · B1   (docs/IMPLEMENTATION_PLAN.md · docs/02_IMPROVEMENTS.md) -->

## Type

- [ ] feat
- [ ] fix
- [ ] ui
- [ ] refactor / perf
- [ ] db
- [ ] docs / chore / test

## Changes

<!-- Bullet list of the main changes. -->
-

## Screenshots (UI changes)

| Mobile (360–390 px) | Desktop |
|---|---|
| before / after | before / after |

## Database

- [ ] No database changes
- [ ] SQL: `docs/db/NN_….sql` (+ rollback `docs/db/NN_…_rollback.sql`)
- [ ] Applied to staging
- [ ] Applied to production on: <!-- YYYY-MM-DD, after review -->
- [ ] `src/types/database.types.ts` regenerated

## Checklist

- [ ] Branch created from latest `main`, named `<type>/<step>-<description>`
- [ ] `npm run build` passes
- [ ] `npm run lint` — no new warnings
- [ ] `npm test` passes (once tests exist)
- [ ] Tested on a real phone via the Vercel Preview URL
- [ ] Checked at 360 / 390 / 768 / 1440 px (UI changes)
- [ ] No hardcoded season, no `window.innerWidth`, UI strings in `constants/const.js` (new code)
- [ ] Step ticked in `docs/IMPLEMENTATION_PLAN.md`

## Notes for the reviewer

<!-- Anything to look at carefully, follow-ups, known limitations. -->
