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
  items.forEach((it,k)=>{const r=fn(it);q.setFromEuler(e.set(0,r.ry||0,0));s.set(r.sx,r.sy,r.sz);p.set(r.x,r.y,r.z);m4.compose(p,q,s);im.setMatrixAt(k,m4)});im.count=items.length;im.instanceMatrix.needsUpdate=true;im.castShadow=!!mat.userData&&false;im.receiveShadow=true;im.frustumCulled=false;im.userData.noBake=true;im.userData.noOutline=true;return im}
function mpTerrain(add){
  /* Meer */
  {const g=new THREE.PlaneGeometry(7000,7000);g.rotateX(-Math.PI/2);const m=new THREE.Mesh(g,new THREE.MeshStandardMaterial({color:'#1cafd1',roughness:.25,metalness:.1}));m.position.set(0,1.0,0);m.userData.noBake=true;m.userData.noOutline=true;m.receiveShadow=true;add(m)}
  /* Land (angehoben, mit sichtbarer Kante) */
  MAPD.land.forEach(it=>{const geo=new THREE.ExtrudeGeometry(mpShape(it.c),{depth:.7,bevelEnabled:false});geo.rotateX(-Math.PI/2);const m=new THREE.Mesh(geo,mpMat('land','#dccaa0'));m.position.y=.6;m.receiveShadow=true;m.userData.noBake=true;add(m)});
  mpFlat(MAPD.parks,1.31,mpMat('park','#4fa874'),add);mpFlat(MAPD.lots,1.31,mpMat('lot','#8d93a0'),add);mpFlat(MAPD.courts,1.315,mpMat('court','#c98a4a'),add);
  mpFlat(MAPD.water,1.34,new THREE.MeshStandardMaterial({color:'#1cafd1',roughness:.3,metalness:.1}),add);
  /* Straßen */
  const asphalt=mpMat('road','#4a3f66'),dash=[],sw=[],bridge=[],pier=[];
  MAPD.roads.forEach(r=>{const wU=Math.max(r.w,MP.RW),wM=wU*MP.SC,pts=r.pts.map(p=>[mwx(p[0]),mwz(p[1])]);
    const m=new THREE.Mesh(mpRibbon(pts,wM,1.32),asphalt);m.receiveShadow=true;m.userData.noBake=true;m.userData.noOutline=true;add(m);
    const rs=mpResample(r.pts,2.6);
    rs.forEach(s=>{for(const side of [1,-1]){const off=wM/2+MP.SWK/2,x=s.x-s.tz*side*off,z=s.z+s.tx*side*off;if(mpAt(x,z)===3)sw.push({x,z,ry:-Math.atan2(s.tz,s.tx)})}
      if(!mpIsLand(s.x,s.z)){bridge.push({x:s.x,z:s.z,ry:-Math.atan2(s.tz,s.tx),w:wM})}});
    if(r.w>=14){const ds=mpResample(r.pts,7);ds.forEach(s=>{if(mpAt(s.x,s.z)===2&&(s.tx||s.tz))dash.push({x:s.x,z:s.z,ry:-Math.atan2(s.tz,s.tx)})})}
    const ps=mpResample(r.pts,24);ps.forEach(s=>{if(!mpIsLand(s.x,s.z))pier.push({x:s.x,z:s.z})})});
  add(mpInstanced(BX,mpMat('sw','#cfc4e0'),sw,s=>({x:s.x,y:1.45,z:s.z,ry:s.ry,sx:3.1,sy:.3,sz:MP.SWK})));
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
function mpGenBuilding(bg,b,wall,h,idx,sign){
  const ring=b.c[0].map(p=>[mwx(p[0]),mwz(p[1])]),vp=r=>r.map(p=>new THREE.Vector2(p[0],-p[1]));
  const sh=new THREE.Shape(vp(ring));b.c.slice(1).forEach(c=>sh.holes.push(new THREE.Path(vp(c.map(p=>[mwx(p[0]),mwz(p[1])])))));
  const mk=(depth,mat,y)=>{const g=new THREE.ExtrudeGeometry(sh,{depth,bevelEnabled:false});g.rotateX(-Math.PI/2);const m=new THREE.Mesh(g,mat);m.position.y=y;m.castShadow=true;m.receiveShadow=true;bg.add(m);return m};
  mk(h,MT(wall),1.3);mk(.55,MT('#f6efe6'),1.3+h);
  const GL=MT('#7fb8d8','#7fb8d8',.25),LT=MT('#ffe9a0','#ffe9a0',.9),nf=Math.max(1,Math.floor((h-1.4)/3.3)),n=ring.length;
  const rp=mpNearRoad(b.cen[0],b.cen[1]);let sbest=null;
  for(let e=0;e<n;e++){const a=ring[e],c=ring[(e+1)%n],dx=c[0]-a[0],dz=c[1]-a[1],L=Math.hypot(dx,dz);if(L<5)continue;const ux=dx/L,uz=dz/L;let nx=uz,nz=-ux;const mx=(a[0]+c[0])/2,mz=(a[1]+c[1])/2;
    if(mpInPoly(ring,mx+nx*.4,mz+nz*.4)){nx=-nx;nz=-nz}
    if(rp){const d=Math.hypot(mx-mwx(rp.x),mz-mwz(rp.y))-(nx*(mwx(rp.x)-mx)+nz*(mwz(rp.y)-mz))*.3;if(!sbest||d<sbest.d)sbest={d,mx,mz,nx,nz,L}}
    const cnt=Math.floor((L-2)/3.4),step=(L-2)/Math.max(1,cnt);
    for(let f=0;f<nf;f++)for(let k=0;k<cnt;k++){const t=1+step*(k+.5),m=new THREE.Mesh(BX,((f*7+k*3+idx+e)%5<2)?LT:GL);m.scale.set(1.7,1.9,.14);m.position.set(a[0]+ux*t+nx*.07,1.3+1.5+f*3.3+.95,a[1]+uz*t+nz*.07);m.rotation.y=-Math.atan2(uz,ux);bg.add(m)}}
  /* Dachaufbauten */
  const cen=[mwx(b.cen[0]),mwz(b.cen[1])];if(mpInPoly(ring,cen[0],cen[1])){const m=new THREE.Mesh(BX,MT('#b9bdc9'));m.scale.set(3.2,1.1,2.4);m.position.set(cen[0],1.3+h+.55+.55,cen[1]);bg.add(m)}
  if(sign&&sbest){const w=Math.min(12,Math.max(5.5,sbest.L*.7)),sg=new THREE.Mesh(new THREE.PlaneGeometry(w,w*.24),signMat(sign,'#ffe066','#1a1030'));sg.position.set(sbest.mx+sbest.nx*.25,1.3+Math.min(h-1.6,5.8),sbest.mz+sbest.nz*.25);sg.rotation.y=Math.atan2(sbest.nx,sbest.nz);sg.userData.noBake=true;sg.userData.noOutline=true;bg.add(sg)}
  return ring}
function mpBuildings(H){
  const solids=[],groups=[];const L0=MAPD.labels;
  const kindOf=t=>/P-Mart/.test(t)?'pmart':/Station/.test(t)?'station':/^Lab$/.test(t)?'lab':/X-Mas/.test(t)?'xmas':/Resort/.test(t)?'resort':/Casino/.test(t)?'casino':/Shopping/.test(t)?'shopping':/Tower/.test(t)?'tower':'';
  MAPD.buildings.forEach((b,i)=>{b.i=i;b.kind='';b.skip=false;b.cen=mpCentroid(b.c[0]);b.area=Math.abs(mpArea(b.c[0]))});
  L0.forEach(l=>{const k=kindOf(l.t);if(!k)return;MAPD.buildings.forEach(b=>{if(mpInPoly(b.c[0],l.x,l.y)){b.kind=k;b.label=l.t}})});
  const SIGN={station:'PORT LUPO STATION',casino:'MARINA CLUB CASINO',shopping:'SHOPPING COURT',resort:'BEACH RESORT',tower:'OFFICE TOWER'};
  const WALL={station:'#f6efe6',casino:'#ff5fa8',shopping:'#f6df73',resort:'#fff0d8',tower:'#2a3a6a'};
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
    const kind=b.kind;let h;switch(kind){case 'tower':h=64;break;case 'resort':h=30;break;case 'casino':h=17;break;case 'shopping':h=13;break;case 'station':h=10;break;
      default:h=aM<150?4.6:aM<500?6+(b.i*7%5):9+(b.i*5%9)}
    const bg=mkGroup(X,Z);b.bg=bg;mpGenBuilding(bg,b,WALL[kind]||MPPAST[b.i%7],h,b.i,SIGN[kind]||null);b.h=h});
  /* Café Pengu und AstroBurger an den Markern C und B */
  MAPD.markers.forEach(m=>{const lab=L0.find(l=>Math.hypot(l.x-m.x,l.y-m.y)<12&&(l.t==='C'||l.t==='B'));if(!lab)return;const yaw=mpFrontYaw(m.x,m.y),X=mwx(m.x),Z=mwz(m.y);
    if(lab.t==='C'){const bg=mkGroup(X,Z);mpStamp(H,()=>H.TYPES[2](0),X,Z,yaw,bg,1);solids.push({x:m.x,y:m.y,a:0,r:19});HUB.cafe={x:X,z:Z,ux:m.x,uy:m.y,yaw}}
    else{const bg=mkGroup(X,Z);mpStamp(H,()=>H.TYPES[4](0),X,Z,yaw,bg,.8);solids.push({x:m.x,y:m.y,a:0,r:17});HUB.burger={x:X,z:Z,ux:m.x,uy:m.y,yaw}}});
  return solids}

