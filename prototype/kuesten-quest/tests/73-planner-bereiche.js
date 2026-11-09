// Planner: Bereiche (farbige Rahmen auf einer Ebene). Zugehörigkeit nach Lage, Verschieben samt Inhalt, Größe ändern, „Auswahl umrahmen“, Markdown-Abschnitt „Bereiche“,
// kein Teil der Ablauf-Prüfung. Echte Planner-Klasse mit SQLite-Attrappe (node:sqlite), dazu die Oberfläche im Browser. Der Zugehörigkeits-Code steht in Server und Seite wortgleich.
process.removeAllListeners('warning');process.on('warning',()=>{});
const {chromium}=require('playwright');const http=require('http'),fs=require('fs'),os=require('os'),path=require('path'),{pathToFileURL}=require('url');
(async()=>{
 const {DatabaseSync}=require('node:sqlite');
 const W=await import(pathToFileURL(path.join(__dirname,'..','..','..','worker','planner.js')).href);
 const {Planner,toMarkdown,cleanDoc,checkDoc,areaMembers,countNodes,AREA_COLORS}=W;
 const N=(id,type,title,x,y,extra={})=>({id,type,title,text:'',x,y,mandatory:false,...extra});
 const AR=(id,title,x,y,w,h,extra={})=>N(id,'area',title,x,y,{w,h,color:'blue',...extra});
 const E=(id,from,to)=>({id,from,to,label:''});
 const doc1=(nodes,edges=[])=>({v:1,root:'g0',title:'',graphs:{g0:{id:'g0',name:'Spiel',parent:null,nodes,edges}}});
 const cn=(nodes,edges)=>cleanDoc(doc1(nodes,edges)).graphs.g0;
 /* Dokument-Prüfung */
 const a1=cn({a:AR('a','Atoll',0,0,600,400,{color:'teal',text:'Insel',mandatory:true,role:'start',card:5,kind:'event'})}).nodes.a;
 console.log('Bereich behält Titel, Größe, Farbe und Beschreibung',a1.type==='area'&&a1.title==='Atoll'&&a1.w===600&&a1.h===400&&a1.color==='teal'&&a1.text==='Insel');
 console.log('Bereich trägt weder Pflicht, Rolle, Karte noch Kategorie',a1.mandatory===false&&a1.role===undefined&&a1.card===undefined&&a1.kind===undefined);
 const a2=cn({a:N('a','area','X',0,0)}).nodes.a;console.log('Fehlende Größe und Farbe: Vorgaben 560 × 340, Blau',a2.w===560&&a2.h===340&&a2.color==='blue');
 const a3=cn({a:AR('a','X',0,0,5,5),b:AR('b','Y',0,0,99999,99999),c:AR('c','Z',0,0,'groß',NaN)}).nodes;console.log('Größe wird begrenzt (Minimum 140 × 90, Maximum 20000) und Unsinn ersetzt',a3.a.w===140&&a3.a.h===90&&a3.b.w===20000&&a3.b.h===20000&&a3.c.w===560&&a3.c.h===340);
 console.log('Unbekannte Farbe wird Blau, alle sieben Farben bleiben',cn({a:AR('a','X',0,0,200,200,{color:'neon'})}).nodes.a.color==='blue'&&AREA_COLORS.every(c=>cn({a:AR('a','X',0,0,200,200,{color:c})}).nodes.a.color===c)&&AREA_COLORS.length===7);
 const ge=cn({a:N('a','scene','A',0,0),b:N('b','scene','B',200,0),r:AR('r','R',0,0,500,300)},[E('1','a','b'),E('2','r','a'),E('3','b','r')]);
 console.log('Verbindungen an einen Bereich entfallen, das Dokument bleibt gültig',ge.edges.length===1&&ge.edges[0].id==='1'&&!!cleanDoc(doc1({a:N('a','scene','A',0,0),r:AR('r','R',0,0,500,300)},[E('2','r','a')])));
 console.log('Prüfen bleibt wiederholbar (idempotent)',(()=>{const c=cleanDoc(doc1({a:AR('a','X',0,0,300,200,{color:'red'}),b:N('b','scene','B',50,50)}));return JSON.stringify(cleanDoc(c))===JSON.stringify(c)})());
 /* Zugehörigkeit nach Lage */
 const mem=(nodes)=>areaMembers(cn(nodes));
 console.log('Knoten innerhalb gehört dazu, außerhalb nicht',(()=>{const m=mem({r:AR('r','R',0,0,600,400),a:N('a','scene','A',100,100),z:N('z','scene','Z',1000,100)});return m.r.nodes.join()==='a'})());
 console.log('Es zählt der Mittelpunkt: halb im Rahmen ist draußen, wenn die Mitte draußen liegt',(()=>{const m=mem({r:AR('r','R',0,0,600,400),a:N('a','scene','A',-120,100),b:N('b','scene','B',-60,100)});return m.r.nodes.join()==='b'})());
 console.log('Der Rand zählt mit (Mittelpunkt genau auf der Kante)',mem({r:AR('r','R',0,0,600,400),a:N('a','scene','A',505,160)}).r.nodes.join()==='a');
 const nest=mem({o:AR('o','Atoll',0,0,800,500),i:AR('i','Hafen',30,60,300,200),p:N('p','scene','P',60,100),q:N('q','scene','Q',450,100)});
 console.log('Verschachtelt: der kleinste Bereich gewinnt, Unterbereich gehört zum größeren',nest.i.nodes.join()==='p'&&nest.o.nodes.join()==='q'&&nest.o.areas.join()==='i'&&nest.i.areas.length===0);
 console.log('Gleich große Bereiche besitzen sich nicht gegenseitig',(()=>{const m=mem({a:AR('a','A',0,0,300,200),b:AR('b','B',0,0,300,200)});return m.a.areas.length===0&&m.b.areas.length===0})());
 console.log('Ohne Bereiche leeres Ergebnis',Object.keys(areaMembers(cn({a:N('a','scene','A',0,0)}))).length===0);
 console.log('Reihenfolge der Mitglieder ist stabil (links nach rechts)',mem({r:AR('r','R',0,0,900,400),b:N('b','scene','B',400,50),a:N('a','scene','A',100,50),c:N('c','scene','C',600,50)}).r.nodes.join()==='a,b,c');
 /* Prüfung und Zähler */
 console.log('Bereiche zählen nicht zur Ablauf-Prüfung',checkDoc(doc1({r:AR('r','R',0,0,500,300)})).length===0&&(()=>{const c=checkDoc(doc1({a:N('a','scene','A',0,0,{role:'start'}),b:N('b','scene','B',300,0,{role:'end'}),r:AR('r','R',-20,-60,700,300)},[E('1','a','b')]));return c[0].warnings.length===0})());
 console.log('Zähler für Dokumentliste und Versionen ohne Bereiche',countNodes(cn.call(null,{a:N('a','scene','A',0,0),r:AR('r','R',0,0,300,200)})&&doc1({a:N('a','scene','A',0,0),r:AR('r','R',0,0,300,200)}))===1);
 /* Markdown */
 const md=toMarkdown(doc1({
  o:AR('o','Atoll *Süd*',0,0,800,500,{color:'teal',text:'Insel im Westen\nmit Hafen'}),i:AR('i','Hafen',30,60,300,200),
  p:N('p','scene','Ankunft',60,100,{role:'start'}),q:N('q','scene','Strand',450,100),z:N('z','scene','Draußen',1200,100,{role:'end'}),e:AR('e','Leer',0,700,300,200,{color:'gray'})},
  [E('1','p','q'),E('2','q','z')]),{});
 console.log('Abschnitt „Bereiche“ mit verschachtelten Einträgen',/^## Bereiche$/m.test(md)&&/- \*\*Atoll \\\*Süd\\\*\*\* `o` \(Ebene Spiel\): „Strand“ `q`/.test(md)&&/\n  - \*\*Hafen\*\* `i`: „Ankunft“ `p`/.test(md));
 console.log('Beschreibung des Bereichs steht als Zitat',md.includes('> Insel im Westen mit Hafen'));
 console.log('Leerer Bereich ist als leer gekennzeichnet',/\*\*Leer\*\* `e`.*_\(leer\)_/.test(md));
 console.log('Knotenzeilen nennen den innersten Bereich',md.includes('**[START] Szene: Ankunft** `p` — Bereich: Hafen')&&md.includes('**Szene: Strand** `q` — Bereich: Atoll \\*Süd\\*')&&!/Szene: Draußen.*Bereich/.test(md));
 console.log('Bereiche erscheinen nicht als Knoten (Zähler, Abschnittsliste)',/ 3 Knoten, 2 Verbindungen/.test(md)&&!/\*\*Bereich: /.test(md)&&/\(3 Knoten\)/.test(md));
 console.log('Lesehilfe erklärt Bereiche',/„Bereiche“ sind farbige Rahmen/.test(md));
 console.log('Ohne Bereiche weder Abschnitt noch Lesehilfe-Zeile',!/Bereiche/.test(toMarkdown(doc1({a:N('a','scene','A',0,0)}),{})));
 console.log('Kapitel zählt seine Knoten ohne Bereiche',(()=>{const d={v:1,root:'g0',title:'',graphs:{g0:{id:'g0',name:'Spiel',parent:null,nodes:{k:N('k','chapter','Kap',0,0,{graph:'g1'})},edges:[]},g1:{id:'g1',name:'Kap',parent:'g0',nodes:{s:N('s','scene','S',0,0),r:AR('r','R',0,0,300,200)},edges:[]}}};return /Inhalt: siehe Abschnitt „Kap“ \(1 Knoten\)/.test(toMarkdown(d,{}))})());
 /* Server: Speichern und Lesen */
 const mem0=new Map(),db=new DatabaseSync(':memory:');
 const sql={exec(q,...a){const st=db.prepare(q);if(/^\s*(SELECT|PRAGMA)/i.test(q))return {toArray:()=>st.all(...a).map(r=>({...r}))};st.run(...a);return {toArray:()=>[]}}};
 const R=new Planner({storage:{sql,get:async k=>mem0.get(k),put:async o=>{for(const k in o)mem0.set(k,o[k])},delete:async k=>{for(const x of [].concat(k))mem0.delete(x)}}});
 const callR=async(m,u,body)=>{const r=await R.fetch(new Request('http://x'+u,{method:m,body:body==null?undefined:JSON.stringify(body)}));const tx=await r.text();let j=null;try{j=JSON.parse(tx)}catch(e){}return {s:r.status,j,tx}};
 await callR('PUT','/api/planner',{rev:0,doc:doc1({a:N('a','scene','A',0,0),r:AR('r','R',-20,-60,300,200,{color:'orange'})})});
 const got=(await callR('GET','/api/planner')).j.doc.graphs.g0.nodes.r;console.log('Bereich überlebt Speichern und Lesen',got.type==='area'&&got.w===300&&got.color==='orange');
 const lst=(await callR('GET','/api/planner/docs')).j.docs.find(d=>d.id==='main');console.log('Dokumentliste zählt ohne Bereiche',lst.nodes===1);
 /* Oberfläche */
 const html=fs.readFileSync(path.join(__dirname,'..','dist','planner.html'));
 const srv=http.createServer(async(rq,s)=>{const u=rq.url.split('?')[0];
  if(u==='/planner'){s.writeHead(200,{'content-type':'text/html; charset=utf-8'});s.end(html);return}
  if(u.startsWith('/api/planner')){const ch=[];for await(const x of rq)ch.push(x);const body=Buffer.concat(ch).toString();const r=await R.fetch(new Request('http://x'+rq.url,{method:rq.method,body:['PUT','POST'].includes(rq.method)?body:undefined}));s.writeHead(r.status,{'content-type':r.headers.get('content-type')||'application/json'});s.end(await r.text());return}
  s.writeHead(404);s.end()});
 await new Promise(r=>srv.listen(8945,r));
 const B='http://localhost:8945',b=await chromium.launch();
 const DOC=()=>({v:1,root:'g0',title:'',graphs:{g0:{id:'g0',name:'Spiel',parent:null,nodes:{a:N('a','scene','A',0,0),b:N('b','scene','B',250,0),c:N('c','scene','C',800,0),d:N('d','scene','D',0,300),k:N('k','chapter','Kap',500,300,{graph:'g1'})},edges:[E('1','a','b')]},g1:{id:'g1',name:'Kap',parent:'g0',nodes:{s1:N('s1','scene','S1',0,0),s2:N('s2','scene','S2',250,0),x:AR('x','Zone',-20,-60,600,250)},edges:[E('2','s1','s2')]}}});
 const NEST=()=>({v:1,root:'g0',title:'',graphs:{g0:{id:'g0',name:'Spiel',parent:null,nodes:{o:AR('o','Atoll',0,0,800,500,{color:'teal'}),i:AR('i','Hafen',30,60,300,200),p:N('p','scene','P',60,100),q:N('q','scene','Q',450,100),r:N('r','scene','R',1000,100)},edges:[E('1','p','q'),E('2','q','r')]}}});
 const mkDoc=async name=>(await (await fetch(B+'/api/planner/docs',{method:'POST',body:JSON.stringify({name})})).json()).id;
 const open=async(doc=DOC(),vp={width:1300,height:800})=>{const ctx=await b.newContext({viewport:vp});const p=await ctx.newPage();p.msgs=[];p.mode='accept';
  p.on('pageerror',e=>console.log('ERR Seite',e.message));p.on('dialog',dl=>{p.msgs.push(dl.type()+': '+dl.message());p.mode==='dismiss'&&dl.type()==='confirm'?dl.dismiss():dl.accept()});
  p.did=await mkDoc('T'+Math.random().toString(36).slice(2,6));await p.goto(B+'/planner?d='+p.did);await p.waitForFunction('window.__planner');
  const f=path.join(os.tmpdir(),'planner-73-'+Math.random().toString(36).slice(2)+'.json');fs.writeFileSync(f,JSON.stringify(doc));await p.setInputFiles('#file',f);await p.waitForFunction(()=>Object.keys(__planner.doc().graphs.g0.nodes).length>0,null,{timeout:5000});fs.unlinkSync(f);
  await p.click('#fit');return p};
 const nodes=p=>p.evaluate(()=>Object.fromEntries(Object.values(__planner.doc().graphs[__planner.gid()].nodes).map(n=>[n.title,n])));
 const pos=async p=>Object.fromEntries(Object.entries(await nodes(p)).map(([t,n])=>[t,[n.x,n.y]]));
 const sel=p=>p.evaluate(()=>{const s=__planner.sel();return s?(s.kind==='multi'?'multi:'+s.ids.map(i=>__planner.doc().graphs[__planner.gid()].nodes[i].title).sort().join(','):s.kind==='node'?'node:'+__planner.doc().graphs[__planner.gid()].nodes[s.id].title:s.kind):'none'});
 const at=async(p,t)=>{const bb=await p.locator('.node',{has:p.locator('.ti',{hasText:new RegExp('^'+t+'$')})}).first().boundingBox();return {x:bb.x+60,y:bb.y+14,bb}};
 const bar=async(p,t)=>{const bb=await p.locator('.area',{has:p.locator('.abar',{hasText:new RegExp('^'+t+'$')})}).first().locator('.abar').boundingBox();return {x:bb.x+bb.width/2,y:bb.y+bb.height/2,bb}};
 const p=await open();
 /* Paritäts-Prüfung */
 const smp=[cn({r:AR('r','R',0,0,600,400),a:N('a','scene','A',100,100),z:N('z','scene','Z',1000,100)}),cn({o:AR('o','O',0,0,800,500),i:AR('i','I',30,60,300,200),p:N('p','scene','P',60,100),q:N('q','scene','Q',450,100)}),cn({a:N('a','scene','A',0,0)})];
 console.log('Zugehörigkeits-Code der Seite liefert dasselbe wie der Server',JSON.stringify(await p.evaluate(g=>g.map(x=>__planner.members(x)),smp))===JSON.stringify(smp.map(g=>areaMembers(g))));
 console.log('Der Block steht wortgleich in Server und Seite',(()=>{const sv=fs.readFileSync(path.join(__dirname,'..','..','..','worker','planner.js'),'utf8'),pg=fs.readFileSync(path.join(__dirname,'..','dist','planner.html'),'utf8');const cut=(t,a,z)=>t.slice(t.indexOf(a),t.indexOf(z)).replace(/export function /g,'function ').replace(/\n   Dieser Block[^\n]*\n?/,'\n');const x=cut(sv,'function areaCenter','/* Ablauf-Prüfung'),y=cut(pg,'function areaCenter','/* Ablauf-Prüfung');return x.length>400&&x.trim()===y.trim()})());
 /* Anlegen */
 console.log('Knopf „+ Bereich“ vorhanden',await p.evaluate(()=>!!document.querySelector('#add-area')&&/Bereich/.test(document.querySelector('#add-area').textContent)));
 await p.click('#add-area');
 console.log('Neuer Bereich: Rahmen mit Titelleiste und Größengriff, ausgewählt',await p.evaluate(()=>{const a=Object.values(__planner.doc().graphs.g0.nodes).find(n=>n.type==='area'),e=document.querySelector('.area.sel');return !!a&&!!e&&e.querySelector('.abar').textContent==='Bereich'&&!!e.querySelector('.ares')&&a.w===560&&a.h===340&&parseFloat(e.style.width)===560&&__planner.sel().id===a.id}));
 console.log('Eigenschaften: Titel, Farbe (7), Beschreibung, Inhalt, Löschen; keine Art, Kategorie, Rolle, Pflicht',await p.evaluate(()=>!!document.querySelector('#f-title')&&document.querySelector('#f-color').options.length===7&&!!document.querySelector('#f-text')&&!!document.querySelector('#f-members')&&/Bereich löschen \(Inhalt bleibt\)/.test(document.querySelector('#f-del').textContent)&&document.querySelector('#insp h2').textContent==='Bereich'&&!document.querySelector('#f-type,#f-kind,#f-card,#f-mand,fieldset.roles')));
 await p.fill('#f-title','Atoll');await p.selectOption('#f-color','green');
 console.log('Titel und Farbe wirken sofort (Leiste, Farbklasse)',await p.evaluate(()=>{const e=document.querySelector('.area');return e.querySelector('.abar').textContent==='Atoll'&&e.classList.contains('c-green')&&Object.values(__planner.doc().graphs.g0.nodes).find(n=>n.type==='area').color==='green'}));
 console.log('Bereich ist nicht gedimmt, auch bei „Nur Pflicht“',await (async()=>{await p.click('#mand-filter');const r=await p.evaluate(()=>!document.querySelector('.area').classList.contains('dim')&&getComputedStyle(document.querySelector('.area')).opacity==='1');await p.click('#mand-filter');return r})());
 /* Durchklicken und Ebenen */
 await p.click('#fit');const ab=await p.locator('.area').boundingBox();
 console.log('Das Innere ist durchlässig: Klicks treffen die Fläche, nicht den Bereich',await p.evaluate(([x,y])=>{const e=document.elementFromPoint(x,y);return !e.closest('.area')},[ab.x+ab.width/2,ab.y+ab.height/2]));
 console.log('Titelleiste und Größengriff sind greifbar',await p.evaluate(([x,y,x2,y2])=>!!document.elementFromPoint(x,y).closest('.abar')&&!!document.elementFromPoint(x2,y2).closest('.ares'),[ab.x+ab.width-70,ab.y+12,ab.x+ab.width-8,ab.y+ab.height-8]));
 const v0=await p.evaluate(()=>({...__planner.view()})),ar0=await p.evaluate(()=>{const a=Object.values(__planner.doc().graphs.g0.nodes).find(n=>n.type==='area');return [a.x,a.y]});
 await p.mouse.move(ab.x+ab.width/2,ab.y+ab.height/2+40);await p.mouse.down();await p.mouse.move(ab.x+ab.width/2+50,ab.y+ab.height/2+70,{steps:5});await p.mouse.up();
 console.log('Ziehen im Inneren verschiebt die Fläche, nicht den Bereich',await p.evaluate(([v,a])=>{const w=__planner.view(),n=Object.values(__planner.doc().graphs.g0.nodes).find(x=>x.type==='area');return Math.abs(w.x-v.x-50)<=1&&n.x===a[0]&&n.y===a[1]},[v0,ar0]));
 await p.evaluate(()=>{const g=__planner.doc().graphs.g0;for(const id of Object.keys(g.nodes))if(g.nodes[id].type==='area')delete g.nodes[id]});
 /* Frisch laden für saubere Ausgangslage, dann Umrahmen */
 const p2=await open();
 let c=await at(p2,'A');await p2.mouse.click(c.x,c.y);c=await at(p2,'B');await p2.keyboard.down('Shift');await p2.mouse.click(c.x,c.y);await p2.keyboard.up('Shift');
 console.log('Mehrfachauswahl bietet „Auswahl umrahmen“',await p2.evaluate(()=>!!document.querySelector('#f-frame')&&!document.querySelector('#f-frame').disabled));
 await p2.click('#f-frame');
 const fr=await p2.evaluate(()=>{const g=__planner.doc().graphs.g0.nodes,a=Object.values(g).find(n=>n.type==='area'),A=g.a,Bn=g.b;return {a,A,Bn,sel:__planner.sel().id===a.id,mem:__planner.members(__planner.doc().graphs.g0)[a.id]}});
 console.log('Umrahmen legt einen Bereich um A und B (Rand 30, oben 60) und wählt ihn',fr.sel&&fr.a.x===fr.A.x-30&&fr.a.y<=fr.A.y-60+1&&fr.a.x+fr.a.w>=fr.Bn.x+190+30-1&&fr.a.y+fr.a.h>fr.A.y+60);
 console.log('Der Bereich enthält genau A und B, nicht C und D',fr.mem.nodes.sort().join()==='a,b');
 console.log('Eigenschaften nennen die Zahl der Knoten darin',await p2.evaluate(()=>/Enthält 2 Knoten/.test(document.querySelector('#f-members').textContent)));
 console.log('Der neue Bereich liegt hinter den Knoten (Klick auf A trifft den Knoten)',await p2.evaluate(()=>{const n=document.querySelector('.node .ti');const r=n.getBoundingClientRect();const e=document.elementFromPoint(r.left+5,r.top+5);return !!e.closest('.node')}));
 /* Verschieben samt Inhalt */
 const before=await pos(p2),aBefore=await p2.evaluate(()=>{const a=Object.values(__planner.doc().graphs.g0.nodes).find(n=>n.type==='area');return [a.x,a.y]});const k=await p2.evaluate(()=>__planner.view().k),u0=await p2.evaluate(()=>__planner.undoDepth());
 const bh=await p2.locator('.area .abar').boundingBox();await p2.mouse.move(bh.x+bh.width/2,bh.y+bh.height/2);await p2.mouse.down();await p2.mouse.move(bh.x+bh.width/2+60,bh.y+bh.height/2+40,{steps:5});await p2.mouse.move(bh.x+bh.width/2+120,bh.y+bh.height/2+80,{steps:5});await p2.mouse.up();
 const dx=Math.round(120/k),dy=Math.round(80/k),after=await pos(p2),aAfter=await p2.evaluate(()=>{const a=Object.values(__planner.doc().graphs.g0.nodes).find(n=>n.type==='area');return [a.x,a.y]});
 console.log('Zug an der Titelleiste verschiebt den Bereich samt A und B um dasselbe',Math.abs(aAfter[0]-aBefore[0]-dx)<=1&&Math.abs(aAfter[1]-aBefore[1]-dy)<=1&&['A','B'].every(t=>after[t][0]-before[t][0]===aAfter[0]-aBefore[0]&&after[t][1]-before[t][1]===aAfter[1]-aBefore[1]));
 console.log('C, D und Kap bleiben stehen',['C','D','Kap'].every(t=>after[t][0]===before[t][0]&&after[t][1]===before[t][1]));
 console.log('Das ist ein einziger Undo-Schritt',await p2.evaluate(()=>__planner.undoDepth())===u0+1);
 await p2.keyboard.press('Control+z');const undone=await pos(p2);console.log('Strg+Z stellt Bereich und Inhalt zugleich her',['A','B','C','D'].every(t=>undone[t][0]===before[t][0]&&undone[t][1]===before[t][1]));
 await p2.keyboard.press('Control+Shift+z');
 /* Knoten heraus- und hineinziehen */
 await p2.click('#fit');c=await at(p2,'A');await p2.mouse.move(c.x,c.y);await p2.mouse.down();await p2.mouse.move(c.x+30,c.y+400,{steps:6});await p2.mouse.up();
 console.log('Ein aus dem Rahmen gezogener Knoten gehört nicht mehr dazu',await p2.evaluate(()=>{const g=__planner.doc().graphs.g0,a=Object.values(g.nodes).find(n=>n.type==='area');return __planner.members(g)[a.id].nodes.join()==='b'}));
 await p2.keyboard.press('Control+z');
 /* Größe ändern */
 await p2.click('#fit');await p2.locator('.area .abar').click();
 const w0=await p2.evaluate(()=>{const a=Object.values(__planner.doc().graphs.g0.nodes).find(n=>n.type==='area');return [a.w,a.h]}),k2=await p2.evaluate(()=>__planner.view().k),u1=await p2.evaluate(()=>__planner.undoDepth()),posB=await pos(p2);
 let rh=await p2.locator('.area .ares').boundingBox();await p2.mouse.move(rh.x+10,rh.y+10);await p2.mouse.down();await p2.mouse.move(rh.x+10+60,rh.y+10+40,{steps:5});await p2.mouse.move(rh.x+10+100,rh.y+10+60,{steps:5});await p2.mouse.up();
 const w1=await p2.evaluate(()=>{const a=Object.values(__planner.doc().graphs.g0.nodes).find(n=>n.type==='area');return [a.w,a.h]});
 console.log('Der Griff unten rechts ändert die Größe um den Zug',Math.abs(w1[0]-w0[0]-Math.round(100/k2))<=1&&Math.abs(w1[1]-w0[1]-Math.round(60/k2))<=1);
 console.log('Größe ändern bewegt keinen Knoten und ist ein Undo-Schritt',JSON.stringify(await pos(p2))===JSON.stringify(posB)&&await p2.evaluate(()=>__planner.undoDepth())===u1+1);
 await p2.keyboard.press('Control+z');console.log('Strg+Z stellt die alte Größe her',await p2.evaluate(w=>{const a=Object.values(__planner.doc().graphs.g0.nodes).find(n=>n.type==='area');return a.w===w[0]&&a.h===w[1]},w0));
 await p2.click('#fit');await p2.locator('.area .abar').click();rh=await p2.locator('.area .ares').boundingBox();await p2.mouse.move(rh.x+10,rh.y+10);await p2.mouse.down();await p2.mouse.move(rh.x-1500,rh.y-1500,{steps:8});await p2.mouse.up();
 console.log('Verkleinern stoppt bei 140 × 90',await p2.evaluate(()=>{const a=Object.values(__planner.doc().graphs.g0.nodes).find(n=>n.type==='area');return a.w===140&&a.h===90}));
 await p2.keyboard.press('Control+z');
 /* Größer ziehen nimmt C auf */
 await p2.click('#fit');await p2.locator('.area .abar').click();rh=await p2.locator('.area .ares').boundingBox();const cc=await at(p2,'C');
 await p2.mouse.move(rh.x+10,rh.y+10);await p2.mouse.down();await p2.mouse.move(cc.bb.x+cc.bb.width+30,cc.bb.y+cc.bb.height+30,{steps:8});await p2.mouse.up();
 console.log('Wird der Rahmen größer, kommen Knoten in ihm dazu (C)',await p2.evaluate(()=>{const g=__planner.doc().graphs.g0,a=Object.values(g.nodes).find(n=>n.type==='area');return __planner.members(g)[a.id].nodes.includes('c')}));
 await p2.keyboard.press('Control+z');
 /* Auswahl: Rahmen, Strg+A, Pfeiltasten */
 await p2.click('#fit');await p2.keyboard.press('Escape');
 const ab2=await p2.locator('.area').boundingBox(),cB=await at(p2,'A'),cB2=await at(p2,'B');
 await p2.keyboard.down('Shift');await p2.mouse.move(cB.bb.x-8,cB.bb.y-8);await p2.mouse.down();await p2.mouse.move(cB2.bb.x+cB2.bb.width+8,cB2.bb.y+cB2.bb.height+8,{steps:5});await p2.mouse.up();await p2.keyboard.up('Shift');
 console.log('Auswahlrahmen, der den Bereich nur schneidet, wählt ihn nicht (nur A und B)',await sel(p2)==='multi:A,B');
 await p2.keyboard.press('Escape');await p2.keyboard.press('Control+a');
 console.log('Strg+A wählt auch den Bereich mit',await p2.evaluate(()=>{const s=__planner.sel();return s.kind==='multi'&&s.ids.some(i=>__planner.doc().graphs.g0.nodes[i].type==='area')&&s.ids.length===6}));
 const pre=await pos(p2);await p2.keyboard.press('ArrowRight');const post=await pos(p2);
 console.log('Auswahl mit Bereich und Inhalt: Pfeil rechts bewegt jeden Knoten genau einmal um 10 (kein Doppeln)',Object.keys(pre).every(t=>post[t][0]===pre[t][0]+10&&post[t][1]===pre[t][1]));
 await p2.keyboard.press('Control+z');await p2.keyboard.press('Escape');
 /* Bereich allein ausgewählt: Pfeile bewegen den Inhalt mit */
 await p2.locator('.area .abar').click();const pa=await pos(p2);await p2.keyboard.press('Shift+ArrowDown');const pb=await pos(p2);const am=await p2.evaluate(()=>{const g=__planner.doc().graphs.g0;return __planner.members(g)[Object.values(g.nodes).find(n=>n.type==='area').id].nodes});
 console.log('Nur der Bereich ausgewählt: Pfeiltasten bewegen ihn samt Inhalt (A, B), C bleibt',['A','B'].every(t=>pb[t][1]===pa[t][1]+50)&&pb.C[1]===pa.C[1]&&am.sort().join()==='a,b');
 await p2.keyboard.press('Control+z');
 /* Verbinden mit Bereich unmöglich */
 await p2.keyboard.press('Escape');await p2.click('#fit');
 const e0=await p2.evaluate(()=>__planner.doc().graphs.g0.edges.length);const dh=await p2.locator('.node',{has:p2.locator('.ti',{hasText:/^D$/})}).first().locator('.h.o').boundingBox(),tb=await bar(p2,'Bereich');
 await p2.mouse.move(dh.x+9,dh.y+9);await p2.mouse.down();await p2.mouse.move(tb.x,tb.y,{steps:6});await p2.mouse.up();
 console.log('Ziehen von einem Knoten auf die Titelleiste legt keine Verbindung an',await p2.evaluate(()=>__planner.doc().graphs.g0.edges.length)===e0);
 console.log('Bereiche haben keine Anschlusspunkte',await p2.evaluate(()=>!document.querySelector('.area .h')));
 /* Löschen */
 await p2.keyboard.press('Escape');await p2.locator('.area .abar').click();const nn=await p2.evaluate(()=>Object.keys(__planner.doc().graphs.g0.nodes).length);p2.msgs.length=0;await p2.keyboard.press('Delete');
 console.log('Entf löscht nur den Bereich, ohne Rückfrage; Knoten und Verbindungen bleiben',await p2.evaluate(n=>{const g=__planner.doc().graphs.g0;return Object.keys(g.nodes).length===n-1&&!Object.values(g.nodes).some(x=>x.type==='area')&&g.edges.length===1&&!document.querySelector('.area')},nn)&&p2.msgs.length===0);
 await p2.keyboard.press('Control+z');console.log('Strg+Z bringt den Bereich zurück',await p2.evaluate(()=>!!document.querySelector('.area')&&Object.values(__planner.doc().graphs.g0.nodes).some(x=>x.type==='area')));
 /* Kapitel mit Bereich darin */
 console.log('Kapitelkasten zählt nur die Knoten (2), nicht den Bereich in seiner Ebene',await p2.evaluate(()=>[...document.querySelectorAll('.node.chapter .cnt')].some(e=>/^2 Knoten/.test(e.textContent))));
 console.log('Prüfung: der Bereich verursacht keine Hinweise in seiner Ebene',await (async()=>{await p2.dblclick('.node.chapter');await p2.waitForFunction("__planner.gid()==='g1'");const r=await p2.evaluate(()=>!!document.querySelector('.area')&&__planner.check(__planner.doc()).every(c=>c.gid!=='g1'||c.warnings.every(w=>!w.id||__planner.doc().graphs.g1.nodes[w.id].type!=='area')));await p2.click('#up');return r})());
 /* Speichern, Neuladen, Markdown */
 await p2.waitForFunction("document.querySelector('#status').textContent==='Gespeichert'",null,{timeout:8000});await p2.reload();await p2.waitForFunction('window.__planner');
 console.log('Nach Neuladen sind Bereich, Größe und Farbe da',await p2.evaluate(()=>{const a=Object.values(__planner.doc().graphs.g0.nodes).find(n=>n.type==='area'),e=document.querySelector('.area');return !!a&&!!e&&parseFloat(e.style.width)===a.w&&a.color==='blue'||a.color!==undefined}));
 const ex=await (await fetch(B+'/api/planner/export?d='+p2.did)).text();
 console.log('Markdown vom Server: Abschnitt „Bereiche“ nennt A und B, Knotenzeile mit Bereich',/## Bereiche/.test(ex)&&/„A“ `a`, „B“ `b`/.test(ex)&&/Szene: A\*\* `a` — Bereich: Bereich/.test(ex));
 /* Einpassen und Vorlage */
 await p2.click('#fit');console.log('Einpassen zeigt den ganzen Bereich',await p2.evaluate(()=>{const s=document.querySelector('#stage').getBoundingClientRect(),r=document.querySelector('.area').getBoundingClientRect();return r.left>=s.left-1&&r.right<=s.right+1&&r.top>=s.top-1&&r.bottom<=s.bottom+1}));
 await p2.selectOption('#tpl','hero');
 console.log('Heldenreise wird unterhalb vorhandener Bereiche eingefügt',await p2.evaluate(()=>{const g=__planner.doc().graphs.g0,a=Object.values(g.nodes).find(n=>n.type==='area'),ch=Object.values(g.nodes).filter(n=>n.type==='chapter'&&n.card!==undefined);return ch.length===22&&ch.every(n=>n.y>=a.y+a.h-200+150)}));
 await p2.keyboard.press('Control+z');
 /* Verschachtelt */
 const p3=await open(NEST());
 console.log('Verschachtelt: Unterbereich ist grüner Rahmen im größeren, Leisten beider greifbar',await p3.evaluate(()=>document.querySelectorAll('.area').length===2&&document.querySelectorAll('.area .abar').length===2));
 const nb=await pos(p3),k3=await p3.evaluate(()=>__planner.view().k),oBar=await bar(p3,'Atoll');
 await p3.mouse.move(oBar.x+100,oBar.y);await p3.mouse.down();await p3.mouse.move(oBar.x+160,oBar.y+40,{steps:5});await p3.mouse.up();
 const na=await pos(p3);
 console.log('Der äußere Bereich nimmt Unterbereich und alle Knoten darin mit (P, Q, Hafen)',['Atoll','Hafen','P','Q'].every(t=>na[t][0]-nb[t][0]===na.Atoll[0]-nb.Atoll[0]&&na[t][1]-nb[t][1]===na.Atoll[1]-nb.Atoll[1])&&na.Atoll[0]!==nb.Atoll[0]&&na.R[0]===nb.R[0]);
 await p3.keyboard.press('Control+z');const nb2=await pos(p3),iBar=await bar(p3,'Hafen');
 await p3.mouse.move(iBar.x+40,iBar.y);await p3.mouse.down();await p3.mouse.move(iBar.x+90,iBar.y+30,{steps:5});await p3.mouse.up();const nc=await pos(p3);
 console.log('Der innere nimmt nur seinen Inhalt mit (P), nicht Q und nicht den äußeren',nc.Hafen[0]!==nb2.Hafen[0]&&nc.P[0]-nb2.P[0]===nc.Hafen[0]-nb2.Hafen[0]&&nc.Q[0]===nb2.Q[0]&&nc.Atoll[0]===nb2.Atoll[0]);
 await p3.keyboard.press('Control+z');
 console.log('Verschachtelte Bereiche: die Leiste des inneren liegt über der des äußeren',await p3.evaluate(()=>{const l=[...document.querySelectorAll('.area .abar')].find(b=>b.textContent==='Hafen'),r=l.getBoundingClientRect(),e=document.elementFromPoint(r.left+10,r.top+10);return e===l}));
 /* Handy */
 const pm=await open(NEST(),{width:390,height:800});await pm.locator('.area .abar',{hasText:'Atoll'}).click();
 console.log('Handybreite: Eigenschaften des Bereichs, kein waagerechtes Scrollen',await pm.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1&&!!document.querySelector('#f-color')));
 if(process.env.SHOT){await p3.click('#fit');await p3.screenshot({path:process.env.SHOT})}
 await b.close();srv.close();
})();
