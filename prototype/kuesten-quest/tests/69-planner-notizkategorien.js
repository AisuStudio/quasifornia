// Planner: Notizen mit Kategorie (Charakter, Ereignis, Todo, Gegenstand), Archetyp (Karte der Großen Arkana) und Todo-Status; Migration älterer Dokumente
// mit der Knotenart "character"; Markdown mit offenen Todos. Echte Planner-Klasse mit SQLite-Attrappe, dazu die Oberfläche im Browser.
process.removeAllListeners('warning');process.on('warning',()=>{});
const {chromium}=require('playwright');const http=require('http'),fs=require('fs'),path=require('path'),{pathToFileURL}=require('url');
(async()=>{
 const {DatabaseSync}=require('node:sqlite');
 const W=await import(pathToFileURL(path.join(__dirname,'..','..','..','worker','planner.js')).href);
 const {Planner,toMarkdown,cleanDoc,KINDS}=W;
 const mkP=()=>{const mem=new Map(),db=new DatabaseSync(':memory:');
  const sql={exec(q,...a){const st=db.prepare(q);if(/^\s*(SELECT|PRAGMA)/i.test(q))return {toArray:()=>st.all(...a).map(r=>({...r}))};st.run(...a);return {toArray:()=>[]}}};
  const P=new Planner({storage:{sql,get:async k=>mem.get(k),put:async o=>{for(const k in o)mem.set(k,o[k])},delete:async k=>{for(const x of [].concat(k))mem.delete(x)}}});let t=1.7e12;P.now=()=>t;P.mem=mem;return P};
 const N=(id,type,title,x,y,extra={})=>({id,type,title,text:'',x,y,mandatory:false,...extra});
 const wrap=nodes=>({v:1,root:'g0',title:'',graphs:{g0:{id:'g0',name:'S',parent:null,nodes,edges:[]}}});
 const nd=(d,id)=>cleanDoc(d).graphs.g0.nodes[id];
 /* Dokument-Prüfung */
 console.log('Vier Kategorien',JSON.stringify(KINDS)==='["character","event","todo","item"]');
 console.log('Notiz behält Kategorie und Archetyp',(()=>{const n=nd(wrap({a:N('a','note','A',0,0,{kind:'event',card:16})}),'a');return n.kind==='event'&&n.card===16})());
 console.log('Unbekannte Kategorie fällt weg, Notiz bleibt',nd(wrap({a:N('a','note','A',0,0,{kind:'zauber'})}),'a').kind===undefined);
 console.log('Szene und Verzweigung tragen keine Kategorie',nd(wrap({a:N('a','scene','A',0,0,{kind:'event',card:2}),b:N('b','branch','B',0,0,{kind:'todo'})}),'a').kind===undefined&&nd(wrap({a:N('a','scene','A',0,0,{kind:'event',card:2})}),'a').card===undefined);
 console.log('Erledigt gilt nur für Todos',nd(wrap({a:N('a','note','A',0,0,{kind:'todo',done:true}),b:N('b','note','B',0,0,{kind:'event',done:true})}),'a').done===true&&nd(wrap({b:N('b','note','B',0,0,{kind:'event',done:true})}),'b').done===undefined);
 console.log('Altes Format: character wird Notiz mit Kategorie Charakter',(()=>{const n=nd(wrap({a:N('a','character','A',0,0,{card:5})}),'a');return n.type==='note'&&n.kind==='character'&&n.card===5})());
 console.log('Das Prüfen ist wiederholbar (idempotent)',(()=>{const d=wrap({a:N('a','character','A',0,0,{card:5}),t:N('t','note','T',0,0,{kind:'todo',done:true})});const c=cleanDoc(d);return JSON.stringify(cleanDoc(c))===JSON.stringify(c)})());
 /* Migration beim Lesen */
 const P=mkP();P.mem.set('doc',wrap({a:N('a','character','Altlast',0,0,{card:17})}));P.mem.set('rev',3);
 const call=async(m,u,body)=>{const r=await P.fetch(new Request('http://x'+u,{method:m,body:body==null?undefined:JSON.stringify(body)}));const tx=await r.text();let j=null;try{j=JSON.parse(tx)}catch(e){}return {s:r.status,j,tx}};
 const g=await call('GET','/api/planner');console.log('Gespeichertes altes Dokument wird beim Lesen migriert',g.j.doc.graphs.g0.nodes.a.type==='note'&&g.j.doc.graphs.g0.nodes.a.kind==='character'&&g.j.rev===3);
 console.log('Migriertes Dokument lässt sich speichern',(await call('PUT','/api/planner',{rev:3,doc:g.j.doc})).s===200);
 /* Markdown */
 const d=wrap({
  c:N('c','note','Kapitänin',0,0,{kind:'character',card:2,text:'Kennt das Meer'}),
  e:N('e','note','Sturm',200,0,{kind:'event',card:16}),
  t1:N('t1','note','Karte zeichnen',0,150,{kind:'todo'}),
  t2:N('t2','note','Namen finden',200,150,{kind:'todo',done:true}),
  i:N('i','note','Kompass',400,0,{kind:'item'}),
  f:N('f','note','Freie Idee',400,150)});
 const md=toMarkdown(d,{name:'Plan'});
 console.log('Knotenzeilen tragen die Kategorie statt „Notiz“',md.includes('**Charakter: Kapitänin** `c` — Karte II · Die Hohepriesterin')&&md.includes('**Ereignis: Sturm** `e`')&&md.includes('**Gegenstand: Kompass** `i`')&&md.includes('**Notiz: Freie Idee** `f`'));
 console.log('Todos zeigen offen oder erledigt',md.includes('**Todo: Karte zeichnen** `t1` — offen')&&md.includes('**Todo: Namen finden** `t2` — erledigt'));
 console.log('Abschnitt „Offene Todos“ nennt nur die offenen',/## Offene Todos\n\n- S › \*\*Karte zeichnen\*\* `t1`\n/.test(md)&&!/Offene Todos[\s\S]*Namen finden[\s\S]*## S/.test(md.split('## S (')[0]));
 console.log('Kopfzeile zählt offene Todos',/1 offene Todos/.test(md));
 console.log('Lesehilfe erklärt Kategorien und Todos als Planungsaufgabe',/Charakter, Ereignis, Gegenstand oder Todo/.test(md)&&/Planungsaufgabe/.test(md));
 console.log('Alle Todos erledigt: Abschnitt sagt es',/Offene Todos\n\n_\(alle erledigt\)_/.test(toMarkdown(wrap({t:N('t','note','T',0,0,{kind:'todo',done:true})}),{})));
 console.log('Ohne Todos kein Todo-Abschnitt',!/Offene Todos/.test(toMarkdown(wrap({a:N('a','note','A',0,0,{kind:'event'})}),{})));
 console.log('Ohne Kategorien keine Kategorie-Zeile in der Lesehilfe',!/Notizen tragen oft/.test(toMarkdown(wrap({a:N('a','note','A',0,0)}),{})));
 console.log('Heldenreise: Charaktere und weitere Notizen getrennt',(()=>{const dd=W.heldenreiseDoc('R');dd.graphs.g0.nodes.x1=N('x1','note','Kapitänin',0,600,{kind:'character',card:2});dd.graphs.g0.nodes.x2=N('x2','note','Sturm',0,700,{kind:'event',card:16});const m=toMarkdown(dd,{});return /\*\*II · Die Hohepriesterin\*\*.*Charaktere: Kapitänin `x1`/.test(m)&&/\*\*XVI · Der Turm\*\*.*Weitere: Sturm \(Ereignis\) `x2`/.test(m)&&!/XVI · Der Turm\*\*.*Charaktere/.test(m)})());
 console.log('Altes Format im Markdown ohne Fehler',/\*\*Charakter: Alt\*\*/.test(toMarkdown(wrap({a:N('a','character','Alt',0,0)}),{})));
 /* Oberfläche */
 const R=mkP();const html=fs.readFileSync(path.join(__dirname,'..','dist','planner.html'));
 const srv=http.createServer(async(rq,s)=>{const u=rq.url.split('?')[0];
  if(u==='/planner'){s.writeHead(200,{'content-type':'text/html; charset=utf-8'});s.end(html);return}
  if(u.startsWith('/api/planner')){const ch=[];for await(const x of rq)ch.push(x);const body=Buffer.concat(ch).toString();const r=await R.fetch(new Request('http://x'+rq.url,{method:rq.method,body:['PUT','POST'].includes(rq.method)?body:undefined}));s.writeHead(r.status,{'content-type':r.headers.get('content-type')||'application/json'});s.end(await r.text());return}
  s.writeHead(404);s.end()});
 await new Promise(r=>srv.listen(8940,r));
 const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:1300,height:800}});const p=await ctx.newPage();
 p.on('pageerror',e=>console.log('ERR Seite',e.message));p.on('dialog',dl=>dl.accept());
 const saved=()=>p.waitForFunction("document.querySelector('#status').textContent==='Gespeichert'",null,{timeout:8000});
 const nb=t=>p.evaluate(t=>Object.values(__planner.doc().graphs[__planner.gid()].nodes).find(n=>n.title===t),t);
 const click=async t=>{const n=await nb(t);const bb=await p.locator(`.node[data-id="${n.id}"]`).boundingBox();await p.mouse.click(bb.x+60,bb.y+12)};
 const addNote=async(title,kind,card)=>{await p.click('#add-note');await p.fill('#f-title',title);if(kind)await p.selectOption('#f-kind',kind);if(card!=null)await p.selectOption('#f-card',String(card))};
 await p.goto('http://localhost:8940/planner');await p.waitForFunction('window.__planner');
 console.log('Kein „+ Charakter“-Knopf mehr, Notiz ist der Weg',await p.evaluate(()=>!document.querySelector('#add-character')&&!!document.querySelector('#add-note')));
 await p.click('#add-note');
 console.log('Notiz: Kategorie und Archetyp im Eigenschaftenfeld, Art ohne „Charakter“',await p.evaluate(()=>{const k=[...document.querySelectorAll('#f-kind option')].map(o=>o.textContent).join('|'),t=[...document.querySelectorAll('#f-type option')].map(o=>o.textContent).join('|');return k==='keine (freie Notiz)|Charakter|Ereignis|Todo|Gegenstand'&&t==='Szene|Verzweigung|Notiz'&&document.querySelector('#f-card').options.length===23&&/Archetyp/.test(document.querySelector('#f-card').closest('div').textContent)}));
 console.log('Archetyp-Auswahl: „keiner“, dann Narr bis Welt',await p.evaluate(()=>{const o=[...document.querySelectorAll('#f-card option')].map(x=>x.textContent);return o[0]==='keiner'&&/^0 · Der Narr/.test(o[1])&&/^XXI · Die Welt/.test(o[22])}));
 console.log('Freie Notiz hat keinen Todo-Haken',await p.evaluate(()=>!document.querySelector('#f-done')));
 await p.fill('#f-title','Anton');await p.selectOption('#f-kind','character');await p.selectOption('#f-card','17');
 await addNote('Mia','character',17);
 console.log('Zwei Charaktere mit gleicher Karte: Warnung',await p.evaluate(()=>document.querySelectorAll('.node.k-character .cd.dup').length===2));
 await addNote('Sturm','event',16);await addNote('Kompass','item',16);
 console.log('Zwei Nicht-Charaktere auf einer Karte: keine Warnung',await p.evaluate(()=>!document.querySelector('.node.k-event .cd.dup')&&!document.querySelector('.node.k-item .cd.dup')));
 await addNote('Karte zeichnen','todo');
 console.log('Todo: Haken „Erledigt“ erscheint, Knoten zeigt „offen“',await p.evaluate(()=>!!document.querySelector('#f-done')&&[...document.querySelectorAll('.node.k-todo .ty')].some(e=>e.textContent==='Todo · offen')));
 await p.check('#f-done');
 console.log('Erledigt: Knoten durchgestrichen und „erledigt“',await p.evaluate(()=>{const n=document.querySelector('.node.k-todo');return n.classList.contains('done')&&/erledigt/.test(n.querySelector('.ty').textContent)&&Object.values(__planner.doc().graphs.g0.nodes).find(x=>x.kind==='todo').done===true}));
 await p.uncheck('#f-done');console.log('Haken wieder raus: wieder offen, done-Feld entfällt',await p.evaluate(()=>{const n=Object.values(__planner.doc().graphs.g0.nodes).find(x=>x.kind==='todo');return n.done===undefined&&!document.querySelector('.node.k-todo.done')}));
 await addNote('Freie Idee',null,null);
 console.log('Jede Kategorie hat ihre eigene Darstellung',await p.evaluate(()=>['k-character','k-event','k-item','k-todo'].every(c=>document.querySelector('.node.'+c))&&[...document.querySelectorAll('.node.note')].filter(n=>!/k-/.test(n.className)).length===1&&[...document.querySelectorAll('.node .ty')].map(e=>e.textContent.split(' ·')[0]).sort().join('|')==='Charakter|Charakter|Ereignis|Gegenstand|Notiz|Todo'));
 console.log('Kartenleiste zählt alle Notizen mit Karte, Tooltip nennt Kategorien',await p.evaluate(()=>{const c17=document.querySelector('#cards .cell[data-card="17"]'),c16=document.querySelector('#cards .cell[data-card="16"]');return c17.querySelector('sup').textContent==='2'&&/2 Charakter/.test(c17.title)&&c16.querySelector('sup').textContent==='2'&&/1 Ereignis/.test(c16.title)&&/1 Gegenstand/.test(c16.title)}));
 /* Art wechseln entfernt Kategorie */
 await click('Sturm');await p.selectOption('#f-type','scene');
 console.log('Art auf Szene: Kategorie und Archetyp entfallen',await p.evaluate(()=>{const n=Object.values(__planner.doc().graphs.g0.nodes).find(x=>x.title==='Sturm');return n.type==='scene'&&n.kind===undefined&&n.card===undefined&&!document.querySelector('#f-kind')&&document.querySelector('#cards .cell[data-card="16"] sup').textContent==='1'}));
 await p.keyboard.press('Control+z');
 console.log('Strg+Z bringt Ereignis mit Karte zurück',await p.evaluate(()=>{const n=Object.values(__planner.doc().graphs.g0.nodes).find(x=>x.title==='Sturm');return n.type==='note'&&n.kind==='event'&&n.card===16}));
 /* Kategorie ändern */
 await click('Freie Idee');await p.selectOption('#f-kind','event');await p.selectOption('#f-kind','');
 console.log('Kategorie auf „keine“ zurück macht eine freie Notiz',await p.evaluate(()=>{const n=Object.values(__planner.doc().graphs.g0.nodes).find(x=>x.title==='Freie Idee');return n.type==='note'&&n.kind===undefined}));
 /* Speichern, Neuladen, Markdown */
 await saved();await p.reload();await p.waitForFunction('window.__planner');
 console.log('Nach Neuladen: Kategorien, Archetypen und Todo-Stand sind da',await p.evaluate(()=>document.querySelectorAll('.node.k-character').length===2&&document.querySelectorAll('.node.k-event').length===1&&document.querySelectorAll('.node.k-item').length===1&&document.querySelectorAll('.node.k-todo').length===1));
 const ex=await (await fetch('http://localhost:8940/api/planner/export')).text();
 console.log('Markdown vom Server: offenes Todo und Kategorien',/## Offene Todos[\s\S]*Karte zeichnen/.test(ex)&&ex.includes('**Gegenstand: Kompass**')&&/XVI · Der Turm\*\*.*Weitere: .*\(Ereignis\)/.test(ex));
 /* Import eines alten Dokuments */
 const old=JSON.stringify(wrap({a:N('a','character','Importiert',0,0,{card:3})}));fs.writeFileSync('/tmp/alt.json',old);
 await p.setInputFiles('#file','/tmp/alt.json');await p.waitForFunction("Object.values(__planner.doc().graphs.g0.nodes).some(n=>n.title==='Importiert')");
 console.log('Import eines Dokuments im alten Format wird zur Notiz mit Kategorie',await p.evaluate(()=>{const n=Object.values(__planner.doc().graphs.g0.nodes).find(x=>x.title==='Importiert');return n.type==='note'&&n.kind==='character'&&n.card===3&&!!document.querySelector('.node.k-character')}));
 fs.unlinkSync('/tmp/alt.json');
 /* Handy */
 const m=await b.newContext({viewport:{width:390,height:800},hasTouch:true});const q=await m.newPage();q.on('pageerror',e=>console.log('ERR Seite',e.message));
 await q.goto('http://localhost:8940/planner');await q.waitForFunction('window.__planner');await q.click('#add-note');await q.selectOption('#f-kind','todo');
 console.log('Handybreite: Eigenschaften mit Kategorie, kein waagerechtes Scrollen',await q.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1&&!!document.querySelector('#f-done')));
 if(process.env.SHOT){await p.click('#fit');await p.screenshot({path:process.env.SHOT})}
 await b.close();srv.close();
})();