/* ---------- S-Bahn (oberirdisch, rot durchgezogen) mit Tunnelmund; gestrichelt = unterirdisch ---------- */
function mpRail(add){
  /* Stücke zu einer Linie verbinden: Start ist das Stück, das am weitesten südlich beginnt */
  const solid=MAPD.rail.filter(r=>!r.dash&&r.pts.length>1&&Math.max(...r.pts.map(p=>p[1]))>1500);
  const near=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1])<14;let chain=[];
  let cur=solid.slice().sort((a,b)=>b.pts[0][1]-a.pts[0][1])[0];if(!cur)return null;chain=cur.pts.slice();const used=new Set([cur]);
  for(let k=0;k<6;k++){const end=chain[chain.length-1],nx=solid.find(r=>!used.has(r)&&near(r.pts[0],end));if(!nx)break;used.add(nx);chain=chain.concat(nx.pts.slice(1))}
  const P=mpResample(chain,2);const pts=P.map(p=>[p.x,p.z]);
  const cum=[0];for(let i=1;i<pts.length;i++)cum.push(cum[i-1]+Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]));const L=cum[cum.length-1];
  const TY=12.5,RAMP=80,Lr=L-RAMP,yAt=s=>s<Lr?TY:Math.max(1.6,TY-(TY-1.6)*(s-Lr)/RAMP);
  const posAt=s=>{s=Math.max(0,Math.min(L-.01,s));let lo=0,hi=cum.length-1;while(hi-lo>1){const m=(lo+hi)>>1;if(cum[m]<=s)lo=m;else hi=m}const f=(s-cum[lo])/(cum[hi]-cum[lo]||1),a=pts[lo],b=pts[hi];return {x:a[0]+(b[0]-a[0])*f,z:a[1]+(b[1]-a[1])*f,h:Math.atan2(b[1]-a[1],b[0]-a[0])}};
  const step=3,N=Math.floor(L/step),items=[];for(let k=0;k<N;k++){const s=k*step+1.5,p=posAt(s);items.push({p,s})}
  const dk=mpMat('raildeck','#9a8fc0');
  add(mpInstanced(BX,dk,items,it=>({x:it.p.x,y:yAt(it.s)-.4,z:it.p.z,ry:-it.p.h,sx:3.4,sy:.8,sz:4.6})));
  const trim=new THREE.MeshStandardMaterial({color:'#ee7cb8',emissive:'#ee7cb8',emissiveIntensity:.4,roughness:.6}),rl=[];
  items.forEach(it=>{[-1,1].forEach(sd=>{const nx=-Math.sin(it.p.h),nz=Math.cos(it.p.h);rl.push({x:it.p.x+nx*sd*2.15,z:it.p.z+nz*sd*2.15,y:yAt(it.s)+.27,ry:-it.p.h})})});
  add(mpInstanced(BX,trim,rl,r=>({x:r.x,y:r.y,z:r.z,ry:r.ry,sx:3.4,sy:.55,sz:.3})));
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
function mpLamps(){const out=[];let k=0;MAPD.roads.forEach(r=>{const wM=Math.max(r.w,MP.RW)*MP.SC;mpResample(r.pts,26).forEach(s=>{if(!(s.tx||s.tz))return;const side=(k++%2)?1:-1,off=wM/2+MP.SWK*.5,x=s.x-s.tz*side*off,z=s.z+s.tx*side*off;if(mpAt(x,z)===3)out.push([x,z])})});return out}

