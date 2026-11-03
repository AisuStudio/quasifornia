// Raum-Server (worker/room.js) gegen einen lokalen Worker (wrangler dev) mit echten WebSockets:
// Beitritt, Namen und Skins werden geprüft, Positionen verteilt, höchstens 5 Plätze, Verlassen, fremde Herkunft abgelehnt.
// Start vorher:  npx wrangler dev --local --port 8790 --var SITE_PASSWORD:testpw     (im Ordner quasifornia)
const {chromium}=require('playwright');
const BASE=process.env.WORKER||'http://localhost:8790',AUTH='Basic '+Buffer.from('x:testpw').toString('base64');
(async()=>{
 try{const r=await fetch(BASE+'/api/graffiti',{headers:{authorization:AUTH}});if(!r.ok)throw 0}catch(e){console.log('übersprungen: kein lokaler Worker (npx wrangler dev --local --port 8790 --var SITE_PASSWORD:testpw)');return}
 const b=await chromium.launch();const ctx=await b.newContext({extraHTTPHeaders:{authorization:AUTH}});const p=await ctx.newPage();
 await p.goto(BASE+'/api/graffiti');
 const raum='test-'+Math.random().toString(36).slice(2,7);
 const t0=Date.now();const out=await p.evaluate(async([raum])=>{
  const W=(name,skin)=>new Promise(res=>{const ws=new WebSocket((location.protocol==='https:'?'wss://':'ws://')+location.host+'/api/room/'+raum);const o={ws,msgs:[],closed:false,code:0};
    ws.onopen=()=>ws.send(JSON.stringify({t:'hello',name,skin}));ws.onmessage=e=>o.msgs.push(JSON.parse(e.data));ws.onclose=e=>{o.closed=true;o.code=e.code};ws.onerror=()=>{};setTimeout(()=>res(o),500)});
  const wait=ms=>new Promise(r=>setTimeout(r,ms)),R={};
  const a=await W('Anton','#d54291');R.a_welcome=a.msgs.find(m=>m.t==='welcome');
  const b2=await W('<b>Mia</b> sehr langer Name 1234567890','#2499bb');R.b_welcome=b2.msgs.find(m=>m.t==='welcome');R.a_join=a.msgs.filter(m=>m.t==='join');
  /* Position: A sendet, B empfängt, A nicht */
  a.ws.send(JSON.stringify({t:'s',x:12.5,y:1.3,z:-40,h:1.2,v:7,u:0}));await wait(250);R.b_pos=b2.msgs.filter(m=>m.t==='p');R.a_eigene=a.msgs.filter(m=>m.t==='p').length;
  /* ungültige Daten werden nicht verteilt */
  await wait(60);a.ws.send(JSON.stringify({t:'s',x:'a',y:0,z:0,h:0,v:0}));a.ws.send(JSON.stringify({t:'s',x:99999,y:0,z:0,h:0,v:0}));await wait(250);R.b_nach_muell=b2.msgs.filter(m=>m.t==='p').length;
  /* Zeit */
  a.ws.send(JSON.stringify({t:'ping',c:5}));await wait(200);R.pong=a.msgs.find(m=>m.t==='pong');
  /* Rate begrenzt: 20 Nachrichten sofort */
  const vor=b2.msgs.filter(m=>m.t==='p').length;for(let i=0;i<20;i++)a.ws.send(JSON.stringify({t:'s',x:i,y:1,z:0,h:0,v:0}));await wait(300);R.rate_verteilt=b2.msgs.filter(m=>m.t==='p').length-vor;
  /* bis 5 Plätze */
  const c=await W('C','#e5383b'),d=await W('D','D'),e=await W('E','#47c2a5');R.fuenf=[a,b2,c,d,e].every(x=>x.msgs.some(m=>m.t==='welcome'));
  const f=await W('F','#d54291');await wait(1200);R.sechster={voll:f.msgs.some(m=>m.t==='full'),zu:f.closed,code:f.code};
  /* Verlassen */
  d.ws.close();await wait(300);R.leave=a.msgs.some(m=>m.t==='leave'&&m.id===d.msgs.find(x=>x.t==='welcome').id);
  /* danach wieder ein Platz frei */
  const g=await W('G','#d54291');R.nachruecken=g.msgs.some(m=>m.t==='welcome');
  /* Namen ändern */
  b2.ws.send(JSON.stringify({t:'name',name:'Mia Neu'}));await wait(250);R.name=a.msgs.find(m=>m.t==='name');
  [a,b2,c,e,g].forEach(x=>x.ws.close());return R},[raum]);
 const w=out.a_welcome,bw=out.b_welcome;
 console.log('Beitritt A',JSON.stringify({id:!!w.id,uhr:Math.abs(w.now-t0)<3000,spieler:w.players.length,max:w.max}));
 console.log('Beitritt B',JSON.stringify({kennt_A:bw.players.length===1&&bw.players[0].name==='Anton',name_bereinigt:bw.players.length===1&&out.a_join[0].name,skin_ok:out.a_join[0].skin}));
 console.log('Position',JSON.stringify({bEmpfaengt:out.b_pos.length===1&&out.b_pos[0].x===12.5&&out.b_pos[0].z===-40,idStimmt:out.b_pos[0]&&out.b_pos[0].id===w.id,aBekommtEigene:out.a_eigene}));
 console.log('Muell abgewehrt',JSON.stringify({zusaetzlichVerteilt:out.b_nach_muell-out.b_pos.length}));
 console.log('Server-Uhr',JSON.stringify({pong:!!out.pong,echo:out.pong&&out.pong.c,naheAmEchten:out.pong&&Math.abs(out.pong.now-Date.now())<5000}));
 console.log('Rate',JSON.stringify({von20gesendetVerteilt:out.rate_verteilt}));
 console.log('Fünf Plätze',JSON.stringify({alleFuenf:out.fuenf,sechster:out.sechster}));
 console.log('Verlassen',JSON.stringify({leaveGemeldet:out.leave,nachrueckerKommtRein:out.nachruecken}));
 console.log('Name ändern',JSON.stringify({name:out.name&&out.name.name}));
 /* Polizei-Regeln im Raum: Rollen, Abweisung, Weiterleitung */
 const pol=await p.evaluate(async([raum])=>{
  const W=(name)=>new Promise(res=>{const ws=new WebSocket((location.protocol==='https:'?'wss://':'ws://')+location.host+'/api/room/'+raum);const o={ws,msgs:[]};ws.onopen=()=>ws.send(JSON.stringify({t:'hello',name,skin:'#d54291'}));ws.onmessage=e=>o.msgs.push(JSON.parse(e.data));setTimeout(()=>res(o),500)});
  const wait=ms=>new Promise(r=>setTimeout(r,ms)),send=(o,m)=>o.ws.send(JSON.stringify(m)),R={},id=o=>o.msgs.find(m=>m.t==='welcome').id,has=(o,f)=>o.msgs.some(f);
  const a=await W('A'),b=await W('B'),c=await W('C');
  send(a,{t:'pol',a:'start',x:1,z:2});await wait(250);R.a=a.msgs.find(m=>m.t==='pol');
  send(b,{t:'pol',a:'start',x:3,z:4});await wait(250);R.b=b.msgs.find(m=>m.t==='pol');
  send(c,{t:'pol',a:'start',x:5,z:6});await wait(250);R.c=c.msgs.find(m=>m.t==='pol');
  R.keineWarnungFuerAndere=!has(b,m=>m.t==='pol'&&m.a==='new')&&!has(c,m=>m.t==='pol'&&m.a==='new');
  /* nur der Erste darf Polizei-Daten senden */
  send(b,{t:'polz',c:[[1,2,0]],k:[]});await wait(150);R.fremdeDatenWeg=!has(a,m=>m.t==='polz')&&!has(c,m=>m.t==='polz');
  send(a,{t:'polz',c:[[1.5,2.5,0.5]],k:[[1,1,0,0]]});await wait(250);R.relay=has(b,m=>m.t==='polz'&&m.id===id(a))&&has(c,m=>m.t==='polz')&&!has(a,m=>m.t==='polz');
  send(b,{t:'pol',a:'launch',x:7,z:8});await wait(250);R.launch=a.msgs.find(m=>m.t==='pol'&&m.a==='launch');
  send(c,{t:'pol',a:'launch',x:9,z:9});await wait(150);R.dritterLaunch=a.msgs.filter(m=>m.a==='launch').length;
  send(a,{t:'pol',a:'caught',to:id(b)});await wait(250);R.caught=has(b,m=>m.t==='pol'&&m.a==='caught');
  send(c,{t:'pol',a:'end'});await wait(150);R.fremderEnd=!has(a,m=>m.a==='gone');
  send(a,{t:'pol',a:'end'});await wait(250);R.gone=has(b,m=>m.a==='gone')&&has(c,m=>m.a==='gone');
  send(c,{t:'pol',a:'start',x:5,z:6});await wait(250);R.neuerErster=c.msgs.filter(m=>m.t==='pol').pop();
  c.ws.close();await wait(400);R.verlassen=has(a,m=>m.a==='gone');
  [a,b].forEach(o=>o.ws.close());return {R,idA:id(a),idB:id(b)}},[raum+'pol']);
 const R=pol.R;console.log('Polizei Erster',JSON.stringify(R.a),'Zweiter',JSON.stringify(R.b),'Dritter',JSON.stringify(R.c));
 console.log('Polizei Regeln',JSON.stringify({keineWarnungFuerAndere:R.keineWarnungFuerAndere,fremdeDatenWeg:R.fremdeDatenWeg,relay:R.relay,launchBeiErstem:R.launch&&R.launch.from===pol.idB&&R.launch.x===7,dritterLaunchIgnoriert:R.dritterLaunch===1,caughtBeiZweitem:R.caught,fremdesEndeIgnoriert:R.fremderEnd,endeMeldetGone:R.gone,neuerErsterNachEnde:R.neuerErster&&R.neuerErster.role,gonebeiAustritt:R.verlassen}));
 /* fremde Herkunft */
 const r=await ctx.request.get(BASE+'/api/room/'+raum,{headers:{upgrade:'websocket',origin:'https://boese.example','sec-websocket-key':'dGhlIHNhbXBsZSBub25jZQ==','sec-websocket-version':'13',connection:'Upgrade'}});
 console.log('Fremde Herkunft',r.status());
 const r2=await ctx.request.get(BASE+'/api/room/Boese Name');console.log('Ungültiger Name',r2.status());
 const r3=await ctx.request.get(BASE+'/api/room/'+raum);console.log('Ohne WebSocket',r3.status());
 const anon=await b.newContext();const r4=await anon.request.get(BASE+'/api/room/'+raum,{headers:{upgrade:'websocket'}});console.log('Ohne Passwort',r4.status());
 await b.close()})();
