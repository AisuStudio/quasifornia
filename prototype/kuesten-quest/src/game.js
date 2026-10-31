/* ================= Spiel ================= */
const AW=(f,t)=>(...a)=>{CTX=t;try{return f(...a)}finally{CTX='stage'}};
const asActor=f=>AW(f,'actor'),asProp=f=>AW(f,'prop');
const dynOf=o=>{o.userData.dyn=true;return o};

/* statische Kulisse */
car=asProp(car);icevan=asProp(icevan);kicker=asProp(kicker);curb=asProp(curb);bunting=asProp(bunting);balloon=asActor(balloon);
ring=asProp(ring);
let PARKED=[[-100,'#f1a7c8'],[-46,'#f6df73'],[30,'#a9e6d2'],[76,'#f6df73'],[112,'#a9e6d2']];
PARKED.forEach(([x,c])=>car(x,-11.4,0,c));
icevan(-118,-11.2,0);
let KICKERS=[[-96,-7.5],[-40,-6.2],[46,-8.2],[90,-9.4]];
KICKERS.forEach(([x,z])=>kicker(x,z,0));
curb(-146,146,-3.55);curb(-146,146,-12.55);
[-120,-70,-20,30,80,120].forEach(x=>bunting(x,13,-3.5,-12.6));
ring(8,-8.2,5.4);ring(-64,-8.2,3.4);zebra(-8);zebra(60);
[[-110,-8],[-60,-3],[-20,-5],[40,-12],[100,-6],[120,-9]].forEach(([x,z],i)=>balloon(x,16+i%3*4,z<-8?-16:-1,['#d54291','#f0cf36','#47c2a5'][i%3],1.6));
ring(126,-8,6.5);


/* Zuschauer am Rand und Konfetti auf dem Boden (Moodboard: Skate riot) */
const CROWD_COLS=['#d54291','#f0cf36','#47c2a5','#eae8e8','#2499bb','#f1a7c8'],SKINS=['#e0a98a','#c98e6a','#8a5a3c','#f0c8a8'];
let CLAPPERS=[];
const spectator=asProp((x,z,R,face)=>{const g=new THREE.Group();const top=CROWD_COLS[Math.floor(R()*6)],skin=SKINS[Math.floor(R()*4)],bot=['#312e42','#2b2a33','#444764'][Math.floor(R()*3)];
  const mk=(geo,col,px,py,pz,sx=1,sy=1,sz=1)=>{const m=new THREE.Mesh(geo,SM({color:col,roughness:.7}));m.position.set(px,py,pz);m.scale.set(sx,sy,sz);m.castShadow=true;g.add(m);return m};
  mk(new THREE.CapsuleGeometry(.3,.75,4,10),top,0,1.45,0);
  [-1,1].forEach(s=>mk(new THREE.CapsuleGeometry(.12,.7,4,8),bot,s*.16,.5,0));
  mk(new THREE.SphereGeometry(.3,12,10),skin,0,2.3,0);
  const hat=Math.floor(R()*6),hc=CROWD_COLS[Math.floor(R()*6)];
  if(hat===1)mk(new THREE.SphereGeometry(.32,12,6,0,Math.PI*2,0,Math.PI/2),hc,0,2.34,0);
  if(hat===2){mk(new THREE.SphereGeometry(.33,12,6,0,Math.PI*2,0,Math.PI/2),hc,0,2.32,0);const cf=new THREE.Mesh(new THREE.TorusGeometry(.32,.07,6,14),SM({color:CROWD_COLS[Math.floor(R()*6)],roughness:.7}));cf.rotation.x=Math.PI/2;cf.position.y=2.34;g.add(cf)}
  if(hat===3){mk(new THREE.CylinderGeometry(.5,.5,.04,14),hc,0,2.5,0);mk(new THREE.SphereGeometry(.34,12,6,0,Math.PI*2,0,Math.PI/2),hc,0,2.5,0)}
  if(hat===4){const hb=new THREE.Mesh(new THREE.TorusGeometry(.31,.05,6,14),SM({color:hc,roughness:.7}));hb.rotation.x=Math.PI/2;hb.position.y=2.45;g.add(hb)}
  const gl=Math.floor(R()*4);
  if(gl===0)[-1,1].forEach(s=>mk(new THREE.SphereGeometry(.1,8,6),'#141416',s*.13,2.34,.25));
  if(gl===1)mk(new THREE.BoxGeometry(.5,.09,.08),'#141416',0,2.34,.27);
  if(gl===2)[-1,1].forEach(s=>mk(new THREE.SphereGeometry(.11,8,6),'#d54291',s*.14,2.34,.25));
  if(R()<.6){const ch=new THREE.Mesh(new THREE.TorusGeometry(.27,.04,6,14),SM({color:'#f0cf36',roughness:.3,emissive:'#a66b28',emissiveIntensity:.4}));ch.rotation.x=Math.PI/2+.2;ch.position.set(0,1.9,.04);g.add(ch);
    if(R()<.5)mk(new THREE.SphereGeometry(.09,8,6),'#f0cf36',0,1.6,.3)}
  const up=R()<.55;
  g.position.set(x,hAt(x,z)-.1,z);g.rotation.y=face;const k=1.15+R()*.2;g.scale.setScalar(k);sc.add(g);
  const gm=SM({color:top,roughness:.7}),hm=SM({color:skin,roughness:.7});
  [-1,1].forEach(s=>{const A=new THREE.Group();const ox=s*.38*k;A.position.set(x+ox*Math.cos(face),g.position.y+1.85*k,z-ox*Math.sin(face));A.rotation.order='YXZ';A.rotation.y=face;A.scale.setScalar(k);
    const a=new THREE.Mesh(new THREE.CapsuleGeometry(.09,.5,4,8),gm);a.position.y=-.36;a.castShadow=true;A.add(a);const h=new THREE.Mesh(new THREE.SphereGeometry(.11,8,6),hm);h.position.y=-.72;A.add(h);
    const idle=up?s*2.5:s*.35;A.rotation.z=idle;A.userData={dyn:true,tier:'prop'};sc.add(A);
    CLAPPERS.push({A,s,idle,x,face,ph:R()*6.28,up})});
  return g});
{const R=mulberry(77);
 [[-124,1],[-96,1],[-70,-1],[-40,1],[-12,-1],[10,1],[46,-1],[70,1],[90,-1],[112,1],[122,-1],[128,1]].forEach(([cx,side])=>{
   const z0=side>0?-2.0:-14.0,face=side>0?Math.PI:0;
   for(let i=0;i<7;i++)spectator(cx+(R()-.5)*8,z0+(R()-.5)*1.6*(side>0?1:1),R,face+(R()-.5)*.4)})}
{const R=mulberry(91),cols=['#d54291','#f0cf36','#47c2a5','#1cafd1','#ffffff','#f1a7c8'];
 for(let i=0;i<320;i++){const near=R()<.5?[-124,-96,-40,10,46,90,122][Math.floor(R()*7)]+(R()-.5)*20:-140+R()*280;
   const m=new THREE.Mesh(new THREE.PlaneGeometry(.5,.26),BM(cols[Math.floor(R()*6)],{side:THREE.DoubleSide}));m.rotation.set(-Math.PI/2,0,R()*6.28);m.position.set(near,1.335+R()*.01,-12.2+R()*8.4);sc.add(m)}}

/* dynamische Dinge */
const V=THREE.Vector3;
const SCOOPS_AT=[[-108,-9.2],[-80,-5.2],[-52,-9.6],[-24,-5.0],[4,-8.4]];
const CONES_AT=[[-90,-7],[-86,-8.4],[-82,-9.8],[-62,-6.2],[-60,-8.2],[-30,-6],[-27,-8.2],[-24,-10],[14,-5],[22,-9.4],[34,-10],[40,-4.8],[56,-10.4],[64,-5.4],[78,-4.8],[94,-6],[106,-7],[118,-8.6]];
const coneTpl=()=>{const g=new THREE.Group();const k=.9;
  const c=new THREE.Mesh(new THREE.ConeGeometry(.55*k,1.5*k,12),M('#e8743b'));c.position.y=.75*k;c.castShadow=true;g.add(c);
  const b=new THREE.Mesh(new THREE.CylinderGeometry(.5*k,.55*k,.14*k,12),M('#eae8e8'));b.position.y=.55*k;g.add(b);
  const p=new THREE.Mesh(new THREE.BoxGeometry(1.2*k,.12*k,1.2*k),M('#312e42'));p.position.y=.06*k;g.add(p);return g};
const makeCone=asProp((x,z)=>{const g=coneTpl();g.position.set(x,1.3,z);sc.add(g);return dynOf(g)});
const makeScoop=asActor((x,z)=>{const g=new THREE.Group();
  const waf=new THREE.Mesh(new THREE.ConeGeometry(.9,2.2,10),SM({color:'#d9a86a',roughness:.8}));waf.rotation.x=Math.PI;waf.position.y=1.1;waf.castShadow=true;g.add(waf);
  [['#f1a7c8',2.5,1.15],['#8fe0c8',3.4,.95],['#f7e07a',4.2,.75]].forEach(([c,y,rad])=>{const s=new THREE.Mesh(new THREE.SphereGeometry(rad,16,12),SM({color:c,roughness:.45}));s.position.y=y;s.castShadow=true;g.add(s)});
  g.scale.setScalar(.9);g.position.set(x,3.0,z);sc.add(g);
  const beam=new THREE.Mesh(new THREE.CylinderGeometry(1.1,1.1,34,16,1,true),BM('#f0cf36',{transparent:true,opacity:.2,side:THREE.DoubleSide,depthWrite:false,fog:false}));beam.position.set(x,18,z);beam.userData.noOutline=true;sc.add(beam);
  const pad=new THREE.Mesh(new THREE.RingGeometry(1.9,2.6,28),BM('#f0cf36',{transparent:true,opacity:.7,side:THREE.DoubleSide,depthWrite:false}));pad.rotation.x=-Math.PI/2;pad.position.set(x,1.4,z);sc.add(pad);
  dynOf(beam);dynOf(pad);dynOf(g);
  return {g,beam,pad,x,z,got:false,t:Math.random()*6}});
let cones=CONES_AT.map(([x,z])=>({o:makeCone(x,z),x,z,hit:0,vx:0,vy:0,vz:0}));
let scoops=SCOOPS_AT.map(([x,z])=>makeScoop(x,z));

skater=asActor(skater);dino=asActor(dino);portal=asActor(portal);

/* Spieler */
const P={x:-134,z:-8,y:1.3,vy:0,h:0,speed:4.5,turn:0,boost:0,ramp:false,preset:'#d54291',av:null,tilt:0,push:0,coy:0};
const K={up:0,down:0,left:0,right:0};
const G={phase:'title',time:0,chaseT:0,tries:0,front:0,shake:0,muted:false,pix:false,caughtT:0,warned:false,coneSay:false,rampSay:false,best:null,t:0};
const SKIN_LIST=[['pink','Pink','#d54291','#fff'],['red','Rot','#e5383b','#fff'],['orange','Orange','#ff8a2a','#1a1626'],['gold','Gold','#f0cf36','#1a1626'],['lime','Limette','#9be12c','#1a1626'],['mint','Mint','#47c2a5','#1a1626'],['teal','Türkis','#2499bb','#fff'],['sky','Himmel','#4cc3ff','#1a1626'],['purple','Lila','#8e5bd6','#fff'],['black','Schwarz','#2a2733','#fff'],['snow','Weiß','#eae8e8','#1a1626']];
const PRESETS=Object.fromEntries(SKIN_LIST.map(([k,,c])=>[k,k==='snow'?'D':c]));
let blobP=null,blobD=null;
function buildPlayer(){if(P.av){sc.remove(P.av)}
  P.av=skater(P.x,P.y,P.z,Math.PI/2,P.preset,1.35);P.av.rotation.order='YZX';dynOf(P.av);addOutlines(P.av,'actor')}
const vendor=skater(-124,1.3,-5.6,-Math.PI*.35,'D',1.35);dynOf(vendor);
const goalPortal=portal(128,8,-8);goalPortal.rotation.y=-Math.PI/2;dynOf(goalPortal);
let dinoG=null;
function ensureDino(){if(dinoG&&dinoG.userData.col===LV.bossColor)return;if(dinoG){sc.remove(dinoG);dinoG=null}
  dinoG=dino(0,1.2,-22,1.9,LV.bossColor);dinoG.userData.col=LV.bossColor;dinoG.rotation.order='YXZ';dinoG.rotation.y=Math.PI/2;dinoG.visible=false;dynOf(dinoG)}
const BLOBTEX=(()=>{const c=document.createElement('canvas');c.width=c.height=128;const g=c.getContext('2d'),gr=g.createRadialGradient(64,64,0,64,64,64);gr.addColorStop(0,'rgba(30,20,50,.6)');gr.addColorStop(.6,'rgba(30,20,50,.25)');gr.addColorStop(1,'rgba(30,20,50,0)');g.fillStyle=gr;g.fillRect(0,0,128,128);return new THREE.CanvasTexture(c)})();
function mkBlob(w,l){const m=new THREE.Mesh(new THREE.PlaneGeometry(1,1),new THREE.MeshBasicMaterial({map:BLOBTEX,transparent:true,depthWrite:false,fog:false}));m.rotation.x=-Math.PI/2;m.scale.set(w,l,1);m.renderOrder=2;m.userData.noOutline=true;sc.add(m);return dynOf(m)}
blobP=mkBlob(3.4,3.8);

/* ---------- Bake: statische Meshes pro Material zusammenfassen ---------- */
const OUTM={};const outRes=new THREE.Vector2(1,1);
function outMat(tier){if(OUTM[tier])return OUTM[tier];
  return OUTM[tier]=new THREE.ShaderMaterial({side:THREE.BackSide,fog:false,uniforms:{px:{value:2},res:{value:outRes},col:{value:new THREE.Color('#1a1626')}},
   vertexShader:'uniform float px;uniform vec2 res;void main(){vec4 p=projectionMatrix*modelViewMatrix*vec4(position,1.);vec3 n=normalize(normalMatrix*normal);vec2 d=(projectionMatrix*vec4(n,0.)).xy;float l=length(d);if(l>1e-4)d/=l;p.xy+=d*px*2./res*p.w;gl_Position=p;}',
   fragmentShader:'uniform vec3 col;void main(){gl_FragColor=vec4(col,1.);}'})}
const TIERPX={stage:.45,prop:1,actor:1.35};
function setOutlinePx(base){Object.keys(TIERPX).forEach(t=>{outMat(t).uniforms.px.value=base*TIERPX[t]})}
function addOutlines(root,tier){root.traverse(o=>{if(o.isMesh&&!o.isInstancedMesh&&!o.userData.hasOl&&!o.userData.outline&&!o.userData.noOutline&&o.material&&o.material.isMeshStandardMaterial&&!o.material.transparent){const q=new THREE.Mesh(o.geometry,outMat(tier));q.userData.outline=true;o.userData.hasOl=true;o.add(q)}})}
function bake(){
  const groups=new Map(),remove=[];
  sc.children.slice().forEach(top=>{
    if(top.userData.noBake||top.userData.dyn||top.isLight)return;
    if(top.isMesh&&(top.material.map||top.material.transparent||top.material.isShaderMaterial))return;
    let any=false;top.updateMatrixWorld(true);
    top.traverse(o=>{if(!o.isMesh||o.userData.noBake)return;if(o.material.transparent||o.material.map)return;
      o.geometry.computeBoundingBox();const sz=new V3();o.geometry.boundingBox.getSize(sz);const ws=new V3();o.getWorldScale(ws);
      const big=Math.max(sz.x*ws.x,sz.y*ws.y,sz.z*ws.z)>40,std=o.material.isMeshStandardMaterial;
      const key=o.material.uuid+(o.castShadow?'c':'n')+(o.receiveShadow?'r':'n')+((std&&!big)?'o':'x');
      let gp=groups.get(key);if(!gp){gp={mat:o.material,geos:[],c:o.castShadow,r:o.receiveShadow,ol:std&&!big};groups.set(key,gp)}
      let g=o.geometry.clone();if(g.index)g=g.toNonIndexed();g.applyMatrix4(o.matrixWorld);
      Object.keys(g.attributes).forEach(k=>{if(k!=='position'&&k!=='normal')g.deleteAttribute(k)});gp.geos.push(g);any=true});
    if(any&&!top.isMesh)remove.push(top);else if(any&&top.isMesh)remove.push(top)});
  remove.forEach(t=>t.parent&&t.parent.remove(t));
  groups.forEach(gp=>{if(!gp.geos.length)return;const mg=mergeGeometries(gp.geos,false);if(!mg)return;const m=new THREE.Mesh(mg,gp.mat);m.castShadow=gp.c;m.receiveShadow=gp.r;m.userData.baked=true;
    if(gp.ol){const q=new THREE.Mesh(mg,outMat(gp.mat.userData.tier||'stage'));q.userData.outline=true;m.add(q)}
    _sadd(m)});
}
bake();
buildPlayer();addOutlines(vendor,'actor');
scoops.forEach(s=>addOutlines(s.g,'actor'));cones.forEach(c=>addOutlines(c.o,'prop'));addOutlines(goalPortal,'actor');
setOutlinePx(2);


/* ---------- Wolken: gezeichnete 2D-Sprites, zeigen immer zur Kamera ---------- */
function cloudCanvas(seed,frame,w=256,h=128){
  const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d');const R=mulberry(seed*13+5);
  const n=6+Math.floor(R()*3),L=[];
  for(let i=0;i<n;i++){const t=i/(n-1),b=Math.sin(t*Math.PI);L.push({x:w*(.15+.7*t),y:h*(.64-b*.2-R()*.05),r:h*(.17+b*.2+R()*.05),ph:R()*6.28})}
  L.forEach(l=>{const k=Math.sin(frame*Math.PI/2+l.ph);l.r*=1+.05*k;l.y+=k*1.6});
  g.beginPath();g.rect(0,0,w,h*.8);g.clip();
  const fill=(col,dx,dy,s)=>{g.fillStyle=col;g.beginPath();L.forEach(l=>{g.moveTo(l.x+dx+l.r*s,l.y+dy);g.arc(l.x+dx,l.y+dy,l.r*s,0,Math.PI*2)});g.fill()};
  fill('#cbbce8',0,3,1);          /* Schatten, Lavendel */
  fill('#ffffff',-3,-4,.93);      /* Körper */
  fill('#fff1f7',-5,-9,.78);      /* Glanz oben links */
  const gr=g.createLinearGradient(0,h*.5,0,h*.8);gr.addColorStop(0,'rgba(247,184,216,0)');gr.addColorStop(1,'rgba(247,184,216,.55)');
  g.globalCompositeOperation='source-atop';g.fillStyle=gr;g.fillRect(0,0,w,h);
  return c}
const CLOUDTEX=[0,1,2,3].map(s=>[0,1,2,3].map(f=>{const t=new THREE.CanvasTexture(cloudCanvas(s,f));t.colorSpace=THREE.SRGBColorSpace;return t}));
function makeCloud(x,y,z,w,v,drift){const fr=CLOUDTEX[v%4];
  const s=new THREE.Sprite(new THREE.SpriteMaterial({map:fr[0],transparent:true,depthWrite:false,fog:false}));
  s.scale.set(w,w/2,1);s.position.set(x,y,z);s.userData={fr,off:Math.random()*8,drift,noBake:true,cloud:true};sc.add(s);return s}
const midClouds=[[-130,34,-95,70,0,.5],[-55,44,-120,90,1,.35],[20,36,-105,64,2,.6],[85,46,-130,100,3,.3],[140,32,-90,60,1,.55],[-95,50,95,80,2,.3],[0,56,110,110,0,.25],[95,42,100,70,3,.4]].map(a=>makeCloud(...a));
const skyLayer=new THREE.Group();skyLayer.userData.noBake=true;sc.add(skyLayer);
const skyClouds=[];for(let i=0;i<16;i++){const az=i/16*Math.PI*2+Math.random()*.3,el=.12+Math.random()*.38,rr=360;
  const s=makeCloud(0,0,0,120+Math.random()*90,i,0);sc.remove(s);skyLayer.add(s);s.userData.az=az;s.userData.el=el;s.userData.r=rr;skyClouds.push(s)}

/* ---------- 2D-Skyline: gezeichnete Hochhäuser als Sprites ---------- */
function skylineCanvas(seed,far,w=512,h=256){
  const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d');const R=mulberry(seed*29+7);
  const cols=far?['#cbbce8','#d6cbee','#c3b3e3','#dcd3ee']:['#f1a7c8','#a9e6d2','#f6df73','#a9d8f0','#e7b8e8','#f6c3a8'];
  let x=-8;
  while(x<w){const bw=28+Math.floor(R()*44),bh=h*(.3+R()*.62),col=cols[Math.floor(R()*cols.length)],y=h-bh;
    g.fillStyle=col;g.fillRect(x,y,bw,bh);
    g.fillStyle='rgba(60,40,100,'+(far?.1:.2)+')';g.fillRect(x+bw*.72,y,bw*.28,bh);
    if(R()<.5){g.fillStyle=col;g.fillRect(x+bw*.2,y-14,bw*.6,14);g.fillStyle='rgba(60,40,100,.15)';g.fillRect(x+bw*.62,y-14,bw*.18,14)}
    if(R()<.4){g.fillStyle=far?'#b8a8dc':'#8e7fb0';g.fillRect(x+bw*.48,y-26,3,26)}
    const ww=far?4:5,gap=far?9:11;
    for(let yy=y+8;yy<h-8;yy+=gap){for(let xx=x+6;xx<x+bw*.7-4;xx+=gap){
      const lit=R()<(far?.18:.38);g.fillStyle=lit?(far?'#fff3d0':(R()<.3?'#ffd1e8':'#fff7c2')):(far?'rgba(255,255,255,.18)':'rgba(40,30,70,.32)');g.fillRect(xx,yy,ww,ww+1)}}
    if(!far&&R()<.45){const sx=x+bw*.78,sy=y+14,sh=Math.min(bh*.5,70);g.fillStyle=R()<.5?'#ff5fa8':'#33d6c0';g.fillRect(sx-4,sy,9,sh);g.fillStyle='#ffffff';for(let q=0;q<sh;q+=9){g.fillRect(sx-2,sy+q+2,5,2)}}
    x+=bw+Math.floor(R()*5)}
  return c}
const SKYTEX=[0,1,2,3,4,5].map(i=>{const t=new THREE.CanvasTexture(skylineCanvas(i,false));t.colorSpace=THREE.SRGBColorSpace;return t});
const SKYTEXF=[0,1,2,3].map(i=>{const t=new THREE.CanvasTexture(skylineCanvas(i+9,true));t.colorSpace=THREE.SRGBColorSpace;return t});
function skySprite(tex,w,h,fog){const s=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,transparent:true,depthWrite:false,fog}));s.scale.set(w,h,1);s.userData.noBake=true;return s}
/* nah: hinter den Villen, über der Lagune. Mit Dunst, wirkt ferner */
for(let i=0;i<7;i++){const s=skySprite(SKYTEX[i%6],190,95,true);s.position.set(-150+i*50,47-1,175+(i%2)*14);sc.add(s)}
/* fern: Ring am Horizont, folgt der Kamera, zeigt immer gleich */
for(let i=0;i<12;i++){const s=skySprite(SKYTEXF[i%4],300,150,false);const az=i/12*Math.PI*2;s.position.set(Math.cos(az)*330,75-22,Math.sin(az)*330);skyLayer.add(s)}
addVictorians(skyLayer,[[10,282,190,76,30,.34,.18,40],[9,226,170,68,23,.12,.55,80]]);

