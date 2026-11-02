const {chromium}=require('playwright');const http=require('http'),fs=require('fs'),path=require('path');
const ROOT=require('path').join(__dirname,'..');
const srv=http.createServer((q,s)=>{const u=q.url.split('?')[0];const f=u==='/'?path.join(ROOT,'dist/dev.html'):path.join(ROOT,u);
 fs.readFile(f,(e,d)=>{if(e){s.writeHead(404);s.end();return}s.writeHead(200,{'content-type':f.endsWith('.js')?'text/javascript; charset=utf-8':'text/html; charset=utf-8'});s.end(d)})}).listen(8802,async()=>{
 const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
 const p=await b.newPage({viewport:{width:1280,height:800}});
 p.on('pageerror',e=>console.log('ERR',e.message));
 await p.route(/fonts\.(googleapis|gstatic)\.com/,r=>r.abort());
 await p.goto('http://localhost:8802/?test=1&alt=1');await p.waitForFunction('window.__ready',null,{timeout:120000});
 await p.evaluate(()=>{
  window.pathTo=(target)=>{const H=__qa.HUB,m=H.maze,N=6,start=m.id(2,3);const prev={};const q=[start];prev[start]=-1;for(let h=0;h<q.length;h++){const u=q[h];m.adj[u].forEach(v=>{if(prev[v]===undefined){prev[v]=u;q.push(v)}})}
    const path=[];for(let n=target;n!==-1;n=prev[n])path.unshift(n);return path.map(n=>[(n%N-2.5)*50,(Math.floor(n/N)-2.5)*50])};
  window.walk=(wps,max)=>{const q=__qa,P=q.P,K=q.K;let wi=1,n=0;
   while(n<max&&wi<wps.length){n++;const [wx,wz]=wps[wi];const d=Math.hypot(wx-P.x,wz-P.z);if(d<5){wi++;continue}
    const ang=Math.atan2(wz-P.z,wx-P.x);let diff=ang-P.h;diff=Math.atan2(Math.sin(diff),Math.cos(diff));
    K.up=Math.abs(diff)<.5?1:0;K.right=diff>.06?1:0;K.left=diff<-.06?1:0;
    q.step(.05);if(q.G.phase!=='play'||q.LV.id!==0)break}
   return {n,wi,total:wps.length,x:+P.x.toFixed(0),z:+P.z.toFixed(0),lv:q.LV.id,ph:q.G.phase}}});
 const st=()=>p.evaluate(()=>JSON.stringify({lv:__qa.LV.id,ph:__qa.G.phase,found:[...__qa.HUB.found],pips:[...document.querySelectorAll('#pips i.on')].length}));
 await p.click('#next1').then(()=>p.click('#go')).then(()=>p.click('#start'));
 for(const world of [2,3]){
  const r=await p.evaluate(w=>{const H=__qa.HUB,pt=H.portals.find(x=>x.world===w);__qa.P.x=H.sx;__qa.P.z=H.sz;__qa.P.h=H.sh;pt.hit=0;return walk(pathTo(pt.node),5000)},world);
  console.log('Portal',world,JSON.stringify(r));
  await p.evaluate(()=>{for(let i=0;i<25;i++)__qa.step(.05)});console.log('  in Welt',await st());
  await p.evaluate(()=>{__qa.win()});await p.evaluate(()=>{for(let i=0;i<10;i++)__qa.step(.05)});
  await p.click('#tocity');console.log('  zurück',await st());
 }
 // Leck-Test: kann man an Sperren am Rand vorbei? Position knapp an der Westmauer testen: für jede Randsperre
 const leaks=await p.evaluate(()=>{const H=__qa.HUB,q=__qa;const res=[];H.barricades.forEach(b=>{const edge=Math.abs(b.horiz?b.z:b.x)>=120;if(!edge)return;
   const sg=Math.sign(b.horiz?b.z:b.x);// von beiden Seiten versuchen, Richtung Rand zu fahren
   const start=b.horiz?{x:b.x-6,z:b.z+sg*12,h:0}:{x:b.x+(-1)*0,z:b.z-6,h:Math.PI/2};
   q.P.x=start.x;q.P.z=start.z;q.P.h=start.h;q.P.y=1.3;q.P.speed=8;q.G.phase='play';const x0=q.P.x,z0=q.P.z;for(let i=0;i<50;i++){q.K.up=1;q.K.left=q.K.right=0;q.step(.05)}
   const crossed=b.horiz?(q.P.x>b.x+1.2):(q.P.z>b.z+1.2);res.push({b:[b.x,b.z,b.horiz],crossed})});return res});
 console.log('Rand-Sperren geprüft',JSON.stringify(leaks));
 await b.close();srv.close()})
