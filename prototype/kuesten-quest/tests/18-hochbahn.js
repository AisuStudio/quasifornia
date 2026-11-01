// Hochbahn: Strecke an der Mauer, Zug fährt regelmäßig vorbei.
const {chromium}=require('playwright');const http=require('http'),fs=require('fs'),path=require('path');
const srv=http.createServer((q,s)=>{const u=q.url.split('?')[0];const f=u==='/'?path.join(__dirname,'..','dist/dev.html'):path.join(__dirname,'..',u);fs.readFile(f,(e,d)=>{if(e){s.writeHead(404);s.end();return}s.writeHead(200,{'content-type':f.endsWith('.js')?'text/javascript; charset=utf-8':'text/html; charset=utf-8'});s.end(d)})}).listen(8830,async()=>{
 const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
 const p=await b.newPage({viewport:{width:1100,height:620}});p.on('pageerror',e=>console.log('ERR',e.message));
 await p.route(/fonts\.(googleapis|gstatic)\.com/,r=>r.abort());
 await p.goto('http://localhost:8830/?test=1');await p.waitForFunction('window.__ready',null,{timeout:120000});await p.click('#go');
 console.log('Zug',JSON.stringify(await p.evaluate(()=>{const T=__qa.HUB.train;return {laenge:Math.round(T.L),zustand:T.state,wartet:+T.cd.toFixed(1),sichtbar:T.g.visible}})));
 console.log('Lauf',JSON.stringify(await p.evaluate(()=>{const q=__qa,T=q.HUB.train;q.G.phase='play';const log=[];let sawRun=false,sawEnd=false;for(let i=0;i<3600;i++){q.step(.05);if(T.state==='run'&&!sawRun){sawRun=true;log.push(['startet bei',+(i*.05).toFixed(1)])}if(sawRun&&T.state==='wait'&&!sawEnd){sawEnd=true;log.push(['fertig bei',+(i*.05).toFixed(1),'naechster in',+T.cd.toFixed(0)]);break}}return log})));
 console.log('Strecke',JSON.stringify(await p.evaluate(()=>{const T=__qa.HUB.train;return [0,150,300,420,500,560,620,T.L-5].map(s=>{const p=T.posAt(s);return [Math.round(s),Math.round(p.x),Math.round(p.z),Math.round(p.h*180/Math.PI)]})})));
 for(const x0 of [22,25,28])console.log('Unterfahren x='+x0,JSON.stringify(await p.evaluate((x0)=>{const q=__qa;q.G.phase='play';q.P.x=x0;q.P.z=120;q.P.y=3;q.P.h=-Math.PI/2;q.P.speed=8;q.K.up=1;q.K.left=0;q.K.right=0;for(let i=0;i<700;i++){q.step(.03)}return {x:+q.P.x.toFixed(1),z:+q.P.z.toFixed(1),weiter:q.P.z<-60}},x0)));
 await p.evaluate(()=>{document.getElementById('ui').style.display='none';const q=__qa,T=q.HUB.train;T.state='run';T.g.visible=true;T.s=260;q.stepTrain(.01);q.cam.position.set(-5,12,95);q.cam.lookAt(25,15,40);q.cam.fov=65;q.cam.updateProjectionMatrix();q.render()});
 await p.screenshot({path:require('os').tmpdir()+'/zug1.png'});
 await p.evaluate(()=>{const q=__qa,T=q.HUB.train;T.s=560;q.stepTrain(.01);q.cam.position.set(-20,18,-70);q.cam.lookAt(25,16,-130);q.cam.fov=65;q.cam.updateProjectionMatrix();q.render()});
 await p.screenshot({path:require('os').tmpdir()+'/zug2.png'});
 await b.close();srv.close()})
