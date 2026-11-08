// Planner: Rückgängig und Wiederholen (Knöpfe und Tastatur) für Anlegen, Tippen, Verschieben, Verbinden, Löschen (auch Kapitel mit Inhalt), Pflicht-Flag.
// Wie Test 59 ohne Cloudflare: lokaler Server mit der echten Planner-Klasse.
const {chromium}=require('playwright');const http=require('http'),fs=require('fs'),path=require('path'),{pathToFileURL}=require('url');
(async()=>{
 const {Planner}=await import(pathToFileURL(path.join(__dirname,'..','..','..','worker','planner.js')).href);
 const mem=new Map(),P=new Planner({storage:{get:async k=>mem.get(k),put:async o=>{for(const k in o)mem.set(k,o[k])}}});
 const html=fs.readFileSync(path.join(__dirname,'..','dist','planner.html'));
 const srv=http.createServer(async(rq,s)=>{const u=rq.url.split('?')[0];
  if(u==='/planner'){s.writeHead(200,{'content-type':'text/html; charset=utf-8'});s.end(html);return}
  if(u==='/api/planner'){const ch=[];for await(const x of rq)ch.push(x);const r=await P.fetch(new Request('http://x/api/planner',{method:rq.method,body:rq.method==='PUT'?Buffer.concat(ch).toString():undefined}));s.writeHead(r.status,{'content-type':'application/json'});s.end(await r.text());return}
  s.writeHead(404);s.end()});
 await new Promise(r=>srv.listen(8934,r));
 const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:1200,height:760}});const p=await ctx.newPage();
 p.on('pageerror',e=>console.log('ERR Seite',e.message));p.on('dialog',dl=>dl.accept());
 const nodes=()=>p.evaluate(()=>Object.values(__planner.doc().graphs[__planner.gid()].nodes));
 const edges=()=>p.evaluate(()=>__planner.doc().graphs[__planner.gid()].edges.length);
 const dis=id=>p.evaluate(i=>document.querySelector(i).disabled,id);
 await p.goto('http://localhost:8934/planner');await p.waitForFunction('window.__planner');
 console.log('Start: beide Knöpfe gesperrt',await dis('#undo')&&await dis('#redo'));
 /* Anlegen */
 await p.click('#add-scene');const id1=(await nodes())[0].id;
 console.log('Knopf Rückgängig frei nach Anlegen',!(await dis('#undo')));
 await p.click('#undo');console.log('Rückgängig entfernt den Knoten',(await nodes()).length===0&&await dis('#undo')&&!(await dis('#redo')));
 await p.click('#redo');console.log('Wiederholen bringt denselben Knoten zurück',(await nodes()).length===1&&(await nodes())[0].id===id1);
 /* Tippen als ein Schritt */
 {const r0=await p.locator('.node').boundingBox();await p.mouse.click(r0.x+60,r0.y+12)}
 await p.click('#f-title');await p.fill('#f-title','');await p.keyboard.type('Strand',{delay:25});
 console.log('Titel getippt',(await nodes())[0].title==='Strand');
 await p.keyboard.press('Control+z');
 console.log('Strg+Z im Feld macht das Tippen in einem Schritt rückgängig',(await nodes())[0].title==='Szene');
 await p.keyboard.press('Control+Shift+z');console.log('Strg+Umschalt+Z stellt den Titel wieder her',(await nodes())[0].title==='Strand');
 await p.keyboard.press('Control+z');
 /* Verschieben */
 const before=(await nodes())[0];const bb=await p.locator('.node').boundingBox();
 await p.mouse.move(bb.x+60,bb.y+10);await p.mouse.down();await p.mouse.move(bb.x+260,bb.y+160,{steps:6});await p.mouse.up();
 const moved=(await nodes())[0];console.log('Knoten verschoben',moved.x!==before.x||moved.y!==before.y);
 await p.keyboard.press('Control+z');const back=(await nodes())[0];console.log('Rückgängig stellt die Position her',back.x===before.x&&back.y===before.y);
 /* Zweiter Knoten, verbinden, Beschriftung */
 await p.click('#add-branch');await p.click('#stage',{position:{x:5,y:5}});
 const ns=await nodes();const [A,B]=ns;
 const o=await p.locator(`.node[data-id="${A.id}"] .h.o`).boundingBox(),t=await p.locator(`.node[data-id="${B.id}"]`).boundingBox();
 await p.mouse.move(o.x+9,o.y+9);await p.mouse.down();await p.mouse.move(t.x+80,t.y+20,{steps:8});await p.mouse.up();
 console.log('Verbunden',await edges()===1);
 await p.keyboard.press('Control+z');console.log('Rückgängig löst die Verbindung',await edges()===0);
 await p.keyboard.press('Control+y');console.log('Strg+Y stellt sie wieder her',await edges()===1);
 /* Löschen mit Verbindung */
 await p.click('#stage',{position:{x:5,y:5}});const nb=await p.locator(`.node[data-id="${A.id}"]`).boundingBox();await p.mouse.click(nb.x+60,nb.y+12);await p.keyboard.press('Delete');
 console.log('Knoten samt Verbindung gelöscht',(await nodes()).length===1&&await edges()===0);
 await p.keyboard.press('Control+z');console.log('Rückgängig bringt Knoten und Verbindung zurück',(await nodes()).length===2&&await edges()===1);
 /* Pflicht */
 const nb2=await p.locator(`.node[data-id="${A.id}"]`).boundingBox();await p.mouse.click(nb2.x+60,nb2.y+12);await p.check('#f-mand');
 console.log('Pflicht gesetzt',(await nodes()).find(n=>n.id===A.id).mandatory===true);
 await p.click('#undo');console.log('Rückgängig nimmt Pflicht zurück, Markierung weg',(await nodes()).find(n=>n.id===A.id).mandatory===false&&!(await p.$('.node.mand')));
 /* Neue Änderung leert Wiederholen */
 console.log('Wiederholen ist noch möglich',!(await dis('#redo')));
 await p.click('#add-note');console.log('Neue Änderung leert Wiederholen',await dis('#redo'));
 /* Kapitel mit Inhalt löschen und zurückholen */
 await p.click('#add-chapter');await p.fill('#f-title','Akt');await p.click('#f-open');
 await p.click('#add-scene');await p.fill('#f-title','Innen');await p.click('#add-chapter');await p.fill('#f-title','Tiefer');
 await p.click('#crumbs button[data-go="g0"]');
 const g0=await p.evaluate(()=>Object.keys(__planner.doc().graphs).length);
 const ck=await p.locator('.node.chapter').boundingBox();await p.mouse.click(ck.x+60,ck.y+12);await p.keyboard.press('Delete');
 const g1=await p.evaluate(()=>Object.keys(__planner.doc().graphs).length);
 console.log('Kapitel samt Unterkapitel gelöscht',g0===3&&g1===1);
 await p.keyboard.press('Control+z');
 console.log('Rückgängig holt alle Ebenen zurück',await p.evaluate(()=>Object.keys(__planner.doc().graphs).length)===3);
 await p.dblclick('.node.chapter');
 console.log('Inhalt des Kapitels ist wieder da',(await p.evaluate(()=>[...document.querySelectorAll('.node .ti')].map(e=>e.textContent).sort().join('|')))==='Innen|Tiefer');
 /* Ebene, die verschwindet, wirft nicht ins Leere */
 await p.click('#crumbs button[data-go="g0"]');await p.click('#add-chapter');await p.click('#f-open');
 const inGraph=await p.evaluate(()=>__planner.gid());await p.keyboard.press('Control+z');
 console.log('Undo der Kapitel-Anlage aus dem Kapitel heraus: zurück auf der Wurzel',inGraph!=='g0'&&await p.evaluate(()=>__planner.gid()==='g0')&&await p.evaluate(()=>document.querySelectorAll('#crumbs button').length===1));
 /* Speichern nach Rückgängig */
 await p.waitForFunction("document.querySelector('#status').textContent==='Gespeichert'",null,{timeout:8000});
 const server=await P.fetch(new Request('http://x/api/planner'));const sj=await server.json();
 console.log('Server hat den zurückgenommenen Stand',JSON.stringify(sj.doc)===JSON.stringify(await p.evaluate(()=>__planner.doc())));
 /* Obergrenze */
 for(let i=0;i<110;i++)await p.click('#add-note');
 const dep=await p.evaluate(()=>__planner.undoDepth());console.log('Historie hat höchstens 100 Schritte',dep===100);
 /* Handy: Knöpfe passen */
 const m=await b.newContext({viewport:{width:390,height:800},hasTouch:true});const q=await m.newPage();q.on('pageerror',e=>console.log('ERR Seite',e.message));
 await q.goto('http://localhost:8934/planner');await q.waitForFunction('window.__planner');
 console.log('Handybreite ohne waagerechtes Scrollen',await q.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1&&document.body.scrollWidth<=window.innerWidth+1));
 await b.close();srv.close();
})();
