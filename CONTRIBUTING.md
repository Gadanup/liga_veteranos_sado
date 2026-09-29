# Contributing — Liga Veteranos do Sado

Conventions for branches, commits and pull requests, so the history of `main` reads like a changelog.
Applies to everyone (and to Claude — see `.claude/skills/ship/`).

---

## 1. Workflow

```
main  ──●────────────●────────────●──   (always deployable — Vercel Production)
         \          /              \
          feat/1.3.3-app-shell ─●─●    fix/0.2.1-taca-season-key …
                   (Vercel Preview per PR)
```

1. Always start from the latest `main`:
   `git switch main && git pull` → `git switch -c <branch>`
2. One plan step (or one bug) per branch/PR. Keep PRs small — easier to review and to test on a phone.
3. Push, open a PR into `main` using the template, test the **Vercel Preview URL on a real phone**.
4. **Squash and merge** (the PR title becomes the single commit on `main`). Delete the branch after merge.
5. Never push directly to `main`.

---

## 2. Branch names

```
<type>/<plan-step>-<short-description>
<type>/<short-description>              ← when there's no plan step
```
- lowercase, words separated by `-`, English, ≤ 50 chars
- `<plan-step>` = step number from `docs/ROADMAP.md` (e.g. `1.3.3`)

| Type | Use for | Example |
|---|---|---|
| `feat/` | new feature / screen / admin tool | `feat/3.2.1-new-season-wizard` |
| `fix/` | bug fix | `fix/0.2.1-taca-season-key` |
| `refactor/` | code change without behaviour change | `refactor/1.2.5-standings-utils` |
| `ui/` | visual/redesign or mobile layout work | `ui/4.1-classificacao` |
| `db/` | SQL migrations, policies, triggers (`docs/db/`) | `db/2.2.1-standings-triggers` |
| `docs/` | documentation only | `docs/project-audit` |
| `chore/` | deps, config, tooling, photos/assets | `chore/0.3.1-remove-unused-deps` |
| `test/` | tests only | `test/discipline-rules` |

---

## 3. Commit messages — Conventional Commits

```
<type>(<scope>): <subject>

<body — optional: what and WHY, wrapped at ~72 chars>

<footer — optional: Plan: 1.3.3 · Refs: B1, M3 · BREAKING CHANGE: …>
```

**Rules**
- `type` from the list below; `scope` from the scope list (optional but encouraged).
- `subject`: English, **imperative** ("add", "fix", not "added", "fixes"), lowercase start, no final period, ≤ 72 chars.
- One logical change per commit. "Update", "Changes", "Quick fix" are not valid subjects.
- UI copy in Portuguese can appear in the subject when it names a screen: `feat(liga): add "Comparar equipas" dialog`.

| Type | Meaning |
|---|---|
| `feat` | new user-visible feature |
| `fix` | bug fix |
| `ui` | visual / layout / mobile change, no new feature |
| `refactor` | code restructure, same behaviour |
| `perf` | performance |
| `db` | database migration / policy / trigger / function |
| `test` | add or update tests |
| `docs` | documentation |
| `chore` | deps, config, build, assets (photos, logos) |
| `revert` | revert a previous commit |

**Scopes**: `liga` · `taca` · `supertaca` · `jogo` · `equipa` · `marcadores` · `disciplina` · `galeria` · `historico` · `info` · `admin` · `layout` · `ui-kit` · `theme` · `api` · `db` · `auth` · `deps` · `assets` · `docs` · `claude`

**Examples**
```
fix(taca): reload cup data when switching between seasons of the same format

LeagueCupView/KnockoutCupView copied the season prop into state on mount,
so the view kept the previous season's data.

Plan: 0.2.1
Refs: B1
```
```
db(disciplina): recalculate league standings when a match is deleted
chore(assets): add photos for Amarelos 2026/27 signings
feat(admin): add bulk player import with team matching
```

Commits created with Claude end with the line `Co-Authored-By: Claude …` (added automatically).

**Optional:** use the commit template in your terminal:
`git config commit.template .gitmessage`

---

## 4. Pull requests

**Title** = same format as a commit subject (it becomes the squash commit):
`feat(admin): add new season wizard` · `fix(taca): reload data on season switch`

**Body** = `.github/pull_request_template.md` (GitHub fills it automatically). Required parts:
- **Summary** — what and why, 1–3 sentences.
- **Plan step / backlog** — e.g. `Plan 0.2.1 · B1`.
- **Screenshots** for any UI change: mobile (360–390 px) and desktop, before/after.
- **Database** — SQL file(s) in `docs/db/`, backup taken? applied to production (date)? rollback file?
- **Checklist** — build, lint, tests, phone test on Vercel Preview.

**Review**
- At least one look from the other person before merging (self-merge allowed for `docs/`, `chore(assets)` and urgent `fix/`).
- The author moves the item from **NOW** to **DONE** in `docs/ROADMAP.md` in the same PR (date · what · PR number). `ROADMAP.md` is the only status tracker — see `docs/README.md`.
- Database scripts are run **after** review, and noted in the PR ("applied to production on YYYY-MM-DD").

---

## 5. Database changes

- One numbered file per change in `docs/db/`: `NN_short_name.sql` + `NN_short_name_rollback.sql` (+ optional `NN_verify_*.sql`).
- **Back up first** (no staging project — decision 2026-09-29): before any critical change, dump the schema and commit it (`npx supabase db dump -f supabase/schema.sql`), and dump the data to a **private folder outside the repo** (`npx supabase db dump --data-only -f <private-folder>/liga_data_YYYY-MM-DD.sql`). Data dumps never go in git — the repo is public and they contain personal data.
- Every script: one transaction, a rollback file, a check query; for trigger/function changes, a verify script that rolls itself back (like `02_verify_security.sql`). Run via the Supabase SQL Editor, never from local scripts. Avoid match days.
- After running it, dump the schema again so `supabase/schema.sql` in the PR shows the change.
- After a schema change: `npx supabase gen types typescript --project-id dmsocybvdzdzafpemybt --schema public > src/types/database.types.ts` and commit it in the same PR.
- New tables must get RLS with `public_read` + `admin_write` policies (see `docs/db/01_security_fix.sql`).

---

## 6. Recommended GitHub settings (repo owner)

Settings → General → Pull Requests: ✅ Allow squash merging (default: PR title + description) · ❌ merge commits · ✅ Automatically delete head branches.
Settings → Branches → rule for `main`: require a pull request before merging.
