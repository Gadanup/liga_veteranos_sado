---
name: mobile-check
description: Review a page or component of Liga Veteranos do Sado for mobile problems against the project's mobile rules, and propose minimal fixes. Use for "check mobile", "isto está partido no telemóvel", or before merging UI changes.
---

# Mobile check

Scope: the files the user names, or the files changed on the current branch (`git diff --name-only main...HEAD -- src`).

## Look for

1. `window.innerWidth` anywhere in render or data code; hardcoded `768` / `599` / `(max-width: …)` queries → should be `theme.breakpoints` / responsive `sx`.
2. `isMobile ? … : …` for pure styling → responsive `sx` values.
3. Fixed widths on content (`width: "160px"`, grid templates with px-only team columns, `minWidth` > 320px).
4. Text below 12px, tap targets below 44px (icon buttons, chips, form dots).
5. Hover-only behaviour: `onMouseEnter` style mutation, tooltips carrying information, hover-to-open menus.
6. Dialogs that aren't `fullScreen` on small screens; inputs without `type="date"/"time"/"number"` + `inputMode`.
7. Horizontal overflow: tables without a scroll container, long team names without ellipsis/wrap ("Bairro Santos Nicolau", "Águias S. Gabriel").
8. `router.push` for URL-state updates (should be `router.replace`), animations that delay content.

## Output

A table: `file:line · problem · fix`, ordered by user impact (home page and match page first). Link items to IDs in `docs/archive/02_IMPROVEMENTS.md` §3 where they match. Only fix code if the user asks; keep fixes minimal and run `npm run build` afterwards.

If a browser tool is available, also load the page at 360×800 and 390×844 and report what visibly breaks.