/* ---------- 2D-Victorians: gezeichnete Painted-Ladies-Reihen als Staffelung vor der Skyline ---------- */
function victCanvas(seed,haze,w=640,h=256){
  const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d');const R=mulberry(seed*53+11);
  const mix=(hex,k)=>{const a=new THREE.Color(hex),b=new THREE.Color('#cbbce8');return '#'+a.lerp(b,k).getHexString()};
  const P=['#f1a7c8','#a9e6d2','#f6df73','#a9d8f0','#f6c3a8','#e7b8e8','#c9f0b8'],AC=['#d54291','#47c2a5','#f0cf36','#4cc3ff','#ff8a2a'];
  let x=6;
  while(x<w-70){const bw=70+Math.floor(R()*34),bh=88+Math.floor(R()*60),col=mix(P[Math.floor(R()*P.length)],haze),ac=mix(AC[Math.floor(R()*AC.length)],haze),tr=mix('#fff6ea',haze),roof=mix('#6a5a8a',haze*.5),sh=mix('#7a62a0',haze*.4);
    const y=h-bh;
    g.fillStyle=col;g.fillRect(x,y,bw,bh);g.fillStyle=sh;g.globalAlpha=.28;g.fillRect(x+bw*.74,y,bw*.26,bh);g.globalAlpha=1;
    g.fillStyle=tr;g.fillRect(x-3,y-3,bw+6,5);g.fillRect(x-3,h-bh*.48,bw+6,3);
    if(R()<.5){const tw=bw*.34,tx=x+bw-tw-4,th=bh+36;g.fillStyle=col;g.fillRect(tx,h-th,tw,th-bh);g.fillStyle=sh;g.globalAlpha=.28;g.fillRect(tx+tw*.7,h-th,tw*.3,th-bh);g.globalAlpha=1;g.fillStyle=roof;g.beginPath();g.moveTo(tx-4,h-th);g.lineTo(tx+tw/2,h-th-30);g.lineTo(tx+tw+4,h-th);g.fill()}
    g.fillStyle=roof;g.beginPath();g.moveTo(x-6,y-3);g.lineTo(x+bw*.4,y-bw*.4-8);g.lineTo(x+bw+6,y-3);g.fill();
    g.fillStyle=ac;g.beginPath();g.moveTo(x+bw*.4-10,y-12);g.lineTo(x+bw*.4,y-bw*.28-6);g.lineTo(x+bw*.4+10,y-12);g.fill();
    if(R()<.6){g.fillStyle=col;g.fillRect(x+bw*.08,y+bh*.34,bw*.34,bh*.66);g.fillStyle=roof;g.beginPath();g.moveTo(x+bw*.08-3,y+bh*.34);g.lineTo(x+bw*.25,y+bh*.34-12);g.lineTo(x+bw*.42+3,y+bh*.34);g.fill()}
    for(let q=0;q<3;q++)for(let k=0;k<3;k++){const wx=x+8+k*(bw-18)/3,wy=y+10+q*(bh-20)/3;g.fillStyle=R()<.35?mix('#fff1a8',haze*.5):mix('#5a78a8',haze);g.fillRect(wx,wy,9,13);g.fillStyle=tr;g.fillRect(wx-1,wy-3,11,2)}
    g.fillStyle=ac;g.fillRect(x+bw*.5-5,h-26,11,26);
    x+=bw+Math.floor(R()*8)-2}
  return c}
function addVictorians(parent,rings){let n=0;rings.forEach(([count,r,w,hh,yc,haze,az0,seed0])=>{
  for(let i=0;i<count;i++){const t=new THREE.CanvasTexture(victCanvas(seed0+i,haze));t.colorSpace=THREE.SRGBColorSpace;
    const s=new THREE.Sprite(new THREE.SpriteMaterial({map:t,transparent:true,depthWrite:false,fog:false}));s.scale.set(w,hh,1);
    const az=az0+i/count*Math.PI*2;s.position.set(Math.cos(az)*r,yc,Math.sin(az)*r);s.userData.noBake=true;parent.add(s);n++}});return n}
function stepClouds(dt){const t=G.t;
  midClouds.forEach(s=>{s.userData.fr&&(s.material.map=s.userData.fr[Math.floor(t*2+s.userData.off)%4]);s.position.x+=s.userData.drift*dt;if(s.position.x>170)s.position.x=-170;s.position.y+=Math.sin(t*.4+s.userData.off)*.01});
  skyClouds.forEach(s=>{const u=s.userData;u.az+=dt*.004;s.material.map=u.fr[Math.floor(t*1.6+u.off)%4];const c=Math.cos(u.el);s.position.set(Math.cos(u.az)*c*u.r,Math.sin(u.el)*u.r,Math.sin(u.az)*c*u.r)});
  skyLayer.position.copy(cam.position)}

/* ---------- Kamera, Render, Pixel-Modus ---------- */
const cam=new THREE.PerspectiveCamera(62,1,.5,520);
const PAL=['#141416','#1a1626','#312e42','#444764','#6b5f94','#8e7fb0','#b7a9d6','#dcd3ee','#eae8e8','#a99f9d','#0b5c9c','#0f86d6','#2499bb','#1cafd1','#8fd6e4','#cfeff4','#6a1d4c','#a3256f','#d54291','#ee7cb8','#f1a7c8','#f9d3e4','#8a6212','#be8d24','#f0cf36','#f7e07a','#fcf0b8','#1f4f3b','#2f7a55','#4fa874','#86dba0','#c4efc8','#5b3a1e','#7a4a1f','#c98a4a','#8a5a3c','#c98e6a','#e0a98a','#f0c8a8','#a66b28','#d9a86a','#f4d89a','#f6e6d4','#e8743b','#2fa88a','#47c2a5','#8fe0c8','#c9f2e4','#a9e6d2','#a9d8f0','#f6df73','#e7b8e8'];
const palGLSL=PAL.map((h,i)=>{const g=new THREE.Color(h);const hs={};g.getHSL(hs);const mx=Math.max(g.r,g.g,g.b),mn=Math.min(g.r,g.g,g.b);const sat=mx?(mx-mn)/mx:0;return `P[${i}]=vec3(${g.r.toFixed(3)},${g.g.toFixed(3)},${g.b.toFixed(3)});Q[${i}]=vec3(${hs.h.toFixed(4)},${sat.toFixed(4)},${mx.toFixed(4)});`}).join('');
const comp=new EffectComposer(r,new THREE.WebGLRenderTarget(4,4,{type:THREE.HalfFloatType,samples:0}));
comp.addPass(new RenderPass(sc,cam));
comp.addPass(new ShaderPass({uniforms:{tDiffuse:{value:null}},
 vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
 fragmentShader:`uniform sampler2D tDiffuse;varying vec2 vUv;
 vec3 rgb2hsv(vec3 c){vec4 K=vec4(0.,-1./3.,2./3.,-1.);vec4 p=mix(vec4(c.bg,K.wz),vec4(c.gb,K.xy),step(c.b,c.g));vec4 q=mix(vec4(p.xyw,c.r),vec4(c.r,p.yzx),step(p.x,c.r));float d=q.x-min(q.w,q.y);float e=1e-10;return vec3(abs(q.z+(q.w-q.y)/(6.*d+e)),d/(q.x+e),q.x);}
 float bayer(vec2 p){int x=int(mod(p.x,4.)),y=int(mod(p.y,4.));float m[16]=float[16](0.,8.,2.,10.,12.,4.,14.,6.,3.,11.,1.,9.,15.,7.,13.,5.);return m[x+y*4]/16.-.5;}
 void main(){vec3 c=texture2D(tDiffuse,vUv).rgb;float l=dot(c,vec3(.2126,.7152,.0722));c=mix(vec3(l),c,1.3);c=(c-.18)*1.14+.18;c*=vec3(1.03,.98,.97);
  c*=1.-.3*smoothstep(.3,.85,distance(vUv,vec2(.5)));
  vec3 g=pow(clamp(c,0.,1.),vec3(1./2.2));g+=bayer(gl_FragCoord.xy)*.045;vec3 P[${PAL.length}];vec3 Q[${PAL.length}];${palGLSL}
  vec3 gh=rgb2hsv(clamp(g,0.,1.));float best=1e9;vec3 bc=P[0];for(int i=0;i<${PAL.length};i++){float dh=abs(gh.x-Q[i].x);dh=min(dh,1.-dh);float dd=abs(gh.z-Q[i].z)*1.3+abs(gh.y-Q[i].y)*.4+dh*6.5*gh.y;if(dd<best){best=dd;bc=P[i];}}
  gl_FragColor=vec4(pow(bc,vec3(2.2)),1.);}`}));
comp.addPass(new OutputPass());
function resize(){const w=innerWidth,h=innerHeight;let rw,rh;
  if(G.pix){const ps=Math.max(3,Math.round(h/270));rw=Math.ceil(w/ps);rh=Math.ceil(h/ps)}
  else{const pr=Math.min(devicePixelRatio||1,1.5);rw=Math.floor(w*pr);rh=Math.floor(h*pr)}
  r.setPixelRatio(1);r.setSize(rw,rh,false);comp.setPixelRatio(1);comp.setSize(rw,rh);outRes.set(rw,rh);
  const cv=r.domElement;cv.style.width=w+'px';cv.style.height=h+'px';cv.style.imageRendering=G.pix?'pixelated':'auto';cv.style.filter=G.pix?'none':'saturate(1.22) contrast(1.06)';
  setOutlinePx(G.pix?1:2*Math.min(devicePixelRatio||1,1.5));cam.aspect=w/h;cam.updateProjectionMatrix()}
function setPix(on){G.pix=on;document.getElementById('b-pix').setAttribute('aria-pressed',String(on));resize()}
addEventListener('resize',resize);

/* ---------- UI ---------- */
const $=id=>document.getElementById(id);
const narr={el:$('narr'),who:$('narr-who'),text:$('narr-text'),full:'',shown:0,hold:0,active:false};
function say(who,text,hold=3.6){narr.full=text;narr.shown=0;narr.hold=hold;narr.active=true;narr.who.textContent=who==='v'?(LV.id===0?'Stadtfunk':LV.id>=2?'Eiswagen-Funk':'Eisverkäufer'):who==='d'?LV.boss:'Erzähler';narr.who.className='who '+(who==='v'?'v':who==='d'?'d':'');narr.el.classList.add('on')}
function toast(t,ms=1700){const e=$('toast');e.textContent=t;e.classList.add('on');clearTimeout(toast.h);toast.h=setTimeout(()=>e.classList.remove('on'),ms)}
function setQuest(title,count){[...$('pips').children].forEach((p,i)=>p.style.display=i<(LV.pips||5)?'':'none');$('q-title').textContent=title;$('quest').hidden=false;[...$('pips').children].forEach((p,i)=>p.classList.toggle('on',i<count));$('pips').style.display=count===null?'none':'flex'}

/* ---------- Ton ---------- */
let AC=null;
/* Soundtrack: Datei "em-ocean.m4a" liegt neben der Seite (nicht im Repo). Fehlt sie, bleibt es still. */
const MUS=new Audio();MUS.preload='none';MUS.loop=true;MUS.volume=.7;MUS.src='em-ocean.m4a';MUS.started=false;
function musGo(){if(MUS.started||MUS.dead)return;MUS.started=true;MUS.muted=G.muted;MUS.play().catch(()=>{MUS.started=false})}
MUS.addEventListener('error',()=>{MUS.dead=true});
function ac(){musGo();if(!AC){try{AC=new (window.AudioContext||window.webkitAudioContext)()}catch(e){AC=false}}if(AC&&AC.state==='suspended')AC.resume();return AC}
function tone(f,d=.15,type='square',vol=.06,slide=0,delay=0){if(G.muted)return;const A=ac();if(!A)return;const t=A.currentTime+delay,o=A.createOscillator(),g=A.createGain();o.type=type;o.frequency.setValueAtTime(f,t);if(slide)o.frequency.exponentialRampToValueAtTime(Math.max(20,f+slide),t+d);g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g).connect(A.destination);o.start(t);o.stop(t+d+.02)}
const SFX={collect(n){[0,4,7,12].forEach((s,i)=>tone(440*Math.pow(2,(s+n*2)/12),.12,'square',.05,0,i*.06))},jump(){tone(260,.14,'square',.05,320)},boost(){tone(180,.4,'sawtooth',.05,700)},thud(){tone(120,.2,'sine',.14,-80)},
  stomp(v){tone(58,.28,'sine',Math.min(.3,.05+v*.25),-26)},siren(){[0,.35,.7,1.05].forEach((d,i)=>tone(i%2?330:440,.3,'sawtooth',.06,0,d))},boing(){tone(520,.5,'sine',.1,-420)},win(){[0,4,7,12,16].forEach((s,i)=>tone(392*Math.pow(2,s/12),.22,'square',.06,0,i*.1))}};

SFX.bite=()=>{tone(170,.12,'square',.08,-80);tone(80,.22,'sine',.14,-30);if(!G.muted){const A=ac();if(A&&NBUF){const s=A.createBufferSource();s.buffer=NBUF;const f=A.createBiquadFilter();f.type='lowpass';f.frequency.value=900;const gn=A.createGain();gn.gain.setValueAtTime(.2,A.currentTime);gn.gain.exponentialRampToValueAtTime(.0001,A.currentTime+.15);s.connect(f).connect(gn).connect(A.destination);s.start();s.stop(A.currentTime+.16)}}};
SFX.gulp=()=>{tone(320,.4,'sine',.12,-230);tone(160,.3,'square',.05,-80,.12)};
SFX.whoosh=()=>tone(640,.28,'triangle',.05,-380);
let NBUF=null;
SFX.clap=()=>{if(G.muted)return;const A=ac();if(!A)return;if(!NBUF){NBUF=A.createBuffer(1,Math.floor(A.sampleRate*.2),A.sampleRate);const d=NBUF.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1}
  for(let i=0;i<26;i++){const t=A.currentTime+i*.075+Math.random()*.05;const s=A.createBufferSource();s.buffer=NBUF;const f=A.createBiquadFilter();f.type='bandpass';f.frequency.value=1400+Math.random()*2800;f.Q.value=.8;const gn=A.createGain();gn.gain.setValueAtTime(.10*(1-i/32),t);gn.gain.exponentialRampToValueAtTime(.0001,t+.09);s.connect(f).connect(gn).connect(A.destination);s.start(t);s.stop(t+.1)}};
/* ---------- Konfetti ---------- */
const CF={n:160,pos:new Float32Array(160*3),vel:new Float32Array(160*3),life:new Float32Array(160),col:new Float32Array(160*3),i:0};
const cfGeo=new THREE.BufferGeometry();cfGeo.setAttribute('position',new THREE.BufferAttribute(CF.pos,3));cfGeo.setAttribute('color',new THREE.BufferAttribute(CF.col,3));
const cfPts=new THREE.Points(cfGeo,new THREE.PointsMaterial({size:.3,vertexColors:true,sizeAttenuation:true,fog:false}));cfPts.frustumCulled=false;cfPts.userData.noBake=true;cfPts.userData.dyn=true;sc.add(cfPts);
const CFCOL=['#d54291','#f0cf36','#1cafd1','#ffffff'].map(c=>new THREE.Color(c));
for(let i=0;i<CF.n;i++){CF.pos[i*3+1]=-50}
function burst(x,y,z,n=40){for(let k=0;k<n;k++){const i=CF.i=(CF.i+1)%CF.n;CF.pos.set([x,y,z],i*3);const a=Math.random()*6.28,u=3+Math.random()*7;CF.vel.set([Math.cos(a)*u,4+Math.random()*8,Math.sin(a)*u],i*3);CF.life[i]=1.2+Math.random()*.8;const c=CFCOL[i%4];CF.col.set([c.r,c.g,c.b],i*3)}}
function stepConfetti(dt){for(let i=0;i<CF.n;i++){if(CF.life[i]<=0){CF.pos[i*3+1]=-50;continue}CF.life[i]-=dt;CF.vel[i*3+1]-=16*dt;CF.pos[i*3]+=CF.vel[i*3]*dt;CF.pos[i*3+1]+=CF.vel[i*3+1]*dt;CF.pos[i*3+2]+=CF.vel[i*3+2]*dt}cfGeo.attributes.position.needsUpdate=true;cfGeo.attributes.color.needsUpdate=true}

/* ---------- Spielablauf ---------- */
const TIMERS=[];function later(sec,fn){TIMERS.push({t:sec,fn})}
const WIN_X=124,ZMIN=-12.0,ZMAX=-3.2,XMAX=136,XMIN=-138;
const SPEED_MAX=8.8,SPEED_CRUISE=4.5;
let respawnX=0;
function resetRun(){TIMERS.length=0;P.push=0;if(typeof hideRivals!=='undefined')hideRivals();G.tricks=0;if(typeof resetTrick!=='undefined')resetTrick();T.state='ready';T.cd=0;if(typeof flyBoard!=='undefined'){flyBoard.visible=false;boardPlayerOn(true)}if(dinoG)dinoG.userData.slow=0;P.x=-134;P.z=-8;P.y=1.3;P.vy=0;P.h=0;P.speed=SPEED_CRUISE;P.turn=0;P.boost=0;G.time=0;G.tries=0;G.front=0;G.chaseT=0;G.warned=false;G.coneSay=false;G.rampSay=false;
  if(LV.mode==='city'&&HUB.built){P.x=HUB.sx;P.z=HUB.sz;P.h=HUB.sh}
  scoops.forEach(s=>{s.got=false;s.g.visible=s.beam.visible=s.pad.visible=true;s.g.scale.setScalar(.9)});
  cones.forEach(c=>{c.hit=0;c.o.visible=true;c.o.position.set(c.x,1.3,c.z);c.o.rotation.set(0,0,0);c.o.scale.setScalar(1)});
  if(dinoG)dinoG.visible=false;if(blobD)blobD.visible=false;
  $('track').classList.remove('on')}
function scoopsGot(){return scoops.filter(s=>s.got).length}
function beginPlay(){$('b-inv').hidden=false;resetRun();T.said=false;G.knocked=0;G.falls=0;G.fallSaid=false;HUB.portals.forEach(p=>p.hit=0);HUB.coastHit=0;buildRivals();if(LV.mode!=='city')placeRivals();G.phase='play';$('overlay').hidden=true;$('card').innerHTML='';
  setQuest(LV.quest,LV.id===0?HUB.found.size:0);$('quest').hidden=false;
  say('e',LV.intro,3.4);
  later(3.5,()=>{if(G.phase==='play')say('v',LV.vendor,4.8)})}
function startChase(){G.phase='chase';G.chaseT=0;ensureDino();
  dinoG.visible=true;dinoG.position.set(P.x-48,1.2,-22);dinoG.userData.x=P.x-48;dinoG.userData.z=-22;dinoG.userData.ph=0;
  if(!blobD){blobD=mkBlob(18,24)}blobD.visible=true;
  if(!dinoG.userData.ol){addOutlines(dinoG,'actor');dinoG.userData.ol=1}
  respawnX=P.x;setQuest(LV.goalQuest,null);$('pips').style.display='none';$('track').classList.add('on');
  toast('FLUCHT!',2200);SFX.siren();G.shake=1;
  say('e',LV.chase,4.4)}
const makeIceTower=asActor(()=>{const g=new THREE.Group();
  const waf=new THREE.Mesh(new THREE.ConeGeometry(.9,2.2,10),SM({color:'#d9a86a',roughness:.8}));waf.rotation.x=Math.PI;waf.position.y=1.1;waf.castShadow=true;g.add(waf);
  [['#f1a7c8',2.5,1.15],['#8fe0c8',3.4,.95],['#f7e07a',4.2,.75]].forEach(([c,y,rad])=>{const s=new THREE.Mesh(new THREE.SphereGeometry(rad,18,14),SM({color:c,roughness:.45}));s.position.y=y;s.castShadow=true;g.add(s)});
  g.visible=false;sc.add(g);return dynOf(g)});
const iceTower=makeIceTower();addOutlines(iceTower,'actor');
const E={t:0,bites:0,x:0,z:0,sc:2.2,tops:[(2.5+1.15),(3.4+.95),(4.2+.75),2.2],from:null,gone:false,boomed:false};
const BITE_T=[1.1,1.8,2.5,3.2],BITE_D=.5,ORD=[2,1,0,3];const topOf=i=>E.tops[ORD[Math.min(3,i)]];
function biteTheta(top){let best=0,bd=1e9;for(let th=0;th<1.3;th+=.01){const y=24*Math.cos(th)-11*Math.sin(th)+1.2;const d=Math.abs(y-(top*E.sc+1.3+.5));if(d<bd){bd=d;best=th}}return best}
function caught(){G.phase='caught';resetTrick();$('toast').classList.remove('on');clearTimeout(toast.h);G.caughtT=0;SFX.boing();
  E.t=0;E.bites=0;E.gone=false;E.boomed=false;E.from=new V3(P.x,P.y,P.z);E.x=dinoG.userData.x+25;E.z=P.z;P.speed=0;
  iceTower.position.set(E.x,1.3,E.z);iceTower.scale.setScalar(.01);iceTower.visible=true;iceTower.children.forEach(c=>c.visible=true);
  burst(E.x,6,E.z,70);boardPlayerOn(false);
  say('e',LV.eat,3.4)}
function stepEat(dt){E.t+=dt;G.caughtT=E.t;const d=dinoG.userData;
  // Eisturm wächst federnd
  const gu=Math.min(1,E.t/.45),el=gu<1?(1+2.2*Math.pow(gu-1,3)+1.2*Math.pow(gu-1,2)):1;iceTower.scale.setScalar(Math.max(.01,E.sc*gu*el));
  // Dino: steht, atmet, nickt beim Beißen
  d.ph+=dt*2;dinoG.position.set(d.x,1.2+Math.abs(Math.sin(d.ph))*.25,d.z);blobD.position.set(d.x,1.34,d.z);
  let pitch=0;for(let i=0;i<4;i++){const u=(E.t-BITE_T[i])/BITE_D;if(u>0&&u<1){pitch=Math.max(pitch,biteTheta(topOf(i))*Math.sin(Math.PI*u))}
    if(u>=.5&&E.bites===i){E.bites++;SFX.bite();burst(E.x,topOf(i)*E.sc+1.3,E.z,36);G.shake=Math.max(G.shake,.35);
      if(i<3)iceTower.children[3-i].visible=false;else{iceTower.children[0].visible=false;E.gone=true;P.av.visible=false}}}
  dinoG.rotation.x=pitch;
  // Avatar: springt auf den Turm, sitzt auf der obersten Kugel, rutscht mit jedem Biss tiefer
  const topNow=topOf(E.bites)*E.sc+1.3-.35,av=P.av;
  if(E.t<.7){const u=E.t/.7;av.position.set(E.from.x+(E.x-E.from.x)*u,E.from.y+(topOf(0)*E.sc+1.3-.35-E.from.y)*u+Math.sin(Math.PI*u)*7,E.from.z)}
  else{const ty=topNow;av.position.x=E.x;av.position.z=E.z;av.position.y+=(ty-av.position.y)*Math.min(1,dt*10)}
  av.rotation.set(0,Math.PI,0);av.rotation.z=Math.sin(G.t*18)*.06;
  const wv=av.userData;if(wv.arms)wv.arms.forEach(({sg,s})=>{sg.rotation.z=s*(2.5+.35*Math.sin(G.t*12+(s>0?0:2)))});if(wv.tz)wv.tz.rotation.x=.1;
  blobP.position.set(E.x,1.34,E.z);blobP.scale.setScalar(E.sc*.9*gu);
  if(E.gone&&!E.boomed&&E.t>BITE_T[3]+.35){E.boomed=true;SFX.gulp();burst(E.x,8,E.z,90);$('boom-big').textContent='SCHLURP!';$('boom').classList.add('on');
    $('boom-small').textContent='Dein Avatar und deine Erfolge sind unantastbar. Nur dieser Straßenabschnitt hat’s vergessen.';say('e','Es hat ihm geschmeckt. Kein Grund zur Sorge.',2.4)}
  if(E.t>BITE_T[3]+1.8)respawn()}
function respawn(){G.tries++;P.push=0;placeRivals();iceTower.visible=false;P.av.visible=true;dinoG.rotation.x=0;resetTrick();T.state='ready';T.cd=0;flyBoard.visible=false;boardPlayerOn(true);dinoG.userData.slow=0;$('boom').classList.remove('on');G.phase='chase';G.chaseT=0;G.warned=false;
  P.x=Math.max(respawnX,-20);P.z=-8;P.y=1.3;P.vy=0;P.h=0;P.speed=SPEED_CRUISE;P.boost=0;P.av.scale.setScalar(1.35);
  dinoG.userData.x=P.x-48;dinoG.userData.z=-22;
  cones.forEach(c=>{if(c.x>P.x){c.hit=0;c.o.visible=true;c.o.position.set(c.x,1.3,c.z);c.o.rotation.set(0,0,0);c.o.scale.setScalar(1)}});
  toast('Noch mal!',1400)}
