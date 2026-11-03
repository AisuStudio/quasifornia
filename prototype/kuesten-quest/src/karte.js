/* ================= Neue Karte: Port Lupo nach der Halbinsel-Karte (src/map/Map_1.svg, umgewandelt in src/map/map.json) =================
   1 Karteneinheit = 0,5 m (MP.SC). Boden, Wasser, Straßen, Gebäude, Parks und S-Bahn kommen aus den Kartendaten.
   Mit ?alt=1 in der Adresse startet stattdessen die alte Rasterstadt. */
const MAPD=__MAPDATA__;
const MP={SC:.5,OX:2110,OY:1350,PLAY:{x0:1640,y0:480,x1:2400,y1:2100},RW:11,SWK:2.4,cls:null,land:null,w:0,h:0};
if(NEWMAP)HILL.off=true;
const mwx=x=>(x-MP.OX)*MP.SC,mwz=y=>(y-MP.OY)*MP.SC,mux=X=>X/MP.SC+MP.OX,muy=Z=>Z/MP.SC+MP.OY;
/* Klassen im Raster: 0 Wasser/außerhalb, 1 Land, 2 Straße, 3 Bürgersteig, 4 Park, 5 Gebäude */
function mpAt(X,Z){const ix=Math.floor(mux(X)-MP.PLAY.x0),iy=Math.floor(muy(Z)-MP.PLAY.y0);return ix<0||iy<0||ix>=MP.w||iy>=MP.h||!MP.cls?0:MP.cls[iy*MP.w+ix]}
function mpWalk(X,Z){const c=mpAt(X,Z);return c>=1&&c<=4}
function mpIsLand(X,Z){const ix=Math.floor(mux(X)-MP.PLAY.x0),iy=Math.floor(muy(Z)-MP.PLAY.y0);return ix>=0&&iy>=0&&ix<MP.w&&iy<MP.h&&MP.land&&MP.land[iy*MP.w+ix]===1}
/* kleine Geometriehelfer (Karteneinheiten, x/y) */
function mpArea(r){let a=0;for(let i=0,n=r.length;i<n;i++){const p=r[i],q=r[(i+1)%n];a+=p[0]*q[1]-q[0]*p[1]}return a/2}
function mpCentroid(r){let x=0,y=0,a=0;for(let i=0,n=r.length;i<n;i++){const p=r[i],q=r[(i+1)%n],c=p[0]*q[1]-q[0]*p[1];a+=c;x+=(p[0]+q[0])*c;y+=(p[1]+q[1])*c}a/=2;return a?[x/(6*a),y/(6*a)]:[r[0][0],r[0][1]]}
function mpInPoly(r,x,y){let c=false;for(let i=0,j=r.length-1;i<r.length;j=i++){const a=r[i],b=r[j];if((a[1]>y)!==(b[1]>y)&&x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0])c=!c}return c}
function mpObb(r){let best=null;for(let a=0;a<90;a+=2){const c=Math.cos(a*Math.PI/180),s=Math.sin(a*Math.PI/180);let x0=1e9,x1=-1e9,y0=1e9,y1=-1e9;
  for(const p of r){const u=p[0]*c+p[1]*s,v=-p[0]*s+p[1]*c;if(u<x0)x0=u;if(u>x1)x1=u;if(v<y0)y0=v;if(v>y1)y1=v}
  const ar=(x1-x0)*(y1-y0);if(!best||ar<best.ar){const uc=(x0+x1)/2,vc=(y0+y1)/2;best={ar,a:a*Math.PI/180,cx:uc*c-vc*s,cy:uc*s+vc*c,w:x1-x0,h:y1-y0}}}return best}
/* nächster Punkt auf den Straßen (Karteneinheiten) */
function mpNearRoad(ux,uy){let best=null;for(const r of MAPD.roads){const w=Math.max(r.w,MP.RW);for(let i=0;i<r.pts.length-1;i++){const a=r.pts[i],b=r.pts[i+1],dx=b[0]-a[0],dy=b[1]-a[1],L2=dx*dx+dy*dy||1e-9;let t=((ux-a[0])*dx+(uy-a[1])*dy)/L2;t=Math.max(0,Math.min(1,t));const px=a[0]+dx*t,py=a[1]+dy*t,d=Math.hypot(ux-px,uy-py);if(!best||d<best.d)best={d,x:px,y:py,w,tx:dx/Math.sqrt(L2),ty:dy/Math.sqrt(L2)}}}return best}
/* Platz für ein rundes Gebäude (Radius Rm in Metern) suchen: auf Land, nicht in Häusern, mit Abstand zu Straße und Bordstein */
function mpFitClear(ux,uy,Rm,maxU){const segD=(x,y)=>{let d=1e9;MAPD.rail.forEach(r=>{if(r.dash)return;for(let i=0;i<r.pts.length-1;i++){const A=r.pts[i],B=r.pts[i+1],dx=B[0]-A[0],dy=B[1]-A[1],L2=dx*dx+dy*dy||1e-9;let t=((x-A[0])*dx+(y-A[1])*dy)/L2;t=Math.max(0,Math.min(1,t));d=Math.min(d,Math.hypot(x-A[0]-dx*t,y-A[1]-dy*t))}});return d*MP.SC};
  const ptsOk=(x,y)=>{if(segD(x,y)<Rm+4)return false;const n=mpNearRoad(x,y);if(n&&n.d*MP.SC<Math.max(n.w,MP.RW)*MP.SC/2+MP.SWK+Rm+.4)return false;
  for(let a=0;a<9;a++){const px=a?x+Math.cos(a/8*6.283)*Rm/MP.SC:x,py=a?y+Math.sin(a/8*6.283)*Rm/MP.SC:y;if(!MAPD.land.some(l=>mpInPoly(l.c[0],px,py)))return false;if(MAPD.buildings.some(b=>mpInPoly(b.c[0],px,py)))return false;if([MAPD.courts,MAPD.parks,MAPD.lots,MAPD.water].some(L=>(L||[]).some(it=>it.c&&mpInPoly(it.c[0],px,py))))return false}return true};
  for(let d=0;d<=(maxU||60);d+=3)for(let a=0;a<(d?16:1);a++){const x=ux+Math.cos(a/16*6.283)*d,y=uy+Math.sin(a/16*6.283)*d;if(ptsOk(x,y))return [x,y]}return null}
/* ---------- Pacific-Sim-Wahrzeichen: Retro-Autos in Pastell und aufblasbare rosa Kaiju-Statuen ---------- */
const MPCARCOL=['#f6a6c8','#f7de78','#a8d4ee','#a9e6d2','#f6c3a8','#e7b8e8'];
function mpRetroCar(kind,col){const g=new THREE.Group(),body=MT(col),cream=MT('#fdf6e8'),glass=MT('#355a74'),tire=MT('#1b1b22'),chrome=MT('#e8e8ee'),lamp=MT('#fff0b0','#fff0b0',.7);
  const P=(geo,mat,x,y,z,sx,sy,sz)=>{const o=new THREE.Mesh(geo,mat);o.position.set(x,y,z);o.scale.set(sx,sy,sz);o.castShadow=true;o.receiveShadow=true;g.add(o);return o},SPH=new THREE.SphereGeometry(1,9,6);
  const wheel=(x,z)=>{const t=new THREE.Mesh(new THREE.CylinderGeometry(.4,.4,.3,9),tire);t.rotation.z=Math.PI/2;t.position.set(x,.4,z);t.castShadow=true;g.add(t);const h=new THREE.Mesh(new THREE.CylinderGeometry(.22,.22,.32,6),chrome);h.rotation.z=Math.PI/2;h.position.set(x+(x>0?.03:-.03),.4,z);g.add(h)};
  if(kind===0){/* Karmann Ghia: flach, rund, zweifarbiges Dach */
    P(SPH,body,0,.85,0,.95,.62,2.2);P(SPH,body,0,.8,1.25,.9,.45,1.0);P(SPH,cream,0,1.35,-.15,.78,.42,1.05);P(SPH,glass,0,1.3,-.1,.8,.3,.95);
    [-1,1].forEach(s=>{P(SPH,lamp,s*.62,.95,2.05,.2,.2,.14);P(BX,chrome,s*.55,.42,2.25,.5,.1,.12);P(SPH,body,s*.88,.7,1.6,.28,.4,.8)});P(BX,chrome,0,.45,-2.2,1.5,.1,.12)}
  else{/* VW-Bus: Kasten, Weiß oben, runde Scheinwerfer, V-Nase */
    P(BX,body,0,1.0,0,1.9,1.1,4.2);P(BX,cream,0,1.85,0,1.92,.85,4.22);P(BX,glass,0,1.85,0,1.94,.45,3.6);P(BX,cream,0,2.32,0,1.8,.14,4.0);P(BX,body,0,1.0,2.12,1.0,1.0,.16);
    [-1,1].forEach(s=>{P(SPH,lamp,s*.6,1.1,2.22,.2,.2,.1)});P(BX,chrome,0,.55,2.2,1.9,.12,.12);P(BX,chrome,0,.55,-2.15,1.9,.12,.12)}
  [[-.95,1.3],[.95,1.3],[-.95,-1.3],[.95,-1.3]].forEach(([x,z])=>wheel(x,z));return g}
function mpKaiju(col){const g=new THREE.Group(),m=new THREE.MeshStandardMaterial({color:col,roughness:.35,flatShading:false}),belly=new THREE.MeshStandardMaterial({color:'#ffd6e8',roughness:.4}),yel=new THREE.MeshStandardMaterial({color:'#ffd04a',roughness:.4}),dark=new THREE.MeshStandardMaterial({color:'#2a1020',roughness:.6}),white=new THREE.MeshStandardMaterial({color:'#ffffff',roughness:.4}),SPH=new THREE.SphereGeometry(1,16,11);
  const P=(geo,mat,x,y,z,sx,sy,sz)=>{const o=new THREE.Mesh(geo,mat);o.position.set(x,y,z);o.scale.set(sx,sy,sz);o.castShadow=true;g.add(o);return o};
  P(SPH,m,0,4.6,0,3.5,4.0,3.1);P(SPH,belly,0,4.4,2.1,2.5,3.0,1.2);
  P(SPH,m,0,9.4,1.4,2.7,2.3,2.4);P(SPH,m,0,8.7,3.3,1.7,1.1,1.5);
  [-1,1].forEach(s=>{P(SPH,white,s*1.25,10.4,3.0,.6,.6,.35);P(SPH,dark,s*1.25,10.4,3.3,.26,.26,.2);P(SPH,m,s*3.4,6.0,1.0,.9,1.9,.9);P(SPH,yel,s*4.0,4.3,2.3,1.15,1.15,1.15);P(SPH,m,s*1.8,1.6,.2,1.4,1.7,1.5);P(SPH,m,s*1.8,.5,1.4,1.5,.6,2.0);P(SPH,m,s*1.4,11.4,.4,.4,.5,.4)});
  P(SPH,dark,0,8.45,4.2,1.35,.32,.7);for(let i=-3;i<=3;i++){const t=new THREE.Mesh(new THREE.ConeGeometry(.2,.5,5),white);t.position.set(i*.36,8.75,4.45);t.rotation.x=Math.PI;g.add(t)}
  for(let i=0;i<6;i++){const sp=new THREE.Mesh(new THREE.ConeGeometry(.55-i*.04,1.3,6),yel);sp.position.set(0,11.2-i*1.35,.2-i*.75);sp.rotation.x=-.5-i*.12;sp.castShadow=true;g.add(sp)}
  for(let i=0;i<4;i++)P(SPH,m,0,3.4-i*.5,-3.6-i*1.9,1.7-i*.32,1.5-i*.28,2.0);
  return g}
function mpDressUp(add){const R=mulberry(2468);
  /* Autos: auf dem Parkplatz in Reihen und am Straßenrand der breiten Promenade */
  const car=(x,z,ry,k,col)=>{const c=mpRetroCar(k,col);c.position.set(x,1.3,z);c.rotation.y=ry;add(c);addOutlines(c,'prop');const fx=Math.sin(ry),fz=Math.cos(ry);[-1.4,0,1.4].forEach(d=>mpMarkDisc(x+fx*d,z+fz*d,1.15));HUB.cars=(HUB.cars||[]).concat([{x,z}])};
  HUB.cars=[];let n=0;
  MAPD.lots.forEach(l=>{const ring=l.c[0],o=mpObb(ring),cu=Math.cos(o.a),su=Math.sin(o.a),ux=cu,uy=su,vx=-su,vy=cu;
    for(let u=-o.w/2+7;u<o.w/2-5;u+=6.2)for(let v=-o.h/2+9;v<o.h/2-6;v+=12){const x=o.cx+ux*u+vx*v,y=o.cy+uy*u+vy*v;if(!mpInPoly(ring,x,y)||!mpInPoly(ring,x+vx*6,y+vy*6)||!mpInPoly(ring,x-vx*6,y-vy*6)||R()<.4)continue;
      const X=mwx(x),Z=mwz(y);if(Z>186||mpAt(X,Z)===5)continue;car(X,Z,Math.atan2(vx,vy)+(R()<.5?0:Math.PI),n%3===2?1:0,MPCARCOL[Math.floor(R()*MPCARCOL.length)]);n++}});
  MAPD.roads.forEach(r=>{if(r.w<14)return;const wM=Math.max(r.w,MP.RW)*MP.SC;let side=1,last=-99;mpResample(r.pts,16).forEach((s,si)=>{if(!(s.tx||s.tz)||si-last<2)return;side=-side;
    const off=wM/2-1.25,x=s.x-s.tz*side*off,z=s.z+s.tx*side*off;if(mpAt(x,z)!==2||Z0(z))return;
    const ok=[-2.4,0,2.4].every(d=>mpAt(x+s.tx*d,z+s.tz*d)===2&&mpAt(x+s.tx*d-s.tz*side*2.1,z+s.tz*d+s.tx*side*2.1)===3);
    if(!ok||(HUB.doors||[]).some(d=>Math.hypot(d[0]-x,d[1]-z)<7)||(HUB.cars||[]).some(c=>Math.hypot(c.x-x,c.z-z)<14))return;
    if(mpRailDist(x,z)<3)return;last=si;car(x,z,Math.atan2(s.tx,s.tz),R()<.3?1:0,MPCARCOL[Math.floor(R()*MPCARCOL.length)])})});
  /* Kaiju-Statuen als Wahrzeichen: Strand, Park, Platz am Resort */
  const spots=[[1722,1500],[0,0],[2200,1330]],big=MAPD.parks.slice().sort((a,b)=>Math.abs(mpArea(b.c[0]))-Math.abs(mpArea(a.c[0])))[0];if(big){const c=mpCentroid(big.c[0]);spots[1]=[c[0],c[1]]}
  HUB.kaiju=[];spots.forEach((p,i)=>{let f=null;for(const rr of [7,6,5]){f=mpFindFree(p[0],p[1],rr,90,false);if(f&&mpRailDist(f[0],f[1])>=10)break;f=null}if(!f)return;const k=mpKaiju(['#f4a6c8','#f7a0b8','#f2b0d0'][i%3]);k.position.set(f[0],1.3,f[1]);k.rotation.y=Math.atan2(HUB.sx-f[0],HUB.sz-f[1])+(i-1)*.5;k.scale.setScalar(1.15);add(k);addOutlines(k,'prop');mpMarkDisc(f[0],f[1],4.6);HUB.kaiju.push({x:f[0],z:f[1]})})}
function Z0(z){return z>186}
function mpFrontYaw(ux,uy){const n=mpNearRoad(ux,uy);return n?Math.atan2(-(n.x-ux),-(n.y-uy)):0}
/* Punkt vor einem Gebäude: von der Mitte Richtung Straße, bis er begehbar ist */
function mpFront(ux,uy,distM){const n=mpNearRoad(ux,uy);if(!n)return [mwx(ux),mwz(uy)];const L=Math.hypot(n.x-ux,n.y-uy)||1,dx=(n.x-ux)/L,dy=(n.y-uy)/L;
  for(let k=0;k<30;k++){const d=(distM+k*.5)/MP.SC,X=mwx(ux+dx*d),Z=mwz(uy+dy*d);if(mpWalk(X,Z)&&mpAt(X,Z)!==2)return [X,Z]}return [mwx(ux+dx*distM/MP.SC),mwz(uy+dy*distM/MP.SC)]}

