/* ================= Arcade of Fate (Außenseite) =================
   Neuer Laden an der Ostseite des Blocks "Shopping Court" (Gebäude mit kind 'shopping'): eine flache Ladenfront auf der Ostwand (1,4 m tief, damit keine Straße verbaut wird), mit dem Logo des Nutzers (src/decals/arcade_of_fate.svg) als Schild.
   Nachts leuchten Lampen (gelb) und rote Schrift: das Logo bekommt eine Leuchtschicht (additiv, aus dem Logo selbst abgeleitet), die mit dem Tageslicht (DAY.dn) ein- und ausblendet.
   Der Laden ist zuerst geschlossen (Schild CLOSED). Innenraum und Öffnen folgen später. */
function mpArcadeLogoMat(){if(!AMART.mat.arcade)AMART.mat.arcade=new THREE.MeshBasicMaterial({map:amartTexture('arcade',DECAL_SVG.arcade,1024,345)});return AMART.mat.arcade}
/* Leuchtschicht: nur Lampen (cls-4) und rote Schrift (cls-2) aus dem Logo, mit Unschärfe, auf transparentem Grund. Rand von 40 Einheiten, damit nichts abgeschnitten wird. */
function mpArcadeGlowMat(){if(AMART.mat.arcadeGlow)return AMART.mat.arcadeGlow;
  const W=1024,H=Math.round(W*316.66/782.97),cv=document.createElement('canvas');cv.width=W;cv.height=H;
  const tx=new THREE.CanvasTexture(cv);tx.colorSpace=THREE.SRGBColorSpace;tx.anisotropy=4;
  let s=DECAL_SVG.arcade.replace(/<path class="cls-1"[^>]*\/>/,'').replace(/<path class="cls-3"[^>]*\/>/g,'')
    .replace(/<style>[\s\S]*?<\/style>/,'<style>.cls-2{fill:#ff2a2a;filter:url(#gr)}.cls-4{fill:#ffe066;filter:url(#gy)}</style><filter id="gr" x="-20%" y="-40%" width="140%" height="180%"><feGaussianBlur in="SourceGraphic" stdDeviation="3" result="b1"/><feGaussianBlur in="SourceGraphic" stdDeviation="9" result="b2"/><feMerge><feMergeNode in="b2"/><feMergeNode in="b2"/><feMergeNode in="b1"/><feMergeNode in="SourceGraphic"/></feMerge></filter><filter id="gy" x="-300%" y="-300%" width="700%" height="700%"><feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="b1"/><feGaussianBlur in="SourceGraphic" stdDeviation="7" result="b2"/><feMerge><feMergeNode in="b2"/><feMergeNode in="b1"/><feMergeNode in="SourceGraphic"/></feMerge></filter>')
    .replace(/viewBox="[^"]*"/,'width="'+W+'" height="'+H+'" viewBox="-40 -40 782.97 316.66"');
  const im=new Image();im.onload=()=>{const g=cv.getContext('2d');g.clearRect(0,0,W,H);g.drawImage(im,0,0,W,H);tx.needsUpdate=true};
  im.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(s);
  return AMART.mat.arcadeGlow=new THREE.MeshBasicMaterial({map:tx,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,opacity:0,toneMapped:false})}
/* Aus dem Tageslicht: 0 bei Tag, 1 bei Nacht. Wird beim Tag-und-Nacht-Schritt aufgerufen. */
function mpArcadeGlow(){const A=HUB.arcade;if(!A)return;const k=Math.max(0,Math.min(1,(.75-(DAY.dn===undefined?1:DAY.dn))/.5));
  A.glow.material.opacity=k*(.88+.12*Math.sin(performance.now()/260));A.glow.visible=k>.01;A.base.color.setScalar(1-.6*k)}
