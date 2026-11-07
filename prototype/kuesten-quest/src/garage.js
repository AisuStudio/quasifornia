/* ================= Akira’s Garage (Außenseite) =================
   Die Garage ersetzt Gebäude 6 (neben dem A-Mart, gegenüber vom Bahnhof) und das überlappende kleine Gebäude 8: beide werden zu einem langen, niedrigen Gebäude.
   Lange Ostseite zur Bahnhofsstraße: vier Rolltore in Gelb, darüber das Schild (Logo des Nutzers, src/decals/akiras_garage.svg).
   Westseite zum Parkplatz: Kundentür mit Schild CLOSED. Dach mit Schachbrett-Band in Violett und Gelb (die Farben des Logos). Innenraum und Öffnen folgen später. */
function mpGarageLogoMat(){if(!AMART.mat.garage)AMART.mat.garage=new THREE.MeshBasicMaterial({map:amartTexture('garage',DECAL_SVG.garage,1024,239)});return AMART.mat.garage}
function mpGarageCheckerMat(len){const rep=Math.max(2,Math.round(len/.55)),key='chk'+rep;if(AMART.mat[key])return AMART.mat[key];
  const c=document.createElement('canvas');c.width=64;c.height=32;const g=c.getContext('2d');g.fillStyle='#fff200';g.fillRect(0,0,64,32);g.fillStyle='#5000ff';g.fillRect(0,0,32,16);g.fillRect(32,16,32,16);
  const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.wrapS=THREE.RepeatWrapping;t.repeat.set(rep,1);t.magFilter=THREE.NearestFilter;return AMART.mat[key]=new THREE.MeshBasicMaterial({map:t})}
function mpGarage(bg,o){
  const SC=MP.SC,longW=o.w>=o.h,ang=o.a,ca=Math.cos(ang),sa=Math.sin(ang),u=[ca,sa],v=[-sa,ca],
    L=(longW?o.w:o.h)*SC,D=(longW?o.h:o.w)*SC,cx=mwx(o.cx),cz=mwz(o.cy);
  let t=longW?u:v,n=longW?v:u;if(n[0]<0)n=[-n[0],-n[1]];                     /* Front (n) nach Osten */
  t=[n[1],-n[0]];                                                               /* t wie bei Rotation y = atan2(nx,nz): lokales x */
  const th=Math.atan2(n[0],n[1]),P=(lx,lz)=>[cx+t[0]*lx+n[0]*lz,cz+t[1]*lx+n[1]*lz],Y0=1.3,H=7.2;
  const lav=MT('#f1eef9'),vio=MT('#5000ff'),yel=MT('#fff200'),yel2=MT('#d9cb00'),dark=MT('#2a2038'),glass=MT('#9fe6f0','#9fe6f0',.35);
  const box=(lx,lz,y0,y1,w,d,mat,ns)=>{const m=new THREE.Mesh(BX,mat);m.scale.set(w,y1-y0,d);const p=P(lx,lz);m.position.set(p[0],(y0+y1)/2,p[1]);m.rotation.y=th;m.castShadow=!ns;m.receiveShadow=true;m.userData.noOutline=true;bg.add(m);return m};
  const plane=(lx,lz,yc,w,h,mat,flip)=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),mat);const p=P(lx,lz);m.position.set(p[0],yc,p[1]);m.rotation.y=th+(flip?Math.PI:0);m.userData.noBake=true;m.userData.noOutline=true;bg.add(m);return m};
  const hz=D/2,hl=L/2;
  /* Baukörper, violetter Sockel, Dachrand, Schachbrett-Band */
  box(0,0,Y0,Y0+H,L,D,lav);box(0,0,Y0,Y0+.9,L+.2,D+.2,vio);box(0,0,Y0+H,Y0+H+.5,L+.3,D+.3,vio);
  [1,-1].forEach(s=>plane(0,s*(hz+.16),Y0+H-.35,L,.55,mpGarageCheckerMat(L),s<0));
  /* Ostseite: vier Rolltore mit Rippen, violetten Pfeilern und Leuchten */
  const dw=5.2,dh=4.3,pos=[-.36,-.12,.12,.36].map(f=>f*L*1.0);
  const px=[];for(let i=0;i<4;i++)px.push((i-1.5)*(L/4.4));
  px.forEach(x=>{box(x,hz+.1,Y0,Y0+dh+.4,dw+.6,.22,vio);box(x,hz+.24,Y0+.05,Y0+dh,dw,.12,yel);
    for(let k=1;k<9;k++)box(x,hz+.32,Y0+k*dh/9,Y0+k*dh/9+.07,dw-.1,.04,yel2,true);
    box(x,hz+.36,Y0+dh-.4,Y0+dh-.1,1.2,.08,dark,true);                                          /* Griff/Schloss */
    box(x,hz+.3,Y0+dh+.4,Y0+dh+.55,dw+.9,.35,dark,true)});                                       /* Lampenschiene */
  /* Schild mit dem Logo über den mittleren Toren */
  const sw=Math.min(12.5,L*.3),sh=sw/4.28;box(0,hz+.18,Y0+dh+.7,Y0+dh+.7+sh+.3,sw+.4,.3,dark);plane(0,hz+.36,Y0+dh+.7+sh/2+.15,sw,sh,mpGarageLogoMat());
  /* Westseite: Kundentür mit Glas, zwei Fenster, Schild CLOSED */
  box(0,-hz-.12,Y0,Y0+3.3,2.4,.24,vio);box(0,-hz-.22,Y0,Y0+3.1,1.9,.12,yel);box(0,-hz-.3,Y0+1.2,Y0+2.7,1.1,.06,glass,true);
  [-1,1].forEach(s=>box(s*5.5,-hz-.1,Y0+1.6,Y0+3.6,2.8,.2,glass,true));
  plane(0,-hz-.42,Y0+3.8,1.8,.45,signMat('CLOSED','#5000ff','#fff200'),true);
  box(0,-hz-1.0,Y0,Y0+.2,3.2,1.6,lav);                                                           /* Stufe */
  /* Dachaufbauten */
  [-1,0,1].forEach(s=>box(s*L*.28,0,Y0+H+.5,Y0+H+1.7,2.6,2.2,MT('#b9bdc9')));
  /* Vorplatz Ost: Reifenstapel und Fässer */
  [[-hl*.8,hz+1.2],[hl*.55,hz+1.4]].forEach(([lx,lz],i)=>{for(let k=0;k<3;k++){const m=new THREE.Mesh(CY,MT('#1c1f2b'));m.scale.set(.75,.32,.75);const p=P(lx,lz);m.position.set(p[0],Y0+.16+k*.32,p[1]);m.castShadow=true;bg.add(m)}});
  [[hl*.15,hz+1.5,'#5000ff'],[hl*.15+1.2,hz+1.5,'#fff200'],[-hl*.35,hz+1.3,'#5000ff']].forEach(([lx,lz,c])=>{const m=new THREE.Mesh(CY,MT(c));m.scale.set(.5,1.1,.5);const p=P(lx,lz);m.position.set(p[0],Y0+.55,p[1]);m.castShadow=true;bg.add(m)});
  HUB.garage={x:cx,z:cz,nx:n[0],nz:n[1],L,D,doors:px.map(x=>P(x,hz+2.5)),customerDoor:P(0,-hz-1.8),th};
}
