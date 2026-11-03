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
 /* fremde Herkunft */
 const r=await ctx.request.get(BASE+'/api/room/'+raum,{headers:{upgrade:'websocket',origin:'https://boese.example','sec-websocket-key':'dGhlIHNhbXBsZSBub25jZQ==','sec-websocket-version':'13',connection:'Upgrade'}});
 console.log('Fremde Herkunft',r.status());
 const r2=await ctx.request.get(BASE+'/api/room/Boese Name');console.log('Ungültiger Name',r2.status());
 const r3=await ctx.request.get(BASE+'/api/room/'+raum);console.log('Ohne WebSocket',r3.status());
 const anon=await b.newContext();const r4=await anon.request.get(BASE+'/api/room/'+raum,{headers:{upgrade:'websocket'}});console.log('Ohne Passwort',r4.status());
 await b.close()})();
