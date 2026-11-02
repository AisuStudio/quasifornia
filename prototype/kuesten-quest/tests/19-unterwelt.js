// Unterwelt: Leiter im Gebüsch, kopfüber, fester Pixel-Look, Rückweg.
const {chromium}=require('playwright');const http=require('http'),fs=require('fs'),path=require('path');
const srv=http.createServer((q,s)=>{const u=q.url.split('?')[0];const f=u==='/'?path.join(__dirname,'..','dist/dev.html'):path.join(__dirname,'..',u);fs.readFile(f,(e,d)=>{if(e){s.writeHead(404);s.end();return}s.writeHead(200,{'content-type':f.endsWith('.js')?'text/javascript; charset=utf-8':'text/html; charset=utf-8'});s.end(d)})}).listen(8834,async()=>{
 const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
 const p=await b.newPage({viewport:{width:1100,height:620}});p.on('pageerror',e=>console.log('ERR',e.message));
 await p.route(/fonts\.(googleapis|gstatic)\.com/,r=>r.abort());
 await p.goto('http://localhost:8834/?test=1&alt=1');await p.waitForFunction('window.__ready',null,{timeout:120000});await p.click('#next1').then(()=>p.click('#go')).then(()=>p.click('#start'));
 const st=()=>p.evaluate(()=>({under:!!__qa.G.under,pix:__qa.G.pix,flip:document.querySelector('canvas').style.transform,uni:__qa.pixPass.uniforms.uUW.value,portale:__qa.HUB.portals.some(p=>p.g.visible),akt:(__qa.curActs().map(a=>a.label)||[]).join('|').slice(0,60)}));
 console.log('oben',JSON.stringify(await st()));
 await p.keyboard.press('p');console.log('P-Taste ändert nichts',JSON.stringify(await p.evaluate(()=>__qa.G.pix)));
 console.log('Eingang',JSON.stringify(await p.evaluate(()=>{const q=__qa;q.G.phase='play';q.P.x=-134;q.P.z=116;q.P.speed=0;q.step(.03);return q.curActs().map(a=>a.label)})));
 await p.evaluate(()=>{const q=__qa;q.P.x=-134;q.P.z=116;q.underEnter();for(let i=0;i<40;i++)q.step(.03)});
 console.log('unten',JSON.stringify(await st()));
 await p.evaluate(()=>{document.getElementById('ui').style.display='none';const q=__qa;q.P.x=-25;q.P.z=25;q.P.h=0;q.P.speed=0;for(let i=0;i<40;i++)q.step(.03);q.cam.position.set(-40,6,22);q.cam.lookAt(10,5,25);q.cam.fov=70;q.cam.updateProjectionMatrix();q.render()});
 await p.screenshot({path:require('os').tmpdir()+'/unten1.png'});
 await p.evaluate(()=>{const q=__qa;q.cam.position.set(-134,5,128);q.cam.lookAt(-134,3,100);q.cam.fov=65;q.cam.updateProjectionMatrix();q.render()});
 await p.screenshot({path:require('os').tmpdir()+'/unten2.png'});
 await p.evaluate(()=>{const q=__qa;q.cam.position.set(25,14,60);q.cam.lookAt(25,10,0);q.cam.fov=70;q.cam.updateProjectionMatrix();q.render()});
 await p.screenshot({path:require('os').tmpdir()+'/unten3.png'});
 await p.evaluate(()=>{document.getElementById('ui').style.display='';const q=__qa;q.P.x=-134;q.P.z=116;q.P.speed=0;q.step(.03)});
 console.log('Ausgang',JSON.stringify(await p.evaluate(()=>__qa.curActs().map(a=>a.label))));
 await p.evaluate(()=>{const q=__qa;q.underExit();for(let i=0;i<40;i++)q.step(.03)});
 console.log('wieder oben',JSON.stringify(await st()));
 await b.close();srv.close()})
