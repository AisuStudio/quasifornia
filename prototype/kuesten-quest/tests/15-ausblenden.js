// Ausblenden entfernter Häuserblöcke in Port Lupo: Dreiecke und Zeichenaufrufe mit und ohne Ausblenden an drei Orten.
const {chromium}=require('playwright');const http=require('http'),fs=require('fs'),path=require('path');
const srv=http.createServer((q,s)=>{const u=q.url.split('?')[0];const f=u==='/'?path.join(__dirname,'..','dist/dev.html'):path.join(__dirname,'..',u);fs.readFile(f,(e,d)=>{if(e){s.writeHead(404);s.end();return}s.writeHead(200,{'content-type':f.endsWith('.js')?'text/javascript; charset=utf-8':'text/html; charset=utf-8'});s.end(d)})}).listen(8826,async()=>{
 const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
 const p=await b.newPage({viewport:{width:1100,height:620}});p.on('pageerror',e=>console.log('ERR',e.message));
 await p.route(/fonts\.(googleapis|gstatic)\.com/,r=>r.abort());
 await p.goto('http://localhost:8826/?test=1&alt=1');await p.waitForFunction('window.__ready',null,{timeout:120000});await p.click('#next1').then(()=>p.click('#go')).then(()=>p.click('#start'));
 for(const [name,x,z] of [['Start',-25,25],['Mitte',0,0],['Ecke',-110,-110]]){
  const r=await p.evaluate(([x,z])=>{const q=__qa,H=q.HUB;q.G.phase='play';q.P.x=x;q.P.z=z;q.P.speed=0;q.K.up=0;const m={};
   for(const cull of [false,true]){H.cull=cull;for(let k=0;k<90;k++)q.step(.03);const R=q.R;R.info.reset();R.render(q.sc,q.cam);m[cull?'mit':'ohne']={tris:R.info.render.triangles,calls:R.info.render.calls,sichtbar:H.bgroups.filter(g=>g.visible).length}}
   return m},[x,z]);console.log(name,JSON.stringify(r))}
 console.log('Gruppen',await p.evaluate(()=>__qa.HUB.bgroups.length));
 await b.close();srv.close()})
