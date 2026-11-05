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
/* ---------- Riesen-Saurier als NPCs: drei Wesen mit Mode-Accessoires aus den Moodboards laufen alle 2-3 Minuten über die breiten Straßen (ca. 20 m hoch) ---------- */
const GIANT={t:40,list:[],pool:{},n:0,roads:null,cur:null,SPEED:3.6,SCALE:1.62,kinds:['pink','gold','hoodie'],names:{pink:'Pink-Blob',gold:'Goldzilla',hoodie:'Hoodie-Zilla'}};
function mpBuildGiant(kind){const g=new THREE.Group(),SPH=new THREE.SphereGeometry(1,14,10),CON=new THREE.ConeGeometry(1,1,7),CYL=new THREE.CylinderGeometry(1,1,1,10);
  const M=(c,o)=>new THREE.MeshStandardMaterial({color:c,roughness:.38,...(o||{})}),skin=kind==='gold'?M('#e6b422',{metalness:.85,roughness:.28}):kind==='pink'?M('#f4a6c8'):M('#b79cf0'),belly=kind==='gold'?M('#f1c84a',{metalness:.8,roughness:.3}):kind==='pink'?M('#ffd6e8'):M('#d8c6ff'),
    yel=M('#ffd04a'),dark=M('#2a1020',{roughness:.6}),white=M('#ffffff'),black=M('#141416',{roughness:.3});
  const P=(parent,geo,mat,x,y,z,sx,sy,sz)=>{const o=new THREE.Mesh(geo,mat);o.position.set(x,y,z);o.scale.set(sx,sy,sz);o.castShadow=true;parent.add(o);return o};
  const body=new THREE.Group();g.add(body);
  P(body,SPH,skin,0,4.6,0,3.5,4.0,3.1);P(body,SPH,belly,0,4.3,2.1,2.5,3.0,1.2);
  /* Kopf */
  const head=new THREE.Group();head.position.set(0,9.2,1.3);body.add(head);P(head,SPH,skin,0,0,0,2.7,2.3,2.4);P(head,SPH,skin,0,-.7,2.0,1.7,1.1,1.5);
  const open=kind!=='pink';P(head,SPH,dark,0,-.95,2.7,open?1.45:1.3,open?.55:.3,.7);for(let i=-3;i<=3;i++){const t=new THREE.Mesh(new THREE.ConeGeometry(.2,.5,5),white);t.position.set(i*.36,open?-.55:-.72,3.05);t.rotation.x=Math.PI;head.add(t)}
  [-1,1].forEach(sd=>{P(head,SPH,white,sd*1.25,1.1,1.7,.6,.6,.35);P(head,SPH,dark,sd*1.25,1.1,2.0,.26,.26,.2)});
  /* Arme und Beine als Gelenke (Pivot an Schulter/Hüfte) */
  const arms=[],legs=[];
  [-1,1].forEach((sd,i)=>{const arm=new THREE.Group();arm.position.set(sd*3.1,6.7,.9);body.add(arm);P(arm,SPH,skin,0,-1.5,0,.9,1.9,.9);arms.push(arm);
    const leg=new THREE.Group();leg.position.set(sd*1.8,3.3,.2);g.add(leg);P(leg,SPH,skin,0,-1.4,0,1.45,1.9,1.5);P(leg,SPH,kind==='hoodie'?M('#ff7ac0'):skin,0,-2.8,1.0,1.55,.65,2.1);legs.push(leg);
    if(kind==='hoodie'){P(leg,SPH,white,0,-3.25,1.0,1.6,.18,2.2)}});
  /* Schwanz */
  const tail=new THREE.Group();tail.position.set(0,3.4,-2.8);body.add(tail);for(let i=0;i<4;i++)P(tail,SPH,skin,0,-i*.5,-i*1.9-.6,1.7-i*.32,1.5-i*.28,2.0);
  /* Rückenplatten */
  const spikeMat=kind==='gold'?M('#c99a1c',{metalness:.85,roughness:.3}):yel;for(let i=0;i<7;i++){const sp=new THREE.Mesh(CON,spikeMat);sp.scale.set(.6-i*.03,1.5,.6-i*.03);sp.position.set(0,10.6-i*1.4,.3-i*.7);sp.rotation.x=-.5-i*.12;sp.castShadow=true;body.add(sp)}
  if(kind==='pink'){
    [0,1].forEach(i=>{const sd=i?1:-1;P(arms[i],SPH,yel,0,-3.35,.5,1.3,1.3,1.3);P(arms[i],SPH,M('#ff4a4a'),0,-2.5,.2,.95,.35,.95)});  /* Boxhandschuhe mit Bündchen */
    P(head,BX,black,0,1.1,2.2,2.9,.2,.2);[-1,1].forEach(sd=>P(head,SPH,black,sd*1.0,1.1,2.35,.62,.55,.22));    /* Sonnenbrille */
    P(head,CYL,M('#ff4a4a'),0,1.6,.4,2.55,.28,2.2)}                                                              /* Stirnband */
  if(kind==='gold'){
    for(let i=0;i<4;i++){const t=new THREE.Mesh(new THREE.TorusGeometry(1,.05,6,22),M('#b8870f',{metalness:.7,roughness:.35}));const sc=[3.55,3.62,3.55,3.3][i];t.scale.set(sc,sc*.95,sc*.9);t.position.set(0,3.2+i*1.2,0);t.rotation.x=Math.PI/2;t.castShadow=true;body.add(t)}   /* Nähte der gesteppten Daunenjacke */
    [-1,1].forEach((sd,i)=>{P(arms[i],SPH,M('#f2c94c',{metalness:.85,roughness:.28}),0,-1.5,0,1.05,2.05,1.05)});
    const col=new THREE.Mesh(new THREE.TorusGeometry(1,.42,8,18),M('#f5d36a',{metalness:.8,roughness:.3}));col.scale.set(2.0,2.0,1.5);col.position.set(0,8.0,.8);col.rotation.x=Math.PI/2;body.add(col);
    P(head,BX,black,0,1.1,2.2,2.9,.2,.2);[-1,1].forEach(sd=>P(head,SPH,black,sd*1.0,1.1,2.35,.62,.55,.22));
    /* Eistüte in der rechten Hand */
    const cone=new THREE.Mesh(new THREE.ConeGeometry(.55,1.8,8),M('#d9a05a'));cone.position.set(0,-3.9,1.0);cone.rotation.x=Math.PI;arms[1].add(cone);P(arms[1],SPH,M('#ffd6e8'),0,-2.7,1.0,.8,.7,.8);P(arms[1],SPH,white,0,-2.15,1.0,.65,.6,.65)}
  if(kind==='hoodie'){
    const hood=M('#4cd9c0');P(body,SPH,hood,0,4.6,0,3.62,4.1,3.22);P(body,SPH,M('#3cbfa8'),0,8.1,-.9,2.5,1.9,1.5);P(body,BX,M('#3cbfa8'),0,3.6,3.12,3.2,1.2,.3);
    [-1,1].forEach((sd,i)=>{P(body,CYL,white,sd*.6,6.6,3.0,.06,1.6,.06);P(arms[i],CYL,hood,0,-1.2,0,1.0,2.4,1.0)});
    const cap=new THREE.Mesh(new THREE.SphereGeometry(1,12,8,0,Math.PI*2,0,Math.PI/2),M('#ffd04a'));cap.scale.set(2.3,1.2,2.2);cap.position.set(0,1.0,0);head.add(cap);P(head,BX,M('#ffd04a'),0,1.0,-2.2,2.0,.15,1.4);   /* Kappe verkehrt herum */
    const bb=new THREE.Group();bb.position.set(3.7,8.4,-.2);body.add(bb);P(bb,BX,black,0,0,0,1.0,1.4,2.6);[-.6,.6].forEach(z=>{P(bb,SPH,white,.55,0,z,.1,.38,.38)});P(bb,BX,M('#ff5fa8'),0,.85,0,.5,.1,1.9)}   /* Boombox */
  body.userData.rest=body.position.y;
  g.scale.setScalar(GIANT.SCALE*(kind==='gold'?1.04:kind==='hoodie'?.98:1));g.userData.noBake=true;g.visible=false;
  return {g,body,head,tail,arms,legs,kind,phase:0}}
function giantRoads(){if(GIANT.roads)return GIANT.roads;GIANT.roads=[];MAPD.roads.forEach(r=>{if(r.w<14)return;const pts=mpResample(r.pts,4).filter(s=>s.tx||s.tz);if(pts.length<20)return;GIANT.roads.push(pts)});return GIANT.roads}
/* Dino-Fahrplan: nur von der Uhr abhängig, deshalb sieht im Raum jeder denselben Dino am selben Ort (Raum: Server-Uhr, allein: eigene Uhr).
   Alle 150 Sekunden beginnt ein Zeitfenster, in dem ein Dino (Pink-Blob, Goldzilla, Hoodie-Zilla der Reihe nach) 100 Sekunden lang eine breite Straße entlangläuft. */
GIANT.PERIOD=150000;GIANT.LIFE=100;GIANT.plans=new Map();GIANT.announced=-1;
function giantClock(){return (typeof MULTI!=='undefined'&&MULTI.on&&MULTI.synced)?MULTI.now():Date.now()}
function giantPlan(k){let p=GIANT.plans.get(k);if(p!==undefined)return p;const roads=giantRoads();if(!roads.length){GIANT.plans.set(k,null);return null}
  const R=mulberry(7000+k*131),ri=Math.floor(R()*roads.length),dir=R()<.5?1:-1,pts=roads[ri],start=dir>0?Math.floor(R()*pts.length*.25):pts.length-1-Math.floor(R()*pts.length*.25);
  p={k,kind:GIANT.kinds[((k%3)+3)%3],ri,dir,u0:start,s0:R()*40};GIANT.plans.set(k,p);if(GIANT.plans.size>8)GIANT.plans.delete(GIANT.plans.keys().next().value);return p}
/* Stand des Dinos zur Zeit T (Millisekunden): Position, Blickrichtung, Laufphase, Größe; null, wenn gerade keiner läuft */
function giantState(T){const k=Math.floor(T/GIANT.PERIOD),pl=giantPlan(k);if(!pl)return null;const t=(T-k*GIANT.PERIOD)/1000-pl.s0;if(t<0||t>GIANT.LIFE)return null;
  const pts=giantRoads()[pl.ri],u=pl.u0+pl.dir*t*GIANT.SPEED/4;if(u<0||u>pts.length-1.001)return null;
  const a=pts[Math.floor(u)],b=pts[Math.min(pts.length-1,Math.floor(u)+1)],f=u-Math.floor(u),x=a.x+(b.x-a.x)*f,z=a.z+(b.z-a.z)*f,dx=(b.x-a.x)*pl.dir,dz=(b.z-a.z)*pl.dir;
  return {k,kind:pl.kind,x,z,yaw:(Math.abs(dx)+Math.abs(dz)>.001)?Math.atan2(dx,dz):0,t,fade:Math.min(1,t/3,(GIANT.LIFE-t)/3),phase:t*GIANT.SPEED/5.2*Math.PI}}
function giantSpawn(){return false}
function giantStep(dt){const live=LV.id===0&&!G.under&&G.phase==='play'&&HUB.built;const st=live?giantState(giantClock()):null;
  GIANT.list.forEach(o=>{o.g.visible=false});if(!st){GIANT.cur=null;return}
  if(!GIANT.pool[st.kind])GIANT.pool[st.kind]=mpBuildGiant(st.kind);const o=GIANT.pool[st.kind];if(!o.g.parent)W0.add(o.g);if(!GIANT.list.includes(o))GIANT.list.push(o);
  const base=o.g.userData.baseScale||(o.g.userData.baseScale=o.g.scale.x),pv=o.phase;o.phase=st.phase;GIANT.cur=st;
  o.g.visible=true;o.g.position.set(st.x,1.3-(1-st.fade)*3,st.z);o.g.rotation.y=st.yaw;o.g.scale.setScalar(base*(.35+.65*st.fade));
  const sw=Math.sin(o.phase);o.legs[0].rotation.x=sw*.5;o.legs[1].rotation.x=-sw*.5;o.arms[0].rotation.x=-sw*.35;o.arms[1].rotation.x=sw*.35;
  o.body.position.y=Math.abs(Math.cos(o.phase))*.28;o.body.rotation.z=sw*.04;o.head.rotation.y=Math.sin(o.phase*.4)*.18;o.tail.rotation.y=Math.sin(o.phase*.5)*.35;
  const d=Math.hypot(st.x-P.x,st.z-P.z);
  if(GIANT.announced!==st.k){GIANT.announced=st.k;if(d<300)toast(GIANT.names[st.kind]+' kommt die Straße entlang!',2200)}
  if(Math.floor((pv||0)/Math.PI)!==Math.floor(o.phase/Math.PI)&&d<130){tone(48+Math.random()*10,.4,'sine',Math.min(.06,.06*(1-d/130)+.01));if(d<45)G.shake=Math.max(G.shake||0,.18*(1-d/45))}}
/* ---------- Leuchtturm (oben) und Tarxarox (unten, an derselben Stelle): der rosa Kreis neben dem Label "Leuchtturm / Tarxarox" ---------- */
function mpLighthouseSpot(){const labs=MAPD.labels.filter(l=>/Leuchtturm|Tarxarox/i.test(l.t));if(!labs.length||!MAPD.markers.length)return null;let best=null;
  MAPD.markers.forEach(m=>labs.forEach(l=>{const d=Math.hypot(m.x-l.x,m.y-l.y);if(d<120&&(!best||d<best.d))best={d,m}}));return best?{x:mwx(best.m.x),z:mwz(best.m.y),r:best.m.r*MP.SC}:null}
function mpLighthouse(add){const sp=mpLighthouseSpot();HUB.lighthouse=null;if(!sp)return;const g=new THREE.Group();g.position.set(sp.x,0,sp.z);g.userData.noBake=true;add(g);
  const red=MT('#d9392c'),wht=MT('#fdf6e8'),stone=MT('#c9c0d6'),dark=MT('#2a2038'),glass=new THREE.MeshStandardMaterial({color:'#bfeaff',emissive:'#ffe9a0',emissiveIntensity:.8,transparent:true,opacity:.7,roughness:.2});
  const mesh=(geo,mat,x,y,z)=>{const o=new THREE.Mesh(geo,mat);o.position.set(x,y,z);o.castShadow=true;g.add(o);return o};
  mesh(new THREE.CylinderGeometry(6.4,6.9,.95,10),stone,0,.95,0);mesh(new THREE.CylinderGeometry(5.4,5.4,.2,10),stone,0,1.5,0);
  const SEG=6,H=3.7,r0=3.2,r1=1.95;for(let i=0;i<SEG;i++){const ra=r0+(r1-r0)*i/SEG,rb=r0+(r1-r0)*(i+1)/SEG;mesh(new THREE.CylinderGeometry(rb,ra,H,18),i%2?wht:red,0,1.6+H/2+i*H,0)}
  const top=1.6+SEG*H;mesh(new THREE.CylinderGeometry(2.9,2.4,.4,18),dark,0,top+.2,0);
  mesh(new THREE.TorusGeometry(2.75,.05,6,28),dark,0,top+1.2,0).rotation.x=Math.PI/2;for(let i=0;i<14;i++){const a=i/14*Math.PI*2;mesh(new THREE.CylinderGeometry(.04,.04,1.0,5),dark,Math.cos(a)*2.75,top+.7,Math.sin(a)*2.75)}
  mesh(new THREE.CylinderGeometry(1.45,1.45,2.4,16),glass,0,top+1.6,0);mesh(new THREE.CylinderGeometry(1.75,1.75,.3,16),dark,0,top+2.95,0);
  mesh(new THREE.ConeGeometry(1.9,1.7,16),red,0,top+3.95,0);mesh(new THREE.SphereGeometry(.28,8,6),dark,0,top+5,0);
  const door=mesh(BX,dark,r0+.1,2.8,0);door.scale.set(.3,2.4,1.2);for(let i=0;i<4;i++){const a=i*1.7+.8,rr=r0-(r0-r1)*(i+1)/5-.08;const w=mesh(BX,MT('#7fb8d8','#7fb8d8',.3),Math.cos(a)*rr,6+i*5.5,Math.sin(a)*rr);w.scale.set(.5,1.0,.5);w.rotation.y=-a}
  /* Lichtstrahl: dreht sich, nur in der Dämmerung und nachts sichtbar */
  const bm=new THREE.MeshBasicMaterial({color:'#fff3b0',transparent:true,opacity:.34,depthWrite:false,fog:false,side:THREE.DoubleSide}),beam=new THREE.Group();beam.position.set(0,top+1.6,0);beam.userData.noBake=true;g.add(beam);
  [1,-1].forEach(sd=>{const b=new THREE.Mesh(new THREE.ConeGeometry(2.2,70,12,1,true),bm);b.rotation.z=-sd*Math.PI/2;b.position.x=sd*35;beam.add(b)});beam.visible=false;
  addOutlines(g,'prop');mpMarkDisc(sp.x,sp.z,4.6);HUB.lighthouse={g,beam,x:sp.x,z:sp.z,top};HUB.marks=HUB.marks||[];HUB.marks.push({x:sp.x,z:sp.z,col:'#ff5a4a',txt:'▲',kind:'lighthouse'})}
