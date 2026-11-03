// Polizei nach illegalem Graffiti: Warnung, Wartezeit (Tag 60 s, Nacht 180 s), Ankunft, Verfolgung im Sichtradius, Festnahme (10 Scoops), Glück gehabt.
const {chromium}=require('playwright');const http=require('http'),fs=require('fs'),path=require('path');
const srv=http.createServer((q,s)=>{const u=q.url.split('?')[0];const f=u==='/'?path.join(__dirname,'..','dist/dev.html'):path.join(__dirname,'..',u);fs.readFile(f,(e,d)=>{if(e){s.writeHead(404);s.end();return}s.writeHead(200,{'content-type':f.endsWith('.js')?'text/javascript; charset=utf-8':'text/html; charset=utf-8'});s.end(d)})}).listen(8899,async()=>{
 const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
 const p=await b.newPage();p.on('pageerror',e=>console.log('ERR',e.message));
 await p.route(/fonts\.(googleapis|gstatic)\.com/,r=>r.abort());await p.route('**/api/graffiti**',r=>r.fulfill({status:404,body:''}));
 await p.goto('http://localhost:8899/?test=1');await p.waitForFunction('window.__ready',null,{timeout:120000});
 await p.evaluate(()=>{localStorage.clear();const q=__qa;q.applyLevel(0);q.beginPlay();q.G.phase='play';q.SC.n=50});
 const run=(fn,a)=>p.evaluate(fn,a);
 console.log('Tag',JSON.stringify(await run(()=>{const q=__qa;q.DAY.dn=1;q.POL.state='idle';q.polAlert({ax:q.P.x+10,az:q.P.z});const r={zustand:q.POL.state,sekunden:q.POL.timer};q.POL.state='idle';return r})));
 console.log('Nacht',JSON.stringify(await run(()=>{const q=__qa;q.DAY.dn=0;q.polAlert({ax:q.P.x+10,az:q.P.z});const r={zustand:q.POL.state,sekunden:q.POL.timer};q.POL.state='idle';return r})));
 /* Ankunft */
 console.log('Ankunft',JSON.stringify(await run(()=>{const q=__qa;q.DAY.dn=1;q.P.x=q.HUB.sx;q.P.z=q.HUB.sz;q.POL.state='idle';q.polAlert({ax:q.P.x+10,az:q.P.z});q.POL.timer=.2;for(let i=0;i<20;i++)q.step(.05);const c=q.POL.cops[0];return {zustand:q.POL.state,polizisten:q.POL.cops.length,abstand:c?Math.round(Math.hypot(c.x-q.P.x,c.z-q.P.z)):null}})));
 /* Glück gehabt: Spieler weit weg, Polizei sucht und zieht ab */
 console.log('Suche',JSON.stringify(await run(()=>{const q=__qa;q.POL.spot={x:q.P.x+300,z:q.P.z};q.POL.search=0;for(let i=0;i<40;i++)q.step(.05);const mid=q.POL.state;q.POL.search=21;for(let i=0;i<5;i++)q.step(.05);return {waehrend:mid,danach:q.POL.state,polizisten:q.POL.cops.length}})));
 /* Verfolgung im Sichtradius, dann Festnahme */
 console.log('Verfolgung',JSON.stringify(await run(()=>{const q=__qa;q.POL.state='idle';q.polAlert({ax:q.P.x,az:q.P.z});q.POL.timer=.1;for(let i=0;i<10;i++)q.step(.05);const c=q.POL.cops[0];let ok=false;for(let a=0;a<24&&!ok;a++){const x=c.x+Math.cos(a/24*6.283)*25,z=c.z+Math.sin(a/24*6.283)*25;if(q.mpWalk(x,z)){q.P.x=x;q.P.z=z;ok=true}}q.P.speed=0;for(let i=0;i<4;i++)q.step(.05);const st1=q.POL.state;
  for(let i=0;i<400&&q.POL.state==='chase';i++){q.P.speed=0;q.step(.05)}
  return {sichtradius:st1,ende:q.POL.state,kamera:!!(q.POL.cin&&q.POL.cin.pos),dialog:q.DLG.open}})));
 console.log('Strafe',JSON.stringify(await run(()=>{const q=__qa,vor=q.SC.n;if(q.DLG.done)q.DLG.done();return {vor,nach:q.SC.n,zustand:q.POL.state,polizisten:q.POL.cops.length}})));
 /* Abgehängt */
 console.log('Abgehängt',JSON.stringify(await run(()=>{const q=__qa;q.DLG.open=false;q.POL.state='idle';q.polAlert({ax:q.P.x,az:q.P.z});q.POL.timer=.1;for(let i=0;i<10;i++)q.step(.05);const c=q.POL.cops[0];let ok=false;for(let a=0;a<24&&!ok;a++){const x=c.x+Math.cos(a/24*6.283)*30,z=c.z+Math.sin(a/24*6.283)*30;if(q.mpWalk(x,z)){q.P.x=x;q.P.z=z;ok=true}}for(let i=0;i<4;i++)q.step(.05);const st=q.POL.state;
  for(let i=0;i<200&&q.POL.state==='chase';i++){q.P.x=q.POL.cops[0].x+90;q.P.z=q.POL.cops[0].z;q.step(.05)}return {verfolgung:st,ende:q.POL.state}})));
 await b.close();srv.close()})
