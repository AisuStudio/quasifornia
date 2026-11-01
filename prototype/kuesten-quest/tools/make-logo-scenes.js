// Erzeugt sechs Hochformat-Szenenbilder aus dem Spiel für den Postkarten-Look des Logos (src/logo/scenes/*.jpg).
// Aufruf im Ordner prototype/kuesten-quest: python3 build.py --dev && node tools/make-logo-scenes.js
const {chromium}=require('playwright');const http=require('http'),fs=require('fs'),path=require('path');
const R=path.join(__dirname,'..');
const srv=http.createServer((q,s)=>{const u=q.url.split('?')[0];const f=u==='/'?path.join(R,'dist/dev.html'):path.join(R,u);fs.readFile(f,(e,d)=>{if(e){s.writeHead(404);s.end();return}s.writeHead(200,{'content-type':f.endsWith('.js')?'text/javascript':'text/html'});s.end(d)})}).listen(8850,async()=>{
 const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
 const p=await b.newPage({viewport:{width:380,height:600}});p.on('pageerror',e=>console.log('ERR',e.message));await p.route(/fonts\.(googleapis|gstatic)\.com/,r=>r.abort());
 await p.goto('http://localhost:8850/?test=1');await p.waitForFunction('window.__ready',null,{timeout:120000});await p.click('#next1');await p.click('#go');await p.click('#start');await p.waitForTimeout(500);
 const shot=async(name,pos,look,fov,pre)=>{await p.evaluate(([pos,look,fov,pre])=>{document.getElementById('ui').style.display='none';document.getElementById('overlay').hidden=true;const q=__qa;q.G.phase='play';q.HUB.cull=false;if(pre)eval(pre);for(let i=0;i<4;i++)q.step(.03);q.cam.position.set(...pos);q.cam.lookAt(...look);q.cam.fov=fov;q.cam.aspect=380/600;q.cam.updateProjectionMatrix();q.render()},[pos,look,fov,pre||'']);await p.screenshot({path:path.join(R,'src/logo/scenes',name+'.jpg'),type:'jpeg',quality:72})};
 await shot('p-kueste',[-153,7,-6],[-330,2,-40],58,"q.P.x=-110;q.P.z=-25");
 await shot('o-cafe',[66,14,-26],[50,13,-4],68);
 await shot('r-burger',[8,15,-88],[0,15,-50],62);
 await shot('t-hochbahn',[25,9,92],[25,18,30],64,"const T=q.HUB.train;T.state='run';T.g.visible=true;T.s=262;q.stepTrain(.01)");
 await shot('3-unterwelt',[117,16,92],[128,27,128],62,"q.underApply(true);q.P.x=120;q.P.z=100");
 await shot('6-kanal',[-25,10,-58],[-25,3,-92],68,"if(q.G.under)q.underApply(false)");
 await b.close();srv.close()})
