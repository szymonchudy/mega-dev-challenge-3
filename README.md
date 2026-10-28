# kb — the support knowledge base

**kb** = knowledge base. What the support desk knows about how our products break, written
down where the code can keep it honest.

One desk takes reports for every product we run: `sched-prod` (calendar invites for about
300k people) and the rest. When something
goes wrong, the reports reach the desk first. This kb is how the desk triages them, what each
incident turned out to be, and why we decided what we decided.

## What's here

```
src/routes/kb/      the pages (.svx: Markdown with components)
  triage/           how the desk handles incoming reports
  incidents/        one page per big ticket
  decisions/        numbered decision records
src/lib/kb/         components and the logic they run
src/lib/layouts/    the frame every page shares
src/lib/data/       exports from the ticket system
```

## Conventions

- Words in the page, logic in `src/lib` (imported as `#lib/…`). A number that can be computed belongs in a component.
- Every page starts with frontmatter: `title`, `owner`, `status`, `reviewed`.
- A decision is never edited after it is accepted. A new record replaces it.
- A page you add is signed: its frontmatter carries your `signature` and it ends with `<RenderStamp {signature} />`, so the desk knows who wrote it.

## Owners

Support desk. Decision records: whoever signed them.

---

Exported 2026-10-04 from the `support` repo, `apps/kb/` → `src/`.

## S01E03 review

- [Signed review source (.svx)](deliverables/4471-review.svx)
- [Rendered review for the desk (.html)](deliverables/4471-review.html)
- [KB route source](src/routes/kb/incidents/4471-review/+page.svx)
- [Replacement decision source](deliverables/0002-dedupe-by-cause.svx)
- [Rendered replacement decision](deliverables/0002-dedupe-by-cause.html)

The deliverables folder keeps each signed source beside its rendered capture with a matching name.

The signed review is at `src/routes/kb/incidents/4471-review/+page.svx`.
Its standalone rendered capture is `deliverables/4471-review.html`.
Decision 0002 supersedes decision 0001; the accepted old decision remains unchanged.
All source data in this repository is fictional MEGA.dev course material.

Requires Node.js 24+ (native TypeScript stripping is used by the audit script).

```sh
npm ci
npm run audit
npm run build
npm run snapshot
npm run dev
```

Open `/kb/incidents/4471-review` in the preview. The cause table, counts, timeline,
dedupe explorer, staleness warnings and desk reference execute from the exported code.
`deliverables/audit.json` retains the report IDs behind each issue count.
Standalone HTML captures are read-only snapshots; use the preview for interactive controls.

Engineering issues: [parser](https://github.com/szymonchudy/mega-dev-challenge-3/issues/1)
and [hint](https://github.com/szymonchudy/mega-dev-challenge-3/issues/2).
