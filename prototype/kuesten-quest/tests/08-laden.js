const {chromium}=require('playwright');const http=require('http'),fs=require('fs'),path=require('path');
const srv=http.createServer((q,s)=>{const u=q.url.split('?')[0];const f=u==='/'?path.join(__dirname,'..','dist/dev.html'):path.join(__dirname,'..',u);fs.readFile(f,(e,d)=>{if(e){s.writeHead(404);s.end();return}s.writeHead(200,{'content-type':f.endsWith('.js')?'text/javascript; charset=utf-8':'text/html; charset=utf-8'});s.end(d)})}).listen(8812,async()=>{
 const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
 const p=await b.newPage({viewport:{width:1100,height:700}});p.on('pageerror',e=>console.log('ERR',e.message));
 await p.route(/fonts\.(googleapis|gstatic)\.com/,r=>r.abort());
 await p.goto('http://localhost:8812/?test=1');await p.waitForFunction('window.__ready',null,{timeout:120000});
 console.log('Titel: gesperrte Punkte',await p.evaluate(()=>[...document.querySelectorAll('#cdots button')].map(b=>b.disabled?1:0).join('')));
 console.log('Pfeil weiter x12',await p.evaluate(()=>{const o=[];for(let i=0;i<12;i++){document.getElementById('cnext').click();o.push(document.getElementById('cname').textContent)}return o.join(',')}));
 await p.click('#go');
 const st=()=>p.evaluate(()=>({n:__qa.SC.n,own:[...__qa.SKOWN].join(',')}));
 console.log('Start',JSON.stringify(await st()));
 console.log('Kaufen Gold',JSON.stringify(await p.evaluate(()=>{const r=__qa.skBuy('gold');return {r,n:__qa.SC.n,own:__qa.SKOWN.has('gold')}})));
 console.log('Zu wenig',JSON.stringify(await p.evaluate(()=>{__qa.SC.n=4;const r=__qa.skBuy('sky');return {r,own:__qa.SKOWN.has('sky'),n:__qa.SC.n}})));
 await p.evaluate(()=>{__qa.SC.n=30;__qa.skWear('gold');for(let i=0;i<40;i++)__qa.step(.05)});
 console.log('Getragen',JSON.stringify(await p.evaluate(()=>({preset:__qa.P.preset,av:!!__qa.P.av,pos:[Math.round(__qa.P.x),Math.round(__qa.P.z)]}))));
 await p.keyboard.press('i');await p.waitForTimeout(200);await p.click('#rp-tabs button[data-t=lad]');await p.waitForTimeout(300);await p.screenshot({path:require('os').tmpdir()+'/lad.png'});
 console.log('persist',await p.evaluate(()=>localStorage.getItem('kq-skins')+' | '+localStorage.getItem('kq-skin')));
 await b.close();srv.close()})
