// Neue Karte: Zombies laufen nicht durch Häuser, Rückstoß schiebt nicht ins Haus, Festsitzen im Haus wird gelöst.
const {chromium}=require('playwright');const http=require('http'),fs=require('fs'),path=require('path');
const srv=http.createServer((q,s)=>{const u=q.url.split('?')[0];const f=u==='/'?path.join(__dirname,'..','dist/dev.html'):path.join(__dirname,'..',u);fs.readFile(f,(e,d)=>{if(e){s.writeHead(404);s.end();return}s.writeHead(200,{'content-type':f.endsWith('.js')?'text/javascript; charset=utf-8':'text/html; charset=utf-8'});s.end(d)})}).listen(8879,async()=>{
 const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
 const p=await b.newPage();p.on('pageerror',e=>console.log('ERR',e.message));
 await p.route(/fonts\.(googleapis|gstatic)\.com/,r=>r.abort());
 await p.goto('http://localhost:8879/?test=1');await p.waitForFunction('window.__ready',null,{timeout:120000});
 await p.evaluate(()=>{localStorage.clear();const q=__qa;q.applyLevel(0);q.beginPlay();q.G.phase='play'});
 /* Gebäudezelle suchen, die zwischen zwei freien Punkten liegt (Ost-West) */
 const T=await p.evaluate(()=>{const q=__qa;const ok=(x,z)=>q.mpWalk(x,z);
  for(let x=-120;x<120;x+=2)for(let z=-200;z<150;z+=2){if(q.mpAt(x,z)!==5)continue;
   for(let w=4;w<=30;w+=1){if(q.mpAt(x+w,z)===5)continue;if(ok(x-2,z)&&ok(x+w+2,z)&&q.mpAt(x+w/2,z)===5&&!ok(x+w/2,z)||false)return {a:[x-3,z],b:[x+w+3,z]}}}
  return null});
 console.log('Ort',JSON.stringify(T));
 /* 1 Festsitzen */
 console.log('Festsitzen',JSON.stringify(await p.evaluate(()=>{const q=__qa;let bx=null;for(let x=-120;x<120&&!bx;x+=2)for(let z=-200;z<150;z+=2)if(q.mpAt(x,z)===5&&q.mpAt(x+1,z)===5&&q.mpAt(x-1,z)===5&&q.mpAt(x,z+1)===5&&q.mpAt(x,z-1)===5){bx=[x,z];break}
  q.P.x=bx[0];q.P.z=bx[1];q.P.speed=3;q.step(.05);q.step(.05);return {inGebaeudeNachher:q.mpAt(q.P.x,q.P.z)===5,frei:q.mpWalk(q.P.x,q.P.z)}})));
 /* 2 Zombie läuft nicht durch Haus */
 await p.evaluate(()=>{__qa.underApply(true)});await p.waitForTimeout(300);
 console.log('Zombie',JSON.stringify(await p.evaluate(([T])=>{const q=__qa;q.G.phase='play';const z=q.UWE.list.find(e=>e.kind==='z');
  z.state='chase';z.g.visible=true;z.x=T.a[0];z.z=T.a[1];q.P.x=T.b[0];q.P.z=T.b[1];q.P.speed=0;let drin=0;
  for(let i=0;i<400;i++){q.P.x=T.b[0];q.P.z=T.b[1];q.step(.05);if(q.mpAt(z.x,z.z)===5)drin++}
  return {schritteImHaus:drin,zombie:[Math.round(z.x),Math.round(z.z)]}},[T])));
 /* 3 Rückstoß */
 console.log('Rückstoß',JSON.stringify(await p.evaluate(([T])=>{const q=__qa;const z=q.UWE.list.find(e=>e.kind==='z');q.UWE.stun=0;let drin=0;
  for(let k=0;k<30;k++){z.state='chase';z.x=T.a[0]+(k%3);z.z=T.a[1];q.P.x=T.a[0]+1.5+(k%3);q.P.z=T.a[1];q.P.speed=2;q.UWE.stun=0;q.step(.05);if(q.mpAt(q.P.x,q.P.z)===5)drin++}
  return {imHausNachTreffer:drin}},[T])));
 await b.close();srv.close()})
