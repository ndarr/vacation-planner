# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # start dev server at http://localhost:5173
npm run build    # type-check and build for production
npm run lint     # lint with ESLint
```

## Architecture

Single-page React app (Vite + TypeScript + Tailwind CSS). No backend — all data lives in `localStorage`.

### State flow

`App` owns all state and passes it down as props. No global state library.

- `useSettings` — persists `{ year, country, region }` under `vp-settings`
- `useVacationStore(year)` — persists `{ allowance, vacationDays[] }` under `vp-year-{year}`; reloads automatically when `year` changes via `useEffect`
- `holidays` — derived via `useMemo` from `date-holidays`, recomputed when year/country changes
- `vacationDays` (Set) — derived from `store.vacationDays` array for O(1) lookup
- `periods` — derived via `computePeriods`, never stored

### Key utilities

- `src/utils/calendar.ts` — builds month/year grids; `resolveDayType` determines each day's type in priority order: weekend → holiday → vacation → workday
- `src/utils/periods.ts` — groups consecutive vacation days into trips; days separated only by weekends/holidays belong to the same period
- `src/utils/holidays.ts` — wraps `date-holidays`, returns `Set<string>` of `"YYYY-MM-DD"` public holiday dates
- `src/utils/countries.ts` — returns sorted country list from `date-holidays` for the settings dropdown

### Component tree

```
App
├── main
│   ├── Legend
│   └── CalendarGrid → MonthCalendar → DayCell
└── aside
    ├── BudgetTracker
    ├── PeriodsPanel
    └── SettingsPanel
```

`DayCell` only receives non-null days. Null grid padding cells are rendered as empty `<div>`s in `MonthCalendar`.

### localStorage keys

| Key | Contents |
|---|---|
| `vp-settings` | `{ year, country, region? }` |
| `vp-year-{year}` | `{ allowance, vacationDays: string[] }` |

Dates are always stored as ISO strings `"YYYY-MM-DD"`.
