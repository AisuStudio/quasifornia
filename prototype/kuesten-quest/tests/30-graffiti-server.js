// Graffiti überall, Server-Speicher (Ersatzserver), Ablauf, Erwischt-Strafe (Tag/Nacht).
const {chromium}=require('playwright');const http=require('http'),fs=require('fs'),path=require('path');
const srv=http.createServer((q,s)=>{const u=q.url.split('?')[0];const f=u==='/'?path.join(__dirname,'..','dist/dev.html'):path.join(__dirname,'..',u);fs.readFile(f,(e,d)=>{if(e){s.writeHead(404);s.end();return}s.writeHead(200,{'content-type':f.endsWith('.js')?'text/javascript; charset=utf-8':'text/html; charset=utf-8'});s.end(d)})}).listen(8891,async()=>{
 const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
 const store=new Map();let puts=0;
 const mock=async ctx=>{await ctx.route('**/api/graffiti**',async r=>{const req=r.request(),m=new URL(req.url()).pathname.match(/^\/api\/graffiti(?:\/(.+))?$/),id=m&&m[1],now=Date.now();
   if(!id){const items={};store.forEach((v,k)=>{if(now-v.t<48*3600*1000)items[k]=v.t});return r.fulfill({json:{now,ttl:48*3600*1000,items}})}
   if(req.method()==='PUT'){puts++;store.set(id,{t:now,png:req.postData()});return r.fulfill({json:{t:now}})}
   const v=store.get(id);return v?r.fulfill({body:v.png,contentType:'text/plain'}):r.fulfill({status:404,body:'weg'})})};
 const open=async()=>{const ctx=await b.newContext();await mock(ctx);await ctx.route(/fonts\.(googleapis|gstatic)\.com/,r=>r.abort());const p=await ctx.newPage();p.on('pageerror',e=>console.log('ERR',e.message));
   await p.goto('http://localhost:8891/?test=1');await p.waitForFunction('window.__ready',null,{timeout:120000});await p.evaluate(()=>{localStorage.clear();const q=__qa;q.applyLevel(0);q.beginPlay();q.G.phase='play'});await p.waitForTimeout(600);return p};
 const p=await open();
 /* 1 Fassade finden und Panel anlegen */
 const F=await p.evaluate(()=>{const q=__qa;for(let x=-120;x<120;x+=3)for(let z=-200;z<150;z+=3){q.P.x=x;q.P.z=z;const f=q.grafFacadeNear();if(f&&!f.door&&q.mpWalk(x,z))return {x,z,id:f.id}}return null});
 console.log('Fassade',JSON.stringify(F));
 /* 2 sprühen und speichern: Server bekommt das Bild */
 console.log('Sprühen',JSON.stringify(await p.evaluate(async F=>{const q=__qa;q.SC.n=40;q.grafBuy('#2de0d0');q.P.x=F.x;q.P.z=F.z;const pn=q.grafEnsurePanel(F.id);q.grafOpen(pn);const cv=document.getElementById('graf-cv');cv.getContext('2d').fillStyle='#2de0d0';cv.getContext('2d').fillRect(10,10,60,30);q.GF.dabs=500;q.grafClose(true);await new Promise(r=>setTimeout(r,500));return {panelId:pn.id}},F)));
 console.log('Server hat',JSON.stringify([...store.keys()]),'PUTs',puts);
 /* 3 zweiter Spieler sieht das Bild */
 const p2=await open();
 console.log('Spieler 2',JSON.stringify(await p2.evaluate(async F=>{const q=__qa;await q.grafSync();await new Promise(r=>setTimeout(r,600));const pn=q.HUB.graf.panels.find(x=>x.id===F.id);if(!pn)return {panel:false};const d=pn.ctx.getImageData(0,0,128,64).data;let n=0;for(let i=0;i<d.length;i+=4)if(d[i+3]>200&&d[i]<80&&d[i+1]>190)n++;return {panel:true,tuerkisPixel:n}},F)));
 /* 4 Ablauf: Server wirft alte Bilder raus */
 store.get(F.id).t=Date.now()-49*3600*1000;
 console.log('Nach 49 h',JSON.stringify(await p2.evaluate(async F=>{const q=__qa;q.GFSRV.retryAt=0;await q.grafSync();return {panelNoch:!!q.HUB.graf.panels.find(x=>x.id===F.id)}},F)));
 await b.close();srv.close()})
