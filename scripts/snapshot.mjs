import fs from 'node:fs';
import { createServer } from 'vite';
const server=await createServer({server:{middlewareMode:true,hmr:false},appType:'custom'});
try {
 for (const [slug,path] of Object.entries({
  '4471-review':'incidents/4471-review',
  '0002-dedupe-by-cause':'decisions/0002-dedupe-by-cause',
  '4471-original':'incidents/4471',
  'triage-original':'triage/dedupe'
 })) {
  const {snapshot}=await server.ssrLoadModule('/src/render.js');
  const result=snapshot(path);
  const styles=fs.readdirSync('dist/assets').filter(f=>f.endsWith('.css')).map(f=>fs.readFileSync('dist/assets/'+f,'utf8')).join('\n');
  fs.writeFileSync(`deliverables/${slug}.html`,`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">${result.head}<style>${styles}</style></head><body>${result.body}</body></html>`);
 }
} finally {await server.close();}