function win(){G.phase='win';SFX.win();burst(P.x,4,P.z,120);burst(P.x+6,6,P.z,80);
  say('e',LV.win,5);
  const bk=LV.id===1?'kq-best':'kq-best2';let best=null;try{best=parseFloat(localStorage.getItem(bk))||null;if(!best||G.time<best){localStorage.setItem(bk,String(G.time.toFixed(1)));best=G.time}}catch(e){best=G.best=G.best&&G.best<G.time?G.best:G.time}
  const secs=G.time.toFixed(0);$('overlay').hidden=false;
  const hasNext=!!LEVELS[LV.id+1],nn=LV.id+1;
  $('card').innerHTML=`<h1>${LV.id===1?'Geschafft!':'Welt '+LV.id+' geschafft!'}</h1><p class="sub">${LV.winSub}</p>
   <div class="stats"><div><div class="n">${secs}s</div><div class="l">Spielzeit</div></div><div><div class="n">${G.tries}</div><div class="l">Mal gegessen</div></div><div><div class="n">${(best||G.time).toFixed(0)}s</div><div class="l">Bestzeit</div></div><div><div class="n">${G.tricks||0}</div><div class="l">Kickflips</div></div></div>
   <div class="badge"><i>★</i><span>${LV.badge} Gehört zu deinem Avatar, in jeder Welt.</span></div>
   ${hasNext?`<button class="btn" id="next" type="button">Weiter zu Welt ${nn}</button><button class="btn sec" id="again" type="button">Welt ${LV.id} noch einmal</button>`:`<button class="btn" id="again" type="button">Welt ${LV.id} noch einmal</button><button class="btn sec" id="home" type="button">Zum Start</button>`}
   <button class="btn sec" id="tocity" type="button">Zurück zur Stadt</button>
   <p class="note">${LV.id===1?'Hinter dem Portal wartet die Eis-Galaxie.':LV.id===2?'Hinter dem Regenbogen leuchtet die Nacht-Stadt.':'Welt 4 ist noch nicht gebaut. Was kommt als Nächstes?'}</p>`;
  if(hasNext){$('next').onclick=()=>{ac();applyLevel(nn);beginPlay()};$('next').focus({preventScroll:true})}
  else{$('home').onclick=()=>{ac();showTitle()};$('again').focus({preventScroll:true})}
  $('tocity').onclick=()=>{ac();applyLevel(0);beginPlay()};$('again').onclick=()=>{ac();beginPlay()}}

/* ---------- Avatar-Karussell ---------- */
const SKIN_INFO={pink:['Pinky','Rundbrille, Goldketten, Gürteltasche'],red:['Rocket','Basecap, Mega-Brille, Rucksack'],orange:['Mandarine','Bommelmütze, große Brille'],gold:['Goldkrone','Krone, vier Ketten, Eis-Anhänger'],lime:['Limette','Bucket-Hat, Herzbrille'],mint:['Minze','Cap, Visier-Brille, Eis-Kette'],teal:['Welle','Schal, Herzbrille, Armreifen'],sky:['Wolke','Kopfhörer, Schal, Visier-Brille'],purple:['Lila Laune','Dicke Ketten, Schal, Visier'],black:['Nachtschicht','Mütze, Eis-Kette, Armreifen'],snow:['Schneeball','Bucket-Hat, Kopfhörer, Schal']};
const THUMBS={};let carIdx=0,thumbJob=0;
function carHue(i){return SKIN_LIST[(i+SKIN_LIST.length)%SKIN_LIST.length]}
function setCarousel(i,first){const n=SKIN_LIST.length;carIdx=((i%n)+n)%n;const [k,name,col]=carHue(carIdx);
  P.preset=PRESETS[k];buildPlayer();P.av.scale.setScalar(1.35);
  try{localStorage.setItem('kq-skin',k)}catch(e){}
  const set=(id,idx,main)=>{const [kk,,cc]=carHue(idx),im=$(id).querySelector('img'),sl=$(id);sl.style.setProperty('--c',cc);sl.dataset.k=kk;if(THUMBS[kk]){im.src=THUMBS[kk];im.hidden=false}else{im.removeAttribute('src');im.hidden=true}};
  set('cl',carIdx-1);set('cm',carIdx);set('cr',carIdx+1);
  $('cname').textContent=(SKIN_INFO[k]||[name])[0];$('ctag').textContent=(SKIN_INFO[k]||['',''])[1];
  [...$('cdots').children].forEach((b,j)=>b.setAttribute('aria-current',String(j===carIdx)));
  const sl=$('cm');if(!first&&!matchMedia('(prefers-reduced-motion:reduce)').matches){sl.classList.remove('pop');void sl.offsetWidth;sl.classList.add('pop')}}
function stepCarousel(d){ac();setCarousel(carIdx+d);tone(520+d*60,.08,'triangle',.04)}
function makeThumbs(){const my=++thumbJob;const todo=SKIN_LIST.map(s=>s[0]).filter(k=>!THUMBS[k]);if(!todo.length)return;
  const W=200,H=260,rt=new THREE.WebGLRenderTarget(W,H,{samples:0});rt.texture.colorSpace=THREE.SRGBColorSpace;
  const cc=document.createElement('canvas');cc.width=W;cc.height=H;const cx=cc.getContext('2d'),buf=new Uint8Array(W*H*4),cm=new THREE.PerspectiveCamera(27,W/H,.5,500);
  const one=()=>{if(my!==thumbJob||G.phase!=='title'){rt.dispose();return}const k=todo.shift();if(!k){rt.dispose();refreshSlots();return}
    const av=skater(P.x,P.y,P.z,Math.PI/2+.5,PRESETS[k],1.35);dynOf(av);addOutlines(av,'actor');av.updateMatrixWorld(true);
    const pv=P.av.visible,bv=blobP.visible;P.av.visible=false;blobP.visible=false;
    cm.position.set(P.x+6.4,3.3,P.z-2.8);cm.lookAt(P.x,2.35,P.z);cm.updateProjectionMatrix();
    const old=r.getRenderTarget();r.setRenderTarget(rt);r.render(sc,cm);r.readRenderTargetPixels(rt,0,0,W,H,buf);r.setRenderTarget(old);
    P.av.visible=pv;blobP.visible=bv;sc.remove(av);av.traverse(o=>{if(o.geometry)o.geometry.dispose()});
    const id=cx.createImageData(W,H);for(let y=0;y<H;y++)id.data.set(buf.subarray((H-1-y)*W*4,(H-y)*W*4),y*W*4);cx.putImageData(id,0,0);THUMBS[k]=cc.toDataURL('image/png');
    refreshSlots();setTimeout(one,16)};
  setTimeout(one,30)}
function refreshSlots(){if(!$('cm'))return;[['cl',carIdx-1],['cm',carIdx],['cr',carIdx+1]].forEach(([id,idx])=>{const kk=carHue(idx)[0],im=$(id).querySelector('img');if(THUMBS[kk]){im.src=THUMBS[kk];im.hidden=false}})}

function showTitle(){INV.open=false;$('inv').hidden=true;$('b-inv').hidden=true;try{const sk=localStorage.getItem('kq-skin');if(sk&&PRESETS[sk]&&!showTitle.done){P.preset=PRESETS[sk]}}catch(e){}showTitle.done=1;applyLevel(1);resetRun();G.phase='title';$('quest').hidden=true;narr.el.classList.remove('on');$('overlay').hidden=false;$('boom').classList.remove('on');
  P.av.scale.setScalar(1.35);
  $('card').innerHTML=`<h1>Küsten-Quest</h1>
   <p class="sub">Du startest in der Stadt. An der Küste im Westen beginnt das Rennen: fünf Eiskugeln sammeln und vor etwas Großem davonrennen. Die Portale zu den anderen Welten sind in der Stadt versteckt. Vorsicht, andere Skater schubsen dich.</p>
   <h2>Dein Avatar</h2>
   <div id="car" role="group" aria-roledescription="Karussell" aria-label="Avatar auswählen">
     <button class="cb" id="cprev" type="button" aria-label="Vorheriger Avatar">◀</button>
     <div id="cview"><div class="slot side" id="cl"><img alt=""></div><div class="slot main" id="cm"><img alt=""></div><div class="slot side" id="cr"><img alt=""></div></div>
     <button class="cb" id="cnext" type="button" aria-label="Nächster Avatar">▶</button>
   </div>
   <div id="cinfo" aria-live="polite"><b id="cname"></b><span id="ctag"></span></div>
   <div id="cdots">${SKIN_LIST.map(([k,n],i)=>`<button type="button" data-i="${i}" aria-label="${n}"></button>`).join('')}</div>
   <h2>Steuerung</h2>
   <div class="keys"><kbd>W / ↑</kbd><span>Gas geben</span><kbd>A D / ← →</kbd><span>Lenken</span><kbd>Leertaste</kbd><span>Springen, Rampen geben Schub</span><kbd>Shift</kbd><span>Kickflip, das Publikum klatscht</span><kbd>Linksklick · F</kbd><span>Skateboard auf Skater oder Boss werfen (2 s Pause)</span><kbd>I</kbd><span>Inventar öffnen (Spiel pausiert)</span><kbd>P · M</kbd><span>Pixel-Look · Ton</span></div>
   <button class="btn" id="go" type="button">Los geht’s: Start in der Stadt</button><button class="btn sec" id="go1" type="button">Direkt zum Küsten-Rennen (Welt 1)</button><button class="btn sec" id="go2" type="button">Direkt zu Welt 2: Eis-Galaxie</button><button class="btn sec" id="go3" type="button">Direkt zu Welt 3: Nacht-Stadt</button>`;
  const cur=Math.max(0,SKIN_LIST.findIndex(s=>PRESETS[s[0]]===P.preset));setCarousel(cur,true);
  $('cprev').onclick=()=>stepCarousel(-1);$('cnext').onclick=()=>stepCarousel(1);
  [...$('cdots').children].forEach(b=>b.onclick=()=>setCarousel(+b.dataset.i));
  const cv=$('cview');let sx=null;cv.onpointerdown=e=>{sx=e.clientX};cv.onpointerup=e=>{if(sx!==null&&Math.abs(e.clientX-sx)>28)stepCarousel(e.clientX<sx?1:-1);sx=null};cv.onpointercancel=()=>{sx=null};
  makeThumbs();
  $('go').onclick=()=>{ac();applyLevel(0);beginPlay()};$('go1').onclick=()=>{ac();applyLevel(1);beginPlay()};$('go2').onclick=()=>{ac();applyLevel(2);beginPlay()};$('go3').onclick=()=>{ac();applyLevel(3);beginPlay()}}


/* ---------- Skateboard-Wurf ---------- */
const THROW_CD=2,SLOW_T=2,SLOW_F=.35;
const T={state:'ready',cd:0,t:0,said:false};
const makeBoard=asActor(()=>{const g=new THREE.Group();
  const mk=(geo,col,px,py,pz,sx=1,sy=1,sz=1)=>{const m=new THREE.Mesh(geo,SM({color:col,roughness:.6}));m.position.set(px,py,pz);m.scale.set(sx,sy,sz);m.castShadow=true;g.add(m);return m};
  mk(new THREE.BoxGeometry(1,1,1),'#2499bb',0,0,0,.6,.06,2.2);mk(new THREE.BoxGeometry(1,1,1),'#f0cf36',0,.04,0,.42,.02,1.8);
  [[-.24,.8],[.24,.8],[-.24,-.8],[.24,-.8]].forEach(([a,b2])=>{const w=mk(new THREE.CylinderGeometry(.14,.14,.12,12),'#d54291',a*1.3,-.12,b2);w.rotation.z=Math.PI/2});
  g.visible=false;sc.add(g);return dynOf(g)});
const flyBoard=makeBoard();addOutlines(flyBoard,'actor');
function boardPlayerOn(on){const bg=P.av&&P.av.userData.board;if(bg)bg.visible=on}
function resetBoard(){T.state='ready';T.cd=0;flyBoard.visible=false;boardPlayerOn(true);updateThrowHud()}
function updateThrowHud(){const e=$('throw'),s=$('throw-s'),bar=$('throw-bar');
  const live=(G.phase==='play'||G.phase==='chase'||G.phase==='caught');e.classList.toggle('on',live);
  if(T.state==='ready'&&T.cd<=0){s.textContent='bereit';e.classList.remove('cd');bar.style.setProperty('--p',1)}
  else if(T.state==='ready'){s.textContent=T.cd.toFixed(1)+' s';e.classList.add('cd');bar.style.setProperty('--p',1-T.cd/THROW_CD)}
  else{s.textContent=T.state==='out'?'fliegt …':'kommt zurück';e.classList.add('cd');bar.style.setProperty('--p',T.state==='out'?0:.5)}}
function dinoCenter(){return dinoG.position.clone().add(new V3(0,8,0))}
function rivalPos(r){return new V3(r.x,2.2,r.z)}
function pickTarget(){let rb=null,bd=1e9;
  RIV.list.forEach(r=>{if(!r.av.visible||r.hit>0||r.away>0)return;const d=Math.hypot(r.x-P.x,r.z-P.z);if(d<70&&d<bd){bd=d;rb=r}});
  const dino=G.phase==='chase'&&dinoG&&dinoG.visible;
  if(rb&&bd<45)return {type:'riv',r:rb};if(dino)return {type:'dino'};if(rb)return {type:'riv',r:rb};return null}
function throwBoard(){
  if(T.state!=='ready'||T.cd>0||(G.phase!=='play'&&G.phase!=='chase'))return;
  const tg=pickTarget();if(!tg){toast('Kein Ziel',800);return}
  T.target=tg;T.state='out';T.t=0;flyBoard.position.set(P.x,P.y+2,P.z);flyBoard.rotation.set(0,Math.PI/2-P.h,0);flyBoard.visible=true;boardPlayerOn(false);SFX.jump();
  if(!T.said&&tg.type==='dino'){T.said=true;later(.3,()=>say('e','Du wirfst dein Skateboard auf ein Riesenvieh. Das ist neu.',3))}
  updateThrowHud()}
function hitRival(r){r.hit=1.4;r.ky=1.3;r.kv=new V3(9+Math.random()*7,13,(Math.random()-.5)*14);T.cd=THROW_CD;T.state='back';T.t=0;
  burst(r.x,3,r.z,50);SFX.thud();SFX.boing();G.shake=Math.max(G.shake,.5);G.knocked=(G.knocked||0)+1;toast('ABGESCHOSSEN!'+(G.knocked>1?' ×'+G.knocked:''),1100);
  if(!RIV.hitSaid){RIV.hitSaid=true;say('e','Der Skater fliegt davon. Er meldet sich später.',3)}}
function hitDino(){const d=dinoG.userData;d.slow=SLOW_T;T.cd=THROW_CD;T.state='back';T.t=0;
  const c=dinoCenter();burst(c.x,c.y+2,c.z,60);SFX.thud();SFX.boing();G.shake=Math.max(G.shake,.9);toast('TREFFER!',1100);
  say('e',[LV.boss+' hält inne und schaut beleidigt.','Das hat gesessen. '+LV.boss+' quietscht.','Autsch. Selbst für etwas Aufblasbares.'][Math.floor(Math.random()*3)],2.6)}
function stepBoard(dt){
  if(T.cd>0&&T.state==='ready')T.cd=Math.max(0,T.cd-dt);
  if(T.state==='out'){T.t+=dt;const tg=T.target,isR=tg&&tg.type==='riv',tgt=isR?rivalPos(tg.r):dinoCenter(),pos=flyBoard.position,dir=tgt.clone().sub(pos),dist=dir.length();
    pos.addScaledVector(dir.normalize(),Math.min(dist,46*dt));pos.y+=Math.sin(T.t*8)*.05;flyBoard.rotation.y+=dt*16;flyBoard.rotation.z+=dt*5;
    if(isR&&(tg.r.hit>0||tg.r.away>0)){T.state='back';T.t=0;T.cd=THROW_CD}
    else if(dist<(isR?3.6:11))(isR?hitRival(tg.r):hitDino());else if(T.t>2.4){T.state='back';T.t=0;T.cd=THROW_CD;toast('Daneben',800)}}
  else if(T.state==='back'){T.t+=dt;const tgt=new V3(P.x,P.y+1.2,P.z),pos=flyBoard.position,dir=tgt.clone().sub(pos),dist=dir.length();
    pos.addScaledVector(dir.normalize(),Math.min(dist,(30+T.t*30)*dt));flyBoard.rotation.y-=dt*14;flyBoard.rotation.z=Math.sin(T.t*9)*.5;
    if(dist<1.7||T.t>3.2){T.state='ready';flyBoard.visible=false;boardPlayerOn(true);burst(P.x,P.y+1,P.z,14);SFX.collect(1)}}
  updateThrowHud()}


/* ---------- Kickflip + Applaus ---------- */
const Tk={active:false,t:0,dur:.55,done:false,usedAir:false,clap:0,said:false};
function grounded(){return P.y<=groundAt(P.x,P.z)+.06}
function doTrick(){
  if(G.phase!=='play'&&G.phase!=='chase')return;
  if(T.state!=='ready'){toast('Ohne Board kein Kickflip',900);return}
  const gnd=grounded()||P.coy<.14;if(Tk.active||(!gnd&&Tk.usedAir))return;
  if(gnd){P.vy=7.8;P.coy=1;SFX.jump()}
  Tk.active=true;Tk.t=0;Tk.done=false;Tk.usedAir=true;SFX.whoosh()}
function resetTrick(){Tk.active=false;Tk.usedAir=false;Tk.done=false;Tk.clap=0;const bg=P.av&&P.av.userData.board;if(bg){bg.rotation.set(0,0,0);bg.position.set(0,0,0)}}
function stepTrick(dt){
  const bg=P.av.userData.board;const air=!grounded();
  if(Tk.active&&bg){Tk.t+=dt;const u=Math.min(1,Tk.t/Tk.dur),e=u<.5?2*u*u:1-Math.pow(-2*u+2,2)/2,a=e*Math.PI*2;
    bg.rotation.z=a;bg.position.set(.17*Math.sin(a),.17-.17*Math.cos(a),0);if(u>=1){Tk.done=true;bg.rotation.z=0;bg.position.set(0,0,0)}
    if(!air&&Tk.t>.12){const ok=Tk.done||Tk.t>=Tk.dur*.75;Tk.active=false;bg.rotation.set(0,0,0);bg.position.set(0,0,0);
      if(ok){G.tricks=(G.tricks||0)+1;Tk.clap=2.4;SFX.clap();burst(P.x,P.y+2,P.z,50);toast('KICKFLIP!'+(G.tricks>1?' ×'+G.tricks:''),1300);G.shake=Math.max(G.shake,.25);
        if(!Tk.said){Tk.said=true;say('e','Kickflip. Das Publikum versteht den Trick nicht, klatscht aber trotzdem.',3.2)}}
      else{P.speed*=.8;toast('Wackelig …',800)}}}
  if(!air){Tk.usedAir=false}
  /* Publikum */
  const clap=Tk.clap>0;if(clap)Tk.clap-=dt;
  for(const c of CLAPPERS){const near=Math.abs(c.x-P.x)<95;
    if(clap&&near){const w=.5+.5*Math.sin(G.t*30+c.ph);c.A.rotation.set(-1.25,c.face,-c.s*(.12+.5*w));c.A.userData.cl=1}
    else if(c.A.userData.cl){c.A.rotation.set(0,c.face,c.idle);c.A.userData.cl=0}
    else if(c.up&&near)c.A.rotation.z=c.idle+c.s*.14*Math.sin(G.t*3+c.ph)}}

/* ---------- Eingabe ---------- */
const KEYMAP={ArrowUp:'up',KeyW:'up',ArrowDown:'down',KeyS:'down',ArrowLeft:'left',KeyA:'left',ArrowRight:'right',KeyD:'right'};
addEventListener('keydown',e=>{if(G.phase==='title'&&(e.code==='ArrowLeft'||e.code==='ArrowRight'||e.code==='KeyA'||e.code==='KeyD')&&$('cm')){e.preventDefault();stepCarousel(e.code==='ArrowLeft'||e.code==='KeyA'?-1:1);return}
  const k=KEYMAP[e.code];if(k){K[k]=1;e.preventDefault()}
  if(e.code==='Space'){e.preventDefault();jump()}
  if((e.code==='ShiftLeft'||e.code==='ShiftRight')&&!e.repeat){e.preventDefault();doTrick()}
  if(e.code==='KeyF'||e.code==='KeyE')throwBoard();
  if(e.code==='KeyP')setPix(!G.pix);
  if(e.code==='KeyM')toggleSnd();
  if(e.code==='Enter'&&G.phase==='title'){ac();beginPlay()}});
addEventListener('keyup',e=>{const k=KEYMAP[e.code];if(k)K[k]=0});
addEventListener('blur',()=>{K.up=K.down=K.left=K.right=0});
function jump(){if((G.phase==='play'||G.phase==='chase')&&(P.y<=groundAt(P.x,P.z)+.05||P.coy<.14)){P.vy=7.4;P.coy=1;SFX.jump()}}
function toggleSnd(){G.muted=!G.muted;MUS.muted=G.muted;$('b-snd').setAttribute('aria-pressed',String(!G.muted))}
addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'&&e.button===0&&!(e.target.closest&&e.target.closest('button'))&&G.phase!=='title'){ac();throwBoard()}});
$('t-trick').addEventListener('pointerdown',e=>{e.preventDefault();ac();doTrick()});
$('t-throw').addEventListener('pointerdown',e=>{e.preventDefault();ac();throwBoard()});
$('b-pix').onclick=()=>setPix(!G.pix);$('b-snd').onclick=toggleSnd;
[['t-left','left'],['t-right','right'],['t-gas','up']].forEach(([id,k])=>{const b=$(id);b.addEventListener('pointerdown',e=>{e.preventDefault();K[k]=1;b.classList.add('on');ac()});['pointerup','pointercancel','pointerleave'].forEach(ev=>b.addEventListener(ev,()=>{K[k]=0;b.classList.remove('on')}))});
$('t-jump').addEventListener('pointerdown',e=>{e.preventDefault();jump()});
if(matchMedia('(pointer:coarse)').matches)$('touch').classList.add('on');

/* ---------- Physik / Logik ---------- */
let GAPS=[];
function rampAt(x,z){for(const [kx,kz] of KICKERS){if(Math.abs(z-kz)<1.8&&x>kx-2.1&&x<kx+2.1)return 1.3+1.3*((x-(kx-2.1))/4.2)}return 1.3}
function gapAt(x){for(const gp of GAPS)if(x>gp[0]&&x<gp[1])return {u:(x-gp[0])/(gp[1]-gp[0])};return null}
function groundAt(x,z){return gapAt(x)?-999:rampAt(x,z)}
function stepPlayer(dt){
  const flip=G.front>.5?-1:1;
  const steer=((K.right?1:0)-(K.left?1:0))*flip;
  P.turn+=(steer-P.turn)*Math.min(1,dt*9);
  P.h+=P.turn*dt*1.8*(.5+.5*Math.min(1,P.speed/6));
  if(!steer&&Math.abs(P.h)<1.2)P.h*=Math.max(0,1-dt*1.6);
  P.h=Math.max(-2.7,Math.min(2.7,P.h));
  let target=K.up?SPEED_MAX:(K.down?2.2:SPEED_CRUISE);if(P.boost>0){target+=3.2;P.boost-=dt}
  P.speed+=(target-P.speed)*Math.min(1,dt*(K.up||P.boost>0?1.5:1.1));
  P.x+=Math.cos(P.h)*P.speed*dt;P.z+=Math.sin(P.h)*P.speed*dt;
  P.z+=P.push*dt;P.push*=Math.max(0,1-dt*5);
  if(P.z>ZMAX){P.z=ZMAX;P.h=Math.min(P.h,0);P.speed*=1-dt*1.2}
  if(P.z<ZMIN){P.z=ZMIN;P.h=Math.max(P.h,0);P.speed*=1-dt*1.2}
  P.x=Math.max(XMIN,Math.min(XMAX,P.x));
  for(const [cx] of PARKED){if(Math.abs(P.x-cx)<2.9&&P.z<-9.9&&P.y<2.4){P.speed*=.4;P.x-=Math.cos(P.h)*.6;SFX.thud();if(!G.coneSay){G.coneSay=true}}}
  const g=groundAt(P.x,P.z),gr=rampAt(P.x,P.z);const wasRamp=P.ramp;P.ramp=gr>1.31;
  if(wasRamp&&!P.ramp&&P.y<=gr+1.8){P.vy=Math.max(P.vy,P.speed*.34+3.2);P.boost=1.1;SFX.boost();if(!G.rampSay){G.rampSay=true;say('e','Rampe! Die Physik ist heute auf deiner Seite.',3)}}
  P.vy-=LV.grav*dt;P.y+=P.vy*dt;
  if(P.y<g&&P.y>g-.8){P.y=g;if(P.vy<0)P.vy=0}
  if(P.y<=g+.05&&P.y>=g-.8)P.coy=0;else P.coy+=dt;
  if(P.y<-5)fallRespawn();
  // Hütchen
  for(const c of cones){if(c.hit){c.o.position.x+=c.vx*dt;c.o.position.y+=c.vy*dt;c.o.position.z+=c.vz*dt;c.vy-=18*dt;c.o.rotation.x+=7*dt;c.o.rotation.z+=5*dt;c.hit-=dt;if(c.hit<=0)c.o.visible=false;continue}
    if(Math.abs(P.x-c.x)<1.2&&Math.abs(P.z-c.z)<1.2&&P.y<2.4){c.hit=1.1;c.vx=Math.cos(P.h)*P.speed*1.2;c.vz=Math.sin(P.h)*P.speed*.8+(Math.random()-.5)*4;c.vy=8;P.speed*=.55;SFX.thud();G.shake=Math.max(G.shake,.25);
      if(!G.coneSay){G.coneSay=true;say('e','Ein Hütchen. Es hat dir nichts getan. Du ihm schon.',3)}}}
  // Eiskugeln
  if(G.phase==='play')for(const s of scoops){if(!s.got&&Math.hypot(P.x-s.x,P.z-s.z)<4.6&&P.y<7){s.got=true;const n=scoopsGot();burst(s.x,4,s.z,46);SFX.collect(n);
      s.g.visible=s.beam.visible=s.pad.visible=false;setQuest(LV.quest,n);toast(n+' / 5',900);
      const lines=LV.lines;
      say('e',lines[n-1],3);if(n===5)later(1.3,()=>{if(G.phase==='play')startChase()})}}
}
function stepDino(dt){const d=dinoG.userData;
  if(d.slow>0)d.slow-=dt;const sp=(LV.bossSpeed+Math.min(G.chaseT,22)*.12)*(d.slow>0?SLOW_F:1);d.x+=sp*dt;d.z+=(P.z-3-d.z)*Math.min(1,dt*.9);d.ph+=dt*sp*.55;
  dinoG.position.set(d.x,1.2+Math.abs(Math.sin(d.ph))*.9,d.z);
  dinoG.userData.legs.forEach((l,i)=>{const s=Math.sin(d.ph+i*Math.PI);l.position.y=2.2+Math.max(0,s)*1.8;l.rotation.x=s*.35});
  const prev=d.s||0,cur=Math.sin(d.ph);if(prev<0&&cur>=0){const gap=P.x-d.x;SFX.stomp(Math.max(0,1-gap/80));G.shake=Math.max(G.shake,Math.max(.15,1-gap/70))}d.s=cur;
  blobD.position.set(d.x,1.34,d.z);
  const gap=P.x-d.x;
  if(!G.warned&&gap<26){G.warned=true;say('e','Er ist näher, als er aussieht.',2.6)}
  if(gap<15&&Math.abs(P.z-d.z)<12&&G.phase==='chase')caught();
  return gap}
