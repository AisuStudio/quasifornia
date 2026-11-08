// Planner: mehrere Dokumente (Hauptplan und Entwürfe) mit eigenem Stand, eigener rev und eigenen Versionen. Echte Planner-Klasse mit SQLite-Attrappe (node:sqlite), dazu die Oberfläche im Browser.
process.removeAllListeners('warning');process.on('warning',()=>{});
const {chromium}=require('playwright');const http=require('http'),fs=require('fs'),path=require('path'),{pathToFileURL}=require('url');
(async()=>{
 const {DatabaseSync}=require('node:sqlite');
 const {Planner}=await import(pathToFileURL(path.join(__dirname,'..','..','..','worker','planner.js')).href);
 const mkP=()=>{const mem=new Map(),db=new DatabaseSync(':memory:');
  const sql={exec(q,...a){const st=db.prepare(q);if(/^\s*(SELECT|PRAGMA)/i.test(q))return {toArray:()=>st.all(...a).map(r=>({...r}))};st.run(...a);return {toArray:()=>[]}}};
  const P=new Planner({storage:{sql,get:async k=>mem.get(k),put:async o=>{for(const k in o)mem.set(k,o[k])},delete:async ks=>{for(const k of ks)mem.delete(k)}}});let t=1e12;P.now=()=>t;P.adv=ms=>{t+=ms};return P};
 const docN=n=>{const nodes={};for(let i=0;i<n;i++)nodes['n'+i]={id:'n'+i,type:'scene',title:'S'+i,text:'',x:i*10,y:0};return {v:1,root:'g0',title:'T',graphs:{g0:{id:'g0',name:'Spiel',parent:null,nodes,edges:[]}}}};
 const call=async(P,m,u,body)=>{const r=await P.fetch(new Request('http://x'+u,{method:m,body:body==null?undefined:JSON.stringify(body)}));let j=null;try{j=await r.json()}catch(e){}return {s:r.status,j}};
 const nn=d=>Object.keys(d.graphs.g0.nodes).length;
 let P=mkP();
 const l0=await call(P,'GET','/api/planner/docs');
 console.log('Anfangs nur der Hauptplan',l0.s===200&&l0.j.docs.length===1&&l0.j.docs[0].id==='main'&&l0.j.docs[0].name==='Hauptplan');
 console.log('Hauptplan ohne Parameter wie bisher',(await call(P,'PUT','/api/planner',{rev:0,doc:docN(3)})).s===200&&nn((await call(P,'GET','/api/planner')).j.doc)===3);
 /* leerer Entwurf */
 const c1=await call(P,'POST','/api/planner/docs',{name:'Antons Entwurf'});const id=c1.j.id;
 console.log('Entwurf angelegt, Name und Id',c1.s===200&&/^[a-z0-9]{3,16}$/.test(id));
 const g1=await call(P,'GET','/api/planner?d='+id);console.log('Entwurf ist leer mit rev 0',g1.s===200&&g1.j.rev===0&&nn(g1.j.doc)===0);
 console.log('Entwurf speichern mit eigener rev, Hauptplan unberührt',(await call(P,'PUT','/api/planner?d='+id,{rev:0,doc:docN(5)})).s===200&&nn((await call(P,'GET','/api/planner')).j.doc)===3&&(await call(P,'GET','/api/planner')).j.rev===1);
 console.log('Hauptplan speichern stört den Entwurf nicht',(await call(P,'PUT','/api/planner',{rev:1,doc:docN(4)})).s===200&&nn((await call(P,'GET','/api/planner?d='+id)).j.doc)===5);
 console.log('Veraltete rev im Entwurf ergibt 409',(await call(P,'PUT','/api/planner?d='+id,{rev:0,doc:docN(5)})).s===409);
 const l1=await call(P,'GET','/api/planner/docs');console.log('Liste zeigt beide mit Knotenzahl',l1.j.docs.length===2&&l1.j.docs.find(d=>d.id==='main').nodes===4&&l1.j.docs.find(d=>d.id===id).nodes===5);
 /* Kopie und Version */
 const c2=await call(P,'POST','/api/planner/docs',{name:'Kopie',from:'copy',d:'main'});
 console.log('Kopie des Hauptplans hat dessen Knoten',nn((await call(P,'GET','/api/planner?d='+c2.j.id)).j.doc)===4);
 await call(P,'PUT','/api/planner?d='+c2.j.id,{rev:0,doc:docN(9)});console.log('Änderung an der Kopie lässt den Hauptplan in Ruhe',nn((await call(P,'GET','/api/planner')).j.doc)===4);
 const vm=await call(P,'POST','/api/planner/versions',{label:'Basis'});
 const c3=await call(P,'POST','/api/planner/docs',{name:'Aus Version',from:'version',version:vm.j.id});
 console.log('Entwurf aus Version enthält deren Stand',c3.s===200&&nn((await call(P,'GET','/api/planner?d='+c3.j.id)).j.doc)===4);
 console.log('Entwurf aus unbekannter Version ergibt 404',(await call(P,'POST','/api/planner/docs',{name:'x',from:'version',version:999})).s===404);
 console.log('Kopie von unbekanntem Dokument ergibt 404',(await call(P,'POST','/api/planner/docs',{name:'x',from:'copy',d:'zzzzzz'})).s===404);
 console.log('Name fehlt ergibt 400',(await call(P,'POST','/api/planner/docs',{name:'  '})).s===400);
 /* Versionen getrennt */
 const vd=await call(P,'POST','/api/planner/versions?d='+id,{label:'Nur Entwurf'});
 const vlm=(await call(P,'GET','/api/planner/versions')).j.versions,vld=(await call(P,'GET','/api/planner/versions?d='+id)).j.versions;
 console.log('Versionen sind je Dokument getrennt',vlm.length===1&&vlm[0].label==='Basis'&&vld.length===1&&vld[0].label==='Nur Entwurf');
 console.log('Version eines anderen Dokuments nicht lesbar',(await call(P,'GET','/api/planner/versions/'+vm.j.id+'?d='+id)).s===404&&(await call(P,'DELETE','/api/planner/versions/'+vm.j.id+'?d='+id)).s===404);
 /* Automatik je Dokument */
 P=mkP();await call(P,'PUT','/api/planner',{rev:0,doc:docN(10)});const d2=(await call(P,'POST','/api/planner/docs',{name:'E',from:'copy'})).j.id;
 await call(P,'PUT','/api/planner?d='+d2,{rev:0,doc:docN(10)});await call(P,'PUT','/api/planner?d='+d2,{rev:1,doc:docN(2)});
 console.log('Schrumpf-Sicherung nur im betroffenen Dokument',(await call(P,'GET','/api/planner/versions?d='+d2)).j.versions.length===1&&(await call(P,'GET','/api/planner/versions')).j.versions.length===0);
 /* Ungültige Ids */
 console.log('Unbekanntes Dokument ergibt 404',(await call(P,'GET','/api/planner?d=nichtda')).s===404&&(await call(P,'PUT','/api/planner?d=nichtda',{rev:0,doc:docN(1)})).s===404);
 console.log('Ungültige Id wird abgelehnt',(await call(P,'GET','/api/planner?d=..%2Fx')).s===404&&(await call(P,'GET','/api/planner?d=MAIN')).s===404);
 /* Umbenennen, Löschen */
 console.log('Umbenennen',(await call(P,'PUT','/api/planner/docs/'+d2,{name:'Neu'})).s===200&&(await call(P,'GET','/api/planner/docs')).j.docs.find(d=>d.id===d2).name==='Neu'&&(await call(P,'PUT','/api/planner/docs/'+d2,{name:''})).s===400);
 console.log('Hauptplan nicht löschbar',(await call(P,'DELETE','/api/planner/docs/main')).s===400);
 console.log('Löschen entfernt Dokument und Versionen',(await call(P,'DELETE','/api/planner/docs/'+d2)).s===200&&(await call(P,'GET','/api/planner?d='+d2)).s===404&&(await call(P,'GET','/api/planner/docs')).j.docs.length===1&&(await call(P,'DELETE','/api/planner/docs/'+d2)).s===404);
 /* Obergrenze */
 P=mkP();let ok=true;for(let i=0;i<19;i++)ok=ok&&(await call(P,'POST','/api/planner/docs',{name:'E'+i})).s===200;
 console.log('Bis 20 Dokumente, das 21. wird abgelehnt',ok&&(await call(P,'POST','/api/planner/docs',{name:'zuviel'})).s===409);
 /* Oberfläche */
 P=mkP();
 const html=fs.readFileSync(path.join(__dirname,'..','dist','planner.html'));
 const srv=http.createServer(async(rq,s)=>{const u=rq.url.split('?')[0];
  if(u==='/planner'){s.writeHead(200,{'content-type':'text/html; charset=utf-8'});s.end(html);return}
  if(u.startsWith('/api/planner')){const ch=[];for await(const x of rq)ch.push(x);const body=Buffer.concat(ch).toString();const r=await P.fetch(new Request('http://x'+rq.url,{method:rq.method,body:['PUT','POST'].includes(rq.method)?body:undefined}));s.writeHead(r.status,{'content-type':'application/json'});s.end(await r.text());return}
  s.writeHead(404);s.end()});
 await new Promise(r=>srv.listen(8937,r));
 const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:1200,height:760}});const p=await ctx.newPage();
 let promptText=null;p.on('pageerror',e=>console.log('ERR Seite',e.message));p.on('dialog',dl=>dl.type()==='prompt'?dl.accept(promptText==null?dl.defaultValue():promptText):dl.accept());
 const saved=()=>p.waitForFunction("document.querySelector('#status').textContent==='Gespeichert'",null,{timeout:8000});
 const titles=()=>p.evaluate(()=>Object.values(__planner.doc().graphs[__planner.gid()].nodes).map(n=>n.title).sort().join('|'));
 await p.goto('http://localhost:8937/planner');await p.waitForFunction('window.__planner');
 console.log('Kopfzeile zeigt Hauptplan, ohne Entwurf-Farbe',await p.evaluate(()=>{const b=document.querySelector('#docs');return b.textContent==='Hauptplan ▾'&&!b.classList.contains('draft')&&document.title==='Planner · Hauptplan'}));
 await p.click('#add-scene');await p.fill('#f-title','Eins');await p.click('#add-scene');await p.fill('#f-title','Zwei');await saved();
 /* Entwurf als Kopie anlegen */
 await p.click('#docs');await p.waitForSelector('#d-list .vr');
 console.log('Liste zeigt Hauptplan als aktuell',await p.evaluate(()=>{const r=document.querySelector('#d-list .vr');return /Hauptplan/.test(r.textContent)&&/aktuell/.test(r.textContent)&&r.querySelector('[data-open]').disabled&&!r.querySelector('[data-ddel]')}));
 await p.fill('#d-name','Antons Entwurf');await p.selectOption('#d-from','copy');await p.click('#d-new');
 await p.waitForFunction("location.search.startsWith('?d=')",null,{timeout:8000});await p.waitForFunction('window.__planner');
 const did=await p.evaluate(()=>__planner.did);
 console.log('Entwurf geöffnet mit Kopie des Inhalts',await titles()==='Eins|Zwei');
 await p.waitForFunction("document.querySelector('#docs').textContent.startsWith('Entwurf: Antons Entwurf')");
 console.log('Kopfzeile zeigt Entwurf in Farbe, Tab-Titel folgt',await p.evaluate(()=>document.querySelector('#docs').classList.contains('draft')&&document.title==='Planner · Antons Entwurf'));
 await p.click('#add-scene');await p.fill('#f-title','Antons Idee');await saved();
 const main=await call(P,'GET','/api/planner');console.log('Hauptplan blieb bei zwei Knoten',nn(main.j.doc)===2);
 await p.reload();await p.waitForFunction('window.__planner');console.log('Nach Neuladen: Entwurf mit drei Knoten',await titles()==='Antons Idee|Eins|Zwei');
 /* Versionen des Entwurfs sind getrennt, Als Entwurf */
 await p.click('#versions');await p.waitForSelector('#vdlg[open]');await p.waitForSelector('#v-list p');await p.fill('#v-name','Stand Anton');await p.click('#v-save');await p.waitForSelector('.vr');
 console.log('Entwurf hat eigene Version, Hauptplan keine',(await call(P,'GET','/api/planner/versions?d='+did)).j.versions.length===1&&(await call(P,'GET','/api/planner/versions')).j.versions.length===0);
 promptText='Von Version';await p.click('[data-draft]');await p.waitForFunction(d=>location.search!=='?d='+d&&location.search.startsWith('?d='),did,{timeout:8000});await p.waitForFunction('window.__planner');
 console.log('Als Entwurf öffnet neues Dokument mit dem Stand der Version',await titles()==='Antons Idee|Eins|Zwei'&&(await p.evaluate(()=>__planner.did))!==did);
 promptText=null;
 /* Leerer Entwurf */
 await p.click('#docs');await p.waitForSelector('#d-list .vr');await p.fill('#d-name','Leer');await p.selectOption('#d-from','blank');await p.click('#d-new');
 await p.waitForFunction("document.querySelector('#docs').textContent.startsWith('Entwurf: Leer')",null,{timeout:8000});
 console.log('Leerer Entwurf zeigt Hinweis',await p.evaluate(()=>!document.querySelector('.node')&&!document.querySelector('#hint').hidden));
 /* Zurück zum Hauptplan über die Liste, Umbenennen */
 await p.click('#docs');await p.waitForSelector('#d-list .vr');
 promptText='Antons Zweiter';await p.click(`[data-rename="${(await call(P,'GET','/api/planner/docs')).j.docs.find(d=>d.name==='Von Version').id}"]`);promptText=null;
 await p.waitForFunction("[...document.querySelectorAll('#d-list .vr strong')].some(e=>e.textContent.startsWith('Antons Zweiter'))",null,{timeout:5000});
 console.log('Umbenennen in der Liste',(await call(P,'GET','/api/planner/docs')).j.docs.some(d=>d.name==='Antons Zweiter'));
 await p.click('[data-open="main"]');await p.waitForFunction("location.search===''&&window.__planner&&__planner.did==='main'",null,{timeout:8000});
 console.log('Hauptplan wieder offen mit zwei Knoten',await titles()==='Eins|Zwei');
 /* Löschen des aktuellen Entwurfs führt zum Hauptplan */
 await p.goto('http://localhost:8937/planner?d='+did);await p.waitForFunction('window.__planner');await p.click('#docs');await p.waitForSelector('#d-list .vr');
 const nBefore=await p.evaluate(()=>document.querySelectorAll('#d-list .vr').length);
 await p.click(`[data-ddel="${did}"]`);await p.waitForFunction("location.search===''",null,{timeout:8000});await p.waitForFunction('window.__planner');
 console.log('Aktuellen Entwurf gelöscht: zurück auf dem Hauptplan, Entwurf weg',(await call(P,'GET','/api/planner?d='+did)).s===404&&(await call(P,'GET','/api/planner/docs')).j.docs.length===nBefore-1);
 /* Unbekanntes Dokument */
 await p.goto('http://localhost:8937/planner?d=nichtda');await p.waitForFunction("document.querySelector('#warn').classList.contains('on')");
 console.log('Unbekanntes Dokument: Warnung, nichts wird gespeichert',await p.evaluate(()=>/gibt es nicht/.test(document.querySelector('#warntxt').textContent)&&document.querySelector('#status').textContent==='Nicht gefunden'));
 /* Handy */
 const m=await b.newContext({viewport:{width:390,height:800},hasTouch:true});const q=await m.newPage();q.on('pageerror',e=>console.log('ERR Seite',e.message));
 await q.goto('http://localhost:8937/planner');await q.waitForFunction('window.__planner');await q.click('#docs');await q.waitForSelector('#d-list .vr');
 console.log('Handybreite: Dialog passt, kein waagerechtes Scrollen',await q.evaluate(()=>{const r=document.querySelector('#ddlg').getBoundingClientRect();return r.left>=0&&r.right<=window.innerWidth&&document.documentElement.scrollWidth<=window.innerWidth+1}));
 if(process.env.SHOT)await q.screenshot({path:process.env.SHOT});
 await b.close();srv.close();
})();
