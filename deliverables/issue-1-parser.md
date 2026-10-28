## Problem
The shared date parser reads input month first even when the tenant uses day-first dates. Bookings and invites can swap the month and day. For Harbour Dental (en-GB, booking-v2), report R-41200 says 7 April became 4 July; R-41201 reports the inverse.

## Reports covered
**379 unique reports** merged into #4471, across 11 tenants, received 2026-04-01 through 2026-10-04 in the supplied export. Count by report ID, then use the tenant's locale, form version and report channel with `causeOf()` in `src/lib/kb/causes.ts`. Do not count the 15 overlapping export rows twice or group by intakeTag: this group includes 356 tagged parser and 23 tagged hint.

The 33 booking-v3 form-hint reports belong in a separate ticket. This ticket's 379 includes five reports the desk read as one-day moves: R-41202, R-41209, R-41236, R-41344 and R-41620. Their bodies do not prove a month/day swap. Preserve them in this classifier-based count, investigate original timestamps/time zones and payloads, and do not close them solely because the parser fix passes.

## Reproduce and fix
1. Use a day-first tenant such as Harbour Dental (en-GB).
2. Submit the tenant-local date 07/04/2026 through the affected shared-parser path.
3. Check the stored booking and generated invite.

Expected: 7 April 2026. Reported actual: 4 July 2026. Make parsing honor the tenant's date order, including ambiguous dates. Verify app, email and booking-v2 paths and preserve month-first behavior for tenants that use it.

## Acceptance
Verify round trips for ambiguous and unambiguous dates across the affected tenant locales, validate impossible dates explicitly, and check invites against the submitted date. Independently reproduce the five exceptional reports before closing them. A fix here must not be used to close the booking-v3 hint ticket.

## Evidence
- `src/lib/data/reports-4471.json` and `src/lib/data/tenants/`
- `deliverables/audit.json` lists every report ID per computed group.
- `src/routes/kb/incidents/4471-review/+page.svx` and `deliverables/4471-review.html`

These are course fixtures; this issue does not assert a deployed production fix.
