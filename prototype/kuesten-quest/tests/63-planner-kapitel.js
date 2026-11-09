// Planner Schritt 2: Kapitel (Unter-Graphen mit Drilldown und Brotkrumen) und Pflicht-Flag mit Filter.
// Wie Test 59 ohne Cloudflare: lokaler Server mit der echten Planner-Klasse.
const {chromium}=require('playwright');const http=require('http'),fs=require('fs'),path=require('path'),{pathToFileURL}=require('url');
(async()=>{
 const {cleanDoc,Planner}=await import(pathToFileURL(path.join(__dirname,'..','..','..','worker','planner.js')).href);
 /* Dokument-Prüfung für Kapitel */
 const d={v:1,root:'g0',title:'',graphs:{g0:{id:'g0',name:'Spiel',parent:null,nodes:{c:{id:'c',type:'chapter',title:'Akt 1',text:'',x:0,y:0,graph:'g1',mandatory:true}},edges:[]},g1:{id:'g1',name:'Akt 1',parent:'g0',nodes:{s:{id:'s',type:'scene',title:'S',text:'',x:0,y:0,graph:'g0'}},edges:[]}}};
 const c=cleanDoc(d);
 console.log('Kapitel mit Unter-Graph bleibt erhalten',!!c&&c.graphs.g0.nodes.c.graph==='g1'&&c.graphs.g1.parent==='g0'&&c.graphs.g0.nodes.c.mandatory===true);
 console.log('Szene darf keine Kapitel-Verknüpfung tragen',c.graphs.g1.nodes.s.graph===undefined);
 const mem=new Map(),P=new Planner({storage:{get:async k=>mem.get(k),put:async o=>{for(const k in o)mem.set(k,o[k])}}});
 const html=fs.readFileSync(path.join(__dirname,'..','dist','planner.html'));
 const srv=http.createServer(async(rq,s)=>{const u=rq.url.split('?')[0];
  if(u==='/planner'){s.writeHead(200,{'content-type':'text/html; charset=utf-8'});s.end(html);return}
  if(u==='/api/planner'){const ch=[];for await(const x of rq)ch.push(x);const r=await P.fetch(new Request('http://x/api/planner',{method:rq.method,body:rq.method==='PUT'?Buffer.concat(ch).toString():undefined}));s.writeHead(r.status,{'content-type':'application/json'});s.end(await r.text());return}
  s.writeHead(404);s.end()});
 await new Promise(r=>srv.listen(8933,r));
 const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:1200,height:760}});const p=await ctx.newPage();
 p.on('pageerror',e=>console.log('ERR Seite',e.message));p.on('dialog',dl=>dl.accept());
 const saved=()=>p.waitForFunction("document.querySelector('#status').textContent==='Gespeichert'",null,{timeout:8000});
 const crumbs=()=>p.evaluate(()=>[...document.querySelectorAll('#crumbs button')].map(b=>b.textContent).join('>'));
 await p.goto('http://localhost:8933/planner');await p.waitForFunction('window.__planner');
 console.log('Start: nur die Wurzel in den Brotkrumen',await crumbs()==='Spiel');
 /* Kapitel anlegen und öffnen */
 await p.click('#add-chapter');await p.fill('#f-title','Akt 1');
 const ch=await p.evaluate(()=>{const g=__planner.doc().graphs,n=Object.values(g.g0.nodes)[0];return {t:n.type,gr:n.graph,par:g[n.graph]&&g[n.graph].parent,name:g[n.graph]&&g[n.graph].name}});
 console.log('Kapitel legt Unter-Graphen an, Name folgt dem Titel',ch.t==='chapter'&&!!ch.gr&&ch.par==='g0'&&ch.name==='Akt 1');
 console.log('Kapitel zeigt Zähler',await p.evaluate(()=>document.querySelector('.node.chapter .cnt').textContent==='0 Knoten'));
 console.log('Kapitel hat keine Art-Auswahl, aber Öffnen',await p.evaluate(()=>!document.querySelector('#f-type')&&!!document.querySelector('#f-open')));
 await p.click('#f-open');
 console.log('Öffnen wechselt die Ebene',await p.evaluate(g=>__planner.gid()===g,ch.gr)&&await crumbs()==='Spiel>Akt 1');
 console.log('Neue Ebene ist leer mit Hinweis',await p.evaluate(()=>!document.querySelector('.node')&&!document.querySelector('#hint').hidden));
 /* Inhalt: Pflicht-Szene und Unterkapitel */
 await p.click('#add-scene');await p.fill('#f-title','Ankunft');await p.check('#f-mand');
 console.log('Pflicht-Szene trägt Markierung',await p.evaluate(()=>!!document.querySelector('.node.mand .bd')&&Object.values(__planner.doc().graphs[__planner.gid()].nodes)[0].mandatory===true));
 await p.click('#add-chapter');await p.fill('#f-title','Gruft');
 const sub=await p.evaluate(()=>Object.values(__planner.doc().graphs[__planner.gid()].nodes).find(n=>n.type==='chapter').id);
 await p.dblclick(`.node[data-id="${sub}"]`);
 console.log('Doppelklick öffnet Unterkapitel, Brotkrumen 3 Ebenen',await crumbs()==='Spiel>Akt 1>Gruft');
 await p.click('#add-note');await p.fill('#f-title','Hinweis');
 /* Zurück per Brotkrume */
 await p.click('#crumbs button[data-go="g0"]');
 console.log('Brotkrume Spiel bringt zurück',await p.evaluate(()=>__planner.gid()==='g0'&&document.querySelectorAll('.node').length===1)&&await crumbs()==='Spiel');
 console.log('Kapitel zählt Unterknoten und zeigt Pflicht',await p.evaluate(()=>document.querySelector('.node.chapter .cnt').textContent==='2 Knoten · mit Pflicht'));
 /* Filter */
 await p.click('#add-scene');await p.fill('#f-title','Nebensache');
 await p.click('#mand-filter');
 console.log('Filter: Nebensache gedimmt, Kapitel mit Pflicht nicht',await p.evaluate(()=>{const ns=[...document.querySelectorAll('.node')];const f=t=>ns.find(n=>n.querySelector('.ti').textContent===t);return f('Nebensache').classList.contains('dim')&&!f('Akt 1').classList.contains('dim')&&document.querySelector('#mand-filter').getAttribute('aria-pressed')==='true'}));
 await p.click('#mand-filter');console.log('Filter aus: nichts gedimmt',await p.evaluate(()=>!document.querySelector('.node.dim')));
 /* Titel im Kapitel ändert die Brotkrume */
 const cn=await p.locator('.node.chapter').boundingBox();await p.mouse.click(cn.x+60,cn.y+12);await p.fill('#f-title','Akt Eins');
 await p.dblclick('.node.chapter');
 console.log('Umbenennen wirkt auf Brotkrume',await crumbs()==='Spiel>Akt Eins');
 /* Speichern, Neuladen, Inhalt wiederfinden */
 await saved();await p.reload();await p.waitForFunction('window.__planner');
 await p.dblclick('.node.chapter');
 console.log('Nach Neuladen: Inhalt des Kapitels da',await p.evaluate(()=>[...document.querySelectorAll('.node .ti')].map(e=>e.textContent).sort().join('|')==='Ankunft|Gruft')&&await crumbs()==='Spiel>Akt Eins');
 console.log('Pflicht blieb gespeichert',await p.evaluate(()=>!!document.querySelector('.node.mand')));
 /* Ansicht pro Ebene wird gemerkt */
 await p.click('#crumbs button[data-go="g0"]');
 /* Löschen mit Unterkapiteln */
 const nGraphs=await p.evaluate(()=>Object.keys(__planner.doc().graphs).length);
 const ck=await p.locator('.node.chapter').boundingBox();await p.mouse.click(ck.x+60,ck.y+12);await p.keyboard.press('Delete');
 const after=await p.evaluate(()=>{const g=__planner.doc().graphs;return {n:Object.keys(g).length,ok:Object.values(g).every(x=>x.parent===null||g[x.parent])}});
 console.log('Kapitel löschen entfernt alle Unter-Graphen',nGraphs===3&&after.n===1&&after.ok);
 console.log('Wurzel bleibt mit Nebensache',await p.evaluate(()=>Object.values(__planner.doc().graphs.g0.nodes).map(n=>n.title).join('|')==='Nebensache'));
 await saved();
 /* Handy */
 const m=await b.newContext({viewport:{width:390,height:800},hasTouch:true});const q=await m.newPage();q.on('pageerror',e=>console.log('ERR Seite',e.message));
 await q.goto('http://localhost:8933/planner');await q.waitForFunction('window.__planner');await q.click('#add-chapter');await q.click('#f-open');
 console.log('Handybreite mit Brotkrumen ohne waagerechtes Scrollen',await q.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1&&document.body.scrollWidth<=window.innerWidth+1));
 if(process.env.SHOT)await p.screenshot({path:process.env.SHOT});
 await b.close();srv.close();
})();