/* ---------- Kollisionsraster aus den Kartendaten ---------- */
function mpBuildMask(solids){
  const P=MP.PLAY,w=P.x1-P.x0,h=P.y1-P.y0;MP.w=w;MP.h=h;
  const mk=()=>{const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d',{willReadFrequently:true});x.translate(-P.x0,-P.y0);x.fillStyle='#fff';x.strokeStyle='#fff';x.lineJoin='round';x.lineCap='butt';return x};
  const ring=(x,c)=>{c.forEach(r=>{r.forEach((p,i)=>i?x.lineTo(p[0],p[1]):x.moveTo(p[0],p[1]));x.closePath()})};
  const fillItems=(x,list)=>list.forEach(it=>{x.beginPath();ring(x,it.c);x.fill('evenodd')});
  const strokeRoads=(x,add)=>MAPD.roads.forEach(r=>{x.lineWidth=Math.max(r.w,MP.RW)+add;x.beginPath();r.pts.forEach((p,i)=>i?x.lineTo(p[0],p[1]):x.moveTo(p[0],p[1]));x.stroke()});
  const L=mk(),Wf=mk(),R=mk(),S=mk(),Pk=mk(),B=mk();
  fillItems(L,MAPD.land);fillItems(Wf,MAPD.water);fillItems(Pk,MAPD.parks);
  MAPD.buildings.forEach(b=>{if(!b.skip){B.beginPath();ring(B,b.c);B.fill('evenodd')}});
  (solids||[]).forEach(s=>{B.save();B.translate(s.x,s.y);B.rotate(s.a);if(s.r){B.beginPath();B.arc(0,0,s.r,0,7);B.fill()}else B.fillRect(-s.w/2,-s.h/2,s.w,s.h);B.restore()});
  strokeRoads(R,0);
  S.beginPath();MAPD.land.forEach(it=>ring(S,it.c));S.save();S.clip('evenodd');strokeRoads(S,2*MP.SWK/MP.SC);S.restore();
  const rd=g=>g.getImageData(0,0,w,h).data;
  const dL=rd(L),dW=rd(Wf),dR=rd(R),dS=rd(S),dP=rd(Pk),dB=rd(B),cls=new Uint8Array(w*h),land=new Uint8Array(w*h);
  for(let i=0;i<w*h;i++){const a=i*4+3;let c=0;if(dL[a]>127)c=1;land[i]=c&&!(dW[a]>127)?1:0;if(dP[a]>127&&c)c=4;if(dS[a]>127&&c)c=3;if(dW[a]>127)c=0;if(dB[a]>127)c=5;if(dR[a]>127)c=2;cls[i]=c}
  MP.cls=cls;MP.land=land}

/* ---------- Gelände: Meer, Land, Straßen, Bürgersteige, Parks ---------- */
const MPM={};function mpMat(k,c,o){return MPM[k]||(MPM[k]=new THREE.MeshStandardMaterial({color:c,roughness:.9,flatShading:true,...(o||{})}))}
function mpShape(c){const pt=r=>r.map(p=>new THREE.Vector2(mwx(p[0]),-mwz(p[1])));const sh=new THREE.Shape(pt(c[0]));for(let i=1;i<c.length;i++)sh.holes.push(new THREE.Path(pt(c[i])));return sh}
function mpFlat(items,y,mat,add){const g=new THREE.Group();items.forEach(it=>{const geo=new THREE.ShapeGeometry(mpShape(it.c));geo.rotateX(-Math.PI/2);const m=new THREE.Mesh(geo,mat);m.position.y=y;m.receiveShadow=true;m.userData.noBake=true;m.userData.noOutline=true;add(m)})}
function mpRibbon(pts,wM,y){const n=pts.length,pos=[],idx=[];
  for(let i=0;i<n;i++){const a=pts[Math.max(0,i-1)],b=pts[i],c=pts[Math.min(n-1,i+1)];let tx=c[0]-a[0],tz=c[1]-a[1];const L=Math.hypot(tx,tz)||1;tx/=L;tz/=L;const nx=-tz,nz=tx;
    pos.push(b[0]+nx*wM/2,y,b[1]+nz*wM/2,b[0]-nx*wM/2,y,b[1]-nz*wM/2);if(i<n-1){const k=i*2;idx.push(k,k+2,k+1,k+1,k+2,k+3)}}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();return g}
/* Polylinie in Weltmetern, gleichmäßig neu abgetastet */
function mpResample(pts,step){const out=[],P=pts.map(p=>[mwx(p[0]),mwz(p[1])]);let carry=0;out.push({x:P[0][0],z:P[0][1],tx:0,tz:0});
  for(let i=0;i<P.length-1;i++){const a=P[i],b=P[i+1],dx=b[0]-a[0],dz=b[1]-a[1],L=Math.hypot(dx,dz)||1e-9;let d=step-carry;while(d<=L){out.push({x:a[0]+dx*d/L,z:a[1]+dz*d/L,tx:dx/L,tz:dz/L});d+=step}carry=L-(d-step)}
  if(out.length>1)out[0].tx=out[1].tx,out[0].tz=out[1].tz;return out}
function mpInstanced(geo,mat,items,fn){const im=new THREE.InstancedMesh(geo,mat,Math.max(1,items.length)),m4=new THREE.Matrix4(),q=new THREE.Quaternion(),e=new THREE.Euler(),s=new THREE.Vector3(),p=new THREE.Vector3();
  items.forEach((it,k)=>{const r=fn(it);q.setFromEuler(e.set(0,r.ry||0,r.rz||0,'YZX'));s.set(r.sx,r.sy,r.sz);p.set(r.x,r.y,r.z);m4.compose(p,q,s);im.setMatrixAt(k,m4)});im.count=items.length;im.instanceMatrix.needsUpdate=true;im.castShadow=!!mat.userData&&false;im.receiveShadow=true;im.frustumCulled=false;im.userData.noBake=true;im.userData.noOutline=true;return im}
function mpSeaMat(){const W=MP.w,H=MP.h,d=new Float32Array(W*H),INF=1e4;for(let i=0;i<W*H;i++)d[i]=MP.land[i]===1?0:INF;
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=y*W+x;let v=d[i];if(x>0)v=Math.min(v,d[i-1]+1);if(y>0){v=Math.min(v,d[i-W]+1);if(x>0)v=Math.min(v,d[i-W-1]+1.414);if(x<W-1)v=Math.min(v,d[i-W+1]+1.414)}d[i]=v}
  for(let y=H-1;y>=0;y--)for(let x=W-1;x>=0;x--){const i=y*W+x;let v=d[i];if(x<W-1)v=Math.min(v,d[i+1]+1);if(y<H-1){v=Math.min(v,d[i+W]+1);if(x<W-1)v=Math.min(v,d[i+W+1]+1.414);if(x>0)v=Math.min(v,d[i+W-1]+1.414)}d[i]=v}
  const by=new Uint8Array(W*H);for(let i=0;i<W*H;i++)by[i]=Math.min(255,Math.round(d[i]*255/80));
  const tex=new THREE.DataTexture(by,W,H,THREE.RedFormat,THREE.UnsignedByteType);tex.minFilter=tex.magFilter=THREE.LinearFilter;tex.wrapS=tex.wrapT=THREE.ClampToEdgeWrapping;tex.needsUpdate=true;
  const mat=new THREE.ShaderMaterial({fog:true,transparent:false,
   uniforms:THREE.UniformsUtils.merge([THREE.UniformsLib.fog,{tD:{value:tex},t:{value:0},dim:{value:1},geo:{value:new THREE.Vector4(MP.PLAY.x0,MP.PLAY.y0,W,H)},org:{value:new THREE.Vector3(MP.OX,MP.OY,MP.SC)},
    shallow:{value:new THREE.Color('#5fe0d6')},deep:{value:new THREE.Color('#1d8fc4')}}]),
   vertexShader:'varying vec3 vW;\n#include <fog_pars_vertex>\nvoid main(){vec4 wp=modelMatrix*vec4(position,1.);vW=wp.xyz;vec4 mvPosition=viewMatrix*wp;gl_Position=projectionMatrix*mvPosition;\n#include <fog_vertex>\n}',
   fragmentShader:`uniform sampler2D tD;uniform float t;uniform float dim;uniform vec4 geo;uniform vec3 org;uniform vec3 shallow;uniform vec3 deep;varying vec3 vW;
#include <fog_pars_fragment>
float hs(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
void main(){vec2 m=vec2(vW.x/org.z+org.x-geo.x,vW.z/org.z+org.y-geo.y)/geo.zw;float dm=40.;if(m.x>0.&&m.y>0.&&m.x<1.&&m.y<1.)dm=texture2D(tD,m).r*80.*org.z;
 vec3 c=mix(shallow,deep,smoothstep(1.2,26.,dm));
 float foam=(1.-smoothstep(0.,1.3,dm))*(.65+.35*sin(t*1.3+vW.x*.2+vW.z*.15));
 float line=smoothstep(.4,0.,abs(dm-(3.2+sin(t*.8+vW.x*.05)*.9)))*.4*(1.-smoothstep(5.,9.,dm));
 float sp=step(.988,hs(floor(vW.xz*1.3+vec2(t*.7,t*.4))))*(.5+.5*sin(t*3.+vW.x))*.7;
 c=mix(c,vec3(1.),clamp(foam+line,0.,1.));c+=sp*dim;c*=.22+.78*dim;
 gl_FragColor=vec4(c,1.);
#include <colorspace_fragment>
#include <fog_fragment>
}`});DAY.sea=mat;return mat}
function mpTerrain(add){
  /* Meer: türkis nahe am Strand, tiefblau draußen, mit Schaumkante, Wellenlinie und Glitzern (Abstand zur Küste aus der Maske) */
  {const m=new THREE.Mesh(new THREE.PlaneGeometry(7000,7000),mpSeaMat());m.rotation.x=-Math.PI/2;m.position.set(0,1.0,0);m.userData.noBake=true;m.userData.noOutline=true;add(m)}
  /* Land (angehoben, mit sichtbarer Kante) */
  MAPD.land.forEach(it=>{const geo=new THREE.ExtrudeGeometry(mpShape(it.c),{depth:.7,bevelEnabled:false});geo.rotateX(-Math.PI/2);const m=new THREE.Mesh(geo,mpMat('land','#f1e5c0'));m.position.y=.6;m.receiveShadow=true;m.userData.noBake=true;add(m)});
  mpFlat(MAPD.parks,1.31,mpMat('park','#4fa874'),add);mpFlat(MAPD.lots,1.31,mpMat('lot','#8d93a0'),add);mpFlat(MAPD.courts,1.315,mpMat('court','#c98a4a'),add);
  mpFlat(MAPD.water,1.34,new THREE.MeshStandardMaterial({color:'#1cafd1',roughness:.3,metalness:.1}),add);
  /* Straßen */
  const asphalt=mpMat('road','#7a7790'),dash=[],sw=[],bridge=[],pier=[];
  MAPD.roads.forEach(r=>{const wU=Math.max(r.w,MP.RW),wM=wU*MP.SC,pts=r.pts.map(p=>[mwx(p[0]),mwz(p[1])]);
    const m=new THREE.Mesh(mpRibbon(pts,wM,1.32),asphalt);m.receiveShadow=true;m.userData.noBake=true;m.userData.noOutline=true;add(m);
    const rs=mpResample(r.pts,2.6);
    /* Bordsteine: kurze, mit der Straße gedrehte Stücke (1 m); fällt weg, wenn es in Straße, Haus oder Wasser ragen würde */
    mpResample(r.pts,.9).forEach(s=>{if(!(s.tx||s.tz))return;for(const side of [1,-1]){const off=wM/2+MP.SWK/2,x=s.x-s.tz*side*off,z=s.z+s.tx*side*off;if(mpAt(x,z)!==3)continue;let good=true;
      for(const a of [-.5,0,.5])for(const o of [-.8,0,.8]){const c=mpAt(x+s.tx*a-s.tz*o,z+s.tz*a+s.tx*o);if(c===2||c===0){good=false;break}}
      if(good)sw.push({x,z,ry:-Math.atan2(s.tz,s.tx),len:1.25})}});
    rs.forEach(s=>{if(!mpIsLand(s.x,s.z)){bridge.push({x:s.x,z:s.z,ry:-Math.atan2(s.tz,s.tx),w:wM})}});
    if(r.w>=14){const ds=mpResample(r.pts,7);ds.forEach(s=>{if(mpAt(s.x,s.z)===2&&(s.tx||s.tz))dash.push({x:s.x,z:s.z,ry:-Math.atan2(s.tz,s.tx)})})}
    const ps=mpResample(r.pts,24);ps.forEach(s=>{if(!mpIsLand(s.x,s.z))pier.push({x:s.x,z:s.z})})});
  add(mpInstanced(BX,mpMat('sw','#f0e4d6'),sw,s=>({x:s.x,y:1.45,z:s.z,ry:s.ry,sx:s.len||3.1,sy:.3,sz:MP.SWK})));
  add(mpInstanced(BX,new THREE.MeshStandardMaterial({color:'#fff0b0',emissive:'#fff0b0',emissiveIntensity:.5}),dash,s=>({x:s.x,y:1.34,z:s.z,ry:s.ry,sx:2.6,sy:.04,sz:.35})));
  /* Brücken: Fahrbahnplatte, Pfeiler, Geländer */
  add(mpInstanced(BX,mpMat('deck','#6a5a9a'),bridge,s=>({x:s.x,y:1.0,z:s.z,ry:s.ry,sx:3.0,sy:.7,sz:s.w+.3})));
  const rails=[];bridge.forEach(s=>{for(const side of [1,-1])rails.push({x:s.x-Math.sin(-s.ry)*0,z:s.z,ry:s.ry,w:s.w,side,bx:s.x,bz:s.z})});
  add(mpInstanced(BX,mpMat('rail','#ee7cb8'),bridge.flatMap(s=>[1,-1].map(side=>({x:s.x+Math.sin(s.ry)*side*(s.w/2+.1),z:s.z+Math.cos(s.ry)*side*(s.w/2+.1),ry:s.ry}))),s=>({x:s.x,y:1.75,z:s.z,ry:s.ry,sx:3.1,sy:.9,sz:.3})));
  add(mpInstanced(CY,mpMat('pier','#8a7fb0'),pier,s=>({x:s.x,y:.2,z:s.z,sx:1.4,sy:2.2,sz:1.4})));
  return {sidewalkPieces:sw.length,bridgePieces:bridge.length}}

/* ---------- Gebäude ---------- */
const MPPAST=['#f1a7c8','#a9e6d2','#f6df73','#a9d8f0','#f6c3a8','#e7b8e8','#c9f0b8'];
function mpStamp(H,fn,X,Z,yaw,bg,scale){const real=W0,tg=new THREE.Group();W0=tg;H.setCur(0,0);try{fn()}finally{W0=real}
  tg.scale.setScalar(scale||1);tg.rotation.y=yaw;tg.position.set(X,-.3,Z);tg.updateMatrixWorld(true);[...tg.children].forEach(ch=>bg.attach(ch));return tg}
