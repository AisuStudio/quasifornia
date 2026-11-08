// Entwürfe aus dem Designer (Avatar, Haus, Mesh-Avatar) im R2-Bucket "designs", Ordner entwuerfe/<art>/<id>/<version>.json.
// Jede Speicherung ist eine neue Version (nie überschreiben, nie löschen). Zugang: nur über den Passwortschutz in index.js.
// Routen:  GET /api/entwurf/<art>                    Liste (letzte Version je Entwurf)
//          GET /api/entwurf/<art>/<id>[?v=n]         ein Entwurf, ohne v die letzte Version
//          GET /api/entwurf/<art>/<id>/versionen     alle Versionen
//          PUT /api/entwurf/<art>/<id>               neue Version (JSON im Körper, höchstens 64 KB)
export const ENTW_ARTEN=['avatar','haus','mesh'],ENTW_ID=/^[a-z0-9-]{1,32}$/,ENTW_MAX_BYTES=64*1024,ENTW_MAX_ENTWUERFE=50,ENTW_MAX_VERSIONEN=20,ENTW_RATE=20;
const H={'content-type':'application/json; charset=utf-8','cache-control':'private, no-store','x-robots-tag':'noindex'};
const rl=new Map();
const jr=(o,s)=>new Response(JSON.stringify(o),{status:s||200,headers:H});
const err=(s,t,extra)=>new Response(t,{status:s,headers:{'content-type':'text/plain; charset=utf-8','cache-control':'no-store',...(extra||{})}});
/* Form prüfen: begrenzte Tiefe, begrenzte Längen, nur Zahlen/Texte/Wahrheitswerte/Listen/Objekte */
export function entwForm(v,d){d=d||0;if(d>6)return false;
  if(v===null||typeof v==='boolean')return true;
  if(typeof v==='number')return isFinite(v)&&Math.abs(v)<=1e5;
  if(typeof v==='string')return v.length<=80;
  if(Array.isArray(v))return v.length<=64&&v.every(x=>entwForm(x,d+1));
  if(typeof v==='object'){const k=Object.keys(v);return k.length<=1000&&k.every(x=>x.length<=24&&entwForm(v[x],d+1))}
  return false}
const HEX=/^#[0-9a-fA-F]{6}$/;
export function entwAvatar(o){
  if(!o||typeof o!=='object'||o.v!==2||o.species!=='humanoid'||typeof o.name!=='string'||!o.name.trim()||o.name.length>40)return 'Kein gültiger Avatar';
  if(!o.body||typeof o.body!=='object'||!o.slots||typeof o.slots!=='object'||!o.acc||typeof o.acc!=='object')return 'Avatar unvollständig';
  for(const k of Object.keys(o.slots))if(typeof o.slots[k]==='string'&&o.slots[k]&&!HEX.test(o.slots[k]))return 'Farbe ungültig: '+k.slice(0,12);
  return null}
export function entwHaus(o){
  if(!o||typeof o!=='object'||!o.cells||typeof o.cells!=='object'||Array.isArray(o.cells))return 'Kein gültiges Haus';
  if(typeof o.name!=='string'||!o.name.trim()||o.name.length>40)return 'Name fehlt';
  const ks=Object.keys(o.cells);if(ks.length>18*18*6)return 'Zu viele Zellen';
  const part=s=>typeof s==='string'&&/^[a-z0-9]{1,16}$/.test(s),col=n=>Number.isInteger(n)&&n>=0&&n<=11;
  for(const k of ks){const m=/^(\d{1,2}),(\d),(\d{1,2})$/.exec(k);if(!m||+m[1]>17||+m[2]>5||+m[3]>17)return 'Zelle ungültig: '+k.slice(0,10);
    const a=o.cells[k];if(!Array.isArray(a)||a.length!==4||!part(a[0])||!col(a[1])||!Number.isInteger(a[2])||a[2]<0||a[2]>7||!Array.isArray(a[3])||a[3].length!==4)return 'Zelle ungültig: '+k;
    for(const f of a[3])if(f!==0&&!(Array.isArray(f)&&f.length===2&&part(f[0])&&col(f[1])))return 'Seite ungültig: '+k}
  return null}
/* Mesh-Avatar: Textur 64 x 64 als 4096 Zeichen Palettennummern (0-9, a, b) */
export function entwMesh(o){
  if(!o||typeof o!=='object'||o.v!==1||o.kind!=='mesh'||o.species!=='humanoid'||o.pal!=='bau12')return 'Kein gültiger Mesh-Avatar';
  if(typeof o.name!=='string'||!o.name.trim()||o.name.length>40)return 'Name fehlt';
  if(typeof o.tex!=='string'||!/^[0-9ab]{4096}$/.test(o.tex))return 'Textur ungültig';return null}
