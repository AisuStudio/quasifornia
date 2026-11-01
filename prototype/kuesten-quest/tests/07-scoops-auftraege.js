const {chromium}=require('playwright');const http=require('http'),fs=require('fs'),path=require('path');
const srv=http.createServer((q,s)=>{const u=q.url.split('?')[0];const f=u==='/'?path.join(__dirname,'..','dist/dev.html'):path.join(__dirname,'..',u);fs.readFile(f,(e,d)=>{if(e){s.writeHead(404);s.end();return}s.writeHead(200,{'content-type':f.endsWith('.js')?'text/javascript; charset=utf-8':'text/html; charset=utf-8'});s.end(d)})}).listen(8810,async()=>{
 const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
 const p=await b.newPage({viewport:{width:1100,height:700}});p.on('pageerror',e=>console.log('ERR',e.message));
 await p.route(/fonts\.(googleapis|gstatic)\.com/,r=>r.abort());
 await p.goto('http://localhost:8810/?test=1');await p.waitForFunction('window.__ready',null,{timeout:120000});await p.click('#next1').then(()=>p.click('#go')).then(()=>p.click('#start'));
 const st=()=>p.evaluate(()=>({n:__qa.SC.n,lv:__qa.LV.id,hud:document.getElementById('sc-n').textContent,vis:!document.getElementById('sc-hud').hidden,au:JSON.stringify(__qa.SC.au)}));
 console.log('Start',JSON.stringify(await st()));
 console.log('zu wenig',JSON.stringify(await p.evaluate(async()=>{const q=__qa;q.SC.n=3;q.enterPortal(q.HUB.portals[0]);await new Promise(r=>setTimeout(r,900));return {n:q.SC.n,lv:q.LV.id,blocked:q.HUB.portals[0].blocked,toast:document.getElementById('toast').textContent}})));
 await p.evaluate(()=>{__qa.SC.n=30;__qa.HUB.portals[0].blocked=0;__qa.HUB.portals[0].hit=0});
 await p.evaluate(()=>__qa.enterPortal(__qa.HUB.portals[0]));await p.waitForTimeout(100);
 await p.evaluate(()=>{for(let i=0;i<60;i++)__qa.step(.05)});
 console.log('Reise',JSON.stringify(await st()));
 console.log('Eiskugel',JSON.stringify(await p.evaluate(()=>{const q=__qa;const s=q.scoops[0];q.P.x=s.x;q.P.z=s.z;q.P.y=3;q.step(.05);return {n:q.SC.n,got:s.got}})));
 console.log('Win1',JSON.stringify(await p.evaluate(()=>{const q=__qa;q.win();return {n:q.SC.n,au:JSON.stringify(q.SC.au)}})));
 console.log('Win2',JSON.stringify(await p.evaluate(()=>{const q=__qa;q.win();return {n:q.SC.n,au:JSON.stringify(q.SC.au)}})));
 await p.keyboard.press('Escape').catch(()=>{});
 await p.evaluate(()=>{document.getElementById('overlay').hidden=true});
 await p.keyboard.press('i');await p.waitForTimeout(300);await p.screenshot({path:require('os').tmpdir()+'/rp_inv.png'});
 for(const t of ['auf','sco','mus']){await p.click(`#rp-tabs button[data-t=${t}]`);await p.waitForTimeout(200);await p.screenshot({path:require("os").tmpdir()+`/rp_${t}.png`})}
 console.log('persist',await p.evaluate(()=>localStorage.getItem('kq-scoops')));
 await b.close();srv.close()})
