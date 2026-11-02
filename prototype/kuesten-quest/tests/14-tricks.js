// Tricks: Kickflip, Pop Shove-it, 360 Flip und Curb Grind; Auftrag Trick-Mix.
const {chromium}=require('playwright');const http=require('http'),fs=require('fs'),path=require('path');
const srv=http.createServer((q,s)=>{const u=q.url.split('?')[0];const f=u==='/'?path.join(__dirname,'..','dist/dev.html'):path.join(__dirname,'..',u);fs.readFile(f,(e,d)=>{if(e){s.writeHead(404);s.end();return}s.writeHead(200,{'content-type':f.endsWith('.js')?'text/javascript; charset=utf-8':'text/html; charset=utf-8'});s.end(d)})}).listen(8824,async()=>{
 const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
 const p=await b.newPage({viewport:{width:1100,height:620}});p.on('pageerror',e=>console.log('ERR',e.message));
 await p.route(/fonts\.(googleapis|gstatic)\.com/,r=>r.abort());
 await p.goto('http://localhost:8824/?test=1&alt=1');await p.waitForFunction('window.__ready',null,{timeout:120000});await p.click('#next1').then(()=>p.click('#go')).then(()=>p.click('#start'));
 for(const kind of ['kickflip','shove','tre'])console.log(kind,JSON.stringify(await p.evaluate((kind)=>{const q=__qa;q.G.phase='play';q.P.x=-60;q.P.z=0;q.P.h=0;q.K.up=1;q.step(.05);const t0=q.G.tricks||0;q.doTrick(kind);for(let i=0;i<50;i++)q.step(.03);return {plus:(q.G.tricks||0)-t0,kinds:[...q.G.kinds]}},kind)));
 console.log('Grind',JSON.stringify(await p.evaluate(()=>{const q=__qa;q.P.x=-18.6;q.P.z=-12;q.P.y=2.0;q.P.vy=0;q.P.h=Math.PI/2;q.P.speed=7;q.K.up=1;q.K.left=0;q.K.right=0;
   for(let i=0;i<4;i++)q.step(.03);const on=q.GR.on;const pos=[];for(let i=0;i<30;i++)q.step(.03);pos.push(+q.P.x.toFixed(2),+q.P.y.toFixed(2),+q.P.z.toFixed(1));const still=q.GR.on;
   q.jump();for(let i=0;i<6;i++)q.step(.03);return {on,still,pos,nachSprung:q.GR.on,kinds:[...q.G.kinds],au:q.SC.au.vielfalt||0,tricks:q.G.tricks}})));
 await b.close();srv.close()})
