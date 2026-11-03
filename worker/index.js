export {Room} from './room.js';
export {Stats} from './stats.js';
// Passwortschutz für die ganze Seite (inklusive Song). Läuft in Cloudflare vor den statischen Dateien.
// Das Passwort steht NICHT im Code: Es liegt als Secret "SITE_PASSWORD" in Cloudflare (Worker > Settings > Variables and Secrets).
// Ist kein Passwort gesetzt, bleibt die Seite gesperrt (fail closed). Benutzername ist egal.
async function digest(s){return new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s)))}
async function same(a,b){const x=await digest(a),y=await digest(b);let d=0;for(let i=0;i<x.length;i++)d|=x[i]^y[i];return d===0}
function creds(h){if(!h||!h.startsWith('Basic '))return null;try{const bin=atob(h.slice(6).trim()),bytes=Uint8Array.from(bin,c=>c.charCodeAt(0)),t=new TextDecoder().decode(bytes),i=t.indexOf(':');return i<0?null:t.slice(i+1)}catch(e){return null}}
const NOSTORE={'cache-control':'private, no-store','x-robots-tag':'noindex, nofollow'};
export default{
  async fetch(request,env){
    const url0=new URL(request.url);
    /* Auswertung ansehen (Seite /stats und die Zahlen): eigenes Passwort STATS_PASSWORD, ersatzweise das Seitenpasswort.
       Wird vor der Seitenprüfung behandelt, weil ein Browser pro Anfrage nur ein Passwort schickt. */
    if(url0.pathname==='/stats'||url0.pathname==='/stats/'||url0.pathname==='/api/stats/summary'||url0.pathname==='/api/stats/reset'){
      const spw=env.STATS_PASSWORD||env.SITE_PASSWORD;
      if(!spw)return new Response('Diese Seite ist gesperrt. Das Passwort wurde noch nicht eingerichtet.',{status:503,headers:{'content-type':'text/plain; charset=utf-8',...NOSTORE}});
      const sg=creds(request.headers.get('authorization'));
      if(sg===null||!(await same(sg,spw)))return new Response('Passwort für die Auswertung erforderlich.',{status:401,headers:{'www-authenticate':'Basic realm="Port 36 Auswertung", charset="UTF-8"','content-type':'text/plain; charset=utf-8',...NOSTORE}});
      if(url0.pathname.startsWith('/stats')){const r=await env.ASSETS.fetch(new Request(new URL('/stats',url0),request));const o=new Response(r.body,r);o.headers.set('cache-control','private, no-store');o.headers.set('x-robots-tag','noindex, nofollow');return o}
      if(!env.STATS)return new Response('Auswertung nicht eingerichtet',{status:503,headers:NOSTORE});
      if(url0.pathname==='/api/stats/reset'&&request.method!=='POST')return new Response('?',{status:405,headers:NOSTORE});
      if(url0.pathname==='/api/stats/summary'&&request.method!=='GET')return new Response('?',{status:405,headers:NOSTORE});
      return env.STATS.get(env.STATS.idFromName('main')).fetch(request)}
    const pw=env.SITE_PASSWORD;
    if(!pw)return new Response('Diese Seite ist gesperrt. Das Passwort wurde noch nicht eingerichtet.',{status:503,headers:{'content-type':'text/plain; charset=utf-8',...NOSTORE}});
    const given=creds(request.headers.get('authorization'));
    if(given===null||!(await same(given,pw)))
      return new Response('Passwort erforderlich.',{status:401,headers:{'www-authenticate':'Basic realm="Port 36 (Test)", charset="UTF-8"','content-type':'text/plain; charset=utf-8',...NOSTORE}});
    const url=new URL(request.url);
    /* Einsenden der Spiele: normales Seitenpasswort */
    if(url.pathname==='/api/stats'&&request.method==='POST'){if(!env.STATS)return new Response('Auswertung nicht eingerichtet',{status:503,headers:NOSTORE});return env.STATS.get(env.STATS.idFromName('main')).fetch(request)}
    /* Freundes-Raum (WebSocket, bis zu 5 Spieler): /api/room/<name> */
    if(url.pathname.startsWith('/api/room/')){
      const name=decodeURIComponent(url.pathname.slice(10));
      if(!/^[a-z0-9-]{1,32}$/.test(name))return new Response('Ungültiger Raumname',{status:400,headers:NOSTORE});
      if(request.headers.get('upgrade')!=='websocket')return new Response('WebSocket nötig',{status:426,headers:NOSTORE});
      const org=request.headers.get('origin');if(org&&new URL(org).host!==url.host)return new Response('Falsche Herkunft',{status:403,headers:NOSTORE});
      if(!env.ROOM)return new Response('Räume nicht eingerichtet',{status:503,headers:NOSTORE});
      return env.ROOM.get(env.ROOM.idFromName(name)).fetch(request)}
    /* Graffiti-Speicher: Bilder bleiben 48 Stunden auf dem Server (Durable Object), Liste = nur Zeitstempel, Bild einzeln */
    if(url.pathname==='/api/graffiti'||url.pathname.startsWith('/api/graffiti/')){
      if(!env.GRAF)return new Response('Speicher nicht eingerichtet',{status:503,headers:NOSTORE});
      const stub=env.GRAF.get(env.GRAF.idFromName('main'));
      return stub.fetch(new Request(url,request))}
    if(url.pathname==='/'||url.pathname==='/index.html')url.pathname='/kuesten-quest.html';
    const res=await env.ASSETS.fetch(new Request(url,request));
    const out=new Response(res.body,res);
    out.headers.set('cache-control','private, no-store');out.headers.set('x-robots-tag','noindex, nofollow');
    return out}};

/* ---- Durable Object: speichert die Graffiti-Bilder (PNG als Text) mit Zeitstempel, Ablauf nach 48 Stunden ---- */
const GRAF_TTL=48*3600*1000,GRAF_MAX=60000,GRAF_ID=/^(w[1-9]|f\d{1,3}-\d{1,2}-\d{1,2})$/,GRAF_PNG=/^data:image\/png;base64,[A-Za-z0-9+\/=]+$/;
export class GrafStore{
  constructor(state){this.state=state}
  async fetch(request){
    const url=new URL(request.url),st=this.state.storage,now=Date.now(),H={'content-type':'application/json; charset=utf-8','cache-control':'no-store'};
    const m=url.pathname.match(/^\/api\/graffiti(?:\/([^/]+))?$/);if(!m)return new Response('?',{status:404});
    const id=m[1]?decodeURIComponent(m[1]):null;
    if(!id&&request.method==='GET'){const items={},all=await st.list({prefix:'g:'});for(const [k,v] of all){if(now-v.t>GRAF_TTL){await st.delete(k);continue}items[k.slice(2)]=v.t}return new Response(JSON.stringify({now,ttl:GRAF_TTL,items}),{headers:H})}
    if(!id||!GRAF_ID.test(id))return new Response('Ungültige Kennung',{status:400});
    if(request.method==='GET'){const v=await st.get('g:'+id);if(!v||now-v.t>GRAF_TTL)return new Response('weg',{status:404});return new Response(v.png,{headers:{'content-type':'text/plain; charset=utf-8','cache-control':'no-store','x-graffiti-time':String(v.t)}})}
    if(request.method==='PUT'){const body=await request.text();if(body.length>GRAF_MAX||!GRAF_PNG.test(body))return new Response('Ungültiges Bild',{status:400});await st.put('g:'+id,{t:now,png:body});return new Response(JSON.stringify({t:now}),{headers:H})}
    return new Response('Methode nicht erlaubt',{status:405})}}