function updateTrack(gap){const f=x=>Math.max(0,Math.min(1,(x+134)/260))*100+'%';
  $('mk-p').style.left=f(P.x);$('mk-g').style.left=f(WIN_X);if(dinoG&&dinoG.visible)$('mk-d').style.left=f(dinoG.userData.x);
  const g=$('gap');g.textContent='Abstand '+Math.max(0,Math.round(gap-15));g.className=gap<28?'danger':''}

/* ---------- Hauptschritt ---------- */
const camPos=new V3(-148,6,-8),camLook=new V3(-134,3,-8);let gapNow=60;
function step(dt){
  if(INV.open)return;
  G.t+=dt;for(let i=TIMERS.length-1;i>=0;i--){TIMERS[i].t-=dt;if(TIMERS[i].t<=0){const f=TIMERS[i].fn;TIMERS.splice(i,1);f()}}
  if(narr.active){narr.shown=Math.min(narr.full.length,narr.shown+dt*46);narr.text.textContent=narr.full.slice(0,Math.floor(narr.shown));if(narr.shown>=narr.full.length){narr.hold-=dt;if(narr.hold<=0){narr.active=false;narr.el.classList.remove('on')}}}
  stepConfetti(dt);stepClouds(dt);stepLevel2(dt);stepLevel3(dt);stepLevel0(dt);
  scoops.forEach(s=>{if(s.got)return;s.t+=dt;s.g.rotation.y+=dt*2.2;s.g.position.y=3.0+Math.sin(s.t*2.4)*.45;s.beam.material.opacity=.16+.07*Math.sin(s.t*3);s.pad.scale.setScalar(1+.12*Math.sin(s.t*4))});
  goalPortal.children.forEach((c,i)=>{if(i>0)c.rotation.z+=dt*(i%2?1.4:-1.1)});
  if(G.phase==='play'||G.phase==='chase'){G.time+=dt;if(LV.mode==='city')stepCity(dt);else{stepPlayer(dt);stepRivals(dt)}}
  stepBoard(dt);
  if(G.phase==='play'||G.phase==='chase'||G.phase==='win')stepTrick(dt);
  if(G.phase==='chase'){G.chaseT+=dt;gapNow=stepDino(dt);updateTrack(gapNow);
    if(P.x>=WIN_X)win()}
  if(G.phase==='caught')stepEat(dt);
  if(G.phase==='win'){P.speed=Math.max(0,P.speed-dt*3);P.x+=Math.cos(P.h)*P.speed*dt;P.y=Math.max(1.3,P.y)}
  // Avatar
  const av=P.av;if(G.phase!=='caught'){av.position.set(P.x,P.y,P.z);av.rotation.y=Math.PI/2-P.h;av.rotation.z=-P.turn*.28*Math.min(1,P.speed/5)*(G.front>.5?-1:1);
  const u=av.userData;if(u.tz)u.tz.rotation.x=.3+(P.speed-4)*.018-Math.min(0,P.vy)*.01;
  if(u.arms)u.arms.forEach(({sg,s})=>{sg.rotation.z=s*(.8+.18*Math.sin(G.t*7+(s>0?0:2))+Math.min(.5,Math.max(0,P.vy)*.06))});
  blobP.position.set(P.x,1.34,P.z);blobP.scale.setScalar(1);blobP.material.opacity=Math.max(.25,1-(P.y-1.3)*.18)}
  vendor.userData.arms&&vendor.userData.arms.forEach(({sg,s})=>{sg.rotation.z=s*(1.6+.35*Math.sin(G.t*5))});
  // Kamera
  const fwd=new V3(Math.cos(P.h),0,Math.sin(P.h));const up=new V3(0,1,0);
  G.front+=((G.phase==='chase'||G.phase==='caught'?1:0)-G.front)*Math.min(1,dt*1.6);
  const e=G.front*G.front*(3-2*G.front);
  const backP=new V3(P.x,P.y,P.z).addScaledVector(fwd,-9.5).addScaledVector(up,4.3),backL=new V3(P.x,P.y,P.z).addScaledVector(fwd,8).addScaledVector(up,2.1);
  const frontP=new V3(P.x,P.y,P.z).addScaledVector(fwd,12).addScaledVector(up,5.2),frontL=new V3(P.x,P.y,P.z).addScaledVector(fwd,-6).addScaledVector(up,3.4);
  let tp=backP.clone().lerp(frontP,e),tl=backL.clone().lerp(frontL,e);
  if(LV.mode==='city'&&G.phase==='play')tp=camClamp(new V3(P.x,P.y+3,P.z),tp);
  if(G.phase==='title'){const c=new V3(P.x,P.y,P.z),sw=Math.sin(G.t*.35);tp=c.clone().add(new V3(9+sw*2.2,3.6+sw*.4,4.5));tl=c.clone().add(new V3(innerWidth>900?-2.2:0,2.5,innerWidth>900?4.4:0))}
  if(G.phase==='caught'){const sw=Math.sin(G.t*.8);tp=new V3(E.x-9+sw*2,8,E.z-42);tl=new V3(E.x-12,11.5,E.z)}
  if(G.phase==='win'){const c=new V3(P.x,P.y,P.z),sw=Math.sin(G.t*.5);tp=c.clone().add(new V3(-12+sw*2,3.4,3.5));tl=new V3(P.x+8,5.2,P.z-1)}
  const k=1-Math.exp(-dt*(G.phase==='title'||G.phase==='win'?2:6));camPos.lerp(tp,k);camLook.lerp(tl,k);
  G.shake=Math.max(0,G.shake-dt*1.6);
  cam.position.copy(camPos);if(G.shake>0){cam.position.x+=(Math.random()-.5)*G.shake*.6;cam.position.y+=(Math.random()-.5)*G.shake*.6}
  cam.lookAt(camLook);cam.fov=G.phase==='caught'?56:60+Math.min(14,(P.speed-4)*1.3)+(P.boost>0?4:0);cam.updateProjectionMatrix();
  // Licht folgt
  sun.position.set(P.x-40,16,P.z+30);sun.target.position.set(P.x,1.3,P.z);sky.position.copy(cam.position);
}
function render(){if(G.pix)comp.render();else r.render(sc,cam)}

/* ---------- Rivalen: andere Skater, die nerven und schubsen ---------- */
const RIV={list:[],enabled:true,lastSay:-99,said:0,N:3,hitSaid:false};
const RIV_SKINS=['#e5383b','#9be12c','#4cc3ff','#2a2733','#ff8a2a','#8e5bd6'];
const RIV_FIRST='Ein anderer Skater schubst dich. Er nennt das Begrüßung. Tipp: Spring drüber.';
const RIV_LINES=['Schon wieder. Er ist sehr anhänglich.','Das war vermutlich Absicht.','Er hat keine Manieren, aber ein gutes Board.','Schubsen ist hier Volkssport.'];
function buildRivals(){if(RIV.list.length)return;
  for(let i=0;i<RIV.N;i++){let skin=RIV_SKINS[(i*2+1)%6];if(skin===P.preset)skin=RIV_SKINS[(i*2+2)%6];
    const av=skater(0,1.3,-8,Math.PI/2,skin,1.35);dynOf(av);addOutlines(av,'actor');av.visible=false;
    const bl=mkBlob(3.4,3.8);bl.visible=false;
    RIV.list.push({av,bl,x:0,z:-8,vz:0,vb:5.4+i*.9,ph:i*2.1,cd:0,push:0,skin})}}
function placeRivals(){if(!RIV.list.length)return;RIV.list.forEach((r,i)=>{r.x=P.x+30+i*28+Math.random()*10;r.z=-5-Math.random()*5;r.vz=0;r.cd=1;r.push=0;r.hit=0;r.away=0;r.av.rotation.set(0,Math.PI/2,0);r.av.visible=true;r.bl.visible=true})}
function hideRivals(){RIV.list.forEach(r=>{r.av.visible=false;r.bl.visible=false})}
function stepRivals(dt){
  if(!RIV.enabled||!RIV.list.length)return;const t=G.t;
  RIV.list.forEach((r,i)=>{
    if(r.away>0){r.away-=dt;if(r.away<=0){r.x=P.x+55+Math.random()*45;r.z=-5-Math.random()*5;r.vz=0;r.cd=1;r.push=0;r.hit=0;r.av.visible=true;r.bl.visible=true;r.av.rotation.set(0,Math.PI/2,0)}return}
    if(r.hit>0){r.hit-=dt;r.kv.y-=26*dt;r.x+=r.kv.x*dt;r.z+=r.kv.z*dt;r.ky+=r.kv.y*dt;r.av.position.set(r.x,Math.max(1.3,r.ky),r.z);r.av.rotation.x+=dt*9;r.av.rotation.z+=dt*6;r.bl.visible=false;
      if(r.hit<=0){r.av.visible=false;r.away=2.6}return}
    r.cd=Math.max(0,r.cd-dt);
    const dx=r.x-P.x;let tz=-8+Math.sin(t*.7+r.ph)*3.4;
    if(dx>-30&&dx<18)tz=tz*.35+P.z*.65;
    r.vz+=((tz-r.z)*1.6-r.vz)*Math.min(1,dt*3);
    r.x+=(r.vb+Math.sin(t*.5+r.ph)*.6)*dt;
    r.z+=(Math.max(-5,Math.min(5,r.vz))+r.push)*dt;r.push*=Math.max(0,1-dt*5);
    r.z=Math.max(ZMIN,Math.min(ZMAX,r.z));
    if(r.x-P.x<-45||r.x-P.x>150){r.x=P.x+55+Math.random()*50;r.z=-5-Math.random()*5;r.cd=1;r.vz=0}
    const dz=P.z-r.z,adx=r.x-P.x;
    if(r.cd<=0&&Math.abs(adx)<2.8&&Math.abs(dz)<2.3&&P.y<2.6){
      const dir=dz>=0?1:-1;P.push=dir*11;P.speed*=.72;r.push=-dir*7;r.cd=2.2;SFX.thud();G.shake=Math.max(G.shake,.4);toast('Schubs!',700);burst(P.x,P.y+1.5,P.z,12);
      if(G.t-RIV.lastSay>9){RIV.lastSay=G.t;say('e',RIV.said++===0?RIV_FIRST:RIV_LINES[Math.floor(Math.random()*RIV_LINES.length)],3.2)}}
    const hd=Math.atan2(r.vz+r.push*.3,r.vb),av=r.av;
    const gp=gapAt(r.x);av.position.set(r.x,1.3+(gp?Math.sin(Math.PI*gp.u)*2.4:0),r.z);av.rotation.y=Math.PI/2-hd;
    const u=av.userData;if(u.tz)u.tz.rotation.x=.3;
    if(u.arms)u.arms.forEach(({sg,s})=>{sg.rotation.z=s*(1.1+.45*Math.sin(t*9+i*1.7+(s>0?0:2)))});
    r.bl.position.set(r.x,1.34,r.z)})}

/* ================= Level-Daten ================= */
const LEVELS={
 1:{id:1,boss:'Goldzilla',bossColor:'#f0cf36',bossSpeed:6.4,grav:22,goal:'Portal',
  quest:'Sammle die Eiskugeln',goalQuest:'Erreiche das Portal',
  intro:'Du stehst auf einem Skateboard. Das war vermutlich eine gute Entscheidung.',
  vendor:'Hilfe! Meine fünf Eiskugeln sind die Straße runtergerollt. Holst du sie zurück? Gas gibst du mit W.',
  lines:['Eine Eiskugel. Noch kalt, schon klebrig.','Zwei. Der Verkäufer wird dich lieben.','Drei. Irgendwo hinter dir wird es verdächtig still.','Vier. Der Boden summt leise.','Fünf! Und der Boden vibriert jetzt eher unfreundlich.'],
  chase:'Das Meer teilt sich. Ein riesiges, aufblasbares, goldenes Etwas hat Eis gerochen.',
  eat:'Du wurdest in ein Eis verwandelt. Goldzilla hatte ohnehin Hunger.',
  win:'Das Portal schluckt dich. Hinter dir kaut Goldzilla an einer Palme und denkt über sein Leben nach.',
  winSub:'Die Eiskugeln sind zurück, Goldzilla hat Hunger und das Portal ist offen.',badge:'Erfolg: Eisjäger:in.'},
 2:{id:2,boss:'Galaxzilla',bossColor:'#8e5bd6',bossSpeed:7.0,grav:14,goal:'Eiswagen',
  quest:'Sammle die Galaxie-Eiskugeln',goalQuest:'Erreiche den Eiswagen',
  intro:'Du bist durch das Portal gefallen. Hier gibt es keine Straße, nur einen Regenbogen. Immerhin ist er gut befahrbar.',
  vendor:'Hier Eiswagen! Ich stehe am Ende des Regenbogens. Meine fünf Galaxie-Eiskugeln sind ins Weltall gerollt. Holst du sie?',
  lines:['Galaxie-Eis. Es funkelt und ist vermutlich essbar.','Zwei. Eine kleine Galaxie schmilzt dir über die Hand.','Drei. Irgendwo hinter dir wird es sehr dunkel und sehr hungrig.','Vier. Die Sterne zittern.','Fünf! Und das Weltall rülpst.'],
  chase:'Ein Nebel teilt sich. Etwas Lilanes, Aufblasbares hat Galaxie-Eis gerochen.',
  eat:'Du wurdest in Galaxie-Eis verwandelt. Galaxzilla hatte ohnehin Hunger.',
  win:'Der Eiswagen hupt. Hinter dir kaut Galaxzilla an einem Planeten und denkt über sein Leben nach.',
  winSub:'Der Eiswagen hat sein Galaxie-Eis wieder. Galaxzilla bekommt auch eine Kugel.',badge:'Erfolg: Galaxie-Eisjäger:in.'}};
let LV=LEVELS[1];

/* ================= Welt 2: Eis-Galaxie ================= */
function galaxyTex(seed,hue){const w=256,h=128,c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d');const R=mulberry(seed*17+3);
  const bg=g.createLinearGradient(0,0,0,h);bg.addColorStop(0,'#150a3a');bg.addColorStop(.5,'#2b1466');bg.addColorStop(1,'#120a30');g.fillStyle=bg;g.fillRect(0,0,w,h);
  const cols=['255,95,168','76,195,255','142,91,214','255,154,61'];
  for(let i=0;i<14;i++){const x=R()*w,y=h*(.15+R()*.7),r=18+R()*36,cc=cols[(i+hue)%4];
    for(const dx of [-w,0,w]){const gr=g.createRadialGradient(x+dx,y,0,x+dx,y,r);gr.addColorStop(0,`rgba(${cc},.75)`);gr.addColorStop(1,`rgba(${cc},0)`);g.fillStyle=gr;g.beginPath();g.arc(x+dx,y,r,0,7);g.fill()}}
  g.lineWidth=5;for(let a=0;a<3;a++){g.strokeStyle=`rgba(255,255,255,${.12+a*.05})`;g.beginPath();for(let t=0;t<40;t++){const ang=t*.35+a*2.1,rr=t*1.6,px=w*.5+Math.cos(ang)*rr*1.6,py=h*.5+Math.sin(ang)*rr*.55;t?g.lineTo(px,py):g.moveTo(px,py)}g.stroke()}
  for(let i=0;i<230;i++){const x=R()*w,y=R()*h,s=R()<.08?2.2:R()<.3?1.3:.8;g.fillStyle=`rgba(255,255,255,${.4+R()*.6})`;g.fillRect(x,y,s,s)}
  const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t}
const galMat=(seed,hue)=>{const t=galaxyTex(seed,hue);return new THREE.MeshStandardMaterial({map:t,emissive:'#ffffff',emissiveMap:t,emissiveIntensity:.55,roughness:.4})};
function waffleTex(){const c=document.createElement('canvas');c.width=c.height=64;const g=c.getContext('2d');g.fillStyle='#e0b070';g.fillRect(0,0,64,64);g.strokeStyle='#b07a3a';g.lineWidth=3;for(let i=-64;i<128;i+=16){g.beginPath();g.moveTo(i,0);g.lineTo(i+64,64);g.stroke();g.beginPath();g.moveTo(i+64,0);g.lineTo(i,64);g.stroke()}const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(4,3);return t}
function glowTex(col){const c=document.createElement('canvas');c.width=c.height=128;const g=c.getContext('2d'),gr=g.createRadialGradient(64,64,0,64,64,64);gr.addColorStop(0,`rgba(${col},.9)`);gr.addColorStop(.5,`rgba(${col},.3)`);gr.addColorStop(1,`rgba(${col},0)`);g.fillStyle=gr;g.fillRect(0,0,128,128);return new THREE.CanvasTexture(c)}

