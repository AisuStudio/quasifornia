// Planner: Heldenreise mit den 22 Karten der Großen Arkana (Narr 0 bis Welt XXI): Charakter-Knoten mit Karte, Vorlage mit 22 Stationen, Kartenleiste, Markdown-Übersicht.
// Echte Planner-Klasse mit SQLite-Attrappe (node:sqlite), dazu die Oberfläche im Browser.
process.removeAllListeners('warning');process.on('warning',()=>{});
const {chromium}=require('playwright');const http=require('http'),fs=require('fs'),path=require('path'),{pathToFileURL}=require('url');
(async()=>{
 const {DatabaseSync}=require('node:sqlite');
 const W=await import(pathToFileURL(path.join(__dirname,'..','..','..','worker','planner.js')).href);
 const {Planner,toMarkdown,cleanDoc,ARCANA,heldenreiseDoc}=W;
 const mkP=()=>{const mem=new Map(),db=new DatabaseSync(':memory:');
  const sql={exec(q,...a){const st=db.prepare(q);if(/^\s*(SELECT|PRAGMA)/i.test(q))return {toArray:()=>st.all(...a).map(r=>({...r}))};st.run(...a);return {toArray:()=>[]}}};
  const P=new Planner({storage:{sql,get:async k=>mem.get(k),put:async o=>{for(const k in o)mem.set(k,o[k])},delete:async k=>{for(const x of [].concat(k))mem.delete(x)}}});let t=1.7e12;P.now=()=>t;return P};
 const N=(id,type,title,x,y,extra={})=>({id,type,title,text:'',x,y,mandatory:false,...extra});
 /* Karten */
 console.log('22 Karten, Narr zuerst, Welt zuletzt',ARCANA.length===22&&ARCANA[0][1]==='Der Narr'&&ARCANA[0][0]==='0'&&ARCANA[21][1]==='Die Welt'&&ARCANA[21][0]==='XXI');
 console.log('Römische Zahlen lückenlos und eindeutig',new Set(ARCANA.map(a=>a[0])).size===22&&ARCANA.every(a=>a[1]&&a[2]));
 /* Dokument-Prüfung */
 const base={v:1,root:'g0',title:'',graphs:{g0:{id:'g0',name:'S',parent:null,nodes:{
  a:N('a','character','Anton',0,0,{card:17}),b:N('b','chapter','Station',200,0,{card:3,graph:'g1'}),c:N('c','scene','Szene',400,0,{card:5}),
  d:N('d','character','Falsch1',0,100,{card:22}),e:N('e','character','Falsch2',0,200,{card:-1}),f:N('f','character','Falsch3',0,300,{card:1.5}),g:N('g','character','Falsch4',0,400,{card:'3'}),h:N('h','character','Ohne',0,500)},edges:[]},
  g1:{id:'g1',name:'Station',parent:'g0',nodes:{},edges:[]}}};
 const cd=cleanDoc(base).graphs.g0.nodes;
 console.log('Altes Format: Knotenart character wird zur Notiz mit Kategorie Charakter, Karte bleibt',cd.a.type==='note'&&cd.a.kind==='character'&&cd.a.card===17);
 console.log('Kapitel darf eine Karte tragen',cd.b.card===3);
 console.log('Szene verliert die Karte',cd.c.card===undefined);
 console.log('Notiz darf eine Karte tragen',cleanDoc({...base,graphs:{...base.graphs,g0:{...base.graphs.g0,nodes:{a:N('a','note','N',0,0,{card:4,kind:'event'})}}}}).graphs.g0.nodes.a.card===4);
 console.log('Ungültige Karten (22, −1, 1,5, Text) fallen weg, Dokument bleibt gültig',[cd.d,cd.e,cd.f,cd.g,cd.h].every(n=>n.card===undefined));
 console.log('Karte 0 (Narr) bleibt erhalten, auch wenn sie falsch wie „leer“ aussieht',cleanDoc({...base,graphs:{...base.graphs,g0:{...base.graphs.g0,nodes:{a:N('a','note','N',0,0,{card:0,kind:'character'})}}}}).graphs.g0.nodes.a.card===0);
 /* Vorlage */
 const hd=heldenreiseDoc('Reise'),ns=hd.graphs.g0.nodes;
 console.log('Vorlage: 22 Kapitel, 22 Unterebenen, 21 Verbindungen',Object.keys(ns).length===22&&Object.keys(hd.graphs).length===23&&hd.graphs.g0.edges.length===21&&Object.values(ns).every(n=>n.type==='chapter'));
 console.log('Vorlage: Karte i an Kapitel i, Titel „Zahl · Name“, Stichwort als Text',Object.values(ns).every((n,i)=>n.card===i&&n.title===ARCANA[i][0]+' · '+ARCANA[i][1]&&n.text===ARCANA[i][2]));
 console.log('Vorlage: Reihenfolge linear von 0 bis XXI',hd.graphs.g0.edges.every((e,i)=>e.from==='c'+i&&e.to==='c'+(i+1)));
 console.log('Vorlage: drei Reihen (8, 7, 7), Abstand ohne Überlappung',ns.c0.x===0&&ns.c0.y===0&&ns.c7.x===7*240&&ns.c7.y===0&&ns.c8.x===0&&ns.c8.y===190&&ns.c14.y===190&&ns.c15.x===0&&ns.c15.y===380&&ns.c21.y===380&&240>190);
 console.log('Vorlage besteht die Dokument-Prüfung unverändert',(()=>{const c=cleanDoc(hd);return !!c&&Object.keys(c.graphs.g0.nodes).length===22&&Object.values(c.graphs.g0.nodes).every((n,i)=>n.card===i&&n.graph==='k'+i)})());
 const P=mkP();
 const call=async(m,u,body)=>{const r=await P.fetch(new Request('http://x'+u,{method:m,body:body==null?undefined:JSON.stringify(body)}));const tx=await r.text();let j=null;try{j=JSON.parse(tx)}catch(e){}return {s:r.status,j,tx}};
 const cr=await call('POST','/api/planner/docs',{name:'Reise',from:'heldenreise'});
 const got=await call('GET','/api/planner?d='+cr.j.id);
 console.log('Entwurf aus Vorlage über die Schnittstelle',cr.s===200&&Object.keys(got.j.doc.graphs.g0.nodes).length===22&&got.j.doc.title==='Reise'&&got.j.rev===0);
 console.log('Vorlage lässt sich unverändert speichern',(await call('PUT','/api/planner?d='+cr.j.id,{rev:0,doc:got.j.doc})).s===200);
 /* Markdown */
 const none=toMarkdown({v:1,root:'g0',title:'',graphs:{g0:{id:'g0',name:'X',parent:null,nodes:{a:N('a','scene','A',0,0)},edges:[]}}},{});
 console.log('Ohne Karten kein Heldenreise-Abschnitt',!/Heldenreise/.test(none));
 const d2=heldenreiseDoc('Reise');d2.graphs.g0.nodes.x1=N('x1','note','Anton',0,600,{card:17,kind:'character',text:'Der Hoffnungsträger'});d2.graphs.g0.nodes.x2=N('x2','note','Mia',240,600,{card:17,kind:'character'});d2.graphs.g0.nodes.x3=N('x3','note','Narrenkind',480,600,{card:0,kind:'character'});
 d2.graphs.k3.nodes.s1=N('s1','scene','Gartenfest',0,0);
 const md=toMarkdown(d2,{name:'Reise',rev:1});
 console.log('Abschnitt „Heldenreise (Große Arkana)“ listet alle 22 Karten',/^## Heldenreise \(Große Arkana\)$/m.test(md)&&ARCANA.every(a=>md.includes('**'+a[0]+' · '+a[1]+'**')));
 console.log('Charaktere stehen bei ihrer Karte',/\*\*XVII · Der Stern\*\* \(Hoffnung\):.*Charaktere: Anton `x1`, Mia `x2`/.test(md)&&/\*\*0 · Der Narr\*\*.*Charaktere: Narrenkind `x3`/.test(md));
 console.log('Charakter-Zeile nennt die Karte',md.includes('**Charakter: Anton** `x1` — Karte XVII · Der Stern'));
 console.log('Station mit Inhalt zählt ihre Knoten, leere werden gemeldet',md.includes('Station „III · Die Herrscherin“ `c3` (1 Knoten)')&&/Stationen ohne Inhalt: .*\bIV\b/.test(md)&&!/Stationen ohne Inhalt: .*\bIII\b/.test(md.split('\n').find(l=>l.startsWith('Stationen ohne Inhalt'))||''));
 d2.graphs.g0.nodes.c5.card=undefined;delete d2.graphs.g0.nodes.c5.card;
 console.log('Karten ohne Station werden gemeldet',/Karten ohne Station: V$/m.test(toMarkdown(d2,{})));
 /* Oberfläche */
 const R=mkP();const html=fs.readFileSync(path.join(__dirname,'..','dist','planner.html'));
 const srv=http.createServer(async(rq,s)=>{const u=rq.url.split('?')[0];
  if(u==='/planner'){s.writeHead(200,{'content-type':'text/html; charset=utf-8'});s.end(html);return}
  if(u.startsWith('/api/planner')){const ch=[];for await(const x of rq)ch.push(x);const body=Buffer.concat(ch).toString();const r=await R.fetch(new Request('http://x'+rq.url,{method:rq.method,body:['PUT','POST'].includes(rq.method)?body:undefined}));s.writeHead(r.status,{'content-type':r.headers.get('content-type')||'application/json'});s.end(await r.text());return}
  s.writeHead(404);s.end()});
 await new Promise(r=>srv.listen(8939,r));
 const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:1300,height:800}});const p=await ctx.newPage();
 p.on('pageerror',e=>console.log('ERR Seite',e.message));p.on('dialog',dl=>dl.accept());
 const saved=()=>p.waitForFunction("document.querySelector('#status').textContent==='Gespeichert'",null,{timeout:8000});
 const nodeByTitle=t=>p.evaluate(t=>Object.values(__planner.doc().graphs[__planner.gid()].nodes).find(n=>n.title===t),t);
 const clickNode=async t=>{const n=await nodeByTitle(t);const bb=await p.locator(`.node[data-id="${n.id}"]`).boundingBox();await p.mouse.click(bb.x+60,bb.y+12);return n};
 await p.goto('http://localhost:8939/planner');await p.waitForFunction('window.__planner');
 console.log('Seite und Server kennen dieselben 22 Karten',await p.evaluate(a=>JSON.stringify(__planner.arcana)===JSON.stringify(a),ARCANA));
 await p.click('#docs');await p.waitForSelector('#d-list .vr');
 console.log('Entwurfsdialog bietet keine Heldenreise-Vorlage mehr, nur Leer und Kopie',await p.evaluate(()=>[...document.querySelectorAll('#d-from option')].map(o=>o.value).join('|')==='blank|copy'));
 await p.click('#d-close');
 console.log('Ohne Karten ist die Leiste verborgen',await p.evaluate(()=>document.querySelector('#cards').hidden));
 await p.selectOption('#tpl','hero');
 const st=i=>p.evaluate(i=>Object.values(__planner.doc().graphs.g0.nodes).find(n=>n.type==='chapter'&&n.card===i).id,i);
 console.log('Vorlage im normalen Planner eingefügt: 22 Kapitel, Stichwort im Kasten',await p.evaluate(()=>document.querySelectorAll('.node.chapter').length===22&&[...document.querySelectorAll('.node.chapter .tx')].some(e=>e.textContent==='Aufbruch')));
 console.log('Kapitelkasten nennt die Karte im Titel, ohne sie doppelt zu zeigen',await p.evaluate(()=>[...document.querySelectorAll('.node.chapter .ti')].some(e=>e.textContent==='XVII · Der Stern')&&!document.querySelector('.node.chapter .cd')));
 console.log('Kartenleiste: 22 Felder von 0 bis XXI, alle als leere Station',await p.evaluate(()=>{const c=[...document.querySelectorAll('#cards .cell')];return !document.querySelector('#cards').hidden&&c.length===22&&c[0].textContent==='0'&&c[21].textContent==='XXI'&&c.every(x=>x.classList.contains('empty'))}));
 await p.click('#cards .cell[data-card="17"]');
 const c17=await st(17),c0=await st(0);
 console.log('Klick auf Feld XVII wählt die Station',await p.evaluate(id=>{const s=__planner.sel();return s&&s.id===id&&document.querySelector('#f-card').value==='17'&&document.querySelector('#insp h2').textContent==='Kapitel'},c17));
 await p.fill('#f-title','Finale');
 console.log('Anderer Titel: Karte erscheint als eigene Zeile auf dem Kapitel',await p.evaluate(id=>{const n=document.querySelector('.node.chapter[data-id="'+id+'"] .cd');return !!n&&n.textContent==='XVII · Der Stern'},c17));
 await p.fill('#f-title','XVII · Der Stern');
 /* Charaktere */
 await p.click('#add-note');await p.fill('#f-title','Anton');await p.selectOption('#f-kind','character');await p.selectOption('#f-card','17');
 console.log('Charakter mit Karte: Karte auf dem Knoten, Zähler im Feld',await p.evaluate(()=>[...document.querySelectorAll('.node.k-character .cd')].some(e=>e.textContent==='XVII · Der Stern')&&document.querySelector('#cards .cell[data-card="17"] sup').textContent==='1'));
 await p.click('#add-note');await p.fill('#f-title','Mia');await p.selectOption('#f-kind','character');await p.selectOption('#f-card','17');
 console.log('Doppelte Karte: Warnung an beiden Charakteren',await p.evaluate(()=>[...document.querySelectorAll('.node.k-character .cd.dup')].length===2&&/doppelt/.test(document.querySelector('.node.k-character .cd.dup').textContent)));
 await p.keyboard.press('Control+z');
 console.log('Strg+Z nimmt die zweite Kartenwahl zurück, Warnung weg',await p.evaluate(()=>document.querySelectorAll('.node.k-character .cd.dup').length===0));
 await p.keyboard.press('Control+Shift+z');await clickNode('Mia');await p.selectOption('#f-card','0');
 console.log('Mia auf Karte 0: Warnung weg, Feld 0 zeigt einen Charakter',await p.evaluate(()=>document.querySelectorAll('.node.k-character .cd.dup').length===0&&document.querySelector('#cards .cell[data-card="0"] sup').textContent==='1'&&document.querySelector('#cards .cell[data-card="17"] sup').textContent==='1'));
 /* Station füllen */
 await p.dblclick('.node.chapter[data-id="'+c17+'"]');await p.waitForFunction("document.querySelectorAll('#crumbs button').length===2");
 console.log('Station öffnet, Brotkrumen „Spiel › XVII · Der Stern“',await p.evaluate(()=>[...document.querySelectorAll('#crumbs button')].map(b=>b.textContent).join('>')==='Spiel>XVII · Der Stern'));
 console.log('In der Station ist das Feld XVII markiert („aktuell“)',await p.evaluate(()=>document.querySelector('#cards .cell[data-card="17"]').classList.contains('cur')));
 await p.click('#add-scene');await p.fill('#f-title','Sternenwiese');
 await p.click('#crumbs button[data-go="g0"]');
 console.log('Station mit Inhalt: Feld XVII voll, Nachbarn leer',await p.evaluate(()=>document.querySelector('#cards .cell[data-card="17"]').classList.contains('full')&&document.querySelector('#cards .cell[data-card="16"]').classList.contains('empty')));
 /* Klick auf Feld mit Charakter, Karte ohne Station */
 await p.click('#cards .cell[data-card="0"]');console.log('Klick auf Feld 0 springt zur Station',await p.evaluate(id=>__planner.sel()&&__planner.sel().id===id,c0));
 /* Art wechseln */
 await p.click('#fit');await clickNode('Anton');await p.selectOption('#f-type','scene');
 console.log('Notiz zur Szene gemacht: Karte entfällt, Feld XVII ohne Zähler',await p.evaluate(()=>{const n=Object.values(__planner.doc().graphs.g0.nodes).find(x=>x.title==='Anton');return n.type==='scene'&&n.card===undefined&&n.kind===undefined&&!document.querySelector('#cards .cell[data-card="17"] sup')&&!document.querySelector('#f-card')}));
 await p.keyboard.press('Control+z');
 console.log('Strg+Z stellt Charakter und Karte wieder her',await p.evaluate(()=>{const n=Object.values(__planner.doc().graphs.g0.nodes).find(x=>x.title==='Anton');return n.type==='note'&&n.kind==='character'&&n.card===17}));
 /* Speichern, Neuladen, Markdown vom Server */
 await saved();const did=await p.evaluate(()=>__planner.did);console.log('Alles im normalen Planner (Hauptplan), kein eigener Modus',did==='main'&&await p.evaluate(()=>location.search===''));await p.reload();await p.waitForFunction('window.__planner');
 console.log('Nach Neuladen: Karten, Charaktere und Leiste sind da',await p.evaluate(()=>document.querySelectorAll('.node.chapter').length===22&&document.querySelectorAll('.node.k-character').length===2&&document.querySelectorAll('#cards .cell').length===22&&document.querySelector('#cards .cell[data-card="17"]').classList.contains('full')));
 const ex=await (await fetch('http://localhost:8939/api/planner/export?d='+did)).text();
 console.log('Markdown vom Server: Heldenreise mit Anton bei Karte XVII und Mia bei 0',/\*\*XVII · Der Stern\*\* \(Hoffnung\): Station .* \(1 Knoten\) · Charaktere: Anton/.test(ex)&&/\*\*0 · Der Narr\*\*.*Charaktere: Mia/.test(ex));
 /* Handy */
 const m=await b.newContext({viewport:{width:390,height:800},hasTouch:true});const q=await m.newPage();q.on('pageerror',e=>console.log('ERR Seite',e.message));
 await q.goto('http://localhost:8939/planner?d='+did);await q.waitForFunction('window.__planner');await q.waitForSelector('#cards .cell');
 console.log('Handybreite: Kartenleiste bricht um, kein waagerechtes Scrollen',await q.evaluate(()=>{const c=document.querySelector('#cards').getBoundingClientRect();return c.right<=window.innerWidth+1&&document.documentElement.scrollWidth<=window.innerWidth+1&&c.height>34}));
 if(process.env.SHOT){await p.click('#fit');await p.waitForTimeout(100);await p.screenshot({path:process.env.SHOT})}
 if(process.env.SHOT2)await q.screenshot({path:process.env.SHOT2});
 await b.close();srv.close();
})();
