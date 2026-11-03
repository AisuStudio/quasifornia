// Polizei im Raum (zwei Browser, lokaler Worker): Warnung nur beim Sprüher, Streifenwagen und Polizisten für alle sichtbar,
// der Erste wird gejagt und zahlt, zweiter Sprüher bekommt einen zweiten Wagen, nur der Erwischte zahlt.
// Vorher:  cd quasifornia && npx wrangler dev --local --port 8790 --var SITE_PASSWORD:testpw --var STATS_PASSWORD:statspw
const {chromium}=require('playwright');const http=require('http'),net=require('net'),fs=require('fs'),path=require('path');
const WK={host:'localhost',port:8790},AUTH='Basic '+Buffer.from('x:testpw').toString('base64');
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const srv=http.createServer((q,s)=>{const u=q.url.split('?')[0];
  if(u.startsWith('/api/')){const pr=http.request({...WK,path:q.url,method:q.method,headers:{...q.headers,host:'localhost:8790',authorization:AUTH}},r=>{s.writeHead(r.statusCode,r.headers);r.pipe(s)});q.pipe(pr);return}
  const f=u==='/'?path.join(__dirname,'..','dist/dev.html'):path.join(__dirname,'..',u);fs.readFile(f,(e,d)=>{if(e){s.writeHead(404);s.end();return}s.writeHead(200,{'content-type':f.endsWith('.js')?'text/javascript; charset=utf-8':'text/html; charset=utf-8'});s.end(d)})});
