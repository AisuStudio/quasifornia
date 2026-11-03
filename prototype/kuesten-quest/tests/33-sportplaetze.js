// Sportplätze in Port Lupo: Basketball (Käfig, Öffnung, Körbe), X-Fit (Geräte), Beach-Volleyball (Sand, Netz); Kollision und Minikarte.
const {chromium}=require('playwright');const http=require('http'),fs=require('fs'),path=require('path');
const srv=http.createServer((q,s)=>{const u=q.url.split('?')[0];const f=u==='/'?path.join(__dirname,'..','dist/dev.html'):path.join(__dirname,'..',u);fs.readFile(f,(e,d)=>{if(e){s.writeHead(404);s.end();return}s.writeHead(200,{'content-type':f.endsWith('.js')?'text/javascript; charset=utf-8':'text/html; charset=utf-8'});s.end(d)})}).listen(8906,async()=>{
 const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
 const p=await b.newPage();p.on('pageerror',e=>console.log('ERR',e.message));
 await p.route(/fonts\.(googleapis|gstatic)\.com/,r=>r.abort());await p.route('**/api/graffiti**',r=>r.fulfill({status:404,body:''}));
 await p.goto('http://localhost:8906/?test=1');await p.waitForFunction('window.__ready',null,{timeout:120000});
 await p.evaluate(()=>{localStorage.clear();const q=__qa;q.applyLevel(0);q.beginPlay();q.G.phase='play'});
 const r=await p.evaluate(()=>{const q=__qa,C=q.HUB.courts,out={};const W=(c,lx,lz)=>[c.x+Math.cos(c.a)*lx-Math.sin(c.a)*lz,c.z+Math.sin(c.a)*lx+Math.cos(c.a)*lz],free=(c,lx,lz)=>{const p=W(c,lx,lz);return q.mpWalk(p[0],p[1])};
  out.kinds=C.map(c=>c.kind);
  const bk=C.find(c=>c.kind==='basket'),fx=bk.Lw/2-.3,fz=bk.Hw/2-.3,mids=[[0,-fz],[fx,0],[0,fz],[-fx,0]],outs=[[0,-1],[1,0],[0,1],[-1,0]],PL=Math.min(bk.Lw-5.5,28),gl=bk.gapLocal;
  out.basket={hoops:bk.hoops,zaunstuecke:bk.fence,seitenGesperrt:mids.map((m,i)=>i===bk.gapSide?null:!free(bk,m[0],m[1])).filter(v=>v!==null),oeffnungFrei:free(bk,gl[0],gl[1]),dahinterFrei:free(bk,gl[0]-outs[bk.gapSide][0]*2,gl[1]-outs[bk.gapSide][1]*2),ausserhalbFrei:free(bk,gl[0]+outs[bk.gapSide][0]*1.5,gl[1]+outs[bk.gapSide][1]*1.5),mitteFrei:free(bk,0,0),korbpfostenGesperrt:!free(bk,PL/2+.9,0)&&!free(bk,-PL/2-.9,0)};
  const xf=C.find(c=>c.kind==='xfit'),s=Math.min(1,xf.Hw/12.5,xf.Lw/12);
  out.xfit={geraete:xf.items,pfosten:xf.posts,pfostenGesperrt:!free(xf,-3.2*s-1.2,-4.6*s),mitteFrei:free(xf,0,0.2),zwischenPfostenFrei:free(xf,-3.2*s,-4.6*s-1.0)};
  const vb=C.find(c=>c.kind==='volley'),Wc=Math.min(8,vb.Hw-3);
  out.volley={netzGesperrt:!free(vb,0,0),pfostenGesperrt:!free(vb,0,Wc/2+.7)&&!free(vb,0,-(Wc/2+.7)),spielflaecheFrei:free(vb,4,0)&&free(vb,-4,0)&&free(vb,6,2),netzUmgehbar:free(vb,0,Wc/2+2.5)};
  /* Durch die Öffnung in den Käfig und zur Platzmitte fahren (Rasterflutung, 1 m) */
  {const o1=[gl[0]+outs[bk.gapSide][0]*3,gl[1]+outs[bk.gapSide][1]*3],st=W(bk,o1[0],o1[1]),goal=W(bk,0,0);const key=(x,z)=>Math.round(x)+','+Math.round(z),seen=new Set([key(st[0],st[1])]),qq=[[Math.round(st[0]),Math.round(st[1])]];let ok=false;
   while(qq.length&&!ok){const [x,z]=qq.shift();if(Math.hypot(x-goal[0],z-goal[1])<1.5){ok=true;break}for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,nz=z+dz,k=key(nx,nz);if(seen.has(k)||Math.hypot(nx-bk.x,nz-bk.z)>30||!q.mpWalk(nx,nz))continue;seen.add(k);qq.push([nx,nz])}}
   out.basket.vonAussenZurMitte=ok}
  out.baeumeAufPlatzEntfernt=q.HUB.courtTreesRemoved;
  /* Minikarte: Marker sichtbar */
  const px=[];C.forEach(c=>{q.P.x=c.x-40;q.P.z=c.z;q.P.speed=0;for(let i=0;i<6;i++)q.step(.05);const mc=document.getElementById('mini'),g=mc.getContext('2d'),mx=Math.round(75+40*.5),my=75,d=g.getImageData(mx-5,my-1,11,3).data;let hit=0;const col=c.col,tr=parseInt(col.slice(1,3),16),tg=parseInt(col.slice(3,5),16),tb=parseInt(col.slice(5,7),16);for(let i=0;i<d.length;i+=4)if(Math.abs(d[i]-tr)<40&&Math.abs(d[i+1]-tg)<40&&Math.abs(d[i+2]-tb)<40)hit++;px.push({art:c.kind,markerPixel:hit})});out.minikarte=px;
  return out});
 console.log(JSON.stringify(r,null,1));
 await b.close();srv.close()})
