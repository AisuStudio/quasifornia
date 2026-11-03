// Mehrspieler Schritt 1, zwei Browser gegen einen lokalen Worker (wrangler dev): Beitritt, Skater sichtbar, Bewegung, Name, Uhr, Verlassen.
// Vorher:  cd quasifornia && npx wrangler dev --local --port 8790 --var SITE_PASSWORD:testpw
const {chromium}=require('playwright');const http=require('http'),net=require('net'),fs=require('fs'),path=require('path');
const WK={host:'localhost',port:8790},AUTH='Basic '+Buffer.from('x:testpw').toString('base64');
const srv=http.createServer((q,s)=>{const u=q.url.split('?')[0];
  if(u.startsWith('/api/')){const pr=http.request({...WK,path:q.url,method:q.method,headers:{...q.headers,host:'localhost:8790',authorization:AUTH}},r=>{s.writeHead(r.statusCode,r.headers);r.pipe(s)});q.pipe(pr);return}
  const f=u==='/'?path.join(__dirname,'..','dist/dev.html'):path.join(__dirname,'..',u);fs.readFile(f,(e,d)=>{if(e){s.writeHead(404);s.end();return}s.writeHead(200,{'content-type':f.endsWith('.js')?'text/javascript; charset=utf-8':'text/html; charset=utf-8'});s.end(d)})});