const CHECK={avatar:entwAvatar,haus:entwHaus,mesh:entwMesh};
const pad=n=>String(n).padStart(4,'0');
async function versions(bucket,art,id){const out=[];let cur;do{const l=await bucket.list({prefix:'entwuerfe/'+art+'/'+id+'/',limit:100,cursor:cur,include:['customMetadata']});for(const o of l.objects){const m=/\/(\d{4})\.json$/.exec(o.key);if(m)out.push({v:+m[1],t:+(o.customMetadata&&o.customMetadata.t)||o.uploaded.getTime(),name:(o.customMetadata&&o.customMetadata.name)||'',bytes:o.size,key:o.key})}cur=l.truncated?l.cursor:null}while(cur&&out.length<500);return out.sort((a,b)=>a.v-b.v)}
export async function entwurf(request,env,url){
  const B=env.DESIGNS;if(!B)return err(503,'Speicher nicht eingerichtet');
  const p=url.pathname.replace(/^\/api\/entwurf\/?/,'').split('/').filter(Boolean);
  const art=p[0];if(!ENTW_ARTEN.includes(art))return err(404,'Unbekannte Art');
  const id=p[1];
  if(!id){if(request.method!=='GET')return err(405,'Methode nicht erlaubt');
    const items=new Map();let cur;do{const l=await B.list({prefix:'entwuerfe/'+art+'/',limit:1000,cursor:cur,include:['customMetadata']});
      for(const o of l.objects){const m=/^entwuerfe\/[a-z]+\/([a-z0-9-]+)\/(\d{4})\.json$/.exec(o.key);if(!m)continue;const v=+m[2],it=items.get(m[1])||{id:m[1],v:0,n:0};it.n++;if(v>=it.v){it.v=v;it.name=(o.customMetadata&&o.customMetadata.name)||m[1];it.t=+(o.customMetadata&&o.customMetadata.t)||o.uploaded.getTime()}items.set(m[1],it)}
      cur=l.truncated?l.cursor:null}while(cur);
    return jr({art,entwuerfe:[...items.values()].sort((a,b)=>b.t-a.t)})}
  if(!ENTW_ID.test(id))return err(400,'Ungültige Kennung');
  if(p[2]==='versionen'&&p.length===3){if(request.method!=='GET')return err(405,'Methode nicht erlaubt');const vs=await versions(B,art,id);if(!vs.length)return err(404,'nicht gefunden');return jr({art,id,versionen:vs.map(({v,t,name,bytes})=>({v,t,name,bytes}))})}
  if(p.length>2)return err(404,'?');
  if(request.method==='GET'){
    let v=url.searchParams.get('v');if(v!==null&&!/^\d{1,4}$/.test(v))return err(400,'Ungültige Version');
    if(v===null){const vs=await versions(B,art,id);if(!vs.length)return err(404,'nicht gefunden');v=vs[vs.length-1].v}
    const o=await B.get('entwuerfe/'+art+'/'+id+'/'+pad(+v)+'.json');if(!o)return err(404,'nicht gefunden');
    return new Response(o.body,{headers:{...H,'x-version':String(+v),'x-name':encodeURIComponent((o.customMetadata&&o.customMetadata.name)||'')}})}
  if(request.method!=='PUT')return err(405,'Methode nicht erlaubt');
  /* Bremse: höchstens ENTW_RATE Speicherungen pro Minute und Adresse (Arbeitsspeicher, reicht gegen Dauerfeuer) */
  const now=Date.now(),ip=request.headers.get('cf-connecting-ip')||'?',r=(rl.get(ip)||[]).filter(x=>now-x<60000);
  if(r.length>=(parseInt(env.ENTW_RATE)||ENTW_RATE)){rl.set(ip,r);return err(429,'Zu viele Anfragen',{'retry-after':'60'})}r.push(now);rl.set(ip,r);if(rl.size>500)rl.clear();
  const len=parseInt(request.headers.get('content-length')||'0',10);if(len>ENTW_MAX_BYTES)return err(413,'Zu groß (höchstens 64 KB)');
  const text=await request.text();if(text.length>ENTW_MAX_BYTES||new TextEncoder().encode(text).length>ENTW_MAX_BYTES)return err(413,'Zu groß (höchstens 64 KB)');
  let o;try{o=JSON.parse(text)}catch(e){return err(400,'Kein gültiges JSON')}
  const rest=art==='mesh'?(({tex,...r})=>r)(o):o;if(!entwForm(rest))return err(400,'Form ungültig (zu tief, zu lang oder falsche Werte)');
  const bad=CHECK[art](o);if(bad)return err(400,bad);
  const name=o.name.replace(/[\u0000-\u001f\u007f]/g,' ').replace(/\s+/g,' ').trim().slice(0,40);
  for(let i=0;i<3;i++){
    const vs=await versions(B,art,id);
    if(!vs.length){const l=await B.list({prefix:'entwuerfe/'+art+'/',delimiter:'/',limit:1000});if(l.delimitedPrefixes.length>=ENTW_MAX_ENTWUERFE)return err(507,'Speicher voll (zu viele Entwürfe)')}
    if(vs.length>=ENTW_MAX_VERSIONEN)return err(507,'Zu viele Versionen dieses Entwurfs');
    const v=(vs.length?vs[vs.length-1].v:0)+1,key='entwuerfe/'+art+'/'+id+'/'+pad(v)+'.json';
    const put=await B.put(key,text,{httpMetadata:{contentType:'application/json; charset=utf-8'},customMetadata:{name,t:String(now)},onlyIf:{etagDoesNotMatch:'*'}});
    if(put)return jr({art,id,v,t:now,name})}
  return err(409,'Gleichzeitig geändert, bitte noch einmal')}