const mpTf=(X,Z,yaw,lx,lz)=>[X+lx*Math.cos(yaw)+lz*Math.sin(yaw),Z-lx*Math.sin(yaw)+lz*Math.cos(yaw)];
/* ---------- Haus-Looks: Painted Lady (kleine/mittlere Häuser) und Art déco (große) ---------- */
const MPDSM=new Map();/* beidseitig gezeichnete Variante eines Materials (Gebäude mit verdrehter Außenhaut wären sonst von außen schwarz oder unsichtbar) */
function mpDS(m){let d=MPDSM.get(m);if(!d){d=m.clone();d.side=THREE.DoubleSide;MPDSM.set(m,d)}return d}
const MPROOFM={};function mpRoofMat(c){return MPROOFM[c]||(MPROOFM[c]=new THREE.MeshStandardMaterial({color:c,roughness:.8,flatShading:true,side:THREE.DoubleSide}))}
function mpTris(bg,mat,tris){const pos=[];tris.forEach(t=>t.forEach(v=>pos.push(v[0],v[1],v[2])));const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.computeVertexNormals();const m=new THREE.Mesh(g,mat);m.castShadow=true;m.receiveShadow=true;bg.add(m);return m}
function mpGableRoof(bg,ring,front,y0,idx,trimCol){if(ring.length!==4)return false;const c=[0,1].map(i=>ring.reduce((a,p)=>a+p[i],0)/4);
  let fe=0,bd=1e9;for(let e=0;e<4;e++){const a=ring[e],d=ring[(e+1)%4],mx=(a[0]+d[0])/2,mz=(a[1]+d[1])/2,dd=Math.hypot(mx-front.mx,mz-front.mz);if(dd<bd){bd=dd;fe=e}}
  const out=p=>{const dx=p[0]-c[0],dz=p[1]-c[1],L=Math.hypot(dx,dz)||1;return [c[0]+dx*(1+.55/L),c[1]+dz*(1+.55/L)]};
  const A=out(ring[fe]),B=out(ring[(fe+1)%4]),C=out(ring[(fe+2)%4]),D=out(ring[(fe+3)%4]);
  const wdt=Math.hypot(A[0]-B[0],A[1]-B[1]),rh=Math.max(1.6,Math.min(4.8,wdt*.42)),Mf=[(A[0]+B[0])/2,(A[1]+B[1])/2],Mb=[(C[0]+D[0])/2,(C[1]+D[1])/2],y1=y0+rh;
  const V=(p,y)=>[p[0],y,p[1]],cols=['#b0687e','#7c8fb8','#a07860','#8fa07a'],rm=mpRoofMat(cols[idx%cols.length]);
  mpTris(bg,rm,[[V(B,y0),V(C,y0),V(Mb,y1)],[V(B,y0),V(Mb,y1),V(Mf,y1)],[V(D,y0),V(A,y0),V(Mf,y1)],[V(D,y0),V(Mf,y1),V(Mb,y1)]]);
  const o=front.nx*.06,p2=front.nz*.06,tm=mpRoofMat(trimCol);
  const Ai=[ring[fe][0],ring[fe][1]],Bi=[ring[(fe+1)%4][0],ring[(fe+1)%4][1]];
  mpTris(bg,tm,[[[Ai[0]+o,y0,Ai[1]+p2],[Bi[0]+o,y0,Bi[1]+p2],[Mf[0]+o,y1-.1,Mf[1]+p2]]]);
  const wc=new THREE.Mesh(new THREE.CircleGeometry(Math.min(.75,rh*.22),12),new THREE.MeshStandardMaterial({color:'#7fb8d8',emissive:'#7fb8d8',emissiveIntensity:.25}));wc.position.set(Mf[0]+front.nx*.1,y0+rh*.38,Mf[1]+front.nz*.1);wc.rotation.y=Math.atan2(front.nx,front.nz);bg.add(wc);return true}
function mpTurret(bg,ring,y0,idx,col){let best=0,bd=-1;const c=[0,1].map(i=>ring.reduce((a,p)=>a+p[i],0)/ring.length);ring.forEach((p,i)=>{const d=Math.hypot(p[0]-c[0],p[1]-c[1]);if(d>bd){bd=d;best=i}});
  const p=ring[best],dx=c[0]-p[0],dz=c[1]-p[1],L=Math.hypot(dx,dz)||1,x=p[0]+dx/L*1.6,z=p[1]+dz/L*1.6;
  const tw=new THREE.Mesh(new THREE.CylinderGeometry(1.5,1.5,3.2,8),MT(col));tw.position.set(x,y0+1.6,z);tw.castShadow=true;bg.add(tw);
  const cp=new THREE.Mesh(new THREE.ConeGeometry(2.0,3.0,8),mpRoofMat(['#b0687e','#7c8fb8','#a07860'][idx%3]));cp.position.set(x,y0+3.2+1.5,z);cp.castShadow=true;bg.add(cp)}
function mpBay(bg,front,wallCol,y0,h,idx){const L=front.L;if(L<7||h<5.5)return;const ux=-front.nz,uz=front.nx,off=L*.27*(idx%2?1:-1),bw=Math.min(3.4,L*.34),bh=Math.min(6.2,h-1.2),px=front.mx+ux*off+front.nx*.5,pz=front.mz+uz*off+front.nz*.5,ry=-Math.atan2(uz,ux);
  const bx=new THREE.Mesh(BX,MT(wallCol));bx.scale.set(bw,bh,1.0);bx.position.set(px,y0+bh/2,pz);bx.rotation.y=ry;bx.castShadow=true;bg.add(bx);
  const cap=new THREE.Mesh(new THREE.ConeGeometry(bw*.78,1.4,4),mpRoofMat('#f6efe6'));cap.position.set(px,y0+bh+.7,pz);cap.rotation.y=ry+Math.PI/4;cap.castShadow=true;bg.add(cap);
  const GL=MT('#7fb8d8','#7fb8d8',.25);for(let f=0;f<Math.floor(bh/3.1);f++)for(let k=-1;k<=1;k++){const w=new THREE.Mesh(BX,GL);w.scale.set(.75,1.6,.1);w.position.set(px+front.nx*.53+ux*k*.95,y0+1.9+f*3.1,pz+front.nz*.53+uz*k*.95);w.rotation.y=ry;bg.add(w)}}
function mpDecoCrown(bg,b,ring,h,idx){if(b.c.length>1)return;const c=[0,1].map(i=>ring.reduce((a,p)=>a+p[i],0)/ring.length);
  const ex=(sc,depth,mat,y)=>{const pts=ring.map(p=>new THREE.Vector2(c[0]+(p[0]-c[0])*sc,-(c[1]+(p[1]-c[1])*sc))),g=new THREE.ExtrudeGeometry(new THREE.Shape(pts),{depth,bevelEnabled:false});g.rotateX(-Math.PI/2);const m=new THREE.Mesh(g,mpDS(mat));m.position.y=y;m.castShadow=true;m.receiveShadow=true;bg.add(m)};
  const cream=MT('#fdf6e8'),neon=new THREE.MeshStandardMaterial({color:'#ff7ac0',emissive:'#ff4fa8',emissiveIntensity:.9,roughness:.5}),top=1.3+h+.55;
  ex(.84,2.4,cream,top);ex(.62,2.2,MT('#f7de78'),top+2.4);ex(.4,1.8,cream,top+4.6);ex(1.02,.32,neon,top-.2);
  for(let y=1.3+3.3*3;y<1.3+h-1;y+=3.3*3)ex(1.012,.3,cream,y);
  ring.forEach(p=>{const m=new THREE.Mesh(BX,cream);m.scale.set(.9,h+2.6,.9);m.position.set(p[0],1.3+(h+2.6)/2,p[1]);bg.add(m)})}
function mpGenBuilding(bg,b,wall,h,idx,sign){
  const ring=b.c[0].map(p=>[mwx(p[0]),mwz(p[1])]),vp=r=>r.map(p=>new THREE.Vector2(p[0],-p[1]));
  const sh=new THREE.Shape(vp(ring));b.c.slice(1).forEach(c=>sh.holes.push(new THREE.Path(vp(c.map(p=>[mwx(p[0]),mwz(p[1])])))));
  const mk=(depth,mat,y)=>{const g=new THREE.ExtrudeGeometry(sh,{depth,bevelEnabled:false});g.rotateX(-Math.PI/2);const m=new THREE.Mesh(g,mpDS(mat));m.position.y=y;m.castShadow=true;m.receiveShadow=true;bg.add(m);return m};
  mk(h,MT(wall),1.3);mk(.55,MT('#f6efe6'),1.3+h);
  const GL=MT('#5a8fc4','#5a8fc4',.2),LT=MT('#ffe9a0','#ffe9a0',.9),nf=Math.max(1,Math.floor((h-1.4)/3.3)),n=ring.length;
  const rp=mpNearRoad(b.cen[0],b.cen[1]);let sbest=null;
  for(let e=0;e<n;e++){const a=ring[e],c=ring[(e+1)%n],dx=c[0]-a[0],dz=c[1]-a[1],L=Math.hypot(dx,dz);if(L<5)continue;const ux=dx/L,uz=dz/L;let nx=uz,nz=-ux;const mx=(a[0]+c[0])/2,mz=(a[1]+c[1])/2;
    if(mpInPoly(ring,mx+nx*.4,mz+nz*.4)){nx=-nx;nz=-nz}
    if(rp){const d=Math.hypot(mx-mwx(rp.x),mz-mwz(rp.y))-(nx*(mwx(rp.x)-mx)+nz*(mwz(rp.y)-mz))*.3;if(!sbest||d<sbest.d)sbest={d,mx,mz,nx,nz,L}}
    const cnt=Math.floor((L-2)/3.4),step=(L-2)/Math.max(1,cnt);
    for(let f=0;f<nf;f++)for(let k=0;k<cnt;k++){const t=1+step*(k+.5),m=new THREE.Mesh(BX,((f*7+k*3+idx+e)%5<2)?LT:GL);m.scale.set(1.7,1.9,.14);m.position.set(a[0]+ux*t+nx*.07,1.3+1.5+f*3.3+.95,a[1]+uz*t+nz*.07);m.rotation.y=-Math.atan2(uz,ux);bg.add(m)}}
  /* Dachaufbauten */
  const cen=[mwx(b.cen[0]),mwz(b.cen[1])];if(mpInPoly(ring,cen[0],cen[1])){const m=new THREE.Mesh(BX,MT('#b9bdc9'));m.scale.set(3.2,1.1,2.4);m.position.set(cen[0],1.3+h+.55+.55,cen[1]);bg.add(m)}
  if(sign&&sbest){const w=Math.min(12,Math.max(5.5,sbest.L*.7)),sg=new THREE.Mesh(new THREE.PlaneGeometry(w,w*.24),signMat(sign,'#ffe066','#1a1030'));sg.position.set(sbest.mx+sbest.nx*.25,1.3+Math.min(h-1.6,5.8),sbest.mz+sbest.nz*.25);sg.rotation.y=Math.atan2(sbest.nx,sbest.nz);sg.userData.noBake=true;sg.userData.noOutline=true;bg.add(sg)}
  /* Eingang: Tür mit Glas und Vordach an der Fassade zur Straße (Bahnhof und große Gebäude breiter) */
  if(sbest){(HUB.doors=HUB.doors||[]).push([sbest.mx+sbest.nx*1.5,sbest.mz+sbest.nz*1.5])}
  if(sbest&&b.kind==='police'){HUB.policeStation={x:sbest.mx+sbest.nx*4,z:sbest.mz+sbest.nz*4};const bc=new THREE.Mesh(BX,MT('#2a6aff','#2a6aff',.9));bc.scale.set(1.2,.6,2.2);bc.position.set(ring.reduce((a,p)=>a+p[0],0)/ring.length,1.3+h+1.4,ring.reduce((a,p)=>a+p[1],0)/ring.length);bg.add(bc)}
  if(sbest&&b.kind==='station')HUB.station={x:sbest.mx,z:sbest.mz,nx:sbest.nx,nz:sbest.nz};
  if(sbest){const big=/station|casino|shopping|resort|tower/.test(b.kind||''),dw=big?4.6:1.9,ux=-sbest.nz,uz=sbest.nx,ry=-Math.atan2(uz,ux),px=sbest.mx+sbest.nx*.12,pz=sbest.mz+sbest.nz*.12;
    const part=(m,w,hh,d,x,y,z)=>{const o=new THREE.Mesh(BX,m);o.scale.set(w,hh,d);o.position.set(x,y,z);o.rotation.y=ry;o.castShadow=true;bg.add(o);return o};
    part(MT('#2a2038'),dw+.5,2.9,.2,px,1.3+1.45,pz);
    part(MT('#9fe6f0','#9fe6f0',.35),dw-.3,2.5,.24,px+sbest.nx*.03,1.3+1.3,pz+sbest.nz*.03);
    part(MT('#2a2038'),.14,2.5,.28,px+sbest.nx*.05,1.3+1.3,pz+sbest.nz*.05);
    part(MT('#f6efe6'),dw+1.6,.3,1.5,px+sbest.nx*.7,1.3+3.2,pz+sbest.nz*.7)}
  /* Look: kleine und mittlere Häuser = Painted Lady (Giebel zur Straße, Erker, Rahmen, Stufen), große und besondere = Art déco (Krone, Neonband, Zierleisten) */
  {const aM=b.area*MP.SC*MP.SC,special=/station|casino|shopping|resort|tower/.test(b.kind||''),house=!special&&aM<650;
   if(house&&sbest){const y0=1.3+h+.55,trim='#fdf6e8';
     if(!mpGableRoof(bg,ring,sbest,y0,idx,trim))mpTurret(bg,ring,y0,idx,wall);
     mpBay(bg,sbest,wall,1.3,h,idx);
     const ux=-sbest.nz,uz=sbest.nx,ry=-Math.atan2(uz,ux),st=MT('#fdf6e8');[0,1].forEach(i=>{const t=new THREE.Mesh(BX,st);t.scale.set(2.8,.22-i*.08,.55);t.position.set(sbest.mx+sbest.nx*(.35+i*.5),1.3+.11,sbest.mz+sbest.nz*(.35+i*.5));t.rotation.y=ry;bg.add(t)})}
   else if(!house)mpDecoCrown(bg,b,ring,h,idx)}
  return ring}
function mpBuildings(H){
  const solids=[],groups=[];const L0=MAPD.labels;
  const kindOf=t=>/Poli(zei|ce)/i.test(t)?'police':/P-Mart/.test(t)?'pmart':/Station/.test(t)?'station':/^Lab$/.test(t)?'lab':/X-Mas/.test(t)?'xmas':/Resort/.test(t)?'resort':/Casino/.test(t)?'casino':/Shopping/.test(t)?'shopping':/Tower/.test(t)?'tower':'';
  MAPD.buildings.forEach((b,i)=>{b.i=i;b.kind='';b.skip=false;b.cen=mpCentroid(b.c[0]);b.area=Math.abs(mpArea(b.c[0]))});
  L0.forEach(l=>{const k=kindOf(l.t);if(!k)return;MAPD.buildings.forEach(b=>{if(mpInPoly(b.c[0],l.x,l.y)){b.kind=k;b.label=l.t}})});
  const SIGN={police:'POLIZEI',station:'PORT LUPO STATION',casino:'MARINA CLUB CASINO',shopping:'SHOPPING COURT',resort:'BEACH RESORT',tower:'OFFICE TOWER'};
  const WALL={police:'#9db8e8',station:'#f6efe6',casino:'#ff5fa8',shopping:'#f6df73',resort:'#fff0d8',tower:'#2a3a6a'};
  const mkGroup=(x,z)=>{const bg=new THREE.Group();bg.userData.noBake=true;bg.userData.blk={x,z};W0.add(bg);HUB.bgroups.push(bg);return bg};
  MAPD.buildings.forEach(b=>{const aM=b.area*MP.SC*MP.SC,X=mwx(b.cen[0]),Z=mwz(b.cen[1]);
    if(b.kind==='pmart'||b.kind==='lab'||b.kind==='xmas'){
      const o=mpObb(b.c[0]),cx=mwx(o.cx),cz=mwz(o.cy),bg=mkGroup(cx,cz);b.skip=true;b.bg=bg;
      const yaw=mpFrontYaw(o.cx,o.cy);b.yaw=yaw;b.X=cx;b.Z=cz;
      if(b.kind==='pmart'){const real=HUB.shops?HUB.shops.length:0;mpStamp(H,()=>H.TYPES[1](0),cx,cz,yaw,bg,1);const sh=HUB.shops.splice(real);const p=mpTf(cx,cz,yaw,0,-10.8);HUB.shops.push({x:p[0],z:p[1]});solids.push({x:o.cx,y:o.cy,a:-yaw,w:54,h:34})}
      else if(b.kind==='lab'){mpStamp(H,()=>buildLabBlock(),cx,cz,yaw,bg,1);solids.push({x:o.cx,y:o.cy,a:-yaw,w:62,h:50});
        const dr=mpTf(cx,cz,yaw,-2,-18),mn=mpTf(cx,cz,yaw,9,-18.5),pt=mpTf(cx,cz,yaw,20,-17),st=mpTf(cx,cz,yaw,16,-17),vn=mpTf(cx,cz,yaw,-13,-20),sp=mpTf(cx,cz,yaw,-1,-18);
        HUB.lab={i:0,j:0,cx,cz,a:0,b:0,portalNode:0,doorX:dr[0],doorZ:dr[1],manX:mn[0],manZ:mn[1],portalX:pt[0],portalZ:pt[1],standX:st[0],standZ:st[1],vanX:vn[0],vanZ:vn[1],vanR:yaw+Math.PI/2,spawnX:sp[0],spawnZ:sp[1],spawnH:Math.atan2(cz-sp[1],cx-sp[0]),yaw};
        }
      else{mpStamp(H,()=>buildGingerBlock(),cx,cz,yaw,bg,1);solids.push({x:o.cx,y:o.cy,a:-yaw,w:54,h:44});const sgp=mpTf(cx,cz,yaw,0,-19.8);HUB.gb={i:0,j:0,cx,cz,sx:sgp[0],sz:sgp[1],yaw}}
      return}
    const kind=b.kind;let h;switch(kind){case 'tower':h=64;break;case 'resort':h=30;break;case 'casino':h=17;break;case 'shopping':h=13;break;case 'station':h=10;break;case 'police':h=9;break;
      default:h=aM<150?7.2:aM<650?7.5+(b.i*7%3)*3:9+(b.i*5%9)}
    const bg=mkGroup(X,Z);b.bg=bg;mpGenBuilding(bg,b,WALL[kind]||MPPAST[b.i%7],h,b.i,SIGN[kind]||null);b.h=h});
  /* Café Pengu und AstroBurger an den Markern C und B */
  MAPD.markers.forEach(m=>{const lab=L0.find(l=>Math.hypot(l.x-m.x,l.y-m.y)<12&&(l.t==='C'||l.t==='B'));if(!lab)return;const yaw=mpFrontYaw(m.x,m.y),X=mwx(m.x),Z=mwz(m.y);
    if(lab.t==='C'){let sc=.6,pos=[m.x,m.y];for(const k of [1,.85,.7,.6]){const f=mpFitClear(m.x,m.y,11*k,90);if(f){sc=k;pos=f;break}}
      const ux=pos[0],uy=pos[1],X2=mwx(ux),Z2=mwz(uy),yaw2=mpFrontYaw(ux,uy),bg=mkGroup(X2,Z2);mpStamp(H,()=>H.TYPES[2](0),X2,Z2,yaw2,bg,sc);solids.push({x:ux,y:uy,a:0,r:Math.round(26*sc)});HUB.cafe={x:X2,z:Z2,ux,uy,yaw:yaw2}}
    else{let sc=.8,pos=[m.x,m.y];for(const k of [.8,.7,.6]){const f=mpFitClear(m.x,m.y,9.5*k/.8);if(f){sc=k;pos=f;break}}
      const ux=pos[0],uy=pos[1],X2=mwx(ux),Z2=mwz(uy),yaw2=mpFrontYaw(ux,uy),bg=mkGroup(X2,Z2);mpStamp(H,()=>H.TYPES[4](0),X2,Z2,yaw2,bg,sc);solids.push({x:ux,y:uy,a:0,r:Math.round(21*sc)});HUB.burger={x:X2,z:Z2,ux,uy,yaw:yaw2}}});
  return solids}

