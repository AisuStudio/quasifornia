// Unterwelt: Zombies, Geister, Kürbis-Laternen und die drei Aufträge.
const {chromium}=require('playwright');const http=require('http'),fs=require('fs'),path=require('path');
const srv=http.createServer((q,s)=>{const u=q.url.split('?')[0];const f=u==='/'?path.join(__dirname,'..','dist/dev.html'):path.join(__dirname,'..',u);fs.readFile(f,(e,d)=>{if(e){s.writeHead(404);s.end();return}s.writeHead(200,{'content-type':f.endsWith('.js')?'text/javascript; charset=utf-8':'text/html; charset=utf-8'});s.end(d)})}).listen(8837,async()=>{
 const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
 const p=await b.newPage({viewport:{width:1100,height:620}});p.on('pageerror',e=>console.log('ERR',e.message));
 await p.route(/fonts\.(googleapis|gstatic)\.com/,r=>r.abort());
 await p.goto('http://localhost:8837/?test=1&alt=1');await p.waitForFunction('window.__ready',null,{timeout:120000});await p.click('#next1').then(()=>p.click('#go')).then(()=>p.click('#start'));
 await p.evaluate(()=>{localStorage.removeItem('kq-uw');__qa.uwReset();__qa.G.phase='play';__qa.underApply(true)});await p.waitForTimeout(150);
 console.log('Spawn',JSON.stringify(await p.evaluate(()=>{const q=__qa;q.step(.03);const L=q.UWE.list;return {zombies:L.filter(e=>e.kind==='z').length,geister:L.filter(e=>e.kind==='g').length,kuerbisse:q.UWE.pumpkins.length,hud:document.getElementById('q-title').textContent}})));
 console.log('Aufwachen',JSON.stringify(await p.evaluate(()=>{const q=__qa,z=q.UWE.list.find(e=>e.kind==='z');q.P.x=z.x+18;q.P.z=z.z;q.P.speed=0;const s0=z.state;for(let i=0;i<10;i++)q.step(.03);const s1=z.state;for(let i=0;i<60;i++)q.step(.03);return {vorher:s0,nach:s1,spaeter:z.state}})));
 console.log('Treffer',JSON.stringify(await p.evaluate(()=>{const q=__qa,z=q.UWE.list.find(e=>e.kind==='z');q.P.x=z.x+10;q.P.z=z.z;q.P.speed=0;q.P.y=2;z.state='chase';const q0=q.UWQ.z;q.throwBoard();for(let i=0;i<120;i++)q.step(.03);return {zombie:z.state,gezaehlt:q.UWQ.z-q0}})));
 console.log('Autsch',JSON.stringify(await p.evaluate(()=>{const q=__qa,z=q.UWE.list.filter(e=>e.kind==='z')[1];z.state='chase';z.x=q.P.x+1;z.z=q.P.z;z.g.visible=true;q.P.speed=6;const v0=q.P.speed;q.step(.03);return {speed:+q.P.speed.toFixed(1),von:v0}})));
 console.log('Geist',JSON.stringify(await p.evaluate(()=>{const q=__qa,g=q.UWE.list.find(e=>e.kind==='g');q.P.x=g.x+12;q.P.z=g.z;q.P.speed=0;g.state='chase';g.g.visible=true;for(let i=0;i<5;i++)q.step(.03);const q0=q.UWQ.g;q.throwBoard();for(let i=0;i<150;i++)q.step(.03);return {geist:g.state,gezaehlt:q.UWQ.g-q0}})));
 console.log('Aufträge',JSON.stringify(await p.evaluate(()=>{const q=__qa;const s0=q.SC.n;q.UWQ.z=5;const z=q.UWE.list.filter(e=>e.kind==='z')[2];q.P.x=z.x+10;q.P.z=z.z;q.P.y=2;q.P.speed=0;z.state='chase';z.g.visible=true;q.throwBoard();for(let i=0;i<150;i++)q.step(.03);
   q.UWE.pumpkins.forEach(pk=>{q.P.x=pk.x;q.P.z=pk.z;q.P.y=pk.y;q.step(.03)});return {scoops:q.SC.n-s0,gruft:q.SC.au.gruft||0,kuerbis:q.SC.au.kuerbis||0,kuerbisse:q.UWQ.k}})));
 await p.evaluate(()=>{document.getElementById('ui').style.display='none';const q=__qa,z=q.UWE.list.find(e=>e.kind==='z'),g=q.UWE.list.find(e=>e.kind==='g');q.UWE.list.forEach(e=>{e.state='chase';e.g.visible=true});q.P.x=z.x+8;q.P.z=z.z+6;q.P.y=2;for(let i=0;i<8;i++)q.step(.03);q.cam.position.set(z.x+6,5,z.z+16);q.cam.lookAt(z.x,2.5,z.z);q.cam.fov=70;q.cam.updateProjectionMatrix();q.render()});
 await p.screenshot({path:require('os').tmpdir()+'/gegner.png'});
 console.log('zurück',JSON.stringify(await p.evaluate(()=>{const q=__qa;q.underApply(false);q.step(.03);return {unter:q.G.under,zombieSichtbar:q.UWE.list.some(e=>e.g.visible),quest:document.getElementById('q-title').textContent}})));
 await b.close();srv.close()})
