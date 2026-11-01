// Opener: Logo-Splash beim Start, Tastendruck führt zum Avatar-Schritt.
const {chromium}=require('playwright');const http=require('http'),fs=require('fs'),path=require('path');
const srv=http.createServer((q,s)=>{const u=q.url.split('?')[0];const f=u==='/'?path.join(__dirname,'..','dist/dev.html'):path.join(__dirname,'..',u);fs.readFile(f,(e,d)=>{if(e){s.writeHead(404);s.end();return}s.writeHead(200,{'content-type':f.endsWith('.js')?'text/javascript; charset=utf-8':'text/html; charset=utf-8'});s.end(d)})}).listen(8851,async()=>{
 const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
 const p=await b.newPage({viewport:{width:1280,height:720}});p.on('pageerror',e=>console.log('ERR',e.message));
 await p.route(/fonts\.(googleapis|gstatic)\.com/,r=>r.abort());
 await p.goto('http://localhost:8851/');await p.waitForSelector('#opener:not([hidden])',{timeout:100000});await p.waitForTimeout(2800);
 const st=()=>p.evaluate(()=>({opener:!document.getElementById('opener').hidden,card:!document.getElementById('card').hidden}));
 console.log('Start',JSON.stringify(await st()));await p.screenshot({path:require('os').tmpdir()+'/opener.png'});
 await p.keyboard.press('Space');await p.waitForTimeout(300);console.log('nach Taste',JSON.stringify(await st()));await p.waitForTimeout(500);console.log('Logo-Karte',JSON.stringify(await p.evaluate(()=>{const ids=[...document.querySelectorAll('[id^="l"][id*="_c"]')].map(e=>e.id);const refs=[...document.querySelectorAll('[clip-path]')].map(e=>e.getAttribute('clip-path'));return {ids:ids.length,eindeutig:new Set(ids).size===ids.length,refs:refs.length,alleVorhanden:refs.every(r=>ids.includes(r.slice(5,-1)))}})));await p.screenshot({path:require('os').tmpdir()+'/opener_karte.png'});
 await b.close();srv.close()})