/* ---------- S-Bahn (oberirdisch, rot durchgezogen) mit Tunnelmund; gestrichelt = unterirdisch ---------- */
function mpRail(add){
  /* Stücke zu einer Linie verbinden: Start ist das Stück, das am weitesten südlich beginnt */
  const solid=MAPD.rail.filter(r=>!r.dash&&r.pts.length>1&&Math.max(...r.pts.map(p=>p[1]))>1500);
  const near=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1])<14;let chain=[];
  let cur=solid.slice().sort((a,b)=>b.pts[0][1]-a.pts[0][1])[0];if(!cur)return null;chain=cur.pts.slice();const used=new Set([cur]);
  for(let k=0;k<6;k++){const end=chain[chain.length-1],nx=solid.find(r=>!used.has(r)&&near(r.pts[0],end));if(!nx)break;used.add(nx);chain=chain.concat(nx.pts.slice(1))}
  /* Kurve glätten (Chaikin), damit die Trasse keine Knicke und Stufen hat */
  for(let it=0;it<3;it++){const o=[chain[0]];for(let i=0;i<chain.length-1;i++){const a=chain[i],b=chain[i+1];o.push([a[0]*.75+b[0]*.25,a[1]*.75+b[1]*.25],[a[0]*.25+b[0]*.75,a[1]*.25+b[1]*.75])}o.push(chain[chain.length-1]);chain=o}
  const P=mpResample(chain,2);const pts=P.map(p=>[p.x,p.z]);
  const cum=[0];for(let i=1;i<pts.length;i++)cum.push(cum[i-1]+Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]));const L=cum[cum.length-1];
  const TY=12.5,RAMP=80,Lr=L-RAMP,yAt=s=>s<Lr?TY:Math.max(1.6,TY-(TY-1.6)*(s-Lr)/RAMP);
  const posAt=s=>{s=Math.max(0,Math.min(L-.01,s));let lo=0,hi=cum.length-1;while(hi-lo>1){const m=(lo+hi)>>1;if(cum[m]<=s)lo=m;else hi=m}const f=(s-cum[lo])/(cum[hi]-cum[lo]||1),a=pts[lo],b=pts[hi];return {x:a[0]+(b[0]-a[0])*f,z:a[1]+(b[1]-a[1])*f,h:Math.atan2(b[1]-a[1],b[0]-a[0])}};
  const step=1.5,N=Math.floor(L/step),items=[];for(let k=0;k<N;k++){const s=k*step+.75,p=posAt(s);items.push({p,s,pit:Math.atan2(yAt(s+.75)-yAt(s-.75),1.5)})}
  const dk=mpMat('raildeck','#9a8fc0');
  add(mpInstanced(BX,dk,items,it=>({x:it.p.x,y:yAt(it.s)-.4,z:it.p.z,ry:-it.p.h,rz:it.pit,sx:2.0,sy:.8,sz:4.6})));
  const trim=new THREE.MeshStandardMaterial({color:'#ee7cb8',emissive:'#ee7cb8',emissiveIntensity:.4,roughness:.6}),rl=[];
  items.forEach(it=>{[-1,1].forEach(sd=>{const nx=-Math.sin(it.p.h),nz=Math.cos(it.p.h);rl.push({x:it.p.x+nx*sd*2.15,z:it.p.z+nz*sd*2.15,y:yAt(it.s)+.27,ry:-it.p.h,rz:it.pit})})});
  add(mpInstanced(BX,trim,rl,r=>({x:r.x,y:r.y,z:r.z,ry:r.ry,rz:r.rz,sx:2.0,sy:.55,sz:.3})));
  /* Pfeiler: auf Wasser, Land oder Bürgersteig, nie auf der Fahrbahn, mit Ausleger zur Gleismitte */
  const col=[],beam=[],sol=[];
  for(let s=8;s<Lr;s+=24){const p=posAt(s),nx=-Math.sin(p.h),nz=Math.cos(p.h),y=yAt(s);let placed=false;
    for(const d of [0,5,-5,9,-9,13,-13]){const x=p.x+nx*d,z=p.z+nz*d,c=mpAt(x,z);if(c===2||c===5)continue;if(c===0&&mpIsLand(x,z))continue;
      col.push({x,z,y:(y-.8+1.0)/2,h:y-.8-1.0});beam.push({x:p.x+nx*d/2,z:p.z+nz*d/2,y:y-1.25,ry:-p.h,len:Math.abs(d)+4.6});if(c!==0)sol.push({x,z});placed=true;break}}
  add(mpInstanced(CY,mpMat('pillar','#7a6fa0'),col,c=>({x:c.x,y:c.y,z:c.z,sx:.8,sy:c.h,sz:.8})));
  add(mpInstanced(BX,mpMat('pillar','#7a6fa0'),beam,b=>({x:b.x,y:b.y,z:b.z,ry:b.ry+Math.PI/2*0,sx:1.2,sy:.9,sz:b.len})));
  /* Tunnelmund am Ende: dunkle Öffnung mit Rahmen */
  const e=posAt(L-.5),nx=-Math.sin(e.h),nz=Math.cos(e.h);
  [[-1],[1]].forEach(([sd])=>{const m=new THREE.Mesh(BX,mpMat('portal','#6a5a8a'));m.scale.set(1.4,6.5,1.4);m.position.set(e.x+nx*sd*3.2,1.3+3.25,e.z+nz*sd*3.2);m.castShadow=true;add(m)});
  {const m=new THREE.Mesh(BX,mpMat('portal','#6a5a8a'));m.scale.set(1.8,1.2,8.2);m.position.set(e.x,1.3+6.6,e.z);m.rotation.y=-e.h+Math.PI/2*0;m.castShadow=true;add(m)}
  {const m=new THREE.Mesh(BX,new THREE.MeshBasicMaterial({color:'#07070d'}));m.scale.set(.6,5.6,5.6);m.position.set(e.x+Math.cos(e.h)*1.4,1.3+2.8,e.z+Math.sin(e.h)*1.4);m.rotation.y=-e.h;m.userData.noBake=true;add(m)}
  return {pts,L,posAt,yAt,sol,mouth:e}}
/* Bahnhofshalle über den Gleisen (wie die alten Berliner Hochbahnhöfe): gewölbtes Glasdach auf Stahlrippen, seitliche Bahnsteige */
function mpStationHall(rail){const st=HUB.station;if(!st)return;let best=null;
  for(let q=0;q<rail.L;q+=2){const p=rail.posAt(q),d=Math.hypot(p.x-st.x,p.z-st.z);if(!best||d<best.d)best={d,s:q,p}}
  if(!best||best.d>40)return;const LEN=40,R=5.6,s0=Math.max(LEN/2,Math.min(rail.L-80-LEN/2,best.s)),c=rail.posAt(s0),y=rail.yAt(s0)-.05;
  const g=new THREE.Group();g.position.set(c.x,y,c.z);g.rotation.y=-c.h;g.userData.noBake=true;
  const steel=new THREE.MeshStandardMaterial({color:'#4f5578',roughness:.55,metalness:.3}),glass=new THREE.MeshStandardMaterial({color:'#9fe6f0',emissive:'#4fb8d0',emissiveIntensity:.25,transparent:true,opacity:.38,roughness:.2,side:THREE.DoubleSide,depthWrite:false});
  const roof=new THREE.Mesh(new THREE.CylinderGeometry(R,R,LEN,28,1,true,0,Math.PI),glass);roof.rotation.z=Math.PI/2;roof.position.y=.4;g.add(roof);
  for(let i=0;i<=10;i++){const rib=new THREE.Mesh(new THREE.TorusGeometry(R,i%10===0?.3:.16,6,26,Math.PI),steel);rib.rotation.y=Math.PI/2;rib.position.set(-LEN/2+i*LEN/10,.4,0);rib.castShadow=true;g.add(rib)}
  [-1,0,1].forEach(a=>{const bm=new THREE.Mesh(BX,steel);bm.scale.set(LEN,.28,.28);bm.position.set(0,.4+R*Math.cos(a*1.0)*(a?Math.cos(0):1)*(a?.55:1)+(a?0:0),a?R*Math.sin(a*1.0)*.85:0);g.add(bm)});
  [-1,1].forEach(sd=>{const pl=new THREE.Mesh(BX,mpMat('platform','#cfc4e0'));pl.scale.set(LEN-2,.34,2.3);pl.position.set(0,.05,sd*3.5);g.add(pl);
    const rl=new THREE.Mesh(BX,steel);rl.scale.set(LEN-2,.9,.14);rl.position.set(0,.65,sd*4.55);g.add(rl)});
  W0.add(g);HUB.stationHall={x:c.x,z:c.z,y,h:c.h}}
/* Abstand zur Hochbahn-Mittellinie (Pflanzen dürfen nicht durch Trasse oder Pfeiler wachsen) */
function mpRailDist(X,Z){const P=HUB.railPts;if(!P)return 999;let d=999;for(let i=0;i<P.length;i+=2){const q=Math.hypot(P[i][0]-X,P[i][1]-Z);if(q<d)d=q}return d}
function mpBuildTrain(rail){
  const tg=new THREE.Group();tg.visible=false;tg.userData.noBake=true;W0.add(tg);const cars=[];
  [['#47c2a5',1],['#f1a7c8',0],['#ffe066',0],['#4cc3ff',0]].forEach(([c0,head],k)=>{const cg=new THREE.Group(),M=(c,em)=>new THREE.MeshStandardMaterial({color:c,roughness:.5,emissive:em||'#000000',emissiveIntensity:em?.8:0});
    const add=(geo,mat,x,y,z,sx=1,sy=1,sz=1)=>{const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);m.scale.set(sx,sy,sz);m.castShadow=true;cg.add(m);return m};
    add(BX,M(c0),0,0,0,9.2,2.8,2.7);add(BX,M('#ffffff'),0,1.5,0,9.3,.25,2.8);add(BX,M('#2a2733'),0,-1.55,0,7.6,.4,1.8);
    for(let w=0;w<6;w++)[-1,1].forEach(s=>add(BX,M('#ffe9a0','#ffe9a0'),-3.4+w*1.36,.35,s*1.36,.95,.9,.08));
    if(k===0){add(SP,M(c0),4.7,0,0,.9,1.4,1.35);add(BX,M('#fff0b0','#fff0b0'),5.45,-.2,0,.12,.4,1.5)}
    cg.rotation.order='YZX';tg.add(cg);cars.push(cg)});
  cars.forEach(cg=>addOutlines(cg,'prop'));
  HUB.train={g:tg,cars,L:rail.L,posAt:rail.posAt,yAt:rail.yAt,state:'wait',cd:6,s:0,v:22,TY:12.5,snd:0}}

/* ---------- Raster-Helfer für Platzierungen ---------- */
function mpMarkDisc(X,Z,r){const ux=mux(X)-MP.PLAY.x0,uy=muy(Z)-MP.PLAY.y0,ru=r/MP.SC;for(let y=Math.floor(uy-ru);y<=Math.ceil(uy+ru);y++)for(let x=Math.floor(ux-ru);x<=Math.ceil(ux+ru);x++){if(x<0||y<0||x>=MP.w||y>=MP.h)continue;if((x-ux)**2+(y-uy)**2<=ru*ru)MP.cls[y*MP.w+x]=5}}
function mpMarkRect(X,Z,hw,hd,yaw){const ru=Math.hypot(hw,hd)/MP.SC,ux=mux(X)-MP.PLAY.x0,uy=muy(Z)-MP.PLAY.y0,c=Math.cos(yaw),s=Math.sin(yaw);
  for(let y=Math.floor(uy-ru);y<=Math.ceil(uy+ru);y++)for(let x=Math.floor(ux-ru);x<=Math.ceil(ux+ru);x++){if(x<0||y<0||x>=MP.w||y>=MP.h)continue;const dx=(x-ux)*MP.SC,dz=(y-uy)*MP.SC,lx=dx*c-dz*s,lz=dx*s+dz*c;if(Math.abs(lx)<=hw&&Math.abs(lz)<=hd)MP.cls[y*MP.w+x]=5}}
function mpFree(X,Z,r,allowRoad){for(let a=0;a<12;a++){const ang=a/12*Math.PI*2;for(const rr of [r,r*.5]){const c=mpAt(X+Math.cos(ang)*rr,Z+Math.sin(ang)*rr);if(!(c===1||c===3||c===4||(allowRoad&&c===2)))return false}}const c0=mpAt(X,Z);return c0===1||c0===3||c0===4||(allowRoad&&c0===2)}
function mpFindFree(ux,uy,r,maxM,allowRoad){for(let d=0;d<=maxM;d+=2)for(let a=0;a<(d?16:1);a++){const ang=a/16*Math.PI*2+d,X=mwx(ux)+Math.cos(ang)*d,Z=mwz(uy)+Math.sin(ang)*d;if(mpFree(X,Z,r,allowRoad))return [X,Z]}return null}
/* Punkte auf Bürgersteigen für Gräber, Zuschauer, Zapfsäulen */
function mpSpotPool(){const R=mulberry(2024),out=[];for(let y=0;y<MP.h;y+=5)for(let x=0;x<MP.w;x+=5){if(MP.cls[y*MP.w+x]===3){const X=mwx(x+MP.PLAY.x0+(R()-.5)*3),Z=mwz(y+MP.PLAY.y0+(R()-.5)*3);if(mpAt(X,Z)===3)out.push([X,Z])}}
  for(let i=out.length-1;i>0;i--){const j=Math.floor(R()*(i+1));[out[i],out[j]]=[out[j],out[i]]}return out}
