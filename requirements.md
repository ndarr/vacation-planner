# Vacation Planner — Functional Requirements

## Overview

A local-only, browser-based single-page application that lets an employee plan their work vacation days across a full calendar year. No login, no server, no cloud — all data persists in the browser's `localStorage`.

---

## FR-1: Year Calendar View

- Display all 12 months of the selected year in a single scrollable view
- Each month renders as a standard calendar grid (Mon–Sun columns)
- Each day is visually categorized:
  - **Weekend** (Sat/Sun) — non-interactive, visually muted
  - **Public holiday** — non-interactive, visually distinct
  - **Vacation day** — user-selected, highlighted in accent color
  - **Regular working day** — interactive, neutral color
- Clicking a working day toggles it as a vacation day
- Clicking an already-selected vacation day removes it
- Weekends and public holidays cannot be selected

---

## FR-2: Vacation Budget Tracker

- User sets a total vacation day allowance for the year (e.g. 25)
- The tracker always shows:
  - Total allowance
  - Number of days used (vacation days selected)
  - Number of days remaining
  - A visual progress indicator (e.g. progress bar)
- Updates in real time as days are toggled

---

## FR-3: Vacation Periods Summary

- Automatically groups consecutive selected vacation days into "periods"
- For each period, display:
  - Start and end date
  - Number of working days taken
  - Total calendar days (including surrounding weekends/holidays)
- Periods are listed in chronological order
- Updates in real time as days are toggled

---

## FR-4: Public Holidays

- User selects their country (and optionally region/state) once in settings
- Public holidays for the selected country/year are automatically loaded
- Holidays are displayed on the calendar and excluded from vacation day selection
- Holidays do not count against the vacation allowance

---

## FR-5: Settings

- **Year**: select which year to plan (defaults to current year)
- **Vacation allowance**: total days available for the selected year
- **Country**: used to determine public holidays
- Settings are persisted in `localStorage`
- Changing the year loads a new calendar; previously saved days for that year are restored if they exist

---

## FR-6: Data Persistence

- All user data is stored in the browser's `localStorage`
- Stored data per year:
  - Selected vacation days (list of dates)
  - Vacation allowance
  - Country setting
- Data survives page refreshes and browser restarts
- No data is sent to any external server

---

## FR-7: Multi-Year Support

- The app supports planning for multiple years independently
- Each year's vacation days and allowance are stored separately
- Switching years in settings preserves data for all years

---

## Out of Scope (v1)

- Multiple vacation types (sick days, personal days, etc.)
- Half-day support
- Export or print functionality
- User accounts or cloud sync
- Team/shared calendars
- Notifications or reminders
