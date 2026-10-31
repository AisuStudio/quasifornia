const {chromium}=require('playwright');const http=require('http'),fs=require('fs'),path=require('path');
const ROOT=require('path').join(__dirname,'..');
const srv=http.createServer((q,s)=>{const u=q.url.split('?')[0];const f=u==='/'?path.join(ROOT,'dist/dev.html'):path.join(ROOT,u);
 fs.readFile(f,(e,d)=>{if(e){s.writeHead(404);s.end();return}s.writeHead(200,{'content-type':f.endsWith('.js')?'text/javascript; charset=utf-8':'text/html; charset=utf-8'});s.end(d)})}).listen(8807,async()=>{
 const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
 const p=await b.newPage({viewport:{width:1280,height:800}});
 p.on('pageerror',e=>console.log('ERR',e.message));p.on('console',m=>{const t=m.text();if(!/GPU stall|Font|fonts.g|Failed to load/.test(t))console.log('LOG',t.slice(0,300))});
 await p.route(/fonts\.(googleapis|gstatic)\.com/,r=>r.abort());
 await p.goto('http://localhost:8807/?test=1');await p.waitForFunction('window.__ready',null,{timeout:120000});
 await p.click('#go');
 const info=await p.evaluate(()=>JSON.stringify({gb:__qa.HUB.gb,lab:[__qa.HUB.lab.i,__qa.HUB.lab.j],items:__qa.HUB.items.map(i=>[i.def.id,Math.round(i.x),Math.round(i.z)]),dist:__qa.HUB.maze.dist[__qa.HUB.maze.id(__qa.HUB.gb.i,__qa.HUB.gb.j)],gl:!!__qa.HUB.gl,bulbs:__qa.HUB.gl&&[__qa.HUB.gl.A.count,__qa.HUB.gl.B.count]}));
 console.log(info);const gb=JSON.parse(info).gb;
 const view=async(n,pos,look,fov=60)=>{await p.evaluate(([pos,look,fov])=>{document.getElementById('ui').style.display='none';const q=__qa;q.P.x=pos[0];q.P.z=pos[2]+14;q.P.h=-Math.PI/2;q.step(.03);q.cam.position.set(...pos);q.cam.lookAt(...look);q.cam.fov=fov;q.cam.updateProjectionMatrix();q.render()},[pos,look,fov]);await p.screenshot({path:`t_x_${n}.png`})};
 await view('front',[gb.cx+16,10,gb.cz-40],[gb.cx,6,gb.cz-8],62);
 await p.evaluate(()=>{for(let i=0;i<14;i++)__qa.step(.05)});await view('front2',[gb.cx+16,10,gb.cz-40],[gb.cx,6,gb.cz-8],62);
 await view('street',[gb.cx-40,5,gb.cz-34],[gb.cx,5,gb.cz-12],75);
 // Aktion am Schild
 await p.evaluate(([cx,cz])=>{document.getElementById('ui').style.display='';const q=__qa;q.P.x=cx;q.P.z=cz-22;q.P.h=-Math.PI/2;q.P.speed=0;q.step(.03)},[gb.cx,gb.cz]);
 console.log('Act',await p.evaluate(()=>{const q=__qa;let best=null,bd=1e9;for(const a of q.curActs()){const d=Math.hypot(q.P.x-a.x,q.P.z-a.z);if(d<a.r&&d<bd){bd=d;best=a}}return best&&best.label}));
 await b.close();srv.close()})
