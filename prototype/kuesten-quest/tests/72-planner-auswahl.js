// Planner: Mehrfachauswahl (Umschalt- oder Strg-Klick, Auswahlrahmen, Auswahl-Werkzeug, Strg+A), gemeinsames Verschieben per Zug und Pfeiltasten, Löschen und Undo als ein Schritt.
// Lokaler Server mit der echten Planner-Klasse und SQLite-Attrappe (node:sqlite).
process.removeAllListeners('warning');process.on('warning',()=>{});
const {chromium}=require('playwright');const http=require('http'),fs=require('fs'),os=require('os'),path=require('path'),{pathToFileURL}=require('url');
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
 await new Promise(r=>srv.listen(8944,r));
 const B='http://localhost:8944',b=await chromium.launch();
 const N=(id,type,title,x,y,extra={})=>({id,type,title,text:'',x,y,mandatory:false,...extra});
 const E=(id,from,to)=>({id,from,to,label:''});
 const DOC=()=>({v:1,root:'g0',title:'',graphs:{g0:{id:'g0',name:'Spiel',parent:null,nodes:{a:N('a','scene','A',0,0),b:N('b','scene','B',250,0),c:N('c','scene','C',500,0),d:N('d','scene','D',0,200),e:N('e','scene','E',250,200),f:N('f','scene','F',900,500),k:N('k','chapter','Kap',500,200,{graph:'g1'})},edges:[E('1','a','b'),E('2','b','c'),E('3','d','e')]},g1:{id:'g1',name:'Kap',parent:'g0',nodes:{s1:N('s1','scene','Innen 1',0,0),s2:N('s2','scene','Innen 2',250,0)},edges:[E('4','s1','s2')]}}});
 const mkDoc=async name=>(await (await fetch(B+'/api/planner/docs',{method:'POST',body:JSON.stringify({name})})).json()).id;
 const open=async(vp={width:1300,height:800})=>{const ctx=await b.newContext({viewport:vp});const p=await ctx.newPage();p.msgs=[];p.mode='accept';
  p.on('pageerror',e=>console.log('ERR Seite',e.message));p.on('dialog',dl=>{p.msgs.push(dl.type()+': '+dl.message());p.mode==='dismiss'&&dl.type()==='confirm'?dl.dismiss():dl.accept()});
  await p.goto(B+'/planner?d='+await mkDoc('T'+Math.random().toString(36).slice(2,6)));await p.waitForFunction('window.__planner');
  const f=path.join(os.tmpdir(),'planner-72-'+Math.random().toString(36).slice(2)+'.json');fs.writeFileSync(f,JSON.stringify(DOC()));await p.setInputFiles('#file',f);await p.waitForFunction(()=>Object.keys(__planner.doc().graphs.g0.nodes).length===7,null,{timeout:5000});fs.unlinkSync(f);
  await p.click('#fit');return p};
 const pos=p=>p.evaluate(()=>Object.fromEntries(Object.values(__planner.doc().graphs[__planner.gid()].nodes).map(n=>[n.title,[n.x,n.y]])));
 const sel=p=>p.evaluate(()=>{const s=__planner.sel();return s?(s.kind==='multi'?'multi:'+s.ids.map(i=>__planner.doc().graphs[__planner.gid()].nodes[i].title).sort().join(','):s.kind==='node'?'node:'+__planner.doc().graphs[__planner.gid()].nodes[s.id].title:s.kind):'none'});
 const at=async(p,t)=>{const bb=await p.locator('.node',{has:p.locator('.ti',{hasText:new RegExp('^'+t+'$')})}).first().boundingBox();return {x:bb.x+60,y:bb.y+14,bb}};
 const emptyBox=async(p,from,to)=>{/* Rahmen von der Ecke links oberhalb von "from" bis rechts unterhalb von "to" */const a=await at(p,from),c=await at(p,to);return {x1:a.bb.x-18,y1:a.bb.y-18,x2:c.bb.x+c.bb.width+18,y2:c.bb.y+c.bb.height+18}};
 const p=await open();
 console.log('Auswahl-Werkzeug als Knopf, Fläche verschieben ist Standard',await p.evaluate(()=>{const b=document.querySelector('#tool-select');return !!b&&b.textContent==='Auswählen'&&b.getAttribute('aria-pressed')==='false'&&__planner.tool()==='pan'}));
 /* Umschalt- und Strg-Klick */
 let c=await at(p,'A');await p.mouse.click(c.x,c.y);c=await at(p,'B');await p.keyboard.down('Shift');await p.mouse.click(c.x,c.y);await p.keyboard.up('Shift');
 console.log('Umschalt+Klick fügt hinzu: zwei Knoten ausgewählt',await sel(p)==='multi:A,B');
 console.log('Eigenschaften zeigen die Auswahl mit Anzahl und Aktionen',await p.evaluate(()=>/^Auswahl$/.test(document.querySelector('#insp h2').textContent)&&/2 Knoten ausgewählt/.test(document.querySelector('#f-count').textContent)&&!!document.querySelector('#f-clear')&&!!document.querySelector('#f-del')&&document.querySelectorAll('.node.sel').length===2));
 c=await at(p,'C');await p.keyboard.down('Control');await p.mouse.click(c.x,c.y);await p.keyboard.up('Control');
 console.log('Strg+Klick fügt ebenfalls hinzu',await sel(p)==='multi:A,B,C');
 c=await at(p,'A');await p.keyboard.down('Shift');await p.mouse.click(c.x,c.y);await p.keyboard.up('Shift');
 console.log('Umschalt+Klick auf einen Ausgewählten nimmt ihn heraus',await sel(p)==='multi:B,C');
 c=await at(p,'B');await p.keyboard.down('Shift');await p.mouse.click(c.x,c.y);await p.keyboard.up('Shift');
 console.log('Bleibt einer übrig, ist es wieder eine normale Einzelauswahl mit allen Feldern',await sel(p)==='node:C'&&await p.evaluate(()=>document.querySelector('#insp h2').textContent==='Knoten'&&!!document.querySelector('#f-title')));
 /* Klick auf die leere Fläche */
 await p.mouse.click(5+0,300);console.log('Klick auf die leere Fläche hebt die Auswahl auf',await sel(p)==='none');
 /* Rahmen mit Umschalt */
 const bx=await emptyBox(p,'A','E');
 await p.keyboard.down('Shift');await p.mouse.move(bx.x1,bx.y1);await p.mouse.down();await p.mouse.move((bx.x1+bx.x2)/2,(bx.y1+bx.y2)/2,{steps:4});
 console.log('Beim Aufziehen erscheint der Rahmen und markiert live',await p.evaluate(()=>{const r=document.querySelector('#box');return !r.hidden&&r.getBoundingClientRect().width>10&&document.querySelectorAll('.node.sel').length>=1}));
 await p.mouse.move(bx.x2,bx.y2,{steps:4});await p.mouse.up();await p.keyboard.up('Shift');
 console.log('Umschalt+Ziehen wählt alles im Rahmen (A, B, D, E), nicht C und F',await sel(p)==='multi:A,B,D,E'&&await p.evaluate(()=>document.querySelector('#box').hidden));
 /* Klick auf ein Mitglied ohne Ziehen */
 c=await at(p,'B');await p.mouse.click(c.x,c.y);
 console.log('Klick ohne Ziehen auf ein Mitglied macht daraus die Einzelauswahl',await sel(p)==='node:B');
 /* Auswahl-Werkzeug */
 await p.click('#tool-select');
 console.log('Werkzeug an: Knopf gedrückt, Fadenkreuz-Cursor',await p.evaluate(()=>document.querySelector('#tool-select').getAttribute('aria-pressed')==='true'&&__planner.tool()==='select'&&document.querySelector('#stage').classList.contains('seltool')));
 const v0=await p.evaluate(()=>({...__planner.view()}));
 const bx2=await emptyBox(p,'D','E');await p.mouse.move(bx2.x1,bx2.y1);await p.mouse.down();await p.mouse.move(bx2.x2,bx2.y2,{steps:6});await p.mouse.up();
 console.log('Werkzeug an: Ziehen auf der Fläche zieht einen Rahmen auf (ohne Umschalt), Ansicht bleibt stehen',await sel(p)==='multi:D,E'&&await p.evaluate(v=>{const w=__planner.view();return w.x===v.x&&w.y===v.y},v0));
 await p.click('#tool-select');const bx3=await emptyBox(p,'D','E');await p.mouse.move(bx3.x1,bx3.y1+260);await p.mouse.down();await p.mouse.move(bx3.x1+50,bx3.y1+300,{steps:4});await p.mouse.up();
 console.log('Werkzeug aus: Ziehen verschiebt wieder die Fläche',await p.evaluate(v=>{const w=__planner.view();return Math.abs(w.x-v.x-50)<=1&&!document.querySelector('#stage').classList.contains('seltool')},v0));
 await p.click('#fit');
 /* Umschalt-Rahmen ergänzt */
 c=await at(p,'A');await p.mouse.click(c.x,c.y);const fb=await at(p,'F');
 await p.keyboard.down('Shift');await p.mouse.move(fb.bb.x-15,fb.bb.y-15);await p.mouse.down();await p.mouse.move(fb.bb.x+fb.bb.width+15,fb.bb.y+fb.bb.height+15,{steps:5});await p.mouse.up();await p.keyboard.up('Shift');
 console.log('Umschalt-Rahmen ergänzt die bestehende Auswahl (A plus F)',await sel(p)==='multi:A,F');
 /* Strg+A, Esc */
 await p.keyboard.press('Escape');console.log('Esc hebt die Auswahl auf',await sel(p)==='none');
 await p.keyboard.press('Control+a');console.log('Strg+A wählt alle Knoten dieser Ebene',await sel(p)==='multi:A,B,C,D,E,F,Kap');
 await p.click('#f-clear');console.log('„Auswahl aufheben“ im Eigenschaftenfeld',await sel(p)==='none');
 /* Gemeinsam verschieben */
 const b2=await emptyBox(p,'A','E');await p.keyboard.down('Shift');await p.mouse.move(b2.x1,b2.y1);await p.mouse.down();await p.mouse.move(b2.x2,b2.y2,{steps:5});await p.mouse.up();await p.keyboard.up('Shift');
 const before=await pos(p),k=await p.evaluate(()=>__planner.view().k);const u0=await p.evaluate(()=>__planner.undoDepth());
 c=await at(p,'A');await p.mouse.move(c.x,c.y);await p.mouse.down();await p.mouse.move(c.x+60,c.y+40,{steps:6});await p.mouse.move(c.x+120,c.y+80,{steps:6});await p.mouse.up();
 const after=await pos(p),dx=Math.round(120/k),dy=Math.round(80/k);
 console.log('Zug an einem Mitglied verschiebt alle vier um dasselbe',['A','B','D','E'].every(t=>Math.abs(after[t][0]-before[t][0]-dx)<=1&&Math.abs(after[t][1]-before[t][1]-dy)<=1)&&['C','F','Kap'].every(t=>after[t][0]===before[t][0]&&after[t][1]===before[t][1]));
 console.log('Abstände untereinander bleiben, Auswahl bleibt bestehen',after.B[0]-after.A[0]===before.B[0]-before.A[0]&&after.E[1]-after.A[1]===before.E[1]-before.A[1]&&await sel(p)==='multi:A,B,D,E');
 console.log('Das Verschieben der Gruppe ist ein Undo-Schritt',await p.evaluate(()=>__planner.undoDepth())===u0+1);
 await p.keyboard.press('Control+z');const undone=await pos(p);console.log('Strg+Z stellt alle Positionen auf einmal her',['A','B','C','D','E','F'].every(t=>undone[t][0]===before[t][0]&&undone[t][1]===before[t][1]));
 await p.keyboard.press('Control+Shift+z');const redone=await pos(p);console.log('Wiederholen verschiebt sie wieder',redone.A[0]===after.A[0]&&redone.E[1]===after.E[1]);
 await p.keyboard.press('Control+z');
 /* Ein nicht ausgewählter Knoten bewegt nur sich */
 await p.click('#fit');c=await at(p,'F');const pb=await pos(p);await p.mouse.move(c.x,c.y);await p.mouse.down();await p.mouse.move(c.x-80,c.y-30,{steps:5});await p.mouse.up();const pa2=await pos(p);
 console.log('Zug an einem Knoten außerhalb der Auswahl: wählt ihn allein und bewegt nur ihn',await sel(p)==='node:F'&&pa2.F[0]!==pb.F[0]&&['A','B','C','D','E'].every(t=>pa2[t][0]===pb[t][0]));
 await p.keyboard.press('Control+z');
 /* Verbinden bei Mehrfachauswahl */
 await p.click('#fit');const b3=await emptyBox(p,'A','E');await p.keyboard.down('Shift');await p.mouse.move(b3.x1,b3.y1);await p.mouse.down();await p.mouse.move(b3.x2,b3.y2,{steps:5});await p.mouse.up();await p.keyboard.up('Shift');
 await p.click('#fit');
 const eN=await p.evaluate(()=>__planner.doc().graphs.g0.edges.length),pp=await pos(p);
 const oh=await p.locator('.node',{has:p.locator('.ti',{hasText:/^A$/})}).first().locator('.h.o').boundingBox(),ft=await at(p,'F');
 await p.mouse.move(oh.x+9,oh.y+9);await p.mouse.down();await p.mouse.move(ft.x,ft.y,{steps:6});await p.mouse.up();const pq=await pos(p);
 console.log('Ziehen vom Anschlusspunkt verbindet, statt die Gruppe zu bewegen',await p.evaluate(()=>__planner.doc().graphs.g0.edges.length)===eN+1&&['A','B','D','E'].every(t=>pq[t][0]===pp[t][0]&&pq[t][1]===pp[t][1]));
 await p.keyboard.press('Control+z');
 /* Pfeiltasten */
 await p.click('#fit');const b4=await emptyBox(p,'A','E');await p.keyboard.down('Shift');await p.mouse.move(b4.x1,b4.y1);await p.mouse.down();await p.mouse.move(b4.x2,b4.y2,{steps:5});await p.mouse.up();await p.keyboard.up('Shift');
 const n0=await pos(p),u1=await p.evaluate(()=>__planner.undoDepth());
 for(let i=0;i<3;i++)await p.keyboard.press('ArrowRight');
 const n1=await pos(p);console.log('Pfeil rechts ×3 verschiebt alle vier um 30',['A','B','D','E'].every(t=>n1[t][0]===n0[t][0]+30&&n1[t][1]===n0[t][1])&&n1.C[0]===n0.C[0]);
 console.log('Schnelle Pfeiltasten zählen als ein Undo-Schritt',await p.evaluate(()=>__planner.undoDepth())===u1+1);
 await p.keyboard.press('Shift+ArrowDown');const n2=await pos(p);console.log('Umschalt+Pfeil verschiebt in großen Schritten (50)',['A','B','D','E'].every(t=>n2[t][1]===n1[t][1]+50));
 console.log('Alle Pfeiltasten in einer Folge sind ein Schritt (auch Umschalt+Pfeil direkt danach)',await p.evaluate(()=>__planner.undoDepth())===u1+1);
 await p.keyboard.press('Control+z');const n3=await pos(p);console.log('Ein Strg+Z holt die ganze Folge zurück',['A','B','D','E'].every(t=>n3[t][0]===n0[t][0]&&n3[t][1]===n0[t][1]));
 /* Löschen */
 await p.click('#fit');const b5=await emptyBox(p,'A','E');await p.keyboard.down('Shift');await p.mouse.move(b5.x1,b5.y1);await p.mouse.down();await p.mouse.move(b5.x2,b5.y2,{steps:5});await p.mouse.up();await p.keyboard.up('Shift');
 const e0=await p.evaluate(()=>__planner.doc().graphs.g0.edges.length);p.msgs.length=0;
 await p.keyboard.press('Delete');
 console.log('Entf löscht alle vier samt ihrer Verbindungen',await p.evaluate(()=>{const g=__planner.doc().graphs.g0;return ['A','B','D','E'].every(t=>!Object.values(g.nodes).some(n=>n.title===t))&&Object.keys(g.nodes).length===3&&g.edges.every(e=>g.nodes[e.from]&&g.nodes[e.to])})&&e0===3&&await p.evaluate(()=>__planner.doc().graphs.g0.edges.length)===0);
 console.log('Ohne Kapitel in der Auswahl keine Rückfrage',p.msgs.length===0&&await sel(p)==='none');
 await p.keyboard.press('Control+z');console.log('Strg+Z bringt alle vier mit Verbindungen in einem Schritt zurück',await p.evaluate(()=>Object.keys(__planner.doc().graphs.g0.nodes).length===7&&__planner.doc().graphs.g0.edges.length===3));
 /* Löschen mit Kapitel */
 await p.keyboard.press('Control+a');p.msgs.length=0;p.mode='dismiss';await p.click('#f-del');
 console.log('Kapitel in der Auswahl: Rückfrage nennt die Gesamtzahl, Abbrechen löscht nichts',p.msgs.length===1&&/Kapitel mit insgesamt 2 Knoten/.test(p.msgs[0])&&await p.evaluate(()=>Object.keys(__planner.doc().graphs.g0.nodes).length===7&&Object.keys(__planner.doc().graphs).length===2));
 p.mode='accept';await p.click('#f-del');
 console.log('Bestätigen löscht alles samt Unterebene',await p.evaluate(()=>Object.keys(__planner.doc().graphs.g0.nodes).length===0&&Object.keys(__planner.doc().graphs).length===1));
 await p.keyboard.press('Control+z');console.log('Strg+Z holt Knoten und Unterebene zurück',await p.evaluate(()=>Object.keys(__planner.doc().graphs.g0.nodes).length===7&&Object.keys(__planner.doc().graphs).length===2&&Object.keys(__planner.doc().graphs.g1.nodes).length===2));
 /* Verbindung ausgewählt, dann Umschalt-Klick auf Knoten */
 await p.click('#fit');const ep=await p.evaluate(()=>{const e=document.querySelector('#eg g[data-edge] path.hit'),m=e.getPointAtLength(e.getTotalLength()/2),c=e.getScreenCTM();return {x:c.a*m.x+c.e,y:c.d*m.y+c.f}});
 await p.mouse.click(ep.x,ep.y);const was=await sel(p);await p.click('#fit');c=await at(p,'F');await p.keyboard.down('Shift');await p.mouse.click(c.x,c.y);await p.keyboard.up('Shift');
 console.log('Verbindung gewählt, Umschalt+Klick auf Knoten: Auswahl ist der Knoten',was==='edge'&&await sel(p)==='node:F');
 /* Gezoomt */
 await p.keyboard.press('Escape');await p.mouse.move(650,450);await p.mouse.wheel(0,500);await p.waitForTimeout(80);const kz=await p.evaluate(()=>__planner.view().k);
 const b6=await emptyBox(p,'A','B');await p.keyboard.down('Shift');await p.mouse.move(b6.x1,b6.y1);await p.mouse.down();await p.mouse.move(b6.x2,b6.y2,{steps:5});await p.mouse.up();await p.keyboard.up('Shift');
 console.log('Rahmen funktioniert auch herausgezoomt (A und B)',kz<1&&await sel(p)==='multi:A,B');
 /* Speichern und Neuladen */
 await p.waitForFunction("document.querySelector('#status').textContent==='Gespeichert'",null,{timeout:8000});
 /* Handy */
 const pm=await open({width:390,height:800});await pm.click('#tool-select');
 const m1=await at(pm,'A'),m2=await at(pm,'E');const mb=await emptyBox(pm,'A','E');await pm.mouse.move(mb.x1,mb.y1);await pm.mouse.down();await pm.mouse.move(mb.x2,mb.y2,{steps:5});await pm.mouse.up();
 console.log('Handybreite: Werkzeug und Auswahl, kein waagerechtes Scrollen',await pm.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1)&&(await sel(pm)).startsWith('multi:'));
 if(process.env.SHOT){await p.click('#fit');const b7=await emptyBox(p,'A','E');await p.keyboard.down('Shift');await p.mouse.move(b7.x1,b7.y1);await p.mouse.down();await p.mouse.move(b7.x2,b7.y2,{steps:5});await p.mouse.up();await p.keyboard.up('Shift');await p.screenshot({path:process.env.SHOT})}
 await b.close();srv.close();
})();