srv.on('upgrade',(req,sock,head)=>{const up=net.connect(WK.port,WK.host,()=>{const hs=Object.entries({...req.headers,host:'localhost:8790',origin:'http://localhost:8790',authorization:AUTH}).map(([k,v])=>k+': '+v).join('\r\n');up.write(req.method+' '+req.url+' HTTP/1.1\r\n'+hs+'\r\n\r\n');if(head&&head.length)up.write(head);sock.pipe(up);up.pipe(sock)});up.on('error',()=>sock.destroy());sock.on('error',()=>up.destroy())});
srv.listen(8942,async()=>{
 try{const r=await fetch('http://localhost:8790/api/graffiti',{headers:{authorization:AUTH}});if(!r.ok)throw 0}catch(e){console.log('übersprungen: kein lokaler Worker (npx wrangler dev --local --port 8790 --var SITE_PASSWORD:testpw --var STATS_PASSWORD:statspw)');srv.close();return}
 const raum='p'+Math.random().toString(36).slice(2,7),b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
 const open=async(name)=>{const ctx=await b.newContext({viewport:{width:800,height:500}});await ctx.route(/fonts/,r=>r.abort());await ctx.route('**/api/graffiti**',r=>r.fulfill({status:404,body:''}));const p=await ctx.newPage();p.on('pageerror',e=>console.log('ERR',name,e.message));
   await p.goto('http://localhost:8942/?test=1&raum='+raum+'&name='+name);await p.waitForFunction('window.__ready',null,{timeout:120000});
   await p.evaluate(()=>{localStorage.clear();const q=__qa;q.applyLevel(0);q.beginPlay();q.G.phase='play';q.SC.n=50;window.__tick=setInterval(()=>{if(!window.__hold)q.step(.05)},40)});return p};
 const A=await open('Anton'),B=await open('Mia');await wait(2500);
 const info=async p=>p.evaluate(()=>{const q=__qa,P=q.POL,R=q.POLR;const car=R.cars[0]&&R.cars[0].g.visible?[+R.cars[0].x.toFixed(0),+R.cars[0].z.toFixed(0)]:null;return {zustand:P.state,rolle:P.role,hud:document.getElementById('pol')?document.getElementById('pol').textContent:'',hudSichtbar:document.getElementById('pol')?document.getElementById('pol').style.display!=='none':false,eigeneCops:P.cops.length,eigenerWagen:!!P.car,fremderWagen:car,fremdePolizisten:R.cops.filter(c=>c&&c.g.visible).length,scoops:q.SC.n}});
 console.log('Raum',await A.evaluate(()=>__qa.MULTI.on),await B.evaluate(()=>__qa.MULTI.on));
 /* Wände: A sprüht an Wand 1 (weit weg), B bleibt bei Wand 3 */
 await A.evaluate(()=>{const q=__qa,pn=q.HUB.graf.panels[0];q.P.x=pn.ax+30;q.P.z=pn.az;q.P.speed=0});
 await B.evaluate(()=>{const q=__qa,pn=q.HUB.graf.panels[3];q.P.x=pn.ax+6;q.P.z=pn.az;q.P.speed=0});await wait(500);
 /* 1 A sprüht: Warnung nur bei A */
 await A.evaluate(()=>{const q=__qa;q.polAlert(q.HUB.graf.panels[0])});await wait(900);
 const a1=await info(A),b1=await info(B);console.log('Nach Alarm A',JSON.stringify(a1.zustand+'/'+a1.rolle+' hud="'+a1.hud+'"'),'| B',JSON.stringify(b1.zustand+' hud sichtbar='+b1.hudSichtbar));
 console.log('Warnung nur beim Sprüher',a1.zustand==='warn'&&a1.rolle==='owner'&&/POLIZEI IN/.test(a1.hud)&&b1.zustand==='idle'&&!b1.hudSichtbar);
 /* 2 Wagen fährt aus: B sieht ihn, ohne selbst gewarnt zu sein */
 await A.evaluate(()=>{__qa.POL.timer=.2});await wait(3500);
 const a2=await info(A),b2=await info(B);
 console.log('Wagen fährt',JSON.stringify({A:a2.zustand,eigenerWagen:a2.eigenerWagen}),'| B sieht Wagen bei',JSON.stringify(b2.fremderWagen),'B-Zustand',b2.zustand);
 const wp=await A.evaluate(()=>{const c=__qa.POL.car;return c?[c.x,c.z]:null}),bp=await B.evaluate(()=>{const c=__qa.POLR.cars[0];return c?[c.x,c.z]:null});
 console.log('B sieht den Wagen an der Stelle, wo er bei A steht (Abstand m)',wp&&bp?+Math.hypot(wp[0]-bp[0],wp[1]-bp[1]).toFixed(1):null);
 /* 3 Ankunft: Polizisten steigen aus, B sieht sie */
 for(let i=0;i<60&&(await A.evaluate(()=>__qa.POL.state))==='drive';i++)await wait(500);
 await wait(1200);const a3=await info(A),b3=await info(B);console.log('Angekommen',JSON.stringify({A:a3.zustand,Apol:a3.eigeneCops}),'B sieht Polizisten',b3.fremdePolizisten,'B-Zustand',b3.zustand);
 /* 4 A wird gejagt und gefangen: nur A zahlt */
 await A.evaluate(()=>{const q=__qa,c=q.POL.cops[0];let ok=false;for(let a=0;a<24&&!ok;a++){const x=c.x+Math.cos(a/24*6.283)*10,z=c.z+Math.sin(a/24*6.283)*10;if(q.mpWalk(x,z)&&q.polLos(c.x,c.z,x,z)){q.P.x=x;q.P.z=z;ok=true}}q.P.speed=0});
 for(let i=0;i<40&&(await A.evaluate(()=>__qa.POL.state))!=='caught';i++)await wait(250);
 const a4=await info(A);console.log('Erwischt',a4.zustand,'Scoops A',a4.scoops);
 await A.evaluate(()=>{const q=__qa;q.DLG.done&&q.DLG.done();q.DLG.open=false;document.getElementById('dlg').hidden=true});await wait(1500);
 const a5=await info(A),b5=await info(B);console.log('Nach der Strafe',JSON.stringify({A:{zustand:a5.zustand,scoops:a5.scoops},B:{zustand:b5.zustand,scoops:b5.scoops,fremdWagen:b5.fremderWagen,fremdPol:b5.fremdePolizisten}}));
 console.log('Nur A zahlt, bei B ist alles weg',a5.scoops===40&&b5.scoops===50&&b5.fremdePolizisten===0&&b5.fremderWagen===null&&a5.zustand==='idle');
 /* 5 Zweiter Sprüher: A zuerst, B danach */
 await A.evaluate(()=>{const q=__qa,pn=q.HUB.graf.panels[0];q.P.x=pn.ax+60;q.P.z=pn.az;q.P.speed=0});await wait(300);
 await A.evaluate(()=>{const q=__qa;q.polAlert(q.HUB.graf.panels[0])});await wait(700);
 await B.evaluate(()=>{const q=__qa;q.polAlert(q.HUB.graf.panels[3])});await wait(900);
 const a6=await info(A),b6=await info(B);console.log('Zwei Sprüher',JSON.stringify({A:a6.zustand+'/'+a6.rolle,B:b6.zustand+'/'+b6.rolle}));
 console.log('B ist zweiter Sprüher und gewarnt, A bleibt der Erste',a6.rolle==='owner'&&b6.rolle==='second'&&b6.zustand==='warn');
 /* dritte Person wird abgewiesen: Server-Test in Test 35 */
 await A.evaluate(()=>{__qa.POL.timer=.2});await B.evaluate(()=>{__qa.POL.timer=.2});await wait(2500);
 const a7=await A.evaluate(()=>{const q=__qa;return {g2:!!q.POL.g2,ziel:q.POL.g2&&q.POL.g2.target,zustand:q.POL.state}}),b7=await info(B);
 console.log('Zweiter Wagen',JSON.stringify(a7),'B wartet',b7.zustand);
 console.log('Zweiter Wagen fährt zu B',a7.g2&&a7.ziel!=='me'&&b7.zustand==='wait2');
 /* B bleibt stehen und wird vom zweiten Wagen erwischt; A bleibt weit weg */
 for(let i=0;i<120&&(await B.evaluate(()=>__qa.POL.state))!=='caught';i++){await wait(500);if(process.env.DBG&&i%4===0)console.log('  g2',JSON.stringify(await A.evaluate(()=>{const g=__qa.POL.g2;return g&&{st:g.state,t:+g.t.toFixed(1),chase:+g.chaseT.toFixed(1),far:+g.far.toFixed(1),car:g.car&&[Math.round(g.car.x),Math.round(g.car.z),g.car.done],cop:[Math.round(g.cops[0].x),Math.round(g.cops[0].z)],ziel:[Math.round(g.tx),Math.round(g.tz)]}})),'B:',await B.evaluate(()=>__qa.POL.state))}
 const b8=await info(B);console.log('B erwischt',b8.zustand,'Scoops B',b8.scoops);
 await B.evaluate(()=>{const q=__qa;q.DLG.done&&q.DLG.done();q.DLG.open=false;document.getElementById('dlg').hidden=true});await wait(1500);
 const b9=await info(B),a9=await info(A);console.log('Nach Strafe B',JSON.stringify({B:{zustand:b9.zustand,scoops:b9.scoops},A:{zustand:a9.zustand,scoops:a9.scoops}}));
 console.log('Nur B zahlt für den zweiten Wagen, A zahlt noch nichts',b9.scoops===40&&a9.scoops===40);
 await b.close();srv.close()});
