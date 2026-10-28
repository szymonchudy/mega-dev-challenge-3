<script lang="ts">
  import reports from '#lib/data/reports-4471.json';
  import notes from '#lib/data/desk-notes.json';
  import { groupByCause, uniqueById, type Report } from '#lib/kb/causes';
  import { tenantOf } from '#lib/kb/locales';
  const merged = $derived(uniqueById(reports as Report[]).filter(r => r.mergedInto === 4471));
  const groups = $derived(groupByCause(merged, tenantOf));
  const misclassified = $derived(groups.reduce((sum,g) => sum + g.reports.filter(r=>r.meta.intakeTag !== g.cause).length, 0));
  const backfill = $derived(merged.filter(r=>r.mergedAt?.startsWith('2026-07-02')).length);
  const earliest = $derived(merged.map(r=>r.receivedAt.slice(0,10)).sort()[0]);
  const latest = $derived(merged.map(r=>r.receivedAt.slice(0,10)).sort().at(-1));
  const exceptions = $derived(merged.filter(r=>notes.oneDayMove.includes(r.id)));
  const repository = 'https://github.com/szymonchudy/mega-dev-challenge-3';
</script>
<p>The export has {reports.length} rows and {merged.length} unique reports in #4471; {reports.length - merged.length} rows repeat report IDs. Reports were received from {earliest} through {latest}. Intake tags disagree with tenant-based classification for {misclassified} reports.</p>
<table>
  <thead><tr><th>Problem</th><th>Reports covered</th><th>Engineering ticket</th></tr></thead>
  <tbody>{#each groups as group (group.cause)}<tr><td>{group.cause === 'parser' ? 'Shared parser reads month first' : 'booking-v3 prints a month-first hint'}</td><td>{group.reports.length}</td><td><a href={`${repository}/issues/${group.cause === 'parser' ? 1 : 2}`}>{group.cause}</a></td></tr>{/each}</tbody>
</table>
<p>On 2026-07-02, {backfill} reports were merged. That spike records desk activity; receipt dates show when the problem was reported. It is not evidence that the bug began in July.</p>
<h2>Reports that do not describe a month/day swap</h2>
<p>{exceptions.length} reports are flagged by the desk as one-day moves. The supplied classifier puts all of them under parser by tenant and channel. They remain included in that ticket's count, but their bodies do not establish a parser cause. Reproduce them with the original date, time zone, locale, and invite payload before closing them as fixed. There is insufficient evidence here to file a separate confirmed time-zone bug.</p>
<table><thead><tr><th>Report</th><th>Tenant</th><th>Reported symptom</th></tr></thead><tbody>{#each exceptions as r (r.id)}<tr><td>{r.id}</td><td>{r.tenant}</td><td>{r.body}</td></tr>{/each}</tbody></table>