function mpLamps(){const out=[];let k=0;MAPD.roads.forEach(r=>{const wM=Math.max(r.w,MP.RW)*MP.SC;mpResample(r.pts,26).forEach(s=>{if(!(s.tx||s.tz))return;const side=(k++%2)?1:-1,off=wM/2+MP.SWK*.5,x=s.x-s.tz*side*off,z=s.z+s.tx*side*off;if(mpAt(x,z)===3&&!(HUB.doors||[]).some(d=>Math.hypot(d[0]-x,d[1]-z)<5.5))out.push([x,z])})});return out}

/* ---------- Polizei: kommt nach illegalem Graffiti (1 Minute, nachts 3), Skate-Polizisten verfolgen im Sichtradius, Festnahme = Nahaufnahme und 10 Scoops Strafe ---------- */
const POL={state:'idle',timer:0,total:0,spot:null,cops:[],cin:null,hud:null,loseT:0,t:0,chaseT:0,search:0,FINE:10,SIGHT:42,SPEED:9.2};
PRE['#2a4a9a']={skin:'#e0a98a',top:'#2a4a9a',bot:'#1f2a4a',sole:'#f0cf36',hair:'cap',hc:'#1f2a4a',lens:'#141416',frame:'#141416',pack:'#1f2a4a',pads:'#c9d4ff',watch:1,stripe:'#ffffff'};
PRE['#3a5ab8']={skin:'#c98e6a',top:'#3a5ab8',bot:'#1f2a4a',sole:'#ffffff',hair:'cap',hc:'#1f2a4a',lens:'#141416',frame:'#141416',pack:'#1f2a4a',pads:'#c9d4ff',watch:1,stripe:'#ffffff'};
function polHud(){if(POL.hud)return POL.hud;const d=document.createElement('div');d.id='pol';d.style.cssText="position:absolute;top:64px;left:50%;transform:translateX(-50%);padding:8px 16px;border-radius:12px;border:3px solid #0e0b18;background:rgba(26,22,38,.9);color:#fff;font:800 16px/1.2 'Baloo 2',sans-serif;letter-spacing:.04em;display:none;z-index:3;box-shadow:0 4px 0 #0e0b18;pointer-events:none";const ui=document.getElementById('ui');(ui||document.body).appendChild(d);return POL.hud=d}
function polText(t,col){const h=polHud();h.style.display=t?'block':'none';h.style.borderColor=col||'#0e0b18';h.textContent=t||''}
function polNight(){return (typeof DAY!=='undefined'&&DAY.dn!==undefined?DAY.dn:1)<.35}
function polAlert(panel){if(POL.state!=='idle')return;const night=polNight();POL.state='warn';POL.total=POL.timer=night?180:60;POL.spot={x:panel.ax,z:panel.az};
  toast('Achtung! Die Polizei wurde gerufen',2600);say('e','Jemand hat dein Graffiti gemeldet. Die Polizei ist in '+(night?'drei Minuten':'einer Minute')+' da. Verschwinde besser, sonst gibt es '+POL.FINE+' Scoops Strafe.',5.2);tone(520,.18,'square',.05);tone(390,.22,'square',.05,0,.2)}
function polSpawnPoint(){if(HUB.policeStation)return {x:HUB.policeStation.x,z:HUB.policeStation.z};let best=null;MAPD.roads.forEach(r=>mpResample(r.pts,20).forEach(s=>{if(!(s.tx||s.tz)||mpAt(s.x,s.z)!==2||s.z>186)return;const d=Math.hypot(s.x-P.x,s.z-P.z);if(d>95&&d<170&&(!best||Math.abs(d-130)<Math.abs(best.d-130)))best={x:s.x,z:s.z,d}}));return best||{x:P.x+60,z:P.z}}
function polMakeCop(x,z,col,i){const g=skater(x,cityGround(x,z),z,0,col,1.35);g.userData.noBake=true;W0.add(g);addOutlines(g,'actor');const mk=c=>{const m=new THREE.Mesh(new THREE.SphereGeometry(.16,8,6),new THREE.MeshBasicMaterial({color:c}));m.position.set(0,2.55,0);g.add(m);return m},la=mk('#ff2a2a'),lb=mk('#2a6aff');la.position.x=-.22;lb.position.x=.22;
  return {g,x,z,h:0,la,lb,i,sp:POL.SPEED+(i?.5:0)}}
function polDispatch(){const sp=polSpawnPoint();POL.cops.forEach(c=>W0.remove(c.g));POL.cops=[polMakeCop(sp.x,sp.z,'#2a4a9a',0),polMakeCop(sp.x+2.4,sp.z+1.2,'#3a5ab8',1)];POL.state='patrol';POL.search=0;POL.t=0;toast('Die Polizei ist da!',1800);polText('POLIZEI IM EINSATZ','#4a7aff')}
function polMove(c,tx,tz,sp,dt){const dx=tx-c.x,dz=tz-c.z,L=Math.hypot(dx,dz)||1,st=Math.min(L,sp*dt),a0=Math.atan2(dz,dx);
  /* geradeaus, sonst um Hindernisse herum: Ausweichwinkel probieren, die zuletzt gewählte Seite bevorzugen */
  const side=c.side||1;for(const off of [0,.5,-.5,1.0,-1.0,1.6,-1.6,2.3,-2.3]){const ang=a0+off*side,nx=c.x+Math.cos(ang)*st,nz=c.z+Math.sin(ang)*st;if(mpWalk(nx,nz)&&mpWalk(c.x+Math.cos(ang)*(st+.8),c.z+Math.sin(ang)*(st+.8))){c.x=nx;c.z=nz;c.h=ang;if(off)c.side=off>0?1:-1;return L}}
  c.side=-side;return L}
function polDraw(dt){const flash=Math.floor(POL.t*4)%2===0,up=!G.under&&LV.id===0;POL.cops.forEach(c=>{const g=c.g;g.visible=up;g.position.set(c.x,cityGround(c.x,c.z),c.z);g.rotation.y=Math.PI/2-c.h;la_lb(c,flash)})}
function la_lb(c,f){c.la.visible=f;c.lb.visible=!f}
function polEnd(msg,col){POL.cops.forEach(c=>{W0.remove(c.g)});POL.cops=[];POL.state='idle';POL.cin=null;polText('');if(msg)toast(msg,2600)}
function polCatch(){POL.state='caught';const c0=POL.cops[0],c1=POL.cops[1]||c0;P.speed=0;K.up=K.down=K.left=K.right=0;
  /* Polizisten stellen sich vor den Spieler, Kamera zoomt auf die Gesichter */
  const f=[Math.cos(P.h),Math.sin(P.h)];c0.x=P.x+f[0]*2.0-f[1]*.9;c0.z=P.z+f[1]*2.0+f[0]*.9;c1.x=P.x+f[0]*2.0+f[1]*.9;c1.z=P.z+f[1]*2.0-f[0]*.9;c0.h=c1.h=Math.atan2(-f[1],-f[0]);
  POL.cin={step:0,t:0};polText('ERWISCHT!','#ff2a2a');SFX.thud();tone(300,.3,'sawtooth',.06,-120);polCin(0);
  dlgStart('Polizei',['Halt! Polizei! Illegales Graffiti.','Das macht '+POL.FINE+' Scoops Strafe. Und jetzt ab nach Hause.'],polRelease)}
function polCin(step){const c=POL.cops[step%2]||POL.cops[0];const fx=Math.cos(c.h),fz=Math.sin(c.h);
  POL.cin.pos=new V3(c.x+fx*1.25,cityGround(c.x,c.z)+3.05,c.z+fz*1.25);POL.cin.look=new V3(c.x,cityGround(c.x,c.z)+3.0,c.z);POL.cin.step=step;POL.cin.t=0}
function polRelease(){const lost=Math.min(POL.FINE,SC.n|0);if(lost>0)scAdd(-lost,'Strafe');polEnd('−'+lost+' Scoops')}
function polStep(dt){if(!POL.hud&&POL.state==='idle')return;POL.t+=dt;const live=LV.id===0&&!G.under;
  if(POL.state==='warn'){if(!live)return;POL.timer-=dt;const t=Math.max(0,Math.ceil(POL.timer));polText('POLIZEI IN '+Math.floor(t/60)+':'+String(t%60).padStart(2,'0'),POL.timer<15?'#ff2a2a':'#ffb020');if(POL.timer<=0)polDispatch();return}
  if(!POL.cops.length)return;polDraw(dt);if(!live)return;
  if(POL.state==='patrol'||POL.state==='chase'){if(Math.floor(POL.t*2)!==Math.floor((POL.t-dt)*2))tone(Math.floor(POL.t*2)%2?640:860,.22,'square',.018)}
  const near=POL.cops.reduce((m,c)=>Math.min(m,Math.hypot(c.x-P.x,c.z-P.z)),1e9);
  if(POL.state==='patrol'){POL.cops.forEach((c,i)=>{const a=POL.t*.5+i*3.1,tx=POL.spot.x+Math.cos(a)*(POL.search>3?10:0),tz=POL.spot.z+Math.sin(a)*(POL.search>3?10:0),L=polMove(c,tx,tz,c.sp*.85,dt);if(L<2.5)POL.search+=dt/POL.cops.length});
    if(near<POL.SIGHT&&G.phase==='play'){POL.state='chase';POL.chaseT=0;POL.loseT=0;toast('Polizei! Lauf!',1600);polText('VERFOLGUNG!','#ff2a2a');tone(900,.25,'square',.06)}
    else if(POL.search>20){polEnd('Glück gehabt! Die Polizei zieht ab.')}
    return}
  if(POL.state==='chase'){POL.chaseT+=dt;POL.cops.forEach(c=>polMove(c,P.x,P.z,c.sp+Math.min(2.5,POL.chaseT*.15),dt));
    if(near<2.4&&G.phase==='play')return polCatch();
    POL.loseT=near>75?POL.loseT+dt:0;if(POL.loseT>4)polEnd('Glück gehabt! Du hast sie abgehängt.');else if(POL.chaseT>70)polEnd('Glück gehabt! Die Polizei gibt auf.');return}
  if(POL.state==='caught'&&POL.cin){POL.cin.t+=dt;if(POL.cin.t>1.7&&POL.cin.step<3)polCin(POL.cin.step+1)}}
/* ---------- Tag und Nacht: ein Tag dauert 30 Minuten, Start am Mittag (Pacific-Sim-Look) ---------- */
const DAY={len:1800,t:0,on:true,grain:null,K:null,last:-1};
function dayInit(){const C=c=>new THREE.Color(c);
  /* p, Himmel oben, Horizont/Nebel, Hemi oben, Hemi unten, Hemi-Stärke, Sonne, Sonnenstärke, Sonnenhöhe, Fill, Fill-Stärke */
  DAY.K=[[0,'#58b6e8','#d2ecf0','#ffffff','#f3c6d8',1.15,'#fff3d6',3.0,52,'#ffc8e0',.7],
   [.22,'#4a9fd8','#f6e4d2','#fff4e6','#e8b0c8',1.1,'#ffe2b0',2.8,34,'#ffb0d0',.9],
   [.38,'#6a7fd0','#ffc29c','#ffe6e0','#a070b0',1.0,'#ffb060',2.6,18,'#c090ff',1.0],
   [.48,'#3a2a8a','#ff9a78','#ffd9f0','#7a5aa0',1.0,'#ffb870',2.3,9,'#8e7bff',1.0],
   [.58,'#1a1650','#a05a9a','#9a90e0','#3a2a6a',.7,'#7a70d0',1.0,12,'#ff7ab8',1.0],
   [.70,'#050824','#1c1e50','#6a78d8','#1a1840',.5,'#8a98ff',.7,30,'#5a7aff',.5],
   [.86,'#3a4a9a','#ffb0b0','#ffd0e8','#6a60a8',.8,'#ffb890',1.5,12,'#a090ff',.8],
   [1,'#58b6e8','#d2ecf0','#ffffff','#f3c6d8',1.15,'#fff3d6',3.0,52,'#ffc8e0',.7]].map(k=>k.map((v,i)=>typeof v==='string'?C(v):v));
  DAY.tmp=[C('#000'),C('#000'),C('#000'),C('#000'),C('#000'),C('#000')];
  const g=document.createElement('div');g.id='grain';g.style.cssText="position:fixed;inset:0;pointer-events:none;z-index:1;opacity:.1;mix-blend-mode:overlay;background-image:url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .5 0 0 0 0 .5 0 0 0 0 .5 0 0 0 1.6 -.3'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\");background-size:220px 220px";
  const v=document.createElement('div');v.id='vign';v.style.cssText="position:fixed;inset:0;pointer-events:none;z-index:1;background:radial-gradient(ellipse at center,rgba(0,0,0,0) 55%,rgba(60,20,40,.22) 100%)";
  const ui=document.getElementById('ui');[g,v].forEach(e=>ui&&ui.parentNode?ui.parentNode.insertBefore(e,ui):document.body.appendChild(e));DAY.grain=[g,v]}
function dayStep(dt){if(!DAY.on||typeof sun==='undefined')return;if(!DAY.K)dayInit();
  const show=!G.under&&LV.id===0;DAY.grain&&DAY.grain.forEach(e=>{const d=show?'':'none';if(e.style.display!==d)e.style.display=d});
  if(!show)return;DAY.t=(DAY.t+dt)%DAY.len;const p=DAY.t/DAY.len,K=DAY.K;let i=0;while(i<K.length-2&&p>=K[i+1][0])i++;
  const a=K[i],b=K[i+1],f=Math.max(0,Math.min(1,(p-a[0])/(b[0]-a[0]))),e=f*f*(3-2*f),T=DAY.tmp,L=(x,y)=>x+(y-x)*e;
  sky.material.uniforms.a.value.copy(a[1]).lerp(b[1],e);sky.material.uniforms.b.value.copy(a[2]).lerp(b[2],e);
  hemi.color.copy(a[3]).lerp(b[3],e);hemi.groundColor.copy(a[4]).lerp(b[4],e);hemi.intensity=L(a[5],b[5]);
  sun.color.copy(a[6]).lerp(b[6],e);sun.intensity=L(a[7],b[7]);DAY.sunY=L(a[8],b[8]);fill.color.copy(a[9]).lerp(b[9],e);fill.intensity=L(a[10],b[10]);
  const bc=sky.material.uniforms.b.value,dn=Math.max(0,Math.min(1,(sun.intensity-1)/1.8)),fn=10+18*dn,ff=150+170*dn;DAY.dn=dn;if(sc.fog){if(sc.fog.color)sc.fog.color.copy(bc);sc.fog.near=fn;sc.fog.far=ff}OUTFOG.fc.value.copy(bc);OUTFOG.fn.value=fn;OUTFOG.ff.value=ff;
  DAY.hour=Math.floor(((p*24+12)%24)*10)/10;if(DAY.sea){DAY.sea.uniforms.t.value+=dt;DAY.sea.uniforms.dim.value=Math.max(0,Math.min(1,(sun.intensity+hemi.intensity*.6-.7)/2.6))}}
