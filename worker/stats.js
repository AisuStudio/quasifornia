// Auswertung für die geschlossene Beta: sammelt anonyme Ereignisse der Spiele und rechnet sie für /stats zusammen.
// Gespeichert wird in einem Durable Object mit SQLite (Sitzungen + Ereignisse), nach 90 Tagen wird aufgeräumt.
// Das Spiel schickt alle 15 Sekunden ein kleines Paket (POST /api/stats), die Seite /stats holt /api/stats/summary.
export const EV_TYPES=new Set(['start','lvl','q','sc','item','portal','err','stuck','unstick','fps','pol','gr','ws','trick','lad','bq','tower','shop','race','glitch']);
const DAY=86400000,KEEP=90*DAY,ONLINE=45000;
const num=(v,lim,d)=>typeof v==='number'&&isFinite(v)?Math.max(-lim,Math.min(lim,v)):(d===undefined?null:d);
const str=(v,n)=>String(v==null?'':v).replace(/[\u0000-\u001f]/g,' ').slice(0,n);
const TZ='Europe/Berlin',F=new Intl.DateTimeFormat('sv-SE',{timeZone:TZ,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',hour12:false});
export function dayHour(t){const p={};for(const x of F.formatToParts(new Date(t)))p[x.type]=x.value;return {day:p.year+'-'+p.month+'-'+p.day,hour:(p.hour==='24'?'00':p.hour)}}
const median=a=>{if(!a.length)return 0;const s=a.slice().sort((x,y)=>x-y),m=s.length>>1;return s.length%2?s[m]:(s[m-1]+s[m])/2};
export function cleanIngest(b){
  if(!b||typeof b!=='object')return null;const sid=str(b.sid,24);if(!/^[A-Za-z0-9]{6,24}$/.test(sid))return null;
  const s={sid,pid:/^[A-Za-z0-9]{6,24}$/.test(str(b.pid,24))?str(b.pid,24):sid,name:str(b.name,12).replace(/[^A-Za-z0-9ÄÖÜäöüß _-]/g,'')||'?',ver:str(b.ver,24),dev:b.dev==='m'?'m':'d',ua:str(b.ua,120),w:num(b.w,10000,0),h:num(b.h,10000,0),gpu:str(b.gpu,80),room:str(b.room,32).replace(/[^a-z0-9-]/g,''),
    play:num(b.play,60,0),lvl:num(b.lvl,20,0),under:b.under?1:0,sc:num(b.sc,1e6,null),fps:num(b.fps,500,0),fr:num(b.fr,1e5,0),slow:num(b.slow,1e5,0),ev:[]};
  if(s.play<0)s.play=0;
  for(const e of (Array.isArray(b.ev)?b.ev.slice(0,40):[])){if(!Array.isArray(e))continue;const ty=str(e[0],12);if(!EV_TYPES.has(ty))continue;
    s.ev.push({ty,k:str(e[1],120),n:num(e[2],1e6,0),x:num(e[3],5000,null),z:num(e[4],5000,null),lvl:num(e[5],20,0)})}
  return s}
/* Reine Auswertung: bekommt Sitzungen und Ereignisse (Zeilen), liefert das, was die Seite anzeigt. Gut zu testen. */
export function summarize(S,E,now,days){
  const since=now-days*DAY,sess=new Map(S.map(s=>[s.sid,s])),out={now,days};
  /* online */
  const on=S.filter(s=>s.last>now-ONLINE);out.online={count:on.length,players:on.map(s=>({name:s.name,lvl:s.lvl,under:!!s.under,room:s.room||'',sc:s.sc,dev:s.dev,fps:s.fpsn?Math.round(s.fpssum/s.fpsn):0}))};
  const rooms={};on.forEach(s=>{if(s.room)rooms[s.room]=(rooms[s.room]||0)+1});out.rooms=Object.entries(rooms).map(([r,n])=>({room:r,n})).sort((a,b)=>b.n-a.n);
  /* Summen */
  const pids=new Set(S.map(s=>s.pid)),len=S.map(s=>s.play).filter(v=>v>0);
  out.total={players:pids.size,sessions:S.length,play:S.reduce((a,s)=>a+s.play,0),avg:len.length?len.reduce((a,v)=>a+v,0)/len.length:0,median:median(len),longest:len.length?Math.max(...len):0};
  const dayOf=new Map();S.forEach(s=>{const d=dayHour(s.t0).day;let o=dayOf.get(s.pid);if(!o)dayOf.set(s.pid,o=new Set());o.add(d)});out.total.returning=[...dayOf.values()].filter(x=>x.size>=2).length;
  /* pro Tag */
  const byDay=new Map();for(let i=days-1;i>=0;i--){const d=dayHour(now-i*DAY).day;byDay.set(d,{day:d,players:new Set(),sessions:0,play:0})}
  S.forEach(s=>{const o=byDay.get(dayHour(s.t0).day);if(o){o.players.add(s.pid);o.sessions++;o.play+=s.play}});
  out.perDay=[...byDay.values()].map(o=>({day:o.day,players:o.players.size,sessions:o.sessions,play:Math.round(o.play)}));
  /* pro Stunde (letzte 48 Stunden): Sitzungen, die in dieser Stunde aktiv waren */
  const hrs=[];for(let i=47;i>=0;i--){const t=now-i*3600000,dh=dayHour(t),a=Math.floor(t/3600000)*3600000,b=a+3600000;hrs.push({day:dh.day,hour:dh.hour,n:S.filter(s=>s.t0<b&&s.last>=a).length})}out.perHour=hrs;
  /* Spieler */
  const P=new Map();S.slice().sort((a,b)=>a.last-b.last).forEach(s=>{let p=P.get(s.pid);if(!p)P.set(s.pid,p={pid:s.pid,name:s.name,sessions:0,play:0,last:0,sc:null,dev:s.dev,q:new Set(),err:0,lvl:0});p.name=s.name;p.sessions++;p.play+=s.play;p.last=Math.max(p.last,s.last);if(s.sc!=null)p.sc=s.sc;p.dev=s.dev;p.lvl=s.lvl});
  E.forEach(e=>{const s=sess.get(e.sid),p=s&&P.get(s.pid);if(!p)return;if(e.type==='q')p.q.add(e.key);if(e.type==='err')p.err+=e.n||1});
  out.players=[...P.values()].map(p=>({name:p.name,sessions:p.sessions,play:Math.round(p.play),last:p.last,sc:p.sc,dev:p.dev,quests:p.q.size,err:p.err,online:p.last>now-ONLINE})).sort((a,b)=>b.last-a.last);
  /* Quests */
  const qm=new Map();E.filter(e=>e.type==='q').forEach(e=>{const s=sess.get(e.sid);if(!s)return;let o=qm.get(e.key);if(!o)qm.set(e.key,o={key:e.key,pids:new Map()});const m=(e.t-s.t0)/60000;if(!o.pids.has(s.pid)||m<o.pids.get(s.pid))o.pids.set(s.pid,m)});
  out.quests=[...qm.values()].map(o=>({key:o.key,players:o.pids.size,median:Math.round(median([...o.pids.values()])*10)/10})).sort((a,b)=>b.players-a.players);
  /* Trichter: wie viele Spieler erreichen welchen Schritt */
  const dist=(f)=>new Set(E.filter(f).map(e=>(sess.get(e.sid)||{}).pid).filter(Boolean)).size;
  out.funnel=[['Seite geöffnet',pids.size],['Spiel gestartet',dist(e=>e.type==='start')],['Gegenstand gefunden',dist(e=>e.type==='item')],['Portal benutzt',dist(e=>e.type==='portal')],['Erster Auftrag gelöst',dist(e=>e.type==='q')],['In der Unterwelt',dist(e=>e.type==='lad'&&e.key==='down')],['Serafin bezahlt',dist(e=>e.type==='bq'&&e.key==='gave')],['Geist befreit',dist(e=>e.type==='bq'&&e.key==='released')]].map(([label,n])=>({label,n}));
  /* Scoops */
  const sc=new Map(),perP=new Map();let earned=0,spent=0;E.filter(e=>e.type==='sc').forEach(e=>{const k=e.key.replace(/\s+\d+$/,'').slice(0,40)||'?';let o=sc.get(k);if(!o)sc.set(k,o={key:k,earned:0,spent:0,n:0,pids:new Set()});const s=sess.get(e.sid);o.n++;if(s)o.pids.add(s.pid);if(e.n>0){o.earned+=e.n;earned+=e.n}else{o.spent+=-e.n;spent+=-e.n}});
  out.scoops={earned,spent,reasons:[...sc.values()].map(o=>({key:o.key,earned:o.earned,spent:o.spent,n:o.n,players:o.pids.size})).sort((a,b)=>(b.earned+b.spent)-(a.earned+a.spent)).slice(0,18)};
  const bal=out.players.map(p=>p.sc).filter(v=>v!=null);out.scoops.balance={min:bal.length?Math.min(...bal):0,median:median(bal),max:bal.length?Math.max(...bal):0};
  /* Fehler */
  const er=new Map();E.filter(e=>e.type==='err').forEach(e=>{let o=er.get(e.key);if(!o)er.set(e.key,o={key:e.key,n:0,pids:new Set(),sess:new Set(),last:0,lvl:0,x:null,z:null});o.n+=e.n||1;const s=sess.get(e.sid);if(s)o.pids.add(s.pid);o.sess.add(e.sid);if(e.t>=o.last){o.last=e.t;o.lvl=e.lvl;o.x=e.x;o.z=e.z}});
  out.errors=[...er.values()].map(o=>({key:o.key,n:o.n,players:o.pids.size,sessions:o.sess.size,last:o.last,lvl:o.lvl,x:o.x,z:o.z})).sort((a,b)=>b.n-a.n).slice(0,25);
  /* Hänger */
  const cell=new Map(),pts=[];E.filter(e=>e.type==='stuck'||e.type==='unstick').forEach(e=>{if(e.x==null)return;const cx=Math.round(e.x/16),cz=Math.round(e.z/16),k=cx+','+cz;let o=cell.get(k);if(!o)cell.set(k,o={x:cx*16,z:cz*16,stuck:0,unstick:0,pids:new Set()});o[e.type]++;const s=sess.get(e.sid);if(s)o.pids.add(s.pid);pts.push([Math.round(e.x),Math.round(e.z),e.type==='stuck'?1:2])});
  out.stuck={cells:[...cell.values()].map(o=>({x:o.x,z:o.z,stuck:o.stuck,unstick:o.unstick,players:o.pids.size})).sort((a,b)=>(b.stuck+b.unstick)-(a.stuck+a.unstick)).slice(0,20),points:pts.slice(-400)};
  {const gm=new Map();E.filter(e=>e.type==='glitch').forEach(e=>{const [k,ty]=String(e.key).split(':');let o=gm.get(ty);if(!o)gm.set(ty,o={type:ty||'?',found:0,fixed:0,pids:new Set()});if(k==='fund')o.found++;else if(k==='fix'){o.fixed++;const s=sess.get(e.sid);if(s)o.pids.add(s.pid)}});
    const L=[...gm.values()].map(o=>({type:o.type,found:o.found,fixed:o.fixed,players:o.pids.size}));out.glitch={types:L,found:L.reduce((a,o)=>a+o.found,0),fixed:L.reduce((a,o)=>a+o.fixed,0)}}
  /* Leistung */
  const perf={};['m','d'].forEach(d=>{const L=S.filter(s=>s.dev===d&&s.fpsn>0);const f=L.map(s=>s.fpssum/s.fpsn),slow=L.reduce((a,s)=>a+s.slow,0),fr=L.reduce((a,s)=>a+s.fr,0);perf[d]={sessions:L.length,medianFps:Math.round(median(f)*10)/10,lowShare:L.length?Math.round(f.filter(v=>v<30).length/L.length*100):0,slowShare:fr?Math.round(slow/fr*1000)/10:0}});out.perf=perf;
  const gp=new Map();S.forEach(s=>{if(s.gpu)gp.set(s.gpu,(gp.get(s.gpu)||0)+1)});out.gpus=[...gp.entries()].sort((a,b)=>b[1]-a[1]).slice(0,6).map(([g,n])=>({gpu:g,n}));
  const lowEv=E.filter(e=>e.type==='fps');out.lowFpsEvents=lowEv.length;
  /* Polizei, Graffiti, Netz, Level */
  const cnt=(ty)=>{const m={};E.filter(e=>e.type===ty).forEach(e=>{m[e.key]=(m[e.key]||0)+(ty==='gr'?1:1)});return m};
  out.police=cnt('pol');out.net=cnt('ws');out.levels=cnt('lvl');out.tricks=E.filter(e=>e.type==='trick').length;
  const gr={legal:0,illegal:0,dabs:0};E.filter(e=>e.type==='gr').forEach(e=>{if(e.key==='illegal')gr.illegal++;else gr.legal++;gr.dabs+=e.n});out.graffiti=gr;
  out.versions=(()=>{const m={};S.forEach(s=>{if(s.ver)m[s.ver]=(m[s.ver]||0)+1});return Object.entries(m).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([v,n])=>({v,n}))})();
  return out}
export class Stats{
  constructor(state){this.sql=state.storage.sql;this.seen=new Map();
    this.sql.exec('CREATE TABLE IF NOT EXISTS sess(sid TEXT PRIMARY KEY,pid TEXT,name TEXT,t0 INTEGER,last INTEGER,play REAL DEFAULT 0,dev TEXT,ua TEXT,ver TEXT,w INTEGER,h INTEGER,gpu TEXT,room TEXT,lvl INTEGER,under INTEGER,sc INTEGER,fpssum REAL DEFAULT 0,fpsn INTEGER DEFAULT 0,fr INTEGER DEFAULT 0,slow INTEGER DEFAULT 0)');
    this.sql.exec('CREATE TABLE IF NOT EXISTS ev(id INTEGER PRIMARY KEY AUTOINCREMENT,t INTEGER,sid TEXT,type TEXT,key TEXT,n REAL,x REAL,z REAL,lvl INTEGER)');
    this.sql.exec('CREATE INDEX IF NOT EXISTS ev_t ON ev(t)');this.sql.exec('CREATE INDEX IF NOT EXISTS ev_ty ON ev(type)')}
  rows(q,...a){return this.sql.exec(q,...a).toArray()}
  ingest(b){const s=cleanIngest(b);if(!s)return false;const now=Date.now(),last=this.seen.get(s.sid)||0;if(now-last<800)return true;this.seen.set(s.sid,now);if(this.seen.size>500)this.seen.clear();
    const ex=this.rows('SELECT sid FROM sess WHERE sid=?',s.sid);
    if(!ex.length)this.sql.exec('INSERT INTO sess(sid,pid,name,t0,last,play,dev,ua,ver,w,h,gpu,room,lvl,under,sc,fpssum,fpsn,fr,slow) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',s.sid,s.pid,s.name,now,now,s.play,s.dev,s.ua,s.ver,s.w,s.h,s.gpu,s.room,s.lvl,s.under,s.sc,s.fps>0?s.fps:0,s.fps>0?1:0,s.fr,s.slow);
    else this.sql.exec('UPDATE sess SET last=?,name=?,play=play+?,room=?,lvl=?,under=?,sc=COALESCE(?,sc),fpssum=fpssum+?,fpsn=fpsn+?,fr=fr+?,slow=slow+?,ver=? WHERE sid=?',now,s.name,s.play,s.room,s.lvl,s.under,s.sc,s.fps>0?s.fps:0,s.fps>0?1:0,s.fr,s.slow,s.ver,s.sid);
    for(const e of s.ev)this.sql.exec('INSERT INTO ev(t,sid,type,key,n,x,z,lvl) VALUES(?,?,?,?,?,?,?,?)',now,s.sid,e.ty,e.k,e.n,e.x,e.z,e.lvl);
    if(Math.random()<.02){this.sql.exec('DELETE FROM ev WHERE t<?',now-KEEP);this.sql.exec('DELETE FROM sess WHERE last<?',now-KEEP)}
    return true}
  summary(days){const now=Date.now(),since=now-days*DAY;return summarize(this.rows('SELECT * FROM sess WHERE last>?',since),this.rows('SELECT * FROM ev WHERE t>?',since),now,days)}
  async fetch(request){const url=new URL(request.url),H={'content-type':'application/json; charset=utf-8','cache-control':'no-store'};
    if(url.pathname==='/api/stats'&&request.method==='POST'){const txt=await request.text();if(txt.length>12000)return new Response('zu groß',{status:413});let b;try{b=JSON.parse(txt)}catch(e){return new Response('?',{status:400})}return new Response(JSON.stringify({ok:this.ingest(b)}),{headers:H})}
    if(url.pathname==='/api/stats/summary'&&request.method==='GET'){const d=Math.max(1,Math.min(60,parseInt(url.searchParams.get('days')||'14',10)||14));return new Response(JSON.stringify(this.summary(d)),{headers:H})}
    if(url.pathname==='/api/stats/reset'&&request.method==='POST'){this.sql.exec('DELETE FROM ev');this.sql.exec('DELETE FROM sess');return new Response(JSON.stringify({ok:true}),{headers:H})}
    return new Response('?',{status:404})}}
