## Problem
booking-v3 prints `MM/DD/YYYY` under the date field for day-first tenants, while the form reads input in the tenant's date order. Following the hint can swap the intended month and day. This is a different cause from the shared month-first parser.

## Reports covered
**33 unique reports** merged into #4471, across Alder Physio (de-DE), Copper Studio (es-ES) and Pale Harbour (pt-PT), received 2026-04-17 through 2026-09-22 in the supplied export. Deduplicate by ID, look up the tenant, and select day-first tenants using booking-v3 with channel `form`. There are 18 tagged hint and 15 incorrectly tagged parser; intakeTag and browser locale do not determine cause.

Example: R-41241, Alder Physio, form, reports 6 August becoming 8 June. R-41230, Copper Studio, reports 6 January becoming 1 June. The shared-parser ticket covers the other 379 reports.

## Reproduce and fix
1. Open a booking-v3 form for Alder Physio (de-DE).
2. Follow its displayed `MM/DD/YYYY` hint and enter 08/06/2026 intending 6 August.
3. Compare the parsed booking date with the intention communicated by the hint.

Expected: the hint and parser agree on the tenant's date convention, producing the intended date. Reported actual: the day-first form reads 08/06 as 8 June.

Align hint, validation and parser with the tenant locale, rather than browser locale. Verify Copper Studio and Pale Harbour as well. Changing the shared parser alone does not fix this misleading hint.

## Acceptance
Verify rendered hint text and submitted date round trips for each affected booking-v3 tenant. Check booking-v2 remains correct. Ambiguous inputs must preserve the intended date; reject impossible dates with a clear localized message.

## Evidence
- `DATE_HINT` and `causeOf()` in `src/lib/kb/causes.ts`
- `src/lib/data/reports-4471.json` and `src/lib/data/tenants/`
- `deliverables/audit.json` lists every report ID per computed group.
- `src/routes/kb/incidents/4471-review/+page.svx` and `deliverables/4471-review.html`

These are course fixtures; this issue does not assert a deployed production fix.
