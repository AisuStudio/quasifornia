// Rarepod-Kamera: Foto mit Polaroid-Rahmen, lokale Galerie (IndexedDB), Löschen, Zeigen an den Raum (nur Weiterleitung, nichts gespeichert).
// Der Raum-Teil braucht einen lokalen Worker:  cd quasifornia && npx wrangler dev --local --port 8790 --var SITE_PASSWORD:testpw --var STATS_PASSWORD:statspw
const {chromium}=require('playwright');const http=require('http'),fs=require('fs'),path=require('path');
const ROOT=path.join(__dirname,'..'),AUTH='Basic '+Buffer.from('x:testpw').toString('base64');
const srv=http.createServer((q,s)=>{const u=q.url.split('?')[0];
 if(u.startsWith('/api/')){const pr=http.request({host:'localhost',port:8790,path:q.url,method:q.method,headers:{...q.headers,host:'localhost:8790',authorization:AUTH}},r=>{s.writeHead(r.statusCode,r.headers);r.pipe(s)});pr.on('error',()=>{s.writeHead(502);s.end()});q.pipe(pr);return}
 const f=u==='/'?path.join(ROOT,'dist/dev.html'):path.join(ROOT,u);fs.readFile(f,(e,d)=>{if(e){s.writeHead(404);s.end();return}s.writeHead(200,{'content-type':f.endsWith('.js')?'text/javascript; charset=utf-8':'text/html; charset=utf-8'});s.end(d)})});
