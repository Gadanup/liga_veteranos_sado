---
name: ship
description: Create a branch, commit and pull request for Liga Veteranos do Sado following CONTRIBUTING.md (branch naming, Conventional Commits, PR template). Use when the user says "commit", "open a PR", "ship this", "cria o PR".
---

# Ship changes (branch → commit → PR)

Follow `CONTRIBUTING.md` exactly. Only commit/push/open a PR when the user asked for it.

## 1. Branch
- If on `main` (or on an unrelated branch): `git fetch origin` → `git switch -c <type>/<step>-<desc> origin/main` → `git branch --unset-upstream` (so the first push creates the remote branch instead of targeting `main`).
- Name: `<type>/<plan-step>-<short-description>` — types `feat fix refactor ui db docs chore test`; step from `docs/IMPLEMENTATION_PLAN.md` when applicable.

## 2. Checks before committing
- `npm run build` passes; `npm run lint` shows no new warnings; `npm test` passes (if configured).
- Never stage: `.env*`, `supabase/.temp`, unrelated modified files (ask if unsure). Stage explicit paths, not `git add -A`.
- If the change completes a plan step, tick its checkbox in `docs/IMPLEMENTATION_PLAN.md`.

## 3. Commit
Conventional Commits: `<type>(<scope>): <subject>` — imperative, lowercase, no period, ≤ 72 chars. Body explains why; footer `Plan: x.y.z` / `Refs: B1`. Split unrelated changes into separate commits. Use a heredoc for the message and end with the Co-Authored-By line required by the session.

## 4. Pull request
- `git push -u origin <branch>`
- `gh pr create --base main --title "<type>(<scope>): <subject>" --body-file <tmp file>` with the body filled from `.github/pull_request_template.md`: Summary, Plan step/backlog, Type (tick), Changes, Screenshots (write "n/a" or ask the user for them on UI changes), Database (tick the right boxes), Checklist (tick only what was actually verified), Notes.
- End the PR body with the attribution line required by the session.
- Return the PR URL. Remind the user: test on the Vercel Preview URL on a phone, squash-merge.
