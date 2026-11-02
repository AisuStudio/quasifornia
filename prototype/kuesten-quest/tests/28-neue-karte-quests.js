// Neue Karte: Aktionen an allen Orten, Küstentor, Portal, Unterwelt mit Karte, Zug.
const {chromium}=require('playwright');const http=require('http'),fs=require('fs'),path=require('path');
const srv=http.createServer((q,s)=>{const u=q.url.split('?')[0];const f=u==='/'?path.join(__dirname,'..','dist/dev.html'):path.join(__dirname,'..',u);fs.readFile(f,(e,d)=>{if(e){s.writeHead(404);s.end();return}s.writeHead(200,{'content-type':f.endsWith('.js')?'text/javascript; charset=utf-8':'text/html; charset=utf-8'});s.end(d)})}).listen(8871,async()=>{
 const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
 const p=await b.newPage({viewport:{width:1100,height:700}});p.on('pageerror',e=>console.log('ERR',e.message));
 await p.route(/fonts\.(googleapis|gstatic)\.com/,r=>r.abort());
 await p.goto('http://localhost:8871/?test=1');await p.waitForFunction('window.__ready',null,{timeout:120000});
 await p.evaluate(()=>{localStorage.clear();const q=__qa;q.applyLevel(0);q.beginPlay();q.G.phase='play'});
 const at=(x,z)=>p.evaluate(([x,z])=>{const q=__qa;q.P.x=x;q.P.z=z;q.P.speed=0;q.K.up=0;q.step(.03);return q.curActs().map(a=>a.label)},[x,z]);
 const H=await p.evaluate(()=>{const h=__qa.HUB;return {door:[h.lab.doorX,h.lab.doorZ],man:[h.lab.manX,h.lab.manZ],van:[h.lab.vanX+3,h.lab.vanZ],gb:[h.gb.sx,h.gb.sz],shop:[h.shops[0].x,h.shops[0].z],beg:[h.beggar.x,h.beggar.z+1.5],lad:[h.uw.bx,h.uw.bz+3],wall:[h.graf.panels[0].ax,h.graf.panels[0].az]}});
 for(const [k,v] of Object.entries(H))console.log('Aktion',k,JSON.stringify(await at(v[0],v[1])));
 console.log('Zug',JSON.stringify(await p.evaluate(()=>{const q=__qa,T=q.HUB.train;if(!T)return null;let st=null;for(let i=0;i<1500;i++){q.step(.05);if(T.state==='run'&&st===null)st=i*.05}return {laenge:Math.round(T.L),startet:st,zustand:T.state}})));
 /* Item einsammeln */
 console.log('Gegenstand',JSON.stringify(await p.evaluate(()=>{const q=__qa,it=q.HUB.items[0];q.P.x=it.x;q.P.z=it.z;q.P.y=q.cityGround(it.x,it.z)+.1;q.step(.05);return {id:it.def.id,got:it.got,inv:q.INV.items.size}})));
 /* Portal (kostet Scoops) */
 console.log('Portal',JSON.stringify(await p.evaluate(()=>{const q=__qa,po=q.HUB.portals[0],s0=q.SC.n;q.P.x=po.x;q.P.z=po.z;q.P.y=2;for(let i=0;i<4;i++)q.step(.05);return {scoops:q.SC.n-s0,gefunden:q.HUB.found.size}})));
 await p.evaluate(()=>{__qa.applyLevel(0);__qa.beginPlay();__qa.G.phase='play'});
 /* Küstentor startet das Rennen */
 console.log('Küstentor',JSON.stringify(await p.evaluate(()=>{const q=__qa,g=q.HUB.gate;q.HUB.coastHit=0;q.P.x=g.x;q.P.z=g.z;q.P.y=2;q.step(.05);for(let i=0;i<40;i++)q.step(.05);return {level:q.LV.id}})));
 await p.evaluate(()=>{__qa.applyLevel(0);__qa.beginPlay();__qa.G.phase='play'});
 /* Unterwelt: Leiter, Karte, Serafin */
 console.log('Leiter',JSON.stringify(await p.evaluate(()=>{const q=__qa,U=q.HUB.uw;q.P.x=U.bx;q.P.z=U.bz+3;q.P.speed=0;q.step(.03);const a=q.curActs().map(x=>x.label);q.underApply(true);q.P.x=U.bx;q.P.z=U.bz+6;q.G.phase='play';for(let i=0;i<20;i++)q.step(.03);return {oben:a,unten:q.curActs().map(x=>x.label),under:q.G.under}})));
 await p.evaluate(()=>{const q=__qa;q.BQ.gave=true;q.BQ.released=false;for(let i=0;i<12;i++)q.step(.05)});
 fs.writeFileSync(require('os').tmpdir()+'/neu_mini.png',Buffer.from((await p.evaluate(()=>document.getElementById('mini').toDataURL('image/png'))).split(',')[1],'base64'));
 console.log('Unterwelt-Zombies',JSON.stringify(await p.evaluate(()=>{const q=__qa;return {zombies:q.UWE.list.filter(e=>e.kind==='z').length,geister:q.UWE.list.filter(e=>e.kind==='g').length,kuerbisse:q.UWE.pumpkins.length}})));
 await p.evaluate(()=>{document.getElementById('ui').style.display='none'});await p.screenshot({path:require('os').tmpdir()+'/neu_unten.png'});
 await p.evaluate(()=>{const q=__qa,T=q.HUB.uw.tower;q.P.x=T.x;q.P.z=T.z-14;q.P.h=-Math.PI/2;for(let i=0;i<60;i++)q.step(.03)});await p.screenshot({path:require('os').tmpdir()+'/neu_turm.png'});
 await p.evaluate(()=>{const q=__qa;q.underApply(false);q.P.x=q.HUB.sx;q.P.z=q.HUB.sz;q.G.phase='play';document.getElementById('ui').style.display='';for(let i=0;i<20;i++)q.step(.05)});
 fs.writeFileSync(require('os').tmpdir()+'/neu_mini_oben.png',Buffer.from((await p.evaluate(()=>document.getElementById('mini').toDataURL('image/png'))).split(',')[1],'base64'));
 await p.screenshot({path:require('os').tmpdir()+'/neu_start.png'});
 await b.close();srv.close()})