/* ---------- Gesamtaufbau ---------- */
function portLupoNew(H){
  HUB.bgroups=[];HUB.cones=[];HUB.portals=[];HUB.items=[];HUB.clappers=[];HUB.colliders=[];HUB.mm=null;HUB.mapn=true;
  const add=o=>W0.add(o);
  const solids=mpBuildings(H);mpBuildMask(solids);
  mpTerrain(add);
  const rail=mpRail(add);if(rail){rail.sol.forEach(p=>mpMarkDisc(p.x,p.z,1.1));mpBuildTrain(rail)}
  /* Start auf der Straße zwischen Café und Büroturm, Blick nach Norden */
  HUB.sx=mwx(2108);HUB.sz=mwz(1352);HUB.sh=-Math.PI/2;
  /* Laternen */
  const lamps=mpLamps();
  {const post=mpInstanced(CY,new THREE.MeshStandardMaterial({color:'#5a4a8a'}),lamps,p=>({x:p[0],y:1.6+2.7,z:p[1],sx:.14,sy:6,sz:.14})),head=mpInstanced(SP,new THREE.MeshBasicMaterial({color:'#fff0b0'}),lamps,p=>({x:p[0],y:1.6+6.2,z:p[1],sx:.55,sy:.55,sz:.55}));post.castShadow=true;add(post);add(head)}
  HUB.lamps=lamps;
  /* Pflanzen: die Bäume der Karte und Parks aus Regeln */
  {const oF=FSP,oH=FW.h,oA=FW.acc;FSP=new THREE.SphereGeometry(1,7,5);FCYL=6;FW.h=.97;FW.lb=.1;FW.sb=.42;FW.acc=.28;CTX='actor';
   const KS=['balloon','balloon','spiral','vine','mushroom','palm','balloon','spiral'],put=(kind,X,Z,sc2,seed)=>{const R2=mulberry(seed),gp=FLORA[kind](R2,sc2);gp.position.set(X,1.3,Z);gp.rotation.y=R2()*6.28;gp.traverse(o=>{if(o.isMesh)o.castShadow=true});add(gp)};
   MAPD.trees.forEach((t,i)=>{const X=mwx(t.x),Z=mwz(t.y);if(mpAt(X,Z)===0)return;put(KS[i%KS.length],X,Z,t.r>4?1.3:.8,i*17+3)});
   const RP=mulberry(909);MAPD.parks.forEach((pk,pi)=>{const r=pk.c[0],xs=r.map(p=>p[0]),ys=r.map(p=>p[1]),x0=Math.min(...xs),x1=Math.max(...xs),y0=Math.min(...ys),y1=Math.max(...ys),n=Math.floor(Math.abs(mpArea(r))*MP.SC*MP.SC/260);
     for(let k=0,t=0;k<n&&t<n*20;t++){const ux=x0+RP()*(x1-x0),uy=y0+RP()*(y1-y0);if(!mpInPoly(r,ux,uy))continue;const X=mwx(ux),Z=mwz(uy);if(mpAt(X,Z)!==4||!mpFree(X,Z,1.6))continue;put(KS[Math.floor(RP()*KS.length)],X,Z,.9+RP()*.4,pi*1000+k);k++}});
   /* Hohe Palmen am Straßenrand auf dem Sandstreifen (Strand), automatisch, ohne Kollision */
   {const RT=mulberry(777),cand=[];MAPD.roads.forEach(r=>{const wM=Math.max(r.w,MP.RW)*MP.SC;mpResample(r.pts,7).forEach(sm=>{if(!(sm.tx||sm.tz))return;for(const side of [1,-1]){const off=wM/2+MP.SWK+3+RT()*5,X=sm.x-sm.tz*side*off,Z=sm.z+sm.tx*side*off;
       if(Z>186||mpAt(X,Z)!==1||!mpFree(X,Z,2.2)||Math.hypot(X-HUB.sx,Z-HUB.sz)<14)continue;cand.push([X,Z,RT()])}})});
    cand.sort((a,b)=>a[2]-b[2]);const placed=[];for(const c of cand){if(placed.length>=60)break;if(placed.some(q=>Math.hypot(q[0]-c[0],q[1]-c[1])<15))continue;placed.push(c);put('palm',c[0],c[1],1.9+c[2]*.5,4000+placed.length)}HUB.tallPalms=placed.length}
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
   ends.forEach((e,k)=>{const f=mpFindFree(e[0],e[1],2.5,14,true)||[mwx(e[0]),mwz(e[1])],g=portal(f[0],8,f[1]);sc.remove(g);g.rotation.y=0;
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
  HUB.mm2=mpMiniBase();HUB.mmT=0;HUB.built=true}

/* ---------- Bewegung: Wasser und Gebäude über das Raster, Seitwärts-Gleiten an Kanten ---------- */
function mpOk(X,Z){const r=.9;return mpWalk(X,Z)&&mpWalk(X+r,Z)&&mpWalk(X-r,Z)&&mpWalk(X,Z+r)&&mpWalk(X,Z-r)}
function mpMove(ox,oz){if(mpOk(P.x,P.z))return;const nx=P.x,nz=P.z;let hit=true;
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
