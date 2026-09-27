# 03 — UI / Design Proposal

> **Detailed, implementable specs for every screen and component are in [`05_SCREEN_SPECS.md`](05_SCREEN_SPECS.md).** This file is the overview/direction.
> The site has no end-user accounts (only admins log in), so nothing here is personalised per visitor.

> Goal: turn the site from "a set of pages with purple gradients" into something that looks and feels like a **modern football app** (FotMob / OneFootball / SofaScore style), mobile-first, while keeping the league's identity (purple + gold, logo).
> This is a proposal to discuss — nothing applied yet. Best applied page by page together with the mobile pass (`02_IMPROVEMENTS.md` §3).

---

## 1. What's wrong visually today (honest review)

- **Every surface is "decorated"**: purple gradients, glows, blur, gold borders, emoji in titles (🏆), bouncing/spinning loaders, staggered fade-ins. When everything is highlighted nothing is — the data (scores, positions, points) doesn't stand out.
- **No hierarchy system**: font sizes are chosen per component (11 px, 13 px, 15 px, 48 px…), not from a scale; MUI runs on its *default* theme so MUI parts (inputs, tabs, dialogs) look generic blue/Roboto next to the purple custom parts.
- **Low information density on mobile**: large headers and paddings, while the useful content (the table) is squeezed to logos only.
- **Inconsistent components**: 3 different match cards, 3 season selectors, 3 loading components, several header styles.
- **Desktop-first navigation**: a hover-to-expand side drawer; on mobile a full-screen menu that hides the page.

---

## 2. Design direction

**"Matchday"** — clean, neutral surfaces; colour is reserved for meaning (brand, result, cards); numbers are big and bold.