let W2=null,L1ITEMS=[],SC1,CN1,K1,PK1,CL1;
const L2={scoops:[],cones:[],kickers:[],clappers:[],sky:null};
function buildLevel2(){
  if(W2)return;W2=new THREE.Group();W2.userData.noBake=true;W2.visible=false;sc.add(W2);
  const R=mulberry(2024),Wd=o=>{W2.add(o);return o};
  /* Regenbogen-Straße */
  const rt=document.createElement('canvas');rt.width=4;rt.height=7*32;const rg=rt.getContext('2d');
  ['#ff5fa8','#ff9a3d','#ffe066','#7be0a0','#4cc3ff','#8e5bd6','#ff5fa8'].forEach((c,i)=>{rg.fillStyle=c;rg.fillRect(0,i*32,4,32)});
  const rtex=new THREE.CanvasTexture(rt);rtex.colorSpace=THREE.SRGBColorSpace;rtex.magFilter=THREE.NearestFilter;rtex.minFilter=THREE.LinearFilter;rtex.generateMipmaps=false;
  const road=new THREE.Mesh(new THREE.PlaneGeometry(300,10),new THREE.MeshStandardMaterial({map:rtex,emissive:'#ffffff',emissiveMap:rtex,emissiveIntensity:.45,roughness:.6}));
  road.rotation.x=-Math.PI/2;road.position.set(0,1.305,-8);road.receiveShadow=true;Wd(road);
  const under=new THREE.Mesh(new THREE.BoxGeometry(300,.8,10.6),new THREE.MeshStandardMaterial({color:'#241046',roughness:.8}));under.position.set(0,.8,-8);Wd(under);
  [-2.7,-13.3].forEach(z=>{const rl=new THREE.Mesh(new THREE.BoxGeometry(300,.5,.6),new THREE.MeshStandardMaterial({color:'#ff5fa8',emissive:'#ff5fa8',emissiveIntensity:.8}));rl.position.set(0,1.55,z);Wd(rl)});
  {const dm=new THREE.InstancedMesh(new THREE.BoxGeometry(3,.04,.35),new THREE.MeshStandardMaterial({color:'#ffffff',emissive:'#ffffff',emissiveIntensity:.6}),36),m4=new THREE.Matrix4();
   for(let i=0;i<36;i++){m4.makeTranslation(-140+i*8,1.33,-8);dm.setMatrixAt(i,m4)}Wd(dm)}
  /* schwebende Brocken unter der Straße */
  {const rk=new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1,0),new THREE.MeshStandardMaterial({color:'#5a3f9a',flatShading:true,roughness:.9}),14),m4=new THREE.Matrix4(),q=new THREE.Quaternion(),e=new THREE.Euler(),sv=new THREE.Vector3();
   for(let i=0;i<14;i++){const s=3+R()*6;e.set(R()*3,R()*3,R()*3);q.setFromEuler(e);sv.set(s,s*.8,s);m4.compose(new V3(-150+R()*300,-3-R()*12,-8+(R()-.5)*14),q,sv);rk.setMatrixAt(i,m4)}Wd(rk)}
  /* Himmel: Sterne und Nebel, folgt der Kamera */
  const skyG=new THREE.Group();Wd(skyG);L2.sky=skyG;
  {const N=2200,pos=new Float32Array(N*3);for(let i=0;i<N;i++){const a=R()*6.283,b=Math.acos(2*R()-1),r=340;pos[i*3]=Math.sin(b)*Math.cos(a)*r;pos[i*3+1]=Math.cos(b)*r;pos[i*3+2]=Math.sin(b)*Math.sin(a)*r}
   const gm=new THREE.BufferGeometry();gm.setAttribute('position',new THREE.BufferAttribute(pos,3));
   const pts=new THREE.Points(gm,new THREE.PointsMaterial({size:2.4,sizeAttenuation:false,color:'#ffffff',fog:false,transparent:true,opacity:.9,depthWrite:false}));pts.frustumCulled=false;skyG.add(pts)}
  [['142,91,214',0,.35],['255,95,168',1.6,.5],['76,195,255',3.1,.3],['255,154,61',4.4,.45],['142,91,214',5.4,.55],['255,95,168',2.4,.2]].forEach(([col,az,el],i)=>{
    const s=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex(col),transparent:true,opacity:.6,depthWrite:false,fog:false,blending:THREE.AdditiveBlending}));
    s.scale.set(300+R()*120,200+R()*100,1);s.position.set(Math.cos(az)*Math.cos(el)*330,Math.sin(el)*330,Math.sin(az)*Math.cos(el)*330);skyG.add(s)});
  /* Riesen-Galaxie-Eis in der Ferne */
  const waf=waffleTex();
  function giantCone(x,y,z,s,seed,hue,tilt){const g=new THREE.Group(),r=12*s,h=28*s;
    const cn=new THREE.Mesh(new THREE.ConeGeometry(r*.95,h,20),new THREE.MeshStandardMaterial({map:waf,roughness:.8,emissive:'#7a5020',emissiveIntensity:.25}));cn.rotation.x=Math.PI;cn.position.y=h/2;g.add(cn);
    const sp=new THREE.Mesh(new THREE.SphereGeometry(r,28,20),galMat(seed,hue));sp.position.y=h+r*.2;g.add(sp);
    const sk=new THREE.Mesh(new THREE.TorusGeometry(r*.92,r*.16,10,30),new THREE.MeshStandardMaterial({color:'#f9d3e4',roughness:.5,emissive:'#f1a7c8',emissiveIntensity:.3}));sk.rotation.x=Math.PI/2;sk.position.y=h-r*.05;g.add(sk);
    g.position.set(x,y,z);g.rotation.z=tilt;g.userData.bob=R()*6;Wd(g);return g}
  L2.cones=[];const GC=[giantCone(-95,52,-215,2.2,1,0,.25),giantCone(75,78,-270,2.8,2,1,-.2),giantCone(185,40,-115,1.7,3,2,.35),giantCone(-185,50,140,2.4,4,3,-.3),giantCone(25,70,235,2.6,5,1,.18)];L2.giant=GC;
  {const g=new THREE.Group();const pl=new THREE.Mesh(new THREE.SphereGeometry(20,28,20),galMat(8,2));g.add(pl);const rn=new THREE.Mesh(new THREE.TorusGeometry(33,3,8,56),new THREE.MeshStandardMaterial({color:'#8fe0c8',emissive:'#47c2a5',emissiveIntensity:.5,roughness:.5}));rn.scale.set(1,1,.22);rn.rotation.x=Math.PI/2.3;g.add(rn);g.position.set(-35,48,-175);Wd(g)}
  /* Kristalle und Lollipop-Laternen */
  {const N=46,cr=new THREE.InstancedMesh(new THREE.OctahedronGeometry(1),new THREE.MeshBasicMaterial({color:'#ffffff'}),N),m4=new THREE.Matrix4(),q=new THREE.Quaternion(),e=new THREE.Euler(),sv=new THREE.Vector3(),cc=['#8fe0ff','#ff9fd0','#c9b8ff','#ffffff'].map(c=>new THREE.Color(c));
   for(let i=0;i<N;i++){const side=R()<.5?1:-1,s=.6+R()*1;e.set((R()-.5)*.5,R()*3,(R()-.5)*.5);q.setFromEuler(e);sv.set(1.2*s,3.6*s,1.2*s);m4.compose(new V3(-150+R()*300,3+R()*52,-8+side*(14+R()*100)),q,sv);cr.setMatrixAt(i,m4);cr.setColorAt(i,cc[i%4])}Wd(cr)}
  {const N=28,st=new THREE.InstancedMesh(new THREE.CylinderGeometry(.12,.12,7,6),new THREE.MeshStandardMaterial({color:'#eae8e8',roughness:.5}),N),cn2=new THREE.InstancedMesh(new THREE.SphereGeometry(.95,12,10),new THREE.MeshBasicMaterial({color:'#ffffff'}),N),m4=new THREE.Matrix4(),cc=['#ff5fa8','#ffe066','#47c2a5','#4cc3ff','#c9b8ff'].map(c=>new THREE.Color(c));
   for(let i=0;i<N;i++){const x=-145+Math.floor(i/2)*21,z=i%2?-1.7:-14.3;m4.makeTranslation(x,4.8,z);st.setMatrixAt(i,m4);m4.makeTranslation(x,8.6,z);cn2.setMatrixAt(i,m4);cn2.setColorAt(i,cc[i%5])}Wd(st);Wd(cn2)}
  /* Zuschauer-Aliens auf schwebenden Plattformen */
  const SPH=new THREE.SphereGeometry(1,14,10),CYL=new THREE.CylinderGeometry(1,1,1,6),CAP=new THREE.CapsuleGeometry(.09,.5,4,8);
  const EYEW=new THREE.MeshStandardMaterial({color:'#ffffff',roughness:.3}),EYEB=new THREE.MeshStandardMaterial({color:'#141416'}),GLOWM=new THREE.MeshStandardMaterial({color:'#ffe066',emissive:'#ffe066',emissiveIntensity:.9});
  const ACOLS=['#47c2a5','#f1a7c8','#f6df73','#8e5bd6','#4cc3ff','#ff9a3d'];
  function alien(px,pz,face,k,col){const g=new THREE.Group();g.position.set(px,1.3,pz);g.rotation.y=face;g.scale.setScalar(k);
    const m=new THREE.MeshStandardMaterial({color:col,roughness:.5,emissive:col,emissiveIntensity:.14});
    const ad=(geo,mat,x,y,z,sx,sy,sz)=>{const q=new THREE.Mesh(geo,mat);q.position.set(x,y,z);q.scale.set(sx,sy,sz);q.castShadow=true;g.add(q);return q};
    ad(SPH,m,0,1.2,0,.85,1.05,.8);[-1,1].forEach(s=>{ad(SPH,EYEW,s*.3,1.55,.62,.22,.26,.1);ad(SPH,EYEB,s*.3,1.55,.7,.1,.12,.06)});
    ad(CYL,m,0,2.4,0,.05,.8,.05);ad(SPH,GLOWM,0,2.85,0,.15,.15,.15);Wd(g);
    const up=R()<.55,am=new THREE.MeshStandardMaterial({color:col,roughness:.5,emissive:col,emissiveIntensity:.14}),hm=new THREE.MeshStandardMaterial({color:col,roughness:.5});
    [-1,1].forEach(s=>{const Ag=new THREE.Group(),ox=s*.8*k;Ag.rotation.order='YXZ';Ag.position.set(px+ox*Math.cos(face),1.3+1.45*k,pz-ox*Math.sin(face));Ag.rotation.y=face;Ag.scale.setScalar(k);
      const a=new THREE.Mesh(CAP,am);a.position.y=-.36;a.castShadow=true;Ag.add(a);const h=new THREE.Mesh(SPH,hm);h.position.y=-.72;h.scale.setScalar(.12);Ag.add(h);
      const idle=up?s*2.5:s*.35;Ag.rotation.z=idle;Wd(Ag);L2.clappers.push({A:Ag,s,idle,x:px,face,ph:R()*6.28,up})})}
  [-124,-92,-60,-28,4,36,68,100,126].forEach((px,i)=>{const south=i%2===0,pz=south?2.5:-18.5,face=south?Math.PI:0;
    const pf=new THREE.Mesh(new THREE.CylinderGeometry(4.8,3.4,.7,18),new THREE.MeshStandardMaterial({color:'#3a2a66',roughness:.7}));pf.position.set(px,.95,pz);Wd(pf);
    const rm=new THREE.Mesh(new THREE.TorusGeometry(4.8,.13,6,28),new THREE.MeshStandardMaterial({color:'#ff5fa8',emissive:'#ff5fa8',emissiveIntensity:.9}));rm.rotation.x=Math.PI/2;rm.position.set(px,1.3,pz);Wd(rm);
    const fz=south?-.4:-15.6;[-2.2,0,2.2].forEach((dx,j)=>alien(px+dx,fz+(j===1?(south?1:-1)*.8:0),face+(R()-.5)*.3,1.1+R()*.25,ACOLS[(i+j)%6]))});
  /* Hindernisse: Eiswürfel */
  const cubeF=AW(function(x,z){const g=new THREE.Group();
    const a=new THREE.Mesh(new THREE.BoxGeometry(1.9,1.9,1.9),SM({color:'#aeeaff',roughness:.25,flatShading:true}));a.position.y=.95;a.rotation.y=.5;a.castShadow=true;g.add(a);
    const b=new THREE.Mesh(new THREE.BoxGeometry(1,1,1),SM({color:'#ffffff',roughness:.25,flatShading:true}));b.position.set(.2,2.1,.1);b.rotation.set(.3,.8,.2);b.castShadow=true;g.add(b);
    g.position.set(x,1.3,z);Wd(g);return g},'prop');
  [[-92,-6.5],[-90,-9.5],[-70,-11],[-62,-5.2],[-40,-7],[-36,-10.4],[-18,-5.6],[-14,-9],[10,-11],[16,-5.4],[30,-7.6],[44,-10.8],[50,-5],[66,-8.2],[80,-11.2],[84,-5.6],[96,-8.6],[104,-5],[110,-10.6],[118,-7.2]].forEach(([x,z])=>L2.cones.push({o:cubeF(x,z),x,z,hit:0,vx:0,vy:0,vz:0}));
  /* Galaxie-Eiskugeln zum Einsammeln */
  const galScoop=AW(function(x,z,seed){const g=new THREE.Group();
    const wf=new THREE.Mesh(new THREE.ConeGeometry(.9,2.2,10),new THREE.MeshStandardMaterial({map:waf,roughness:.8}));wf.rotation.x=Math.PI;wf.position.y=1.1;wf.castShadow=true;g.add(wf);
    const s1=new THREE.Mesh(new THREE.SphereGeometry(1.3,20,14),galMat(10+seed,seed));s1.position.y=2.9;s1.castShadow=true;g.add(s1);
    const s2=new THREE.Mesh(new THREE.SphereGeometry(.95,18,12),galMat(20+seed,seed+1));s2.position.y=4.1;s2.castShadow=true;g.add(s2);
    g.scale.setScalar(.9);g.position.set(x,3.0,z);Wd(g);
    const beam=new THREE.Mesh(new THREE.CylinderGeometry(1.1,1.1,34,16,1,true),BM('#9a7bff',{transparent:true,opacity:.22,side:THREE.DoubleSide,depthWrite:false,fog:false}));beam.position.set(x,18,z);beam.userData.noOutline=true;Wd(beam);
    const pad=new THREE.Mesh(new THREE.RingGeometry(1.9,2.6,28),BM('#7ff0ff',{transparent:true,opacity:.75,side:THREE.DoubleSide,depthWrite:false}));pad.rotation.x=-Math.PI/2;pad.position.set(x,1.4,z);pad.userData.noOutline=true;Wd(pad);
    return {g,beam,pad,x,z,got:false,t:Math.random()*6}},'actor');
  L2.scoops=[[-108,-9],[-84,-5.6],[-58,-9.8],[-30,-5.2],[-2,-8.6]].map(([x,z],i)=>galScoop(x,z,i));
  /* Rampen */
  L2.kickers=[[-100,-8],[-48,-9],[22,-6.4],[72,-9.6]];
  L2.kickers.forEach(([x,z])=>{const sh=new THREE.Shape();sh.moveTo(0,0);sh.lineTo(4.2,0);sh.lineTo(4.2,1.3);sh.closePath();const gm=new THREE.ExtrudeGeometry(sh,{depth:3.6,bevelEnabled:false});gm.translate(-2.1,0,-1.8);
    const m=new THREE.Mesh(gm,new THREE.MeshStandardMaterial({color:'#47c2a5',roughness:.6,flatShading:true,emissive:'#47c2a5',emissiveIntensity:.25}));m.position.set(x,1.3,z);m.castShadow=m.receiveShadow=true;Wd(m);
    const st=new THREE.Mesh(new THREE.BoxGeometry(.5,.06,3.62),new THREE.MeshStandardMaterial({color:'#ff5fa8',emissive:'#ff5fa8',emissiveIntensity:.6}));st.position.set(x,1.4,z);Wd(st)});
  /* Ziel: Eiswagen mit Leuchtsäule */
  {const n0=sc.children.length;icevan(131,-8,-Math.PI/2,'#8fd6e4');const van=sc.children[sc.children.length-1];sc.remove(van);van.scale.setScalar(1.5);W2.add(van);L2.van=van;
   const bm=new THREE.Mesh(new THREE.CylinderGeometry(3.4,3.4,60,20,1,true),BM('#ff9fd0',{transparent:true,opacity:.2,side:THREE.DoubleSide,depthWrite:false,fog:false}));bm.position.set(131,30,-8);bm.userData.noOutline=true;Wd(bm);L2.vanBeam=bm}
  L2.scoops.forEach(s=>addOutlines(s.g,'actor'));L2.cones.forEach(c=>addOutlines(c.o,'prop'));addOutlines(L2.van,'prop');
  addOutlines(W2,'stage');
}
function stepLevel2(dt){if(!W2||!W2.visible)return;L2.sky.position.copy(cam.position);const t=G.t;
  L2.giant.forEach((g,i)=>{g.position.y+=Math.sin(t*.35+g.userData.bob)*.02;g.rotation.y+=dt*.04});
  if(L2.vanBeam)L2.vanBeam.material.opacity=.16+.07*Math.sin(t*3)}

/* ================= Level wechseln ================= */
let SC_INIT=false;
function applyLevel(n){
  LV=LEVELS[n];
  if(!SC_INIT){const KEEP=new Set([P.av,blobP,flyBoard,iceTower,cfPts,sky]);
    SC1=scoops;CN1=cones;K1=KICKERS;PK1=PARKED;CL1=CLAPPERS;L1ITEMS=sc.children.filter(o=>!o.isLight&&!KEEP.has(o)&&o!==sun.target);SC_INIT=true}
  if(n===0)buildLevel0();if(n===2)buildLevel2();if(n===3)buildLevel3();
  L1ITEMS.forEach(o=>o.visible=n===1);if(W2)W2.visible=n===2;if(W3)W3.visible=n===3;if(W0)W0.visible=n===0;
  const EV={0:{h:['#ffd9f0','#7a5aa0',1],s:['#ffb870',2.3],f:['#8e7bff',1.0],a:'#3a2a8a',b:'#ff9a78'},1:{h:['#ffffff','#e8a6c8',1],s:['#ffd9a0',2.6],f:['#ff9fd0',1.1],a:'#0f86d6',b:'#f7d3e4'},2:{h:['#b8a8ff','#ff7cc4',.95],s:['#ffe0f5',2.0],f:['#4cc3ff',1.3],a:'#060214',b:'#5a2480'},3:{h:['#7a86ff','#3a1a6a',.85],s:['#b8c8ff',1.5],f:['#ff5fa8',1.5],a:'#02000c',b:'#2a0f55'}}[n];
  hemi.color.set(EV.h[0]);hemi.groundColor.set(EV.h[1]);hemi.intensity=EV.h[2];sun.color.set(EV.s[0]);sun.intensity=EV.s[1];fill.color.set(EV.f[0]);fill.intensity=EV.f[1];
  sky.material.uniforms.a.value.set(EV.a);sky.material.uniforms.b.value.set(EV.b);
  sc.fog=n===0?new THREE.Fog('#d98aa8',130,480):n===1?FOG1:n===2?new THREE.Fog('#3a1660',300,900):new THREE.Fog('#1a0a3a',170,640);
  const arr={0:[[],HUB.cones,[],[],HUB.clappers,[]],1:[SC1,CN1,K1,PK1,CL1,[]],2:[L2.scoops,L2.cones,L2.kickers,[],L2.clappers,[]],3:[L3.scoops,L3.cones,L3.kickers,[],L3.clappers,L3.gaps]}[n];
  [scoops,cones,KICKERS,PARKED,CLAPPERS,GAPS]=arr;
  if(!iceTower.userData.m1){iceTower.userData.m1=[1,2,3].map(i=>iceTower.children[i].material);iceTower.userData.m2=[galMat(5,0),galMat(6,1),galMat(7,2)];
    iceTower.userData.m3=['#ff5fa8','#4cc3ff','#ffe066'].map(c=>new THREE.MeshStandardMaterial({color:c,emissive:c,emissiveIntensity:.6,roughness:.4}))}
  [1,2,3].forEach(i=>iceTower.children[i].material=iceTower.userData['m'+(n===0?1:n)][i-1]);
  const lbl=$('track').querySelector('.lbl');if(lbl)lbl.lastElementChild.textContent=LV.goal}

/* ================= Welt 3: Nacht-Stadt ================= */
LEVELS[3]={id:3,boss:'Neonzilla',bossColor:'#ff5fa8',bossSpeed:7.4,grav:15,goal:'Eiswagen',
  quest:'Sammle die Wunderkerzen-Eiskugeln',goalQuest:'Erreiche den Eiswagen',
  intro:'Du landest auf einem Hochhausdach. Unter dir leuchtet die ganze Stadt. Vor dir wartet die erste Lücke.',
  vendor:'Hier Eiswagen! Ich stehe auf dem höchsten Dach. Meine fünf Wunderkerzen-Eiskugeln sind zwischen die Neonschilder gerollt. Holst du sie?',
  lines:['Wunderkerzen-Eis. Es knistert und ist vermutlich essbar.','Zwei. Die Stadt funkelt neidisch.','Drei. Irgendwo hinter dir wird etwas sehr Lautes sehr hungrig.','Vier. Das Dach vibriert im Takt.','Fünf! Und über dir explodiert etwas Buntes.'],
  chase:'Die Stadt hält den Atem an. Etwas Pinkes, Aufblasbares hat Wunderkerzen-Eis gerochen.',
  eat:'Du wurdest in Wunderkerzen-Eis verwandelt. Neonzilla hatte ohnehin Hunger.',
  win:'Der Eiswagen hupt auf dem höchsten Dach. Hinter dir kaut Neonzilla an einem Neonschild und denkt über sein Leben nach.',
  winSub:'Das Wunderkerzen-Eis ist gerettet. Neonzilla bekommt auch eine Kugel, und das Feuerwerk ist für dich.',badge:'Erfolg: Dachläufer:in.'};

function winTex(seed){const c=document.createElement('canvas');c.width=64;c.height=64;const g=c.getContext('2d'),R=mulberry(seed*7+1);g.fillStyle='#1b1038';g.fillRect(0,0,64,64);
  for(let y=0;y<4;y++)for(let x=0;x<4;x++){const lit=R()<.55;g.fillStyle=lit?['#ffe9a0','#ff9fd0','#9fe8ff'][Math.floor(R()*3)]:'#2a1a50';g.fillRect(x*16+3,y*16+4,10,8)}
  const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.wrapS=t.wrapT=THREE.RepeatWrapping;t.magFilter=THREE.NearestFilter;return t}
function signTex(txt,col,sub){const c=document.createElement('canvas');c.width=256;c.height=512;const g=c.getContext('2d');g.fillStyle='rgba(10,4,30,.92)';g.fillRect(0,0,256,512);
  g.strokeStyle=col;g.lineWidth=10;g.shadowColor=col;g.shadowBlur=26;g.strokeRect(14,14,228,484);
  g.fillStyle='#ffffff';g.textAlign='center';g.textBaseline='middle';g.shadowBlur=28;g.shadowColor=col;
  const parts=txt.split('|');const fs=parts.length>1?92:(txt.length>5?64:110);g.font=`800 ${fs}px "Baloo 2","Trebuchet MS",sans-serif`;
  parts.forEach((p,i)=>g.fillText(p,128,256+(i-(parts.length-1)/2)*fs*1.05));
  if(sub){g.font='700 34px "Baloo 2",sans-serif';g.fillStyle=col;g.fillText(sub,128,462)}
  const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t}
function gridTex(){const c=document.createElement('canvas');c.width=c.height=256;const g=c.getContext('2d'),R=mulberry(99);g.fillStyle='#0a0420';g.fillRect(0,0,256,256);
  g.strokeStyle='#ff5fa8';g.globalAlpha=.55;g.lineWidth=3;[0,128].forEach(v=>{g.beginPath();g.moveTo(v,0);g.lineTo(v,256);g.stroke();g.beginPath();g.moveTo(0,v);g.lineTo(256,v);g.stroke()});g.globalAlpha=1;
  for(let i=0;i<260;i++){g.fillStyle=['#ffe066','#9fe8ff','#ff9fd0','#ffffff'][i%4];g.fillRect(R()*256,R()*256,2,2)}
  const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(36,36);return t}

let W3=null;
const L3={scoops:[],cones:[],kickers:[],clappers:[],gaps:[],roofs:[],sky:null,beacons:[]};
const FWK={n:1100,pos:new Float32Array(1100*3),vel:new Float32Array(1100*3),col:new Float32Array(1100*3),base:new Float32Array(1100*3),life:new Float32Array(1100),max:new Float32Array(1100),i:0,t:1};
function fwBurst(x,y,z,hex,n=90){const c=new THREE.Color(hex),c2=new THREE.Color().setHSL((Math.random()),.9,.65);
  for(let k=0;k<n;k++){const i=FWK.i=(FWK.i+1)%FWK.n,a=Math.random()*6.283,b=Math.acos(2*Math.random()-1),sp=16+Math.random()*16;
    FWK.pos[i*3]=x;FWK.pos[i*3+1]=y;FWK.pos[i*3+2]=z;FWK.vel[i*3]=Math.sin(b)*Math.cos(a)*sp;FWK.vel[i*3+1]=Math.cos(b)*sp;FWK.vel[i*3+2]=Math.sin(b)*Math.sin(a)*sp;
    const cc=k%3===0?c2:c;FWK.base[i*3]=cc.r;FWK.base[i*3+1]=cc.g;FWK.base[i*3+2]=cc.b;FWK.life[i]=FWK.max[i]=1.6+Math.random()*1.1}}
const FWC=['#ff5fa8','#ffe066','#4cc3ff','#7be0a0','#ff9a3d','#c9b8ff','#ffffff'];
function stepFireworks(dt){if(!W3||!W3.visible)return;
  FWK.t-=dt;if(FWK.t<=0){FWK.t=.55+Math.random()*.8;const dx=Math.sign(camLook.x-cam.position.x)||1;
    fwBurst(cam.position.x+dx*(80+Math.random()*130),55+Math.random()*60,-8+(Math.random()-.5)*150,FWC[Math.floor(Math.random()*FWC.length)])}
  for(let i=0;i<FWK.n;i++){if(FWK.life[i]<=0){FWK.col[i*3]=FWK.col[i*3+1]=FWK.col[i*3+2]=0;continue}
    FWK.life[i]-=dt;FWK.vel[i*3+1]-=11*dt;FWK.vel[i*3]*=1-dt*.9;FWK.vel[i*3+2]*=1-dt*.9;FWK.vel[i*3+1]*=1-dt*.5;
    FWK.pos[i*3]+=FWK.vel[i*3]*dt;FWK.pos[i*3+1]+=FWK.vel[i*3+1]*dt;FWK.pos[i*3+2]+=FWK.vel[i*3+2]*dt;
    const f=Math.max(0,FWK.life[i]/FWK.max[i]);FWK.col[i*3]=FWK.base[i*3]*f;FWK.col[i*3+1]=FWK.base[i*3+1]*f;FWK.col[i*3+2]=FWK.base[i*3+2]*f}
  L3.fw.geometry.attributes.position.needsUpdate=true;L3.fw.geometry.attributes.color.needsUpdate=true}