/* ---------- Gesamtaufbau ---------- */
function portLupoNew(H){
  HUB.doors=[];HUB.policeStation=null;HUB.bgroups=[];HUB.cones=[];HUB.portals=[];HUB.items=[];HUB.clappers=[];HUB.colliders=[];HUB.mm=null;HUB.mapn=true;
  const add=o=>W0.add(o);
  const solids=mpBuildings(H);mpBuildMask(solids);
  mpTerrain(add);
  const rail=mpRail(add);if(rail)HUB.railPts=rail.pts;if(rail)mpStationHall(rail);if(rail){rail.sol.forEach(p=>mpMarkDisc(p.x,p.z,1.1));mpBuildTrain(rail)}
  /* Start auf der Straße zwischen Café und Büroturm, Blick nach Norden */
  HUB.sx=mwx(2108);HUB.sz=mwz(1352);HUB.sh=-Math.PI/2;
  /* Laternen */
  const lamps=mpLamps();
  {const post=mpInstanced(CY,new THREE.MeshStandardMaterial({color:'#5a4a8a'}),lamps,p=>({x:p[0],y:1.6+2.7,z:p[1],sx:.14,sy:6,sz:.14})),head=mpInstanced(SP,new THREE.MeshBasicMaterial({color:'#fff0b0'}),lamps,p=>({x:p[0],y:1.6+6.2,z:p[1],sx:.55,sy:.55,sz:.55}));post.castShadow=true;add(post);add(head)}
  HUB.lamps=lamps;
  /* Straßenschilder im kalifornischen Grün (wie in der alten Stadt), Namen sind Platzhalter, bis die Karte Namen liefert */
  {const NM=['Waffelweg','Sorbetstraße','Karamellallee','Pistazienweg','Minzgasse','Schokoring','Möwenstraße','Palmenallee','Sonnenweg','Korallenweg','Dinoweg','Muschelgasse'],sn=t=>t.replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue').replace(/ß/g,'ss'),TX={};
   const stMat=t0=>TX[t0]||(TX[t0]=(()=>{const t=sn(t0),c=document.createElement('canvas');c.width=640;c.height=128;const x=c.getContext('2d');x.fillStyle='#0b6b4a';x.fillRect(0,0,640,128);x.strokeStyle='#f4f7f2';x.lineWidth=7;x.beginPath();x.roundRect(7,7,626,114,16);x.stroke();x.fillStyle='#f4f7f2';x.textAlign='center';x.textBaseline='middle';
     const fam='"Smarta Nova","Baloo 2","Trebuchet MS",sans-serif';let fs=74;x.font=fs+'px '+fam;while(x.measureText(t).width>560&&fs>20){fs-=3;x.font=fs+'px '+fam}x.fillText(t,320,66);
     const tx=new THREE.CanvasTexture(c);tx.colorSpace=THREE.SRGBColorSpace;return new THREE.MeshBasicMaterial({map:tx})})()),pole=new THREE.MeshStandardMaterial({color:'#8a8aa0',roughness:.7}),placed=[];
   MAPD.roads.forEach((r,ri)=>{const name=ri===0?'Uferpromenade':ri===MAPD.roads.length-1?'Skate-Boulevard':NM[(ri-1)%NM.length],wM=Math.max(r.w,MP.RW)*MP.SC;
     mpResample(r.pts,50).forEach((sm,si)=>{if(si%1||!(sm.tx||sm.tz))return;const side=si%2?1:-1,off=wM/2+MP.SWK-.5,X=sm.x-sm.tz*side*off,Z=sm.z+sm.tx*side*off;
       if(mpAt(X,Z)!==3||Z>186||placed.some(q=>Math.hypot(q[0]-X,q[1]-Z)<30)||(HUB.doors||[]).some(d=>Math.hypot(d[0]-X,d[1]-Z)<9))return;placed.push([X,Z]);
       const pm=new THREE.Mesh(new THREE.CylinderGeometry(.1,.1,6.6,6),pole);pm.position.set(X,1.6+3.3,Z);pm.userData.noBake=true;add(pm);
       const nx=sm.tz*side,nz=-sm.tx*side,ry=Math.atan2(nx,nz);
       [0,1].forEach(b=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(6,1.2),stMat(name));const o=(b?-1:1)*.14;m.position.set(X+nx*o,1.6+5.9,Z+nz*o);m.rotation.y=ry+(b?Math.PI:0);m.userData.noBake=true;add(m)})})})
   HUB.streetSigns=placed.length}
  /* Pflanzen: die Bäume der Karte und Parks aus Regeln */
  {const oF=FSP,oH=FW.h,oA=FW.acc;FSP=new THREE.SphereGeometry(1,7,5);FCYL=6;FW.h=.97;FW.lb=.1;FW.sb=.42;FW.acc=.28;CTX='actor';
   const KS=['balloon','balloon','spiral','vine','mushroom','palm','balloon','spiral'],put=(kind,X,Z,sc2,seed,ht,nat)=>{if(mpRailDist(X,Z)<(kind==='palm'?9:6))return;const R2=mulberry(seed),gp=FLORA[kind](R2,sc2,ht,nat);gp.position.set(X,1.3,Z);gp.rotation.y=R2()*6.28;gp.traverse(o=>{if(o.isMesh)o.castShadow=true});add(gp)};
   MAPD.trees.forEach((t,i)=>{const X=mwx(t.x),Z=mwz(t.y);if(mpAt(X,Z)===0)return;put(KS[i%KS.length],X,Z,t.r>4?1.3:.8,i*17+3)});
   const RP=mulberry(909);MAPD.parks.forEach((pk,pi)=>{const r=pk.c[0],xs=r.map(p=>p[0]),ys=r.map(p=>p[1]),x0=Math.min(...xs),x1=Math.max(...xs),y0=Math.min(...ys),y1=Math.max(...ys),n=Math.floor(Math.abs(mpArea(r))*MP.SC*MP.SC/260);
     for(let k=0,t=0;k<n&&t<n*20;t++){const ux=x0+RP()*(x1-x0),uy=y0+RP()*(y1-y0);if(!mpInPoly(r,ux,uy))continue;const X=mwx(ux),Z=mwz(uy);if(mpAt(X,Z)!==4||!mpFree(X,Z,1.6))continue;put(KS[Math.floor(RP()*KS.length)],X,Z,.9+RP()*.4,pi*1000+k);k++}});
   /* Hohe Palmen am Straßenrand auf dem Sandstreifen (Strand), automatisch, ohne Kollision */
   {const RT=mulberry(777),cand=[];MAPD.roads.forEach(r=>{const wM=Math.max(r.w,MP.RW)*MP.SC;mpResample(r.pts,7).forEach(sm=>{if(!(sm.tx||sm.tz))return;for(const side of [1,-1]){const off=wM/2+MP.SWK+3+RT()*5,X=sm.x-sm.tz*side*off,Z=sm.z+sm.tx*side*off;
       if(Z>186||mpAt(X,Z)!==1||!mpFree(X,Z,2.2)||Math.hypot(X-HUB.sx,Z-HUB.sz)<14)continue;cand.push([X,Z,RT()])}})});
    cand.sort((a,b)=>a[2]-b[2]);const placed=[];for(const c of cand){if(placed.length>=60)break;if(placed.some(q=>Math.hypot(q[0]-c[0],q[1]-c[1])<18))continue;placed.push(c);put('palm',c[0],c[1],2.4,4000+placed.length,1.6+((placed.length*7)%11)/11*.8,true)}HUB.tallPalms=placed.length}
   CTX='stage';FCYL=10;FSP=oF;FW.h=oH;FW.acc=oA;FW.lb=0;FW.sb=0}
  /* Pylonen am Straßenrand */
  {const RC=mulberry(321),cand=mpSpotPool().slice(0,400);let n=0;for(const p of cand){if(n>=14)break;if(Math.hypot(p[0]-HUB.sx,p[1]-HUB.sz)<25)continue;if(HUB.cones.some(c=>Math.hypot(c.x-p[0],c.z-p[1])<50))continue;
    const o=makeCone(p[0],p[1]);sc.remove(o);W0.add(o);o.userData.noBake=true;HUB.cones.push({o,x:p[0],z:p[1],hit:0,vx:0,vy:0,vz:0});n++}}
  /* Zuschauer */
  {const CC=['#d54291','#f0cf36','#47c2a5','#eae8e8','#2499bb','#f1a7c8'],SK=['#e0a98a','#c98e6a','#8a5a3c','#f0c8a8'],RS=mulberry(808),pool=mpSpotPool().slice(400,470);
   pool.forEach(([px,pz])=>{const nr=mpNearRoad(mux(px),muy(pz)),face=nr?Math.atan2(mwx(nr.x)-px,mwz(nr.y)-pz):0,kk=1.15+RS()*.2,top=CC[Math.floor(RS()*6)],skin=SK[Math.floor(RS()*4)],g=new THREE.Group();
     const mk=(geo,col,x,y,z,sx=1,sy=1,sz=1)=>{const m=new THREE.Mesh(geo,SM({color:col,roughness:.7}));m.position.set(x,y,z);m.scale.set(sx,sy,sz);m.castShadow=true;g.add(m);return m};
     mk(new THREE.CapsuleGeometry(.3,.75,4,10),top,0,1.45,0);[-1,1].forEach(s=>mk(new THREE.CapsuleGeometry(.12,.7,4,8),'#312e42',s*.16,.5,0));mk(new THREE.SphereGeometry(.3,12,10),skin,0,2.3,0);
     if(RS()<.6)mk(new THREE.SphereGeometry(.32,12,6,0,Math.PI*2,0,Math.PI/2),CC[Math.floor(RS()*6)],0,2.34,0);[-1,1].forEach(s=>mk(new THREE.SphereGeometry(.1,8,6),'#141416',s*.13,2.34,.25));
     g.position.set(px,1.6,pz);g.rotation.y=face;g.scale.setScalar(kk);W0.add(g);
     const gm=SM({color:top,roughness:.7}),hm=SM({color:skin,roughness:.7}),up=RS()<.55;
     [-1,1].forEach(s=>{const A=new THREE.Group(),ox=s*.38*kk;A.rotation.order='YXZ';A.position.set(px+ox*Math.cos(face),1.6+1.85*kk,pz-ox*Math.sin(face));A.rotation.y=face;A.scale.setScalar(kk);
       const a=new THREE.Mesh(new THREE.CapsuleGeometry(.09,.5,4,8),gm);a.position.y=-.36;A.add(a);const h=new THREE.Mesh(new THREE.SphereGeometry(.11,8,6),hm);h.position.y=-.72;A.add(h);const idle=up?s*2.5:s*.35;A.rotation.z=idle;A.userData.noBake=true;W0.add(A);HUB.clappers.push({A,s,idle,x:px,face,ph:RS()*6.28,up})})})}
  /* Gegenstände für die Atoll-Quest vor passenden Gebäuden */
  {const near=(ux,uy,k)=>{const f=mpFront(ux,uy,5.5+k);return f},pm=MAPD.buildings.find(b=>b.kind==='pmart'),tw=MAPD.buildings.find(b=>b.kind==='tower');
   const gen=MAPD.buildings.filter(b=>!b.kind&&b.area*MP.SC*MP.SC>120).sort((a,b)=>Math.hypot(b.cen[0]-2108,b.cen[1]-1352)-Math.hypot(a.cen[0]-2108,a.cen[1]-1352));
   const far=gen.filter(b=>Math.hypot(b.cen[0]-2108,b.cen[1]-1352)<420);const res=far[Math.floor(far.length/3)]||gen[0];
   const spots={funk:HUB.cafe?near(HUB.cafe.ux,HUB.cafe.uy,2):[HUB.sx+8,HUB.sz],schraube:pm?near(pm.cen[0],pm.cen[1],5):[HUB.sx-8,HUB.sz],usb:tw?near(tw.cen[0],tw.cen[1],0):[HUB.sx,HUB.sz+8],handbuch:res?near(res.cen[0],res.cen[1],0):[HUB.sx,HUB.sz-8],losung:HUB.burger?near(HUB.burger.ux,HUB.burger.uy,2):[HUB.sx+12,HUB.sz]};
   ITEM_DEFS.forEach((d,k)=>{const p=spots[d.id];placeItem(d,k,p[0],p[1])})}
  /* Portale zu Welt 2 und 3 an Straßenenden */
  {const WCOL=[{ring:'#8e5bd6',d:['#4cc3ff','#ff5fa8','#ffffff']},{ring:'#d54291',d:['#ffe066','#4cc3ff','#ffffff']}],ends=[[1891,1270],[2296,590]];
   ends.forEach((e,k)=>{const f=mpFindFree(e[0],e[1],7,40,true)||[mwx(e[0]),mwz(e[1])],g=portal(f[0],8,f[1]);sc.remove(g);g.rotation.y=0;
     g.children[0].material.color.set(WCOL[k].ring);g.children[0].material.emissive.set(WCOL[k].ring);[1,2,3].forEach(i=>g.children[i].material.color.set(WCOL[k].d[i-1]));g.userData.noBake=true;W0.add(g);
     const beam=new THREE.Mesh(new THREE.CylinderGeometry(3,3,90,16,1,true),BM(WCOL[k].ring,{transparent:true,opacity:0,side:THREE.DoubleSide,depthWrite:false,fog:false}));beam.position.set(f[0],45,f[1]);beam.userData.noBake=true;beam.userData.noOutline=true;W0.add(beam);
     HUB.portals.push({x:f[0],z:f[1],world:k+2,g,beam,node:0,col:WCOL[k].ring})})}
  /* Küstenrennen: Torbogen an der Westpromenade (die breite Diagonale), Fahrt durch das Tor startet das Rennen */
  {const gp=mpNearRoad(1768,1560),X=mwx(gp.x),Z=mwz(gp.y),tx=gp.tx,tz=gp.ty,nx=-tz,nz=tx,half=Math.max(gp.w,MP.RW)*MP.SC/2+1.4,ry=-Math.atan2(tz,tx);
   const mat=a=>new THREE.MeshStandardMaterial({color:a[0],emissive:a[1]||'#000000',emissiveIntensity:a[1]?.8:0,roughness:.6}),pk=mat(['#ff5fa8','#ff5fa8']);
   [-1,1].forEach(s=>{const m=new THREE.Mesh(BX,pk);m.scale.set(2.2,13,2.2);m.position.set(X+nx*half*s,1.3+6.5,Z+nz*half*s);m.castShadow=true;m.userData.noBake=true;add(m);addOutlines(m,'prop');mpMarkDisc(m.position.x,m.position.z,1.4)});
   const bm=new THREE.Mesh(BX,mat(['#2a2040']));bm.scale.set(2,2.8,half*2+2.4);bm.position.set(X,1.3+13.4,Z);bm.rotation.y=ry-Math.PI/2*0;bm.rotation.y=-Math.atan2(nz,nx)+Math.PI/2*0;bm.userData.noBake=true;add(bm);
   const sg=new THREE.Mesh(new THREE.PlaneGeometry(10.4,2.6),signMat('KÜSTEN-RENNEN','#ffe066','#1a1030'));sg.position.set(X+tx*1.1,1.3+13.4,Z+tz*1.1);sg.rotation.y=Math.atan2(tx,tz);sg.userData.noBake=true;add(sg);
   const sg2=sg.clone();sg2.position.set(X-tx*1.1,1.3+13.4,Z-tz*1.1);sg2.rotation.y=Math.atan2(-tx,-tz);add(sg2);
   HUB.gate={x:X,z:Z,r:Math.max(5,half+1)}}
  /* Südbrücke zum Festland: vorerst gesperrt, Baustellen-Absperrung quer über die Fahrbahn, Brücke ist unbegehbar */
  {const SX=4.5,SZ=190.5,HW=6.8,mat=c=>new THREE.MeshStandardMaterial({color:c,roughness:.7}),red=mat('#e8452c'),wht=mat('#f6efe6'),pst=mat('#4a4458'),lamp=new THREE.MeshBasicMaterial({color:'#ffd23a'});
   const box=(m,w,h,d,x,y,z)=>{const o=new THREE.Mesh(BX,m);o.scale.set(w,h,d);o.position.set(x,y,z);o.castShadow=true;add(o);return o};
   for(let i=0;i<14;i++){const x=SX-HW+i*(2*HW/14)+HW/14,m=i%2?wht:red;box(m,2*HW/14+.02,.45,.18,x,1.3+1.55,SZ);box(m,2*HW/14+.02,.45,.18,x,1.3+.8,SZ)}
   [-HW,-HW/2,0,HW/2,HW].forEach(dx=>box(pst,.25,2.1,.25,SX+dx,1.3+1.05,SZ+.15));
   [-HW,HW].forEach(dx=>{const l=new THREE.Mesh(new THREE.SphereGeometry(.28,10,8),lamp);l.position.set(SX+dx,1.3+2.35,SZ);l.userData.noBake=true;add(l)});
   const sg=new THREE.Mesh(new THREE.PlaneGeometry(6.4,1.6),signMat('BAUSTELLE','#1a1030','#ffd23a'));sg.position.set(SX,1.3+3.3,SZ-.4);sg.rotation.y=Math.PI;sg.userData.noBake=true;add(sg);
   box(pst,.25,3.4,.25,SX-2.2,1.3+1.7,SZ-.4);box(pst,.25,3.4,.25,SX+2.2,1.3+1.7,SZ-.4);
   mpMarkRect(SX,(SZ+330)/2,HW+1.2,(330-SZ)/2+2,0);HUB.southBlocked=true}
  mpDressUp(add);
  return {rail,lamps}}

