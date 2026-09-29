# Docs — start here

**What do I do next?** → open [`ROADMAP.md`](ROADMAP.md) and look at **NOW**. Or run `/next` in Claude Code.

That is the only file that tracks status. Everything else below explains *how* or *why* — none of it is a to-do list.

| File | What it is | When to open it |
|---|---|---|
| [`ROADMAP.md`](ROADMAP.md) | **Status**: NOW · NEXT · Blocked · LATER (phases/steps) · DONE · Decisions | Every time you start working |
| [`backlog.md`](backlog.md) | Details of every item (`B1`, `M3`, `N2`…): problem, evidence, fix, risk | When you pick an item and need the details |
| [`reference/app-overview.md`](reference/app-overview.md) | How the app works: routes, stack, data model, security, target code structure (§9) | Before any non-trivial change |
| [`reference/design-direction.md`](reference/design-direction.md) | Why and where the UI is going (look & feel, navigation) | Before UI/redesign work |
| [`reference/screen-specs.md`](reference/screen-specs.md) | Exact spec of every screen and shared component, per-screen done criteria | When building a screen (Phase 4) |
| [`reference/data-entry.md`](reference/data-entry.md) | How season setup, players, transfers, fixtures and results should become easier | Before admin-area / DB model work |
| [`db/`](db/) | SQL scripts (numbered, each with rollback/check) and DB snapshots | Before any database change |
| [`archive/`](archive/) | Superseded docs, kept for history | Rarely |

Outside `docs/`: [`../CONTRIBUTING.md`](../CONTRIBUTING.md) (branches, commits, PRs, DB change rules) · [`../CLAUDE.md`](../CLAUDE.md) (rules for Claude).

## The workflow in four lines

1. `ROADMAP.md` → NOW → take your item (max 2 per person).
2. Details from `backlog.md` / `reference/`.
3. Branch + PR per [`CONTRIBUTING.md`](../CONTRIBUTING.md) — Claude: `/ship`.
4. The same PR moves the item to **DONE** in `ROADMAP.md`. When NOW is empty, pull from NEXT.