/* ---------- Parkbänke (Ebene "Bench") ---------- */
function mpBenches(add){HUB.benches=[];MAPD.benches.forEach(b=>{const X=mwx(b.x),Z=mwz(b.y);if(mpAt(X,Z)===0)return;const len=Math.min(b.w*MP.SC,3.4),dep=Math.min(Math.max(b.h*MP.SC,.9),1.1),n=mpNearRoad(b.x,b.y);
    let ang=b.a;/* Sitzrichtung zur nächsten Straße: Rückenlehne weg von der Straße */let face=1;if(n){const lx=Math.cos(b.a+Math.PI/2),lz=Math.sin(b.a+Math.PI/2);face=((n.x-b.x)*lx+(n.y-b.y)*lz)>=0?1:-1}
    const g=new THREE.Group();g.position.set(X,mpAt(X,Z)===3?1.6:1.3,Z);g.rotation.y=-ang;g.userData.noBake=true;add(g);
    const wood=MT('#c98a4a'),paint=MT('#f7d24a'),mesh=(mat,w,h,d,x,y,z)=>{const o=new THREE.Mesh(BX,mat);o.scale.set(w,h,d);o.position.set(x,y,z);o.castShadow=true;g.add(o);return o};
    mesh(wood,len,.1,dep*.55,0,.52,0);mesh(wood,len,.5,.08,0,.82,-face*dep*.27);[-1,1].forEach(s=>{mesh(paint,.14,.5,dep*.6,s*(len/2-.12),.25,0);mesh(paint,.1,.45,.1,s*(len/2-.12),.74,-face*dep*.27)});
    addOutlines(g,'prop');if(mpAt(X,Z)!==2)mpMarkRect(X,Z,len/2+.1,Math.max(.6,dep/2),Math.atan2(-Math.sin(ang),Math.cos(ang)));HUB.benches.push({x:X,z:Z})})}
/* ---------- Hafenmauer (Strich "Hafenmauer"): Mauer mit Kollision ---------- */
function mpWalls(add){HUB.walls=[];const stone=MT('#d6cfe0'),cap=MT('#b8b0c8');(MAPD.walls||[]).forEach(w=>{const P=w.pts.map(p=>[mwx(p[0]),mwz(p[1])]),th=Math.max(1.6,w.w*MP.SC);
    for(let i=0;i<P.length-1;i++){const a=P[i],c=P[i+1],dx=c[0]-a[0],dz=c[1]-a[1],L=Math.hypot(dx,dz);if(L<.5)continue;const tx=dx/L,tz=dz/L,mx=(a[0]+c[0])/2,mz=(a[1]+c[1])/2,ry=-Math.atan2(tz,tx);
      const m=new THREE.Mesh(BX,stone);m.scale.set(L+th*.5,2.3,th);m.position.set(mx,.6+1.15,mz);m.rotation.y=ry;m.castShadow=true;m.receiveShadow=true;m.userData.noBake=true;add(m);
      const t=new THREE.Mesh(BX,cap);t.scale.set(L+th*.5,.3,th+.5);t.position.set(mx,.6+2.45,mz);t.rotation.y=ry;t.userData.noBake=true;add(t);addOutlines(m,'prop');
      mpMarkRect(mx,mz,L/2+th*.25,Math.max(.7,th/2+.2),Math.atan2(-tz,tx));HUB.walls.push({x:mx,z:mz,len:L})}
    P.forEach(p=>{const c=new THREE.Mesh(new THREE.CylinderGeometry(th*.72,th*.72,2.9,10),cap);c.position.set(p[0],.6+1.45,p[1]);c.castShadow=true;c.userData.noBake=true;add(c)})})}
function mpDressUp(add){const R=mulberry(2468);mpLighthouse(add);mpBenches(add);mpWalls(add);if(typeof bauPlotsFromMap==='function')bauPlotsFromMap();HUB.courtTreesRemoved=HUB.courtTreesRemoved||0;
  /* Autos: auf dem Parkplatz in Reihen und am Straßenrand der breiten Promenade */
  const car=(x,z,ry,k,col)=>{const c=mpRetroCar(k,col);c.position.set(x,1.3,z);c.rotation.y=ry;add(c);addOutlines(c,'prop');const fx=Math.sin(ry),fz=Math.cos(ry);[-1.4,0,1.4].forEach(d=>mpMarkDisc(x+fx*d,z+fz*d,1.15));HUB.cars=(HUB.cars||[]).concat([{x,z,k,ry}])};
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
/* ---------- Sportplätze: Basketball (Käfig mit Öffnung, zwei Körbe), X-Fit (Outdoor-Geräte), Beach-Volleyball (Sand und Netz). Daten aus map.json (courts + Labels), nichts an der Karte geändert ---------- */
/* liegt der Punkt (Welt) auf einer Sportplatz-Fläche? Dort wachsen keine Pflanzen (auch nicht die aus der SVG) */
function mpInCourt(X,Z){const ux=mux(X),uy=muy(Z);return MAPD.courts.some(c=>mpInPoly(c.c[0],ux,uy))}
function mpCvTex(w,h,draw,rep){const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=4;if(rep){t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(rep[0],rep[1])}return t}
/* ---- Skatepark: Pool als befahrbare Mulde (Höhenfunktion skateG), Zaun mit offenem Tor ---- */
const SKATE={on:false,cx:0,cz:0,a:0,rx:0,rz:0,D:1.6,T0:.4,ph:.7,ring:null,gate:null};
const skateR=th=>1+.1*Math.sin(2*th+SKATE.ph)+.07*Math.sin(3*th+1.3);
/* Pool: Boden flach bis T0, dann wächst die Wand nach oben gekrümmt (Parabel, zum Rand hin steiler) wie ein echtes Becken */
function skateG(x,z){if(!SKATE.on)return 0;const dx=x-SKATE.cx,dz=z-SKATE.cz,R=Math.max(SKATE.rx,SKATE.rz)*1.25;if(Math.abs(dx)>R||Math.abs(dz)>R)return 0;
  const c=Math.cos(SKATE.a),s=Math.sin(SKATE.a),lx=dx*c+dz*s,lz=-dx*s+dz*c,ex=lx/SKATE.rx,ez=lz/SKATE.rz,t=Math.hypot(ex,ez)/skateR(Math.atan2(ez,ex));if(t>=1)return 0;
  const u=Math.max(0,Math.min(1,(t-SKATE.T0)/(1-SKATE.T0)));return -SKATE.D*(1-u*u)}
/* Block des Skateparks: alle zusammenhängenden Land- und Parkzellen, die von Straße, Gehweg und Häusern begrenzt werden. Der Zaun läuft an der Straße entlang, der Rest ist Aufenthaltsbereich. */
function mpDPclosed(P,eps){if(P.length<5)return P;let m=0,md=-1;for(let i=1;i<P.length;i++){const d=Math.hypot(P[i][0]-P[0][0],P[i][1]-P[0][1]);if(d>md){md=d;m=i}}
  const open=(pts)=>{if(pts.length<3)return pts;const keep=new Uint8Array(pts.length);keep[0]=keep[pts.length-1]=1;const st=[[0,pts.length-1]];while(st.length){const [a,c]=st.pop();let mxd=0,mi=-1;const [ax,ay]=pts[a],[cx,cy]=pts[c],dx=cx-ax,dy=cy-ay,L=Math.hypot(dx,dy)||1e-9;for(let i=a+1;i<c;i++){const d=Math.abs((pts[i][0]-ax)*dy-(pts[i][1]-ay)*dx)/L;if(d>mxd){mxd=d;mi=i}}if(mxd>eps&&mi>0){keep[mi]=1;st.push([a,mi],[mi,c])}}return pts.filter((_,i)=>keep[i])};
  const A=open(P.slice(0,m+1)),B=open(P.slice(m).concat([P[0]]));return A.concat(B.slice(1,-1))}
function mpSkateBlock(cenMap){const R=150,sx=Math.floor(cenMap[0]-MP.PLAY.x0),sy=Math.floor(cenMap[1]-MP.PLAY.y0),x0=Math.max(1,sx-R),y0=Math.max(1,sy-R),x1=Math.min(MP.w-2,sx+R),y1=Math.min(MP.h-2,sy+R),w=x1-x0+1,h=y1-y0+1;
  const ok=c=>c===1||c===4,idx=(x,y)=>(y-y0)*w+(x-x0),reg=new Uint8Array(w*h);let st=[];
  /* Startzelle: Mitte oder die nächste begehbare Land-/Parkzelle */
  let found=false;for(let d=0;d<20&&!found;d++)for(let dy=-d;dy<=d&&!found;dy++)for(let dx=-d;dx<=d;dx++){const x=sx+dx,y=sy+dy;if(x<x0||x>x1||y<y0||y>y1)continue;if(ok(MP.cls[y*MP.w+x])){st.push([x,y]);reg[idx(x,y)]=1;found=true;break}}
  if(!found)return null;let n=0,open=false;while(st.length){const [x,y]=st.pop();n++;if(x<=x0||x>=x1||y<=y0||y>=y1){open=true}
    for(const [ax,ay] of [[1,0],[-1,0],[0,1],[0,-1]]){const X=x+ax,Y=y+ay;if(X<x0||X>x1||Y<y0||Y>y1)continue;if(reg[idx(X,Y)]||!ok(MP.cls[Y*MP.w+X]))continue;reg[idx(X,Y)]=1;st.push([X,Y])}}
  if(open||n<200)return null;
  /* Umriss: Randkanten der Region zu Schleifen verketten, größte Schleife = Außenrand */
  const E=new Map(),key=(i,j)=>i+','+j,add=(a,b,c,d)=>{const k=key(a,b);if(!E.has(k))E.set(k,[]);E.get(k).push([c,d])};
  for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){if(!reg[idx(x,y)])continue;const i=x-x0,j=y-y0;
    if(y===y0||!reg[idx(x,y-1)])add(i,j,i+1,j);if(x===x1||!reg[idx(x+1,y)])add(i+1,j,i+1,j+1);if(y===y1||!reg[idx(x,y+1)])add(i+1,j+1,i,j+1);if(x===x0||!reg[idx(x-1,y)])add(i,j+1,i,j)}
  let best=null;const used=new Set();for(const [k0,L0] of E){for(let e0=0;e0<L0.length;e0++){const sk=k0+'>'+e0;if(used.has(sk))continue;const [ai,aj]=k0.split(',').map(Number);let loop=[],ci=ai,cj=aj,ek=k0,ee=e0,guard=0;
      while(guard++<200000){used.add(ek+'>'+ee);loop.push([ci,cj]);const nx=E.get(ek)[ee];ci=nx[0];cj=nx[1];ek=key(ci,cj);if(ci===ai&&cj===aj)break;const L=E.get(ek);if(!L)break;ee=0;while(ee<L.length-1&&used.has(ek+'>'+ee))ee++;if(used.has(ek+'>'+ee))break}
      if(loop.length>8){let A=0;for(let q=0;q<loop.length;q++){const a=loop[q],b=loop[(q+1)%loop.length];A+=a[0]*b[1]-b[0]*a[1]}A=Math.abs(A)/2;if(!best||A>best.A)best={A,loop}}}}
  if(!best)return null;
  const poly=mpDPclosed(best.loop,1.5).map(q=>[q[0]+x0+MP.PLAY.x0,q[1]+y0+MP.PLAY.y0]);
  /* Abstand jeder Zelle zum Rand (Chamfer, in Zellen) */
  const D=new Float32Array(w*h).fill(1e9);for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){if(!reg[idx(x,y)])D[idx(x,y)]=0}
  const f=(x,y,v)=>{const q=D[idx(x,y)];if(v<q)D[idx(x,y)]=v};for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){if(y>y0)f(x,y,D[idx(x,y-1)]+1);if(x>x0)f(x,y,D[idx(x-1,y)]+1);if(x>x0&&y>y0)f(x,y,D[idx(x-1,y-1)]+1.4);if(x<x1&&y>y0)f(x,y,D[idx(x+1,y-1)]+1.4)}
  for(let y=y1;y>=y0;y--)for(let x=x1;x>=x0;x--){if(y<y1)f(x,y,D[idx(x,y+1)]+1);if(x<x1)f(x,y,D[idx(x+1,y)]+1);if(x<x1&&y<y1)f(x,y,D[idx(x+1,y+1)]+1.4);if(x>x0&&y<y1)f(x,y,D[idx(x-1,y+1)]+1.4)}
  let bd=0,bx=sx,by=sy;for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){const d=D[idx(x,y)];if(d>bd){bd=d;bx=x;by=y}}
  return {poly,reg,x0,y0,w,h,D,cells:n,bx:bx+MP.PLAY.x0+.5,by:by+MP.PLAY.y0+.5,bd:bd*MP.SC}}
function skateCellD(X,Z){const B=SKATE.block;if(!B)return 0;const x=Math.floor(mux(X)-MP.PLAY.x0)-B.x0,y=Math.floor(muy(Z)-MP.PLAY.y0)-B.y0;if(x<0||y<0||x>=B.w||y>=B.h)return 0;return B.D[y*B.w+x]*MP.SC}
function mpSkateSetup(){if(SKATE.done)return;SKATE.done=true;SKATE.on=false;SKATE.block=null;const c=MAPD.courts.find(c=>mpCourtKind(c)==='skate');if(!c)return;const ring=c.c[0],o=mpObb(ring);let a=o.a,w=o.w,h=o.h;if(h>w){a+=Math.PI/2;const t=w;w=h;h=t}
  const cen=mpCentroid(ring),B=mpSkateBlock(cen);if(!B)return;SKATE.block=B;const MARG=2.6,asp=Math.max(.8,Math.min(1.25,w/h));
  SKATE.cx=mwx(B.bx);SKATE.cz=mwz(B.by);SKATE.a=a;SKATE.on=true;
  let R=Math.min(7.5,Math.max(3,B.bd-MARG)/1.17),okR=false;
  for(let k=0;k<30&&!okR;k++,R*=.94){SKATE.rx=R*Math.sqrt(asp);SKATE.rz=R/Math.sqrt(asp);const pts=ringPts();okR=pts.every(q=>skateCellD(mwx(q[0]),mwz(q[1]))>=MARG-.3);SKATE.ring=pts}
  SKATE.minDist=Math.min(...SKATE.ring.map(q=>skateCellD(mwx(q[0]),mwz(q[1]))));
  const land=MAPD.land.find(l=>mpInPoly(l.c[0],B.bx,B.by));if(land&&land.c.length<2)land.c.push(SKATE.ring)}