/* Gegenstand der Atoll-Quest mit Ring und Strahl */
function placeItem(d,k,ix,iz){
  const g=new THREE.Group();const mt=(c,e)=>new THREE.MeshStandardMaterial({color:c,roughness:.5,emissive:e||'#000000',emissiveIntensity:e?.35:0});
     const add2=(geo,m,x,y,z,sx=1,sy=1,sz=1,rx=0,ry=0,rz=0)=>{const o=new THREE.Mesh(geo,m);o.position.set(x,y,z);o.scale.set(sx,sy,sz);o.rotation.set(rx,ry,rz);o.castShadow=true;g.add(o);return o};
     if(d.id==='funk'){add2(BX,mt('#fff6ea','#fff6ea'),0,0,0,2.4,.16,3,.1,0,.1);add2(BX,mt(d.col,d.col),0,.12,-1.3,2.4,.12,.5,.1,0,.1);for(let q=0;q<4;q++)add2(BX,mt('#1a1626'),q%2?.2:0,.16,-.4+q*.6,q%2?1.2:1.8,.06,.14,.1,0,.1)}
     else if(d.id==='schraube'){add2(CY,mt(d.col,d.col),0,0,0,.6,2.6,.6,0,0,Math.PI/2);add2(CY,mt('#cfcfe0'),2.1,0,0,.2,2.2,.2,0,0,Math.PI/2);add2(BX,mt('#cfcfe0'),3.2,0,0,.3,.7,.12)}
     else if(d.id==='usb'){add2(BX,mt('#2a3a8a'),0,0,0,1.5,.7,3);add2(BX,mt('#cfcfe0'),0,0,1.9,1.1,.5,1.2);add2(SP,mt('#7be0a0','#7be0a0'),0,.45,-.8,.2,.12,.2)}
     else if(d.id==='handbuch'){add2(BX,mt(d.col,d.col),0,0,0,2.6,.7,3.4);add2(BX,mt('#fff6ea'),.1,0,0,2.3,.55,3.1);add2(BX,mt('#ff5f5f'),.9,.4,1.1,.35,.1,1.2)}
     else{add2(BX,mt('#fff6ea','#fff6ea'),0,0,0,1.8,.1,3.2);add2(BX,mt(d.col,d.col),0,.08,-.8,1.8,.1,.8);add2(CY,mt('#ffe066','#ffe066'),0,.1,.9,.5,.08,.5)}
     const G0=hillG(ix,iz);g.scale.setScalar(1.25);g.position.set(ix,4.2+G0,iz);g.userData.noBake=true;g.userData.tier='actor';W0.add(g);
     const ring=new THREE.Mesh(new THREE.RingGeometry(1.8,2.5,28),BM(d.col,{transparent:true,opacity:.8,side:THREE.DoubleSide,depthWrite:false}));ring.rotation.x=-Math.PI/2;ring.position.set(ix,1.65+G0,iz);ring.userData.noBake=true;ring.userData.noOutline=true;W0.add(ring);
     const beam=new THREE.Mesh(new THREE.CylinderGeometry(.9,.9,26,12,1,true),BM(d.col,{transparent:true,opacity:0,side:THREE.DoubleSide,depthWrite:false,fog:false}));beam.position.set(ix,14+G0,iz);beam.userData.noBake=true;beam.userData.noOutline=true;W0.add(beam);
     const got=INV.items.has(d.id);g.visible=!got;ring.visible=!got;
     HUB.items.push({def:d,g,ring,beam,x:ix,z:iz,got,ph:k*1.3,G0})
}

/* ---------- Quest-Orte, Unterwelt-Eingang, Graffiti-Wände, Himmel, Minikarte ---------- */
function mpQuestPlaces(H){
  /* Serafin sitzt am Kopf der Bay Bridge auf dem Bürgersteig */
  {const f=mpFindFree(2136,1668,1.4,30,false)||[HUB.sx,HUB.sz+30],bx0=f[0],bz0=f[1],bg=new THREE.Group();bg.position.set(bx0,1.6,bz0);bg.rotation.y=-Math.PI*.8;bg.userData.noBake=true;
    const bm=(geo,col,x,y,z,sx=1,sy=1,sz=1,rx=0)=>{const m=new THREE.Mesh(geo,new THREE.MeshStandardMaterial({color:col,roughness:.85}));m.position.set(x,y,z);m.scale.set(sx,sy,sz);m.rotation.x=rx;m.castShadow=true;bg.add(m);return m};
    bm(new THREE.CapsuleGeometry(.4,.65,4,10),'#6a5a4a',0,.85,0);bm(SP,'#e0a98a',0,1.6,.03,.3,.3,.3);bm(new THREE.SphereGeometry(1,12,7,0,Math.PI*2,0,Math.PI/2),'#4a3d33',0,1.64,0,.37,.34,.37);
    bm(new THREE.TorusGeometry(.36,.09,6,14),'#12c8c0',0,1.3,.03,1,1,1,Math.PI/2);[-1,1].forEach(s=>{bm(BX,'#4a3d33',s*.28,.32,.5,.22,.18,.8);bm(SP,'#e0a98a',s*.45,.8,.45,.12,.12,.12)});
    bm(CY,'#cfcfe0',.3,.14,.95,.2,.26,.2);bm(SP,'#12c8c0',.3,.3,.95,.07,.05,.07);
    const sg=new THREE.Mesh(new THREE.PlaneGeometry(1.7,.55),signMat('Bitte Scoops','#ffe066','#2a1a10'));sg.position.set(-.55,.65,1.15);sg.rotation.y=.25;bg.add(sg);
    W0.add(bg);addOutlines(bg,'actor');HUB.beggar={x:bx0,z:bz0,g:bg};mpMarkDisc(bx0,bz0,.9)}
  /* Gebüsch mit Leiter im Südwesten, zwischen zwei Gumpern und zwei Buchen */
  const bp=mpFindFree(1868,1672,9,60,false)||mpFindFree(1900,1660,7,80,false)||[mwx(1868),mwz(1672)],EX=bp[0],BZ=bp[1];
  {H.setCur(0,0);const leaf=[MT('#2f7a55'),MT('#3f9a68'),MT('#4fa874')],mesh=H.mesh,Y=-.3;
   [[0,1.3,-1.2,1.9,1.5],[-1.9,1,-.6,1.5,1.2],[1.8,1.1,-.8,1.6,1.3],[-.6,1.9,-1.8,1.5,1.3],[1.2,.9,.9,1.2,1.0],[-1.4,.8,.7,1.1,.9],[0,2.3,-.4,1.3,1.1]].forEach(([dx,dy,dz,rx,ry],k)=>mesh(SP,leaf[k%3],EX+dx,Y+dy,BZ+dz,0,0,0,rx,ry,rx));
   H.cyl(MT('#050308'),1.4,.1,EX,Y+.03,BZ+3);[-.5,.5].forEach(s=>mesh(BX,MT('#7a4a2a'),EX+s,Y+.6+.3,BZ+3.1,-.25,0,0,.14,2.8,.14));for(let k=0;k<4;k++)mesh(BX,MT('#8a5a3a'),EX,Y+.25+k*.62,BZ+3.3-k*.17,-.25,0,0,1.1,.1,.1);
   const oF=FSP,oH=FW.h,oA=FW.acc;FSP=new THREE.SphereGeometry(1,7,5);FCYL=6;FW.h=.97;FW.lb=.1;FW.sb=.42;FW.acc=.28;CTX='actor';
   [[EX,BZ-9],[EX,BZ+10]].forEach(([x,z],k)=>{const R2=mulberry(500+k),gp=FLORA.balloon(R2,1.7);gp.position.set(x,1.3,z);gp.rotation.y=R2()*6.28;gp.traverse(o=>{if(o.isMesh)o.castShadow=true});W0.add(gp)});CTX='stage';FCYL=10;FSP=oF;FW.h=oH;FW.acc=oA;FW.lb=0;FW.sb=0;
   [[EX-5.2,BZ-.5,1],[EX+6.8,BZ-.5,-1]].forEach(([x,z],k)=>{H.cyl(MT('#7a5a3a'),.6,5.2,x,Y+.0,z);mesh(SP,MT(k?'#6fa84a':'#5a8f3a'),x,Y+5.4+.3,z,0,0,0,3.3,2.6,3.3);mesh(SP,MT('#8fb04a'),x+(k?-.8:.8),Y+7.4+.3,z+.4,0,0,0,2.3,1.9,2.3);mesh(SP,MT('#4f7f3a'),x+(k?1:-1),Y+4.6+.3,z-.6,0,0,0,2.1,1.6,2.1)});
   mpMarkRect(EX,BZ-.8,2.6,1.9,0);mpMarkDisc(EX-5.2,BZ-.5,.9);mpMarkDisc(EX+6.8,BZ-.5,.9)}
  /* Unterwelt-Deko (nur sichtbar, wenn man unten ist) */
  const UWg=new THREE.Group();UWg.visible=false;UWg.userData.noBake=true;W0.add(UWg);const R3=mulberry(31337),pool=HUB.spotPool=mpSpotPool();
  HUB.uw={bx:EX,bz:BZ,g:UWg,drone:0};
  {const SMt=(c,em,ei)=>new THREE.MeshStandardMaterial({color:c,roughness:.8,emissive:em||'#000000',emissiveIntensity:em?(ei||.8):0});
   const stone=SMt('#46586a'),pump=SMt('#ff7a1a','#ff5a00',.7),teal=SMt('#12c8c0','#12c8c0',.9),stem=SMt('#12c8c0','#0a8f8a',.5);
   const add=(geo,mat,x,y,z,rx=0,ry=0,rz=0,sx=1,sy=1,sz=1)=>{const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);m.rotation.set(rx,ry,rz);m.scale.set(sx,sy,sz);m.castShadow=true;UWg.add(m);return m};
   let gi=0;const next=()=>{const p=pool[gi++%pool.length];return p};
   for(let k=0;k<46;k++){const [x,z]=next(),nr=mpNearRoad(mux(x),muy(z)),yaw=nr?Math.atan2(nr.tx,nr.ty)+Math.PI/2+(R3()-.5)*.5:0,y=1.6;
     add(BX,stone,x,y+.75,z,0,yaw,0,1.0,1.5,.34);const top=add(new THREE.CylinderGeometry(.5,.5,.34,10),stone,x,y+1.5,z);top.rotation.set(Math.PI/2,0,yaw);
     if(k%2===0){add(BX,teal,x,y+.95,z,0,yaw,0,.09,.5,.38);add(BX,teal,x,y+1.0,z,0,yaw,0,.38,.09,.38)}if(k%4===1)add(SP,pump,x+(R3()-.5)*1.2,y+.38,z+.8,0,0,0,.45,.36,.45)}
   for(let k=0;k<30;k++){const [x,z]=next(),y=1.6,sc2=.9+R3()*.7,yaw=R3()*6.28,gp=new THREE.Group();gp.position.set(x,y+.55*sc2,z);gp.rotation.y=yaw;gp.scale.setScalar(sc2);UWg.add(gp);
     const pm=(geo,mat,px,py,pz,sx,sy,sz)=>{const m=new THREE.Mesh(geo,mat);m.position.set(px,py,pz);m.scale.set(sx,sy,sz);m.castShadow=true;gp.add(m)};
     pm(SP,pump,0,0,0,.8,.65,.8);pm(BX,stem,0,.62,0,.12,.28,.12);[-1,1].forEach(q=>pm(BX,teal,q*.27,.12,.7,.16,.16,.06));pm(BX,teal,0,-.18,.72,.5,.1,.06)}
   /* Kabel zwischen benachbarten Laternen */
   const L=HUB.lamps||[];let n=0;for(let i=0;i<L.length-1&&n<26;i+=3){const a=L[i],b=L[i+1],d=Math.hypot(a[0]-b[0],a[1]-b[1]);if(d<8||d>40)continue;
     const p1=new THREE.Vector3(a[0],1.6+6.2,a[1]),p2=new THREE.Vector3(b[0],1.6+6.2,b[1]),mid=p1.clone().lerp(p2,.5);mid.y-=2.2+R3()*1.2;
     UWg.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([p1,mid,p2]),16,.11,6,false),teal));n++}
   /* Code-Regen */
   const NR=520,pos=new Float32Array(NR*3);for(let q=0;q<NR;q++){pos[q*3]=(R3()-.5)*360;pos[q*3+1]=2+R3()*70;pos[q*3+2]=(R3()-.5)*420+HUB.sz}
   const rg=new THREE.BufferGeometry();rg.setAttribute('position',new THREE.BufferAttribute(pos,3));const rain=new THREE.Points(rg,new THREE.PointsMaterial({color:'#2de0d0',size:2.6,sizeAttenuation:false,transparent:true,opacity:.85,depthWrite:false,fog:false}));rain.frustumCulled=false;UWg.add(rain);HUB.uw.rain=rain;
   /* Turm Tarxarox an der Nordspitze (freie Fläche suchen), oben der gefangene Geist */
   const tp=mpFindFree(2292,606,9,60,false)||mpFindFree(2250,640,9,60,false)||mpFindFree(2120,1990,9,80,false)||[mwx(2290),mwz(610)],TX=tp[0],TZ=tp[1],TOP=36,tw=SMt('#0b3a44','#0b3a44',.25),ring=SMt('#2de0d0','#2de0d0',1),orange=SMt('#ff7a1a','#ff5a00',.9),purple=SMt('#2a1450','#4b1f8a',.35);
   add(new THREE.CylinderGeometry(3.4,4.6,TOP-1.3,14),tw,TX,1.3+(TOP-1.3)/2,TZ);
   for(let k=0;k<7;k++)add(new THREE.TorusGeometry(1,.16,6,24),ring,TX,5+k*4.6,TZ,Math.PI/2,0,0,3.9-k*.1,3.9-k*.1,3.9-k*.1);
   add(new THREE.CylinderGeometry(8,6,1,16),purple,TX,TOP-.3,TZ);for(let k=0;k<10;k++){const a=k/10*Math.PI*2;add(SP,orange,TX+Math.cos(a)*7.4,TOP+.5,TZ+Math.sin(a)*7.4,0,0,0,.55,.5,.55)}
   for(let k=0;k<6;k++){const a=k/6*Math.PI*2;add(BX,ring,TX+Math.cos(a)*2.3,TOP+2.4,TZ+Math.sin(a)*2.3,0,-a,0,.12,4.6,.12)}
   add(new THREE.TorusGeometry(1,.1,6,24),ring,TX,TOP+4.8,TZ,Math.PI/2,0,0,2.3,2.3,2.3);add(new THREE.TorusGeometry(1,.1,6,24),ring,TX,TOP+.2,TZ,Math.PI/2,0,0,2.3,2.3,2.3);
   add(new THREE.TorusGeometry(1,.14,6,22),orange,TX,1.3+.12,TZ-9,Math.PI/2,0,0,3,3,3);
   const sgn=new THREE.Mesh(new THREE.PlaneGeometry(9,2.2),signMat('TARXAROX','#2de0d0','#07070d'));sgn.position.set(TX,1.3+7,TZ-4.7);sgn.rotation.y=Math.PI;UWg.add(sgn);
   const gh=new THREE.Group();gh.position.set(TX,TOP+2.5,TZ);UWg.add(gh);const gm=SMt('#9ff6ee','#2de0d0',.9);gm.transparent=true;gm.opacity=.8;
   const gp2=(geo,x,y,z,sx,sy,sz)=>{const m=new THREE.Mesh(geo,gm);m.position.set(x,y,z);m.scale.set(sx,sy,sz);gh.add(m)};
   gp2(new THREE.CapsuleGeometry(.4,.9,4,10),0,0,0,1.5,1.5,1.5);gp2(new THREE.SphereGeometry(1,12,8,0,Math.PI*2,0,Math.PI/2),0,1.1,0,.75,.62,.75);gp2(new THREE.ConeGeometry(.55,1.3,10),0,-1.1,0,1.5,1.2,1.5);
   [-1,1].forEach(s=>{const e=new THREE.Mesh(SP,SMt('#07070d'));e.position.set(s*.28,.75,.55);e.scale.set(.12,.16,.08);gh.add(e)});
   HUB.uw.tower={x:TX,z:TZ,top:TOP};HUB.uw.ghost=gh;HUB.uw.rel=0;
   HUB.colliders.push({x0:TX-4.8,x1:TX+4.8,z0:TZ-4.8,z1:TZ+4.8,top:TOP-1,uw:1},{x0:TX-7.5,x1:TX+7.5,z0:TZ-7.5,z1:TZ+7.5,top:TOP-.4,walk:TOP,uw:1})}
  /* Graffiti-Wände auf freien Flächen an den Straßen, weit auseinander */
  {HUB.graf={panels:[]};const cands=[];MAPD.roads.forEach(r=>{const wM=Math.max(r.w,MP.RW)*MP.SC;mpResample(r.pts,12).forEach(s=>{if(!(s.tx||s.tz))return;for(const side of [1,-1]){const off=wM/2+MP.SWK+1.6,x=s.x-s.tz*side*off,z=s.z+s.tx*side*off;
      let ok=true;for(let t=-8;t<=8;t+=2){const px=x+s.tx*t,pz=z+s.tz*t;if(![1,3,4].includes(mpAt(px,pz))||![1,3,4].includes(mpAt(px-s.tz*side*1.5,pz+s.tx*side*1.5))){ok=false;break}}
      if(ok&&z<300&&Math.hypot(x-HUB.sx,z-HUB.sz)>35)cands.push({x,z,tx:s.tx,tz:s.tz,side})}})});
   const picks=[];for(let k=0;k<5&&cands.length;k++){let best=null,bd=-1;cands.forEach(c=>{const d=picks.length?Math.min(...picks.map(p=>Math.hypot(p.x-c.x,p.z-c.z))):Math.hypot(c.x-HUB.sx,c.z-HUB.sz);if(d>bd){bd=d;best=c}});picks.push(best)}
   picks.forEach((c,i)=>{const id='w'+(i+1),cv=document.createElement('canvas');cv.width=128;cv.height=64;const cx=cv.getContext('2d');cx.imageSmoothingEnabled=false;
     cx.fillStyle='#2b2840';cx.fillRect(0,0,128,64);for(let q=0;q<300;q++){cx.fillStyle=q%3?'#322e4a':'#262338';cx.fillRect(Math.floor(Math.random()*128),Math.floor(Math.random()*64),2,1)}cx.fillStyle='#4a4468';cx.font='700 9px sans-serif';cx.textAlign='center';cx.fillText('HIER SPRÜHEN',64,34);
     const tex=new THREE.CanvasTexture(cv);tex.magFilter=THREE.NearestFilter;tex.minFilter=THREE.NearestFilter;tex.generateMipmaps=false;tex.colorSpace=THREE.SRGBColorSpace;
     const ry=Math.atan2(-c.tz*c.side*-1,c.tx*c.side)*0;const nxx=c.tz*c.side*-1*-1,nzz=-c.tx*c.side*-1*-1;
     /* Blickrichtung zur Straße: Normale zeigt von der Wand zur Straße */
     const fx=c.tz*c.side,fz=-c.tx*c.side,yaw=Math.atan2(fx,fz),yc=1.3+5.4;
     const pl=new THREE.Mesh(new THREE.PlaneGeometry(16,8),new THREE.MeshBasicMaterial({map:tex})),fr=new THREE.Mesh(new THREE.PlaneGeometry(16.8,8.8),new THREE.MeshBasicMaterial({color:'#0e0b18'})),slab=new THREE.Mesh(BX,MT('#5a4a8a'));
     pl.position.set(c.x+fx*.45,yc,c.z+fz*.45);fr.position.set(c.x+fx*.4,yc,c.z+fz*.4);pl.rotation.y=fr.rotation.y=yaw;slab.scale.set(17,9.4,.7);slab.position.set(c.x,1.3+4.7,c.z);slab.rotation.y=yaw;
     [pl,fr,slab].forEach(o=>{o.userData.noBake=true;o.userData.noOutline=true;W0.add(o)});mpMarkRect(c.x,c.z,8.5,.6,Math.atan2(c.tz,c.tx)*-1+0);
     const p={id,x:c.x,z:c.z,ry:yaw,cv,ctx:cx,tex,ax:c.x+fx*5.2,az:c.z+fz*5.2};HUB.graf.panels.push(p);grafLoadPanel(p)})}
}
function mpSky(){const skyG=new THREE.Group();skyG.userData.noBake=true;W0.add(skyG);HUB.sky=skyG;
  for(let i=0;i<12;i++){const s=skySprite(SKYTEXF[i%4],320,160,false,hazeK(340));const az=i/12*Math.PI*2;s.position.set(Math.cos(az)*340,75-24,Math.sin(az)*340);skyG.add(s)}
  addVictorians(skyG,[[10,292,190,76,30,.4,.1,120],[9,240,170,68,23,.16,.5,160]]);
  [[-120,48,-130],[40,56,-170],[150,44,-100],[-160,52,60],[90,50,160],[-30,60,150]].forEach(([x,y,z])=>{const c=makeCloud(x,y,z,90,Math.floor(Math.abs(x))%4,0);sc.remove(c);W0.add(c)})}
