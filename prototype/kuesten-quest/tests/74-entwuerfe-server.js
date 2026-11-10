// Server-Speicher für Entwürfe (worker/entwuerfe.js) gegen einen lokalen Worker, dazu die Speicher-Leiste im Haus-Designer unter /designer/.
// Vorher:  cd quasifornia && npx wrangler dev --local --port 8790 --var SITE_PASSWORD:testpw --var STATS_PASSWORD:statspw --var ENTW_RATE:60   (Bremse auf 60 pro Minute, damit der Test nicht an ihr scheitert, bevor er sie prüft)
const {chromium}=require('playwright');const fs=require('fs'),path=require('path');
const BASE=process.env.WORKER||'http://localhost:8790',AUTH='Basic '+Buffer.from('x:testpw').toString('base64');
const W=(p,o={})=>fetch(BASE+p,{...o,headers:{authorization:AUTH,...(o.headers||{})}});
const PUT=(p,body)=>W(p,{method:'PUT',headers:{'content-type':'application/json'},body:typeof body==='string'?body:JSON.stringify(body)});
(async()=>{
 try{const r=await W('/api/graffiti');if(!r.ok)throw 0}catch(e){console.log('übersprungen: kein lokaler Worker (npx wrangler dev --local --port 8790 --var SITE_PASSWORD:testpw --var STATS_PASSWORD:statspw --var ENTW_RATE:60)');return}
 const sx=Math.random().toString(36).slice(2,7),idA='av-'+sx,idH='haus-'+sx;
 const av=(n,top)=>({v:2,species:'humanoid',name:n,body:{size:1,head:1},slots:{top:top||'#d54291',skin:'#e0a98a'},acc:{hair:'puff'}});
 const haus=n=>({name:n,cells:{'3,0,3':['block',2,0,[0,0,0,0]],'3,1,3':['gable',10,1,[['win',3],0,0,0]]},rew:0});
 /* Passwortschutz */
 const anon=await fetch(BASE+'/api/entwurf/avatar');console.log('Ohne Passwort',anon.status,anon.status===401);
 /* Avatar: speichern, Version 2, lesen */
 const r1=await PUT('/api/entwurf/avatar/'+idA,av('Pinky')).then(r=>r.json());const r2=await PUT('/api/entwurf/avatar/'+idA,av('Pinky','#00ff88')).then(r=>r.json());
 console.log('Zwei Versionen',JSON.stringify([r1.v,r2.v]),r1.v===1&&r2.v===2);
 const last=await W('/api/entwurf/avatar/'+idA).then(async r=>({v:r.headers.get('x-version'),j:await r.json()}));const v1=await W('/api/entwurf/avatar/'+idA+'?v=1').then(r=>r.json());
 console.log('Letzte und alte Version lesen',last.v,last.j.slots.top,v1.slots.top,last.v==='2'&&last.j.slots.top==='#00ff88'&&v1.slots.top==='#d54291');
 const vs=await W('/api/entwurf/avatar/'+idA+'/versionen').then(r=>r.json());const ls=await W('/api/entwurf/avatar').then(r=>r.json());const me=ls.entwuerfe.find(e=>e.id===idA);
 console.log('Liste und Versionen',JSON.stringify({vs:vs.versionen.map(x=>x.v),me}),vs.versionen.length===2&&me&&me.v===2&&me.n===2&&me.name==='Pinky');
 /* Haus */
 const h1=await PUT('/api/entwurf/haus/'+idH,haus('Villa')).then(r=>r.json());console.log('Haus gespeichert',h1.v,h1.v===1);
 /* Mesh-Avatar */
 const mesh=(n,t)=>({v:1,kind:'mesh',species:'humanoid',pal:'bau12',name:n,tex:t||'0123456789ab'.repeat(342).slice(0,4096)});
 const mv=await PUT('/api/entwurf/mesh/me-'+sx,mesh('Mesh Eins')).then(r=>r.json());const m1g=await W('/api/entwurf/mesh/me-'+sx).then(r=>r.json());
 console.log('Mesh gespeichert',mv.v,m1g.tex.length,mv.v===1&&m1g.tex.length===4096);
 const mx=await PUT('/api/entwurf/mesh/mx-'+sx,{...mesh('Mit Form'),rings:{torso:{'3':[130,90]},legL:{'0':[80,80]}},grad:{torso:{m:8,c:[2,8],d:'v',a:0,b:100}}}).then(r=>r.json());const mxg=await W('/api/entwurf/mesh/mx-'+sx).then(r=>r.json());
 console.log('Mesh mit Ringen und Verlauf',mx.v,JSON.stringify(mxg.rings),mx.v===1&&mxg.rings.torso['3'][0]===130&&mxg.grad.torso.c[1]===8);
 /* Ablehnen */
 const big=av('Gross');big.slots.x='#'+'a'.repeat(6);big.acc={t:'x'.repeat(70000)};
 const cases=[
  ['zu groß',PUT('/api/entwurf/avatar/x-'+sx,big),413],
  ['kein JSON',PUT('/api/entwurf/avatar/x-'+sx,'{kaputt'),400],
  ['falsche Art',PUT('/api/entwurf/avatar/x-'+sx,haus('Falsch')),400],
  ['falsche Farbe',PUT('/api/entwurf/avatar/x-'+sx,{...av('Farbe'),slots:{top:'rot'}}),400],
  ['Haus Zelle außerhalb',PUT('/api/entwurf/haus/x-'+sx,{name:'A',cells:{'99,0,3':['block',2,0,[0,0,0,0]]}}),400],
  ['Haus Farbe 40',PUT('/api/entwurf/haus/x-'+sx,{name:'A',cells:{'3,0,3':['block',40,0,[0,0,0,0]]}}),400],
  ['Haus ohne Name',PUT('/api/entwurf/haus/x-'+sx,{cells:{}}),400],
  ['zu tief',PUT('/api/entwurf/avatar/x-'+sx,{...av('Tief'),acc:{a:{b:{c:{d:{e:{f:{g:1}}}}}}}}),400],
  ['Kennung ungültig',PUT('/api/entwurf/avatar/Gross%20Klein',av('Id')),400],
  ['Kennung zu lang',PUT('/api/entwurf/avatar/'+'a'.repeat(33),av('Id')),400],
  ['unbekannte Art',PUT('/api/entwurf/monster/x',av('Id')),404],
  ['Löschen verboten',W('/api/entwurf/avatar/'+idA,{method:'DELETE'}),405],
  ['Version unbekannt',W('/api/entwurf/avatar/'+idA+'?v=9'),404],
  ['Version Format',W('/api/entwurf/avatar/'+idA+'?v=abc'),400],
  ['Mesh Textur zu kurz',PUT('/api/entwurf/mesh/x-'+sx,mesh('A','0'.repeat(4095))),400],
  ['Mesh Textur Zeichen',PUT('/api/entwurf/mesh/x-'+sx,mesh('A','z'.repeat(4096))),400],
  ['Ringe Teil unbekannt',PUT('/api/entwurf/mesh/x-'+sx,{...mesh('A'),rings:{tail:{'0':[100,100]}}}),400],
  ['Ringe Wert zu groß',PUT('/api/entwurf/mesh/x-'+sx,{...mesh('A'),rings:{torso:{'0':[250,100]}}}),400],
  ['Ringe Nummer',PUT('/api/entwurf/mesh/x-'+sx,{...mesh('A'),rings:{torso:{'9':[100,100]}}}),400],
  ['Verlauf Richtung',PUT('/api/entwurf/mesh/x-'+sx,{...mesh('A'),grad:{torso:{m:1,c:[1,2],d:'x',a:0,b:100}}}),400],
  ['Verlauf Farbe',PUT('/api/entwurf/mesh/x-'+sx,{...mesh('A'),grad:{torso:{m:1,c:[1,12],d:'v',a:0,b:100}}}),400],
  ['Ringe Liste',PUT('/api/entwurf/mesh/x-'+sx,{...mesh('A'),rings:[1]}),400],
  ['Mesh ohne Name',PUT('/api/entwurf/mesh/x-'+sx,{...mesh('A'),name:''}),400],
  ['Textur bei Avatar',PUT('/api/entwurf/avatar/x-'+sx,{...av('T'),tex:'0'.repeat(4096)}),400],
  ['Entwurf unbekannt',W('/api/entwurf/avatar/gibtsnicht-'+sx),404]];
 const res=await Promise.all(cases.map(c=>c[1].then(r=>r.status)));
 console.log('Ungültiges abgelehnt',JSON.stringify(cases.map((c,i)=>c[0]+':'+res[i])),res.every((s,i)=>s===cases[i][2]));
 const still=await W('/api/entwurf/avatar').then(r=>r.json());console.log('Abgelehntes nicht gespeichert',!still.entwuerfe.some(e=>e.id==='x-'+sx),still.entwuerfe.find(e=>e.id===idA).v===2);
 /* Versionsgrenze */
 const idV='ver-'+sx;let lastS=0;for(let i=0;i<21;i++){lastS=(await PUT('/api/entwurf/haus/'+idV,haus('V'+i))).status}
 console.log('Höchstens 20 Versionen',lastS,lastS===507);
 /* Seite unter /designer/ und Speicher-Leiste */
 const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
 const ctx=await b.newContext({viewport:{width:1280,height:760},extraHTTPHeaders:{authorization:AUTH}});
 await ctx.route(/cdn\.jsdelivr\.net\/npm\/three@0\.160\.0\/build\/three\.module\.js/,r=>r.fulfill({path:path.join(__dirname,'..','node_modules/three/build/three.module.js'),contentType:'text/javascript'}));
 await ctx.route(/fonts\.(googleapis|gstatic)\.com/,r=>r.abort());
 const p=await ctx.newPage();p.on('pageerror',e=>console.log('ERR',e.message));
 await p.goto(BASE+'/designer/haus.html');await p.waitForFunction('window.__haus&&window.__haus.ready',null,{timeout:30000});
 const idU='ui-'+sx;
 await p.evaluate(()=>{const h=__haus;h.put(2,0,2,'block',3,0);h.put(3,0,2,'block',3,0);h.put(2,1,2,'gable',10,0)});
 await p.fill('#srv-name','UI Haus '+sx);await p.click('#srv-save');await p.waitForFunction("/Gespeichert/.test(document.getElementById('srv-msg').textContent)",null,{timeout:10000});
 const m1=await p.textContent('#srv-msg');
 await p.evaluate(()=>{__haus.plot.cells.clear();__haus.plot.cg.forEach(g=>__haus.plot.g.remove(g));__haus.plot.cg.clear()});
 const leer=await p.evaluate(()=>__haus.plot.cells.size);
 await p.selectOption('#srv-list',{label:new RegExp('x').source&&(await p.$$eval('#srv-list option',o=>o.find(x=>/UI Haus/.test(x.textContent)).textContent))});
 await p.click('#srv-load');await p.waitForFunction("/Geladen/.test(document.getElementById('srv-msg').textContent)",null,{timeout:10000});
 const nach=await p.evaluate(()=>__haus.plot.cells.size);
 console.log('Speicher-Leiste speichert und lädt',JSON.stringify({m1,leer,nach}),/Version 1/.test(m1)&&leer===0&&nach===3);
 await p.screenshot({path:process.env.SHOT||'/tmp/srv.png'});
 /* Ohne Server (lokaler Dateiserver ohne /api): freundliche Meldung statt Absturz */
 const q=await ctx.newPage();await q.route('**/api/entwurf/**',r=>r.fulfill({status:404,body:'nix'}));await q.goto(BASE+'/designer/round.html');await q.waitForFunction('window.__rnd',null,{timeout:30000});await q.waitForTimeout(500);
 const km=await q.textContent('#srv-msg');console.log('Ohne Server',JSON.stringify(km),/Kein Server/.test(km));
 /* Bremse: ab 20 Speicherungen pro Minute 429 (die Versuche oben zählen mit) */
 let got429=false;for(let i=0;i<120&&!got429;i++){const r=await PUT('/api/entwurf/avatar/br-'+sx,av('Bremse'));if(r.status===429)got429=true}
 console.log('Bremse greift',got429);
 await b.close();
})().catch(e=>console.log('ERR',e.message));