function ringPts(){const a=SKATE.a,pts=[];for(let k=0;k<48;k++){const th=k/48*Math.PI*2,r=skateR(th),lx=Math.cos(th)*SKATE.rx*r,lz=Math.sin(th)*SKATE.rz*r;pts.push([mux(SKATE.cx+lx*Math.cos(a)-lz*Math.sin(a)),muy(SKATE.cz+lx*Math.sin(a)+lz*Math.cos(a))])}return pts}
function mpPolyDist(r,x,y){let d=1e9;for(let i=0;i<r.length;i++){const p=r[i],q=r[(i+1)%r.length],dx=q[0]-p[0],dy=q[1]-p[1],L2=dx*dx+dy*dy||1e-9;let t=((x-p[0])*dx+(y-p[1])*dy)/L2;t=Math.max(0,Math.min(1,t));d=Math.min(d,Math.hypot(x-p[0]-dx*t,y-p[1]-dy*t))}return d}
function mpCourtKind(c){if(!MAPD.labels.some(l=>mpInPoly(c.c[0],l.x,l.y)&&(/Basket|X-?Fit|Skate/i.test(l.t)))&&MAPD.labels.some(l=>/Skate/i.test(l.t)&&mpPolyDist(c.c[0],l.x,l.y)<=40&&MAPD.courts.every(o=>o===c||mpPolyDist(o.c[0],l.x,l.y)>mpPolyDist(c.c[0],l.x,l.y))))return 'skate';const lab=MAPD.labels.find(l=>mpInPoly(c.c[0],l.x,l.y)&&(/Basket/i.test(l.t)||/X-?Fit/i.test(l.t)||/Skate/i.test(l.t)));return lab?(/Basket/i.test(lab.t)?'basket':/Skate/i.test(lab.t)?'skate':'xfit'):'volley'}
function mpSkatePark(c,add,steel,chain){const B=SKATE.block,pts=B.poly.map(q=>[mwx(q[0]),mwz(q[1])]),n=pts.length,G=new THREE.Group();G.userData.noBake=true;add(G);
  /* Betonfläche des ganzen Blocks mit Loch für den Pool, darin die Mulde */
  mpFlat([{c:[B.poly,SKATE.ring]}],1.318,mpMat('skate','#cfc9bf'),add);
  {const K=22,S=48,pos=[],idx=[];for(let k=0;k<=K;k++){const t=k/K;for(let j=0;j<S;j++){const th=j/S*Math.PI*2,r=skateR(th)*t,lx=Math.cos(th)*SKATE.rx*r,lz=Math.sin(th)*SKATE.rz*r,x=SKATE.cx+lx*Math.cos(SKATE.a)-lz*Math.sin(SKATE.a),z=SKATE.cz+lx*Math.sin(SKATE.a)+lz*Math.cos(SKATE.a);pos.push(x,1.3+skateG(x,z)+.005,z)}}
    for(let k=0;k<K;k++)for(let j=0;j<S;j++){const a=k*S+j,b=k*S+(j+1)%S,c2=(k+1)*S+j,d=(k+1)*S+(j+1)%S;idx.push(a,c2,b,b,c2,d)}
    const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));geo.setIndex(idx);geo.computeVertexNormals();
    const m=new THREE.Mesh(geo,new THREE.MeshStandardMaterial({color:'#d9d4ca',roughness:.8,flatShading:true,side:THREE.DoubleSide}));m.receiveShadow=true;m.userData.noBake=true;m.userData.noOutline=true;add(m);
    const rp=[];for(let j=0;j<S;j++){const th=j/S*Math.PI*2,r=skateR(th),lx=Math.cos(th)*SKATE.rx*r,lz=Math.sin(th)*SKATE.rz*r;rp.push(new THREE.Vector3(SKATE.cx+lx*Math.cos(SKATE.a)-lz*Math.sin(SKATE.a),1.34,SKATE.cz+lx*Math.sin(SKATE.a)+lz*Math.cos(SKATE.a)))}
    const cope=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(rp,true),S*2,.14,6,true),new THREE.MeshStandardMaterial({color:'#9a9aa6',roughness:.5,metalness:.3}));cope.castShadow=true;cope.userData.noBake=true;add(cope)}
  /* Zaun an der Straße entlang (leicht nach innen versetzt), zwei Tore: das größte Randstück und das am weitesten davon entfernte */
  let cx=0,cz=0;pts.forEach(p=>{cx+=p[0]/n;cz+=p[1]/n});const inset=pts.map(p=>{const dx=cx-p[0],dz=cz-p[1],l=Math.hypot(dx,dz)||1;return [p[0]+dx/l*.45,p[1]+dz/l*.45]});
  const edges=inset.map((p,i)=>{const q=inset[(i+1)%n],dx=q[0]-p[0],dz=q[1]-p[1],len=Math.hypot(dx,dz);return {i,p,q,len,mx:(p[0]+q[0])/2,mz:(p[1]+q[1])/2,tx:dx/(len||1),tz:dz/(len||1)}});
  const longest=edges.slice().sort((a,b)=>b.len-a.len),g1=longest.find(e=>e.len>=8)||longest[0];let g2=longest.find(e=>e!==g1&&e.len>=8&&Math.hypot(e.mx-g1.mx,e.mz-g1.mz)>24);
  const FH=2.8;chain.map.wrapS=chain.map.wrapT=THREE.RepeatWrapping;SKATE.gates=[];SKATE.edges=[];
  const sign=(gx,gz,tx,tz,gw)=>{const cv=document.createElement('canvas');cv.width=512;cv.height=128;const cx2=cv.getContext('2d');cx2.fillStyle='#8e5bd6';cx2.fillRect(0,0,512,128);cx2.strokeStyle='#fdf6e8';cx2.lineWidth=8;cx2.strokeRect(6,6,500,116);cx2.fillStyle='#fdf6e8';cx2.font='800 66px "Baloo 2","Trebuchet MS",sans-serif';cx2.textAlign='center';cx2.textBaseline='middle';cx2.fillText('SKATEPARK',256,68);
    const tex=new THREE.CanvasTexture(cv);tex.colorSpace=THREE.SRGBColorSpace;const sg=new THREE.Mesh(new THREE.PlaneGeometry(gw,gw/4),new THREE.MeshBasicMaterial({map:tex,side:THREE.DoubleSide}));sg.position.set(gx,1.3+FH+.9,gz);sg.rotation.y=-Math.atan2(tz,tx);G.add(sg)};
  edges.forEach(e=>{const {p,q,len,tx,tz}=e;if(len<.4)return;let spans=[[0,len]];const isG=(e===g1||e===g2);
    if(isG){const gw=Math.min(6.5,len*.7),g0=(len-gw)/2;spans=len>8?[[0,g0],[g0+gw,len]]:[];const gx=e.mx,gz=e.mz;SKATE.gates.push([gx,gz]);if(e===g1)SKATE.gate=[gx,gz];
      [-1,1].forEach(sd=>{const m=new THREE.Mesh(CY,steel);m.scale.set(.14,FH+.9,.14);m.position.set(gx+tx*sd*gw/2,1.3+(FH+.9)/2,gz+tz*sd*gw/2);m.castShadow=true;G.add(m)});sign(gx,gz,tx,tz,gw)}
    SKATE.edges.push({mx:e.mx,mz:e.mz,nx:-tz,nz:tx,len,gate:isG});
    spans.forEach(([s0,s1])=>{const L=s1-s0;if(L<.4)return;const mx=p[0]+tx*(s0+s1)/2,mz=p[1]+tz*(s0+s1)/2,pl=new THREE.Mesh(new THREE.PlaneGeometry(L,FH),chain);pl.position.set(mx,1.3+FH/2,mz);pl.rotation.y=-Math.atan2(tz,tx);
      const uv=pl.geometry.attributes.uv;for(let j=0;j<uv.count;j++)uv.setXY(j,uv.getX(j)*L/.55,uv.getY(j)*FH/.55);G.add(pl);
      const rail=new THREE.Mesh(BX,steel);rail.scale.set(L,.07,.07);rail.position.set(mx,1.3+FH,mz);rail.rotation.y=-Math.atan2(tz,tx);G.add(rail);
      mpMarkRect(mx,mz,L/2+.2,.6,Math.atan2(-tz,tx));const np=Math.max(1,Math.ceil(L/3));for(let k=0;k<=np;k++){const m=new THREE.Mesh(CY,steel);m.scale.set(.05,FH+.2,.05);m.position.set(p[0]+tx*(s0+L*k/np),1.3+(FH+.2)/2,p[1]+tz*(s0+L*k/np));G.add(m)}})});
  /* Aufenthaltsbereich: Bänke und Pflanzkübel mit Bäumen entlang des Zauns, nicht am Tor und nicht am Pool */
  const R2=mulberry(4242),wood=new THREE.MeshStandardMaterial({color:'#b98a5a',roughness:.8,flatShading:true}),dark=new THREE.MeshStandardMaterial({color:'#4a4658',roughness:.7,flatShading:true}),pot=new THREE.MeshStandardMaterial({color:'#d54291',roughness:.7,flatShading:true}),leaf=new THREE.MeshStandardMaterial({color:'#47c2a5',roughness:.8,flatShading:true});
  const farGate=(x,z)=>!SKATE.gates.some(g=>Math.hypot(g[0]-x,g[1]-z)<6),farPool=(x,z,m)=>Math.hypot(x-SKATE.cx,z-SKATE.cz)>Math.max(SKATE.rx,SKATE.rz)*1.2+m;
  let benches=0,pots=0;edges.forEach(e=>{if(e.len<7)return;const nx=-e.tz,nz=e.tx,sgn=((cx-e.mx)*nx+(cz-e.mz)*nz)>=0?1:-1,inx=nx*sgn,inz=nz*sgn;
    for(let s=3;s<e.len-2;s+=9+R2()*3){const x=e.p[0]+e.tx*s+inx*1.5,z=e.p[1]+e.tz*s+inz*1.5;if(!farGate(x,z)||!farPool(x,z,1.5)||skateCellD(x,z)<1.2)continue;
      const bg=new THREE.Group();bg.position.set(x,1.3,z);bg.rotation.y=-Math.atan2(e.tz,e.tx);const seat=new THREE.Mesh(BX,wood);seat.scale.set(2.2,.14,.6);seat.position.y=.5;const back=new THREE.Mesh(BX,wood);back.scale.set(2.2,.5,.1);back.position.set(0,.85,-.25*sgn);[-.9,.9].forEach(px=>{const lg=new THREE.Mesh(BX,dark);lg.scale.set(.12,.5,.5);lg.position.set(px,.25,0);bg.add(lg)});bg.add(seat,back);bg.traverse(o=>{o.castShadow=true});G.add(bg);mpMarkRect(x,z,1.2,.5,Math.atan2(-e.tz,e.tx));benches++}});
  pts.forEach((p,i)=>{const dx=cx-p[0],dz=cz-p[1],l=Math.hypot(dx,dz)||1,x=p[0]+dx/l*2.2,z=p[1]+dz/l*2.2;if(!farGate(x,z)||!farPool(x,z,1.5)||skateCellD(x,z)<1)return;
    const pg=new THREE.Group();pg.position.set(x,1.3,z);const potM=new THREE.Mesh(CY,pot);potM.scale.set(.7,.7,.7);potM.position.y=.35;const tr=new THREE.Mesh(CY,dark);tr.scale.set(.1,1.4,.1);tr.position.y=1.3;const top=new THREE.Mesh(SP,leaf);top.scale.set(.9,.8,.9);top.position.y=2.3;pg.add(potM,tr,top);pg.traverse(o=>{o.castShadow=true});G.add(pg);mpMarkDisc(x,z,.8);pots++});
  HUB.courts.push({kind:'skate',x:SKATE.cx,z:SKATE.cz,col:'#c08cff',txt:'S',Lw:0,Hw:0,posts:0,fence:n,benches,pots})}