srv.on('upgrade',(req,sock,head)=>{const up=require('net').connect(8790,'localhost',()=>{const hs=Object.entries({...req.headers,host:'localhost:8790',origin:'http://localhost:8790',authorization:AUTH}).map(([k,v])=>k+': '+v).join('\r\n');up.write(req.method+' '+req.url+' HTTP/1.1\r\n'+hs+'\r\n\r\n');if(head&&head.length)up.write(head);sock.pipe(up);up.pipe(sock)});up.on('error',()=>sock.destroy());sock.on('error',()=>up.destroy())});
srv.listen(8951,async()=>{
 const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
 const open=async(name)=>{const ctx=await b.newContext({viewport:{width:900,height:560}});await ctx.route(/fonts/,r=>r.abort());await ctx.route('**/api/graffiti**',r=>r.fulfill({status:404,body:''}));const p=await ctx.newPage();p.on('pageerror',e=>console.log('ERR',e.message));
  await p.goto('http://localhost:8951/?test=1&name='+name);await p.waitForFunction('window.__ready',null,{timeout:120000});await p.click('#next1').then(()=>p.click('#go')).then(()=>p.click('#start'));
  await p.evaluate(()=>{const q=__qa;q.G.phase='play';q.DLG.open=false;document.getElementById('dlg').hidden=true});return p};
 const A=await open('Anton');
 const s1=await A.evaluate(async()=>{const q=__qa;await new Promise(r=>setTimeout(r,300));const f=q.fotSnap();await new Promise(r=>setTimeout(r,300));
   const im=new Image();im.src=f.img;await new Promise(r=>im.onload=r);return {n:q.FOTO.list.length,w:im.naturalWidth,h:im.naturalHeight,jpeg:f.img.startsWith('data:image/jpeg'),thKB:Math.round(f.th.length/1024),txt:f.txt}});
 console.log('Foto gemacht',JSON.stringify(s1),s1.n===1&&s1.jpeg&&s1.w>300&&s1.h>200&&s1.thKB<60&&/Port 36|Level|Unterwelt/.test(s1.txt));
 const px=await A.evaluate(async()=>{const f=__qa.FOTO.list[0],im=new Image();im.src=f.img;await new Promise(r=>im.onload=r);const c=document.createElement('canvas');c.width=im.naturalWidth;c.height=im.naturalHeight;const g=c.getContext('2d');g.drawImage(im,0,0);
   const mid=g.getImageData(c.width/2,c.height/2-40,1,1).data,rim=g.getImageData(4,4,1,1).data;return {mid:[...mid],rim:[...rim]}});
 console.log('Bild nicht leer, Rahmen hell',JSON.stringify(px),px.rim[0]>230&&!(px.mid[0]>250&&px.mid[1]>240&&px.mid[2]>225));
 await A.reload();await A.waitForFunction('window.__ready',null,{timeout:120000});await new Promise(r=>setTimeout(r,600));
 console.log('Nach Neuladen noch da',await A.evaluate(()=>__qa.FOTO.list.length)===1);
 await A.click('#next1').then(()=>A.click('#go')).then(()=>A.click('#start'));await A.evaluate(()=>{const q=__qa;q.G.phase='play';q.DLG.open=false;document.getElementById('dlg').hidden=true});
 await A.keyboard.press('KeyC');await new Promise(r=>setTimeout(r,500));console.log('Taste C macht Foto',await A.evaluate(()=>__qa.FOTO.list.length)===2);
 await A.evaluate(()=>{document.getElementById('b-inv').click();document.querySelector('#rp-tabs [data-t=fot]').click()});
 const ui=await A.evaluate(()=>({th:document.querySelectorAll('#rp-fot .fth').length,btn:!!document.getElementById('fot-snap')}));console.log('Galerie im Rarepod',JSON.stringify(ui),ui.th===2&&ui.btn);
 await A.evaluate(()=>{document.querySelector('#rp-fot .fth').click()});
 const act=await A.evaluate(()=>[...document.querySelectorAll('#rp-fot .frow button')].map(b=>b.textContent));console.log('Aktionen',JSON.stringify(act),act.includes('Herunterladen')&&act.includes('Löschen')&&act.includes('An den Raum zeigen'));
 await A.evaluate(()=>{[...document.querySelectorAll('#rp-fot .frow button')].find(b=>b.dataset.a==='del').click()});
 await new Promise(r=>setTimeout(r,300));console.log('Löschen',await A.evaluate(()=>__qa.FOTO.list.length)===1);
 /* Raum: A und rohes WebSocket von Node */
 let ws=false;try{const r=await fetch('http://localhost:8790/api/graffiti',{headers:{authorization:AUTH}});ws=r.ok}catch(e){}
 if(!ws){console.log('Raum-Teil übersprungen: kein lokaler Worker');await b.close();srv.close();return}
 const got=[],raw=new WebSocket('ws://localhost:8790/api/room/fototest',{headers:{authorization:AUTH}});
 await new Promise(r=>raw.addEventListener('open',r));raw.send(JSON.stringify({t:'hello',name:'Mia',skin:'#d54291',pw:'geheim'}));raw.addEventListener('message',e=>got.push(JSON.parse(e.data)));
 await A.evaluate(()=>{const q=__qa;q.termCmd('/chat fototest geheim')});await new Promise(r=>setTimeout(r,1500));
 console.log('MULTI',JSON.stringify(await A.evaluate(()=>({on:__qa.MULTI.on,st:__qa.MULTI.state,room:__qa.MULTI.room}))),JSON.stringify(got.map(m=>m.t)));const z=await A.evaluate(()=>{const q=__qa;return q.fotToRoom(q.FOTO.list[0])});await new Promise(r=>setTimeout(r,800));
 const fo=got.find(m=>m.t==='foto');console.log('Foto an Raum gezeigt',z,fo&&fo.name,fo&&Math.round(fo.img.length/1024)+' KB',!!fo&&fo.img.startsWith('data:image/jpeg'));
 raw.send(JSON.stringify({t:'foto',img:'data:image/jpeg;base64,'+'A'.repeat(100)}));raw.send(JSON.stringify({t:'foto',img:'<script>'}));await new Promise(r=>setTimeout(r,500));
 const sp=await A.evaluate(()=>__qa.FOTO.peer.length);console.log('Mia zeigt, Anton bekommt (Mia kann selbst nur 1 pro 3 s, ungültiges wird verworfen)',sp);
 raw.send(JSON.stringify({t:'foto',img:'data:image/jpeg;base64,'+'A'.repeat(70000)}));await new Promise(r=>setTimeout(r,500));console.log('Zu großes Foto verworfen',await A.evaluate(()=>__qa.FOTO.peer.length)===sp);
 raw.close();await b.close();srv.close()});