function buildLevel3(){
  if(W3)return;W3=new THREE.Group();W3.userData.noBake=true;W3.visible=false;sc.add(W3);
  const R=mulberry(3033),Wd=o=>{W3.add(o);return o};
  /* Stadtboden tief unten */
  const gt=gridTex();const city=new THREE.Mesh(new THREE.PlaneGeometry(1500,1500),new THREE.MeshBasicMaterial({map:gt}));city.rotation.x=-Math.PI/2;city.position.set(0,-75,-8);Wd(city);
  /* Dächer mit Lücken */
  const ROOFS=[[-152,-118],[-114.6,-80],[-76.6,-42],[-38.6,-2],[1.4,34],[37.4,72],[75.4,108],[111.4,150]];
  L3.roofs=ROOFS;L3.gaps=ROOFS.slice(0,-1).map((r,i)=>[r[1]+.4,ROOFS[i+1][0]-.4]);
  const neonC=['#ff5fa8','#4cc3ff','#ffe066','#7be0a0'];
  ROOFS.forEach(([x0,x1],i)=>{const w=x1-x0,cx=(x0+x1)/2,H=76,d=16;
    const ts=winTex(i+1),tf=winTex(i+11);ts.repeat.set(d/8,H/8);tf.repeat.set(w/8,H/8);
    const mS=new THREE.MeshBasicMaterial({map:ts}),mF=new THREE.MeshBasicMaterial({map:tf}),mT=new THREE.MeshStandardMaterial({color:'#2e2050',roughness:.9}),mB=new THREE.MeshBasicMaterial({color:'#0a0420'});
    const b=new THREE.Mesh(new THREE.BoxGeometry(w,H,d),[mS,mS,mT,mB,mF,mF]);b.position.set(cx,1.3-H/2,-8);b.receiveShadow=true;Wd(b);
    [-.45,-15.55].forEach((z,k)=>{const st=new THREE.Mesh(new THREE.BoxGeometry(w-1,.22,.32),new THREE.MeshStandardMaterial({color:neonC[(i+k)%4],emissive:neonC[(i+k)%4],emissiveIntensity:1}));st.position.set(cx,1.42,z);Wd(st)});
    [x0+.35,x1-.35].forEach(x=>{const hz=new THREE.Mesh(new THREE.BoxGeometry(.5,.1,14.6),new THREE.MeshStandardMaterial({color:'#ffd23a',emissive:'#ffd23a',emissiveIntensity:.7}));hz.position.set(x,1.34,-8);Wd(hz)});
    for(let k=0;k<5;k++){const sx=1+R()*3,sz=1+R()*2,north=R()<.5,u=new THREE.Mesh(new THREE.BoxGeometry(sx,1.2+R()*1.4,sz),new THREE.MeshStandardMaterial({color:['#5a4a8a','#7a5aa0','#4a3a78'][k%3],roughness:.8}));u.position.set(x0+4+R()*(w-8),1.9,north?-14.4:-1.6);u.castShadow=true;Wd(u)}
  });
  /* Ferne Türme */
  {const base=winTex(40),tints=['#ffffff','#ffd0e8','#c8f6ff','#e0d0ff'];
   for(let i=0;i<34;i++){const w=14+R()*16,dd=14+R()*12,h=70+R()*110,north=R()<.55,z=north?-45-R()*70:32+R()*50,x=-190+R()*380;
     const t1=base.clone();t1.needsUpdate=true;t1.repeat.set(w/8,h/8);const t2=base.clone();t2.needsUpdate=true;t2.repeat.set(dd/8,h/8);
     const m1=new THREE.MeshBasicMaterial({map:t1,color:tints[i%4]}),m2=new THREE.MeshBasicMaterial({map:t2,color:tints[i%4]}),mt=new THREE.MeshBasicMaterial({color:'#1a0f38'});
     const tw=new THREE.Mesh(new THREE.BoxGeometry(w,h,dd),[m2,m2,mt,mt,m1,m1]);tw.position.set(x,-75+h/2,z);Wd(tw);
     const ns=new THREE.Mesh(new THREE.BoxGeometry(w+.6,.8,dd+.6),new THREE.MeshBasicMaterial({color:neonC[i%4]}));ns.position.set(x,-75+h+.4,z);Wd(ns);
     const an=new THREE.Mesh(new THREE.CylinderGeometry(.15,.15,10,5),new THREE.MeshBasicMaterial({color:'#ffffff'}));an.position.set(x,-75+h+5.5,z);Wd(an);
     const bl=new THREE.Mesh(new THREE.SphereGeometry(.7,8,6),new THREE.MeshBasicMaterial({color:'#ff2a4a'}));bl.position.set(x,-75+h+10.5,z);bl.userData.blink=R()*6;Wd(bl);L3.beacons.push(bl)}}
  /* Neon-Schilder */
  const SIGN=[['ICE','#ff5fa8','CREAM'],['SKATE','#4cc3ff',''],['アイス','#ffe066','24H'],['POP|ICE','#7be0a0',''],['DISCO','#ff9a3d',''],['GELATO','#c9b8ff',''],['24H','#ff5fa8','OPEN'],['NEON|CITY','#4cc3ff','']];
  for(let i=0;i<14;i++){const s=SIGN[i%SIGN.length],north=i%2===0,x=-146+i*21+R()*6,z=north?-18.2:2.2,y=9+R()*7;
    const tx=signTex(s[0],s[1],s[2]),g=new THREE.Group();
    const back=new THREE.Mesh(new THREE.BoxGeometry(5.2,9.6,.4),new THREE.MeshStandardMaterial({color:'#120a2a',roughness:.8}));g.add(back);
    const face=new THREE.Mesh(new THREE.PlaneGeometry(5,9.4),new THREE.MeshBasicMaterial({map:tx,side:THREE.DoubleSide}));face.position.z=.22;g.add(face);
    const f2=face.clone();f2.rotation.y=Math.PI;f2.position.z=-.22;g.add(f2);
    const glow=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex(s[1].replace('#','').match(/../g).map(h=>parseInt(h,16)).join(',')),transparent:true,opacity:.55,depthWrite:false,blending:THREE.AdditiveBlending,fog:false}));glow.scale.set(15,20,1);g.add(glow);
    const pole=new THREE.Mesh(new THREE.CylinderGeometry(.18,.18,y,6),new THREE.MeshStandardMaterial({color:'#3a2a66'}));pole.position.set(0,-y/2-4.8,0);g.add(pole);
    g.position.set(x,y,z);g.rotation.y=-Math.PI/2+(north?.5:-.5);Wd(g)}
  /* Himmel: Sterne, Mond, folgt der Kamera */
  const skyG=new THREE.Group();Wd(skyG);L3.sky=skyG;
  {const N=1500,pos=new Float32Array(N*3);for(let i=0;i<N;i++){const a=R()*6.283,b=Math.acos(R()*.9+.1),r=340;pos[i*3]=Math.sin(b)*Math.cos(a)*r;pos[i*3+1]=Math.cos(b)*r;pos[i*3+2]=Math.sin(b)*Math.sin(a)*r}
   const gm=new THREE.BufferGeometry();gm.setAttribute('position',new THREE.BufferAttribute(pos,3));const pts=new THREE.Points(gm,new THREE.PointsMaterial({size:2,sizeAttenuation:false,color:'#ffffff',fog:false,transparent:true,opacity:.85,depthWrite:false}));pts.frustumCulled=false;skyG.add(pts)}
  {const mc=document.createElement('canvas');mc.width=mc.height=128;const mg=mc.getContext('2d');mg.fillStyle='#fff3c8';mg.beginPath();mg.arc(64,64,58,0,7);mg.fill();mg.fillStyle='rgba(200,170,120,.45)';[[44,50,12],[78,76,16],[70,38,8],[48,86,9]].forEach(([x,y,r])=>{mg.beginPath();mg.arc(x,y,r,0,7);mg.fill()});
   const mt=new THREE.CanvasTexture(mc);mt.colorSpace=THREE.SRGBColorSpace;const moon=new THREE.Sprite(new THREE.SpriteMaterial({map:mt,fog:false,depthWrite:false}));moon.scale.set(70,70,1);moon.position.set(-120,170,-250);skyG.add(moon);
   const hl=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex('255,230,180'),transparent:true,opacity:.6,depthWrite:false,blending:THREE.AdditiveBlending,fog:false}));hl.scale.set(260,260,1);hl.position.copy(moon.position);skyG.add(hl)}
  /* Feuerwerk */
  {const gm=new THREE.BufferGeometry();gm.setAttribute('position',new THREE.BufferAttribute(FWK.pos,3));gm.setAttribute('color',new THREE.BufferAttribute(FWK.col,3));
   for(let i=0;i<FWK.n;i++)FWK.pos[i*3+1]=-300;
   const pts=new THREE.Points(gm,new THREE.PointsMaterial({size:4,sizeAttenuation:false,vertexColors:true,fog:false,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending}));pts.frustumCulled=false;Wd(pts);L3.fw=pts}
  /* Hindernisse: Lüfter-Boxen und Neon-Kisten */
  const crate=AW(function(x,z){const g=new THREE.Group(),col=neonC[Math.floor(R()*4)];
    const a=new THREE.Mesh(new THREE.BoxGeometry(1.9,1.9,1.9),SM({color:'#6a5a9a',roughness:.6,flatShading:true}));a.position.y=.95;a.rotation.y=.4;a.castShadow=true;g.add(a);
    const s=new THREE.Mesh(new THREE.BoxGeometry(2,.22,2),new THREE.MeshStandardMaterial({color:col,emissive:col,emissiveIntensity:1}));s.position.y=1.2;s.rotation.y=.4;g.add(s);
    g.position.set(x,1.3,z);Wd(g);return g},'prop');
  const CR=[[-136,-6.4],[-132,-10],[-100,-8],[-92,-5.2],[-62,-10.4],[-56,-6],[-24,-9],[-18,-5],[10,-6.6],[16,-10.6],[48,-8],[56,-4.8],[86,-10],[94,-6],[122,-5.4],[128,-10.4],[138,-8]].filter(([x])=>!L3.gaps.some(g=>x>g[0]-2&&x<g[1]+2));
  L3.cones=CR.map(([x,z])=>({o:crate(x,z),x,z,hit:0,vx:0,vy:0,vz:0}));
  /* Wunderkerzen-Eis */
  const WK=['#ff5fa8','#4cc3ff','#ffe066','#7be0a0','#c9b8ff'];
  const spark=AW(function(x,z,i){const g=new THREE.Group();
    const wf=new THREE.Mesh(new THREE.ConeGeometry(.9,2.2,10),new THREE.MeshStandardMaterial({map:waffleTex(),roughness:.8}));wf.rotation.x=Math.PI;wf.position.y=1.1;wf.castShadow=true;g.add(wf);
    const s1=new THREE.Mesh(new THREE.SphereGeometry(1.25,18,14),new THREE.MeshStandardMaterial({color:WK[i],emissive:WK[i],emissiveIntensity:.7,roughness:.4}));s1.position.y=2.8;s1.castShadow=true;g.add(s1);
    const s2=new THREE.Mesh(new THREE.SphereGeometry(.95,16,12),new THREE.MeshStandardMaterial({color:WK[(i+2)%5],emissive:WK[(i+2)%5],emissiveIntensity:.7,roughness:.4}));s2.position.y=4;g.add(s2);
    const st=new THREE.Mesh(new THREE.CylinderGeometry(.05,.05,2.4,5),new THREE.MeshStandardMaterial({color:'#cfcfe0'}));st.position.y=5.6;g.add(st);
    const sp=new THREE.Mesh(new THREE.OctahedronGeometry(.45),new THREE.MeshBasicMaterial({color:'#ffe9a0'}));sp.position.y=6.9;sp.userData.noOutline=true;g.add(sp);
    g.scale.setScalar(.9);g.position.set(x,3.0,z);Wd(g);
    const beam=new THREE.Mesh(new THREE.CylinderGeometry(1.1,1.1,34,16,1,true),BM('#ffe066',{transparent:true,opacity:.22,side:THREE.DoubleSide,depthWrite:false,fog:false}));beam.position.set(x,18,z);beam.userData.noOutline=true;Wd(beam);
    const pad=new THREE.Mesh(new THREE.RingGeometry(1.9,2.6,28),BM('#7ff0ff',{transparent:true,opacity:.75,side:THREE.DoubleSide,depthWrite:false}));pad.rotation.x=-Math.PI/2;pad.position.set(x,1.4,z);pad.userData.noOutline=true;Wd(pad);
    return {g,beam,pad,x,z,got:false,t:Math.random()*6}},'actor');
  L3.scoops=[[-128,-8.6],[-96,-5.6],[-66,-9.6],[-30,-5.4],[22,-8.6]].map(([x,z],i)=>spark(x,z,i));
  /* Rampen vor den Lücken */
  L3.kickers=L3.gaps.slice(1,6).map((g,i)=>[g[0]-2.7,i%2?-9:-6.5]);L3.kickers.push([-146,-8]);
  L3.kickers.forEach(([x,z])=>{const sh=new THREE.Shape();sh.moveTo(0,0);sh.lineTo(4.2,0);sh.lineTo(4.2,1.3);sh.closePath();const gm=new THREE.ExtrudeGeometry(sh,{depth:3.6,bevelEnabled:false});gm.translate(-2.1,0,-1.8);
    const m=new THREE.Mesh(gm,new THREE.MeshStandardMaterial({color:'#ff5fa8',roughness:.6,flatShading:true,emissive:'#ff5fa8',emissiveIntensity:.3}));m.position.set(x,1.3,z);m.castShadow=m.receiveShadow=true;Wd(m)});
  /* Publikum auf den Dächern */
  const CC=['#d54291','#f0cf36','#47c2a5','#eae8e8','#2499bb','#f1a7c8'],SK=['#e0a98a','#c98e6a','#8a5a3c','#f0c8a8'];
  function person(px,pz,face){const g=new THREE.Group(),top=CC[Math.floor(R()*6)],skin=SK[Math.floor(R()*4)],k=1.15+R()*.2;
    const mk=(geo,col,x,y,z,sx=1,sy=1,sz=1)=>{const m=new THREE.Mesh(geo,SM({color:col,roughness:.7}));m.position.set(x,y,z);m.scale.set(sx,sy,sz);m.castShadow=true;g.add(m);return m};
    mk(new THREE.CapsuleGeometry(.3,.75,4,10),top,0,1.45,0);[-1,1].forEach(s=>mk(new THREE.CapsuleGeometry(.12,.7,4,8),'#312e42',s*.16,.5,0));mk(new THREE.SphereGeometry(.3,12,10),skin,0,2.3,0);
    if(R()<.6)mk(new THREE.SphereGeometry(.32,12,6,0,Math.PI*2,0,Math.PI/2),CC[Math.floor(R()*6)],0,2.34,0);
    [-1,1].forEach(s=>mk(new THREE.SphereGeometry(.1,8,6),'#141416',s*.13,2.34,.25));
    g.position.set(px,1.3,pz);g.rotation.y=face;g.scale.setScalar(k);Wd(g);
    const gm=SM({color:top,roughness:.7}),hm=SM({color:skin,roughness:.7}),up=R()<.55;
    [-1,1].forEach(s=>{const A=new THREE.Group(),ox=s*.38*k;A.rotation.order='YXZ';A.position.set(px+ox*Math.cos(face),1.3+1.85*k,pz-ox*Math.sin(face));A.rotation.y=face;A.scale.setScalar(k);
      const a=new THREE.Mesh(new THREE.CapsuleGeometry(.09,.5,4,8),gm);a.position.y=-.36;A.add(a);const h=new THREE.Mesh(new THREE.SphereGeometry(.11,8,6),hm);h.position.y=-.72;A.add(h);
      const idle=up?s*2.5:s*.35;A.rotation.z=idle;Wd(A);L3.clappers.push({A,s,idle,x:px,face,ph:R()*6.28,up})})}
  const personF=AW(person,'prop');
  ROOFS.forEach(([x0,x1],i)=>{const mid=(x0+x1)/2;[[-1.3,Math.PI],[-14.7,0]].forEach(([pz,face],j)=>{if((i+j)%2===0)for(let k=0;k<3;k++)personF(mid+(k-1)*2.2+(R()-.5),pz+(R()-.5)*.3,face+(R()-.5)*.4)})});
  /* Ziel: Eiswagen auf dem letzten Dach */
  {icevan(138,-8,-Math.PI/2,'#ffd0e8');const van=sc.children[sc.children.length-1];sc.remove(van);van.scale.setScalar(1.5);W3.add(van);L3.van=van;
   const bm=new THREE.Mesh(new THREE.CylinderGeometry(3.4,3.4,70,20,1,true),BM('#ffe066',{transparent:true,opacity:.22,side:THREE.DoubleSide,depthWrite:false,fog:false}));bm.position.set(138,35,-8);bm.userData.noOutline=true;Wd(bm);L3.vanBeam=bm}
  L3.scoops.forEach(s=>addOutlines(s.g,'actor'));L3.cones.forEach(c=>addOutlines(c.o,'prop'));addOutlines(L3.van,'prop');
  addOutlines(W3,'stage')}
function stepLevel3(dt){if(!W3||!W3.visible)return;L3.sky.position.copy(cam.position);const t=G.t;
  L3.beacons.forEach(b=>{b.visible=Math.sin(t*3+b.userData.blink)>-.2});
  if(L3.vanBeam)L3.vanBeam.material.opacity=.17+.08*Math.sin(t*3);stepFireworks(dt)}
function fallRespawn(){G.falls=(G.falls||0)+1;const gp=GAPS.find(g=>P.x<g[1]+6)||GAPS[0];
  P.x=Math.max(XMIN+4,gp[0]-5);P.y=1.3;P.vy=0;P.speed=SPEED_CRUISE;P.boost=0;P.h=0;P.z=-8;P.push=0;P.coy=1;
  toast('Runtergefallen!',1000);SFX.boing();G.shake=Math.max(G.shake,.5);burst(P.x,P.y+2,P.z,30);
  if(!G.fallSaid){G.fallSaid=true;say('e','Lücke. Du hast sie gesehen, sie dich auch. Zum Glück gibt es Neustarts.',3.4)}}


/* ================= Inventar und Stadt-Items ================= */
const ITEM_DEFS=[
 {id:'funk',name:'Funkzettel',type:2,place:'Café',col:'#ffe066',desc:'Ein abgefangener Funkspruch. Sieht nach Geheimschrift aus.',use:'Atoll: Funkspruch entschlüsseln'},
 {id:'schraube',name:'Schraubendreher',type:1,place:'Laden',col:'#ff8a2a',desc:'Passt in jede Schaltkasten-Schraube, auch in die falschen.',use:'Atoll: Alarm umkehren'},
 {id:'usb',name:'USB-Stick',type:3,place:'Büro',col:'#4cc3ff',desc:'Beschriftet mit PATROUILLE. Hängt etwas Klebriges dran.',use:'Atoll: Patrouillen-Log lesen'},
 {id:'handbuch',name:'Wartungs-Handbuch',type:0,place:'Wohnhaus',col:'#47c2a5',desc:'Seite 12 ist abgerissen. Dort stand die Werks-PIN.',use:'Atoll: Kamera mit Werks-PIN'},
 {id:'losung',name:'Möwen-Bon',type:4,place:'Burger-Laden',col:'#ff5fa8',desc:'Auf der Rückseite steht: "Frag nach dem Möwen-Menü."',use:'Atoll: geheime Schmuggler-Losung (Bonus)',bonus:true}];
const INV={open:false,items:new Set()};
try{JSON.parse(localStorage.getItem('kq-items')||'[]').forEach(id=>{if(ITEM_DEFS.some(d=>d.id===id))INV.items.add(id)})}catch(e){}
function invSave(){try{localStorage.setItem('kq-items',JSON.stringify([...INV.items]))}catch(e){}}
function itemIcon(d,size=84){const c=document.createElement('canvas');c.width=c.height=size;const g=c.getContext('2d'),s=size/84;g.scale(s,s);g.lineJoin='round';g.lineWidth=3;g.strokeStyle='#1a1626';
  const col=d.col;g.fillStyle=col;
  if(d.id==='funk'){g.save();g.translate(42,44);g.rotate(-.18);g.fillStyle='#fff6ea';g.fillRect(-22,-28,44,56);g.strokeRect(-22,-28,44,56);g.fillStyle=col;g.fillRect(-22,-28,44,10);for(let i=0;i<4;i++){g.fillStyle='#1a1626';g.fillRect(-15,-10+i*9,i%2?22:30,3)}g.fillStyle=col;g.fillRect(12,18,10,10);g.restore()}
  else if(d.id==='schraube'){g.save();g.translate(42,42);g.rotate(-.7);g.fillStyle='#cfcfe0';g.fillRect(-4,-4,8,36);g.strokeRect(-4,-4,8,36);g.fillStyle=col;g.beginPath();g.roundRect(-9,-34,18,32,7);g.fill();g.stroke();g.fillStyle='#1a1626';g.fillRect(-5,-22,10,3);g.fillRect(-5,-14,10,3);g.restore()}
  else if(d.id==='usb'){g.fillStyle='#2a3a8a';g.beginPath();g.roundRect(24,26,36,36,6);g.fill();g.stroke();g.fillStyle='#cfcfe0';g.fillRect(30,8,24,20);g.strokeRect(30,8,24,20);g.fillStyle='#1a1626';g.fillRect(35,13,5,6);g.fillRect(44,13,5,6);g.fillStyle=col;g.beginPath();g.arc(42,46,6,0,7);g.fill();g.stroke()}
  else if(d.id==='handbuch'){g.fillStyle=col;g.beginPath();g.roundRect(18,14,48,58,5);g.fill();g.stroke();g.fillStyle='#fff6ea';g.fillRect(26,22,32,8);g.strokeRect(26,22,32,8);g.fillStyle='#1a1626';g.fillRect(28,40,28,3);g.fillRect(28,48,22,3);g.fillRect(28,56,26,3);g.fillStyle='#ff5f5f';g.beginPath();g.moveTo(54,14);g.lineTo(54,34);g.lineTo(60,28);g.lineTo(66,34);g.lineTo(66,14);g.fill()}
  else{g.fillStyle='#fff6ea';g.beginPath();g.moveTo(20,10);g.lineTo(64,10);g.lineTo(64,72);for(let i=0;i<6;i++)g.lineTo(64-(i+.5)*7.3,i%2?72:66);g.lineTo(20,72);g.closePath();g.fill();g.stroke();g.fillStyle=col;g.fillRect(20,22,44,12);g.fillStyle='#1a1626';g.fillRect(27,42,30,3);g.fillRect(27,50,22,3);g.beginPath();g.arc(52,56,5,0,7);g.fillStyle='#ffe066';g.fill();g.stroke()}
  return c.toDataURL('image/png')}
const ITEM_ICONS={};ITEM_DEFS.forEach(d=>{try{ITEM_ICONS[d.id]=itemIcon(d)}catch(e){ITEM_ICONS[d.id]=''}});
function invCount(){return INV.items.size}
function invRender(){const grid=$('inv-grid');if(!grid)return;
  grid.innerHTML=`<div class="slot-i got"><div class="ic"><span class="sk"></span></div><b>Skateboard</b><span>Fortbewegung. Immer dabei.</span></div>`+ITEM_DEFS.map(d=>INV.items.has(d.id)
   ?`<div class="slot-i got"><div class="ic"><img src="${ITEM_ICONS[d.id]}" alt=""></div><b>${d.name}</b><span>${d.desc}</span><em>${d.use}</em></div>`
   :`<div class="slot-i"><div class="ic q">?</div><b>Noch nicht gefunden</b><span>Hinweis: ${d.place==='Büro'?'im Büroviertel':d.place==='Café'?'beim Café':d.place==='Laden'?'bei einem Laden':d.place==='Wohnhaus'?'bei einem Wohnhaus':'beim Burger-Laden'}${d.bonus?' (Bonus)':''}</span></div>`).join('');
  const n=$('inv-n');if(n)n.textContent=invCount()+'/'+ITEM_DEFS.length;const bn=$('b-inv-n');if(bn)bn.textContent=invCount()+'/'+ITEM_DEFS.length}
function invToggle(on){if(G.phase==='title')return;INV.open=on===undefined?!INV.open:on;$('inv').hidden=!INV.open;$('b-inv').setAttribute('aria-pressed',String(INV.open));
  if(INV.open){K.up=K.down=K.left=K.right=0;invRender();$('inv-close').focus({preventScroll:true})}}
$('b-inv').onclick=()=>invToggle();$('inv-close').onclick=()=>invToggle(false);
$('inv-reset').onclick=()=>{INV.items.clear();invSave();HUB.items.forEach(it=>{it.got=false;it.g.visible=true;it.ring.visible=true});invRender();toast('Inventar zurückgesetzt',900)};
addEventListener('keydown',e=>{if(e.code==='KeyI'&&!e.repeat){e.preventDefault();invToggle()}else if(e.code==='Escape'&&INV.open){e.preventDefault();invToggle(false)}});
invRender();

/* ================= Welt 0: Die Stadt (Labyrinth, 5×5 Blöcke) ================= */
LEVELS[0]={id:0,mode:'city',pips:2,boss:'',bossColor:'#f0cf36',bossSpeed:0,grav:20,goal:'Portal',
  quest:'Zur Küste: Rennen. Portale finden',goalQuest:'',
  intro:'Willkommen in der Stadt. Im Westen liegt die Küste: Wer sie erreicht, startet das Rennen.',
  vendor:'Stadtfunk: Zwei Portale zu anderen Welten sind in der Stadt versteckt. Sie funkeln erst, wenn du nah dran bist. Sackgassen sind ein guter Anfang.',
  lines:[],chase:'',eat:'',win:'',winSub:'',badge:''};
const HUB={sx:0,sz:0,sh:0,found:new Set(),portals:[],items:[],colliders:[],clappers:[],cones:[],maze:null,built:false,mm:null,mmT:0,rd:0};
const NODE=i=>(i-2.5)*50;
function genMaze(seed){const R=mulberry(seed),N=6,id=(i,j)=>j*N+i,key=(a,b)=>a<b?a+'-'+b:b+'-'+a,open=new Set(),vis=new Set([id(2,3)]),stack=[[2,3]];
  while(stack.length){const [i,j]=stack[stack.length-1];const nb=[[1,0],[-1,0],[0,1],[0,-1]].map(([a,b])=>[i+a,j+b]).filter(([a,b])=>a>=0&&b>=0&&a<N&&b<N&&!vis.has(id(a,b)));
    if(!nb.length){stack.pop();continue}const [a,b]=nb[Math.floor(R()*nb.length)];open.add(key(id(i,j),id(a,b)));vis.add(id(a,b));stack.push([a,b])}
  const all=[];for(let j=0;j<N;j++)for(let i=0;i<N;i++){if(i<N-1)all.push([id(i,j),id(i+1,j)]);if(j<N-1)all.push([id(i,j),id(i,j+1)])}
  const closed=all.filter(([a,b])=>!open.has(key(a,b)));for(let k=0;k<7&&closed.length;k++){const q=closed.splice(Math.floor(R()*closed.length),1)[0];open.add(key(q[0],q[1]))}
  const deg=new Array(N*N).fill(0),adj=Array.from({length:N*N},()=>[]);all.forEach(([a,b])=>{if(open.has(key(a,b))){deg[a]++;deg[b]++;adj[a].push(b);adj[b].push(a)}});
  const dist=new Array(N*N).fill(-1),q=[id(2,3)];dist[q[0]]=0;for(let h=0;h<q.length;h++){const u=q[h];adj[u].forEach(v=>{if(dist[v]<0){dist[v]=dist[u]+1;q.push(v)}})}
  let coast=-1;for(let j=0;j<N;j++){const n=id(0,j);if(dist[n]>=3&&(coast<0||dist[n]<dist[coast]))coast=n}if(coast<0)coast=id(0,3);
  const cand=[];deg.forEach((d,n)=>{if(n!==id(2,3)&&n!==coast&&dist[n]>=5)cand.push(n)});cand.sort((a,b)=>(dist[b]+(deg[b]===1?4:0))-(dist[a]+(deg[a]===1?4:0)));
  const pick=[];cand.forEach(n=>{if(pick.length<2&&pick.every(m=>Math.abs((m%N)-(n%N))+Math.abs(Math.floor(m/N)-Math.floor(n/N))>=4))pick.push(n)});
  cand.forEach(n=>{if(pick.length<2&&!pick.includes(n))pick.push(n)});
  return {N,id,key,open,all,deg,adj,dist,pick,coast}}

