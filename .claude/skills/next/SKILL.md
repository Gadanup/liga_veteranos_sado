---
name: next
description: Tell the user what to work on next in Liga Veteranos do Sado — reads docs/ROADMAP.md (the only status tracker), checks git/GitHub for what is actually merged or in progress, flags drift, and proposes the next item. Use for "what's next", "o que faço a seguir", "where are we", "/next".
---

# What's next?

`docs/ROADMAP.md` is the **only** status tracker. Answer from it, but verify it against reality first — never trust it blindly.

## 1. Read the state
- `docs/ROADMAP.md`: NOW (with owners), NEXT (ordered), Blocked, DONE.
- Reality:
  - `git fetch -q origin` then `git log --oneline -15 origin/main`
  - `gh pr list --state open --json number,title,author,headRefName`
  - `gh pr list --state merged --limit 15 --json number,title,mergedAt`
  - current branch + `git status --short` (unfinished local work?)

## 2. Detect drift (report it, fix only if asked)
- A NOW/NEXT item already merged → should be in DONE.
- A merged PR that is not in DONE → missing entry.
- An open PR whose item is not in NOW → someone is working on something untracked.
- NOW has more than 2 items for one person, or an item with no owner.
- A Blocked question that was answered in the conversation or in a merged PR.

If there is drift, offer a small `docs(roadmap): …` PR (via `/ship`) that fixes ROADMAP.md.

## 3. Answer — short, in this shape
```
You're on:   <user's NOW item(s), or "nothing in NOW">
In progress: <open PRs, who>
Next:        <the top NEXT item this user can take — why it's next>
Blocked:     <only questions this user can answer>
Drift:       <mismatches found, or "none">
```
- Ask who the user is (Claudio / Ricardo) only if it can't be inferred (git user, PR author).
- If the user's NOW is empty, propose pulling the top NEXT item into NOW (and offer to update ROADMAP.md).
- If the next item touches the database, remind them: **backup first** (schema dump → git, data dump → private folder), see `CONTRIBUTING.md` §5.
- Point to the details: backlog ID → `docs/backlog.md`, step → the relevant `docs/reference/` doc.
