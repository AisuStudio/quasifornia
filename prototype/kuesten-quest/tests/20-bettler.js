// Bettler-Quest: 3 Scoops geben, Releaser und Gedicht, Turm Tarxarox, Geist freilassen, 30 Scoops.
const {chromium}=require('playwright');const http=require('http'),fs=require('fs'),path=require('path');
const srv=http.createServer((q,s)=>{const u=q.url.split('?')[0];const f=u==='/'?path.join(__dirname,'..','dist/dev.html'):path.join(__dirname,'..',u);fs.readFile(f,(e,d)=>{if(e){s.writeHead(404);s.end();return}s.writeHead(200,{'content-type':f.endsWith('.js')?'text/javascript; charset=utf-8':'text/html; charset=utf-8'});s.end(d)})}).listen(8835,async()=>{
 const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
 const p=await b.newPage({viewport:{width:1100,height:620}});p.on('pageerror',e=>console.log('ERR',e.message));
 await p.route(/fonts\.(googleapis|gstatic)\.com/,r=>r.abort());
 await p.goto('http://localhost:8835/?test=1');await p.waitForFunction('window.__ready',null,{timeout:120000});await p.click('#next1').then(()=>p.click('#go'));
 const finish=()=>p.evaluate(()=>{const q=__qa;let n=0;while(q.DLG.open&&n++<30)q.dlgNext();return n});
 console.log('Bettler-Aktion',JSON.stringify(await p.evaluate(()=>{const q=__qa;q.G.phase='play';q.P.x=29.5;q.P.z=-68;q.P.speed=0;q.step(.03);return q.curActs().map(a=>a.label).filter(l=>/Serafin/.test(l))})));
 console.log('zu wenig',JSON.stringify(await p.evaluate(()=>{const q=__qa;q.SC.n=2;q.beggarTalk();return {dlg:q.DLG.open,gave:q.BQ.gave}})));await finish();
 console.log('geben',JSON.stringify(await p.evaluate(async()=>{const q=__qa;q.SC.n=10;q.beggarTalk();let n=0;while(q.DLG.open&&n++<30)q.dlgNext();const d2=q.DLG.open;n=0;while(q.DLG.open&&n++<30)q.dlgNext();return {scoops:q.SC.n,gave:q.BQ.gave,zweiterDialog:d2,d2}})));
 await p.keyboard.press('i');await p.waitForTimeout(250);console.log('Rarepod',JSON.stringify(await p.evaluate(()=>{const h=document.getElementById('inv-grid').innerHTML;return {releaser:/Releaser/.test(h),gedicht:/Gumpern/.test(h)&&/Serafin/.test(h)}})));await p.keyboard.press('i');
 console.log('unten',JSON.stringify(await p.evaluate(()=>{const q=__qa;q.underApply(true);q.P.x=128;q.P.z=119;q.P.y=1.3;q.P.speed=0;q.step(.03);return q.curActs().map(a=>a.label)})));
 console.log('Turm hinauf',JSON.stringify(await p.evaluate(()=>{const q=__qa;q.towerUp();for(let i=0;i<60;i++)q.step(.03);return {y:+q.P.y.toFixed(1),acts:q.curActs().map(a=>a.label)}})));
 console.log('freilassen',JSON.stringify(await p.evaluate(()=>{const q=__qa;const s0=q.SC.n;q.releaseTry();let n=0;while(q.DLG.open&&n++<30)q.dlgNext();for(let i=0;i<150;i++)q.step(.03);return {scoops:q.SC.n-s0,released:q.BQ.released,geistSichtbar:q.HUB.uw.ghost.visible,auftrag:q.SC.au.bettler||0}})));
 await p.evaluate(()=>{document.getElementById('ui').style.display='none';const q=__qa;q.BQ.released=false;q.HUB.uw.rel=0;q.HUB.uw.ghost.visible=true;q.HUB.uw.ghost.position.y=q.HUB.uw.tower.top+2.5;q.P.x=120;q.P.z=100;q.step(.03);q.cam.position.set(118,14,92);q.cam.lookAt(128,26,128);q.cam.fov=70;q.cam.updateProjectionMatrix();q.render()});
 await p.screenshot({path:require('os').tmpdir()+'/turm.png'});
 console.log('Turm hinab',JSON.stringify(await p.evaluate(()=>{const q=__qa;q.BQ.released=true;q.towerDown();for(let i=0;i<60;i++)q.step(.03);return {y:+q.P.y.toFixed(1),oben:q.BQ.up}})));
 await b.close();srv.close()})
