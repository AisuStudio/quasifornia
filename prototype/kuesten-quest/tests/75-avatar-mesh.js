// Mesh-Avatar (Low Poly) mit Texture-Painter: Netz und Skelett, Gewichte, Flächen der Textur, Malen mit Spiegelung (Fläche und Figur), Füllen, Zurück, Datensatz, Posen, Reiter im Rahmen.
const {chromium}=require('playwright');const http=require('http'),fs=require('fs'),path=require('path');const ROOT=path.join(__dirname,'..');
const MIME={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.otf':'font/otf'};
const srv=http.createServer((q,s)=>{const u=decodeURIComponent(q.url.split('?')[0]);const f=path.join(ROOT,u.endsWith('/')?u+'index.html':u);fs.readFile(f,(e,d)=>{if(e){s.statusCode=404;s.end();return}s.setHeader('content-type',MIME[path.extname(f)]||'application/octet-stream');s.end(d)})});
srv.listen(9007,async()=>{let b;try{
 b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});const p=await b.newPage({viewport:{width:1280,height:800}});p.on('pageerror',e=>console.log('ERR',e.message));
 await p.route(/fonts\.(googleapis|gstatic)\.com/,r=>r.abort());await p.route('**/api/**',r=>r.fulfill({status:404,body:''}));
 await p.goto('http://localhost:9007/tools/avatar-designer/mesh.html');await p.waitForFunction('window.__msh',null,{timeout:30000});
 /* Netz und Skelett */
 const m=await p.evaluate(()=>{const g=__msh.mesh.geometry,si=g.attributes.skinIndex,sw=g.attributes.skinWeight;let okW=true,okI=true,n=0;for(let i=0;i<sw.count;i++){let s=0;for(let k=0;k<4;k++){s+=sw.getX?0:0}const w=[sw.getX(i),sw.getY(i),sw.getZ(i),sw.getW(i)],ix=[si.getX(i),si.getY(i),si.getZ(i),si.getW(i)];s=w[0]+w[1]+w[2]+w[3];if(Math.abs(s-1)>1e-4)okW=false;if(ix.some((x,k)=>w[k]>0&&x>=__msh.bones.length))okI=false;n++}
   const uv=g.attributes.uv;let uvOk=true;for(let i=0;i<uv.count;i++)if(uv.getX(i)<0||uv.getX(i)>1||uv.getY(i)<0||uv.getY(i)>1)uvOk=false;
   return {tris:__msh.tris,verts:__msh.verts,bones:__msh.bones.map(b=>b.name),okW,okI,uvOk,skinned:__msh.mesh.isSkinnedMesh}});
 const need=['hips','torso','head','thighL','shinL','footL','thighR','shinR','footR','shoulderL','elbowL','shoulderR','elbowR'];
 console.log('Netz und Skelett',JSON.stringify({tris:m.tris,verts:m.verts,bones:m.bones.length}),m.tris>=300&&m.tris<=800&&need.every(x=>m.bones.includes(x))&&m.okW&&m.okI&&m.uvOk&&m.skinned);
 /* Flächen: jede Fläche liegt in der Textur, ohne Überlappung */
 const rg=await p.evaluate(()=>{const R=__msh.RECT,ks=Object.keys(R);let over=false;const seen=new Uint8Array(4096);for(const k of ks){const [x,y,w,h]=R[k];if(x<0||y<0||x+w>64||y+h>64)over=true;for(let j=0;j<h;j++)for(let i=0;i<w;i++){if(seen[(y+j)*64+x+i])over=true;seen[(y+j)*64+x+i]=1}}return {n:ks.length,over}});
 console.log('Flächen',JSON.stringify(rg),rg.n===9&&!rg.over);
 /* Malen mit Spiegelung */
 const ml=await p.evaluate(()=>{const M=__msh,R=M.RECT;M.S.mir=true;M.tex.fill(0);
   M.put(R.head[0]+2,R.head[1]+5,9);const h=M.tex[(R.head[1]+5)*64+R.head[0]+2]===9&&M.tex[(R.head[1]+5)*64+R.head[0]+R.head[2]-1-2]===9;
   M.put(R.armL[0]+3,R.armL[1]+7,5);const a=M.tex[(R.armR[1]+7)*64+R.armR[0]+3]===5;
   M.put(R.footR[0]+4,R.footR[1]+1,7);const f=M.tex[(R.footL[1]+1)*64+R.footL[0]+4]===7;
   M.S.mir=false;M.put(R.legL[0]+1,R.legL[1]+1,3);const l=M.tex[(R.legR[1]+1)*64+R.legR[0]+1]!==3;
   M.put(0,63,4);const lee=M.tex[63*64]!==4;   /* außerhalb jeder Fläche: nichts */
   return {h,a,f,l,lee}});
 console.log('Spiegeln',JSON.stringify(ml),ml.h&&ml.a&&ml.f&&ml.l&&ml.lee);
 /* Füllen bleibt in der Fläche, Zurück */
 const fl=await p.evaluate(()=>{const M=__msh,R=M.RECT;M.S.mir=false;M.tex.fill(0);M.defaults();M.render();const before=M.tex.slice();M.floodFill(R.torso[0]+3,R.torso[1]+2,11);
   let inside=0,outside=0;for(let i=0;i<4096;i++)if(M.tex[i]!==before[i]){const x=i%64,y=i>>6;(x>=R.torso[0]&&x<R.torso[0]+R.torso[2]&&y>=R.torso[1]&&y<R.torso[1]+R.torso[3])?inside++:outside++}
   return {inside,outside}});
 console.log('Füllen',JSON.stringify(fl),fl.inside>100&&fl.outside===0);
 /* Malen auf der Figur: Treffer liefert Pixel der richtigen Flächen, Ziehen malt */
 const sw=await p.evaluate(()=>{const M=__msh,cv=M.THREE&&document.querySelector('#view canvas'),b=cv.getBoundingClientRect(),got=new Set();let first=null;
   for(let yy=0.1;yy<0.95;yy+=0.02)for(let xx=0.25;xx<0.75;xx+=0.02){const h=M.hit({clientX:b.left+b.width*xx,clientY:b.top+b.height*yy});if(h){const id=M.reg[h[1]*64+h[0]];got.add(id);if(id===2&&!first)first=[b.left+b.width*xx,b.top+b.height*yy]}}
   return {ids:[...got].sort(),first}});
 console.log('Treffer auf der Figur',JSON.stringify(sw),[1,2,4,5,6,7].every(x=>sw.ids.includes(x))&&!!sw.first);
 await p.evaluate(()=>{__msh.defaults();__msh.render();__msh.S.col=10;__msh.S.mir=false;__msh.S.tool='pencil'});
 const t0=await p.evaluate(()=>Array.from(__msh.tex));
 await p.mouse.move(sw.first[0],sw.first[1]);await p.mouse.down();await p.mouse.move(sw.first[0]+6,sw.first[1]+4,{steps:3});await p.mouse.up();
 const dif=await p.evaluate(t=>{let n=0,out=0;const R=__msh.RECT.torso;for(let i=0;i<4096;i++)if(__msh.tex[i]!==t[i]){n++;const x=i%64,y=i>>6;if(!(x>=R[0]&&x<R[0]+R[2]&&y>=R[1]&&y<R[1]+R[3]))out++}return {n,out,u:__msh.S.undo.length}},t0);
 console.log('Ziehen auf der Figur malt',JSON.stringify(dif),dif.n>=1&&dif.out===0&&dif.u>=1);
 await p.click('#undo');const back=await p.evaluate(t=>__msh.tex.every((v,i)=>v===t[i]),t0);console.log('Zurück',back);
 /* Datensatz */
 const js=await p.evaluate(()=>{const M=__msh;M.defaults();M.put(5,5,3);const o=M.toObj('Probe');const copy=Array.from(M.tex);M.tex.fill(0);M.fromObj(JSON.parse(JSON.stringify(o)));const same=copy.every((v,i)=>M.tex[i]===v);
   const bad=[{...o,tex:o.tex.slice(1)},{...o,tex:o.tex.replace(/^./,'z')},{...o,v:2},{...o,kind:'x'},null].map(x=>{try{M.fromObj(x);return false}catch(e){return true}});
   return {same,len:o.tex.length,json:JSON.stringify(o).length,bad,name:o.name}});
 console.log('Datensatz',JSON.stringify(js),js.same&&js.len===4096&&js.json<5000&&js.bad.every(Boolean)&&js.name==='Probe');
 /* Posen bewegen das Netz (Skinning wirkt): Fuß-Knochen wandert, Netz bleibt gleich groß */
 const ps=await p.evaluate(()=>{const M=__msh,T=M.THREE;const wp=()=>{const v=new T.Vector3();M.bones.find(b=>b.name==='footL').getWorldPosition(v);return v.toArray().map(x=>Math.round(x*100)/100)};
   const box=()=>{M.av.updateMatrixWorld(true);M.mesh.computeBoundingBox&&M.mesh.computeBoundingBox();const bb=new T.Box3(),v=new T.Vector3(),g=M.mesh.geometry.attributes.position;for(let i=0;i<g.count;i++){M.mesh.getVertexPosition(i,v);v.applyMatrix4(M.mesh.matrixWorld);bb.expandByPoint(v)}return bb.max.y-bb.min.y};
   M.setPose('stand');const a=wp(),ha=box();M.setPose('skate');const b2=wp(),hb=box();M.setPose('stand');return {a,b2,ha:Math.round(ha*100)/100,hb:Math.round(hb*100)/100,tris:M.tris}});
 console.log('Posen',JSON.stringify(ps),JSON.stringify(ps.a)!==JSON.stringify(ps.b2)&&ps.hb<ps.ha&&ps.ha>2&&ps.ha<3);
 /* Rahmen: Unterreiter Mesh */
 const f=await b.newPage({viewport:{width:1280,height:800}});f.on('pageerror',e=>console.log('ERR',e.message));await f.route(/fonts\.(googleapis|gstatic)\.com/,r=>r.abort());await f.route('**/api/**',r=>r.fulfill({status:404,body:''}));
 await f.goto('http://localhost:9007/tools/avatar-designer/index.html');await f.click('#s-mesh');await f.waitForTimeout(900);
 const rf=await f.evaluate(()=>{const i=document.getElementById('f-mesh');return {on:i.classList.contains('on'),ready:!!(i.contentWindow.__msh&&i.contentWindow.__msh.ready),rund:document.getElementById('f-round').classList.contains('on')}});
 console.log('Reiter Mesh',JSON.stringify(rf),rf.on&&rf.ready&&!rf.rund);
 await p.screenshot({path:process.env.SHOT||'/tmp/mesh.png'});
 }catch(e){console.log('ERR',e.message)}finally{if(b)await b.close();srv.close()}});