function mpCourts(add){HUB.courts=[];
  const steel=new THREE.MeshStandardMaterial({color:'#8892a8',roughness:.45,metalness:.5}),yel=new THREE.MeshStandardMaterial({color:'#ffd04a',roughness:.5}),blue=new THREE.MeshStandardMaterial({color:'#4f9ec4',roughness:.5}),white=new THREE.MeshStandardMaterial({color:'#fdf6e8',roughness:.6}),orange=new THREE.MeshStandardMaterial({color:'#ff7a1a',roughness:.5}),rope=new THREE.MeshStandardMaterial({color:'#f6efe6',roughness:.9});
  const chain=new THREE.MeshBasicMaterial({map:mpCvTex(32,32,(g,w,h)=>{g.strokeStyle='#d6dcea';g.lineWidth=2;g.beginPath();g.moveTo(0,h/2);g.lineTo(w/2,0);g.lineTo(w,h/2);g.lineTo(w/2,h);g.closePath();g.stroke()},[1,1]),transparent:true,side:THREE.DoubleSide,depthWrite:false,alphaTest:.05,color:'#c4cbdc'});
  const netM=new THREE.MeshBasicMaterial({map:mpCvTex(32,32,(g,w,h)=>{g.strokeStyle='#ffffff';g.lineWidth=2;g.strokeRect(0,0,w,h)},[1,1]),transparent:true,side:THREE.DoubleSide,depthWrite:false,alphaTest:.05});
  MAPD.courts.forEach(c=>{const kind=mpCourtKind(c),o=mpObb(c.c[0]);let a=o.a,w=o.w,h=o.h;if(h>w){a+=Math.PI/2;const t=w;w=h;h=t}
    if(kind==='skate'){mpSkatePark(c,add,steel,chain);return}
    const Lw=w*MP.SC,Hw=h*MP.SC,X=mwx(o.cx),Z=mwz(o.cy),ux=Math.cos(a),uz=Math.sin(a),vx=-Math.sin(a),vz=Math.cos(a),W=(lx,lz)=>[X+ux*lx+vx*lz,Z+uz*lx+vz*lz];
    const G=new THREE.Group();G.position.set(X,1.3,Z);G.rotation.y=-a;G.userData.noBake=true;add(G);
    const mesh=(geo,mat,x,y,z,sx,sy,sz)=>{const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);if(sx!==undefined)m.scale.set(sx,sy,sz);m.castShadow=true;G.add(m);return m};
    const cylY=(x,z,h,r,mat)=>{const m=mesh(new THREE.CylinderGeometry(r,r,h,8),mat,x,h/2,z);return m};
    const barX=(x,z,len,y,r,mat)=>{const m=mesh(new THREE.CylinderGeometry(r,r,len,8),mat,x,y,z);m.rotation.z=Math.PI/2;return m};
    const barZ=(x,z,len,y,r,mat)=>{const m=mesh(new THREE.CylinderGeometry(r,r,len,8),mat,x,y,z);m.rotation.x=Math.PI/2;return m};
    const disc=(lx,lz,r)=>{const p=W(lx,lz);mpMarkDisc(p[0],p[1],Math.max(r,.6))};/* Maske hat 0,5 m Auflösung: dünnere Dinge brauchen eine Mindestdicke */
    const rectL=(lx,lz,len,dirX,hd0)=>{const hd=Math.max(hd0,.6);/* Kollisionsrechteck in Platzkoordinaten; dirX: Strecke läuft entlang lokalem x (true) oder z (false) */const p=W(lx,lz),tx=dirX?ux:vx,tz=dirX?uz:vz;mpMarkRect(p[0],p[1],len/2,hd,Math.atan2(-tz,tx))};
    const info={kind,a,x:X,z:Z,Lw,Hw,txt:kind==='basket'?'B':kind==='xfit'?'X':'V',col:kind==='basket'?'#ff9a3d':kind==='xfit'?'#ff5f7a':'#ffe066',posts:0};
    const base=mpMat('court-'+kind,kind==='basket'?'#d98a5a':kind==='xfit'?'#c9675c':'#ecc872');mpFlat([c],kind==='volley'?1.322:1.316,base,add);
    const S=40,mk=(draw)=>{const t=mpCvTex(Math.min(2048,Math.round(Lw*S)),Math.min(2048,Math.round(Hw*S)),draw),m=new THREE.Mesh(new THREE.PlaneGeometry(Lw,Hw),new THREE.MeshBasicMaterial({map:t,transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2}));m.rotation.x=-Math.PI/2;m.position.y=.04;G.add(m)};
    if(kind==='basket'){
      const PL=Math.min(Lw-5.5,28),PW=Math.min(Hw-2.5,15),px=m=>(m+Lw/2)*S,pz=m=>(m+Hw/2)*S;
      mk((g,cw,ch)=>{g.fillStyle='#e7a074';g.fillRect(px(-PL/2),pz(-PW/2),PL*S,PW*S);g.fillStyle='#5aa9c9';[-1,1].forEach(sd=>g.fillRect(px(sd>0?PL/2-5.8:-PL/2),pz(-2.45),5.8*S,4.9*S));
        g.strokeStyle='#fdf6e8';g.lineWidth=.09*S;g.strokeRect(px(-PL/2),pz(-PW/2),PL*S,PW*S);g.beginPath();g.moveTo(px(0),pz(-PW/2));g.lineTo(px(0),pz(PW/2));g.stroke();g.beginPath();g.arc(px(0),pz(0),1.8*S,0,7);g.stroke();
        [-1,1].forEach(sd=>{const bx=sd*(PL/2-1.575),ex=sd*(PL/2-5.8);g.strokeRect(px(Math.min(sd*PL/2,ex)),pz(-2.45),5.8*S,4.9*S);g.beginPath();g.arc(px(ex),pz(0),1.8*S,sd>0?Math.PI/2:-Math.PI/2,sd>0?Math.PI*1.5:Math.PI/2,sd<0?false:false);g.stroke();
          const ang=Math.asin(Math.min(.99,(PW/2-.9)/6.75));g.beginPath();g.arc(px(bx),pz(0),6.75*S,sd>0?Math.PI-ang:-ang,sd>0?Math.PI+ang:ang,false);g.stroke();
          const ax=bx-sd*6.75*Math.cos(ang);[-1,1].forEach(zz=>{g.beginPath();g.moveTo(px(sd*PL/2),pz(zz*(PW/2-.9)));g.lineTo(px(ax),pz(zz*(PW/2-.9)));g.stroke()})})});
      info.hoops=0;[-1,1].forEach(sd=>{const hx=sd*(PL/2-.2),poleX=sd*(PL/2+.9);cylY(poleX,0,3.4,.1,steel);barX((hx+poleX)/2,0,Math.abs(poleX-hx),3.1,.05,steel);
        mesh(BX,white,hx,3.45,0,.06,1.05,1.8);mesh(BX,orange,hx,3.15,0,.07,.5,.9).material=orange;
        const rim=mesh(new THREE.TorusGeometry(.23,.02,6,16),orange,hx-sd*.45,3.05,0);rim.rotation.x=Math.PI/2;
        mesh(new THREE.CylinderGeometry(.23,.13,.45,10,1,true),netM,hx-sd*.45,2.8,0).material=netM;disc(poleX,0,.22);info.hoops++});
      /* Käfig: Maschendrahtzaun rundherum, eine Öffnung zur nächsten Straße */
      const fx=Lw/2-.3,fz=Hw/2-.3,sides=[[[-fx,-fz],[fx,-fz]],[[fx,-fz],[fx,fz]],[[fx,fz],[-fx,fz]],[[-fx,fz],[-fx,-fz]]];let gi=0,gd=1e9;
      sides.forEach((sd,i)=>{const mxw=(sd[0][0]+sd[1][0])/2,mzw=(sd[0][1]+sd[1][1])/2,wp=W(mxw,mzw),n=mpNearRoad(mux(wp[0]),muy(wp[1]));if(n&&n.d<gd){gd=n.d;gi=i}});
      info.gapSide=gi;info.fence=0;info.gap=null;sides.forEach((sd,i)=>{const [p,q]=sd,dx=q[0]-p[0],dz=q[1]-p[1],len=Math.hypot(dx,dz),tx=dx/len,tz=dz/len,gc=len/2+(i%2?4.2:0),spans=i===gi?[[0,gc-2.1],[gc+2.1,len]]:[[0,len]];/* an den kurzen Seiten steht der Korbpfosten in der Mitte: Öffnung seitlich versetzt */
        if(i===gi){const gp=W(p[0]+tx*gc,p[1]+tz*gc);info.gap=[gp[0],gp[1]];info.gapLocal=[p[0]+tx*gc,p[1]+tz*gc]}
        spans.forEach(([s0,s1])=>{const L=s1-s0;if(L<.5)return;const mx=p[0]+tx*(s0+s1)/2,mz=p[1]+tz*(s0+s1)/2,pl=new THREE.Mesh(new THREE.PlaneGeometry(L,3.4),chain);pl.position.set(mx,1.7,mz);pl.rotation.y=-Math.atan2(tz,tx);
          const tt=pl.material.map;G.add(pl);mesh(BX,steel,mx,3.45,mz,L,.07,.07).rotation.y=-Math.atan2(tz,tx);const cp=W(mx,mz),dw=[ux*tx+vx*tz,uz*tx+vz*tz];mpMarkRect(cp[0],cp[1],L/2+.2,.6,Math.atan2(-dw[1],dw[0]));info.fence++;
          const np=Math.max(1,Math.ceil(L/3));for(let k=0;k<=np;k++)cylY(p[0]+tx*(s0+L*k/np),p[1]+tz*(s0+L*k/np),3.7,.05,steel)})});
      /* Zaunbahnen kacheln: Texturwiederholung pro Länge */
      G.children.forEach(m=>{if(m.material===chain&&m.geometry.parameters&&m.geometry.parameters.width){const L=m.geometry.parameters.width,uv=m.geometry.attributes.uv;for(let j=0;j<uv.count;j++)uv.setXY(j,uv.getX(j)*L/.55,uv.getY(j)*3.4/.55);uv.needsUpdate=true}});
      chain.map.wrapS=chain.map.wrapT=THREE.RepeatWrapping}
    else if(kind==='xfit'){
      const s=Math.min(1,Hw/12.5,Lw/12);const P=(x,z)=>[x*s,z*s];info.items=0;
      mk((g)=>{g.strokeStyle='#fdf6e8';g.lineWidth=.1*S;g.strokeRect(.4*S,.4*S,(Lw-.8)*S,(Hw-.8)*S)});
      const pull=(x,z)=>{const [a,b]=P(x,z);[-1.2,1.2].forEach(d=>{cylY(a+d,b,2.65,.06,blue);disc(a+d,b,.3);info.posts++});barX(a,b,2.4,2.55,.04,yel);barX(a,b,2.4,2.1,.04,yel);info.items++};
      const para=(x,z)=>{const [a,b]=P(x,z);[-1.1,1.1].forEach(d=>[-.3,.3].forEach(e=>{cylY(a+d,b+e,1.15,.05,blue);disc(a+d,b+e,.25);info.posts++}));[-.3,.3].forEach(e=>barX(a,b+e,2.4,1.12,.035,yel));info.items++};
      const rings=(x,z)=>{const [a,b]=P(x,z);[-1.8,1.8].forEach(d=>{cylY(a+d,b,3.4,.07,blue);disc(a+d,b,.3);info.posts++});barX(a,b,3.7,3.35,.05,yel);[-.35,.35].forEach(d=>{const r=mesh(new THREE.CylinderGeometry(.012,.012,1.15,5),rope,a+d,2.75,b);const rg=mesh(new THREE.TorusGeometry(.11,.018,6,14),white,a+d,2.15,b);rg.rotation.x=Math.PI/2});info.items++};
      const monkey=(x,z)=>{const [a,b]=P(x,z);for(let i=-2;i<=2;i++){[-.3,.3].forEach(e=>{cylY(a+i*1.5,b+e,2.5,.05,blue)});disc(a+i*1.5,b,.3);info.posts++}[-.3,.3].forEach(e=>barX(a,b+e,6.2,2.45,.035,yel));for(let r=-6;r<=6;r++)barZ(a+r*.48,b,.6,2.45,.025,yel);info.items++};
      const bench=(x,z)=>{const [a,b]=P(x,z);mesh(BX,white,a,.5,b,1.8,.12,.5);[-.7,.7].forEach(d=>{mesh(BX,steel,a+d,.25,b,.08,.5,.4);disc(a+d,b,.25)});info.items++};
      pull(-3.2,-4.6);pull(3.2,-4.6);monkey(0,-1.9);para(-3.2,0.9);para(3.2,0.9);bench(0,1.6);rings(0,4.4);
      const sp=W(-Lw/2+1.2,Hw/2-1.2);const post=mesh(new THREE.CylinderGeometry(.06,.06,2.6,6),steel,-Lw/2+1.2,1.3,Hw/2-1.2);const sg=new THREE.Mesh(new THREE.PlaneGeometry(2.4,.6),signMat('X-FIT','#ffe066','#1a1030'));sg.position.set(-Lw/2+1.2,2.5,Hw/2-1.2+.08);sg.userData.noBake=true;sg.userData.noOutline=true;G.add(sg);mpMarkDisc(sp[0],sp[1],.3)}
    else{/* Beach-Volleyball */
      const Lc=Math.min(16,Lw-4),Wc=Math.min(8,Hw-3),px=m=>(m+Lw/2)*S,pz=m=>(m+Hw/2)*S;
      mk((g)=>{g.strokeStyle='#fdf6e8';g.lineWidth=.09*S;g.strokeRect(px(-Lc/2),pz(-Wc/2),Lc*S,Wc*S)});
      [-1,1].forEach(d=>{cylY(0,d*(Wc/2+.7),2.6,.06,steel);disc(0,d*(Wc/2+.7),.2);info.posts++});
      const net=mesh(new THREE.PlaneGeometry(Wc+1.4,.95),netM,0,1.95,0);net.rotation.y=Math.PI/2;const uv=net.geometry.attributes.uv;for(let j=0;j<uv.count;j++)uv.setXY(j,uv.getX(j)*(Wc+1.4)/.12,uv.getY(j)*.95/.12);uv.needsUpdate=true;netM.map.wrapS=netM.map.wrapT=THREE.RepeatWrapping;
      mesh(BX,white,0,2.43,0,.05,.07,Wc+1.4);rectL(0,0,Wc+1.4,false,.12);info.net=true;
      const ball=mesh(new THREE.SphereGeometry(.11,10,8),yel,Lc/2-2,.12,1.4);mesh(new THREE.TorusGeometry(.11,.012,5,12),blue,Lc/2-2,.12,1.4)}
    HUB.courts.push(info)})}
