// Gemeinsame Riesen-Dinos: der Fahrplan hängt nur von der Uhr ab (gleiche Zeit = gleicher Dino am gleichen Ort).
const {chromium}=require('playwright');const http=require('http'),fs=require('fs'),path=require('path');
const srv=http.createServer((q,s)=>{const u=q.url.split('?')[0];const f=u==='/'?path.join(__dirname,'..','dist/dev.html'):path.join(__dirname,'..',u);fs.readFile(f,(e,d)=>{if(e){s.writeHead(404);s.end();return}s.writeHead(200,{'content-type':f.endsWith('.js')?'text/javascript; charset=utf-8':'text/html; charset=utf-8'});s.end(d)})}).listen(8940,async()=>{
 const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
 const mk=async()=>{const c=await b.newContext({viewport:{width:800,height:500}});await c.route(/fonts/,r=>r.abort());await c.route('**/api/**',r=>r.fulfill({status:404,body:''}));const p=await c.newPage();p.on('pageerror',e=>console.log('ERR',e.message));await p.goto('http://localhost:8940/?test=1');await p.waitForFunction('window.__ready',null,{timeout:120000});await p.evaluate(()=>{localStorage.clear();const q=__qa;q.applyLevel(0);q.beginPlay();q.G.phase='play'});return p};
 const A=await mk(),B=await mk();
 /* 1 gleiche Zeit, gleicher Dino, gleiche Stelle (reine Funktion der Zeit) */
 const T0=Date.UTC(2026,10,3,12,0,0);const pick=async p=>p.evaluate(T0=>{const q=__qa,out=[];for(let k=0;k<12;k++){const base=Math.floor(T0/q.GIANT.PERIOD)*q.GIANT.PERIOD+k*q.GIANT.PERIOD;let hit=null;for(let s=0;s<150&&!hit;s+=5){const st=q.giantState(base+s*1000);if(st)hit={T:base+s*1000,kind:st.kind,x:+st.x.toFixed(2),z:+st.z.toFixed(2),yaw:+st.yaw.toFixed(3)}}out.push(hit)}return out},T0);
 const ra=await pick(A),rb=await pick(B);
 console.log('Fahrplan gleich in beiden Browsern',JSON.stringify(ra)===JSON.stringify(rb),'| Zeitfenster mit Dino:',ra.filter(Boolean).length,'von 12');
 console.log('Reihenfolge der Wesen',ra.filter(Boolean).map(x=>x.kind).join(','));
 /* 2 Alle 2 bis 3 Minuten (150 s), Dino läuft ca. 100 s: Anteil der Zeit */
 const frac=await A.evaluate(T0=>{const q=__qa;let on=0,n=0;for(let s=0;s<3600;s+=3){n++;if(q.giantState(T0+s*1000))on++}return Math.round(on/n*100)},T0);console.log('Anteil der Zeit mit sichtbarem Dino (Prozent)',frac);
 /* 3 Beide Browser zeigen beim eingestellten Zeitpunkt die Figur an der gleichen Stelle, Höhe ca. 20 m */
 const show=async p=>p.evaluate(T0=>{const q=__qa,M=q.MULTI;const hit=(()=>{for(let k=0;k<12;k++){const base=Math.floor(T0/q.GIANT.PERIOD)*q.GIANT.PERIOD+k*q.GIANT.PERIOD;for(let s=20;s<120;s+=2){const st=q.giantState(base+s*1000);if(st&&st.fade>=1)return base+s*1000}}return null})();
   M.on=true;M.synced=true;M.off=hit-Date.now();q.P.x=0;q.P.z=0;for(let i=0;i<3;i++)q.step(.02);const st=q.GIANT.cur,pool=q.GIANT.pool[st.kind],g=pool.g;
   let top=-1e9;g.updateMatrixWorld(true);g.traverse(o=>{if(o.isMesh){o.geometry.computeBoundingBox();const bb=o.geometry.boundingBox,e=o.matrixWorld.elements;for(const y of [bb.min.y,bb.max.y])for(const x of [bb.min.x,bb.max.x])for(const z of [bb.min.z,bb.max.z])top=Math.max(top,e[1]*x+e[5]*y+e[9]*z+e[13])}});
   return {kind:st.kind,sichtbar:g.visible,pos:[+g.position.x.toFixed(1),+g.position.z.toFixed(1)],soll:[+st.x.toFixed(1),+st.z.toFixed(1)],hoehe:+(top-1.3).toFixed(1)}},T0);
 const sa=await show(A),sb=await show(B);
 console.log('Anzeige A',JSON.stringify(sa));console.log('Anzeige B',JSON.stringify(sb));
 console.log('Beide an der gleichen Stelle',Math.hypot(sa.pos[0]-sb.pos[0],sa.pos[1]-sb.pos[1])<.5&&sa.sichtbar&&sb.sichtbar,'| Höhe 18 bis 21 m',sa.hoehe>=18&&sa.hoehe<=21);
 /* 4 Zeit läuft weiter: nach 10 Sekunden Uhr ist der Dino ca. 36 m weiter */
 const mv=await A.evaluate(()=>{const q=__qa,M=q.MULTI,a=q.GIANT.cur;const p0=[a.x,a.z];M.off+=10000;for(let i=0;i<3;i++)q.step(.02);const b=q.GIANT.cur;return {weg:+Math.hypot(b.x-p0[0],b.z-p0[1]).toFixed(1)}});console.log('10 s später (erwartet etwa 36 m, kürzer in Kurven)',JSON.stringify(mv));
 /* 5 Außerhalb der Fenster kein Dino sichtbar */
 const none=await A.evaluate(T0=>{const q=__qa,M=q.MULTI;let T=null;for(let k=0;k<12&&!T;k++){const base=Math.floor(T0/q.GIANT.PERIOD)*q.GIANT.PERIOD+k*q.GIANT.PERIOD;for(let s=0;s<150;s+=1)if(!q.giantState(base+s*1000)){T=base+s*1000;break}}M.off=T-Date.now();for(let i=0;i<3;i++)q.step(.02);return {cur:q.GIANT.cur,alleUnsichtbar:q.GIANT.list.every(o=>!o.g.visible)}},T0);console.log('Außerhalb eines Fensters',JSON.stringify(none));
 await b.close();srv.close()});
