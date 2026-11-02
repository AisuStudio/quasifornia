// Neue Karte (Halbinsel): Aufbau, Erreichbarkeit aller Orte, Wasser blockiert, Gebäude blockieren.
const {chromium}=require('playwright');const http=require('http'),fs=require('fs'),path=require('path');
const srv=http.createServer((q,s)=>{const u=q.url.split('?')[0];const f=u==='/'?path.join(__dirname,'..','dist/dev.html'):path.join(__dirname,'..',u);fs.readFile(f,(e,d)=>{if(e){s.writeHead(404);s.end();return}s.writeHead(200,{'content-type':f.endsWith('.js')?'text/javascript; charset=utf-8':'text/html; charset=utf-8'});s.end(d)})}).listen(8870,async()=>{
 const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
 const p=await b.newPage({viewport:{width:1000,height:620}});p.on('pageerror',e=>console.log('ERR',e.message));
 await p.route(/fonts\.(googleapis|gstatic)\.com/,r=>r.abort());
 await p.goto('http://localhost:8870/?test=1');await p.waitForFunction('window.__ready',null,{timeout:120000});
 console.log('Aufbau',JSON.stringify(await p.evaluate(()=>{const q=__qa;const t=performance.now();q.applyLevel(0);q.beginPlay();const H=q.HUB;return {ms:Math.round(performance.now()-t),gebaeude:H.bgroups.length,items:H.items.length,portale:H.portals.length,laeden:H.shops.length,lab:!!H.lab,xmas:!!H.gb,cafe:!!H.cafe,burger:!!H.burger,bettler:!!H.beggar,leiter:!!H.uw,turm:!!(H.uw&&H.uw.tower),graffiti:H.graf.panels.length,zug:!!H.train,tor:!!H.gate}})));
 /* Erreichbarkeit: Flutfüllung auf dem Raster ab dem Start (Zellen 2 m), dann alle Orte prüfen */
 const r=await p.evaluate(()=>{const q=__qa,H=q.HUB;const walk=(X,Z)=>q.mpWalk(X,Z);const step=2,seen=new Set();const key=(i,j)=>i+','+j;const si=Math.round(H.sx/step),sj=Math.round(H.sz/step);const st=[[si,sj]];seen.add(key(si,sj));
   while(st.length){const [i,j]=st.pop();for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){const ni=i+a,nj=j+b,k=key(ni,nj);if(seen.has(k))continue;if(!walk(ni*step,nj*step))continue;seen.add(k);st.push([ni,nj])}}
   const ok=(X,Z)=>{for(let dx=-1;dx<=1;dx++)for(let dz=-1;dz<=1;dz++)if(seen.has(key(Math.round(X/step)+dx,Math.round(Z/step)+dz)))return true;return false};
   const pts={Start:[H.sx,H.sz],'Labor-Tür':[H.lab.doorX,H.lab.doorZ],Mann:[H.lab.manX,H.lab.manZ],'Atoll-Portal':[H.lab.portalX,H.lab.portalZ],Eiswagen:[H.lab.vanX+4,H.lab.vanZ],'Lebkuchenhaus-Schild':[H.gb.sx,H.gb.sz],'P-Mart':[H.shops[0].x,H.shops[0].z],Serafin:[H.beggar.x,H.beggar.z+1.5],Leiter:[H.uw.bx,H.uw.bz+3],Küstentor:[H.gate.x,H.gate.z],'Portal 2':[H.portals[0].x,H.portals[0].z],'Portal 3':[H.portals[1].x,H.portals[1].z]};
   H.items.forEach(i=>pts['Gegenstand '+i.def.id]=[i.x,i.z]);H.graf.panels.forEach(g=>pts['Wand '+g.id]=[g.ax,g.az]);pts['Turm-Fuß']=[H.uw.tower.x,H.uw.tower.z-9];
   const out={};for(const [k,v] of Object.entries(pts))out[k]=ok(v[0],v[1]);return {zellen:seen.size,fehlt:Object.keys(out).filter(k=>!out[k])}});
 console.log('Erreichbar',JSON.stringify(r));
 console.log('Wasser',JSON.stringify(await p.evaluate(()=>{const q=__qa,P=q.P;q.G.phase='play';P.x=q.HUB.sx;P.z=q.HUB.sz;P.h=0;P.speed=8;q.K.up=1;for(let i=0;i<200;i++)q.step(.03);const a=[+P.x.toFixed(1),+P.z.toFixed(1)];return {pos:a,imWasser:!q.mpWalk(P.x,P.z)}})));
 console.log('Gebäude',JSON.stringify(await p.evaluate(()=>{const q=__qa,P=q.P;P.x=q.HUB.sx;P.z=q.HUB.sz;P.h=-Math.PI/2+.6;P.speed=8;q.K.up=1;let min=1e9;for(let i=0;i<300;i++){q.step(.03);}return {imGebaeude:q.mpAt(P.x,P.z)===5,pos:[+P.x.toFixed(1),+P.z.toFixed(1)]}})));
 await b.close();srv.close()})
