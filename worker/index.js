// Passwortschutz für die ganze Seite (inklusive Song). Läuft in Cloudflare vor den statischen Dateien.
// Das Passwort steht NICHT im Code: Es liegt als Secret "SITE_PASSWORD" in Cloudflare (Worker > Settings > Variables and Secrets).
// Ist kein Passwort gesetzt, bleibt die Seite gesperrt (fail closed). Benutzername ist egal.
async function digest(s){return new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s)))}
async function same(a,b){const x=await digest(a),y=await digest(b);let d=0;for(let i=0;i<x.length;i++)d|=x[i]^y[i];return d===0}
function creds(h){if(!h||!h.startsWith('Basic '))return null;try{const bin=atob(h.slice(6).trim()),bytes=Uint8Array.from(bin,c=>c.charCodeAt(0)),t=new TextDecoder().decode(bytes),i=t.indexOf(':');return i<0?null:t.slice(i+1)}catch(e){return null}}
const NOSTORE={'cache-control':'private, no-store','x-robots-tag':'noindex, nofollow'};
export default{
  async fetch(request,env){
    const pw=env.SITE_PASSWORD;
    if(!pw)return new Response('Diese Seite ist gesperrt. Das Passwort wurde noch nicht eingerichtet.',{status:503,headers:{'content-type':'text/plain; charset=utf-8',...NOSTORE}});
    const given=creds(request.headers.get('authorization'));
    if(given===null||!(await same(given,pw)))
      return new Response('Passwort erforderlich.',{status:401,headers:{'www-authenticate':'Basic realm="Port 36 (Test)", charset="UTF-8"','content-type':'text/plain; charset=utf-8',...NOSTORE}});
    const url=new URL(request.url);
    if(url.pathname==='/'||url.pathname==='/index.html')url.pathname='/kuesten-quest.html';
    const res=await env.ASSETS.fetch(new Request(url,request));
    const out=new Response(res.body,res);
    out.headers.set('cache-control','private, no-store');out.headers.set('x-robots-tag','noindex, nofollow');
    return out}};
