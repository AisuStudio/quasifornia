// Planner: Rolle im Ablauf (Start grün, Ende rot, als Radio-Auswahl), Prüfung des Ablaufs (kein Start, nicht erreichbar, Sackgasse), Markdown-Abschnitt „Ablauf“, Knopf „Ebene hoch“.
// Echte Planner-Klasse mit SQLite-Attrappe (node:sqlite), dazu die Oberfläche im Browser. Der Prüf-Code steht in Server und Seite wortgleich; hier wird verglichen.
process.removeAllListeners('warning');process.on('warning',()=>{});
const {chromium}=require('playwright');const http=require('http'),fs=require('fs'),os=require('os'),path=require('path'),{pathToFileURL}=require('url');
(async()=>{
 const {DatabaseSync}=require('node:sqlite');
 const W=await import(pathToFileURL(path.join(__dirname,'..','..','..','worker','planner.js')).href);
 const {Planner,toMarkdown,cleanDoc,checkDoc,checkGraph,heldenreiseDoc}=W;
 const N=(id,type,title,x,y,extra={})=>({id,type,title,text:'',x,y,mandatory:false,...extra});
 const doc1=(nodes,edges=[])=>({v:1,root:'g0',title:'',graphs:{g0:{id:'g0',name:'Spiel',parent:null,nodes,edges}}});
 const E=(id,from,to,label='')=>({id,from,to,label});
 const kinds=d=>checkDoc(d)[0].warnings.map(w=>w.kind+(w.id?':'+w.id:'')).join(',');
 /* Dokument-Prüfung */
 const rd=(t,extra)=>cleanDoc(doc1({a:N('a',t,'A',0,0,extra)})).graphs.g0.nodes.a.role;
 console.log('Rolle bleibt bei Szene, Verzweigung, Kapitel',rd('scene',{role:'start'})==='start'&&rd('branch',{role:'end'})==='end'&&rd('chapter',{role:'start'})==='start');
 console.log('Rolle bleibt bei freier Notiz und Ereignis',rd('note',{role:'start'})==='start'&&rd('note',{kind:'event',role:'end'})==='end');
 console.log('Rolle entfällt bei Charakter, Gegenstand, Todo',['character','item','todo'].every(k=>rd('note',{kind:k,role:'start'})===undefined));
 console.log('Unbekannte Rolle fällt weg',rd('scene',{role:'mitte'})===undefined&&rd('scene',{role:true})===undefined);
 console.log('Prüfen bleibt wiederholbar mit Rolle',(()=>{const c=cleanDoc(doc1({a:N('a','scene','A',0,0,{role:'start'}),b:N('b','scene','B',0,0,{role:'end'})},[E('e','a','b')]));return JSON.stringify(cleanDoc(c))===JSON.stringify(c)})());
 /* Ablauf-Prüfung */
 const chain=doc1({a:N('a','scene','Start',0,0,{role:'start'}),b:N('b','branch','Weiche',200,0),c:N('c','scene','Ende',400,0,{role:'end'})},[E('1','a','b'),E('2','b','c')]);
 console.log('Sauberer Ablauf (Start, Weiche, Ende): keine Hinweise',kinds(chain)==='');
 console.log('Ohne Start: „Kein Start“ und die Sackgasse',kinds(doc1({a:N('a','scene','A',0,0),b:N('b','scene','B',200,0,{role:'end'})},[E('1','a','b')]))==='nostart');
 console.log('Ohne Ende: „Kein Ende“, letzter Knoten ist Sackgasse',kinds(doc1({a:N('a','scene','A',0,0,{role:'start'}),b:N('b','scene','B',200,0)},[E('1','a','b')]))==='noend,deadend:b');
 console.log('Verwaister Knoten ist nicht erreichbar und eine Sackgasse',kinds(doc1({a:N('a','scene','A',0,0,{role:'start'}),b:N('b','scene','B',200,0,{role:'end'}),x:N('x','scene','X',0,200)},[E('1','a','b')]))==='unreachable:x,deadend:x');
 console.log('Nicht erreichbares Ende wird gemeldet',kinds(doc1({a:N('a','scene','A',0,0,{role:'start'}),b:N('b','scene','B',200,0,{role:'end'}),z:N('z','scene','Z',0,200,{role:'end'})},[E('1','a','b')]))==='unreachable:z');
 console.log('Mehrere Starts und Enden sind in Ordnung',kinds(doc1({a:N('a','scene','A1',0,0,{role:'start'}),b:N('b','scene','A2',0,200,{role:'start'}),m:N('m','scene','Mitte',200,100),e1:N('e1','scene','E1',400,0,{role:'end'}),e2:N('e2','scene','E2',400,200,{role:'end'})},[E('1','a','m'),E('2','b','m'),E('3','m','e1'),E('4','m','e2')]))==='');
 console.log('Zyklus mit Ausgang hängt nicht und ist sauber',kinds(doc1({a:N('a','scene','A',0,0,{role:'start'}),b:N('b','scene','B',200,0),c:N('c','scene','C',400,0,{role:'end'})},[E('1','a','b'),E('2','b','a'),E('3','b','c')]))==='');
 console.log('Notizen mit Kategorie zählen nicht zum Ablauf',kinds(doc1({a:N('a','scene','A',0,0,{role:'start'}),b:N('b','scene','B',200,0,{role:'end'}),c:N('c','note','Anton',0,200,{kind:'character'}),t:N('t','note','Todo',0,300,{kind:'todo'})},[E('1','a','b')]))==='');
 console.log('Notiz mit Verbindung gehört zum Ablauf',kinds(doc1({a:N('a','scene','A',0,0,{role:'start'}),n:N('n','note','Ereignis',200,0,{kind:'event'}),b:N('b','scene','B',400,0,{role:'end'})},[E('1','a','n'),E('2','n','b')]))==='');
 console.log('Leere Ebene ohne Knoten: keine Prüfung',checkGraph({nodes:{},edges:[]})===null&&checkDoc(doc1({})).length===0);
 console.log('Kapitel ohne Ausgang ist eine Sackgasse',kinds(doc1({a:N('a','scene','A',0,0,{role:'start'}),c:N('c','chapter','Akt',200,0)},[E('1','a','c')]))==='noend,deadend:c');
 const multi={v:1,root:'g0',title:'',graphs:{g0:{id:'g0',name:'Spiel',parent:null,nodes:{a:N('a','scene','A',0,0,{role:'start'}),c:N('c','chapter','Akt 1',200,0,{graph:'g1',role:'end'})},edges:[E('1','a','c')]},g1:{id:'g1',name:'Akt 1',parent:'g0',nodes:{s:N('s','scene','Szene',0,0)},edges:[]}}};
 const cm=checkDoc(multi);console.log('Je Ebene geprüft, Pfad im Namen',cm.length===2&&cm[1].path==='Spiel › Akt 1'&&cm[1].warnings.map(w=>w.kind).join(',')==='nostart,noend,deadend');
 console.log('Heldenreise-Vorlage: Narr ist Start, Welt ist Ende, keine Hinweise',(()=>{const h=heldenreiseDoc('R');return h.graphs.g0.nodes.c0.role==='start'&&h.graphs.g0.nodes.c21.role==='end'&&checkDoc(h)[0].warnings.length===0})());
 /* Markdown */
 const md=toMarkdown(doc1({a:N('a','scene','Strand',500,0,{role:'start',mandatory:true}),z:N('z','scene','Waise',0,0),b:N('b','scene','Höhle',700,0,{role:'end'})},[E('1','a','b')]),{});
 console.log('Knotenzeilen tragen [START] und [ENDE] vor [PFLICHT]',md.includes('**[START] [PFLICHT] Szene: Strand** `a`')&&md.includes('**[ENDE] Szene: Höhle** `b`'));
 console.log('Lesereihenfolge: der Start steht zuerst, obwohl er weiter rechts liegt',md.indexOf('Szene: Strand')<md.indexOf('Szene: Waise'));
 console.log('Abschnitt „Ablauf“ nennt Start, Enden und Hinweise',/## Ablauf \(Start, Enden, Lücken\)/.test(md)&&/\*\*Spiel\*\*: Start: „Strand“ `a` · Enden: „Höhle“ `b`/.test(md)&&/⚠ Vom Start nicht erreichbar: „Waise“ `z`/.test(md)&&/⚠ Sackgasse \(kein Ausgang, kein Ende\): „Waise“ `z`/.test(md));
 console.log('Lesehilfe erklärt Start, Ende und Hinweise',/`\[START\]` und `\[ENDE\]`/.test(md)&&/keine Fehler/.test(md));
 console.log('Sauberer Plan: „Keine Lücken gefunden“',/Keine Lücken gefunden/.test(toMarkdown(chain,{})));
 console.log('Ohne Ablaufknoten kein Abschnitt',!/Ablauf \(Start/.test(toMarkdown(doc1({n:N('n','note','Idee',0,0)}),{})));
 console.log('Ebene ohne Start im Markdown mit Pfad',/\*\*Spiel › Akt 1\*\*: Start: — · Enden: —/.test(toMarkdown(multi,{}))&&/⚠ Kein Start markiert/.test(toMarkdown(multi,{})));
 /* Oberfläche */
 const mem=new Map(),db=new DatabaseSync(':memory:');
 const sql={exec(q,...a){const st=db.prepare(q);if(/^\s*(SELECT|PRAGMA)/i.test(q))return {toArray:()=>st.all(...a).map(r=>({...r}))};st.run(...a);return {toArray:()=>[]}}};
 const R=new Planner({storage:{sql,get:async k=>mem.get(k),put:async o=>{for(const k in o)mem.set(k,o[k])},delete:async k=>{for(const x of [].concat(k))mem.delete(x)}}});
 const html=fs.readFileSync(path.join(__dirname,'..','dist','planner.html'));
 const srv=http.createServer(async(rq,s)=>{const u=rq.url.split('?')[0];
  if(u==='/planner'){s.writeHead(200,{'content-type':'text/html; charset=utf-8'});s.end(html);return}
  if(u.startsWith('/api/planner')){const ch=[];for await(const x of rq)ch.push(x);const body=Buffer.concat(ch).toString();const r=await R.fetch(new Request('http://x'+rq.url,{method:rq.method,body:['PUT','POST'].includes(rq.method)?body:undefined}));s.writeHead(r.status,{'content-type':r.headers.get('content-type')||'application/json'});s.end(await r.text());return}
  s.writeHead(404);s.end()});
 await new Promise(r=>srv.listen(8943,r));
 const B='http://localhost:8943',b=await chromium.launch();
 const mkDoc=async name=>(await (await fetch(B+'/api/planner/docs',{method:'POST',body:JSON.stringify({name})})).json()).id;
 const open=async(id,vp={width:1300,height:800})=>{const ctx=await b.newContext({viewport:vp});const p=await ctx.newPage();p.on('pageerror',e=>console.log('ERR Seite',e.message));p.on('dialog',dl=>dl.accept());await p.goto(B+'/planner?d='+id);await p.waitForFunction('window.__planner');return p};
 const importDoc=async(p,d)=>{const f=path.join(os.tmpdir(),'planner-71-'+Math.random().toString(36).slice(2)+'.json');fs.writeFileSync(f,JSON.stringify(d));await p.setInputFiles('#file',f);await p.waitForFunction(()=>Object.keys(__planner.doc().graphs.g0.nodes).length>0,null,{timeout:5000});fs.unlinkSync(f)};
 const node=(p,t)=>p.evaluate(t=>Object.values(__planner.doc().graphs[__planner.gid()].nodes).find(n=>n.title===t),t);
 const clickN=async(p,t)=>{const n=await node(p,t),bb=await p.locator(`.node[data-id="${n.id}"]`).boundingBox();await p.mouse.click(bb.x+60,bb.y+12);return n};
 const p=await open(await mkDoc('Test'));
 /* Parität Seite und Server */
 const sample=[chain,multi,doc1({a:N('a','scene','A',0,0),b:N('b','scene','B',200,0,{role:'end'})},[E('1','a','b')]),doc1({a:N('a','scene','A',0,0,{role:'start'}),n:N('n','note','Ereignis',200,0,{kind:'event'}),x:N('x','scene','X',0,200)},[E('1','a','n')]),heldenreiseDoc('R')];
 const clientRes=await p.evaluate(ds=>ds.map(d=>__planner.check(d)),sample);
 console.log('Prüf-Code der Seite liefert dasselbe wie der Server',JSON.stringify(clientRes)===JSON.stringify(sample.map(d=>checkDoc(d))));
 console.log('Der Prüf-Block steht wortgleich in Server und Seite',(()=>{const sv=fs.readFileSync(path.join(__dirname,'..','..','..','worker','planner.js'),'utf8'),pg=fs.readFileSync(path.join(__dirname,'..','dist','planner.html'),'utf8');const cut=(t,a,b)=>t.slice(t.indexOf(a),t.indexOf(b)).replace(/export function /g,'function ').replace(/\n   Dieser Block[^\n]*\n?/,'\n');const x=cut(sv,'function flowNodes','export function toMarkdown'),y=cut(pg,'function flowNodes','/* ---------- Prüfung und Ebenen-Navigation');return x.length>500&&x.trim()===y.trim()})());
 console.log('Hinweistexte stimmen überein (ohne Kennung)',await p.evaluate(()=>__planner.warnText({kind:'deadend',id:'x',title:'T'},false)==='Sackgasse (kein Ausgang, kein Ende): „T“'&&__planner.warnText({kind:'nostart'},false)==='Kein Start markiert'));
 /* Radio und Darstellung */
 console.log('Leeres Dokument: Prüfung ohne Hinweise',await p.evaluate(()=>{const b=document.querySelector('#check-btn');return b.textContent==='Prüfung'&&!b.classList.contains('warn')}));
 await p.click('#add-scene');await p.fill('#f-title','Strand');
 console.log('Szene: Radio „Rolle im Ablauf“ mit Normal, Start, Ende, Normal gewählt',await p.evaluate(()=>{const r=[...document.querySelectorAll('fieldset.roles input[name="f-role"]')];return r.length===3&&r.map(x=>x.value).join('|')==='|start|end'&&r[0].checked&&/Rolle im Ablauf/.test(document.querySelector('fieldset.roles legend').textContent)}));
 console.log('Einzelne Szene: drei Hinweise (kein Start, kein Ende, Sackgasse)',await p.evaluate(()=>document.querySelector('#check-btn').textContent==='Prüfung ⚠ 3'&&document.querySelector('#check-btn').classList.contains('warn')));
 await p.check('#f-role-start');
 console.log('Start: grüner Knoten mit Badge „Start“',await p.evaluate(()=>{const n=document.querySelector('.node.role-start');return !!n&&n.querySelector('.bd.role').textContent==='Start'&&getComputedStyle(n).borderTopColor!==getComputedStyle(document.querySelector('#stage')).borderTopColor&&Object.values(__planner.doc().graphs.g0.nodes)[0].role==='start'}));
 console.log('Start macht einen Hinweis weniger („Kein Start“ entfällt)',await p.evaluate(()=>document.querySelector('#check-btn').textContent==='Prüfung ⚠ 2'));
 await p.check('#f-role-end');
 console.log('Ende: roter Knoten, Badge „Ende“, Start-Markierung weg (Radio schließt sich aus)',await p.evaluate(()=>{const n=document.querySelector('.node.role-end');return !!n&&!document.querySelector('.node.role-start')&&n.querySelector('.bd.role').textContent==='Ende'}));
 await p.check('#f-role-normal');console.log('Normal: keine Markierung, Rolle entfernt',await p.evaluate(()=>!document.querySelector('.node.role-start,.node.role-end')&&Object.values(__planner.doc().graphs.g0.nodes)[0].role===undefined));
 await p.check('#f-role-start');await p.keyboard.press('Control+z');
 console.log('Strg+Z nimmt die Rolle zurück',await p.evaluate(()=>Object.values(__planner.doc().graphs.g0.nodes)[0].role===undefined));
 await clickN(p,'Strand');await p.check('#f-role-start');await p.check('#f-mand');
 console.log('Start und Pflicht zugleich: beide Badges',await p.evaluate(()=>{const n=document.querySelector('.node.role-start');return !!n.querySelector('.bd.role')&&[...n.querySelectorAll('.bd')].some(x=>x.textContent==='Pflicht')}));
 /* Notiz mit Kategorie */
 await p.click('#add-note');await p.fill('#f-title','Anton');
 console.log('Freie Notiz hat die Rolle-Auswahl',await p.evaluate(()=>!!document.querySelector('fieldset.roles')));
 await p.selectOption('#f-kind','event');console.log('Ereignis hat sie auch',await p.evaluate(()=>!!document.querySelector('fieldset.roles')));
 await p.check('#f-role-end');await p.selectOption('#f-kind','character');
 console.log('Kategorie Charakter: Auswahl verschwindet, Rolle wird entfernt',await p.evaluate(()=>{const n=Object.values(__planner.doc().graphs.g0.nodes).find(x=>x.title==='Anton');return !document.querySelector('fieldset.roles')&&n.role===undefined&&!document.querySelector('.node.k-character.role-end')}));
 for(const k of ['item','todo'])await p.selectOption('#f-kind',k);console.log('Auch bei Gegenstand und Todo keine Rolle-Auswahl',await p.evaluate(()=>!document.querySelector('fieldset.roles')));
 /* Prüfung: Dialog und Sprung */
 const dd=await mkDoc('Prüfung');const pd=await open(dd);
 await importDoc(pd,{v:1,root:'g0',title:'',graphs:{g0:{id:'g0',name:'Spiel',parent:null,nodes:{a:N('a','scene','Anfang',0,0,{role:'start'}),k:N('k','chapter','Akt 1',250,0,{graph:'g1'}),z:N('z','scene','Schluss',500,0,{role:'end'}),w:N('w','scene','Waise',0,300)},edges:[E('1','a','k'),E('2','k','z')]},g1:{id:'g1',name:'Akt 1',parent:'g0',nodes:{s:N('s','scene','Innen',0,0)},edges:[]}}});
 await pd.waitForFunction("document.querySelectorAll('.node').length===4");
 console.log('Prüfung zählt über alle Ebenen',await pd.evaluate(()=>document.querySelector('#check-btn').textContent==='Prüfung ⚠ 5'));
 await pd.click('#check-btn');await pd.waitForSelector('#kdlg[open]');
 console.log('Dialog gruppiert nach Ebene, diese Ebene zuerst',await pd.evaluate(()=>{const g=[...document.querySelectorAll('#k-list .kg h3')].map(h=>h.textContent);return g.length===2&&/Spiel \(diese Ebene\)/.test(g[0])&&/Spiel › Akt 1/.test(g[1])}));
 console.log('Dialog nennt Start und Enden und die Hinweise',await pd.evaluate(()=>{const t=document.querySelector('#k-list').textContent;return /Start: Anfang · Enden: Schluss/.test(t)&&/Vom Start nicht erreichbar: „Waise“/.test(t)&&/Sackgasse \(kein Ausgang, kein Ende\): „Waise“/.test(t)&&/Kein Start markiert/.test(t)&&/Kein Ende markiert/.test(t)}));
 await pd.click('.kw[data-kw="unreachable"]');await pd.waitForFunction("!document.querySelector('#kdlg').open");
 console.log('Klick auf einen Hinweis schließt den Dialog und wählt den Knoten',await pd.evaluate(()=>{const s=__planner.sel(),n=__planner.doc().graphs.g0.nodes[s&&s.id];return !!s&&n.title==='Waise'&&document.querySelector('#insp h2').textContent==='Knoten'}));
 await pd.click('#check-btn');await pd.waitForSelector('#kdlg[open]');await pd.click('.kg[data-kg="g1"] .kw[data-kw="nostart"]');await pd.waitForFunction("!document.querySelector('#kdlg').open");
 console.log('Klick auf einen Ebenen-Hinweis springt in die Ebene',await pd.evaluate(()=>__planner.gid()==='g1'));
 /* Ebene hoch */
 console.log('In der Ebene: Knopf „Ebene hoch“ sichtbar',await pd.evaluate(()=>!document.querySelector('#up').hidden));
 await pd.click('#up');console.log('Knopf bringt eine Ebene hoch, am Ende verborgen',await pd.evaluate(()=>__planner.gid()==='g0'&&document.querySelector('#up').hidden));
 await pd.dblclick('.node.chapter');await pd.waitForFunction("__planner.gid()==='g1'");await pd.click('#stage',{position:{x:900,y:600}});await pd.keyboard.press('Alt+ArrowUp');
 console.log('Alt+↑ geht eine Ebene hoch',await pd.evaluate(()=>__planner.gid()==='g0'));
 await pd.dblclick('.node.chapter');await pd.waitForFunction("__planner.gid()==='g1'");await pd.click('#stage',{position:{x:900,y:600}});await pd.keyboard.press('Backspace');
 console.log('Rücktaste ohne Auswahl geht eine Ebene hoch',await pd.evaluate(()=>__planner.gid()==='g0'));
 await clickN(pd,'Waise');await pd.keyboard.press('Backspace');
 console.log('Rücktaste mit Auswahl löscht den Knoten (und bleibt auf der Ebene)',await pd.evaluate(()=>__planner.gid()==='g0'&&!Object.values(__planner.doc().graphs.g0.nodes).some(n=>n.title==='Waise')));
 console.log('Nach dem Löschen der Waise: Hinweise sinken (5 → 3)',await pd.evaluate(()=>document.querySelector('#check-btn').textContent==='Prüfung ⚠ 3'));
 /* Alles gut: kein Zähler */
 const dg=await mkDoc('Sauber');const pg=await open(dg);
 await importDoc(pg,{v:1,root:'g0',title:'',graphs:{g0:{id:'g0',name:'Spiel',parent:null,nodes:{a:N('a','scene','A',0,0,{role:'start'}),b:N('b','scene','B',250,0,{role:'end'})},edges:[E('1','a','b')]}}});
 await pg.waitForFunction("document.querySelectorAll('.node').length===2");
 console.log('Sauberer Plan: Knopf ohne Zähler, Dialog meldet „Keine Hinweise“',await pg.evaluate(()=>{const b=document.querySelector('#check-btn');return b.textContent==='Prüfung'&&!b.classList.contains('warn')})&&await (async()=>{await pg.click('#check-btn');await pg.waitForSelector('#kdlg[open]');return pg.evaluate(()=>/Keine Hinweise/.test(document.querySelector('#k-list').textContent))})());
 await pg.keyboard.press('Escape');
 /* Vorlage setzt Start und Ende */
 await pg.click('#k-close').catch(()=>{});
 const dh=await mkDoc('Reise');const ph=await open(dh);await ph.selectOption('#tpl','hero');
 console.log('Heldenreise einfügen: Narr als Start, Welt als Ende, Prüfung ohne Hinweise',await ph.evaluate(()=>{const ns=Object.values(__planner.doc().graphs.g0.nodes),s=ns.find(n=>n.card===0),e=ns.find(n=>n.card===21);return s.role==='start'&&e.role==='end'&&ns.filter(n=>n.role).length===2&&document.querySelector('#check-btn').textContent==='Prüfung'}));
 await ph.waitForFunction("document.querySelector('#status').textContent==='Gespeichert'",null,{timeout:8000});await ph.reload();await ph.waitForFunction('window.__planner');
 console.log('Nach Neuladen sind Start und Ende da',await ph.evaluate(()=>!!document.querySelector('.node.role-start')&&!!document.querySelector('.node.role-end')));
 const ex=await (await fetch(B+'/api/planner/export?d='+dh)).text();
 console.log('Markdown vom Server enthält Start, Ende und „Keine Lücken“',/\[START\] Kapitel: 0 · Der Narr/.test(ex)&&/\[ENDE\] Kapitel: XXI · Die Welt/.test(ex)&&/Keine Lücken gefunden/.test(ex));
 /* Handy */
 const pm=await open(await mkDoc('M'),{width:390,height:800});await pm.click('#add-scene');await pm.waitForSelector('fieldset.roles');
 console.log('Handybreite: Rolle-Auswahl und Leiste passen, kein waagerechtes Scrollen',await pm.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1&&document.querySelector('fieldset.roles').getBoundingClientRect().right<=window.innerWidth));
 if(process.env.SHOT)await pd.screenshot({path:process.env.SHOT});
 await b.close();srv.close();
})();
