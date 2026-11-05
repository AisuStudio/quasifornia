// Geteilte Glitch-Reparaturen (UBIQ, zwei Browser, lokaler Worker): Wer zuerst repariert, bekommt die Scoops, der andere sieht es als repariert und verliert keine Ladung.
// Vorher:  cd quasifornia && npx wrangler dev --local --port 8790 --var SITE_PASSWORD:testpw --var STATS_PASSWORD:statspw
const {chromium}=require('playwright');const http=require('http'),fs=require('fs'),path=require('path');
const WK={host:'localhost',port:8790},AUTH='Basic '+Buffer.from('x:testpw').toString('base64'),SAUTH='Basic '+Buffer.from('x:statspw').toString('base64');
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const srv=http.createServer((q,s)=>{const u=q.url.split('?')[0];
  if(u.startsWith('/api/')){const pr=http.request({...WK,path:q.url,method:q.method,headers:{...q.headers,host:'localhost:8790',authorization:AUTH}},r=>{s.writeHead(r.statusCode,r.headers);r.pipe(s)});q.pipe(pr);return}
  const f=u==='/'?path.join(__dirname,'..','dist/dev.html'):path.join(__dirname,'..',u);fs.readFile(f,(e,d)=>{if(e){s.writeHead(404);s.end();return}s.writeHead(200,{'content-type':f.endsWith('.js')?'text/javascript; charset=utf-8':'text/html; charset=utf-8'});s.end(d)})});
srv.listen(8950,async()=>{
 const W=(p,o={},a=AUTH)=>fetch('http://localhost:8790'+p,{...o,headers:{authorization:a,...(o.headers||{})}});
 try{const r=await W('/api/graffiti');if(!r.ok)throw 0}catch(e){console.log('übersprungen: kein lokaler Worker (npx wrangler dev --local --port 8790 --var SITE_PASSWORD:testpw --var STATS_PASSWORD:statspw)');srv.close();return}
 /* Schnittstelle */
 console.log('Zurücksetzen nur mit Auswertungs-Passwort',(await W('/api/glitch/reset',{method:'POST'})).status,(await W('/api/glitch/reset',{method:'POST'},SAUTH)).status);
 console.log('Liste leer',JSON.stringify(await W('/api/glitch').then(r=>r.json())));
 const c1=await W('/api/glitch/test-eins',{method:'POST',body:JSON.stringify({name:'Anton'})}).then(r=>r.json()),c2=await W('/api/glitch/test-eins',{method:'POST',body:JSON.stringify({name:'Mia'})}).then(r=>r.json());
 console.log('Erster gewinnt',JSON.stringify(c1),JSON.stringify(c2),c1.first===true&&c2.first===false&&c2.by==='Anton');
 const par=await Promise.all([1,2,3,4,5].map(i=>W('/api/glitch/test-zwei',{method:'POST',body:JSON.stringify({name:'S'+i})}).then(r=>r.json())));console.log('Gleichzeitig: genau einer gewinnt',par.filter(x=>x.first).length===1);
 console.log('Ungültige Kennung',(await W('/api/glitch/Gross!',{method:'POST'})).status,(await W('/api/glitch/x'.padEnd(60,'x'),{method:'POST'})).status);
 console.log('Ohne Passwort',(await fetch('http://localhost:8790/api/glitch')).status);
 await W('/api/glitch/reset',{method:'POST'},SAUTH);
 /* Zwei Spieler */
 const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
 const open=async(name)=>{const ctx=await b.newContext({viewport:{width:900,height:560}});await ctx.route(/fonts/,r=>r.abort());await ctx.route('**/api/graffiti**',r=>r.fulfill({status:404,body:''}));const p=await ctx.newPage();p.on('pageerror',e=>console.log('ERR',name,e.message));
   await p.goto('http://localhost:8950/?test=1&name='+name);await p.waitForFunction('window.__ready',null,{timeout:120000});await p.click('#next1').then(()=>p.click('#go')).then(()=>p.click('#start'));
   await p.evaluate(()=>{localStorage.removeItem('kq-ubiq');const q=__qa;q.G.phase='play';q.DLG.open=false;document.getElementById('dlg').hidden=true;q.UBQ.own=true;q.UBQ.ch=5;q.UBQ.fixed.clear();q.UBQ.list.forEach(g=>{g.seen=true});q.SC.n=50;for(let i=0;i<3;i++)q.step(.03)});await wait(600);return p};
 const A=await open('Anton'),B=await open('Mia');
 const ok=p=>p.evaluate(()=>({server:__qa.UBQ.srv.ok,n:__qa.UBQ.list.length}));console.log('Beide am Server',JSON.stringify(await ok(A)),JSON.stringify(await ok(B)));
 await A.evaluate(()=>{const q=__qa,g=q.UBQ.list[0];window.__id=g.id;q.ubiqUse(g)});await wait(700);
 const a=await A.evaluate(()=>{const q=__qa,g=q.UBQ.list.find(x=>x.id===window.__id);return {fixed:g.fixed,ch:q.UBQ.ch,scoops:q.SC.n}});console.log('A repariert',JSON.stringify(a),a.fixed&&a.ch===4&&a.scoops===65);
 /* B hat noch nicht abgeglichen und versucht es: bekommt nichts, verliert nichts */
 const bb=await B.evaluate(async()=>{const q=__qa,g=q.UBQ.list.find(x=>x.id===window.__id||x.id===q.UBQ.list[0].id);const id=g.id;const before=g.fixed;q.ubiqUse(g);await new Promise(r=>setTimeout(r,800));return {vorher:before,fixed:g.fixed,ch:q.UBQ.ch,scoops:q.SC.n,von:g.byOther}});
 console.log('B zu spät',JSON.stringify(bb),bb.vorher===false&&bb.fixed&&bb.ch===5&&bb.scoops===50&&bb.von==='Anton');
 /* Abgleich: ein dritter Glitch, den A repariert, erscheint bei B ohne Versuch als repariert */
 await A.evaluate(()=>{const q=__qa,g=q.UBQ.list[1];window.__id2=g.id;q.ubiqUse(g)});await wait(700);
 const sy=await B.evaluate(async()=>{const q=__qa;q.ubqSync();await new Promise(r=>setTimeout(r,800));const ids=q.UBQ.list.map(g=>[g.id,g.fixed]);return {ids,ch:q.UBQ.ch,scoops:q.SC.n}});
 console.log('Abgleich bei B',JSON.stringify(sy),sy.ids.filter(x=>x[1]).length>=2&&sy.ch===5&&sy.scoops===50);
 await W('/api/glitch/reset',{method:'POST'},SAUTH);await b.close();srv.close()})
