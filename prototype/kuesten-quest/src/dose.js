/* ================= Sprühdosen (Phil's Phantastic Phactory) =================
   Form und Aufdruck stammen aus den Vorlagen des Nutzers (src/decals/PHs_can.svg und PHs_UBIQ.svg, Originale mit allen Ebenen privat im Repo "lore").
   Die Dose besteht aus einem gedrehten Körper (Rand unten, Rand oben, Schulterkuppel, Düsenfuß, Schaft), einem Düsenkopf und einem gebogenen Aufdruck vorne.
   Der Aufdruck ist die SVG-Vorlage, als Bild auf eine Textur gezeichnet: Phil's-Oval und Farbmarke (Zacken mit farbigem Kreis, die Farbe ist die Farbe der Dose im Laden).
   UBIQ hat statt der Farbmarke den Schriftzug UBIQ. Alle Maße stehen in SVG-Einheiten der Vorlage (714 x 1883) und werden auf die Höhe H skaliert. */
const DOSE={H:.8,tex:{},mat:{},geo:null,lab:null,pending:0,BLACK:'#231f20'};
const DOSE_SVG_W=714.03,DOSE_SVG_H=1883.35,DOSE_BODY_TOP=516.4,DOSE_BODY_BOT=1826.24,DOSE_BODY_X0=22.89,DOSE_BODY_W=668.25;
function doseSvg(kind,color){
  let s=DECAL_SVG.can.replace('viewBox=','width="'+DOSE_SVG_W+'" height="'+DOSE_SVG_H+'" viewBox=');
  if(kind==='ubiq'){
    /* Farbmarke (Zacken und blauer Kreis) entfernen, dafür den Schriftzug UBIQ einsetzen */
    s=s.replace(/<path class="cls-3" d="M576\.19[^>]*\/>/,'').replace(/<circle class="cls-4"[^>]*\/>/,'');
    const inner=(DECAL_SVG.ubiq.match(/<g id="Layer_1-2">([\s\S]*)<\/g>/)||[0,''])[1].replace(/cls-1/g,'cls-3');
    s=s.replace('</g></svg>','<g transform="translate(106 1030) scale(.95)">'+inner+'</g></g></svg>')}
  else if(color)s=s.replace('#3c52a3',color);
  return s}
/* Textur aus der SVG (Körperbereich der Vorlage). Das Bild lädt später; die Textur aktualisiert sich dann selbst. */
function doseTexture(key,svg,w){
  if(DOSE.tex[key])return DOSE.tex[key];
  const h=Math.round(w*(DOSE_BODY_BOT-DOSE_BODY_TOP)/DOSE_BODY_W),cv=document.createElement('canvas');cv.width=w;cv.height=h;
  const g=cv.getContext('2d');g.fillStyle=DOSE.BLACK;g.fillRect(0,0,w,h);
  const tx=new THREE.CanvasTexture(cv);tx.colorSpace=THREE.SRGBColorSpace;tx.anisotropy=4;DOSE.tex[key]=tx;
  const im=new Image();DOSE.pending++;
  im.onload=()=>{g.clearRect(0,0,w,h);g.drawImage(im,DOSE_BODY_X0,DOSE_BODY_TOP,DOSE_BODY_W,DOSE_BODY_BOT-DOSE_BODY_TOP,0,0,w,h);tx.needsUpdate=true;DOSE.pending--};
  im.onerror=()=>{DOSE.pending--};
  im.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
  return tx}
/* Gedrehtes Profil der Dose (Radius, Höhe von unten), aus den Maßen der Vorlage */
function doseProfile(){
  const S=DOSE.H/DOSE_SVG_H,P=(r,y)=>new THREE.Vector2(r*S,(DOSE_SVG_H-y)*S),pts=[];
  const rim=(yBot,yTop,rOut)=>{const rr=(yBot-yTop)/2,cx=rOut-rr,cy=(yBot+yTop)/2;for(let i=0;i<=8;i++){const f=Math.PI/2-Math.PI*i/8;pts.push(P(cx+rr*Math.cos(f),cy+rr*Math.sin(f)))}};
  pts.push(P(0,1883.35));rim(1883.35,1826.24,357.0);
  pts.push(P(334.1,1826.24),P(334.1,516.4),P(328.5,516.4));rim(516.4,459.3,357.0);
  /* Schulterkuppel: Kreis um (0, 541.6) mit Radius 298.8, sichtbar von Höhe 459 bis zum Düsenfuß */
  const cy=541.64,R=298.84;for(let a=16;a<=70;a+=9)pts.push(P(R*Math.cos(a*Math.PI/180),cy-R*Math.sin(a*Math.PI/180)));pts.push(P(99.5,259.92));
  /* Düsenfuß (breite, runde Scheibe) und Schaft */
  const rr=28.55,cx=145.85-rr;for(let i=0;i<=6;i++){const f=Math.PI/2-Math.PI*i/6;pts.push(P(cx+rr*Math.cos(f),231.4+rr*Math.sin(f)))}
  pts.push(P(23.3,202.8),P(23.3,99.1),P(0,99.1));
  return pts}
function doseParts(){
  if(DOSE.geo)return DOSE.geo;const S=DOSE.H/DOSE_SVG_H;
  const body=new THREE.LatheGeometry(doseProfile(),20);
  const rB=334.1*S,hB=(DOSE_BODY_BOT-DOSE_BODY_TOP)*S;
  /* Gebogener Aufdruck vorne: 2 rad (rund 115 Grad), genau so breit wie die Vorlage, damit nichts gestaucht wird */
  const lab=new THREE.CylinderGeometry(rB*1.004,rB*1.004,hB,14,1,true,-1,2);lab.translate(0,(DOSE_SVG_H-(DOSE_BODY_TOP+DOSE_BODY_BOT)/2)*S,0);
  /* Weißer Streifen hinter dem Phil's-Oval (Vorlage: y 747.5, Höhe 27.75): läuft ganz um die Dose, unter dem gebogenen Aufdruck */
  const band=new THREE.CylinderGeometry(rB*1.002,rB*1.002,27.75*S,20,1,true);band.translate(0,(DOSE_SVG_H-(747.54+27.75/2))*S,0);
  /* Düsenkopf: oben breiter als unten, wie in der Vorlage */
  const act=new THREE.CylinderGeometry(67*S,50*S,169*S,12);act.translate(0,(DOSE_SVG_H-84.6)*S,0);
  const ring=new THREE.CircleGeometry(36.9*S,16);ring.translate(0,(DOSE_SVG_H-84.5)*S,60*S);
  const dot=new THREE.CircleGeometry(9.8*S,10);dot.translate(0,(DOSE_SVG_H-84.5)*S,60.5*S);
  return DOSE.geo={body,lab,band,act,ring,dot,S,rB}}
/* Eine Dose. kind: 'farbe' (mit Farbmarke in der Farbe color) oder 'ubiq' (Schriftzug UBIQ). w: Texturbreite in Pixeln. */
function makeSprayCan(kind,color,w){
  kind=kind==='ubiq'?'ubiq':'farbe';w=w||256;const G=doseParts(),key=kind==='ubiq'?'ubiq':'f'+(color||'')+w;
  if(!DOSE.mat[key]){DOSE.mat[key]=new THREE.MeshStandardMaterial({map:doseTexture(key,doseSvg(kind,color),kind==='ubiq'?Math.max(w,384):w),roughness:.55,metalness:.05})}
  if(!DOSE.bandMat)DOSE.bandMat=new THREE.MeshStandardMaterial({color:'#ffffff',roughness:.55,metalness:.05});
  const bm=MT(DOSE.BLACK),wm=MT('#ffffff'),g=new THREE.Group();
  const add=(geo,mat,cast=true)=>{const m=new THREE.Mesh(geo,mat);m.castShadow=cast;g.add(m);return m};
  add(G.body,bm);add(G.band,DOSE.bandMat,false);add(G.lab,DOSE.mat[key],false);add(G.act,bm);add(G.ring,wm,false);add(G.dot,bm,false);
  g.userData.kind=kind;g.userData.spray=true;return g}
