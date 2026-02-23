# Vacation Planner — Architecture Decisions

## Stack

| Concern | Choice | Rationale |
|---|---|---|
| Framework | React + Vite | Component model fits a calendar UI; fast dev experience |
| Language | TypeScript | Date-heavy logic benefits from type safety |
| Styling | Tailwind CSS | No custom CSS files to maintain |
| Date math | `date-fns` | Lightweight, tree-shakable, strong TS support |
| Public holidays | `date-holidays` | 150+ countries resolved locally — no API call needed |
| Persistence | `localStorage` | Meets local-only requirement, zero backend |

---

## Rendering Approach

Server-side rendering is unnecessary — this is a pure client-side app. Vite builds a static bundle that can be served from any local HTTP server or opened directly as a file.

---

## State Management

React's built-in state (`useState` + `useContext`) is sufficient. The data model is simple: a list of selected dates and a handful of settings. No external state library (Redux, Zustand) is needed.

Derived values — budget remaining, vacation periods, public holidays — are **computed from source state**, never stored separately.

---

## Persistence Strategy

Each year's vacation data is stored independently in `localStorage`, keyed by year. Settings (country, default allowance) are stored separately. This makes multi-year support trivial and keeps data isolated.

No sync, no export, no backend — data lives entirely in the browser.

---

## Public Holidays

Resolved entirely client-side via the `date-holidays` library. The result is memoized and only recomputed when the year or country changes. Holidays are treated as non-selectable days and do not count against the vacation allowance.

---

## Out of Scope for v1

- Build tooling / deployment pipeline (open locally via `vite dev`)
- Accessibility beyond basic semantics
- Mobile-specific layout optimizations
