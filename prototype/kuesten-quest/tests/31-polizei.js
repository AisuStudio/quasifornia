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
 console.log('Verfolgung',JSON.stringify(await run(()=>{const q=__qa;q.POL.state='idle';q.polAlert({ax:q.P.x,az:q.P.z});q.POL.timer=.1;for(let i=0;i<10;i++)q.step(.05);const c=q.POL.cops[0];let ok=false;for(let a=0;a<24&&!ok;a++){const x=c.x+Math.cos(a/24*6.283)*25,z=c.z+Math.sin(a/24*6.283)*25;if(q.mpWalk(x,z)&&q.polLos(c.x,c.z,x,z)){q.P.x=x;q.P.z=z;ok=true}}q.P.speed=0;for(let i=0;i<4;i++)q.step(.05);const st1=q.POL.state;
  for(let i=0;i<400&&q.POL.state==='chase';i++){q.P.speed=0;q.step(.05)}
  return {sichtradius:st1,ende:q.POL.state,kamera:!!(q.POL.cin&&q.POL.cin.pos),dialog:q.DLG.open}})));
 console.log('Strafe',JSON.stringify(await run(()=>{const q=__qa,vor=q.SC.n;if(q.DLG.done)q.DLG.done();return {vor,nach:q.SC.n,zustand:q.POL.state,polizisten:q.POL.cops.length}})));
 /* Abgehängt */
 console.log('Abgehängt',JSON.stringify(await run(()=>{const q=__qa;q.DLG.open=false;q.POL.state='idle';q.polAlert({ax:q.P.x,az:q.P.z});q.POL.timer=.1;for(let i=0;i<10;i++)q.step(.05);const c=q.POL.cops[0];let ok=false;for(let a=0;a<24&&!ok;a++){const x=c.x+Math.cos(a/24*6.283)*30,z=c.z+Math.sin(a/24*6.283)*30;if(q.mpWalk(x,z)&&q.polLos(c.x,c.z,x,z)){q.P.x=x;q.P.z=z;ok=true}}for(let i=0;i<4;i++)q.step(.05);const st=q.POL.state;
  for(let i=0;i<200&&q.POL.state==='chase';i++){q.P.x=q.POL.cops[0].x+90;q.P.z=q.POL.cops[0].z;q.step(.05)}return {verfolgung:st,ende:q.POL.state}})));
 /* Sichtlinie: Haus zwischen Polizei und Spieler, dreimal aus dem Blick = Polizei gibt auf */
 console.log('Sichtlinie',JSON.stringify(await run(()=>{const q=__qa;q.DLG.open=false;q.POL.state='idle';q.POL.cops.forEach(c=>q.POL.cops=[]);q.polAlert({ax:q.P.x,az:q.P.z});q.POL.timer=.1;for(let i=0;i<10;i++)q.step(.05);
  let T=null;for(let x=-120;x<120&&!T;x+=2)for(let z=-200;z<150&&!T;z+=2){if(q.mpAt(x,z)!==5)continue;for(let w=4;w<=30;w++){if(q.mpAt(x+w,z)===5)continue;if(q.mpWalk(x-2,z)&&q.mpWalk(x+w+2,z)&&!q.mpWalk(x+w/2,z)){T={a:[x-3,z],b:[x+w+3,z]};break}}}
  if(!T)return {fehler:'kein Haus gefunden'};
  const seeing={a:q.mpWalk(T.a[0],T.a[1]),b:q.mpWalk(T.b[0],T.b[1])};
  const c0=q.POL.cops[0],c1=q.POL.cops[1];q.POL.state='chase';q.POL.chaseT=0;q.POL.lost=0;q.POL.hid=0;q.POL.lostFlag=false;q.POL.last={x:T.a[0],z:T.a[1]};
  const res=[];for(let round=0;round<3;round++){/* sichtbar */c0.x=T.a[0];c0.z=T.a[1];c1.x=T.a[0];c1.z=T.a[1]-1;let vp=null;for(let a2=0;a2<24&&!vp;a2++){const vx=T.a[0]+Math.cos(a2/24*6.283)*8,vz=T.a[1]+Math.sin(a2/24*6.283)*8;if(q.mpWalk(vx,vz)&&q.polLos(T.a[0],T.a[1],vx,vz))vp=[vx,vz]}q.P.x=vp[0];q.P.z=vp[1];q.P.speed=0;q.step(.05);
    /* versteckt hinter dem Haus */c0.x=T.a[0];c0.z=T.a[1];c1.x=T.a[0];c1.z=T.a[1]-1;q.P.x=T.b[0];q.P.z=T.b[1];for(let i=0;i<60&&q.POL.state==='chase';i++){c0.x=T.a[0];c0.z=T.a[1];c1.x=T.a[0];c1.z=T.a[1]-1;q.POL.last={x:T.a[0],z:T.a[1]};q.step(.05);if(q.POL.hid>2.6)break}
    res.push({runde:round+1,verloren:q.POL.lost,zustand:q.POL.state});if(q.POL.state!=='chase')break}
  return {res}})));
 /* Countdown startet 2 Sekunden nach dem ersten Sprühen auf einer verbotenen Wand */
 await run(()=>{const q=__qa;q.DLG.open=false;q.POL.cops.forEach(()=>{});q.POL.state='idle';q.POL.cops=[];q.SC.n=50;q.grafBuy('#2de0d0')});
 const F=await run(()=>{const q=__qa;for(let x=-120;x<120;x+=3)for(let z=-200;z<150;z+=3){q.P.x=x;q.P.z=z;const f=q.grafFacadeNear();if(f&&!f.door&&q.mpWalk(x,z))return {x,z,id:f.id}}});
 await run(F=>{const q=__qa;q.P.x=F.x;q.P.z=F.z;q.GF.open=false;q.grafOpen(q.grafEnsurePanel(F.id))},F);
 const vor=await run(()=>__qa.POL.state);
 await run(()=>__qa.grafSpray(10,10));await p.waitForTimeout(800);const nach08=await run(()=>__qa.POL.state);await p.waitForTimeout(1600);
 console.log('Countdown',JSON.stringify({vorSprühen:vor,nach08s:nach08,nach24s:await run(()=>({zustand:__qa.POL.state,sekunden:Math.round(__qa.POL.timer)}))}));
 await b.close();srv.close()})
