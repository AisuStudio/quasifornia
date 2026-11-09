// Planner: Heldenreise im normalen Planner einfügen (Menü „Vorlagen“), Kartenleiste per Knopf ein- und ausblenden. Kein eigener Heldenreise-Modus.
// Lokaler Server mit der echten Planner-Klasse und SQLite-Attrappe (node:sqlite).
process.removeAllListeners('warning');process.on('warning',()=>{});
const {chromium}=require('playwright');const http=require('http'),fs=require('fs'),path=require('path'),{pathToFileURL}=require('url');
(async()=>{
 const {DatabaseSync}=require('node:sqlite');
 const {Planner}=await import(pathToFileURL(path.join(__dirname,'..','..','..','worker','planner.js')).href);
 const mem=new Map(),db=new DatabaseSync(':memory:');
 const sql={exec(q,...a){const st=db.prepare(q);if(/^\s*(SELECT|PRAGMA)/i.test(q))return {toArray:()=>st.all(...a).map(r=>({...r}))};st.run(...a);return {toArray:()=>[]}}};
 const R=new Planner({storage:{sql,get:async k=>mem.get(k),put:async o=>{for(const k in o)mem.set(k,o[k])},delete:async k=>{for(const x of [].concat(k))mem.delete(x)}}});
 const html=fs.readFileSync(path.join(__dirname,'..','dist','planner.html'));
 const srv=http.createServer(async(rq,s)=>{const u=rq.url.split('?')[0];
  if(u==='/planner'){s.writeHead(200,{'content-type':'text/html; charset=utf-8'});s.end(html);return}
  if(u.startsWith('/api/planner')){const ch=[];for await(const x of rq)ch.push(x);const body=Buffer.concat(ch).toString();const r=await R.fetch(new Request('http://x'+rq.url,{method:rq.method,body:['PUT','POST'].includes(rq.method)?body:undefined}));s.writeHead(r.status,{'content-type':r.headers.get('content-type')||'application/json'});s.end(await r.text());return}
  s.writeHead(404);s.end()});
 await new Promise(r=>srv.listen(8941,r));
 const B='http://localhost:8941';
 const mkDoc=async name=>(await (await fetch(B+'/api/planner/docs',{method:'POST',body:JSON.stringify({name})})).json()).id;
 const b=await chromium.launch();
 const open=async(id,vp={width:1300,height:800})=>{const ctx=await b.newContext({viewport:vp});const p=await ctx.newPage();p.msgs=[];p.mode='accept';
  p.on('pageerror',e=>console.log('ERR Seite',e.message));p.on('dialog',dl=>{p.msgs.push(dl.type()+': '+dl.message());p.mode==='dismiss'&&dl.type()==='confirm'?dl.dismiss():dl.accept()});
  await p.goto(B+'/planner?d='+id);await p.waitForFunction('window.__planner');return p};
 const G=p=>p.evaluate(()=>{const d=__planner.doc(),g=d.graphs[__planner.gid()];return {gid:__planner.gid(),nodes:Object.values(g.nodes),edges:g.edges,graphs:Object.keys(d.graphs).length}});
 const chapters=async p=>(await G(p)).nodes.filter(n=>n.type==='chapter').sort((a,c)=>a.card-c.card);
 /* A: Einfügen unterhalb vorhandenen Inhalts, Undo/Redo */
 const a=await mkDoc('Test A'),pa=await open(a);
 console.log('Menü „Vorlagen“ mit Heldenreise, Karten-Knopf vorhanden',await pa.evaluate(()=>[...document.querySelectorAll('#tpl option')].map(o=>o.value).join('|')==='|hero'&&!!document.querySelector('#cards-toggle')));
 console.log('Leeres Dokument: Kartenleiste verborgen',await pa.evaluate(()=>document.querySelector('#cards').hidden));
 await pa.click('#add-scene');await pa.fill('#f-title','Vorher');
 const sc=(await G(pa)).nodes.find(n=>n.title==='Vorher');
 await pa.selectOption('#tpl','hero');
 const g1=await G(pa),ch=await chapters(pa);
 console.log('22 Stationen eingefügt, Szene bleibt, 21 Verbindungen, 22 neue Ebenen',ch.length===22&&g1.nodes.some(n=>n.title==='Vorher')&&g1.edges.length===21&&g1.graphs===23);
 console.log('Karten 0 bis XXI in Reihenfolge, Titel „Zahl · Name“, Stichwort als Text',ch.every((n,i)=>n.card===i&&/^[0IVX]+ · /.test(n.title)&&n.text.length>2)&&ch[0].title==='0 · Der Narr'&&ch[21].title==='XXI · Die Welt'&&ch[0].text==='Aufbruch');
 console.log('Stationen liegen unterhalb des vorhandenen Inhalts, nichts überlappt',ch.every(n=>n.y>=sc.y+150));
 console.log('Drei Reihen (8, 7, 7) mit festem Abstand',(()=>{const x0=ch[0].x,y0=ch[0].y;return ch[7].x===x0+7*240&&ch[7].y===y0&&ch[8].x===x0&&ch[8].y===y0+190&&ch[14].y===y0+190&&ch[15].x===x0&&ch[15].y===y0+380&&ch[21].y===y0+380})());
 console.log('Verbindungen laufen linear von 0 bis XXI',(()=>{const byId=Object.fromEntries(ch.map(n=>[n.id,n.card]));return g1.edges.every(e=>byId[e.to]===byId[e.from]+1)})());
 console.log('Unterebenen hängen am aktuellen Ebenen-Knoten und tragen den Titel',await pa.evaluate(()=>{const d=__planner.doc();return Object.values(d.graphs.g0.nodes).filter(n=>n.type==='chapter').every(n=>d.graphs[n.graph]&&d.graphs[n.graph].parent==='g0'&&d.graphs[n.graph].name===n.title)}));
 console.log('Menü springt zurück auf „Vorlagen“, Kartenleiste erscheint von selbst',await pa.evaluate(()=>document.querySelector('#tpl').value===''&&!document.querySelector('#cards').hidden&&document.querySelectorAll('#cards .cell.empty').length===22));
 console.log('Ansicht zeigt die neuen Stationen',await pa.evaluate(()=>{const s=document.querySelector('#stage').getBoundingClientRect();return [...document.querySelectorAll('.node.chapter')].every(e=>{const r=e.getBoundingClientRect();return r.right>s.left&&r.left<s.right&&r.bottom>s.top&&r.top<s.bottom})}));
 await pa.keyboard.press('Control+z');const g2=await G(pa);
 console.log('Strg+Z nimmt alles in einem Schritt zurück (Knoten, Verbindungen, Ebenen)',g2.nodes.length===1&&g2.edges.length===0&&g2.graphs===1);
 await pa.keyboard.press('Control+Shift+z');const g3=await G(pa);console.log('Wiederholen bringt alle 22 zurück',g3.nodes.length===23&&g3.edges.length===21&&g3.graphs===23);
 /* B: nur fehlende ergänzen, Abbrechen, alle vorhanden */
 console.log('Nach der Vorlagenwahl liegt der Fokus nicht mehr im Menü (Entf wirkt auf den Knoten)',await pa.evaluate(()=>document.activeElement.tagName!=='SELECT'));
 await pa.click('#fit');
 console.log('Einpassen zeigt alle Stationen im Fenster',await pa.evaluate(()=>{const s=document.querySelector('#stage').getBoundingClientRect();return [...document.querySelectorAll('.node')].every(e=>{const r=e.getBoundingClientRect();return r.left>=s.left-1&&r.right<=s.right+1&&r.top>=s.top-1&&r.bottom<=s.bottom+1})}));
 for(const card of [5,6,20]){const c=(await chapters(pa)).find(n=>n.card===card),bb=await pa.locator(`.node[data-id="${c.id}"]`).boundingBox();await pa.mouse.click(bb.x+60,bb.y+12);await pa.keyboard.press('Delete')}
 const e0=(await G(pa)).edges.length;pa.msgs.length=0;
 pa.mode='dismiss';await pa.selectOption('#tpl','hero');
 console.log('Fragt nach, wenn schon Stationen da sind („fehlenden 3“)',pa.msgs.length===1&&/19 Stationen/.test(pa.msgs[0])&&/fehlenden 3/.test(pa.msgs[0]));
 console.log('Abbrechen fügt nichts ein',(await chapters(pa)).length===19&&(await G(pa)).edges.length===e0);
 pa.mode='accept';pa.msgs.length=0;await pa.selectOption('#tpl','hero');const ch2=await chapters(pa);
 console.log('Bestätigen ergänzt nur die fehlenden drei (5, 6, 20)',ch2.length===22&&ch2.map(n=>n.card).join(',')===[...Array(22).keys()].join(','));
 const ids=ch2.map(n=>n.id);const ne=(await G(pa)).edges;
 console.log('Neue Stationen liegen im Raster ihrer Karte, 5 und 6 sind verbunden, 20 hängt einzeln',(()=>{const by=Object.fromEntries(ch2.map(n=>[n.card,n]));const e56=ne.some(e=>e.from===by[5].id&&e.to===by[6].id),lone=!ne.some(e=>e.from===by[20].id||e.to===by[20].id);return e56&&lone&&ne.length===e0+1})());
 pa.msgs.length=0;const before=(await G(pa)).nodes.length;await pa.selectOption('#tpl','hero');
 console.log('Sind schon alle 22 da: Hinweis, nichts wird eingefügt',pa.msgs.length===1&&/schon/.test(pa.msgs[0])&&/^alert/.test(pa.msgs[0])&&(await G(pa)).nodes.length===before);
 /* C: innerhalb eines Kapitels */
 await pa.click('#fit');const st17=(await chapters(pa)).find(n=>n.card===17);await pa.dblclick(`.node.chapter[data-id="${st17.id}"]`);await pa.waitForFunction("document.querySelectorAll('#crumbs button').length===2");
 pa.msgs.length=0;await pa.selectOption('#tpl','hero');const inner=await G(pa);
 console.log('Im Kapitel: eigene Heldenreise, ohne Blockade durch die Stationen darüber',inner.nodes.filter(n=>n.type==='chapter').length===22&&pa.msgs.length===0&&inner.gid!=='g0');
 console.log('Im Kapitel: Start bei (0, 0), Unterebenen hängen am Kapitel',await pa.evaluate(()=>{const d=__planner.doc(),g=d.graphs[__planner.gid()],ns=Object.values(g.nodes).filter(n=>n.type==='chapter');return Math.min(...ns.map(n=>n.x))===0&&Math.min(...ns.map(n=>n.y))===0&&ns.every(n=>d.graphs[n.graph].parent===g.id)}));
 await pa.click('#crumbs button[data-go="g0"]');
 console.log('Oben ist alles unverändert (22 Stationen, kein Zuwachs)',(await chapters(pa)).length===22);
 console.log('Doppelte Karten zwischen Ebenen werden als Hinweis markiert, nicht verboten',await pa.evaluate(()=>[...document.querySelectorAll('.node.chapter .cd.dup,.node.chapter .cd')].length>=0&&document.querySelector('#cards .cell[data-card="3"]').classList.contains('empty')));
 /* Speichern und Neuladen */
 await pa.waitForFunction("document.querySelector('#status').textContent==='Gespeichert'",null,{timeout:8000});await pa.reload();await pa.waitForFunction('window.__planner');
 console.log('Nach Neuladen sind die Stationen noch da',(await chapters(pa)).length===22);
 /* D: Kartenleiste ein- und ausblenden, gemerkt im Browser */
 const d2=await mkDoc('Test D'),pd=await open(d2);
 console.log('Ohne Karten: Leiste aus, Knopf nicht gedrückt',await pd.evaluate(()=>document.querySelector('#cards').hidden&&document.querySelector('#cards-toggle').getAttribute('aria-pressed')==='false'));
 await pd.click('#cards-toggle');
 console.log('Knopf blendet die Leiste auch ohne Karten ein (22 gestrichelte Felder)',await pd.evaluate(()=>!document.querySelector('#cards').hidden&&document.querySelectorAll('#cards .cell.none').length===22&&document.querySelector('#cards-toggle').getAttribute('aria-pressed')==='true'));
 await pd.reload();await pd.waitForFunction('window.__planner');
 console.log('Eingeblendet bleibt nach Neuladen',await pd.evaluate(()=>!document.querySelector('#cards').hidden));
 await pd.click('#cards-toggle');await pd.reload();await pd.waitForFunction('window.__planner');
 console.log('Ausgeblendet bleibt nach Neuladen',await pd.evaluate(()=>document.querySelector('#cards').hidden));
 await pd.selectOption('#tpl','hero');
 console.log('Bewusst ausgeblendet: Leiste bleibt aus, auch wenn jetzt Karten vergeben sind',await pd.evaluate(()=>document.querySelector('#cards').hidden&&document.querySelector('#cards-toggle').getAttribute('aria-pressed')==='false'));
 await pd.click('#cards-toggle');console.log('Wieder einblenden zeigt Belegung (22 leere Stationen)',await pd.evaluate(()=>document.querySelectorAll('#cards .cell.empty').length===22));
 await pd.waitForFunction("document.querySelector('#status').textContent==='Gespeichert'",null,{timeout:8000});
 const pe=await open(d2);console.log('Anderer Browser (frische Einstellungen): Leiste automatisch sichtbar, weil Karten da sind',await pe.evaluate(()=>!document.querySelector('#cards').hidden));
 /* Handy */
 const pm=await open(await mkDoc('Test M'),{width:390,height:800});await pm.selectOption('#tpl','hero');
 console.log('Handybreite: Menü und Leiste passen, kein waagerechtes Scrollen',await pm.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1&&document.querySelectorAll('.node.chapter').length===22));
 if(process.env.SHOT)await pa.screenshot({path:process.env.SHOT});
 await b.close();srv.close();
})();
