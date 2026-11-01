// Kanal: Wasser blockiert, Brücken sind passierbar, nichts Wichtiges liegt im Wasser.
const {chromium}=require('playwright');const http=require('http'),fs=require('fs'),path=require('path');
const srv=http.createServer((q,s)=>{const u=q.url.split('?')[0];const f=u==='/'?path.join(__dirname,'..','dist/dev.html'):path.join(__dirname,'..',u);fs.readFile(f,(e,d)=>{if(e){s.writeHead(404);s.end();return}s.writeHead(200,{'content-type':f.endsWith('.js')?'text/javascript; charset=utf-8':'text/html; charset=utf-8'});s.end(d)})}).listen(8827,async()=>{
 const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
 const p=await b.newPage({viewport:{width:1100,height:620}});p.on('pageerror',e=>console.log('ERR',e.message));
 await p.route(/fonts\.(googleapis|gstatic)\.com/,r=>r.abort());
 await p.goto('http://localhost:8827/?test=1');await p.waitForFunction('window.__ready',null,{timeout:120000});await p.click('#next1').then(()=>p.click('#go')).then(()=>p.click('#start'));
 console.log('Kanal',JSON.stringify(await p.evaluate(()=>{const H=__qa.HUB,C=H.canal,inC=(x,z)=>z>C.z0&&z<C.z1&&x>-141&&x<141&&!H.bridges.some(n=>Math.abs(x-n)<7);return {z:[C.z0,C.z1],bruecken:H.bridges,items:H.items.filter(i=>inC(i.x,i.z)).length,kegel:H.cones.filter(c=>inC(c.x,c.z)).length,portale:H.portals.filter(p=>inC(p.x,p.z)).length}})));
 const run=(label,x0,z0,h)=>p.evaluate(([x0,z0,h])=>{const q=__qa;q.G.phase='play';q.P.x=x0;q.P.z=z0;q.P.y=1.3;q.P.vy=0;q.P.h=h;q.P.speed=8;q.K.up=1;for(let i=0;i<60;i++)q.step(.03);return {x:+q.P.x.toFixed(1),z:+q.P.z.toFixed(1)}},[x0,z0,h]);
 console.log('Wasser: von Süden an Kante (x=-50)',JSON.stringify(await run('s',-50,-68,-Math.PI/2)),'(Ziel: bleibt bei z>-73)');
 console.log('Brücke: über x=-25',JSON.stringify(await run('b',-25,-68,-Math.PI/2)),'(Ziel: z<-85)');
 await b.close();srv.close()})