srv.on('upgrade',(req,sock,head)=>{const up=net.connect(WK.port,WK.host,()=>{const hs=Object.entries({...req.headers,host:'localhost:8790',origin:'http://localhost:8790',authorization:AUTH}).map(([k,v])=>k+': '+v).join('\r\n');up.write(req.method+' '+req.url+' HTTP/1.1\r\n'+hs+'\r\n\r\n');if(head&&head.length)up.write(head);sock.pipe(up);up.pipe(sock)});up.on('error',()=>sock.destroy());sock.on('error',()=>up.destroy())});
srv.listen(8921,async()=>{
 try{const r=await fetch('http://localhost:8790/api/graffiti',{headers:{authorization:AUTH}});if(!r.ok)throw 0}catch(e){console.log('übersprungen: kein lokaler Worker (npx wrangler dev --local --port 8790 --var SITE_PASSWORD:testpw)');srv.close();return}
 const raum='t'+Math.random().toString(36).slice(2,8);const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
 const open=async(name,extra='')=>{const ctx=await b.newContext({viewport:{width:900,height:560}});await ctx.route(/fonts\.(googleapis|gstatic)\.com/,r=>r.abort());await ctx.route('**/api/graffiti**',r=>r.fulfill({status:404,body:''}));
   const p=await ctx.newPage();p.on('pageerror',e=>console.log('ERR',name,e.message));p.on('console',m=>{if(process.env.DBG)console.log('CON',name,m.text().slice(0,160))});await p.goto('http://localhost:8921/?test=1&raum='+raum+'&name='+name+extra);await p.waitForFunction('window.__ready',null,{timeout:120000});
   await p.evaluate(()=>{localStorage.clear();const q=__qa;q.applyLevel(0);q.beginPlay();q.G.phase='play';setInterval(()=>{if(!window.__hold)q.step(.05)},50)});return p};
 const A=await open('Anton'),B=await open('Mia');
 const wait=ms=>new Promise(r=>setTimeout(r,ms));await wait(2500);
 const st=p=>p.evaluate(()=>{const q=__qa,M=q.MULTI;return {on:M.on,state:M.state,peers:[...M.peers.values()].map(x=>({name:x.name,has:x.has,sichtbar:!!(x.g&&x.g.visible)})),hud:document.getElementById('multi')&&document.getElementById('multi-t')&&document.getElementById('multi-t').textContent}});
 console.log('A',JSON.stringify(await st(A)));console.log('B',JSON.stringify(await st(B)));
 /* B fährt, A sieht es */
 await B.evaluate(()=>{const q=__qa;q.P.x=q.P.x+30;q.P.z=q.P.z+10;q.P.speed=0});await wait(1200);
 const ziel=await B.evaluate(()=>[__qa.P.x,__qa.P.z]);
 const ap=await A.evaluate(()=>{const q=__qa,p=[...q.MULTI.peers.values()][0];return {x:p.x,z:p.z,sicht:!!(p.g&&p.g.visible),gpos:p.g&&[p.g.position.x,p.g.position.z]}});
 console.log('Position',JSON.stringify({ziel:ziel.map(v=>+v.toFixed(1)),beiA:[ap.x,ap.z].map(v=>+v.toFixed(1)),abstand:+Math.hypot(ap.x-ziel[0],ap.z-ziel[1]).toFixed(2),sichtbar:ap.sicht}));
 /* Fahrt: B fährt, A sieht B mitfahren (Vergleich zur selben Zeit, B rollt nach dem Loslassen aus) */
 const lauf=await B.evaluate(async()=>{const q=__qa;q.P.h=0;q.K.up=1;const x0=q.P.x;await new Promise(r=>setTimeout(r,1500));q.K.up=0;return x0});
 await wait(2500);
 const [bx,ax]=await Promise.all([B.evaluate(()=>__qa.P.x),A.evaluate(()=>[...__qa.MULTI.peers.values()][0].x)]);
 console.log('Fahrt',JSON.stringify({Bvon:+lauf.toFixed(1),Bjetzt:+bx.toFixed(1),beiA:+ax.toFixed(1),abstand:+Math.abs(ax-bx).toFixed(2),gefolgt:bx-lauf>10&&Math.abs(ax-bx)<1.5}));
 /* Namensschild und Skin */
 console.log('Name',JSON.stringify(await A.evaluate(()=>{const p=[...__qa.MULTI.peers.values()][0];return {name:p.name,schild:!!p.label,skin:p.skin}})));
 await B.evaluate(()=>{document.getElementById('multi-n').click()}).catch(()=>{});
 /* Name ändern ohne prompt: direkte Nachricht */
 await B.evaluate(()=>{__qa.MULTI.name='Mia2';__qa.MULTI.ws.send(JSON.stringify({t:'name',name:'Mia2'}))});await wait(600);
 console.log('Umbenannt',await A.evaluate(()=>[...__qa.MULTI.peers.values()][0].name));
 /* Uhr: beide zeigen dieselbe Tageszeit */
 const uhr=await Promise.all([A,B].map(p=>p.evaluate(()=>{const q=__qa;return {t:q.DAY.t,off:q.MULTI.off,syn:q.MULTI.synced}})));
 console.log('Uhr',JSON.stringify({beideSynchron:uhr[0].syn&&uhr[1].syn,unterschiedSek:+Math.abs(uhr[0].t-uhr[1].t).toFixed(2)}));
 if(process.env.SHOT){await A.evaluate(async(dbg)=>{window.__DBGL=dbg;window.__hold=true;document.getElementById('ui').style.display='none';const q=__qa,pe=[...q.MULTI.peers.values()][0];q.DAY.t=40;q.DAY.dn=1;q.P.x=pe.x-7;q.P.z=pe.z+1;q.P.h=0;q.P.speed=0;q.step(.02);const c=q.cam;c.position.set(pe.x+5,3.4,pe.z+5);c.lookAt(pe.x,3.2,pe.z);if(window.__DBGL){pe.label.material.depthTest=false;pe.label.material.fog=false;pe.label.renderOrder=999;pe.label.material.needsUpdate=true}q.render();pe.g.updateMatrixWorld(true);const cx=pe.label.material.map.image,d=cx.getContext('2d').getImageData(0,0,256,64).data;let nz=0;for(let i=3;i<d.length;i+=4)if(d[i]>10)nz++;const e=pe.label.matrixWorld.elements;window.__lab=pe.label?{px:nz,pos:[e[12],e[13],e[14]].map(v=>+v.toFixed(1)),cam:q.cam.position.toArray().map(v=>+v.toFixed(1)),gpos:pe.g.position.toArray().map(v=>+v.toFixed(1)),vis:pe.label.visible,sc:pe.label.scale.toArray(),op:pe.label.material.opacity,mapok:!!pe.label.material.map,fog:pe.label.material.fog}:null},!!process.env.DBGL);console.log('Schild',JSON.stringify(await A.evaluate(()=>window.__lab)));await A.screenshot({path:process.env.SHOT});await A.evaluate(()=>{window.__hold=false;document.getElementById('ui').style.display=''})}
 /* Unterwelt: Spieler dort sieht den anderen nicht */
 await B.evaluate(()=>__qa.underApply(true));await wait(1200);
 console.log('Unterwelt',JSON.stringify(await A.evaluate(()=>{const q=__qa,p=[...q.MULTI.peers.values()][0];return {Asieht:!!(p.g&&p.g.visible),u:p.u}})));
 await B.evaluate(()=>__qa.underApply(false));await wait(800);
 /* Verlassen */
 await B.context().close();await wait(1500);
 console.log('Verlassen',JSON.stringify(await st(A)));
 /* Namensfeld auf dem Startbildschirm: Tippen ändert nur den Namen (M und N schalten nicht Musik/Effekte um) */
 {const ctx=await b.newContext({viewport:{width:900,height:620}});await ctx.route(/fonts/,r=>r.abort());const T=await ctx.newPage();await T.goto('http://localhost:8921/?test=1&raum='+raum);await T.waitForFunction('window.__ready',null,{timeout:120000});await wait(800);
  const vor=await T.evaluate(()=>({name:__qa.MULTI.name,paused:__qa.MUSE.paused,muted:__qa.G.muted,feld:!!document.getElementById('av-name'),sichtbar:document.getElementById('av-name')&&document.getElementById('av-name').getBoundingClientRect().height>0}));
  await T.click('#av-name',{clickCount:3});await T.keyboard.type('Mmn Tom-1');await T.keyboard.press('Tab');
  const nach=await T.evaluate(()=>({name:__qa.MULTI.name,gespeichert:localStorage.getItem('kq-name'),paused:__qa.MUSE.paused,muted:__qa.G.muted,feld:document.getElementById('av-name').value}));
  console.log('FreundeEintrag',await T.evaluate(()=>!document.getElementById('friends').hidden));
  console.log('Namensfeld',JSON.stringify({vor,nach,musikUnveraendert:vor.paused===nach.paused&&vor.muted===nach.muted}));
  await T.evaluate(()=>{const q=__qa;q.applyLevel(0);q.beginPlay();q.G.phase='play';setInterval(()=>q.step(.05),50)});await wait(2500);
  console.log('Name im Raum',await A.evaluate(()=>[...__qa.MULTI.peers.values()].map(p=>p.name)));await ctx.close()}
 /* Einzelspieler ohne ?raum */
 const ctx=await b.newContext();await ctx.route(/fonts/,r=>r.abort());const S=await ctx.newPage();await S.goto('http://localhost:8921/?test=1');await S.waitForFunction('window.__ready',null,{timeout:120000});
 console.log('Ohne Raum',JSON.stringify(await S.evaluate(()=>({room:__qa.MULTI.room,ws:!!__qa.MULTI.ws,hud:!!document.getElementById('multi')&&document.getElementById('multi').style.display}))));
 await b.close();srv.close()});
