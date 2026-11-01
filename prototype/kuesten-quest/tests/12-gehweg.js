// Gehweg: Ollie und Kickflip auf den Bürgersteig, ohne Sprung wird man gebremst.
const {chromium}=require('playwright');const http=require('http'),fs=require('fs'),path=require('path');
const srv=http.createServer((q,s)=>{const u=q.url.split('?')[0];const f=u==='/'?path.join(__dirname,'..','dist/dev.html'):path.join(__dirname,'..',u);fs.readFile(f,(e,d)=>{if(e){s.writeHead(404);s.end();return}s.writeHead(200,{'content-type':f.endsWith('.js')?'text/javascript; charset=utf-8':'text/html; charset=utf-8'});s.end(d)})}).listen(8819,async()=>{
 const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
 const p=await b.newPage({viewport:{width:1100,height:620}});p.on('pageerror',e=>console.log('ERR',e.message));
 await p.route(/fonts\.(googleapis|gstatic)\.com/,r=>r.abort());
 await p.goto('http://localhost:8819/?test=1');await p.waitForFunction('window.__ready',null,{timeout:120000});await p.click('#next1').then(()=>p.click('#go')).then(()=>p.click('#start'));
 console.log('Blöcke',JSON.stringify(await p.evaluate(()=>{const c=__qa.HUB.colliders;return {plattformen:c.filter(x=>x.walk).length,gebaeude:c.filter(x=>x.bld).length,vollblock:c.filter(x=>x.top===999&&!x.bld&&(x.x1-x.x0)>=35).length,breiten:c.filter(x=>x.bld).slice(0,5).map(x=>[Math.round(x.x1-x.x0),Math.round(x.z1-x.z0)])}})));
 const run=(mode)=>p.evaluate((mode)=>{const q=__qa;q.G.phase='play';q.P.x=-23;q.P.z=-40;q.P.y=1.3;q.P.vy=0;q.P.h=0;q.P.speed=8;q.P.turn=0;q.K.up=1;
   // Block (0,-50)? Zeile z=-50 hat Mitte -50, Kante bei x=-18: wir fahren von x=-26 nach +x auf z=-60 (Gehwegstreifen vor dem Gebäude)
   q.P.z=-62;
   if(mode==='ollie'){q.step(.05);q.jump()}
   if(mode==='kickflip'){q.step(.05);q.doTrick()}
   let maxY=0,minX=1e9;for(let i=0;i<50;i++){q.step(.03);maxY=Math.max(maxY,q.P.y);}
   return {x:+q.P.x.toFixed(1),y:+q.P.y.toFixed(2),maxY:+maxY.toFixed(2),ground:q.cityGround(q.P.x,q.P.z)}},mode);
 for(const m of ['ohne','ollie','kickflip'])console.log(m,JSON.stringify(await run(m)));
 await b.close();srv.close()})