function mpTerrain(add){
  mpSkateSetup();
  /* Meer: türkis nahe am Strand, tiefblau draußen, mit Schaumkante, Wellenlinie und Glitzern (Abstand zur Küste aus der Maske) */
  {let seaGeo=new THREE.PlaneGeometry(7000,7000);if(SKATE.on){const sh=new THREE.Shape([new THREE.Vector2(-3500,-3500),new THREE.Vector2(3500,-3500),new THREE.Vector2(3500,3500),new THREE.Vector2(-3500,3500)]);sh.holes.push(new THREE.Path(SKATE.ring.map(q=>new THREE.Vector2(mwx(q[0]),-mwz(q[1])))));seaGeo=new THREE.ShapeGeometry(sh)}const m=new THREE.Mesh(seaGeo,mpSeaMat());m.rotation.x=-Math.PI/2;m.position.set(0,1.0,0);m.userData.noBake=true;m.userData.noOutline=true;add(m)}
  /* Land (angehoben, mit sichtbarer Kante) */
  MAPD.land.forEach(it=>{const geo=new THREE.ExtrudeGeometry(mpShape(it.c),{depth:.7,bevelEnabled:false});geo.rotateX(-Math.PI/2);const m=new THREE.Mesh(geo,mpMat('land','#f1e5c0'));m.position.y=.6;m.receiveShadow=true;m.userData.noBake=true;add(m)});
  mpFlat(MAPD.parks,1.31,mpMat('park','#4fa874'),add);mpFlat(MAPD.lots,1.31,mpMat('lot','#8d93a0'),add);mpCourts(add);
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
/* Besondere Gebäude: Polizei (Band, Wappen), Schule (Fahne, Uhr), Warehouse (Rolltore), Surf Shop (Bretter), Beach Shack (Markise) */
function mpRingExtrude(bg,ring,sc,depth,mat,y){const c=[0,1].map(i=>ring.reduce((a,p)=>a+p[i],0)/ring.length),pts=ring.map(p=>new THREE.Vector2(c[0]+(p[0]-c[0])*sc,-(c[1]+(p[1]-c[1])*sc))),g=new THREE.ExtrudeGeometry(new THREE.Shape(pts),{depth,bevelEnabled:false});g.rotateX(-Math.PI/2);const m=new THREE.Mesh(g,mpDS(mat));m.position.y=y;m.castShadow=true;bg.add(m)}
function mpKindExtras(bg,b,ring,h,front){const k=b.kind||'';const c=[0,1].map(i=>ring.reduce((a,p)=>a+p[i],0)/ring.length);
  if(['police','school','surf','shack','warehouse'].includes(k)){const m={police:['#2a6aff','!'],school:['#ffb020','S'],surf:['#2de0d0','W'],shack:['#ffe066','s'],warehouse:['#b0a8c8','L']}[k];HUB.marks=HUB.marks||[];HUB.marks.push({x:c[0],z:c[1],col:m[0],txt:m[1],kind:k})}
  if(!front)return;const ux=-front.nz,uz=front.nx,ry=-Math.atan2(uz,ux),yaw=Math.atan2(front.nx,front.nz),L=front.L;
  const box=(mat,w,hh,d,t,n,y,rot)=>{const o=new THREE.Mesh(BX,mat);o.scale.set(w,hh,d);o.position.set(front.mx+ux*t+front.nx*n,y,front.mz+uz*t+front.nz*n);o.rotation.y=rot===undefined?ry:rot;o.castShadow=true;bg.add(o);return o};
  const disc=(r,col,t,n,y,em)=>{const o=new THREE.Mesh(new THREE.CircleGeometry(r,20),new THREE.MeshStandardMaterial({color:col,roughness:.5,emissive:em||'#000000',emissiveIntensity:em?.4:0,side:THREE.DoubleSide}));o.position.set(front.mx+ux*t+front.nx*n,y,front.mz+uz*t+front.nz*n);o.rotation.y=yaw;bg.add(o);return o};
  if(k==='police'&&b.c.length===1){mpRingExtrude(bg,ring,1.012,.55,MT('#2a4a9a'),1.3+h*.5);disc(1.15,'#ffd04a',0,.16,1.3+h-2.5,'#ffd04a');disc(.8,'#2a4a9a',0,.18,1.3+h-2.5)}
  if(k==='school'){const fx=c[0],fz=c[1],pole=new THREE.Mesh(new THREE.CylinderGeometry(.07,.07,5.2,6),MT('#cfcfe0'));pole.position.set(fx,1.3+h+.55+2.6,fz);bg.add(pole);
    const fl=new THREE.Mesh(BX,MT('#ff5fa8'));fl.scale.set(1.8,1.1,.05);fl.position.set(fx+.95,1.3+h+.55+4.5,fz);bg.add(fl);
    disc(1.25,'#fdf6e8',0,.16,1.3+h-2.4);disc(1.05,'#2a2038',0,.17,1.3+h-2.4);disc(.95,'#fdf6e8',0,.18,1.3+h-2.4);box(MT('#2a2038'),.08,.8,.05,0,.2,1.3+h-2.4+.35);box(MT('#2a2038'),.55,.08,.05,.25,.2,1.3+h-2.4)}
  if(k==='warehouse'&&L>8){[-1,1].forEach(s=>{const t=s*L*.24;box(MT('#6b7f9a'),3.8,3.9,.3,t,.2,1.3+1.95);for(let i=0;i<5;i++)box(MT('#4f6178'),3.8,.1,.34,t,.22,1.3+.6+i*.7);box(MT('#ffd04a'),3.9,.18,.34,t,.22,1.3+3.9)});
    for(let i=0;i<3;i++){const v=new THREE.Mesh(BX,MT('#b9bdc9'));v.scale.set(2.2,1.2,2.2);v.position.set(c[0]+(i-1)*5,1.3+h+.55+.6,c[1]);bg.add(v)}}
  if(k==='surf'){const cols=['#ff5fa8','#ffe066','#4cc3ff','#ff7a1a'];for(let i=0;i<4;i++){const sb=new THREE.Mesh(new THREE.SphereGeometry(1,10,7),MT(cols[i]));sb.scale.set(.33,1.3,.07);sb.position.set(front.mx+ux*(-3.4+i*.55)+front.nx*.5,1.3+1.2,front.mz+uz*(-3.4+i*.55)+front.nz*.5);sb.rotation.set(-.22,yaw,.08*(i-1.5));sb.castShadow=true;bg.add(sb)}}
  if(k==='shack'){const aw=['#ff5fa8','#fdf6e8'];for(let i=0;i<6;i++){const o=box(MT(aw[i%2]),.75,.1,1.7,-1.9+i*.76,1.0,1.3+2.75);o.rotation.x=0;o.position.y=1.3+2.75;o.position.x+=front.nx*0;o.rotation.y=ry}
    [-2,2].forEach(t=>box(MT('#a8794a'),.14,3.0,.14,t,1.7,1.3+1.5))}}
/* Viktorianische Fassade: eine 0,32 m dicke Fassadenschicht mit hohen schmalen Fensteröffnungen, das Glas liegt dahinter (Fenster sind nach innen versetzt statt aufgeklebt).
   Jedes Fenster: weißer Rahmen, Sprossenkreuz (2 über 2), Fensterbank, Verdachung. Nur für die Painted-Lady-Häuser. */
function mpVicFacade(bg,a,ux,uz,nx,nz,L,cnt,step,nf,h,wall,GL,LT,lit){
  const ry=-Math.atan2(uz,ux),cream=MT('#fdf6e8'),WL=MT(wall),T=.32,ow=1.3,oh=2.3,base=1.3,top=1.3+h;
  const at=(t,n,y,w,hh,d,mat)=>{const o=new THREE.Mesh(BX,mat);o.scale.set(w,hh,d);o.position.set(a[0]+ux*t+nx*n,y,a[1]+uz*t+nz*n);o.rotation.y=ry;o.castShadow=true;bg.add(o);return o};
  const cols=[];for(let k=0;k<cnt;k++)cols.push(1+step*(k+.5));
  const bounds=cols.map(t=>[t-ow/2,t+ow/2]),piers=[[0,bounds[0][0]]];for(let i=0;i<cnt-1;i++)piers.push([bounds[i][1],bounds[i+1][0]]);piers.push([bounds[cnt-1][1],L]);
  piers.forEach(([s0,s1])=>{if(s1-s0>.05)at((s0+s1)/2,T/2,(base+top)/2,s1-s0,top-base,T,WL)});
  cols.forEach((t,k)=>{let y0=base;for(let f=0;f<nf;f++){const yc=1.3+1.8+f*3.3+1.15,yb=yc-oh/2,yt=yc+oh/2;
      at(t,T/2,(y0+yb)/2,ow,yb-y0,T,WL);
      at(t,.03,yc,ow,oh,.04,lit(f,k)?LT:GL);                                   /* Glas, bündig mit der Wand = hinter der Schicht */
      [-1,1].forEach(sd=>at(t+sd*(ow/2-.05),T/2,yc,.1,oh,T,cream));              /* Rahmen links, rechts */
      at(t,T/2,yt-.05,ow,.1,T,cream);at(t,T/2,yb+.05,ow,.1,T,cream);             /* Rahmen oben, unten */
      at(t,.1,yc+.12,ow-.1,.07,.06,cream);at(t,.1,yc,.07,oh-.1,.06,cream);       /* Sprossenkreuz */
      at(t,T+.06,yb-.07,ow+.45,.13,.3,cream);                                    /* Fensterbank */
      at(t,T+.1,yt+.13,ow+.5,.17,.46,cream);at(t,T+.1,yt+.3,ow-.1,.14,.36,cream);at(t,T+.2,yt+.14,.22,.3,.2,cream); /* Verdachung mit Schlussstein */
      y0=yt}
    at(t,T/2,(y0+top)/2,ow,top-y0,T,WL)})}
function mpGenBuilding(bg,b,wall,h,idx,sign){
  const ring=b.c[0].map(p=>[mwx(p[0]),mwz(p[1])]),vp=r=>r.map(p=>new THREE.Vector2(p[0],-p[1]));
  const sh=new THREE.Shape(vp(ring));b.c.slice(1).forEach(c=>sh.holes.push(new THREE.Path(vp(c.map(p=>[mwx(p[0]),mwz(p[1])])))));
  const mk=(depth,mat,y)=>{const g=new THREE.ExtrudeGeometry(sh,{depth,bevelEnabled:false});g.rotateX(-Math.PI/2);const m=new THREE.Mesh(g,mpDS(mat));m.position.y=y;m.castShadow=true;m.receiveShadow=true;bg.add(m);return m};
  mk(h,MT(wall),1.3);mk(.55,MT('#f6efe6'),1.3+h);
  const GL=MT('#5a8fc4','#5a8fc4',.2),LT=MT('#ffe9a0','#ffe9a0',.9),nf=Math.max(1,Math.floor((h-1.4)/3.3)),n=ring.length;
  const vic=!/station|casino|shopping|resort|tower|police|school|warehouse/.test(b.kind||'')&&b.area*MP.SC*MP.SC<650,DO=vic?.36:0;/* vic: Painted-Lady-Haus mit Fassadenschicht, DO = Abstand der Anbauten (Tür, Stufen) davor */
  const rp=mpNearRoad(b.cen[0],b.cen[1]);let sbest=null;
  for(let e=0;e<n;e++){const a=ring[e],c=ring[(e+1)%n],dx=c[0]-a[0],dz=c[1]-a[1],L=Math.hypot(dx,dz);if(L<5)continue;const ux=dx/L,uz=dz/L;let nx=uz,nz=-ux;const mx=(a[0]+c[0])/2,mz=(a[1]+c[1])/2;
    if(mpInPoly(ring,mx+nx*.4,mz+nz*.4)){nx=-nx;nz=-nz}
    if(rp){const d=Math.hypot(mx-mwx(rp.x),mz-mwz(rp.y))-(nx*(mwx(rp.x)-mx)+nz*(mwz(rp.y)-mz))*.3;if(!sbest||d<sbest.d)sbest={d,mx,mz,nx,nz,L}}
    const cnt=Math.floor((L-2)/3.4),step=(L-2)/Math.max(1,cnt);
    if(vic&&cnt>=1)mpVicFacade(bg,a,ux,uz,nx,nz,L,cnt,step,nf,h,wall,GL,LT,(f,k)=>(f*7+k*3+idx+e)%5<2);else
    for(let f=0;f<nf;f++)for(let k=0;k<cnt;k++){const t=1+step*(k+.5),m=new THREE.Mesh(BX,((f*7+k*3+idx+e)%5<2)?LT:GL);m.scale.set(1.7,1.9,.14);m.position.set(a[0]+ux*t+nx*.07,1.3+1.5+f*3.3+.95,a[1]+uz*t+nz*.07);m.rotation.y=-Math.atan2(uz,ux);bg.add(m)}}
  /* Dachaufbauten */
  const cen=[mwx(b.cen[0]),mwz(b.cen[1])];if(mpInPoly(ring,cen[0],cen[1])){const m=new THREE.Mesh(BX,MT('#b9bdc9'));m.scale.set(3.2,1.1,2.4);m.position.set(cen[0],1.3+h+.55+.55,cen[1]);bg.add(m)}
  if(sign&&sbest){const w=Math.min(12,Math.max(5.5,sbest.L*.7)),sg=new THREE.Mesh(new THREE.PlaneGeometry(w,w*.24),signMat(sign,'#ffe066','#1a1030'));sg.position.set(sbest.mx+sbest.nx*(.25+DO),1.3+Math.min(h-1.6,5.8),sbest.mz+sbest.nz*(.25+DO));sg.rotation.y=Math.atan2(sbest.nx,sbest.nz);sg.userData.noBake=true;sg.userData.noOutline=true;bg.add(sg)}
  /* Eingang: Tür mit Glas und Vordach an der Fassade zur Straße (Bahnhof und große Gebäude breiter) */
  if(sbest){(HUB.doors=HUB.doors||[]).push([sbest.mx+sbest.nx*1.5,sbest.mz+sbest.nz*1.5])}
  if(sbest&&b.kind==='police'){HUB.policeStation={x:sbest.mx+sbest.nx*4,z:sbest.mz+sbest.nz*4};const bc=new THREE.Mesh(BX,MT('#2a6aff','#2a6aff',.9));bc.scale.set(1.2,.6,2.2);bc.position.set(ring.reduce((a,p)=>a+p[0],0)/ring.length,1.3+h+1.4,ring.reduce((a,p)=>a+p[1],0)/ring.length);bg.add(bc)}
  if(sbest&&b.kind==='station')HUB.station={x:sbest.mx,z:sbest.mz,nx:sbest.nx,nz:sbest.nz};
  if(sbest){const big=/station|casino|shopping|resort|tower/.test(b.kind||''),dw=big?4.6:1.9,ux=-sbest.nz,uz=sbest.nx,ry=-Math.atan2(uz,ux),px=sbest.mx+sbest.nx*(.12+DO),pz=sbest.mz+sbest.nz*(.12+DO);
    const part=(m,w,hh,d,x,y,z)=>{const o=new THREE.Mesh(BX,m);o.scale.set(w,hh,d);o.position.set(x,y,z);o.rotation.y=ry;o.castShadow=true;bg.add(o);return o};
    part(MT('#2a2038'),dw+.5,2.9,.2,px,1.3+1.45,pz);
    part(MT('#9fe6f0','#9fe6f0',.35),dw-.3,2.5,.24,px+sbest.nx*.03,1.3+1.3,pz+sbest.nz*.03);
    part(MT('#2a2038'),.14,2.5,.28,px+sbest.nx*.05,1.3+1.3,pz+sbest.nz*.05);
    part(MT('#f6efe6'),dw+1.6,.3,1.5,px+sbest.nx*.7,1.3+3.2,pz+sbest.nz*.7)}
  /* Look: kleine und mittlere Häuser = Painted Lady (Giebel zur Straße, Erker, Rahmen, Stufen), große und besondere = Art déco (Krone, Neonband, Zierleisten) */
  {const aM=b.area*MP.SC*MP.SC,special=/station|casino|shopping|resort|tower/.test(b.kind||''),civic=/police|school|warehouse/.test(b.kind||''),house=!special&&!civic&&aM<650;
   mpKindExtras(bg,b,ring,h,sbest);
   if(house&&sbest){const y0=1.3+h+.55,trim='#fdf6e8';
     if(!mpGableRoof(bg,ring,sbest,y0,idx,trim))mpTurret(bg,ring,y0,idx,wall);
     mpBay(bg,sbest,wall,1.3,h,idx);
     const ux=-sbest.nz,uz=sbest.nx,ry=-Math.atan2(uz,ux),st=MT('#fdf6e8');[0,1].forEach(i=>{const t=new THREE.Mesh(BX,st);t.scale.set(2.8,.22-i*.08,.55);t.position.set(sbest.mx+sbest.nx*(.35+DO+i*.5),1.3+.11,sbest.mz+sbest.nz*(.35+DO+i*.5));t.rotation.y=ry;bg.add(t)})}
   else if(!house&&!civic)mpDecoCrown(bg,b,ring,h,idx)}
  return ring}
function mpBuildings(H){
  const solids=[],groups=[];const L0=MAPD.labels;
  const kindOf=t=>/Poli(zei|ce)/i.test(t)?'police':/Schule|School/i.test(t)?'school':/Surf/i.test(t)?'surf':/Shack/i.test(t)?'shack':/Warehouse|Lagerhalle/i.test(t)?'warehouse':/P-Mart/.test(t)?'pmart':/Station/.test(t)?'station':/^Lab$/.test(t)?'lab':/X-Mas/.test(t)?'xmas':/Resort/.test(t)?'resort':/Casino/.test(t)?'casino':/Shopping/.test(t)?'shopping':/Tower/.test(t)?'tower':/Backoffice/i.test(t)?'backoffice':'';
  MAPD.buildings.forEach((b,i)=>{b.i=i;b.kind='';b.skip=false;b.cen=mpCentroid(b.c[0]);b.area=Math.abs(mpArea(b.c[0]))});
  L0.forEach(l=>{const k=kindOf(l.t);if(!k)return;MAPD.buildings.forEach(b=>{if(mpInPoly(b.c[0],l.x,l.y)){b.kind=k;b.label=l.t}})});
  /* Beschriftung steht neben dem Gebäude statt darin (z. B. "Surf Shop", "Beach Shack"): nächstes freies Gebäude bis 45 Karteneinheiten (22 m) */
  const dPoly=(r,x,y)=>{let d=1e9;for(let i=0;i<r.length;i++){const p=r[i],q=r[(i+1)%r.length],dx=q[0]-p[0],dy=q[1]-p[1],L2=dx*dx+dy*dy||1e-9;let t=((x-p[0])*dx+(y-p[1])*dy)/L2;t=Math.max(0,Math.min(1,t));d=Math.min(d,Math.hypot(x-p[0]-dx*t,y-p[1]-dy*t))}return d};
  HUB.labelWarn=[];L0.forEach(l=>{const k=kindOf(l.t);if(!k)return;if(MAPD.buildings.some(b=>mpInPoly(b.c[0],l.x,l.y)))return;let best=null;MAPD.buildings.forEach(b=>{if(b.kind)return;const d=dPoly(b.c[0],l.x,l.y);if(d<=45&&(!best||d<best.d))best={d,b}});
    if(best){best.b.kind=k;best.b.label=l.t}else HUB.labelWarn.push(l.t)});
  const SIGN={school:'SCHULE',surf:'SURF SHOP',shack:'BEACH SHACK',warehouse:'WAREHOUSE',police:'POLIZEI',station:'PORT LUPO STATION',casino:'MARINA CLUB CASINO',shopping:'SHOPPING COURT',resort:'BEACH RESORT',tower:'OFFICE TOWER',backoffice:'ANMELDUNG LAGER'};
  const WALL={school:'#e9a97c',surf:'#7fd8d0',shack:'#ecc888',warehouse:'#9fb0c8',police:'#9db8e8',station:'#f6efe6',casino:'#ff5fa8',shopping:'#f6df73',resort:'#fff0d8',tower:'#2a3a6a',backoffice:'#cdd6e0'};
  const mkGroup=(x,z)=>{const bg=new THREE.Group();bg.userData.noBake=true;bg.userData.blk={x,z};W0.add(bg);HUB.bgroups.push(bg);return bg};
  MAPD.buildings.forEach(b=>{const aM=b.area*MP.SC*MP.SC,X=mwx(b.cen[0]),Z=mwz(b.cen[1]);
    if(b.kind==='pmart'||b.kind==='lab'||b.kind==='xmas'){
      const o=mpObb(b.c[0]),cx=mwx(o.cx),cz=mwz(o.cy),bg=mkGroup(cx,cz);b.skip=true;b.bg=bg;
      const yaw=mpFrontYaw(o.cx,o.cy);b.yaw=yaw;b.X=cx;b.Z=cz;
      if(b.kind==='pmart'){const real=HUB.shops?HUB.shops.length:0;mpStamp(H,()=>H.TYPES[1](0),cx,cz,yaw,bg,1);const sh=HUB.shops.splice(real);const p=mpTf(cx,cz,yaw,0,-10.8);HUB.shops.push({x:p[0],z:p[1],cx,cz});solids.push({x:o.cx,y:o.cy,a:-yaw,w:54,h:34})}
      else if(b.kind==='lab'){mpStamp(H,()=>buildLabBlock(),cx,cz,yaw,bg,1);solids.push({x:o.cx,y:o.cy,a:-yaw,w:62,h:50});
        const dr=mpTf(cx,cz,yaw,-2,-18),mn=mpTf(cx,cz,yaw,9,-18.5),pt=mpTf(cx,cz,yaw,20,-17),st=mpTf(cx,cz,yaw,16,-17),vn=mpTf(cx,cz,yaw,-13,-20),sp=mpTf(cx,cz,yaw,-1,-18);
        HUB.lab={i:0,j:0,cx,cz,a:0,b:0,portalNode:0,doorX:dr[0],doorZ:dr[1],manX:mn[0],manZ:mn[1],portalX:pt[0],portalZ:pt[1],standX:st[0],standZ:st[1],vanX:vn[0],vanZ:vn[1],vanR:yaw+Math.PI/2,spawnX:sp[0],spawnZ:sp[1],spawnH:Math.atan2(cz-sp[1],cx-sp[0]),yaw};
        }
      else{mpStamp(H,()=>buildGingerBlock(),cx,cz,yaw,bg,1);solids.push({x:o.cx,y:o.cy,a:-yaw,w:54,h:44});const sgp=mpTf(cx,cz,yaw,0,-19.8);HUB.gb={i:0,j:0,cx,cz,sx:sgp[0],sz:sgp[1],yaw}}
      return}
    const kind=b.kind;let h;switch(kind){case 'tower':h=64;break;case 'resort':h=30;break;case 'casino':h=17;break;case 'shopping':h=13;break;case 'station':h=10;break;case 'police':h=9;break;case 'school':h=11;break;case 'surf':h=6.6;break;case 'shack':h=5.4;break;case 'warehouse':h=9;break;case 'backoffice':h=6.5;break;
      default:h=aM<150?7.2:aM<650?7.5+(b.i*7%3)*3:9+(b.i*5%9)}
    const bg=mkGroup(X,Z);b.bg=bg;mpGenBuilding(bg,b,WALL[kind]||MPPAST[b.i%7],h,b.i,SIGN[kind]||null);b.h=h;if(kind==='backoffice'){const d=(HUB.doors||[])[(HUB.doors||[]).length-1];if(d)HUB.backoffice={x:d[0],z:d[1]}}});
  /* Café Pengu und AstroBurger an den Markern C und B */
  MAPD.markers.forEach(m=>{const lab=L0.find(l=>Math.hypot(l.x-m.x,l.y-m.y)<12&&(l.t==='C'||l.t==='B'));if(!lab)return;const yaw=mpFrontYaw(m.x,m.y),X=mwx(m.x),Z=mwz(m.y);
    if(lab.t==='C'){let sc=.6,pos=[m.x,m.y];for(const k of [1,.85,.7,.6]){const f=mpFitClear(m.x,m.y,11*k,90);if(f){sc=k;pos=f;break}}
      const ux=pos[0],uy=pos[1],X2=mwx(ux),Z2=mwz(uy),yaw2=mpFrontYaw(ux,uy),bg=mkGroup(X2,Z2);mpStamp(H,()=>H.TYPES[2](0),X2,Z2,yaw2,bg,sc);solids.push({x:ux,y:uy,a:0,r:Math.round(26*sc)});HUB.cafe={x:X2,z:Z2,ux,uy,yaw:yaw2}}
    else{let sc=.8,pos=[m.x,m.y];for(const k of [.8,.7,.6]){const f=mpFitClear(m.x,m.y,9.5*k/.8);if(f){sc=k;pos=f;break}}
      const ux=pos[0],uy=pos[1],X2=mwx(ux),Z2=mwz(uy),yaw2=mpFrontYaw(ux,uy),bg=mkGroup(X2,Z2);mpStamp(H,()=>H.TYPES[4](0),X2,Z2,yaw2,bg,sc);solids.push({x:ux,y:uy,a:0,r:Math.round(21*sc)});HUB.burger={x:X2,z:Z2,ux,uy,yaw:yaw2}}});
  return solids}

/* ---------- S-Bahn (oberirdisch, rot durchgezogen) mit Tunnelmund; gestrichelt = unterirdisch ---------- */
function mpRail(add){if(typeof mpSkateSetup==='function')mpSkateSetup();
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
  for(let s=8;s<Lr;s+=24){let placed=false;for(const sh of [0,-6,6,-12,12]){if(placed)break;const ss=Math.max(2,Math.min(Lr-2,s+sh)),p=posAt(ss),nx=-Math.sin(p.h),nz=Math.cos(p.h),y=yAt(ss);
    for(const d of [0,5,-5,9,-9,13,-13]){const x=p.x+nx*d,z=p.z+nz*d,c=mpAt(x,z);if(c===2||c===5)continue;if(SKATE.on&&skateCellD(x,z)>0)continue;/* nie mitten im Skatepark (Pool, Aufenthaltsbereich) */if(c===0&&mpIsLand(x,z))continue;
      col.push({x,z,y:(y-.8+1.0)/2,h:y-.8-1.0});beam.push({x:p.x+nx*d/2,z:p.z+nz*d/2,y:y-1.25,ry:-p.h,len:Math.abs(d)+4.6});if(c!==0)sol.push({x,z});placed=true;break}}}
  HUB.railPillars=(HUB.railPillars||[]).concat(col.map(c=>({x:c.x,z:c.z})));
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
/* Bauplätze (rote Umrisse in der Karte) bleiben frei von Bäumen und Dekoration */
function mpPlotNear(X,Z,r){const P=MAPD.plots;if(!P||!P.length)return false;const ux=mux(X),uy=muy(Z),ru=r/MP.SC;
  for(const pl of P){const ring=pl.c[0];for(let a=0;a<9;a++){const x=a?ux+Math.cos(a/8*6.283)*ru:ux,y=a?uy+Math.sin(a/8*6.283)*ru:uy;if(mpInPoly(ring,x,y))return true}}return false}
function mpFree(X,Z,r,allowRoad){if(mpPlotNear(X,Z,r))return false;return mpFree0(X,Z,r,allowRoad)}
function mpFree0(X,Z,r,allowRoad){for(let a=0;a<12;a++){const ang=a/12*Math.PI*2;for(const rr of [r,r*.5]){const c=mpAt(X+Math.cos(ang)*rr,Z+Math.sin(ang)*rr);if(!(c===1||c===3||c===4||(allowRoad&&c===2)))return false}}const c0=mpAt(X,Z);return c0===1||c0===3||c0===4||(allowRoad&&c0===2)}
function mpFindFree(ux,uy,r,maxM,allowRoad){for(let d=0;d<=maxM;d+=2)for(let a=0;a<(d?16:1);a++){const ang=a/16*Math.PI*2+d,X=mwx(ux)+Math.cos(ang)*d,Z=mwz(uy)+Math.sin(ang)*d;if(mpFree(X,Z,r,allowRoad))return [X,Z]}return null}
/* Punkte auf Bürgersteigen für Gräber, Zuschauer, Zapfsäulen */
function mpSpotPool(){const R=mulberry(2024),out=[];for(let y=0;y<MP.h;y+=5)for(let x=0;x<MP.w;x+=5){if(MP.cls[y*MP.w+x]===3){const X=mwx(x+MP.PLAY.x0+(R()-.5)*3),Z=mwz(y+MP.PLAY.y0+(R()-.5)*3);if(mpAt(X,Z)===3)out.push([X,Z])}}
  for(let i=out.length-1;i>0;i--){const j=Math.floor(R()*(i+1));[out[i],out[j]]=[out[j],out[i]]}return out}
function mpLamps(){const out=[];let k=0;MAPD.roads.forEach(r=>{const wM=Math.max(r.w,MP.RW)*MP.SC;mpResample(r.pts,26).forEach(s=>{if(!(s.tx||s.tz))return;const side=(k++%2)?1:-1,off=wM/2+MP.SWK*.5,x=s.x-s.tz*side*off,z=s.z+s.tx*side*off;if(mpAt(x,z)===3&&!(HUB.doors||[]).some(d=>Math.hypot(d[0]-x,d[1]-z)<5.5))out.push([x,z])})});return out}

/* ---------- Polizei: kommt nach illegalem Graffiti (1 Minute, nachts 3), Skate-Polizisten verfolgen im Sichtradius, Festnahme = Nahaufnahme und 10 Scoops Strafe ---------- */
const POL={state:'idle',role:null,pend:null,g2:null,q2:[],cops1:null,helped:false,timer:0,total:0,spot:null,cops:[],cin:null,hud:null,loseT:0,t:0,chaseT:0,search:0,FINE:10,SIGHT:42,SPEED:9.2};
PRE['#2a4a9a']={skin:'#e0a98a',top:'#2a4a9a',bot:'#1f2a4a',sole:'#f0cf36',hair:'cap',hc:'#1f2a4a',lens:'#141416',frame:'#141416',pack:'#1f2a4a',pads:'#c9d4ff',watch:1,stripe:'#ffffff'};
PRE['#3a5ab8']={skin:'#c98e6a',top:'#3a5ab8',bot:'#1f2a4a',sole:'#ffffff',hair:'cap',hc:'#1f2a4a',lens:'#141416',frame:'#141416',pack:'#1f2a4a',pads:'#c9d4ff',watch:1,stripe:'#ffffff'};
/* ---------- Streifenwagen: fährt von der Wache auf den Straßen zum Ort (A*-Wegfindung auf einem 2-m-Raster der Karte) ---------- */
const PNAV={cell:2,w:0,h:0,x0:0,z0:0,ok:null};
function polNavInit(){if(PNAV.ok)return PNAV.ok;const c=PNAV.cell;PNAV.x0=mwx(MP.PLAY.x0);PNAV.z0=mwz(MP.PLAY.y0);PNAV.w=Math.ceil(MP.w*MP.SC/c);PNAV.h=Math.ceil(MP.h*MP.SC/c);
  const g=new Uint8Array(PNAV.w*PNAV.h);for(let iz=0;iz<PNAV.h;iz++)for(let ix=0;ix<PNAV.w;ix++){const X=PNAV.x0+ix*c+c/2,Z=PNAV.z0+iz*c+c/2;if(mpAt(X,Z)!==2)continue;
    if(mpAt(X+1,Z)===2&&mpAt(X-1,Z)===2&&mpAt(X,Z+1)===2&&mpAt(X,Z-1)===2)g[iz*PNAV.w+ix]=1}
  return PNAV.ok=g}
function polCellOf(X,Z){return [Math.floor((X-PNAV.x0)/PNAV.cell),Math.floor((Z-PNAV.z0)/PNAV.cell)]}
function polNearestCell(X,Z,maxR){const g=polNavInit(),[cx,cz]=polCellOf(X,Z);for(let r=0;r<=maxR;r++)for(let dz=-r;dz<=r;dz++)for(let dx=-r;dx<=r;dx++){if(Math.max(Math.abs(dx),Math.abs(dz))!==r)continue;const ix=cx+dx,iz=cz+dz;if(ix>=0&&iz>=0&&ix<PNAV.w&&iz<PNAV.h&&g[iz*PNAV.w+ix])return [ix,iz]}return null}
function polPath(sx,sz,tx,tz){const g=polNavInit(),W=PNAV.w,c=PNAV.cell,s0=polNearestCell(sx,sz,12),g0=polNearestCell(tx,tz,12);if(!s0||!g0)return null;
  const idx=(x,z)=>z*W+x,N=W*PNAV.h,gs=new Float32Array(N).fill(1e9),from=new Int32Array(N).fill(-1),closed=new Uint8Array(N),heap=[];
  const hf=(x,z)=>{const dx=Math.abs(x-g0[0]),dz=Math.abs(z-g0[1]);return (dx+dz)+(1.414-2)*Math.min(dx,dz)};
  const push=(f,i)=>{heap.push([f,i]);let k=heap.length-1;while(k>0){const p=(k-1)>>1;if(heap[p][0]<=heap[k][0])break;[heap[p],heap[k]]=[heap[k],heap[p]];k=p}};
  const pop=()=>{const t=heap[0],l=heap.pop();if(heap.length){heap[0]=l;let k=0;for(;;){let a=k*2+1,b=a+1,m=k;if(a<heap.length&&heap[a][0]<heap[m][0])m=a;if(b<heap.length&&heap[b][0]<heap[m][0])m=b;if(m===k)break;[heap[m],heap[k]]=[heap[k],heap[m]];k=m}}return t};
  const si=idx(s0[0],s0[1]),gi=idx(g0[0],g0[1]);gs[si]=0;push(hf(s0[0],s0[1]),si);let n=0,found=false;
  while(heap.length&&n++<60000){const [,i]=pop();if(closed[i])continue;closed[i]=1;if(i===gi){found=true;break}const x=i%W,z=(i/W)|0;
    for(let dz=-1;dz<=1;dz++)for(let dx=-1;dx<=1;dx++){if(!dx&&!dz)continue;const nx=x+dx,nz=z+dz;if(nx<0||nz<0||nx>=W||nz>=PNAV.h)continue;const j=idx(nx,nz);if(!g[j]||closed[j])continue;
      if(dx&&dz&&(!g[idx(x+dx,z)]||!g[idx(x,z+dz)]))continue;const ng=gs[i]+(dx&&dz?1.414:1);if(ng<gs[j]){gs[j]=ng;from[j]=i;push(ng+hf(nx,nz),j)}}}
  if(!found)return null;const cells=[];for(let i=gi;i!==-1;i=from[i])cells.push([i%W,(i/W)|0]);cells.reverse();
  /* Pfad glätten: Zwischenpunkte weglassen, wenn die gerade Linie frei ist */
  const clear=(a,b)=>{const n=Math.max(Math.abs(b[0]-a[0]),Math.abs(b[1]-a[1]))*2||1;for(let k=0;k<=n;k++){const x=Math.round(a[0]+(b[0]-a[0])*k/n),z=Math.round(a[1]+(b[1]-a[1])*k/n);if(!g[idx(x,z)])return false}return true};
  const out=[cells[0]];let i=0;while(i<cells.length-1){let j=cells.length-1;while(j>i+1&&!clear(cells[i],cells[j]))j--;out.push(cells[j]);i=j}
  return out.map(([x,z])=>({x:PNAV.x0+x*c+c/2,z:PNAV.z0+z*c+c/2}))}
function mpPoliceCar(){const g=new THREE.Group(),car=mpRetroCar(0,'#fdf6e8'),blue=MT('#2a4a9a'),navy=MT('#1f2a4a');car.scale.setScalar(1.25);g.add(car);
  const bx=(m,w,h,d,x,y,z)=>{const o=new THREE.Mesh(BX,m);o.scale.set(w,h,d);o.position.set(x,y,z);o.castShadow=true;car.add(o);return o};
  [-1,1].forEach(sd=>{bx(blue,.07,.28,1.7,sd*.98,.82,.15);bx(navy,.07,.1,2.6,sd*.97,.66,.1)});bx(blue,1.5,.1,1.0,0,1.76,-.15);   /* Türstreifen, blaues Dach-Brett */
  const mk=(c,x)=>{const m=new THREE.Mesh(new THREE.SphereGeometry(.16,10,8),new THREE.MeshBasicMaterial({color:c}));m.scale.set(1.3,1,1);m.position.set(x,1.98,-.15);car.add(m);return m};
  const la=mk('#ff2a2a',-.26),lb=mk('#2a6aff',.26);bx(navy,.9,.06,.32,0,1.86,-.15);
  const sg=new THREE.Mesh(new THREE.PlaneGeometry(1.3,.32),signMat('POLIZEI','#ffffff','#2a4a9a'));sg.position.set(0,1.21,1.12);sg.rotation.x=-.05;car.add(sg);
  g.userData.noBake=true;W0.add(g);addOutlines(g,'prop');return {g,la,lb,x:0,z:0,h:0,v:0,path:[],pi:0,done:false}}
function polPlaceCar(c,x,z,h){c.x=x;c.z=z;c.h=h;c.g.position.set(x,cityGround(x,z),z);c.g.rotation.y=Math.PI/2-h}
/* Fahren: dem Weg folgen, in Kurven langsamer */
function polDriveStep(c,dt){if(c.done||!c.path.length)return;const p=c.path[Math.min(c.pi,c.path.length-1)],dx=p.x-c.x,dz=p.z-c.z,L=Math.hypot(dx,dz);
  if(L<3.2){c.pi++;if(c.pi>=c.path.length){c.done=true;c.v=0;return}}
  const want=Math.atan2(dz,dx);let d=want-c.h;d=Math.atan2(Math.sin(d),Math.cos(d));c.h+=Math.max(-3.4*dt,Math.min(3.4*dt,d));
  const target=Math.abs(d)>.9?5.5:Math.abs(d)>.4?9:13.5;c.v+=(target-c.v)*Math.min(1,dt*3);c.x+=Math.cos(c.h)*c.v*dt;c.z+=Math.sin(c.h)*c.v*dt}
function polHud(){if(POL.hud)return POL.hud;const d=document.createElement('div');d.id='pol';d.style.cssText="position:absolute;top:64px;left:50%;transform:translateX(-50%);padding:8px 16px;border-radius:12px;border:3px solid #0e0b18;background:rgba(26,22,38,.9);color:#fff;font:800 16px/1.2 'Baloo 2',sans-serif;letter-spacing:.04em;display:none;z-index:3;box-shadow:0 4px 0 #0e0b18;pointer-events:none";const ui=document.getElementById('ui');(ui||document.body).appendChild(d);return POL.hud=d}
function polText(t,col){const h=polHud();h.style.display=t?'block':'none';h.style.borderColor=col||'#0e0b18';h.textContent=t||''}
function polNight(){return (typeof DAY!=='undefined'&&DAY.dn!==undefined?DAY.dn:1)<.35}
/* Alarm: allein sofort; im Raum fragt der Server, wer als Erster gesprüht hat (Rolle "owner" = wird gejagt, "second" = zweiter Wagen, sonst abgewiesen) */
function polAlert(panel){if(POL.state!=='idle'||POL.pend)return;
  if(typeof MULTI!=='undefined'&&MULTI.on){POL.pend={panel};multiSend({t:'pol',a:'start',x:panel.ax,z:panel.az});setTimeout(()=>{if(POL.pend&&POL.pend.panel===panel){POL.pend=null;polAlertGo(panel,'owner')}},3000);return}
  polAlertGo(panel,'owner')}
function polAlertGo(panel,role){if(POL.state!=='idle')return;const night=polNight();POL.role=role;POL.helped=false;POL.state='warn';POL.total=POL.timer=night?180:60;POL.spot={x:panel.ax,z:panel.az};
  toast('Achtung! Die Polizei wurde gerufen',2600);say('e','Jemand hat dein Graffiti gemeldet. Die Polizei ist in '+(night?'drei Minuten':'einer Minute')+' da. Verschwinde besser, sonst gibt es '+POL.FINE+' Scoops Strafe.',5.2);tone(520,.18,'square',.05);tone(390,.22,'square',.05,0,.2)}
function polNetCmd(m){
  if(m.a==='grant'){if(POL.pend){const pn=POL.pend.panel;POL.pend=null;polAlertGo(pn,m.role)}}
  else if(m.a==='deny'){POL.pend=null;toast('Die Polizei ist gerade bei jemand anderem im Einsatz.',2800)}
  else if(m.a==='launch'){POL.q2.push({from:m.from,x:m.x,z:m.z})}
  else if(m.a==='caught'){polRemoteCaught()}
  else if(m.a==='free'){if(POL.role==='second'&&POL.state!=='idle'){polEnd('Glück gehabt! Die Polizei zieht ab.')}}
  else if(m.a==='secondgone'){if(POL.g2&&POL.g2.target!=='me')polG2End(null)}
  else if(m.a==='gone'){polRemoteHide(true)}}
function polSpawnPoint(){if(HUB.policeStation)return {x:HUB.policeStation.x,z:HUB.policeStation.z};let best=null;MAPD.roads.forEach(r=>mpResample(r.pts,20).forEach(s=>{if(!(s.tx||s.tz)||mpAt(s.x,s.z)!==2||s.z>186)return;const d=Math.hypot(s.x-P.x,s.z-P.z);if(d>95&&d<170&&(!best||Math.abs(d-130)<Math.abs(best.d-130)))best={x:s.x,z:s.z,d}}));return best||{x:P.x+60,z:P.z}}
function polMakeCop(x,z,col,i){const g=skater(x,cityGround(x,z),z,0,col,1.35);g.userData.noBake=true;W0.add(g);
  /* Rollschuhe statt Skateboard: Board ausblenden, vier Rollen unter jeden Fuß, Beine pendeln beim Laufen */
  const grp=g.children.filter(c=>c.isGroup),board=grp[0],P0=grp[1],legs=P0?P0.children.filter(c=>c.isGroup&&c.children.length===2):[];if(board)board.visible=false;
  const wm=new THREE.MeshStandardMaterial({color:'#f6efe6',roughness:.5}),pm=new THREE.MeshStandardMaterial({color:'#2a2a38',roughness:.6}),wheels=[],swing=[];
  legs.forEach((th,li)=>{swing.push({th,base:th.rotation.x,ph:li?Math.PI:0});const sh=th.children.find(c=>c.isGroup),ft=sh&&sh.children.find(c=>c.isGroup);if(!ft)return;
    const plate=new THREE.Mesh(BX,pm);plate.scale.set(.13,.03,.34);plate.position.set(0,-.14,.07);ft.add(plate);
    [-.06,.06].forEach(dx=>[-.07,.2].forEach(dz=>{const w=new THREE.Mesh(new THREE.CylinderGeometry(.05,.05,.04,8),wm);w.rotation.z=Math.PI/2;w.position.set(dx,-.17,dz);ft.add(w);wheels.push(w)}))});
  g.updateMatrixWorld(true);let low=1e9;wheels.forEach(w=>{const v=new V3();w.getWorldPosition(v);low=Math.min(low,v.y-.05*1.35)});const yadd=isFinite(low)?cityGround(x,z)-low:0;
  addOutlines(g,'actor');const mk=c=>{const m=new THREE.Mesh(new THREE.SphereGeometry(.16,8,6),new THREE.MeshBasicMaterial({color:c}));m.position.set(0,2.55,0);g.add(m);return m},la=mk('#ff2a2a'),lb=mk('#2a6aff');la.position.x=-.22;lb.position.x=.22;
  return {g,x,z,h:0,la,lb,i,sp:POL.SPEED+(i?.5:0),swing,yadd,mv:0}}
function polDispatch(){const sp=polSpawnPoint();POL.cops.forEach(c=>W0.remove(c.g));POL.cops=[polMakeCop(sp.x,sp.z,'#2a4a9a',0),polMakeCop(sp.x+2.4,sp.z+1.2,'#3a5ab8',1)];POL.search=0;POL.t=0;
  const path=polPath(sp.x,sp.z,POL.spot.x,POL.spot.z);
  if(path&&path.length>1){POL.car=mpPoliceCar();POL.car.path=path;POL.car.pi=1;polPlaceCar(POL.car,path[0].x,path[0].z,Math.atan2(path[1].z-path[0].z,path[1].x-path[0].x));POL.cops.forEach(c=>c.hide=true);POL.state='drive';toast('Der Streifenwagen rückt aus!',1800);polText('POLIZEI UNTERWEGS','#4a7aff')}
  else{POL.state='patrol';toast('Die Polizei ist da!',1800);polText('POLIZEI IM EINSATZ','#4a7aff')}}
/* Wagen am Ziel: Polizisten steigen aus, der Wagen bleibt mit Blaulicht stehen */
function polArrive(){const c=POL.car;if(c){c.v=0;POL.cops.forEach((o,i)=>{const a=c.h+Math.PI/2*(i?-1:1);o.x=c.x+Math.cos(a)*2.4;o.z=c.z+Math.sin(a)*2.4;o.hide=false;o.h=c.h});SFX.thud&&tone(180,.12,'square',.04)}
  POL.state='patrol';POL.search=0;toast('Die Polizei ist da!',1800);polText('POLIZEI IM EINSATZ','#4a7aff')}
function polMove(c,tx,tz,sp,dt){const dx=tx-c.x,dz=tz-c.z,L=Math.hypot(dx,dz)||1,st=Math.min(L,sp*dt),a0=Math.atan2(dz,dx);c.moved=(c.moved||0)+st;
  /* geradeaus, sonst um Hindernisse herum: Ausweichwinkel probieren, die zuletzt gewählte Seite bevorzugen */
  const side=c.side||1;for(const off of [0,.5,-.5,1.0,-1.0,1.6,-1.6,2.3,-2.3]){const ang=a0+off*side,nx=c.x+Math.cos(ang)*st,nz=c.z+Math.sin(ang)*st;if(mpWalk(nx,nz)&&mpWalk(c.x+Math.cos(ang)*(st+.8),c.z+Math.sin(ang)*(st+.8))){c.x=nx;c.z=nz;c.h=ang;if(off)c.side=off>0?1:-1;return L}}
  c.side=-side;return L}
function polDraw(dt){const flash=Math.floor(POL.t*4)%2===0,up=!G.under&&LV.id===0;POL.cops.forEach(c=>{const g=c.g;g.visible=up&&!c.hide;g.position.set(c.x,cityGround(c.x,c.z)+(c.yadd||0),c.z);g.rotation.y=Math.PI/2-c.h;la_lb(c,flash);
  const mv=c.moved||0;c.moved=0;c.mv+=mv*.9;(c.swing||[]).forEach(sw=>{sw.th.rotation.x=sw.base+Math.sin(c.mv*1.1+sw.ph)*Math.min(.55,mv/.4)})});
  const car=POL.car;if(car){car.g.visible=up;car.g.position.set(car.x,cityGround(car.x,car.z),car.z);car.g.rotation.y=Math.PI/2-car.h;car.g.rotation.z=0;car.la.visible=flash;car.lb.visible=!flash}}
function la_lb(c,f){c.la.visible=f;c.lb.visible=!f}
function polClearGroup1(){(POL.cops1||[]).forEach(c=>W0.remove(c.g));POL.cops1=null;POL.cops.forEach(c=>{if(!c.remote)W0.remove(c.g)});POL.cops=[];if(POL.car){W0.remove(POL.car.g);POL.car=null}}
function polEnd(msg,col){const wasOwner=POL.role==='owner';polClearGroup1();
  if(POL.g2&&POL.g2.target==='me')polG2End(null,true);
  POL.state='idle';POL.cin=null;POL.pend=null;polText('');if(msg)toast(msg,2600);
  if(wasOwner){POL.hostOnly=!!POL.g2;if(!POL.g2){POL.role=null;if(typeof MULTI!=='undefined'&&MULTI.on)multiSend({t:'pol',a:'end'});POL.q2.length=0}}else POL.role=null}
/* Zweiter Wagen (nur im Browser des Gejagten gerechnet): fährt zum zweiten Sprüher, sonst hilft er nach 30 Sekunden bei der Jagd */
function polTargetPos(g){if(g.target==='me')return {x:P.x,z:P.z};const p=typeof MULTI!=='undefined'&&MULTI.peers.get(g.target);return p&&p.has?{x:p.x,z:p.z}:null}
function polG2Start(target,tx,tz){if(POL.g2)return false;const sp=polSpawnPoint(),path=polPath(sp.x,sp.z,tx,tz),mk=(x,z,c,i)=>{const o=polMakeCop(x,z,c,i);o.hide=true;return o};
  const g={target,state:'drive',car:null,cops:[mk(sp.x,sp.z,'#3a5ab8',0),mk(sp.x+2.4,sp.z+1.2,'#2a4a9a',1)],t:0,chaseT:0,far:0,rep:0,tx,tz};
  if(path&&path.length>1){g.car=mpPoliceCar();g.car.path=path;g.car.pi=1;polPlaceCar(g.car,path[0].x,path[0].z,Math.atan2(path[1].z-path[0].z,path[1].x-path[0].x))}else g.state='chase';
  POL.g2=g;if(target==='me')toast('Ein zweiter Streifenwagen rückt aus!',2000);return true}
function polG2End(outcome,silent){const g=POL.g2;if(!g)return;g.cops.forEach(c=>W0.remove(c.g));if(g.car)W0.remove(g.car.g);POL.g2=null;
  if(g.target!=='me'&&outcome!=='caught'&&typeof MULTI!=='undefined'&&MULTI.on)multiSend({t:'pol',a:'free',to:g.target});
  if(POL.hostOnly&&!POL.g2){POL.hostOnly=false;POL.role=null;if(typeof MULTI!=='undefined'&&MULTI.on)multiSend({t:'pol',a:'end'})}
  else if(!silent&&POL.q2.length&&POL.state!=='idle'){}}
function polG2Step(dt){const g=POL.g2;if(!g)return;g.t+=dt;const T=polTargetPos(g);if(!T){polG2End(null);return}const live=LV.id===0;const dist=Math.hypot(g.cops[0].x-T.x,g.cops[0].z-T.z);
  if(g.state==='drive'&&g.car){const c=g.car;g.rep-=dt;if(g.rep<=0){g.rep=4;if(Math.hypot(T.x-g.tx,T.z-g.tz)>25){const np=polPath(c.x,c.z,T.x,T.z);if(np&&np.length>1){c.path=np;c.pi=1;g.tx=T.x;g.tz=T.z}}}
    polDriveStep(c,dt);g.cops.forEach(o=>{o.x=c.x;o.z=c.z;o.h=c.h});const dc=Math.hypot(c.x-T.x,c.z-T.z);
    if(c.done||(dc<26&&polLos(c.x,c.z,T.x,T.z))){c.v=0;g.cops.forEach((o,i)=>{const a=c.h+Math.PI/2*(i?-1:1);o.x=c.x+Math.cos(a)*2.4;o.z=c.z+Math.sin(a)*2.4;o.hide=false;o.h=c.h});g.state='chase'}}
  else if(g.state==='chase'){g.chaseT+=dt;g.cops.forEach(o=>polMove(o,T.x,T.z,o.sp+Math.min(2.5,g.chaseT*.15),dt));const d=Math.min(...g.cops.map(o=>Math.hypot(o.x-T.x,o.z-T.z)));
    g.far=d>90?g.far+dt:0;
    if(d<2.4||(d<5.5&&g.chaseT>5)){if(g.target==='me'){if(G.phase==='play'&&POL.state!=='caught'&&POL.state!=='idle'){POL.cops1=POL.cops;POL.cops=g.cops;POL.helpCatch=true;polCatch()}else if(POL.state==='idle'&&G.phase==='play'){POL.role='owner';POL.cops1=null;POL.cops=g.cops;POL.helpCatch=true;polCatch()}}
      else{multiSend({t:'pol',a:'caught',to:g.target});setTimeout(()=>polG2End('caught'),6000);g.state='done'}}
    else if(g.far>5||g.chaseT>45){polG2End(null)}}
  const flash=Math.floor(g.t*4)%2===0,up=!G.under&&LV.id===0;g.cops.forEach(c=>{const o=c.g;o.visible=up&&!c.hide;o.position.set(c.x,cityGround(c.x,c.z)+(c.yadd||0),c.z);o.rotation.y=Math.PI/2-c.h;la_lb(c,flash);const mv=c.moved||0;c.moved=0;c.mv+=mv*.9;(c.swing||[]).forEach(sw=>{sw.th.rotation.x=sw.base+Math.sin(c.mv*1.1+sw.ph)*Math.min(.55,mv/.4)})});
  if(g.car){const c=g.car;c.g.visible=up;c.g.position.set(c.x,cityGround(c.x,c.z),c.z);c.g.rotation.y=Math.PI/2-c.h;c.la.visible=flash;c.lb.visible=!flash}}
function polCatch(){POL.state='caught';const c0=POL.cops[0],c1=POL.cops[1]||c0;P.speed=0;K.up=K.down=K.left=K.right=0;
  /* Polizisten stellen sich vor den Spieler, Kamera zoomt auf die Gesichter */
  const f=[Math.cos(P.h),Math.sin(P.h)];c0.x=P.x+f[0]*2.0-f[1]*.9;c0.z=P.z+f[1]*2.0+f[0]*.9;c1.x=P.x+f[0]*2.0+f[1]*.9;c1.z=P.z+f[1]*2.0-f[0]*.9;c0.h=c1.h=Math.atan2(-f[1],-f[0]);
  POL.cin={step:0,t:0};polText('ERWISCHT!','#ff2a2a');SFX.thud();tone(300,.3,'sawtooth',.06,-120);polCin(0);
  dlgStart('Polizei',['Halt! Polizei! Illegales Graffiti.','Das macht '+POL.FINE+' Scoops Strafe. Und jetzt ab nach Hause.'],polRelease)}
function polCin(step){const c=POL.cops[step%2]||POL.cops[0];const fx=Math.cos(c.h),fz=Math.sin(c.h);
  POL.cin.pos=new V3(c.x+fx*1.25,cityGround(c.x,c.z)+3.05,c.z+fz*1.25);POL.cin.look=new V3(c.x,cityGround(c.x,c.z)+3.0,c.z);POL.cin.step=step;POL.cin.t=0}
function polRelease(){const lost=Math.min(POL.FINE,SC.n|0);if(lost>0)scAdd(-lost,'Strafe');
  if(POL.remoteCatch){POL.remoteCatch=false;POL.cops=[];POL.state='idle';POL.role=null;POL.cin=null;polText('');toast('−'+lost+' Scoops',2600);return}
  if(POL.helpCatch&&POL.g2&&POL.g2.cops===POL.cops){POL.helpCatch=false;POL.cops=POL.cops1||[];POL.cops1=null}
  polEnd('−'+lost+' Scoops')}
/* Sichtlinie: nur Häuser, Autos und Statuen (Maske 5) blockieren den Blick */
function polLos(ax,az,bx,bz){const n=Math.ceil(Math.hypot(bx-ax,bz-az));for(let i=1;i<n;i++){const t=i/n;if(mpAt(ax+(bx-ax)*t,az+(bz-az)*t)===5)return false}return true}
/* Läuft das Spiel des Gejagten gerade pausiert (Dialog, Rarepod), rechnet der zweite Wagen für den anderen Spieler im Hintergrund weiter */
function polBg(dt){if(POL.g2&&POL.g2.target!=='me')polG2Step(dt);polQ2()}
/* Warteschlange: ein zweiter Sprüher hat gemeldet, dass seine Polizei losfährt */
function polQ2(){if(!POL.q2.length)return;if(POL.role!=='owner'){POL.q2.length=0;return}if(POL.state==='warn')return;if(POL.state==='idle'&&!POL.hostOnly){POL.q2.length=0;return}
  const q=POL.q2[0];if(!POL.g2){POL.q2.shift();polG2Start(q.from,q.x,q.z)}
  else if(POL.g2.target==='me'&&POL.g2.state==='drive'){POL.q2.shift();const g=POL.g2;g.target=q.from;g.tx=q.x;g.tz=q.z;if(g.car){const np=polPath(g.car.x,g.car.z,q.x,q.z);if(np&&np.length>1){g.car.path=np;g.car.pi=1;g.car.done=false}}}}
/* Senden (nur der Gejagte rechnet die Polizei): 10 Mal pro Sekunde Wagen und Polizisten, die anderen zeichnen sie nach */
const POLR={cars:[],cops:[],c:null,k:null,t:0,e:true,id:null,tz:0,sirenT:0,sent:false};
function polNetOut(dt){if(typeof MULTI==='undefined'||!MULTI.on)return;const act=POL.cops.length||POL.car||POL.g2;
  if(!(POL.role==='owner'||POL.hostOnly)){return}
  POLR.tz-=dt;if(POLR.tz>0)return;POLR.tz=.1;
  if(!act){if(POLR.sent){POLR.sent=false;multiSend({t:'polz',e:1})}return}
  POLR.sent=true;const r1=v=>Math.round(v*10)/10,cars=[POL.car,POL.g2&&POL.g2.car].map(c=>c?[r1(c.x),r1(c.z),Math.round(c.h*100)/100]:null);
  const cops=[...(POL.cops1||POL.cops).slice(0,2),...(POL.g2?POL.g2.cops:[])].slice(0,4);
  /* bei Hilfsfang sind die ersten zwei die der Gruppe 1 */
  const g1=(POL.cops1||POL.cops),k=[0,1].map(i=>g1[i]).concat([0,1].map(i=>POL.g2&&POL.g2.cops[i])).map(c=>c?[r1(c.x),r1(c.z),Math.round(c.h*100)/100,c.hide?1:0]:null);
  multiSend({t:'polz',c:cars,k})}
function polNetIn(m){if(POL.role==='owner'||POL.hostOnly)return;POLR.id=m.id;POLR.t=performance.now();POLR.e=!!m.e;if(m.e){return}POLR.c=Array.isArray(m.c)?m.c.slice(0,2):[];POLR.k=Array.isArray(m.k)?m.k.slice(0,4):[]}
function polRemoteHide(clear){POLR.cars.forEach(c=>c&&(c.g.visible=false));POLR.cops.forEach(c=>c&&(c.g.visible=false));if(clear){POLR.c=null;POLR.k=null;POLR.e=true}}
function polRemoteStep(dt){if(!POLR.c&&!POLR.k)return;const age=(performance.now()-POLR.t)/1000,show=!POLR.e&&age<2&&LV.id===0&&!G.under&&!(POL.role==='owner'||POL.hostOnly);
  if(!show){polRemoteHide(false);return}
  const kk=1-Math.exp(-dt*12),flash=Math.floor(performance.now()/250)%2===0;let near=1e9;
  (POLR.c||[]).forEach((d,i)=>{let c=POLR.cars[i];if(!d){if(c)c.g.visible=false;return}if(!c){c=POLR.cars[i]=mpPoliceCar();c.x=d[0];c.z=d[1];c.h=d[2]}
    const px=c.x,pz=c.z;c.x+=(d[0]-c.x)*kk;c.z+=(d[1]-c.z)*kk;let dh=d[2]-c.h;dh=Math.atan2(Math.sin(dh),Math.cos(dh));c.h+=dh*kk;
    c.g.visible=true;c.g.position.set(c.x,cityGround(c.x,c.z),c.z);c.g.rotation.y=Math.PI/2-c.h;c.la.visible=flash;c.lb.visible=!flash;near=Math.min(near,Math.hypot(c.x-P.x,c.z-P.z))});
  if(!POL.remoteCatch)(POLR.k||[]).forEach((d,i)=>{let c=POLR.cops[i];if(!d){if(c)c.g.visible=false;return}if(!c){c=POLR.cops[i]=polMakeCop(d[0],d[1],i%2?'#3a5ab8':'#2a4a9a',i);c.remote=true;c.x=d[0];c.z=d[1];c.h=d[2]}
    const px=c.x,pz=c.z;c.x+=(d[0]-c.x)*kk;c.z+=(d[1]-c.z)*kk;let dh=d[2]-c.h;dh=Math.atan2(Math.sin(dh),Math.cos(dh));c.h+=dh*kk;c.moved=Math.hypot(c.x-px,c.z-pz);
    const o=c.g;o.visible=!d[3];o.position.set(c.x,cityGround(c.x,c.z)+(c.yadd||0),c.z);o.rotation.y=Math.PI/2-c.h;la_lb(c,flash);const mv=c.moved||0;c.moved=0;c.mv+=mv*.9;(c.swing||[]).forEach(sw=>{sw.th.rotation.x=sw.base+Math.sin(c.mv*1.1+sw.ph)*Math.min(.55,mv/.4)})});
  POLR.sirenT-=dt;if(POLR.sirenT<=0&&near<110){POLR.sirenT=.5;tone(Math.floor(performance.now()/500)%2?640:860,.22,'square',Math.max(.004,.022*(1-near/110)))}}
/* Der Gejagte aus dem zweiten Wagen wird erwischt: die Polizisten (so wie dieser Browser sie zeichnet) stellen sich vor ihn */
function polRemoteCaught(){if(POL.state==='caught')return;const ps=[POLR.cops[2],POLR.cops[3]].filter(Boolean);if(ps.length<2){POL.cops=[];const fine=Math.min(POL.FINE,SC.n|0);if(fine>0)scAdd(-fine,'Strafe');toast('Erwischt! −'+fine+' Scoops',2600);POL.state='idle';POL.role=null;polText('');return}
  POL.remoteCatch=true;POL.cops=ps;POL.role='second';polCatch()}
function polSees(){return POL.cops.some(c=>Math.hypot(c.x-P.x,c.z-P.z)<POL.SIGHT&&polLos(c.x,c.z,P.x,P.z))}
function polStep(dt){polRemoteStep(dt);if(POL.g2)polG2Step(dt);polQ2();if(!POL.hud&&POL.state==='idle')return;POL.t+=dt;const live=LV.id===0&&!G.under;
  if(POL.state==='warn'){if(!live)return;POL.timer-=dt;const t=Math.max(0,Math.ceil(POL.timer));polText('POLIZEI IN '+Math.floor(t/60)+':'+String(t%60).padStart(2,'0'),POL.timer<15?'#ff2a2a':'#ffb020');if(POL.timer<=0){if(POL.role==='second'){multiSend({t:'pol',a:'launch',x:POL.spot.x,z:POL.spot.z});POL.state='wait2';polText('POLIZEI UNTERWEGS','#4a7aff')}else polDispatch()}return}
  if(!POL.cops.length)return;
  if(POL.state==='drive'&&POL.car){const c=POL.car;polDriveStep(c,dt);POL.cops.forEach(o=>{o.x=c.x;o.z=c.z;o.h=c.h});polDraw(dt);if(!live)return;
    if(Math.floor(POL.t*2)!==Math.floor((POL.t-dt)*2))tone(Math.floor(POL.t*2)%2?640:860,.22,'square',.018);
    const dp=Math.hypot(c.x-P.x,c.z-P.z);if(c.done||(dp<26&&polLos(c.x,c.z,P.x,P.z)))polArrive();return}
  polDraw(dt);if(!live)return;
  if(POL.state==='patrol'||POL.state==='chase'){if(Math.floor(POL.t*2)!==Math.floor((POL.t-dt)*2))tone(Math.floor(POL.t*2)%2?640:860,.22,'square',.018)}
  const near=POL.cops.reduce((m,c)=>Math.min(m,Math.hypot(c.x-P.x,c.z-P.z)),1e9),seen=polSees();
  if(POL.state==='patrol'){POL.cops.forEach((c,i)=>{const a=POL.t*.5+i*3.1,tx=POL.spot.x+Math.cos(a)*(POL.search>3?10:0),tz=POL.spot.z+Math.sin(a)*(POL.search>3?10:0),L=polMove(c,tx,tz,c.sp*.85,dt);if(L<2.5)POL.search+=dt/POL.cops.length});
    if(seen&&G.phase==='play'){POL.state='chase';POL.chaseT=0;POL.loseT=0;POL.lost=0;POL.hid=0;POL.lostFlag=false;POL.last={x:P.x,z:P.z};toast('Polizei! Lauf!',1600);polText('VERFOLGUNG!','#ff2a2a');tone(900,.25,'square',.06)}
    else if(POL.search>20){polEnd('Glück gehabt! Die Polizei zieht ab.')}
    return}
  if(POL.state==='chase'){POL.chaseT+=dt;if(POL.chaseT>30&&!POL.g2&&!POL.helped&&POL.role==='owner'&&!POL.q2.length){POL.helped=true;polG2Start('me',P.x,P.z)}
   
    /* Sichtkontakt: aus dem Blick geraten (mindestens 2,5 s) zählt als "verloren", dreimal verloren = Polizei gibt auf; wer sich ruhig versteckt, wird auch ohne Gas in Ruhe gelassen */
    if(seen){POL.hid=0;POL.lostFlag=false;POL.last={x:P.x,z:P.z}}else{POL.hid+=dt;if(POL.hid>=2.5&&!POL.lostFlag){POL.lostFlag=true;POL.lost++;if(POL.lost<3)toast('Aus dem Sichtfeld! ('+POL.lost+'/3)',1300)}}
    polText(seen?'VERFOLGUNG!':'AUS DEM SICHTFELD '+POL.lost+'/3',seen?'#ff2a2a':'#ffb020');
    const tx=seen?P.x:POL.last.x,tz=seen?P.z:POL.last.z;POL.cops.forEach(c=>{if(Math.hypot(c.x-tx,c.z-tz)>1.8)polMove(c,tx,tz,c.sp+Math.min(2.5,POL.chaseT*.15),dt)});
    if((near<2.4||(near<5.5&&POL.chaseT>5))&&G.phase==='play')return polCatch();
    POL.loseT=near>75?POL.loseT+dt:0;
    if(POL.lost>=3||POL.hid>14||POL.loseT>4)polEnd('Glück gehabt! Du hast sie abgehängt.');else if(POL.chaseT>70)polEnd('Glück gehabt! Die Polizei gibt auf.');return}
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
  /* Leuchtturm: oben sichtbar, unten steht an derselben Stelle der Turm Tarxarox */
  if(HUB.lighthouse){HUB.lighthouse.g.visible=!G.under;HUB.lighthouse.beam.rotation.y+=dt*1.1}
  const show=!G.under&&LV.id===0;DAY.grain&&DAY.grain.forEach(e=>{const d=show?'':'none';if(e.style.display!==d)e.style.display=d});
  if(!show)return;DAY.t=(DAY.t+dt)%DAY.len;if(typeof MULTI!=='undefined'&&MULTI.on&&MULTI.synced)DAY.t=((MULTI.now()/1000)%DAY.len+DAY.len)%DAY.len;/* im Raum läuft die Uhr des Servers */const p=DAY.t/DAY.len,K=DAY.K;let i=0;while(i<K.length-2&&p>=K[i+1][0])i++;
  const a=K[i],b=K[i+1],f=Math.max(0,Math.min(1,(p-a[0])/(b[0]-a[0]))),e=f*f*(3-2*f),T=DAY.tmp,L=(x,y)=>x+(y-x)*e;
  sky.material.uniforms.a.value.copy(a[1]).lerp(b[1],e);sky.material.uniforms.b.value.copy(a[2]).lerp(b[2],e);
  hemi.color.copy(a[3]).lerp(b[3],e);hemi.groundColor.copy(a[4]).lerp(b[4],e);hemi.intensity=L(a[5],b[5]);
  sun.color.copy(a[6]).lerp(b[6],e);sun.intensity=L(a[7],b[7]);DAY.sunY=L(a[8],b[8]);fill.color.copy(a[9]).lerp(b[9],e);fill.intensity=L(a[10],b[10]);
  const bc=sky.material.uniforms.b.value,dn=Math.max(0,Math.min(1,(sun.intensity-1)/1.8)),fn=10+18*dn,ff=150+170*dn;DAY.dn=dn;if(sc.fog){if(sc.fog.color)sc.fog.color.copy(bc);sc.fog.near=fn;sc.fog.far=ff}OUTFOG.fc.value.copy(bc);OUTFOG.fn.value=fn;OUTFOG.ff.value=ff;
  DAY.hour=Math.floor(((p*24+12)%24)*10)/10;if(HUB.lighthouse)HUB.lighthouse.beam.visible=DAY.dn<.55;if(DAY.sea){DAY.sea.uniforms.t.value+=dt;DAY.sea.uniforms.dim.value=Math.max(0,Math.min(1,(sun.intensity+hemi.intensity*.6-.7)/2.6))}}
/* ---------- Gesamtaufbau ---------- */
function portLupoNew(H){
  HUB.doors=[];HUB.marks=[];HUB.courtTreesRemoved=0;HUB.policeStation=null;HUB.bgroups=[];HUB.cones=[];HUB.portals=[];HUB.items=[];HUB.clappers=[];HUB.colliders=[];HUB.mm=null;HUB.mapn=true;
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
   const KS=['balloon','balloon','spiral','vine','mushroom','palm','balloon','spiral'],put=(kind,X,Z,sc2,seed,ht,nat)=>{if(mpInCourt(X,Z)){HUB.courtTreesRemoved=(HUB.courtTreesRemoved||0)+1;return}if(mpRailDist(X,Z)<(kind==='palm'?9:6))return;const R2=mulberry(seed),gp=FLORA[kind](R2,sc2,ht,nat);gp.position.set(X,1.3,Z);gp.rotation.y=R2()*6.28;gp.traverse(o=>{if(o.isMesh)o.castShadow=true});add(gp)};
   MAPD.trees.forEach((t,i)=>{const X=mwx(t.x),Z=mwz(t.y);if(mpAt(X,Z)===0)return;put(KS[i%KS.length],X,Z,t.r>4?1.3:.8,i*17+3)});
   const RP=mulberry(909);MAPD.parks.forEach((pk,pi)=>{const r=pk.c[0],xs=r.map(p=>p[0]),ys=r.map(p=>p[1]),x0=Math.min(...xs),x1=Math.max(...xs),y0=Math.min(...ys),y1=Math.max(...ys),n=Math.floor(Math.abs(mpArea(r))*MP.SC*MP.SC/260);
     for(let k=0,t=0;k<n&&t<n*20;t++){const ux=x0+RP()*(x1-x0),uy=y0+RP()*(y1-y0);if(!mpInPoly(r,ux,uy))continue;const X=mwx(ux),Z=mwz(uy);if(mpAt(X,Z)!==4||!mpFree(X,Z,1.6))continue;put(KS[Math.floor(RP()*KS.length)],X,Z,.9+RP()*.4,pi*1000+k);k++}});
   /* Hohe Palmen am Straßenrand auf dem Sandstreifen (Strand), automatisch, ohne Kollision */
   {const RT=mulberry(777),cand=[];MAPD.roads.forEach(r=>{const wM=Math.max(r.w,MP.RW)*MP.SC;mpResample(r.pts,7).forEach(sm=>{if(!(sm.tx||sm.tz))return;for(const side of [1,-1]){const off=wM/2+MP.SWK+3+RT()*5,X=sm.x-sm.tz*side*off,Z=sm.z+sm.tx*side*off;
       if(Z>186||mpAt(X,Z)!==1||!mpFree(X,Z,2.2)||Math.hypot(X-HUB.sx,Z-HUB.sz)<14)continue;cand.push([X,Z,RT()])}})});
    cand.sort((a,b)=>a[2]-b[2]);const placed=[];for(const c of cand){if(placed.length>=60)break;if(placed.some(q=>Math.hypot(q[0]-c[0],q[1]-c[1])<18)||(MAPD.palms||[]).some(p=>Math.hypot(mwx(p.x)-c[0],mwz(p.y)-c[1])<12))continue;placed.push(c);put('palm',c[0],c[1],2.4,4000+placed.length,1.6+((placed.length*7)%11)/11*.8,true)}HUB.tallPalms=placed.length;HUB.drawnPalms=0;(MAPD.palms||[]).forEach((p,i)=>{const X=mwx(p.x),Z=mwz(p.y);if(mpAt(X,Z)===0)return;put('palm',X,Z,2.4,6000+i,1.6+((i*5)%9)/9*.8,true);HUB.drawnPalms++})}
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
   const LHs=mpLighthouseSpot(),tp=(LHs?[LHs.x,LHs.z]:null)||mpFindFree(2292,606,9,60,false)||mpFindFree(2250,640,9,60,false)||mpFindFree(2120,1990,9,80,false)||[mwx(2290),mwz(610)],TX=tp[0],TZ=tp[1],TOP=36,tw=SMt('#0b3a44','#0b3a44',.25),ring=SMt('#2de0d0','#2de0d0',1),orange=SMt('#ff7a1a','#ff5a00',.9),purple=SMt('#2a1450','#4b1f8a',.35);
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
  (MAPD.walls||[]).forEach(w=>{g.strokeStyle='#8a7fa8';g.lineWidth=Math.max(4,w.w);g.lineCap='round';g.beginPath();w.pts.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.stroke();g.lineCap='butt'});
  MAPD.rail.forEach(r=>{g.strokeStyle='#ed2024';g.lineWidth=7;g.setLineDash(r.dash?[10,10]:[]);g.beginPath();r.pts.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.stroke()});
  return {c,S}}
function mpMini(dt){const mm=HUB.mapn&&HUB.mm2;if(!mm)return;HUB.mmT+=dt;if(HUB.mmT<.12)return;HUB.mmT=0;const cv=$('mini');if(!cv)return;cv.classList.toggle('on',G.phase==='play');
  const g=cv.getContext('2d'),S=mm.S,P0=MP.PLAY,ux=mux(P.x),uy=muy(P.z);g.setLineDash([]);g.fillStyle='#1cafd1';g.fillRect(0,0,150,150);
  g.drawImage(mm.c,(ux-P0.x0)*S-75,(uy-P0.y0)*S-75,150,150,0,0,150,150);
  if(G.under){g.fillStyle='rgba(8,6,20,.62)';g.fillRect(0,0,150,150)}
  const pp=(X,Z)=>[75+(X-P.x)*.5,75+(Z-P.z)*.5],inside=(x,y)=>x>-4&&y>-4&&x<154&&y<154;
  const dot=(X,Z,col,txt,rad)=>{const [x,y]=pp(X,Z);if(!inside(x,y))return;g.fillStyle=col;g.strokeStyle='#1a1626';g.lineWidth=1.5;g.beginPath();g.arc(x,y,rad||5,0,7);g.fill();g.stroke();if(txt){g.fillStyle='#fff';g.font='700 9px sans-serif';g.textAlign='center';g.fillText(txt,x,y+3)}};
  if(!G.under){(HUB.shops||[]).forEach(s=>{const [x,y]=pp(s.x,s.z);if(!inside(x,y))return;g.fillStyle='#2b5fcf';g.strokeStyle='#f4f7ff';g.lineWidth=1.5;g.fillRect(x-5,y-5,10,10);g.strokeRect(x-5,y-5,10,10);g.fillStyle='#fff';g.font='700 9px sans-serif';g.textAlign='center';g.fillText('P',x,y+3)});
    HUB.portals.forEach(p=>{if(HUB.found.has(p.world))dot(p.x,p.z,p.col,p.world,5)});if(HUB.gate)dot(HUB.gate.x,HUB.gate.z,'#ffe066','K',6);(HUB.courts||[]).forEach(c=>dot(c.x,c.z,c.col,c.txt,6));(HUB.marks||[]).forEach(m=>dot(m.x,m.z,m.col,m.txt,6));
    if(typeof MULTI!=='undefined')MULTI.peers.forEach(p=>{if(p.has&&p.g&&p.g.visible)dot(p.x,p.z,p.skin&&p.skin[0]==='#'?p.skin:'#e8f0ff','',4)});
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
  HUB.mm2=mpMiniBase();HUB.mmT=0;HUB.built=true;try{grafInitWorld()}catch(e){console.log('graf',e)}try{ubiqInitWorld()}catch(e){console.log('ubiq',e)}}

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
