const {chromium}=require('playwright');const http=require('http'),fs=require('fs'),path=require('path');
const ROOT=require('path').join(__dirname,'..');
const srv=http.createServer((q,s)=>{const u=q.url.split('?')[0];const f=u==='/'?path.join(ROOT,'dist/dev.html'):path.join(ROOT,u);
 fs.readFile(f,(e,d)=>{if(e){s.writeHead(404);s.end();return}s.writeHead(200,{'content-type':f.endsWith('.js')?'text/javascript; charset=utf-8':'text/html; charset=utf-8'});s.end(d)})}).listen(8801,async()=>{
 const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
 const p=await b.newPage({viewport:{width:1280,height:800}});
 p.on('pageerror',e=>console.log('ERR',e.message));p.on('console',m=>{const t=m.text();if(!/GPU stall|Font|fonts.g|Failed to load/.test(t))console.log('LOG',t.slice(0,300))});
 await p.route(/fonts\.(googleapis|gstatic)\.com/,r=>r.abort());
 await p.goto('http://localhost:8801/?test=1');await p.waitForFunction('window.__ready',null,{timeout:120000});
 const shot=async n=>{await p.evaluate('__qa.render()');await p.screenshot({path:require("os").tmpdir()+`/t_${n}.png`})};
 await p.evaluate(()=>{
  window.pathTo=(target)=>{const H=__qa.HUB,m=H.maze,N=6,start=m.id(2,3);const prev={};const q=[start];prev[start]=-1;for(let h=0;h<q.length;h++){const u=q[h];m.adj[u].forEach(v=>{if(prev[v]===undefined){prev[v]=u;q.push(v)}})}
    const path=[];for(let n=target;n!==-1;n=prev[n])path.unshift(n);return path.map(n=>[(n%N-2.5)*50,(Math.floor(n/N)-2.5)*50])};
  window.walk=(wps,max)=>{const q=__qa,P=q.P,K=q.K;let wi=1,n=0,stuck=0,lx=P.x,lz=P.z;
   while(n<max&&wi<wps.length){n++;const [wx,wz]=wps[wi];const d=Math.hypot(wx-P.x,wz-P.z);if(d<5){wi++;continue}
    const ang=Math.atan2(wz-P.z,wx-P.x);let diff=ang-P.h;diff=Math.atan2(Math.sin(diff),Math.cos(diff));
    K.up=Math.abs(diff)<.5?1:0;K.right=diff>.06?1:0;K.left=diff<-.06?1:0;
    q.step(.05);if(q.G.phase!=='play'||q.LV.id!==0)break;if(n%40==0){if(Math.hypot(P.x-lx,P.z-lz)<1.5)stuck++;lx=P.x;lz=P.z}}
   return {n,wi,total:wps.length,x:+P.x.toFixed(0),z:+P.z.toFixed(0),stuck,lv:q.LV.id,ph:q.G.phase}}});
 console.log('Titel-Buttons',await p.evaluate(()=>[...document.querySelectorAll('#card button.btn')].map(b=>b.textContent).join(' | ')));
 await p.click('#go');
 console.log('Start',await p.evaluate(()=>JSON.stringify({lv:__qa.LV.id,ph:__qa.G.phase,pos:[Math.round(__qa.P.x),Math.round(__qa.P.z)],portals:__qa.HUB.portals.map(p=>[p.world,p.node,Math.round(p.x),Math.round(p.z)]),coast:__qa.HUB.maze.coast,coastZ:__qa.HUB.coastZ,dists:[__qa.HUB.maze.dist[__qa.HUB.maze.coast],...__qa.HUB.portals.map(p=>__qa.HUB.maze.dist[p.node])],quest:document.getElementById('q-title').textContent,pips:[...document.querySelectorAll('#pips i')].filter(i=>i.style.display!=='none').length})));
 await p.evaluate(()=>{document.getElementById('ui').style.display='none';const q=__qa;for(let i=0;i<5;i++)q.step(.05);const z=q.HUB.coastZ;q.P.x=-125;q.P.z=z;q.P.h=Math.PI;q.P.speed=2;q.step(.05);q.cam.position.set(-120,10,z);q.cam.lookAt(-170,8,z);q.cam.fov=70;q.cam.updateProjectionMatrix();q.render()});
 await p.screenshot({path:require('os').tmpdir()+'/t_coast_view.png'});
 await p.evaluate(()=>{document.getElementById('ui').style.display=''});
 // Lauf zur Küste
 const r=await p.evaluate(()=>{const H=__qa.HUB;__qa.P.x=H.sx;__qa.P.z=H.sz;__qa.P.h=H.sh;const w=pathTo(H.maze.coast);w.push([-143,H.coastZ]);w.push([-165,H.coastZ]);return walk(w,5000)});
 console.log('Lauf zur Küste',JSON.stringify(r));
 await p.evaluate(()=>{for(let i=0;i<25;i++)__qa.step(.05)});
 console.log('nach Küste',await p.evaluate(()=>JSON.stringify({lv:__qa.LV.id,ph:__qa.G.phase,quest:document.getElementById('q-title').textContent,x:Math.round(__qa.P.x),boss:__qa.LV.boss})));
 await shot('race');
 await b.close();srv.close()})
