// A-Mart: Laden betreten, Kaufen nur im Laden, Minikarten-Marker.
const {chromium}=require('playwright');const http=require('http'),fs=require('fs'),path=require('path');
const srv=http.createServer((q,s)=>{const u=q.url.split('?')[0];const f=u==='/'?path.join(__dirname,'..','dist/dev.html'):path.join(__dirname,'..',u);fs.readFile(f,(e,d)=>{if(e){s.writeHead(404);s.end();return}s.writeHead(200,{'content-type':f.endsWith('.js')?'text/javascript; charset=utf-8':'text/html; charset=utf-8'});s.end(d)})}).listen(8853,async()=>{
 const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
 const p=await b.newPage({viewport:{width:1100,height:760}});p.on('pageerror',e=>console.log('ERR',e.message));
 await p.route(/fonts\.(googleapis|gstatic)\.com/,r=>r.abort());
 await p.goto('http://localhost:8853/?test=1&alt=1');await p.waitForFunction('window.__ready',null,{timeout:120000});await p.click('#next1').then(()=>p.click('#go')).then(()=>p.click('#start'));
 console.log('Läden',JSON.stringify(await p.evaluate(()=>__qa.HUB.shops.map(s=>[Math.round(s.x),Math.round(s.z)]))));
 console.log('Aktion am Laden',JSON.stringify(await p.evaluate(()=>{const q=__qa,s=q.HUB.shops[0];q.G.phase='play';q.P.x=s.x;q.P.z=s.z;q.P.speed=0;q.step(.03);return q.curActs().map(a=>a.label).filter(l=>/A-Mart/.test(l))})));
 console.log('draußen: Kaufen gesperrt',JSON.stringify(await p.evaluate(()=>{const q=__qa;q.SC.n=40;document.getElementById('b-inv').click();return null})));
 await p.click('#rp-tabs button[data-t=lad]');await p.waitForTimeout(200);
 console.log('  Laden draußen',JSON.stringify(await p.evaluate(()=>({gesperrt:[...document.querySelectorAll('#rp-lad button[data-b],#rp-lad button[data-can]')].every(b=>b.disabled),anz:document.querySelectorAll('#rp-lad button[data-can]').length,titel:document.querySelector('#inv h1').textContent.slice(0,12)}))));
 await p.keyboard.press('i');await p.waitForTimeout(150);
 console.log('im Laden',JSON.stringify(await p.evaluate(()=>{const q=__qa;q.shopEnter();return null})));await p.waitForTimeout(250);
 console.log('  Laden drin',JSON.stringify(await p.evaluate(()=>({offen:!document.getElementById('inv').hidden,titel:document.querySelector('#inv h1').textContent.slice(0,8),dosenKaufbar:[...document.querySelectorAll('#rp-lad button[data-can]')].some(b=>!b.disabled),skinKaufbar:[...document.querySelectorAll('#rp-lad button[data-b]')].some(b=>!b.disabled)}))));
 await p.click('#rp-lad button[data-can]:not([disabled])');await p.waitForTimeout(150);
 console.log('  Dose gekauft',JSON.stringify(await p.evaluate(()=>({scoops:__qa.SC.n,tank:Math.round(Object.values(__qa.GF.cans).reduce((a,c)=>a+c,0))}))));
 await p.screenshot({path:require('os').tmpdir()+'/pmart_shop.png'});
 await p.keyboard.press('i');await p.waitForTimeout(150);
 console.log('nach Schließen',JSON.stringify(await p.evaluate(()=>({inShop:__qa.SHOP.in}))));
 await p.evaluate(()=>{document.getElementById('ui').style.display='none';const q=__qa,s=q.HUB.shops[0];q.step(.03);q.cam.position.set(s.x+9,6,s.z-14);q.cam.lookAt(s.x,3.6,s.z+3);q.cam.fov=64;q.cam.updateProjectionMatrix();q.render()});
 await p.screenshot({path:require('os').tmpdir()+'/pmart_aussen.png'});
 await p.evaluate(()=>{const q=__qa,s=q.HUB.shops[0];q.cam.position.set(s.x-22,13,s.z-26);q.cam.lookAt(s.x,3,s.z+4);q.cam.fov=58;q.cam.updateProjectionMatrix();q.render()});
 await p.screenshot({path:require('os').tmpdir()+'/pmart_total.png'});
 await b.close();srv.close()})