/* mk: Gruppen-Erzeuger (x,z), b: das Gebäude "Shopping Court". Der Block ist größer als seine kleinste Umrisslinie: darum die größte der Umrisse (b.c) nehmen. */
function mpArcade(mk,b){
  const SC=MP.SC,ar=r=>Math.abs(r.reduce((a,p,i)=>{const q=r[(i+1)%r.length];return a+p[0]*q[1]-q[0]*p[1]},0)/2),ring=b.c.slice().sort((p,q)=>ar(q)-ar(p))[0],o=mpObb(ring),ca=Math.cos(o.a),sa=Math.sin(o.a),u=[ca,sa],v=[-sa,ca];
  let n=Math.abs(u[0])>=Math.abs(v[0])?u:v;const isU=n===u;if(n[0]<0)n=[-n[0],-n[1]];             /* n zeigt nach Osten */
  const Dn=(isU?o.w:o.h)*SC,Tn=(isU?o.h:o.w)*SC,t=[n[1],-n[0]],th=Math.atan2(n[0],n[1]);
  const AD=1.4,AL=Math.max(9,Math.min(15,Tn)),cx0=mwx(o.cx),cz0=mwz(o.cy),off=Dn/2+AD/2-.3,TO=Math.max(0,Math.min(11,(Tn-AL)/2-1)),ax=cx0+n[0]*off+t[0]*TO,az=cz0+n[1]*off+t[1]*TO,bg=mk(ax,az);   /* TO: Anbau sitzt nicht in der Mitte, sondern etwas nach Norden (weg vom Straßenschild) */
  const P=(lx,lz)=>[ax+t[0]*lx+n[0]*lz,az+t[1]*lx+n[1]*lz],Y0=1.3,H=6.6,fz=AD/2;
  const wall=MT('#2a2352'),plin=MT('#0a0a3a'),red=MT('#ff2a2a'),dark=MT('#14102a'),bas=c=>new THREE.MeshBasicMaterial({color:c});
  const box=(lx,lz,y0,y1,w,d,mat,ns)=>{const m=new THREE.Mesh(BX,mat);m.scale.set(w,y1-y0,d);const p=P(lx,lz);m.position.set(p[0],(y0+y1)/2,p[1]);m.rotation.y=th;m.castShadow=!ns;m.receiveShadow=true;m.userData.noOutline=true;bg.add(m);return m};
  const plane=(lx,lz,yc,w,h,mat,flip)=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),mat);const p=P(lx,lz);m.position.set(p[0],yc,p[1]);m.rotation.y=th+(flip?Math.PI:0);m.userData.noBake=true;m.userData.noOutline=true;bg.add(m);return m};
  box(0,0,Y0,Y0+H,AL,AD,wall);box(0,0,Y0,Y0+.7,AL+.2,AD+.2,plin);box(0,0,Y0+H,Y0+H+.5,AL+.3,AD+.3,plin);box(0,0,Y0+H-.9,Y0+H,AL+.34,AD+.34,red,true);
  /* Eingang: Doppeltür mit dunklem Glas, davor eine Stufe, Schild CLOSED */
  box(0,fz+.12,Y0,Y0+3.3,3.4,.24,plin);box(0,fz+.24,Y0+.05,Y0+3.1,3,.12,bas('#1b3a5a'),true);box(0,fz+.3,Y0+.05,Y0+3.1,.12,.06,plin,true);
  plane(0,fz+.42,Y0+3.7,1.8,.45,signMat('CLOSED','#ff2a2a','#0a0a3a'));box(0,fz+1,Y0,Y0+.2,4,1.6,plin);
  /* Zwei Schaufenster mit leuchtenden Bildschirmen */
  [-1,1].forEach(s=>{const x=s*(AL/2-2.6);box(x,fz+.1,Y0+1.2,Y0+3.5,3.2,.2,plin);box(x,fz+.2,Y0+1.35,Y0+3.35,2.9,.1,bas('#1b3a5a'),true);
    [['#ffe066',-.8],['#ff7ab8',0],['#5ee0d0',.8]].forEach(([c,dx])=>box(x+dx,fz+.27,Y0+1.8,Y0+2.9,.6,.06,bas(c),true))});
  /* Schild mit dem Logo über der Tür (Platte, Logo, Leuchtschicht) */
  const sw=Math.min(AL-1.2,11.5),sh=sw*236.66/702.97,yc=Y0+3.7+sh/2+.9;
  box(0,fz+.2,yc-sh/2-.15,yc+sh/2+.15,sw+.4,.3,dark);const base=mpArcadeLogoMat();plane(0,fz+.38,yc,sw,sh,base);
  const gw=sw*782.97/702.97,gh=sh*316.66/236.66,glow=plane(0,fz+.42,yc,gw,gh,mpArcadeGlowMat());glow.renderOrder=3;
  /* Dach: Aufbauten */
  [-1,1].forEach(s=>box(s*AL*.28,0,Y0+H+.5,Y0+H+1.6,2.2,2,MT('#b9bdc9')));
  HUB.arcade={x:ax,z:az,nx:n[0],nz:n[1],L:AL,D:AD,door:P(0,fz+2.2),th,glow,base};
  mpArcadeGlow()}
