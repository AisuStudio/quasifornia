// Hügel: Bodenhöhe, Fahren bergauf und bergab, Gegenstände auf dem Hügel.
const {chromium}=require('playwright');const http=require('http'),fs=require('fs'),path=require('path');
const srv=http.createServer((q,s)=>{const u=q.url.split('?')[0];const f=u==='/'?path.join(__dirname,'..','dist/dev.html'):path.join(__dirname,'..',u);fs.readFile(f,(e,d)=>{if(e){s.writeHead(404);s.end();return}s.writeHead(200,{'content-type':f.endsWith('.js')?'text/javascript; charset=utf-8':'text/html; charset=utf-8'});s.end(d)})}).listen(8828,async()=>{
 const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
 const p=await b.newPage({viewport:{width:1100,height:620}});p.on('pageerror',e=>console.log('ERR',e.message));
 await p.route(/fonts\.(googleapis|gstatic)\.com/,r=>r.abort());
 await p.goto('http://localhost:8828/?test=1');await p.waitForFunction('window.__ready',null,{timeout:120000});await p.click('#go');
 console.log('Höhen',JSON.stringify(await p.evaluate(()=>{const q=__qa,g=q.hillG;return {spitze:+g(50,50).toFixed(2),nachbar:+g(0,50).toFixed(2),strasse:+g(25,50).toFixed(2),start:+g(-25,25).toFixed(2),kanal:+g(0,-78).toFixed(2),ecke:+g(-110,-110).toFixed(2),lab:+g(50,-100).toFixed(2),blockwerte:q.HILL.hb.map(r=>r.map(v=>+v.toFixed(1)).join(' ')).join(' | ')}})));
 console.log('Start',JSON.stringify(await p.evaluate(()=>{const q=__qa;q.G.phase='play';for(let i=0;i<20;i++)q.step(.03);return {y:+q.P.y.toFixed(2),boden:+q.cityGround(q.P.x,q.P.z).toFixed(2)}})));
 console.log('Bergauf',JSON.stringify(await p.evaluate(()=>{const q=__qa;q.P.x=-60;q.P.z=25;q.P.y=2;q.P.h=0;q.P.speed=6;q.K.up=1;const out=[];for(let i=0;i<200;i++){q.step(.03);if(i%25==24)out.push([+q.P.x.toFixed(0),+q.P.y.toFixed(2),+q.cityGround(q.P.x,q.P.z).toFixed(2),+q.P.speed.toFixed(1)].join(','))}return out})));
 console.log('Bergab',JSON.stringify(await p.evaluate(()=>{const q=__qa;q.P.x=60;q.P.z=25;q.P.y=9;q.P.h=Math.PI;q.P.speed=4.5;q.K.up=0;const out=[];for(let i=0;i<200;i++){q.step(.03);if(i%25==24)out.push([+q.P.x.toFixed(0),+q.P.y.toFixed(2),+q.cityGround(q.P.x,q.P.z).toFixed(2),+q.P.speed.toFixed(1),q.P.coy<.14?'am Boden':'Luft'].join(','))}return out})));
 console.log('Gegenstände',JSON.stringify(await p.evaluate(()=>{const q=__qa;return q.HUB.items.map(i=>[i.def.id,Math.round(i.x),Math.round(i.z),+i.G0.toFixed(1)])})));
 await b.close();srv.close()})
