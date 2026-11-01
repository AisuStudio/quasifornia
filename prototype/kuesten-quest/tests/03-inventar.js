const {chromium}=require('playwright');const http=require('http'),fs=require('fs'),path=require('path');
const ROOT=require('path').join(__dirname,'..');
const srv=http.createServer((q,s)=>{const u=q.url.split('?')[0];const f=u==='/'?path.join(ROOT,'dist/dev.html'):path.join(ROOT,u);
 fs.readFile(f,(e,d)=>{if(e){s.writeHead(404);s.end();return}s.writeHead(200,{'content-type':f.endsWith('.js')?'text/javascript; charset=utf-8':'text/html; charset=utf-8'});s.end(d)})}).listen(8803,async()=>{
 const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
 const ctx=await b.newContext({viewport:{width:1280,height:800}});const p=await ctx.newPage();
 p.on('pageerror',e=>console.log('ERR',e.message));p.on('console',m=>{const t=m.text();if(!/GPU stall|Font|fonts.g|Failed to load/.test(t))console.log('LOG',t.slice(0,300))});
 await p.route(/fonts\.(googleapis|gstatic)\.com/,r=>r.abort());
 await p.goto('http://localhost:8803/?test=1');await p.waitForFunction('window.__ready',null,{timeout:120000});
 await p.evaluate(()=>{
  window.pathTo=(target)=>{const H=__qa.HUB,m=H.maze,N=6,start=m.id(2,3);const prev={};const q=[start];prev[start]=-1;for(let h=0;h<q.length;h++){const u=q[h];m.adj[u].forEach(v=>{if(prev[v]===undefined){prev[v]=u;q.push(v)}})}
    const path=[];for(let n=target;n!==-1;n=prev[n])path.unshift(n);return path.map(n=>[(n%N-2.5)*50,(Math.floor(n/N)-2.5)*50])};
  window.walk=(wps,max)=>{const q=__qa,P=q.P,K=q.K;let wi=1,n=0;
   while(n<max&&wi<wps.length){n++;const [wx,wz]=wps[wi];const d=Math.hypot(wx-P.x,wz-P.z);if(d<(wi===wps.length-1?2.5:5)){wi++;continue}
    const ang=Math.atan2(wz-P.z,wx-P.x);let diff=ang-P.h;diff=Math.atan2(Math.sin(diff),Math.cos(diff));
    K.up=Math.abs(diff)<.5?1:0;K.right=diff>.06?1:0;K.left=diff<-.06?1:0;
    q.step(.05);if(q.G.phase!=='play'||q.LV.id!==0)break}
   return {n,wi,total:wps.length,x:+P.x.toFixed(0),z:+P.z.toFixed(0)}}});
 console.log('Inventar-Knopf vor Start versteckt',await p.evaluate(()=>document.getElementById('b-inv').hidden));
 await p.click('#next1').then(()=>p.click('#go')).then(()=>p.click('#start'));
 console.log('Knopf im Spiel',await p.evaluate(()=>!document.getElementById('b-inv').hidden+' '+document.getElementById('b-inv-n').textContent));
 console.log('Items',await p.evaluate(()=>JSON.stringify(__qa.HUB.items.map(it=>[it.def.id,Math.round(it.x),Math.round(it.z),it.got]))));
 // Alle Items ablaufen (zur Kante passenden Seite anfahren)
 for(let k=0;k<5;k++){
  const r=await p.evaluate(k=>{const H=__qa.HUB,it=H.items[k],N=6;const bi=Math.round((it.x+ (k%2?-7:7))/50+2),bj=Math.round((it.z+22)/50+2);
    // Kantenknoten auf der Seite des Items: Item bei cx+7 -> Knoten i+1; cx-7 -> Knoten i
    const ni=k%2?bi+1:bi, nj=bj; const node=nj*N+ni;__qa.P.x=H.sx;__qa.P.z=H.sz;__qa.P.h=H.sh;const w=pathTo(node);w.push([it.x,it.z]);return walk(w,4000)},k);
  const s=await p.evaluate(k=>({got:__qa.HUB.items[k].got,inv:__qa.INV.items.size}),k);
  console.log('Item',k,JSON.stringify(r),JSON.stringify(s));
 }
 console.log('Speicher',await p.evaluate(()=>localStorage.getItem('kq-items')));
 console.log('Zähler',await p.evaluate(()=>document.getElementById('b-inv-n').textContent));
 await p.evaluate(()=>{const q=__qa;q.INV.items.delete('usb');q.HUB.items[2].got=false;q.HUB.items[2].g.visible=true;q.HUB.items[2].ring.visible=true;q.P.x=q.HUB.items[2].x+10;q.P.z=q.HUB.items[2].z;q.P.h=Math.PI;q.P.speed=2;for(let i=0;i<3;i++)q.step(.05);document.getElementById('ui').style.display='none';q.cam.position.set(q.P.x+10,7,q.P.z+4);q.cam.lookAt(q.HUB.items[2].x,4,q.HUB.items[2].z);q.cam.fov=55;q.cam.updateProjectionMatrix();q.render()});
 await p.screenshot({path:require('os').tmpdir()+'/t_item.png'});
 await p.evaluate(()=>{document.getElementById('ui').style.display=''});
 // Inventar öffnen, Pause prüfen
 await p.keyboard.press('KeyI');
 const t0=await p.evaluate(()=>__qa.G.t);await p.evaluate(()=>{for(let i=0;i<10;i++)__qa.step(.05)});
 console.log('Panel offen',await p.evaluate(()=>!document.getElementById('inv').hidden),'Pause (G.t gleich)',t0===await p.evaluate(()=>__qa.G.t),'Slots',await p.evaluate(()=>document.querySelectorAll('#inv-grid .slot-i').length+' gefunden:'+document.querySelectorAll('#inv-grid .slot-i.got').length));
 await p.evaluate(()=>{__qa.render()});await p.screenshot({path:require('os').tmpdir()+'/t_inv.png'});
 await p.keyboard.press('Escape');console.log('Esc schließt',await p.evaluate(()=>document.getElementById('inv').hidden));
 await p.keyboard.press('KeyI');await p.click('#inv-reset');console.log('Reset',await p.evaluate(()=>__qa.INV.items.size+' '+localStorage.getItem('kq-items')));
 await p.click('#inv-close');
 // Persistenz über Neuladen
 await p.evaluate(()=>{const q=__qa;q.HUB.items[0].got=false;q.collect&&0});
 await b.close();srv.close()})
