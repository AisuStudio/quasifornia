// Neue Karte: 17 Bauplätze mit Typ und schiefem Umriss, Skatepark (Pool befahrbar, Zaun, offenes Tor), Backoffice, Beschriftungen vollständig.
const {chromium}=require('playwright');const http=require('http'),fs=require('fs'),path=require('path');
const srv=http.createServer((q,s)=>{const u=q.url.split('?')[0];const f=u==='/'?path.join(__dirname,'..','dist/dev.html'):path.join(__dirname,'..',u);fs.readFile(f,(e,d)=>{if(e){s.writeHead(404);s.end();return}s.writeHead(200,{'content-type':f.endsWith('.js')?'text/javascript; charset=utf-8':'text/html; charset=utf-8'});s.end(d)})}).listen(8946,async()=>{
 const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});

 const p=await b.newPage({viewport:{width:900,height:560}});p.on('pageerror',e=>console.log('ERR',e.message));
 await p.route(/fonts\.(googleapis|gstatic)\.com/,r=>r.abort());
 await p.goto('http://localhost:8946/?test=1');await p.waitForFunction('window.__ready',null,{timeout:120000});await p.click('#next1').then(()=>p.click('#go')).then(()=>p.click('#start'));
 const free=()=>p.evaluate(()=>{const q=__qa;q.DLG.open=false;document.getElementById('dlg').hidden=true;return true});
 /* Bauplätze */
 const pl=await p.evaluate(()=>{const q=__qa,P=q.HUB.plots;const t={};P.forEach(x=>t[x.type]=(t[x.type]||0)+1);return {n:P.length,typen:t,warn:q.HUB.plotWarn,alleBegehbar:P.every(x=>q.mpWalk(x.x,x.z)),maskeOk:P.every(x=>x.mask&&x.mask.size>=20),schief:P.some(x=>x.mask.size<x.NX*x.NZ)}});
 console.log('Bauplätze',JSON.stringify(pl),pl.n===17&&pl.typen.wohn>=4&&pl.typen.gewerbe>=6&&pl.warn.length===0&&pl.alleBegehbar&&pl.maskeOk&&pl.schief);
 /* Aufforderung am Platz, Anforderungen je Typ, Bauen nur innerhalb des Umrisses */
 const r=await p.evaluate(()=>{const q=__qa,o={};const w=q.HUB.plots.find(x=>x.type==='wohn'),g=q.HUB.plots.find(x=>x.type==='gewerbe'),f=q.HUB.plots.find(x=>x.type==='frei');
   q.G.phase='play';q.P.x=w.x;q.P.z=w.z;q.P.speed=0;for(let i=0;i<4;i++)q.step(.03);o.akt=q.curActs().filter(a=>/Bauen/.test(a.label)).map(a=>a.label).slice(0,3);
   q.bauOpen(w);o.titelW=document.getElementById('bld-h').textContent;o.reqW=document.querySelectorAll('#bld-req span').length;
   const kin=[...w.mask][0].split(',').map(Number);let aussen=null;for(let gx=0;gx<w.NX&&!aussen;gx++)for(let gz=0;gz<w.NZ;gz++)if(!w.mask.has(gx+','+gz)){aussen=[gx,gz];break}
   o.innen=q.bauPutVol(w,kin[0],0,kin[1],'geo',1,3);o.aussen=aussen?q.bauPutVol(w,aussen[0],0,aussen[1],'block',1,0):'(kein Außenfeld)';
   q.bauClose(false);q.bauOpen(g);o.titelG=document.getElementById('bld-h').textContent;o.reqG=document.querySelectorAll('#bld-req span').length;q.bauClose(false);q.bauOpen(f);o.titelF=document.getElementById('bld-h').textContent;q.bauClose(false);return o});
 console.log('Typen',JSON.stringify(r),r.titelW==='Wohngrundstück'&&r.titelG==='Gewerbegrundstück'&&r.titelF==='Bauplatz'&&r.innen===true&&r.aussen===false);
 /* Skatepark */
 const sk=await p.evaluate(()=>{const q=__qa,S=q.SKATE;return {an:S.on,tiefeMitte:+q.skateG(S.cx,S.cz).toFixed(2),tiefeRand:+q.skateG(S.cx+S.rx*1.3,S.cz).toFixed(2),tor:!!S.gate,sportplaetze:q.HUB.courts.map(c=>c.kind).sort().join(',')}});
 console.log('Skatepark',JSON.stringify(sk),sk.an&&sk.tiefeMitte<-1&&sk.tiefeRand===0&&sk.tor&&/skate/.test(sk.sportplaetze));
 const ride=await p.evaluate(()=>{const q=__qa,S=q.SKATE,o={};q.G.phase='play';q.P.x=S.cx+S.rx*1.2;q.P.z=S.cz;q.P.y=1.3;q.P.h=Math.PI;q.P.speed=2;q.K.up=1;let miny=9,maxv=0;for(let i=0;i<160;i++){q.step(.03);miny=Math.min(miny,q.P.y);maxv=Math.max(maxv,q.P.speed)}q.K.up=0;o.tiefster=+miny.toFixed(2);o.tempo=+maxv.toFixed(1);return o});
 console.log('Fahrt in den Pool',JSON.stringify(ride),ride.tiefster<.5);
 /* Zaun: von außen kommt man nur durchs Tor hinein */
 const zaun=await p.evaluate(()=>{const q=__qa,S=q.SKATE,o={};const g=S.gate;
   const toIn=(x0,z0,x1,z1)=>{q.P.x=x0;q.P.z=z0;q.P.y=1.3;q.P.h=Math.atan2(z1-z0,x1-x0);q.P.speed=7;q.K.up=1;let ok=false;for(let i=0;i<120;i++){q.step(.03);if(Math.hypot(q.P.x-S.cx,q.P.z-S.cz)<4)ok=true}q.K.up=0;return ok};
   const dx=S.cx-g[0],dz=S.cz-g[1],l=Math.hypot(dx,dz),ux=dx/l,uz=dz/l;
   o.durchsTor=toIn(g[0]-ux*10,g[1]-uz*10,S.cx,S.cz);
   const sx=-uz,sz=ux;o.durchsZaun=toIn(S.cx+(-ux)*S.rx*1.6+sx*8,S.cz+(-uz)*S.rz*1.6+sz*8,S.cx,S.cz);return o});
 console.log('Zaun und Tor',JSON.stringify(zaun));
 /* Backoffice */
 const bo=await p.evaluate(()=>{const q=__qa,b=q.HUB.backoffice;if(!b)return null;q.G.phase='play';q.P.x=b.x;q.P.z=b.z;q.P.speed=0;q.step(.03);const e=document.getElementById('act');return e.hidden?'':e.firstElementChild.textContent});
 console.log('Backoffice',bo,/Lagerhalle/.test(bo||''));
 await b.close();srv.close()})
