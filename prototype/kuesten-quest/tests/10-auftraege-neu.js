const {chromium}=require('playwright');const http=require('http'),fs=require('fs'),path=require('path');
const srv=http.createServer((q,s)=>{const u=q.url.split('?')[0];const f=u==='/'?path.join(__dirname,'..','dist/dev.html'):path.join(__dirname,'..',u);fs.readFile(f,(e,d)=>{if(e){s.writeHead(404);s.end();return}s.writeHead(200,{'content-type':f.endsWith('.js')?'text/javascript; charset=utf-8':'text/html; charset=utf-8'});s.end(d)})}).listen(8815,async()=>{
 const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
 const p=await b.newPage();p.on('pageerror',e=>console.log('ERR',e.message));await p.route(/fonts\.(googleapis|gstatic)\.com/,r=>r.abort());
 await p.goto('http://localhost:8815/?test=1');await p.waitForFunction('window.__ready',null,{timeout:120000});await p.click('#next1').then(()=>p.click('#go1'));
 console.log('Blitz',JSON.stringify(await p.evaluate(()=>{const q=__qa;const s0=q.SC.n;q.scoops.forEach(s=>{q.P.x=s.x;q.P.z=s.z;q.P.y=3;q.step(.02)});return {delta:q.SC.n-s0,au:q.SC.au}})));
 console.log('Tricks',JSON.stringify(await p.evaluate(()=>{const q=__qa;q.resetRun();q.G.phase='play';const s0=q.SC.n;let n=0;q.K.up=1;for(let i=0;i<7;i++){q.doTrick();for(let k=0;k<45;k++)q.step(.03);n=q.G.tricks||0}return {tricks:n,delta:q.SC.n-s0,au:q.SC.au.tricks||0}})));
 await b.close();srv.close()})
