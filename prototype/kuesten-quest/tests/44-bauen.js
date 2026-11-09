// Builder (Baukasten): Bauplatz anlegen, Teile mit der Maus setzen, Dekos an Wänden, Radieren, Zurück, Speichern, Kollision, Belohnung einmalig, Abbrechen.
const {chromium}=require('playwright');const http=require('http'),fs=require('fs'),path=require('path');
const srv=http.createServer((q,s)=>{const u=q.url.split('?')[0];const f=u==='/'?path.join(__dirname,'..','dist/dev.html'):path.join(__dirname,'..',u);fs.readFile(f,(e,d)=>{if(e){s.writeHead(404);s.end();return}s.writeHead(200,{'content-type':f.endsWith('.js')?'text/javascript; charset=utf-8':'text/html; charset=utf-8'});s.end(d)})}).listen(8945,async()=>{
 const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});

 const p=await b.newPage({viewport:{width:1100,height:680}});p.on('pageerror',e=>console.log('ERR',e.message));
 await p.route(/fonts\.(googleapis|gstatic)\.com/,r=>r.abort());
 await p.goto('http://localhost:8945/?test=1');await p.waitForFunction('window.__ready',null,{timeout:120000});await p.click('#next1').then(()=>p.click('#go')).then(()=>p.click('#start'));
 const free=()=>p.evaluate(()=>{const q=__qa;q.DLG.open=false;document.getElementById('dlg').hidden=true;return true});
 await p.evaluate(()=>{const q=__qa;q.G.phase='play';q.SC.n=10;const s=q.HUB.shops[0];window.__pl=q.bauAddPlot(s.x+30,s.z+30,0,31,'t44');q.P.x=__pl.x;q.P.z=__pl.z;q.P.speed=0;q.step(.03)});await free();
 const act=()=>p.evaluate(()=>{const e=document.getElementById('act');return e.hidden?'':e.firstElementChild.textContent});
 console.log('Aktion am Bauplatz',await act());
 await p.evaluate(()=>{__qa.curActs().find(a=>/Bauplatz/.test(a.label)).fn()});await free();
 const n=()=>p.evaluate(()=>__pl.cells.size);
 console.log('Builder offen',JSON.stringify(await p.evaluate(()=>({offen:__qa.BAU.open,panel:!document.getElementById('bld').hidden}))));
 await p.evaluate(()=>{for(let i=0;i<3;i++)__qa.step(.03);__qa.render()});
 /* Rarepod-Taste wird blockiert */
 await p.keyboard.press('i');console.log('Taste I öffnet das Rarepod nicht',await p.evaluate(()=>!__qa.INV.open&&__qa.BAU.open));
 /* Hilfsfunktion: Bildschirmpunkt zu Zell-Punkt */
 const scr=(gx,gy,gz,lx,ly,lz)=>p.evaluate(([gx,gy,gz,lx,ly,lz])=>{const N=__pl.NX,C=__qa.BAU.C,v=__qa.cam.position.clone();v.set((gx-N/2+.5)*C+lx*C/2,gy*C+ly*C/2,(gz-N/2+.5)*C+lz*C/2);__pl.g.localToWorld(v);v.project(__qa.cam);const rc=document.querySelector('#stage canvas, canvas').getBoundingClientRect();return {x:rc.left+(v.x+1)/2*rc.width,y:rc.top+(1-v.y)/2*rc.height}},[gx,gy,gz,lx,ly,lz]);
 const click=async(pt,btn)=>{await p.mouse.move(pt.x,pt.y);await p.mouse.down({button:btn||'left'});await p.mouse.up({button:btn||'left'});await p.waitForTimeout(60)};
 /* 1 Boden anklicken: Würfel */
 await click(await scr(5,0,5,0,0,0));console.log('Würfel auf den Boden',await n(),await p.evaluate(()=>[...__pl.cells.keys()].join(' ')));
 /* 2 auf die Oberseite klicken: darüber wird gebaut */
 await click(await scr(5,0,5,0,2,0));console.log('Zweiter Würfel obendrauf',await n(),await p.evaluate(()=>[...__pl.cells.keys()].join(' ')));
 /* 3 Fenster an die Wand */
 await p.click('#bld-tabs button[data-t=oeff]');await p.click('#bld-parts button[data-p=win]');
 const faces=[[0,0,0,1],[1,1,0,0],[2,0,0,-1],[3,-1,0,0]];let placed=0;
 for(const [f,ox,,oz] of [[0,0,0,1],[1,1,0,0],[2,0,0,-1],[3,-1,0,0]]){const pt=await scr(5,0,5,ox*1,1,oz*1);const t=await p.evaluate(({x,y})=>{const q=__qa.bauPick({clientX:x,clientY:y});return q&&q.part?{face:q.face,key:q.key}:null},pt);if(t&&t.face>=0&&t.key==='5,0,5'){await click(pt);placed=1;break}}
 console.log('Fenster an einer Seitenwand',placed,await p.evaluate(()=>JSON.stringify(__pl.cells.get('5,0,5').f)));
 /* 4 Rechtsklick entfernt den oberen Würfel */
 await click(await scr(5,1,5,0,2,0),'right');console.log('Rechtsklick entfernt',await n());
 /* 5 Zurück (Z) */
 await p.keyboard.press('z');console.log('Zurück holt ihn wieder',await n());
 /* 6 Radierer-Knopf und Malen */
 await p.click('#bld-tools button[data-k=paint]');await p.click('#bld-cols button[data-c="3"]');await click(await scr(5,1,5,0,2,0));
 console.log('Pinsel färbt',await p.evaluate(()=>__pl.cells.get('5,1,5').c));
 /* 7 Kamera ziehen */
 const az0=await p.evaluate(()=>__qa.BAU.cam.az);await p.mouse.move(300,300);await p.mouse.down();await p.mouse.move(380,310,{steps:4});await p.mouse.up();
 console.log('Ziehen dreht die Kamera',await p.evaluate(a=>Math.abs(__qa.BAU.cam.az-a)>.3,az0),'und setzt nichts',await n());
 /* 8 Speichern: Esc, Raster blockiert, Speicher gefüllt */
 await p.keyboard.press('Escape');await p.waitForTimeout(100);
 console.log('Gespeichert',JSON.stringify(await p.evaluate(()=>{const q=__qa,N=__pl.N,w=q.pmartEnter&&null;const s=JSON.parse(localStorage.getItem('kq-bau2')||'{}').t44;const c=[(5-N/2+.5)*2,(5-N/2+.5)*2];const v=__pl.g.localToWorld(q.cam.position.clone().set(c[0],0,c[1]));return {offen:q.BAU.open,zellen:s?Object.keys(s.cells).length:0,blockiert:!q.mpWalk(v.x,v.z),belohnt:!!s.rew}})));
 /* 9 Spieler steckt nicht fest */
 console.log('Spieler frei',await p.evaluate(()=>__qa.mpWalk(__qa.P.x,__qa.P.z)));
 /* 10 Belohnung genau einmal */
 await p.evaluate(()=>{const q=__qa;q.SC.n=10;q.bauOpen(__pl);q.bauPutVol(__pl,3,0,3,'block',1,0);q.bauPutVol(__pl,4,0,3,'block',1,0);q.bauPutVol(__pl,3,0,4,'block',1,0);q.bauPutDeco(__pl,3,0,3,0,'door',9);q.bauPutDeco(__pl,4,0,3,0,'win',2);q.bauPutDeco(__pl,3,0,4,1,'win',2);q.bauPutVol(__pl,3,1,3,'gable',9,0);q.bauClose(true)});
 const sc1=await p.evaluate(()=>__qa.SC.n);
 await p.evaluate(()=>{const q=__qa;q.bauOpen(__pl);q.bauPutVol(__pl,6,0,6,'bush',7,0);q.bauClose(true)});const sc2=await p.evaluate(()=>__qa.SC.n);
 console.log('Belohnung',sc1,'dann',sc2,sc1===60&&sc2===60);
 /* 11 Abbrechen verwirft */
 const before=await n();await p.evaluate(()=>{const q=__qa;q.bauOpen(__pl);q.bauPutVol(__pl,8,0,8,'block',1,0)});await p.click('#bld-cancel');console.log('Abbrechen verwirft',before,await n(),await p.evaluate(()=>!__qa.BAU.open));
 /* 12 Neu laden: gleicher Bauplatz bekommt sein Haus zurück */
 console.log('Neu geladen',await p.evaluate(()=>{const q=__qa,np=q.bauAddPlot(__pl.x+80,__pl.z,0,31,'t44');return {zellen:np.cells.size,gleich:np.cells.size===__pl.cells.size}}));
 /* 13 Dach und Kuppel: Teilkatalog */
 console.log('Teile',await p.evaluate(()=>Object.keys(__qa.BAU_PARTS).length));
 await b.close();srv.close()})