| Token | Proposal |
|---|---|
| Brand | Purple `#5B3E96` (slightly deeper than today's `#6B4BA1` for contrast on white text) · Gold `#F5C400` as the *accent* (champion, active tab, CTA) — used sparingly |
| Surfaces | Light: `#F6F5F9` background, `#FFFFFF` cards, 1 px `#E7E4EE` borders, **no heavy shadows**. Dark mode: `#121016` bg, `#1C1922` cards |
| Semantic | Win `#16A34A` · Draw `#9CA3AF` · Loss `#DC2626` · Yellow card `#FACC15` · Red card `#DC2626` · Live `#EF4444` |
| Type | **Body/UI**: Geist (already in the project) or Inter. **Numbers & headings**: a condensed sporty face — *Barlow Condensed* or *Oswald* (Google Fonts via `next/font`), tabular numerals for tables and scores |
| Scale | 12 · 14 · 16 · 20 · 24 · 32 (only these), defined once in the MUI theme `typography` |
| Radius | 12 px cards, 8 px chips/buttons, full for avatars/badges |
| Spacing | 4-pt grid (MUI spacing 1 = 4 px or keep 8 px) |
| Motion | 150–200 ms transitions only; no bounce/spin loaders → **skeletons** shaped like the content |

All of it lives in **one** `src/theme/theme.js` (`createTheme`) with light + dark palettes — replaces `styles/theme.js`, `ThemeWrapper`, Tailwind colours.

---

## 3. Navigation

**Mobile (≤ 900 px)**
```
┌───────────────────────────────┐
│ [logo] Liga Veteranos  25/26 ▾│  ← slim top bar: season switcher lives here, global
├───────────────────────────────┤
│                               │
│          page content         │
│                               │
├───────────────────────────────┤
│  🏠     📅     🏆     👥    ☰  │  ← bottom nav
│ Início Jogos  Taça Equipas Mais│
└───────────────────────────────┘
```
- "Mais" opens a bottom sheet: Marcadores, Disciplina, Supertaça, Informação, Galeria, Histórico, Admin.
- Season switcher is global (in the top bar, stored in the URL), not repeated on every page.

**Desktop** — a fixed, always-visible left sidebar (icons + labels, 240 px) or a top bar with tabs. No hover-expand.

---

## 4. Key screens

### 4.1 Início (new home) — replaces "home = standings"
```
┌ Próxima jornada (J7) ─────────── ver tudo ›┐
│  Sábado 12 Out                               │
│  [🛡] Sado         15:00      Pontes [🛡]    │  ← horizontally swipeable match cards
│  [🛡] Amarelos     15:00    Curvas   [🛡]    │
└──────────────────────────────────────────────┘
┌ Últimos resultados (J6) ─────────────────────┐
│  Ídolos   2 – 1  Azeda                        │
└──────────────────────────────────────────────┘
┌ Classificação ──────────────── tabela ›┐  ← top 5
│ 1 [🛡] Águias S. Gabriel   18  +12     │
│ 2 [🛡] Sport Clube Sado    16  +9      │
└────────────────────────────────────────┘
┌ Marcadores ─┐ ┌ Suspensos ─┐             ← two stat tiles side by side
│ 1 J. Silva 9│ │ 3 jogadores │
└─────────────┘ └─────────────┘
```

### 4.2 Classificação (mobile)
```
 #  Equipa                 J   DG   Pts
 1  [🛡] Águias S. Gabriel  8  +12   20   ← gold left border = champion zone
 2  [🛡] Sport Clube Sado   8   +9   18
 …
[ Tabela completa ↔ ]  ← toggle: compact / full (V E D GM GS Forma) with horizontal scroll + sticky team column
```
Tap a row → team page. Form guide as 5 small coloured squares (W/D/L letters inside — readable without hover).

### 4.3 Match card (single component used everywhere)
```
┌──────────────────────────────────────┐
│ Liga · Jornada 6         Sáb 12/10   │
│ [🛡] Sado                     2      │
│ [🛡] Pontes                   1      │
│ Campo do Sado · 15:00      Terminado │
└──────────────────────────────────────┘
```
Stacked layout (FotMob style) fits any width and long team names. Variants: `upcoming` (time instead of score), `live`, `finished`, `penalties` (2 (4) – 2 (3)).

### 4.4 Match page
- Hero: two badges, big condensed score, status chip, competition + date + stadium below.
- **Timeline** of events in the centre (⚽ 23' J. Silva on the scoring team's side; 🟨/🟥 icons).
- Tabs: *Resumo* · *Plantéis* · *Ficha* (download PDF button).
- Admin: a sticky "Editar jogo" bar at the bottom instead of a floating button over content.

### 4.5 Team page
- Hero with team colours (`teams.main_color` already exists in the DB), logo, name, stadium.
- Tabs: *Jogos* · *Plantel* (grid of player cards with photo, name, JK badge, goals/cards this season) · *Estatísticas*.

### 4.6 Taça
- League Cup: group tables as compact cards (same table component as Classificação), Final Four as a vertical bracket on mobile.
- Knockout: vertical round-by-round list on mobile, bracket on desktop.

---

## 5. Component library to build (once, reused everywhere)

`TeamBadge` · `PlayerAvatar` · `MatchCard` · `ScoreLine` · `StandingsTable` (league + cup groups) · `FormGuide` · `SectionCard` (title + "ver tudo" link) · `StatTile` · `SeasonSwitcher` · `EmptyState` · `ErrorState` · `ContentSkeleton` · `BottomNav` · `PageHeader`.

Each one gets the variants it needs and no `isMobile` prop — responsiveness via `sx` breakpoints.

---

## 6. "Feels like an app" extras (cheap wins)

- **PWA**: `manifest.json` + icons + `theme-color` → "Adicionar ao ecrã principal"; players/fans open it like an app.
- **Share previews**: per-page `metadata` + Open Graph image for matches ("Sado 2-1 Pontes") → nice WhatsApp previews (that's where the league's audience shares things).
- **Dark mode** following the phone setting.
- **Pull-to-refresh feel** on match days: React Query `refetchOnWindowFocus` so reopening the app shows fresh scores.

---

## 7. How to proceed

1. Build `theme/theme.js` + the component library on one page (Classificação + Início) → review together on a phone.
2. If approved, roll out page by page in the order of `02_IMPROVEMENTS.md` §7.
3. Optional: I can produce a clickable HTML mockup of the home + standings + match page first, so you and your friend can react to the look before any code changes.
