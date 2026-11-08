// Planner: Versionen (automatisch alle 10 Minuten und bei starkem Schrumpfen, benannt, Aufbewahrung, Wiederherstellen) mit der echten Planner-Klasse
// und einer SQLite-Attrappe (node:sqlite) statt Cloudflare. Dazu die Oberfläche im Browser.
process.removeAllListeners('warning');process.on('warning',()=>{});
const {chromium}=require('playwright');const http=require('http'),fs=require('fs'),path=require('path'),{pathToFileURL}=require('url');
(async()=>{
 const {DatabaseSync}=require('node:sqlite');
 const {Planner}=await import(pathToFileURL(path.join(__dirname,'..','..','..','worker','planner.js')).href);
 const mkP=(withSql=true)=>{const mem=new Map(),db=new DatabaseSync(':memory:');
  const sql={exec(q,...a){const st=db.prepare(q);if(/^\s*(SELECT|PRAGMA)/i.test(q))return {toArray:()=>st.all(...a).map(r=>({...r}))};st.run(...a);return {toArray:()=>[]}}};
  const storage={get:async k=>mem.get(k),put:async o=>{for(const k in o)mem.set(k,o[k])}};if(withSql)storage.sql=sql;
  const P=new Planner({storage});let t=1e12;P.now=()=>t;P.adv=ms=>{t+=ms};return P};
 const docN=n=>{const nodes={};for(let i=0;i<n;i++)nodes['n'+i]={id:'n'+i,type:'scene',title:'S'+i,text:'',x:i*10,y:0};return {v:1,root:'g0',title:'T',graphs:{g0:{id:'g0',name:'Spiel',parent:null,nodes,edges:[]}}}};
 const call=async(P,m,u,body)=>{const r=await P.fetch(new Request('http://x'+u,{method:m,body:body==null?undefined:(typeof body==='string'?body:JSON.stringify(body))}));let j=null;try{j=await r.json()}catch(e){}return {s:r.status,j}};
 const put=async(P,n,rev)=>call(P,'PUT','/api/planner',{rev,doc:docN(n)});
 const vers=async P=>(await call(P,'GET','/api/planner/versions')).j.versions;
 /* Automatik */
 let P=mkP();
 console.log('Erstes Speichern legt keine Version an',(await put(P,6,0)).s===200&&(await vers(P)).length===0);
 P.adv(60000);await put(P,7,1);console.log('Zweites Speichern nach 1 Minute: keine Version',(await vers(P)).length===0);
 P.adv(11*60000);await put(P,8,2);let v=await vers(P);
 console.log('Nach 11 Minuten: Version mit dem Stand davor (7 Knoten)',v.length===1&&v[0].nodes===7&&v[0].keep===0&&v[0].label==='Automatisch');
 P.adv(11*60000);await put(P,8,3);v=await vers(P);console.log('Neue Version nach weiteren 11 Minuten (8 Knoten)',v.length===2&&v[0].nodes===8);
 P.adv(11*60000);await put(P,8,4);console.log('Unveränderter Stand wird nicht doppelt gesichert',(await vers(P)).length===2);
 P.adv(1000);await put(P,2,5);v=await vers(P);
 console.log('Starkes Schrumpfen sichert sofort den alten Stand',v.length===3&&v[0].nodes===8&&/Schrumpfen/.test(v[0].label));
 P=mkP();await put(P,4,0);await put(P,1,1);console.log('Kleine Pläne lösen kein Schrumpf-Backup aus',(await vers(P)).length===0);
 P=mkP();await put(P,10,0);await put(P,8,1);console.log('Leichtes Schrumpfen (20 %) löst nichts aus',(await vers(P)).length===0);
 /* Manuell */
 P=mkP();console.log('Version ohne Dokument ergibt 400',(await call(P,'POST','/api/planner/versions',{label:'x'})).s===400);
 await put(P,3,0);
 const pm=await call(P,'POST','/api/planner/versions',{label:'<b>Basis</b>'+'y'.repeat(100)});
 v=await vers(P);console.log('Benannte Version angelegt, Name gekürzt',pm.s===200&&v.length===1&&v[0].keep===1&&v[0].label.length===60);
 const gv=await call(P,'GET','/api/planner/versions/'+pm.j.id);console.log('Version lesen liefert Dokument',gv.s===200&&gv.j.doc.graphs.g0.nodes.n2.title==='S2'&&gv.j.nodes===3);
 console.log('Unbekannte Version ergibt 404',(await call(P,'GET','/api/planner/versions/999')).s===404&&(await call(P,'GET','/api/planner/versions/abc')).s===404);
 console.log('Version löschen',(await call(P,'DELETE','/api/planner/versions/'+pm.j.id)).s===200&&(await vers(P)).length===0&&(await call(P,'DELETE','/api/planner/versions/'+pm.j.id)).s===404);
 console.log('Falsche Methode ergibt 405',(await call(P,'PUT','/api/planner/versions',{})).s===405);
 /* Aufbewahrung */
 P=mkP();await put(P,5,0);for(let i=0;i<3;i++)await call(P,'POST','/api/planner/versions',{label:'Fest '+i});
 for(let i=1;i<=60;i++){P.adv(11*60000);await put(P,5+(i%2),i)}
 v=await vers(P);console.log('Automatische auf 50 gekürzt, benannte bleiben',v.filter(x=>!x.keep).length===50&&v.filter(x=>x.keep).length===3);
 P=mkP();await put(P,2,0);let ok=true;for(let i=0;i<100;i++)ok=ok&&(await call(P,'POST','/api/planner/versions',{label:'k'+i})).s===200;
 console.log('100 benannte erlaubt, die 101. abgelehnt',ok&&(await call(P,'POST','/api/planner/versions',{label:'zuviel'})).s===409);
 console.log('Ohne SQL: Versionen 501, Speichern geht weiter',(await call(mkP(false),'GET','/api/planner/versions')).s===501&&(await put(mkP(false),3,0)).s===200);
 /* Oberfläche */
 P=mkP();
 const html=fs.readFileSync(path.join(__dirname,'..','dist','planner.html'));
 const srv=http.createServer(async(rq,s)=>{const u=rq.url.split('?')[0];
  if(u==='/planner'){s.writeHead(200,{'content-type':'text/html; charset=utf-8'});s.end(html);return}
  if(u.startsWith('/api/planner')){const ch=[];for await(const x of rq)ch.push(x);const body=Buffer.concat(ch).toString();const r=await P.fetch(new Request('http://x'+rq.url,{method:rq.method,body:['PUT','POST'].includes(rq.method)?body:undefined}));s.writeHead(r.status,{'content-type':'application/json'});s.end(await r.text());return}
  s.writeHead(404);s.end()});
 await new Promise(r=>srv.listen(8935,r));
 const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:1200,height:760}});const p=await ctx.newPage();
 p.on('pageerror',e=>console.log('ERR Seite',e.message));p.on('dialog',dl=>dl.accept());
 const nodes=()=>p.evaluate(()=>Object.values(__planner.doc().graphs[__planner.gid()].nodes).map(n=>n.title));
 const saved=()=>p.waitForFunction("document.querySelector('#status').textContent==='Gespeichert'",null,{timeout:8000});
 await p.goto('http://localhost:8935/planner');await p.waitForFunction('window.__planner');
 await p.click('#add-scene');await p.fill('#f-title','Eins');await p.click('#add-scene');await p.fill('#f-title','Zwei');await p.click('#add-scene');await p.fill('#f-title','Drei');
 await p.click('#versions');await p.waitForSelector('#vdlg[open]');await p.waitForSelector('#v-list p');
 console.log('Dialog öffnet, noch keine Versionen',await p.evaluate(()=>/Noch keine/.test(document.querySelector('#v-list').textContent)));
 await p.fill('#v-name','Basis');await p.click('#v-save');await p.waitForSelector('.vr');
 console.log('Benannte Version erscheint mit Zähler',await p.evaluate(()=>{const r=document.querySelector('.vr');return /Basis/.test(r.textContent)&&/3 Knoten/.test(r.textContent)&&!!r.querySelector('.keep')}));
 console.log('Server hat den Stand gesichert',(await vers(P)).length===1&&(await vers(P))[0].nodes===3);
 await p.click('#v-close');
 /* Kaputt machen */
 for(const t of ['Eins','Zwei']){const id=await p.evaluate(t=>Object.values(__planner.doc().graphs.g0.nodes).find(n=>n.title===t).id,t);const bb=await p.locator(`.node[data-id="${id}"]`).boundingBox();await p.mouse.click(bb.x+60,bb.y+12);await p.keyboard.press('Delete')}
 console.log('Zwei Knoten gelöscht',JSON.stringify(await nodes())==='["Drei"]');
 await saved();
 await p.click('#versions');await p.waitForSelector('.vr');
 console.log('Liste zeigt Unterschied zu jetzt',await p.evaluate(()=>/\+2 gegenüber jetzt/.test(document.querySelector('.vr').textContent)));
 /* Entf im Dialog darf nichts löschen */
 await p.focus('#v-close');await p.keyboard.press('Delete');console.log('Entf im Dialog löscht nichts',JSON.stringify(await nodes())==='["Drei"]');
 await p.click('[data-restore]');await p.waitForFunction("!document.querySelector('#vdlg').open",null,{timeout:8000});
 console.log('Wiederherstellen bringt alle drei Knoten zurück',JSON.stringify((await nodes()).sort())==='["Drei","Eins","Zwei"]');
 await saved();
 const sv=await call(P,'GET','/api/planner');console.log('Server hat den wiederhergestellten Stand',Object.keys(sv.j.doc.graphs.g0.nodes).length===3);
 v=await vers(P);console.log('Stand davor wurde gesichert („Vor Wiederherstellung“, 1 Knoten)',v.some(x=>/Vor Wiederherstellung/.test(x.label)&&x.nodes===1&&x.keep===1));
 await p.keyboard.press('Control+z');console.log('Wiederherstellen ist per Strg+Z rückgängig zu machen',JSON.stringify(await nodes())==='["Drei"]');
 await p.click('#versions');await p.waitForSelector('.vr');const n0=await p.evaluate(()=>document.querySelectorAll('.vr').length);
 await p.click('[data-del]');await p.waitForFunction(n=>document.querySelectorAll('.vr').length<n||/Noch keine/.test(document.querySelector('#v-list').textContent),n0,{timeout:5000});
 console.log('Löschen einer Version entfernt sie aus der Liste',(await vers(P)).length===n0-1);
 await p.keyboard.press('Escape');
 /* Handy */
 const m=await b.newContext({viewport:{width:390,height:800},hasTouch:true});const q=await m.newPage();q.on('pageerror',e=>console.log('ERR Seite',e.message));
 await q.goto('http://localhost:8935/planner');await q.waitForFunction('window.__planner');await q.click('#versions');await q.waitForSelector('#vdlg[open]');
 console.log('Handybreite: Dialog passt, kein waagerechtes Scrollen',await q.evaluate(()=>{const r=document.querySelector('#vdlg').getBoundingClientRect();return r.left>=0&&r.right<=window.innerWidth&&document.documentElement.scrollWidth<=window.innerWidth+1}));
 if(process.env.SHOT)await p.screenshot({path:process.env.SHOT});
 await b.close();srv.close();
})();