function shopTex(txt,fg,bg){const c=document.createElement('canvas');c.width=512;c.height=128;const g=c.getContext('2d');g.fillStyle=bg;g.fillRect(0,0,512,128);g.strokeStyle=fg;g.lineWidth=8;g.shadowColor=fg;g.shadowBlur=18;g.strokeRect(8,8,496,112);
  g.fillStyle='#fff';g.shadowBlur=22;g.font='800 66px "Baloo 2","Trebuchet MS",sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText(txt,256,68);
  const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t}
const SIGNM={};function signMat(txt,fg,bg){const k=txt+fg;return SIGNM[k]||(SIGNM[k]=new THREE.MeshBasicMaterial({map:shopTex(txt,fg,bg||'#1a1030'),side:THREE.DoubleSide}))}
const MTC={};function MT(c,em,ei){const k=c+'|'+em+'|'+ei;return MTC[k]||(MTC[k]=new THREE.MeshStandardMaterial({color:c,roughness:.8,flatShading:true,...(em?{emissive:em,emissiveIntensity:ei||.8}:{})}))}

function bakeGroup(root){const groups=new Map(),rm=[];
  const take=o=>{if(!o.isMesh||o.isInstancedMesh||o.userData.noBake)return;const m=o.material;if(Array.isArray(m)||m.transparent||m.map||m.isShaderMaterial)return;
    const key=m.uuid+(o.castShadow?'c':'n');let gp=groups.get(key);if(!gp){gp={mat:m,geos:[],c:o.castShadow};groups.set(key,gp)}
    let g=o.geometry;g=g.index?g.toNonIndexed():g.clone();g.applyMatrix4(o.matrixWorld);Object.keys(g.attributes).forEach(k=>{if(k!=='position'&&k!=='normal')g.deleteAttribute(k)});gp.geos.push(g);return true};
  root.children.slice().forEach(ch=>{if(ch.userData.noBake||ch.isLight)return;ch.updateMatrixWorld(true);
    if(ch.isMesh){if(take(ch))rm.push(ch)}else if(ch.isGroup){let any=false;ch.traverse(o=>{if(take(o))any=true});if(any)rm.push(ch)}});
  rm.forEach(c=>root.remove(c));
  groups.forEach(gp=>{const mg=mergeGeometries(gp.geos,false);if(!mg)return;const m=new THREE.Mesh(mg,gp.mat);m.castShadow=gp.c;m.receiveShadow=true;m.userData.baked=true;
    const q=new THREE.Mesh(mg,outMat('stage'));q.userData.outline=true;m.add(q);root.add(m)})}

let W0=null;
function buildLevel0(){
  if(W0)return;W0=new THREE.Group();W0.userData.noBake=true;W0.visible=false;sc.add(W0);
  const R=mulberry(777),maze=genMaze(31),N=6;HUB.maze=maze;
  const PAST=['#f1a7c8','#a9e6d2','#f6df73','#a9d8f0','#f6c3a8','#e7b8e8','#c9f0b8'];
  const GLASS=MT('#7fb8d8','#7fb8d8',.25),LIT=MT('#ffe9a0','#ffe9a0',.9),GLASSW=MT('#bfe8f4','#ffe9b8',.4),TRIM=MT('#f6efe6'),DARK=MT('#2a2040'),WOOD=MT('#7a4a2a'),GREEN=MT('#4fa874');
  const Y0=1.6;let cur={x:0,z:0};
  const bx=(mat,w,h,d,x,y,z,cast=true)=>{const m=new THREE.Mesh(BX,mat);m.scale.set(w,h,d);m.position.set(cur.x+x,Y0+y+h/2,cur.z+z);m.castShadow=cast;m.receiveShadow=true;W0.add(m);return m};
  const cyl=(mat,r,h,x,y,z,cast=true)=>{const m=new THREE.Mesh(CY,mat);m.scale.set(r,h,r);m.position.set(cur.x+x,Y0+y+h/2,cur.z+z);m.castShadow=cast;W0.add(m);return m};
  const sph=(mat,rx,ry,rz,x,y,z,cast=true)=>{const m=new THREE.Mesh(SP,mat);m.scale.set(rx,ry,rz);m.position.set(cur.x+x,Y0+y,cur.z+z);m.castShadow=cast;W0.add(m);return m};
  const cone=(mat,r,h,x,y,z)=>{const m=new THREE.Mesh(CN,mat);m.scale.set(r,h,r);m.position.set(cur.x+x,Y0+y+h/2,cur.z+z);m.castShadow=true;W0.add(m);return m};
  const sign=(txt,fg,x,y,z,w,h,ry,bg)=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),signMat(txt,fg,bg));m.position.set(cur.x+x,Y0+y,cur.z+z);m.rotation.y=ry;m.userData.noBake=true;W0.add(m)};
  function winFace(f,W,D,fl,fh,y0){const len=(f==='n'||f==='s')?W:D,n=Math.max(2,Math.floor((len-2)/3.4)),st=(len-2)/n;
    for(let q=0;q<fl;q++)for(let k=0;k<n;k++){const u=-len/2+1+st*(k+.5),y=y0+q*fh+fh*.28,mat=((q*7+k*3+f.charCodeAt(0))%5<2)?LIT:GLASS;
      if(f==='n')bx(mat,1.7,1.9,.12,u,y,-D/2-.05,false);else if(f==='s')bx(mat,1.7,1.9,.12,u,y,D/2+.05,false);else if(f==='w')bx(mat,.12,1.9,1.7,-W/2-.05,y,u,false);else bx(mat,.12,1.9,1.7,W/2+.05,y,u,false)}}
  const winAll=(W,D,fl,fh,y0)=>['n','s','w','e'].forEach(f=>winFace(f,W,D,fl,fh,y0));
  /* ---- Wohnhaus ---- */
  function resi(){const w=22+Math.floor(R()*7),d=20,fl=4+Math.floor(R()*3),fh=3.3,h=fl*fh,wall=MT(PAST[Math.floor(R()*PAST.length)]);
    bx(wall,w,h,d,0,0,0);bx(TRIM,w+.8,.5,d+.8,0,h,0);bx(MT('#a8a0c0'),w*.45,1,d*.45,0,h+.5,0);bx(MT('#8a7a9a'),1.4,2.4,1.4,w*.3,h+.5,d*.2);
    winAll(w,d,fl,fh,1.6);bx(WOOD,1.9,2.8,.2,0,0,-d/2-.1);bx(TRIM,2.8,.3,1.5,0,3,-d/2-.7);
    for(let q=1;q<fl;q+=2)for(const u of [-w*.27,w*.27]){bx(TRIM,3.4,.25,1.5,u,q*fh+.9,-d/2-.75);bx(MT('#47c2a5'),3.4,.8,.1,u,q*fh+1.15,-d/2-1.45)}
    for(let k=0;k<3;k++){sph(GREEN,.9,.9,.9,-w/2+3+k*(w-6)/2,.8,-d/2-2.2);bx(MT('#a66b28'),1.1,.5,1.1,-w/2+3+k*(w-6)/2,0,-d/2-2.2)}
    sign('WOHNEN','#f1a7c8',-w*.3,2.2,-d/2-.12,3.6,.9,Math.PI,'#3a2a5a')}
  /* ---- Laden ---- */
  function shop(i){const w=28,d=18,h=7.4,wall=MT(PAST[Math.floor(R()*PAST.length)]),aw=['#d54291','#47c2a5','#ff8a2a'][i%3],names=['MODE','KIOSK','SPIELE','BLUMEN','SCHUHE'],nm=names[i%5];
    bx(wall,w,h,d,0,0,0);bx(TRIM,w+.8,.5,d+.8,0,h,0);bx(GLASSW,w-4,3.2,.15,0,.5,-d/2-.08,false);bx(GLASSW,.15,3.2,d-4,-w/2-.08,.5,0,false);bx(WOOD,2,2.8,.2,w*.36,0,-d/2-.1);
    for(let k=0;k<7;k++)bx(MT(k%2?'#ffffff':aw),w/7,.3,2.6,-w/2+w/14+k*w/7,4.2,-d/2-1.3);
    winFace('n',w,d,1,3,4.8);winFace('s',w,d,1,3,4.8);winFace('e',w,d,1,3,4.8);
    bx(DARK,10,3.6,.5,0,h+.5,-d/2+1.5);bx(MT('#ff5fa8','#ff5fa8',.9),9.4,.25,.2,0,h+.55,-d/2+1.1);
    sign(nm,'#ffe066',0,5.6,-d/2-1.35,9,2.2,Math.PI,'#1a1030');sign(nm,'#ffe066',0,h+2.5,-d/2+1.2,9,3,Math.PI,'#1a1030');
    for(let k=0;k<4;k++)bx(MT(['#ff9a3d','#7be0a0','#4cc3ff','#f1a7c8'][k]),1.2,1.2,1.2,-9+k*2.4,0,-d/2-3.2);bx(MT('#6a5a9a'),3.4,.5,1.1,-w/2+4,.5,-d/2-3)}
  /* ---- Café ---- */
  function cafe(){const w=22,d=16,h=5.2;bx(MT('#fff0d8'),w,h,d,0,0,0);bx(MT('#8a5a3a'),w+.8,.5,d+.8,0,h,0);bx(GLASSW,w-4,3,.15,0,.6,-d/2-.08,false);bx(GLASSW,.15,3,d-4,-w/2-.08,.6,0,false);bx(WOOD,1.8,2.7,.2,w*.34,0,-d/2-.1);
    for(let k=0;k<6;k++)bx(MT(k%2?'#fff0d8':'#8a5a3a'),w/6,.3,2.4,-w/2+w/12+k*w/6,3.8,-d/2-1.2);
    cyl(MT('#ffffff'),2.8,3.6,-2,h+.5,0);cyl(MT('#8a5a3a'),2.5,.5,-2,h+4,0);const hd=new THREE.Mesh(new THREE.TorusGeometry(1,.3,8,16),MT('#ffffff'));hd.scale.set(1.5,1.5,1.5);hd.position.set(cur.x+.8,Y0+h+2.8,cur.z);hd.castShadow=true;W0.add(hd);
    for(let k=0;k<3;k++)sph(MT('#ffffff'),.6+k*.2,.6+k*.2,.6+k*.2,-2+(k-1)*.6,h+6.2+k*1.3,0,false);
    sign('CAFÉ','#ffb347',0,6,-d/2-.12,8,2,Math.PI,'#2a1a10');
    for(let k=0;k<3;k++)for(let q=0;q<2;q++){const tx=-7+k*7,tz=-d/2-5-q*5,col=['#d54291','#47c2a5','#ff8a2a','#4cc3ff','#f6df73','#8e5bd6'][(k+q*3)%6];
      cyl(MT('#f6efe6'),.9,.15,tx,1.7,tz);cyl(MT('#6a5a8a'),.15,1.7,tx,0,tz);cyl(MT('#6a5a8a'),.8,.1,tx,0,tz);cyl(MT('#cfcfe0'),.1,3.2,tx,0,tz+.0);cone(MT(col),2.3,1,tx,3.2,tz);
      [[-1.5,0],[1.5,0]].forEach(([dx,dz])=>{cyl(MT('#ff9a3d'),.45,.9,tx+dx,0,tz+dz)})}}
  /* ---- Büro ---- */
  function office(){const w=18,d=18,fl=10+Math.floor(R()*5),fh=3.4,h=fl*fh;bx(MT('#2a3a6a'),w-.2,h,d-.2,0,0,0);
    for(let q=0;q<fl;q++)bx(MT(q%3===0?'#7fd0f0':'#5aa0d0',q%3===0?'#7fd0f0':'#5aa0d0',.3),w+.4,fh-.9,d+.4,0,q*fh+.5,0,false);
    for(const x of [-6,-2,2,6]){bx(MT('#1a2450'),.5,h,d+.8,x,0,0,false);bx(MT('#1a2450'),w+.8,h,.5,0,0,x,false)}
    bx(MT('#3a3a5a'),w*.6,2,d*.6,0,h,0);cyl(MT('#cfcfe0'),.2,9,0,h+2,0);sph(MT('#ff2a4a','#ff2a4a',1),.6,.6,.6,0,h+11.4,0,false);
    bx(MT('#2a3a6a'),w+2,.5,4,0,3.6,-d/2-2);[-1,1].forEach(s=>cyl(MT('#cfcfe0'),.25,3.6,s*(w/2),0,-d/2-3.6));bx(GLASSW,5,3,.15,0,0,-d/2-.08,false);
    sign('ICE CORP','#4cc3ff',0,4.9,-d/2-.12,6,1.5,Math.PI,'#10183a')}
  /* ---- Burger ---- */
  function burger(){const w=20,d=16,h=5.2;bx(MT('#e5383b'),w,h,d,0,0,0);bx(MT('#ffd23a'),w+.8,.6,d+.8,0,h,0);for(let k=0;k<5;k++)bx(MT('#ffffff'),.7,h,.12,-w/2+2+k*4.2,0,-d/2-.06);
    bx(GLASSW,w-8,2.8,.15,0,.7,-d/2-.12,false);bx(WOOD,1.8,2.7,.2,w*.37,0,-d/2-.12);
    const by=h+.6;sph(MT('#e0a050'),4.4,1.6,4.4,0,by+.9,0);cyl(MT('#5b3a1e'),4.5,1.1,0,by+1.6,0);bx(MT('#ffd23a'),9,.35,9,0,by+2.7,0);cyl(MT('#6fcf93'),4.8,.5,0,by+3.05,0);cyl(MT('#e5383b'),4.3,.45,0,by+3.5,0);
    sph(MT('#e8a85a'),4.4,2.6,4.4,0,by+5.2,0);for(let k=0;k<12;k++){const a=k*2.4,r=1+k*.28;sph(MT('#fff3d0'),.35,.2,.55,Math.cos(a)*r,by+7.6-r*.12,Math.sin(a)*r,false)}
    sign('BURGER','#ffd23a',0,6.2,-d/2-.12,8,2,Math.PI,'#3a0a10');sign('24H','#ff5fa8',-w/2-.12,3.6,0,3,1,-Math.PI/2,'#10183a')}
  const TYPES=[resi,shop,cafe,office,burger],TNAMES=['Wohnhaus','Laden','Café','Büro','Burger'],TCOL=['#f1a7c8','#ffb347','#8a5a3a','#4cc3ff','#e5383b'];
  /* ---- Boden, Bürgersteige, Mauer ---- */
  const ground=new THREE.Mesh(new THREE.PlaneGeometry(420,420),new THREE.MeshStandardMaterial({color:'#4a3f66',roughness:.95}));ground.rotation.x=-Math.PI/2;ground.position.set(0,1.3,0);ground.receiveShadow=true;ground.userData.noBake=true;W0.add(ground);
  HUB.blockType=[];const blockSeed=[];
  for(let j=0;j<5;j++)for(let i=0;i<5;i++){cur={x:(i-2)*50,z:(j-2)*50};const t=(i+2*j)%5;HUB.blockType.push(t);
    bx(MT('#cfc4e0'),36,.3,36,0,-.3,0);TYPES[t](i+j);
    HUB.colliders.push({x0:cur.x-18,x1:cur.x+18,z0:cur.z-18,z1:cur.z+18,top:999})}
  /* ---- Pflanzen aus Regeln + Seed (wie in Welt 1): Welt-Farbe Rosa, kräftig, 6 pro Block ---- */
  {const oldFSP=FSP,oldH=FW.h,oldA=FW.acc;FSP=new THREE.SphereGeometry(1,7,5);FCYL=6;FW.h=.97;FW.lb=.1;FW.sb=.42;FW.acc=.28;CTX='actor';
   const KS=['balloon','balloon','spiral','vine','balloon','mushroom','spiral','palm','vine','balloon'],SC0={balloon:1,palm:1,spiral:1.1,vine:.95,mushroom:1};HUB.flora=[];
   for(let j=0;j<5;j++)for(let i=0;i<5;i++){
     const diag=(i+j)%2?[[16.4,-16.4],[-16.4,16.4],[-16.4,-16.4],[16.4,16.4]]:[[-16.4,-16.4],[16.4,16.4],[16.4,-16.4],[-16.4,16.4]];
     const sides=[[17.4,-8],[-17.4,8]];
     diag.concat(sides).forEach(([tx,tz],k)=>{
       const R2=mulberry(i*131+j*17+k*5+3),kind=KS[Math.floor(R2()*KS.length)],sc2=SC0[kind]*(k>=4?.8:1);
       const gp=FLORA[kind](R2,sc2);gp.position.set((i-2)*50+tx,1.6,(j-2)*50+tz);gp.rotation.y=R2()*6.28;gp.traverse(o=>{if(o.isMesh)o.castShadow=true});W0.add(gp);HUB.flora.push(kind)})}
   CTX='stage';FCYL=10;FSP=oldFSP;FW.h=oldH;FW.acc=oldA;FW.lb=0;FW.sb=0}
  const zc=NODE(Math.floor(maze.coast/N));HUB.coastZ=zc;
  const wallM=MT('#7a5aa0'),wallN=MT('#ff5fa8','#ff5fa8',.9);
  [[0,-143,300,2],[0,143,300,2],[143,0,2,300]].forEach(([x,z,w,d])=>{cur={x:0,z:0};bx(wallM,w,9,d,x,0,z);bx(wallN,w>d?w:.5,.4,w>d?.5:d,x,9,z)});
  [[-143,(-143+zc-10)/2,zc-10+143],[-143,(zc+10+143)/2,143-zc-10]].forEach(([x,z,len])=>{cur={x:0,z:0};bx(wallM,2,9,len,x,0,z);bx(wallN,.5,.4,len,x,9,z)});
  /* ---- Küste im Westen: Tor, Startlinie, Strand, Meer ---- */
  cur={x:0,z:0};
  [-1,1].forEach(s=>{bx(MT('#ff5fa8'),2.2,13,2.2,-144.5,0,zc+s*10.6);bx(MT('#fff0b0','#fff0b0',.8),2.8,.6,2.8,-144.5,13,zc+s*10.6)});
  bx(MT('#2a2040'),3.4,2.6,24,-144.5,13.4,zc);bx(MT('#ffe066','#ffe066',.9),.3,.5,22,-142.6,16.1,zc);
  sign('KÜSTEN-RENNEN','#ffe066',-142.6,14.7,zc,10.4,2.6,Math.PI/2,'#1a1030');
  for(let k=0;k<9;k++)for(let q=0;q<2;q++)bx(MT((k+q)%2?'#ffffff':'#141416'),1.4,.06,2,-146.2+q*1.4,0,zc-8+k*2);
  {const sand=new THREE.Mesh(new THREE.PlaneGeometry(30,300),new THREE.MeshStandardMaterial({color:'#f4d89a',roughness:1}));sand.rotation.x=-Math.PI/2;sand.position.set(-158,1.34,0);sand.receiveShadow=true;sand.userData.noBake=true;W0.add(sand);
   const shal=new THREE.Mesh(new THREE.PlaneGeometry(26,300),new THREE.MeshStandardMaterial({color:'#7fe0e0',roughness:.4}));shal.rotation.x=-Math.PI/2;shal.position.set(-186,1.355,0);shal.userData.noBake=true;W0.add(shal);
   const sea=new THREE.Mesh(new THREE.PlaneGeometry(900,900),new THREE.MeshStandardMaterial({color:'#1cafd1',roughness:.25,metalness:.1}));sea.rotation.x=-Math.PI/2;sea.position.set(-649,1.37,0);sea.userData.noBake=true;W0.add(sea);
   const cb=new THREE.Mesh(new THREE.CylinderGeometry(4,4,120,16,1,true),BM('#7ff0ff',{transparent:true,opacity:.26,side:THREE.DoubleSide,depthWrite:false,fog:false}));cb.position.set(-150,60,zc);cb.userData.noBake=true;cb.userData.noOutline=true;W0.add(cb);HUB.coastBeam=cb;
   const oS=FSP,oH=FW.h,oL=FW.lb,oB=FW.sb;FSP=new THREE.SphereGeometry(1,7,5);FCYL=6;FW.h=.40;FW.lb=0;FW.sb=0;
   [[-150,-15],[-153,17],[-151,-27],[-155,30],[-149,-39],[-152,40],[-156,-52],[-154,54]].forEach(([px,pz],k)=>{const R3=mulberry(900+k),gp=FLORA.palm(R3,1.05);gp.position.set(px,1.36,zc+pz);gp.rotation.y=R3()*6.28;gp.traverse(o=>{if(o.isMesh)o.castShadow=true});W0.add(gp)});
   FSP=oS;FCYL=10;FW.h=oH;FW.lb=oL;FW.sb=oB}
  /* ---- Sperren (geschlossene Straßen) ---- */
  const nodeXZ=n=>({x:NODE(n%N),z:NODE(Math.floor(n/N))});
  HUB.barricades=[];
  maze.all.forEach(([a,b])=>{if(maze.open.has(maze.key(a,b)))return;const A=nodeXZ(a),B=nodeXZ(b),mx=(A.x+B.x)/2,mz=(A.z+B.z)/2,horiz=A.z===B.z;cur={x:mx,z:mz};HUB.barricades.push({x:mx,z:mz,horiz});
    const lw=horiz?.6:13.6,ld=horiz?13.6:.6;bx(MT('#6a5a9a'),lw,5,ld,0,-.3,0);
    {const e=Math.abs(horiz?mz:mx)>=120;if(e){const sg=Math.sign(horiz?mz:mx);if(horiz){bx(MT('#6a5a9a'),.6,5,11.2,0,-.3,sg*12.4);HUB.colliders.push({x0:mx-.9,x1:mx+.9,z0:Math.min(mz+sg*6.8,mz+sg*18),z1:Math.max(mz+sg*6.8,mz+sg*18),top:999})}else{bx(MT('#6a5a9a'),11.2,5,.6,sg*12.4,-.3,0);HUB.colliders.push({x0:Math.min(mx+sg*6.8,mx+sg*18),x1:Math.max(mx+sg*6.8,mx+sg*18),z0:mz-.9,z1:mz+.9,top:999})}}}
    for(let k=0;k<3;k++){const off=(k-1)*4.4,sx=horiz?1.2:3.6,sz=horiz?3.6:1.2;bx(MT('#ffffff'),sx,.9,sz,horiz?-.9:off,.6,horiz?off:-.9);bx(MT('#ff8a2a'),sx,.9,sz*.5,horiz?-.9:off,1.5,horiz?off:-.9);}
    [-5.5,5.5].forEach(o=>{sph(MT('#ff2a4a','#ff2a4a',1),.45,.45,.45,horiz?0:o,5.4,horiz?o:0,false)});
    sign('GESPERRT','#ff5f5f',horiz?-.45:0,3.2,horiz?0:-.45,6,1.5,horiz?-Math.PI/2:Math.PI,'#3a0a10');sign('GESPERRT','#ff5f5f',horiz?.45:0,3.2,horiz?0:.45,6,1.5,horiz?Math.PI/2:0,'#3a0a10');
    HUB.colliders.push({x0:mx-(horiz?.9:7.2),x1:mx+(horiz?.9:7.2),z0:mz-(horiz?7.2:.9),z1:mz+(horiz?7.2:.9),top:999})});
  /* ---- Laternen und Fahrbahnmarkierung (instanziert) ---- */
  {const NL=N*N*4,post=new THREE.InstancedMesh(new THREE.CylinderGeometry(.14,.14,6,6),new THREE.MeshStandardMaterial({color:'#5a4a8a'}),NL),head=new THREE.InstancedMesh(new THREE.SphereGeometry(.55,8,6),new THREE.MeshBasicMaterial({color:'#fff0b0'}),NL),m4=new THREE.Matrix4();let n=0;
   for(let j=0;j<N;j++)for(let i=0;i<N;i++)for(const [sx,sz] of [[-1,-1],[1,-1],[-1,1],[1,1]]){const x=NODE(i)+sx*6.4,z=NODE(j)+sz*6.4;m4.makeTranslation(x,1.6+3,z);post.setMatrixAt(n,m4);m4.makeTranslation(x,1.6+6.2,z);head.setMatrixAt(n,m4);n++}
   post.castShadow=true;W0.add(post);W0.add(head);post.userData.noBake=head.userData.noBake=true}
  {const cnt=[];for(let j=0;j<N;j++)for(let k=0;k<5;k++)for(let q=0;q<5;q++)cnt.push([NODE(k)+25+(q-2)*5.6*1,NODE(j),1]);for(let i=0;i<N;i++)for(let k=0;k<5;k++)for(let q=0;q<5;q++)cnt.push([NODE(i),NODE(k)+25+(q-2)*5.6,0]);
   const dm=new THREE.InstancedMesh(new THREE.BoxGeometry(2.2,.04,.35),new THREE.MeshStandardMaterial({color:'#fff0b0',emissive:'#fff0b0',emissiveIntensity:.5}),cnt.length),m4=new THREE.Matrix4(),q=new THREE.Quaternion(),sv=new THREE.Vector3(1,1,1);
   cnt.forEach(([x,z,h],i)=>{q.setFromEuler(new THREE.Euler(0,h?0:Math.PI/2,0));m4.compose(new V3(x,1.33,z),q,sv);dm.setMatrixAt(i,m4)});dm.userData.noBake=true;W0.add(dm)}
  /* ---- Portale (versteckt in Sackgassen) ---- */
  const WCOL=[{ring:'#8e5bd6',d:['#4cc3ff','#ff5fa8','#ffffff']},{ring:'#d54291',d:['#ffe066','#4cc3ff','#ffffff']},{ring:'#ffe066',d:['#ff5fa8','#4cc3ff','#ffffff']}];
  maze.pick.forEach((nd,k)=>{const P0=nodeXZ(nd),nb=maze.adj[nd][0],NB=nodeXZ(nb),alongX=NB.z===P0.z,g=portal(P0.x,8,P0.z);sc.remove(g);g.rotation.y=alongX?Math.PI/2:0;
    g.children[0].material.color.set(WCOL[k].ring);g.children[0].material.emissive.set(WCOL[k].ring);[1,2,3].forEach(i=>g.children[i].material.color.set(WCOL[k].d[i-1]));g.userData.noBake=true;W0.add(g);
    const beam=new THREE.Mesh(new THREE.CylinderGeometry(3,3,90,16,1,true),BM(WCOL[k].ring,{transparent:true,opacity:0,side:THREE.DoubleSide,depthWrite:false,fog:false}));beam.position.set(P0.x,45,P0.z);beam.userData.noBake=true;beam.userData.noOutline=true;W0.add(beam);
    HUB.portals.push({x:P0.x,z:P0.z,world:k+2,g,beam,node:nd,col:WCOL[k].ring})});
  /* ---- Pylonen auf den Straßen ---- */
  {const edges=maze.all.filter(([a,b])=>maze.open.has(maze.key(a,b)));for(let k=0;k<22;k++){const [a,b]=edges[Math.floor(R()*edges.length)],A=nodeXZ(a),B=nodeXZ(b),t=.25+R()*.5,x=A.x+(B.x-A.x)*t+(A.z===B.z?0:(R()-.5)*8),z=A.z+(B.z-A.z)*t+(A.z===B.z?(R()-.5)*8:0);
    const o=makeCone(x,z);sc.remove(o);W0.add(o);o.userData.noBake=true;HUB.cones.push({o,x,z,hit:0,vx:0,vy:0,vz:0})}}
  /* ---- Publikum an den Bürgersteigen ---- */
  {const CC=['#d54291','#f0cf36','#47c2a5','#eae8e8','#2499bb','#f1a7c8'],SK=['#e0a98a','#c98e6a','#8a5a3c','#f0c8a8'];
   for(let k=0;k<40;k++){const i=Math.floor(R()*5),j=Math.floor(R()*5),side=Math.floor(R()*4),bx0=(i-2)*50,bz0=(j-2)*50,t=(R()-.5)*26;
     let px,pz,face;if(side===0){px=bx0+t;pz=bz0-19.2;face=Math.PI}else if(side===1){px=bx0+t;pz=bz0+19.2;face=0}else if(side===2){px=bx0-19.2;pz=bz0+t;face=-Math.PI/2}else{px=bx0+19.2;pz=bz0+t;face=Math.PI/2}
     const kk=1.15+R()*.2,top=CC[Math.floor(R()*6)],skin=SK[Math.floor(R()*4)];const g=new THREE.Group();
     const mk=(geo,col,x,y,z,sx=1,sy=1,sz=1)=>{const m=new THREE.Mesh(geo,SM({color:col,roughness:.7}));m.position.set(x,y,z);m.scale.set(sx,sy,sz);m.castShadow=true;g.add(m);return m};
     mk(new THREE.CapsuleGeometry(.3,.75,4,10),top,0,1.45,0);[-1,1].forEach(s=>mk(new THREE.CapsuleGeometry(.12,.7,4,8),'#312e42',s*.16,.5,0));mk(new THREE.SphereGeometry(.3,12,10),skin,0,2.3,0);
     if(R()<.6)mk(new THREE.SphereGeometry(.32,12,6,0,Math.PI*2,0,Math.PI/2),CC[Math.floor(R()*6)],0,2.34,0);[-1,1].forEach(s=>mk(new THREE.SphereGeometry(.1,8,6),'#141416',s*.13,2.34,.25));
     g.position.set(px,1.3,pz);g.rotation.y=face;g.scale.setScalar(kk);W0.add(g);
     const gm=SM({color:top,roughness:.7}),hm=SM({color:skin,roughness:.7}),up=R()<.55;
     [-1,1].forEach(s=>{const A=new THREE.Group(),ox=s*.38*kk;A.rotation.order='YXZ';A.position.set(px+ox*Math.cos(face),1.3+1.85*kk,pz-ox*Math.sin(face));A.rotation.y=face;A.scale.setScalar(kk);
       const a=new THREE.Mesh(new THREE.CapsuleGeometry(.09,.5,4,8),gm);a.position.y=-.36;A.add(a);const h=new THREE.Mesh(new THREE.SphereGeometry(.11,8,6),hm);h.position.y=-.72;A.add(h);const idle=up?s*2.5:s*.35;A.rotation.z=idle;A.userData.noBake=true;W0.add(A);HUB.clappers.push({A,s,idle,x:px,face,ph:R()*6.28,up})})}}
  /* ---- Items (für die Atoll-Quest): je ein Gegenstand vor einem passenden Gebäude ---- */
  {const RI=mulberry(4242);
   ITEM_DEFS.forEach((d,k)=>{const blocks=[];for(let j=0;j<5;j++)for(let i=0;i<5;i++)if((i+2*j)%5===d.type)blocks.push([i,j]);
     const far=blocks.filter(([i,j])=>Math.hypot((i-2)*50-HUB.sx,(j-2)*50-HUB.sz)>60);const pool=far.length?far:blocks;const [bi,bj]=pool[Math.floor(RI()*pool.length)];
     const ix=(bi-2)*50+(k%2?7:-7),iz=(bj-2)*50-22;
     const g=new THREE.Group();const mt=(c,e)=>new THREE.MeshStandardMaterial({color:c,roughness:.5,emissive:e||'#000000',emissiveIntensity:e?.35:0});
     const add2=(geo,m,x,y,z,sx=1,sy=1,sz=1,rx=0,ry=0,rz=0)=>{const o=new THREE.Mesh(geo,m);o.position.set(x,y,z);o.scale.set(sx,sy,sz);o.rotation.set(rx,ry,rz);o.castShadow=true;g.add(o);return o};
     if(d.id==='funk'){add2(BX,mt('#fff6ea','#fff6ea'),0,0,0,2.4,.16,3,.1,0,.1);add2(BX,mt(d.col,d.col),0,.12,-1.3,2.4,.12,.5,.1,0,.1);for(let q=0;q<4;q++)add2(BX,mt('#1a1626'),q%2?.2:0,.16,-.4+q*.6,q%2?1.2:1.8,.06,.14,.1,0,.1)}
     else if(d.id==='schraube'){add2(CY,mt(d.col,d.col),0,0,0,.6,2.6,.6,0,0,Math.PI/2);add2(CY,mt('#cfcfe0'),2.1,0,0,.2,2.2,.2,0,0,Math.PI/2);add2(BX,mt('#cfcfe0'),3.2,0,0,.3,.7,.12)}
     else if(d.id==='usb'){add2(BX,mt('#2a3a8a'),0,0,0,1.5,.7,3);add2(BX,mt('#cfcfe0'),0,0,1.9,1.1,.5,1.2);add2(SP,mt('#7be0a0','#7be0a0'),0,.45,-.8,.2,.12,.2)}
     else if(d.id==='handbuch'){add2(BX,mt(d.col,d.col),0,0,0,2.6,.7,3.4);add2(BX,mt('#fff6ea'),.1,0,0,2.3,.55,3.1);add2(BX,mt('#ff5f5f'),.9,.4,1.1,.35,.1,1.2)}
     else{add2(BX,mt('#fff6ea','#fff6ea'),0,0,0,1.8,.1,3.2);add2(BX,mt(d.col,d.col),0,.08,-.8,1.8,.1,.8);add2(CY,mt('#ffe066','#ffe066'),0,.1,.9,.5,.08,.5)}
     g.scale.setScalar(1.25);g.position.set(ix,4.2,iz);g.userData.noBake=true;g.userData.tier='actor';W0.add(g);
     const ring=new THREE.Mesh(new THREE.RingGeometry(1.8,2.5,28),BM(d.col,{transparent:true,opacity:.8,side:THREE.DoubleSide,depthWrite:false}));ring.rotation.x=-Math.PI/2;ring.position.set(ix,1.65,iz);ring.userData.noBake=true;ring.userData.noOutline=true;W0.add(ring);
     const beam=new THREE.Mesh(new THREE.CylinderGeometry(.9,.9,26,12,1,true),BM(d.col,{transparent:true,opacity:0,side:THREE.DoubleSide,depthWrite:false,fog:false}));beam.position.set(ix,14,iz);beam.userData.noBake=true;beam.userData.noOutline=true;W0.add(beam);
     const got=INV.items.has(d.id);g.visible=!got;ring.visible=!got;
     HUB.items.push({def:d,g,ring,beam,x:ix,z:iz,got,ph:k*1.3})})}
  bakeGroup(W0);
  /* Himmel: Skyline-Ring, Wolken (folgen / stehen) */
  const skyG=new THREE.Group();skyG.userData.noBake=true;W0.add(skyG);HUB.sky=skyG;
  for(let i=0;i<12;i++){const s=skySprite(SKYTEXF[i%4],320,160,false);const az=i/12*Math.PI*2;s.position.set(Math.cos(az)*340,75-24,Math.sin(az)*340);skyG.add(s)}
  addVictorians(skyG,[[10,292,190,76,30,.4,.1,120],[9,240,170,68,23,.16,.5,160]]);
  [[-120,48,-130],[40,56,-170],[150,44,-100],[-160,52,60],[90,50,160],[-30,60,150]].forEach(([x,y,z])=>{const c=makeCloud(x,y,z,90,Math.floor(Math.abs(x))%4,0);sc.remove(c);W0.add(c)});
  /* Start */
  const s0=nodeXZ(maze.id(2,3));HUB.sx=s0.x;HUB.sz=s0.z;const nb0=maze.adj[maze.id(2,3)][0],n0=nodeXZ(nb0);HUB.sh=Math.atan2(n0.z-s0.z,n0.x-s0.x);
  HUB.cones.forEach(c=>addOutlines(c.o,'prop'));HUB.portals.forEach(p=>addOutlines(p.g,'actor'));HUB.items.forEach(it=>addOutlines(it.g,'actor'));
  /* Minikarte */
  const S=150/310;const mc=document.createElement('canvas');mc.width=mc.height=150;const g=mc.getContext('2d');
  const pxz=(x,z)=>[(x+155)*S,(z+155)*S];g.fillStyle='#3a2a5a';g.fillRect(0,0,150,150);
  for(let j=0;j<5;j++)for(let i=0;i<5;i++){const [x,z]=pxz((i-2)*50-18,(j-2)*50-18);g.fillStyle=TCOL[HUB.blockType[j*5+i]];g.globalAlpha=.55;g.fillRect(x,z,36*S,36*S);g.globalAlpha=1}
  g.strokeStyle='#fff0b0';g.lineWidth=14*S;g.lineCap='butt';
  maze.all.forEach(([a,b])=>{if(!maze.open.has(maze.key(a,b)))return;const A=nodeXZ(a),B=nodeXZ(b),[x1,z1]=pxz(A.x,A.z),[x2,z2]=pxz(B.x,B.z);g.beginPath();g.moveTo(x1,z1);g.lineTo(x2,z2);g.stroke()});
  for(let n=0;n<N*N;n++){const A=nodeXZ(n),[x,z]=pxz(A.x,A.z);g.fillStyle='#fff0b0';g.fillRect(x-7*S,z-7*S,14*S,14*S)}
  g.fillStyle='#1cafd1';g.fillRect(0,0,pxz(-143,0)[0],150);g.fillStyle='#f4d89a';g.fillRect(pxz(-150,0)[0],0,5,150);
  g.fillStyle='#ff5f5f';HUB.barricades.forEach(b=>{const [x,z]=pxz(b.x,b.z);g.fillRect(x-(b.horiz?1.2:7)*S,z-(b.horiz?7:1.2)*S,(b.horiz?2.4:14)*S,(b.horiz?14:2.4)*S)});
  const ex=document.createElement('canvas');ex.width=ex.height=150;HUB.mm={map:mc,ex,exg:ex.getContext('2d'),tmp:document.createElement('canvas'),S,pxz};HUB.mm.tmp.width=HUB.mm.tmp.height=150;
  HUB.built=true}

