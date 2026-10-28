import fs from 'node:fs';
import { uniqueById, groupByCause, causeOf, sameCause } from '../src/lib/kb/causes.ts';
import { DEDUPE_CASES } from '../src/lib/kb/dedupe-cases.ts';
const root=new URL('../src/lib/data/',import.meta.url);
const raw=JSON.parse(fs.readFileSync(new URL('reports-4471.json',root)));
const tenants=new Map(fs.readdirSync(new URL('tenants/',root)).map(f=>{const t=JSON.parse(fs.readFileSync(new URL('tenants/'+f,root)));return [t.handle,t]}));
const reports=uniqueById(raw).filter(r=>r.mergedInto===4471);
const notes=JSON.parse(fs.readFileSync(new URL('desk-notes.json',root)));
const mergedDays={};for(const r of reports){const day=r.mergedAt?.slice(0,10);mergedDays[day]=(mergedDays[day]??0)+1;}
const summary={rawRows:raw.length,uniqueReports:reports.length,overlapRows:raw.length-uniqueById(raw).length,
 groups:groupByCause(reports,r=>tenants.get(r.tenant)).map(g=>({...g,reports:g.reports.map(r=>r.id),oneDayMove:g.reports.filter(r=>notes.oneDayMove.includes(r.id)).map(r=>r.id)})),
 mergedDays,
 dedupe:DEDUPE_CASES.map(c=>({...c,aCause:causeOf(c.a,tenants.get(c.a.tenant)),bCause:causeOf(c.b,tenants.get(c.b.tenant)),sameCause:sameCause(c.a,tenants.get(c.a.tenant),c.b,tenants.get(c.b.tenant))}))};
fs.writeFileSync(new URL('../deliverables/audit.json',import.meta.url),JSON.stringify(summary,null,2)+'\n');
console.log(JSON.stringify({...summary,groups:summary.groups.map(({reports,...g})=>({...g,count:reports.length})),mergedDays:Object.entries(mergedDays).sort((a,b)=>b[1]-a[1]).slice(0,8)},null,2));
