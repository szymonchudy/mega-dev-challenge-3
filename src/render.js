import { render } from 'svelte/server';
const pages=import.meta.glob('/src/routes/kb/**/+page.svx',{eager:true});
export function snapshot(path) { return render(pages[`/src/routes/kb/${path}/+page.svx`].default); }
