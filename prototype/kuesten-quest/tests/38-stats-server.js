// Auswertung gegen einen lokalen Worker: Einsenden, Passwörter (Seite und Auswertung getrennt), Zahlen, Seite im Browser, Spiel sendet wirklich.
// Vorher:  cd quasifornia && npx wrangler dev --local --port 8790 --var SITE_PASSWORD:testpw --var STATS_PASSWORD:statspw
const {chromium}=require('playwright');const http=require('http'),fs=require('fs'),path=require('path');
const BASE='http://localhost:8790',SITE='Basic '+Buffer.from('x:testpw').toString('base64'),STATS='Basic '+Buffer.from('x:statspw').toString('base64');
const wait=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
 try{const r=await fetch(BASE+'/api/graffiti',{headers:{authorization:SITE}});if(!r.ok)throw 0}catch(e){console.log('übersprungen: kein lokaler Worker (npx wrangler dev --local --port 8790 --var SITE_PASSWORD:testpw --var STATS_PASSWORD:statspw)');return}
 const post=(b,auth=SITE)=>fetch(BASE+'/api/stats',{method:'POST',body:JSON.stringify(b),headers:{authorization:auth,'content-type':'text/plain'}});
 const sum=async(auth=STATS)=>(await fetch(BASE+'/api/stats/summary?days=14',{headers:{authorization:auth}}));
 await fetch(BASE+'/api/stats/reset',{method:'POST',headers:{authorization:STATS}});
 console.log('Auswertung mit Seitenpasswort (gewollt abgelehnt)',(await sum(SITE)).status);
 console.log('Auswertung ohne Passwort',(await fetch(BASE+'/api/stats/summary')).status);
 console.log('Einsenden mit Seitenpasswort',(await post({sid:'abcdef123456',pid:'pidAnton001',name:'Anton',play:5,ev:[]})).status);
 console.log('Einsenden ohne Passwort',(await fetch(BASE+'/api/stats',{method:'POST',body:'{}'})).status);
 console.log('Seite /stats mit Seitenpasswort (gewollt abgelehnt, 401)',(await fetch(BASE+'/stats',{headers:{authorization:SITE}})).status);console.log('Seite /stats mit Auswertungspasswort (200)',(await fetch(BASE+'/stats',{headers:{authorization:STATS}})).status);
 const sid=n=>'sess'+String(n).padStart(8,'0');
 const S=[['pAnton00001','Anton','d',1200,42,'GPU Desktop',60,'test'],['pMia0000002','Mia','m',600,12,'Mali-G78',22,'test'],['pTom0000003','Tom','d',300,5,'GPU Desktop',58,''],['pEmma000004','Emma','m',2400,77,'Adreno 650',41,'test']];
 let i=0;for(const [pid,name,dev,play,sc,gpu,fps,room] of S){i++;
  const evs=[['start','0',1,null,null,0],['item','funk',1,10*i,5,0],['sc','Auftrag: Küsten-Eis',8,null,null,0],['q','sammeln',1,null,null,0],['sc','Skin: Mint',-12,null,null,0]];
  if(i===1)evs.push(['err','TypeError: Cannot read properties of undefined (reading \'x\') @kuesten-quest:1234',2,12,34,0],['stuck','',5,100,-44,0],['stuck','',6,101,-45,0],['unstick','',1,100,-44,0],['pol','alarm',1,5,5,0],['gr','illegal',300,5,5,0],['lad','down',1,0,0,0],['bq','gave',1,null,null,0],['sc','Serafin',-3,null,null,0]);
  if(i===2)evs.push(['err','Versprechen: Failed to fetch',1,0,0,1],['ws','fehler',1,null,null,0],['fps','niedrig',19,40,60,0],['stuck','',4.4,-120,200,0]);
  if(i===4)evs.push(['q','tricks',1,null,null,0],['q','graffiti',1,null,null,0],['portal','Reise zu Welt 2',1,5,5,0],['sc','Reise zu Welt 2',-5,null,null,0]);
  const r=await post({sid:sid(i),pid,name,ver:'1103-1200',dev,ua:'Test',w:dev==='m'?800:1400,h:600,gpu,room,play,lvl:0,under:i===1?1:0,sc,fps,fr:1000,slow:dev==='m'?150:10,ev:evs});if(!r.ok)console.log('Einsenden fehlgeschlagen',r.status)}
 for(let rd=0;rd<4;rd++){await wait(900);for(let k=1;k<=S.length;k++)await post({sid:sid(k),pid:S[k-1][0],name:S[k-1][1],play:60,ev:[]})}
 const d=await (await sum()).json();
 console.log('Zahlen',JSON.stringify({spieler:d.total.players,sitzungen:d.total.sessions,spielzeit:d.total.play,online:d.online.count,raeume:d.rooms,quests:d.quests.map(q=>q.key+':'+q.players).join(' '),fehler:d.errors.length,haenger:d.stuck.cells.length,scoopsEin:d.scoops.earned,scoopsAus:d.scoops.spent,handyFps:d.perf.m.medianFps,ws:d.net}));
 await post({sid:sid(9),pid:'pSpam000001',name:'Spam',play:5,ev:[['sc','x',1,null,null,0]]});await post({sid:sid(9),pid:'pSpam000001',name:'Spam',play:5,ev:[['sc','x',1,null,null,0]]});
 const dsp=await (await sum()).json();console.log('Zweites Paket sofort nicht doppelt gezählt',dsp.players.find(p=>p.name==='Spam').play===5);
 const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:1250,height:1500},extraHTTPHeaders:{authorization:STATS}});const p=await ctx.newPage();p.on('pageerror',e=>console.log('ERR Seite',e.message));
 await p.goto(BASE+'/stats');await p.waitForSelector('.kpi',{timeout:15000});await wait(500);
 const inh=await p.evaluate(()=>({titel:document.title,kacheln:[...document.querySelectorAll('.tile .l')].map(e=>e.textContent).slice(0,6),karten:document.querySelectorAll('.card').length,fehlerZeilen:document.querySelectorAll('table td .crit').length,spielerZeilen:[...document.querySelectorAll('h2')].find(h=>h.textContent==='Spieler').parentElement.querySelectorAll('tbody tr').length,saeulen:document.querySelectorAll('.col').length,balken:document.querySelectorAll('.bar').length}));
 console.log('Seite',JSON.stringify(inh));
 if(process.env.SHOT)await p.screenshot({path:process.env.SHOT,fullPage:true});
 const m=await b.newContext({viewport:{width:390,height:800},colorScheme:'dark',extraHTTPHeaders:{authorization:STATS}});const q=await m.newPage();await q.goto(BASE+'/stats');await q.waitForSelector('.kpi');
 console.log('Handybreite ohne waagerechtes Scrollen',await q.evaluate(()=>{const w=window.innerWidth,bad=[...document.querySelectorAll('body *')].filter(e=>e.getBoundingClientRect().right>w+1&&!e.closest('.tw')&&!e.closest('.tip')).slice(0,3).map(e=>e.tagName+'.'+e.className);return {ok:document.documentElement.scrollWidth<=w+1,breit:document.documentElement.scrollWidth,zuBreit:bad}}));
 if(process.env.SHOT2)await q.screenshot({path:process.env.SHOT2,fullPage:false});
 await b.close();
 const srv=http.createServer((rq,s)=>{const u=rq.url.split('?')[0];
  if(u.startsWith('/api/')){const pr=http.request({host:'localhost',port:8790,path:rq.url,method:rq.method,headers:{...rq.headers,host:'localhost:8790',authorization:SITE}},r=>{s.writeHead(r.statusCode,r.headers);r.pipe(s)});rq.pipe(pr);return}
  const f=u==='/'?path.join(__dirname,'..','dist/dev.html'):path.join(__dirname,'..',u);fs.readFile(f,(e,dd)=>{if(e){s.writeHead(404);s.end();return}s.writeHead(200,{'content-type':f.endsWith('.js')?'text/javascript; charset=utf-8':'text/html; charset=utf-8'});s.end(dd)})});
 await new Promise(r=>srv.listen(8931,r));
 const b2=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});const c2=await b2.newContext({viewport:{width:900,height:560}});await c2.route(/fonts/,r=>r.abort());const g=await c2.newPage();g.on('pageerror',e=>{if(!/Absichtlicher/.test(e.message))console.log('ERR Spiel',e.message)});
 await g.goto('http://localhost:8931/?test=1&stats=1&name=Testerin');await g.waitForFunction('window.__ready',null,{timeout:120000});
 await g.evaluate(()=>{localStorage.clear();const q=__qa;q.applyLevel(0);q.beginPlay();q.G.phase='play';q.SC.n=50;setInterval(()=>q.step(.05),50)});
 await wait(1500);
 await g.evaluate(()=>{const q=__qa;q.scAdd(7,'Auftrag: Testauftrag');q.scAdd(-3,'Skin: Test');q.auComplete('sammeln');setTimeout(()=>{throw new Error('Absichtlicher Testfehler')},10)});
 await wait(800);
 await g.evaluate(()=>__qa.statFlush(true));await wait(1200);
 const d2=await (await sum()).json(),mine=d2.players.find(p=>p.name==='Testerin');
 console.log('Spiel sendet',JSON.stringify({gefunden:!!mine,scoops:mine&&mine.sc,quest:d2.quests.some(q=>q.key==='sammeln'),testfehler:d2.errors.some(e=>/Absichtlicher Testfehler/.test(e.key)),grund:d2.scoops.reasons.some(r=>r.key==='Auftrag: Testauftrag'),skin:d2.scoops.reasons.some(r=>r.key==='Skin: Test'),spielzeit:mine&&mine.play>0}));
 const g2=await c2.newPage();await g2.goto('http://localhost:8931/?test=1&name=Stumm');await g2.waitForFunction('window.__ready',null,{timeout:120000});await g2.evaluate(()=>{__qa.statFlush(true)});await wait(800);
 const d3=await (await sum()).json();console.log('Test ohne ?stats bleibt stumm',!d3.players.some(p=>p.name==='Stumm'));
 await b2.close();srv.close();
 await fetch(BASE+'/api/stats/reset',{method:'POST',headers:{authorization:STATS}});
})();
