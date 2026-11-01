// Hochbahn: Strecke an der Mauer, Zug fährt regelmäßig vorbei.
const {chromium}=require('playwright');const http=require('http'),fs=require('fs'),path=require('path');
const srv=http.createServer((q,s)=>{const u=q.url.split('?')[0];const f=u==='/'?path.join(__dirname,'..','dist/dev.html'):path.join(__dirname,'..',u);fs.readFile(f,(e,d)=>{if(e){s.writeHead(404);s.end();return}s.writeHead(200,{'content-type':f.endsWith('.js')?'text/javascript; charset=utf-8':'text/html; charset=utf-8'});s.end(d)})}).listen(8830,async()=>{
 const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
 const p=await b.newPage({viewport:{width:1100,height:620}});p.on('pageerror',e=>console.log('ERR',e.message));
 await p.route(/fonts\.(googleapis|gstatic)\.com/,r=>r.abort());
 await p.goto('http://localhost:8830/?test=1');await p.waitForFunction('window.__ready',null,{timeout:120000});await p.click('#go');
 console.log('Strecke',JSON.stringify(await p.evaluate(()=>{const T=__qa.HUB.train;return {laenge:Math.round(T.L),zustand:T.state,wartet:+T.cd.toFixed(1),sichtbar:T.g.visible}})));
 console.log('Lauf',JSON.stringify(await p.evaluate(()=>{const q=__qa,T=q.HUB.train;q.G.phase='play';const log=[];let sawRun=false,sawEnd=false;for(let i=0;i<3600;i++){q.step(.05);if(T.state==='run'&&!sawRun){sawRun=true;log.push(['startet bei',+(i*.05).toFixed(1)])}if(sawRun&&T.state==='wait'&&!sawEnd){sawEnd=true;log.push(['fertig bei',+(i*.05).toFixed(1),'naechster in',+T.cd.toFixed(0)]);break}}return log})));
 console.log('Ecken',JSON.stringify(await p.evaluate(()=>{const T=__qa.HUB.train;return [60,300,320,330,580,590,600].map(s=>{const p=T.posAt(s);return [s,+p.x.toFixed(0),+p.z.toFixed(0),+(p.h*180/Math.PI).toFixed(0)]})})));
 await p.evaluate(()=>{document.getElementById('ui').style.display='none';const q=__qa,T=q.HUB.train;T.state='run';T.g.visible=true;T.s=470;q.stepTrain(.01);q.cam.position.set(112,13,-60);q.cam.lookAt(139,17,-30);q.cam.fov=70;q.cam.updateProjectionMatrix();q.render()});
 await p.screenshot({path:require('os').tmpdir()+'/zug1.png'});
 await p.evaluate(()=>{const q=__qa,T=q.HUB.train;T.s=330;q.stepTrain(.01);q.cam.position.set(70,16,-100);q.cam.lookAt(130,16,-135);q.cam.fov=70;q.cam.updateProjectionMatrix();q.render()});
 await p.screenshot({path:require('os').tmpdir()+'/zug2.png'});
 await b.close();srv.close()})
