// Planner: Dokument-Prüfung und Speicher (Durable-Object-Klasse mit Attrappe) und die Seite im Browser (Anlegen, Verbinden, Ziehen, Zoomen, Speichern, Neuladen).
// Läuft ohne Cloudflare: ein kleiner lokaler Server liefert dist/planner.html und spielt /api/planner mit der echten Planner-Klasse.
const {chromium}=require('playwright');const http=require('http'),fs=require('fs'),path=require('path'),{pathToFileURL}=require('url');
const wait=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
 const {cleanDoc,Planner}=await import(pathToFileURL(path.join(__dirname,'..','..','..','worker','planner.js')).href);
 const doc0=()=>({v:1,root:'g0',title:'T',graphs:{g0:{id:'g0',name:'Spiel',parent:null,nodes:{a:{id:'a',type:'scene',title:'A',text:'x',x:0,y:0},b:{id:'b',type:'branch',title:'B',text:'',x:300,y:0,mandatory:true}},edges:[{id:'e1',from:'a',to:'b',label:'ja'}]}}});
 /* Dokument-Prüfung */
 const ok=cleanDoc(doc0());
 console.log('gültiges Dokument bleibt erhalten',!!ok&&Object.keys(ok.graphs.g0.nodes).length===2&&ok.graphs.g0.edges.length===1&&ok.graphs.g0.nodes.b.mandatory===true);
 console.log('falsche Version abgelehnt',cleanDoc({...doc0(),v:2})===null);
 console.log('Kante auf fehlenden Knoten abgelehnt',cleanDoc((()=>{const d=doc0();d.graphs.g0.edges.push({id:'e2',from:'a',to:'zz'});return d})())===null);
 console.log('Selbstschleife abgelehnt',cleanDoc((()=>{const d=doc0();d.graphs.g0.edges.push({id:'e2',from:'a',to:'a'});return d})())===null);
 console.log('unbekannte Knotenart abgelehnt',cleanDoc((()=>{const d=doc0();d.graphs.g0.nodes.a.type='evil';return d})())===null);
 console.log('Wurzel muss existieren',cleanDoc({...doc0(),root:'nix'})===null);
 console.log('doppelte Kante wird entfernt',(()=>{const d=doc0();d.graphs.g0.edges.push({id:'e3',from:'a',to:'b'});return cleanDoc(d).graphs.g0.edges.length===1})());
 console.log('Text wird gekürzt, Koordinaten begrenzt',(()=>{const d=doc0();d.graphs.g0.nodes.a.text='y'.repeat(9000);d.graphs.g0.nodes.a.x=1e12;const c=cleanDoc(d).graphs.g0.nodes.a;return c.text.length===4000&&c.x===1e6})());
 console.log('Kapitel mit toter Verknüpfung verliert sie',(()=>{const d=doc0();d.graphs.g0.nodes.a.type='chapter';d.graphs.g0.nodes.a.graph='weg';return cleanDoc(d).graphs.g0.nodes.a.graph===undefined})());
 /* Speicher mit Attrappe */
 const mem=new Map(),P=new Planner({storage:{get:async k=>mem.get(k),put:async o=>{for(const k in o)mem.set(k,o[k])}}});
 const call=async(m,body,p='/api/planner')=>{const r=await P.fetch(new Request('http://x'+p,{method:m,body:body==null?undefined:(typeof body==='string'?body:JSON.stringify(body))}));let j=null;try{j=await r.json()}catch(e){}return {s:r.status,j}};
 const g0=await call('GET');console.log('leer: doc null, rev 0',g0.s===200&&g0.j.doc===null&&g0.j.rev===0);
 const p1=await call('PUT',{rev:0,doc:doc0()});console.log('Speichern mit rev 0',p1.s===200&&p1.j.rev===1);
 const p2=await call('PUT',{rev:0,doc:doc0()});console.log('Veralteter Stand ergibt 409',p2.s===409&&p2.j.rev===1);
 const p3=await call('PUT',{rev:1,doc:{v:1}});console.log('Ungültiges Dokument ergibt 400',p3.s===400);
 const p4=await call('PUT','kein json');console.log('Kein JSON ergibt 400',p4.s===400);
 const p5=await call('PUT',JSON.stringify({rev:1,doc:doc0(),pad:'z'.repeat(1600000)}));console.log('Zu groß ergibt 413',p5.s===413);
 const g1=await call('GET');console.log('lesen liefert gespeichertes',g1.j.rev===1&&g1.j.doc.graphs.g0.nodes.b.title==='B');
 const dl=await call('DELETE');console.log('DELETE nicht erlaubt',dl.s===405);
 /* Seite im Browser */
 mem.clear();
 const html=fs.readFileSync(path.join(__dirname,'..','dist','planner.html'));
 const srv=http.createServer(async(rq,s)=>{const u=rq.url.split('?')[0];
  if(u==='/planner'){s.writeHead(200,{'content-type':'text/html; charset=utf-8'});s.end(html);return}
  if(u==='/api/planner'){const chunks=[];for await(const c of rq)chunks.push(c);const r=await P.fetch(new Request('http://x/api/planner',{method:rq.method,body:rq.method==='PUT'?Buffer.concat(chunks).toString():undefined}));s.writeHead(r.status,{'content-type':'application/json'});s.end(await r.text());return}
  s.writeHead(404);s.end()});
 await new Promise(r=>srv.listen(8932,r));
 const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:1200,height:760}});const p=await ctx.newPage();
 p.on('pageerror',e=>console.log('ERR Seite',e.message));p.on('dialog',d=>d.accept());
 await p.goto('http://localhost:8932/planner');await p.waitForFunction('window.__planner');
 console.log('Seite startet leer mit Hinweis',await p.evaluate(()=>!document.querySelector('#hint').hidden&&!document.querySelector('.node')));
 console.log('Tab-Leiste mit Auswertung und Planner',await p.evaluate(()=>[...document.querySelectorAll('.tabs a')].map(a=>a.textContent+':'+a.getAttribute('href')).join('|')==='Auswertung:/stats|Planner:/planner'));
 /* anlegen per Knopf und per Doppelklick */
 await p.click('#add-scene');await p.waitForSelector('#f-title');await p.fill('#f-title','Start am Strand');
 await p.click('#add-branch');await p.fill('#f-title','Hat Schlüssel?');
 await p.dblclick('#stage',{position:{x:900,y:500}});await p.fill('#f-title','Gruft');
 const n3=await p.evaluate(()=>Object.values(__planner.doc().graphs.g0.nodes));
 console.log('drei Knoten angelegt',n3.length===3&&n3.map(n=>n.title).sort().join('|')==='Gruft|Hat Schlüssel?|Start am Strand');
 console.log('Titel erscheint im Kasten',await p.evaluate(()=>[...document.querySelectorAll('.node .ti')].map(e=>e.textContent).includes('Start am Strand')));
 /* ziehen: Knoten auf bekannte Plätze, dann verbinden */
 const id=t=>n3.find(n=>n.title===t).id;
 const place=async(t,x,y)=>{const r=await p.locator(`.node[data-id="${id(t)}"]`).boundingBox();await p.mouse.move(r.x+60,r.y+10);await p.mouse.down();await p.mouse.move(x,y,{steps:6});await p.mouse.up()};
 await place('Start am Strand',150,150);await place('Hat Schlüssel?',500,150);await place('Gruft',850,300);
 const pos=await p.evaluate(()=>Object.values(__planner.doc().graphs.g0.nodes).map(n=>n.title+':'+Math.round(n.x)+','+Math.round(n.y)));
 console.log('Ziehen verschiebt Knoten',JSON.stringify(pos));
 const link=async(a,c)=>{const o=await p.locator(`.node[data-id="${id(a)}"] .h.o`).boundingBox(),t=await p.locator(`.node[data-id="${id(c)}"]`).boundingBox();await p.mouse.move(o.x+9,o.y+9);await p.mouse.down();await p.mouse.move(t.x+80,t.y+20,{steps:8});await p.mouse.up()};
 await link('Start am Strand','Hat Schlüssel?');await link('Hat Schlüssel?','Gruft');await link('Hat Schlüssel?','Start am Strand');
 await link('Start am Strand','Hat Schlüssel?');
 const es=await p.evaluate(()=>__planner.doc().graphs.g0.edges.length);
 console.log('drei Verbindungen, doppelte wird nicht angelegt',es===3);
 console.log('Verbindungen gezeichnet',await p.evaluate(()=>document.querySelectorAll('#eg g[data-edge]').length===3));
 /* Beschriftung */
 await p.fill('#f-label','ja');
 console.log('Beschriftung gespeichert und gezeichnet',await p.evaluate(()=>__planner.doc().graphs.g0.edges.some(e=>e.label==='ja')&&[...document.querySelectorAll('#eg text')].some(t=>t.textContent==='ja')));
 /* Zoom und Verschieben der Ansicht */
 const k0=await p.evaluate(()=>__planner.view().k);await p.mouse.move(600,400);await p.mouse.wheel(0,-300);await wait(100);
 const k1=await p.evaluate(()=>__planner.view().k);console.log('Mausrad zoomt hinein',k1>k0);
 const v0=await p.evaluate(()=>({...__planner.view()}));await p.mouse.move(700,650);await p.mouse.down();await p.mouse.move(760,690,{steps:5});await p.mouse.up();
 const v1=await p.evaluate(()=>({...__planner.view()}));console.log('Fläche ziehen verschiebt Ansicht',Math.round(v1.x-v0.x)===60&&Math.round(v1.y-v0.y)===40);
 await p.click('#fit');console.log('Einpassen zeigt alles',await p.evaluate(()=>{const s=document.querySelector('#stage').getBoundingClientRect();return [...document.querySelectorAll('.node')].every(e=>{const r=e.getBoundingClientRect();return r.left>=s.left-1&&r.right<=s.right+1&&r.top>=s.top-1&&r.bottom<=s.bottom+1})}));
 /* Speichern und Neuladen */
 await p.waitForFunction("document.querySelector('#status').textContent==='Gespeichert'",null,{timeout:8000});
 console.log('Status Gespeichert und Server hat rev',await p.evaluate(()=>__planner.rev()>=1));
 await p.reload();await p.waitForFunction('window.__planner');
 console.log('nach Neuladen 3 Knoten, 3 Verbindungen',await p.evaluate(()=>document.querySelectorAll('.node').length===3&&document.querySelectorAll('#eg g[data-edge]').length===3));
 /* Löschen: Verbindung per Klick, Knoten per Entf */
 const edgeBox=await p.evaluate(()=>{const e=document.querySelector('#eg g[data-edge] path.hit'),m=e.getPointAtLength(e.getTotalLength()/2),c=e.getScreenCTM();return {x:c.a*m.x+c.e,y:c.d*m.y+c.f}});
 await p.mouse.click(edgeBox.x,edgeBox.y);console.log('Klick auf Verbindung wählt sie',await p.evaluate(()=>__planner.sel()&&__planner.sel().kind==='edge'));
 await p.keyboard.press('Delete');console.log('Entf löscht Verbindung',await p.evaluate(()=>__planner.doc().graphs.g0.edges.length===2));
 const nb=await p.locator('.node').first().boundingBox();await p.mouse.click(nb.x+60,nb.y+12);await p.keyboard.press('Delete');
 console.log('Entf löscht Knoten samt seiner Verbindungen',await p.evaluate(()=>{const g=__planner.doc().graphs.g0;return Object.keys(g.nodes).length===2&&g.edges.every(e=>g.nodes[e.from]&&g.nodes[e.to])}));
 console.log('Tippen in Feld löscht keinen Knoten',await (async()=>{const n=await p.locator('.node').first().boundingBox();await p.mouse.click(n.x+60,n.y+12);await p.fill('#f-text','abc');await p.focus('#f-text');await p.keyboard.press('Backspace');return p.evaluate(()=>Object.keys(__planner.doc().graphs.g0.nodes).length===2&&document.querySelector('#f-text').value==='ab')})());
 /* veralteter Stand */
 await p.waitForFunction("document.querySelector('#status').textContent==='Gespeichert'",null,{timeout:8000});
 await call('PUT',{rev:(await call('GET')).j.rev,doc:doc0()});
 await p.click('#add-note');await p.waitForFunction("document.querySelector('#status').textContent==='Veraltet'",null,{timeout:8000});
 console.log('Zweites Gerät überschrieben: Seite warnt',await p.evaluate(()=>document.querySelector('#warn').classList.contains('on')));
 /* Handy */
 const m=await b.newContext({viewport:{width:390,height:800},hasTouch:true});const q=await m.newPage();q.on('pageerror',e=>console.log('ERR Seite',e.message));
 await q.goto('http://localhost:8932/planner');await q.waitForFunction('window.__planner');
 console.log('Handybreite ohne waagerechtes Scrollen',await q.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1&&document.body.scrollWidth<=window.innerWidth+1));
 if(process.env.SHOT)await p.screenshot({path:process.env.SHOT});
 await b.close();srv.close();
})();