/* Minikarte: ausschnitt um den Spieler, Norden oben, 150 px = 300 m */
function mpMiniBase(){const S=.25,P=MP.PLAY,w=Math.ceil((P.x1-P.x0)*S),h=Math.ceil((P.y1-P.y0)*S),c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d');
  g.scale(S,S);g.translate(-P.x0,-P.y0);g.fillStyle='#1cafd1';g.fillRect(P.x0,P.y0,P.x1-P.x0,P.y1-P.y0);
  const ring=c=>{g.beginPath();c.forEach(r=>{r.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.closePath()})},fill=(list,col)=>{g.fillStyle=col;list.forEach(it=>{ring(it.c);g.fill('evenodd')})};
  fill(MAPD.land,'#e9cb92');fill(MAPD.parks,'#6cbe45');fill(MAPD.lots,'#d8d8d8');fill(MAPD.courts,'#c2922c');fill(MAPD.water,'#03aee5');
  g.strokeStyle='#fff';g.lineCap='butt';g.lineJoin='round';MAPD.roads.forEach(r=>{g.lineWidth=Math.max(r.w,MP.RW)*1.15;g.beginPath();r.pts.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.stroke()});
  fill(MAPD.buildings,'#f59ebb');
  MAPD.rail.forEach(r=>{g.strokeStyle='#ed2024';g.lineWidth=7;g.setLineDash(r.dash?[10,10]:[]);g.beginPath();r.pts.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.stroke()});
  return {c,S}}
function mpMini(dt){const mm=HUB.mapn&&HUB.mm2;if(!mm)return;HUB.mmT+=dt;if(HUB.mmT<.12)return;HUB.mmT=0;const cv=$('mini');if(!cv)return;cv.classList.toggle('on',G.phase==='play');
  const g=cv.getContext('2d'),S=mm.S,P0=MP.PLAY,ux=mux(P.x),uy=muy(P.z);g.setLineDash([]);g.fillStyle='#1cafd1';g.fillRect(0,0,150,150);
  g.drawImage(mm.c,(ux-P0.x0)*S-75,(uy-P0.y0)*S-75,150,150,0,0,150,150);
  if(G.under){g.fillStyle='rgba(8,6,20,.62)';g.fillRect(0,0,150,150)}
  const pp=(X,Z)=>[75+(X-P.x)*.5,75+(Z-P.z)*.5],inside=(x,y)=>x>-4&&y>-4&&x<154&&y<154;
  const dot=(X,Z,col,txt,rad)=>{const [x,y]=pp(X,Z);if(!inside(x,y))return;g.fillStyle=col;g.strokeStyle='#1a1626';g.lineWidth=1.5;g.beginPath();g.arc(x,y,rad||5,0,7);g.fill();g.stroke();if(txt){g.fillStyle='#fff';g.font='700 9px sans-serif';g.textAlign='center';g.fillText(txt,x,y+3)}};
  if(!G.under){(HUB.shops||[]).forEach(s=>{const [x,y]=pp(s.x,s.z);if(!inside(x,y))return;g.fillStyle='#2b5fcf';g.strokeStyle='#f4f7ff';g.lineWidth=1.5;g.fillRect(x-5,y-5,10,10);g.strokeRect(x-5,y-5,10,10);g.fillStyle='#fff';g.font='700 9px sans-serif';g.textAlign='center';g.fillText('P',x,y+3)});
    HUB.portals.forEach(p=>{if(HUB.found.has(p.world))dot(p.x,p.z,p.col,p.world,5)});if(HUB.gate)dot(HUB.gate.x,HUB.gate.z,'#ffe066','K',6);
    HUB.items.forEach(it=>{if(it.got){const [x,y]=pp(it.x,it.z);if(!inside(x,y))return;g.fillStyle=it.def.col;g.strokeStyle='#1a1626';g.lineWidth=1;g.beginPath();g.moveTo(x,y-4);g.lineTo(x+4,y);g.lineTo(x,y+4);g.lineTo(x-4,y);g.closePath();g.fill();g.stroke()}})}
  else if(HUB.uw){const U=HUB.uw;dot(U.bx,U.bz,'#2de0d0','L',6);
    if(U.tower&&typeof BQ!=='undefined'&&BQ.gave&&!BQ.released){const pulse=.5+.5*Math.sin(G.t*4),[tx,ty]=pp(U.tower.x,U.tower.z);let X=tx,Y=ty;if(!inside(X,Y)){const dx=tx-75,dy=ty-75,k=66/Math.max(Math.abs(dx),Math.abs(dy));X=75+dx*k;Y=75+dy*k}
      g.setLineDash([4,4]);g.strokeStyle='rgba(255,122,26,.85)';g.lineWidth=2;g.beginPath();g.moveTo(75,75);g.lineTo(X,Y);g.stroke();g.setLineDash([]);
      g.fillStyle='rgba(255,122,26,'+(.35+.35*pulse)+')';g.beginPath();g.arc(X,Y,8+4*pulse,0,7);g.fill();g.fillStyle='#ff7a1a';g.strokeStyle='#07070d';g.lineWidth=2;g.beginPath();g.arc(X,Y,6,0,7);g.fill();g.stroke();g.fillStyle='#07070d';g.font='700 9px sans-serif';g.textAlign='center';g.fillText('T',X,Y+3)}}
  g.save();g.translate(75,75);g.rotate(P.h);g.fillStyle='#ff5fa8';g.strokeStyle='#fff';g.lineWidth=1.5;g.beginPath();g.moveTo(7,0);g.lineTo(-5,-4.5);g.lineTo(-3,0);g.lineTo(-5,4.5);g.closePath();g.fill();g.stroke();g.restore();
  g.strokeStyle='#fff0b0';g.lineWidth=2;g.strokeRect(1,1,148,148)}

function portLupoFinish(H){
  mpQuestPlaces(H);
  HUB.bgroups.forEach(gp=>bakeGroup(gp));bakeGroup(W0);
  buildAtollQuestObjects();buildGingerLights();
  mpSky();
  HUB.cones.forEach(c=>addOutlines(c.o,'prop'));HUB.portals.forEach(p=>addOutlines(p.g,'actor'));HUB.items.forEach(it=>addOutlines(it.g,'actor'));
  HUB.mm2=mpMiniBase();HUB.mmT=0;HUB.built=true;try{grafInitWorld()}catch(e){console.log('graf',e)}}

/* ---------- Bewegung: Wasser und Gebäude über das Raster, Seitwärts-Gleiten an Kanten ---------- */
function mpOk(X,Z){const r=.9;return mpWalk(X,Z)&&mpWalk(X+r,Z)&&mpWalk(X-r,Z)&&mpWalk(X,Z+r)&&mpWalk(X,Z-r)}
/* Rückstoß in kleinen Schritten, bleibt vor Wänden und Wasser stehen */
function mpPush(dx,dz){for(let i=1;i<=6;i++){const x=P.x+dx/6,z=P.z+dz/6;if(!mpOk(x,z))break;P.x=x;P.z=z}}
/* Steckt man in einem Gebäude fest, an die nächste freie Stelle setzen */
function mpUnstick(){for(let d=1;d<=40;d++)for(let a=0;a<24;a++){const x=P.x+Math.cos(a/24*6.283)*d,z=P.z+Math.sin(a/24*6.283)*d;if(mpOk(x,z)){P.x=x;P.z=z;P.speed=0;return true}}return false}
function mpMove(ox,oz){if(mpOk(P.x,P.z))return;if(!mpOk(ox,oz)){mpUnstick();return}const nx=P.x,nz=P.z;let hit=true;
  if(mpOk(nx,oz)){P.z=oz}else if(mpOk(ox,nz)){P.x=ox}else{P.x=ox;P.z=oz}
  const mv=Math.hypot(P.x-ox,P.z-oz);if(mv>.01){const tang=Math.atan2(P.z-oz,P.x-ox);let d=tang-P.h;d=Math.atan2(Math.sin(d),Math.cos(d));P.h+=d*.35}
  P.speed*=.93;if(P.speed>2.5&&G.t-(P.lastBump||0)>.4){SFX.thud();G.shake=Math.max(G.shake,.15);P.lastBump=G.t}}
/* Bordstein-Grind entlang der Straßenkanten */
function mpGrindEdges(){if(MP.edges)return MP.edges;const E=[];MAPD.roads.forEach(r=>{const wM=Math.max(r.w,MP.RW)*MP.SC,rs=mpResample(r.pts,5);for(let i=0;i<rs.length-1;i++){const a=rs[i],b=rs[i+1],dx=b.x-a.x,dz=b.z-a.z,L=Math.hypot(dx,dz);if(L<1)continue;const tx=dx/L,tz=dz/L;
  for(const side of [1,-1]){const off=wM/2,ox=-tz*side*off,oz=tx*side*off,mx=(a.x+b.x)/2+ox,mz=(a.z+b.z)/2+oz;if(mpAt(mx-tz*side*1.4,mz+tx*side*1.4)===3)E.push({ax:a.x+ox,az:a.z+oz,tx,tz,L})}}});MP.edges=E;return E}
function mpGrindTry(){if(GR.on||LV.id!==0||G.phase!=='play'||P.speed<3.2||P.y<1.62||P.y>2.35||P.vy>3||G.t-GR.lastEnd<.35)return false;
  const hx=Math.cos(P.h),hz=Math.sin(P.h);for(const e of mpGrindEdges()){const rx=P.x-e.ax,rz=P.z-e.az,al=rx*e.tx+rz*e.tz;if(al<1||al>e.L-1)continue;const perp=Math.abs(-rx*e.tz+rz*e.tx);if(perp>1.1)continue;const dot=hx*e.tx+hz*e.tz;if(Math.abs(dot)<.8)continue;
    GR.on=true;GR.seg=e;GR.dir=Math.sign(dot)||1;GR.t=0;GR.spark=0;SFX.whoosh();toast('CURB GRIND!',700);return true}return false}
function mpGrindStep(dt){const e=GR.seg;GR.t+=dt;const rx=P.x-e.ax,rz=P.z-e.az,al=rx*e.tx+rz*e.tz;P.x=e.ax+e.tx*al;P.z=e.az+e.tz*al;
  let d=Math.atan2(e.tz*GR.dir,e.tx*GR.dir)-P.h;d=Math.atan2(Math.sin(d),Math.cos(d));P.h+=d*Math.min(1,dt*12);P.y=1.66;P.vy=0;P.coy=0;P.speed*=Math.pow(.985,dt*60);
  GR.spark-=dt;if(GR.spark<=0){GR.spark=.09;burst(P.x,1.8,P.z,5);tone(200+Math.random()*60,.09,'sawtooth',.03)}
  if(al<.5||al>e.L-.5){const nxt=mpGrindEdges().find(q=>q!==e&&Math.hypot(q.ax-(e.ax+e.tx*(GR.dir>0?e.L:0)),q.az-(e.az+e.tz*(GR.dir>0?e.L:0)))<1.6&&q.tx*e.tx+q.tz*e.tz>.9);if(nxt){GR.seg=nxt}else grindEnd(false);return}
  if(P.speed<2.2||(K.left||K.right)&&GR.t>.25)grindEnd(false)}