function camClamp(from,to){let tmin=1;const dx=to.x-from.x,dz=to.z-from.z;
  for(const c of HUB.colliders){const x0=c.x0-.6,x1=c.x1+.6,z0=c.z0-.6,z1=c.z1+.6;let t0=0,t1=1;
    for(const [o,d,a,b] of [[from.x,dx,x0,x1],[from.z,dz,z0,z1]]){if(Math.abs(d)<1e-6){if(o<a||o>b){t0=2;break}}else{let ta=(a-o)/d,tb=(b-o)/d;if(ta>tb){const q=ta;ta=tb;tb=q}t0=Math.max(t0,ta);t1=Math.min(t1,tb);if(t0>t1){t0=2;break}}}
    if(t0<=1&&t0<tmin&&t0>=0)tmin=t0}
  const t=tmin<1?Math.max(.22,tmin-.06):1;return new V3(from.x+dx*t,to.y,from.z+dz*t)}
function resolveCity(){for(const c of HUB.colliders){
  const cx=Math.max(c.x0,Math.min(P.x,c.x1)),cz=Math.max(c.z0,Math.min(P.z,c.z1));let dx=P.x-cx,dz=P.z-cz;const d2=dx*dx+dz*dz,Rr=1.5;
  if(d2>=Rr*Rr||P.y>c.top)continue;let nx,nz;const d=Math.sqrt(d2);
  if(d>1e-4){nx=dx/d;nz=dz/d;P.x=cx+nx*Rr;P.z=cz+nz*Rr}
  else{const l=P.x-c.x0,r=c.x1-P.x,t=P.z-c.z0,b=c.z1-P.z,m=Math.min(l,r,t,b);if(m===l){nx=-1;nz=0;P.x=c.x0-Rr}else if(m===r){nx=1;nz=0;P.x=c.x1+Rr}else if(m===t){nx=0;nz=-1;P.z=c.z0-Rr}else{nx=0;nz=1;P.z=c.z1+Rr}}
  const hx=Math.cos(P.h),hz=Math.sin(P.h),dot=hx*nx+hz*nz;
  if(dot<0){const tx=hx-dot*nx,tz=hz-dot*nz;if(Math.hypot(tx,tz)>.15)P.h=Math.atan2(tz,tx);P.speed*=.93;
    if(-dot>.6&&P.speed>2.5&&G.t-(P.lastBump||0)>.4){SFX.thud();G.shake=Math.max(G.shake,.15);P.lastBump=G.t}}}}
function startCoastRace(){HUB.coastHit=1;SFX.win();burst(P.x,P.y+3,P.z,90);toast('Das Rennen beginnt!',1300);later(.5,()=>{applyLevel(1);beginPlay()})}
function enterPortal(p){HUB.found.add(p.world);SFX.win();burst(P.x,P.y+3,P.z,90);toast('Portal zu Welt '+p.world+'!',1200);
  later(.5,()=>{applyLevel(p.world);beginPlay()})}
function stepCity(dt){
  const steer=(K.right?1:0)-(K.left?1:0);P.turn+=(steer-P.turn)*Math.min(1,dt*9);
  const sf=.45+.55*Math.min(1,P.speed/5);P.h+=P.turn*dt*2.3*sf;
  const target=K.up?SPEED_MAX:(K.down?1.8:SPEED_CRUISE);P.speed+=(target-P.speed)*Math.min(1,dt*(K.up?1.5:1.1));
  P.x+=Math.cos(P.h)*P.speed*dt;P.z+=Math.sin(P.h)*P.speed*dt;{const gt=Math.abs(P.z-HUB.coastZ)<9.2;P.x=Math.max((gt||P.x<-139.5)?-190:-139,Math.min(139,P.x));if(P.x<-139.5)P.z=Math.max(HUB.coastZ-9,Math.min(HUB.coastZ+9,P.z));P.z=Math.max(-139,Math.min(139,P.z))}
  resolveCity();P.h=((P.h+Math.PI)%(Math.PI*2)+Math.PI*2)%(Math.PI*2)-Math.PI;
  P.vy-=LV.grav*dt;P.y+=P.vy*dt;if(P.y<=1.3){P.y=1.3;if(P.vy<0)P.vy=0}P.coy=P.y<=1.35?0:P.coy+dt;
  for(const c of cones){if(c.hit){c.o.position.x+=c.vx*dt;c.o.position.y+=c.vy*dt;c.o.position.z+=c.vz*dt;c.vy-=18*dt;c.o.rotation.x+=7*dt;c.o.rotation.z+=5*dt;c.hit-=dt;if(c.hit<=0)c.o.visible=false;continue}
    if(Math.abs(P.x-c.x)<1.3&&Math.abs(P.z-c.z)<1.3&&P.y<2.4){c.hit=1.1;c.vx=Math.cos(P.h)*P.speed*1.2;c.vz=Math.sin(P.h)*P.speed*.8+(Math.random()-.5)*4;c.vy=8;P.speed*=.6;SFX.thud();G.shake=Math.max(G.shake,.2)}}
  for(const p of HUB.portals){if(Math.hypot(P.x-p.x,P.z-p.z)<5.2&&G.phase==='play'&&!p.hit){p.hit=1;enterPortal(p)}}
  for(const it of HUB.items){if(!it.got&&G.phase==='play'&&Math.hypot(P.x-it.x,P.z-it.z)<3.6&&P.y<5.5)collectItem(it)}
  if(P.x<-150&&G.phase==='play'&&!HUB.coastHit)startCoastRace()}
function collectItem(it){it.got=true;it.g.visible=false;it.ring.visible=false;it.beam.material.opacity=0;INV.items.add(it.def.id);invSave();invRender();SFX.collect(INV.items.size);burst(it.x,4.5,it.z,60);
  toast(it.def.name+' gefunden!',1300);
  const n=INV.items.size,core=ITEM_DEFS.filter(d=>!d.bonus&&INV.items.has(d.id)).length;
  const say1={funk:'Ein Funkzettel. Wer schreibt heute noch in Geheimschrift? Du, ab jetzt.',schraube:'Ein Schraubendreher. Er passt bestimmt irgendwo. Das tun sie immer.',usb:'Ein USB-Stick. Beschriftet mit PATROUILLE. Das klingt nach Ärger.',handbuch:'Ein Handbuch mit abgerissener Seite 12. Natürlich.',losung:'Ein Bon mit einer Geheimlosung. Das Möwen-Menü gibt es also wirklich.'}[it.def.id];
  say('e',core===4&&!it.def.bonus?'Das war der Vierte. Genug für ein Atoll. Es gibt nur noch keins.':say1,3.4)}
function stepLevel0(dt){if(!W0||!W0.visible)return;HUB.items.forEach(it=>{if(it.got)return;const d=Math.hypot(P.x-it.x,P.z-it.z);it.g.rotation.y+=dt*1.6;it.g.position.y=4.2+Math.sin(G.t*2.2+it.ph)*.45;it.ring.scale.setScalar(1+.1*Math.sin(G.t*3+it.ph));it.beam.material.opacity=Math.max(0,Math.min(.3,(62-d)/36*.3))});HUB.sky.position.copy(cam.position);if(HUB.coastBeam)HUB.coastBeam.material.opacity=.2+.08*Math.sin(G.t*2.4);
  let nd=1e9;HUB.portals.forEach(p=>{const d=Math.hypot(P.x-p.x,P.z-p.z);p.beam.material.opacity=Math.max(0,Math.min(.45,(105-d)/75*.45));p.g.visible=d<78||HUB.found.has(p.world);p.g.children.forEach((c,i)=>{if(i>0)c.rotation.z+=dt*(i%2?1.4:-1.1)});if(!HUB.found.has(p.world)&&d<nd)nd=d});
  const r=$('radar');if(r){const open=nd<1e8;r.classList.toggle('on',G.phase==='play'&&open);if(open){const w=nd<30?'heiß!':nd<65?'warm':nd<115?'lauwarm':'kalt';$('radar-s').textContent=w;$('radar-s').dataset.t=w[0];$('radar-bar').style.setProperty('--p',Math.max(.04,Math.min(1,1-nd/190)))}}
  /* Minikarte */
  const mm=HUB.mm;if(!mm)return;mm.exg.fillStyle='#fff';mm.exg.beginPath();const [ex,ez]=mm.pxz(P.x,P.z);mm.exg.arc(ex,ez,52*mm.S,0,7);mm.exg.fill();
  HUB.mmT+=dt;if(HUB.mmT<.12)return;HUB.mmT=0;const cv=$('mini');if(!cv)return;cv.classList.toggle('on',G.phase==='play');const g=cv.getContext('2d'),t=mm.tmp.getContext('2d');
  t.globalCompositeOperation='source-over';t.clearRect(0,0,150,150);t.drawImage(mm.map,0,0);t.globalCompositeOperation='destination-in';t.drawImage(mm.ex,0,0);
  g.clearRect(0,0,150,150);g.fillStyle='#1a1626';g.fillRect(0,0,150,150);g.drawImage(mm.tmp,0,0);
  HUB.portals.forEach(p=>{if(HUB.found.has(p.world)){const [x,z]=mm.pxz(p.x,p.z);g.fillStyle=p.col;g.beginPath();g.arc(x,z,5,0,7);g.fill();g.fillStyle='#fff';g.font='700 9px sans-serif';g.textAlign='center';g.fillText(p.world,x,z+3)}});
  {const [gx,gz]=mm.pxz(-143,HUB.coastZ);g.fillStyle='#ffe066';g.fillRect(gx-1,gz-8*mm.S*1.6,5,16*mm.S*1.6);g.fillStyle='#1a1626';g.font='700 9px sans-serif';g.textAlign='left';g.fillText('K',gx+7,gz+3);g.fillStyle='#ffe066';g.fillText('K',gx+6,gz+3)}
  HUB.items.forEach(it=>{if(it.got){const [x,z]=mm.pxz(it.x,it.z);g.fillStyle=it.def.col;g.strokeStyle='#1a1626';g.lineWidth=1;g.beginPath();g.moveTo(x,z-4);g.lineTo(x+4,z);g.lineTo(x,z+4);g.lineTo(x-4,z);g.closePath();g.fill();g.stroke()}});
  g.save();g.translate(ex,ez);g.rotate(P.h);g.fillStyle='#ff5fa8';g.strokeStyle='#fff';g.lineWidth=1.5;g.beginPath();g.moveTo(7,0);g.lineTo(-5,-4.5);g.lineTo(-3,0);g.lineTo(-5,4.5);g.closePath();g.fill();g.stroke();g.restore();
  g.strokeStyle='#fff0b0';g.lineWidth=2;g.strokeRect(1,1,148,148)}

window.__qa={INV,HUB,enterPortal,stepCity,jump,fallRespawn,get GAPS(){return GAPS},L3,RIV,applyLevel,LEVELS,L2,get LV(){return LV},E,iceTower,Tk,doTrick,CLAPPERS,T,throwBoard,flyBoard,G,P,K,step,render,startChase,beginPlay,scoops,cones,resetRun,win,caught,setPix,say,get dino(){return dinoG},cam};
resize();showTitle();$('loading').remove();
let last=performance.now();
function loop(now){const dt=Math.min(.05,(now-last)/1000);last=now;step(dt);render();requestAnimationFrame(loop)}
if(TEST){step(.016);render();window.__ready=true}else requestAnimationFrame(t=>{last=t;loop(t)});
