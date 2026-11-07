/* ================= L’Avateur: Schaufenster im viktorianischen Stil (Außenseite) =================
   Ein lachsrotes Painted-Lady-Haus im Süden bekommt im Erdgeschoss zwei große Schaufenster mit Sprossen, Oberlicht, Sockel, Pilastern und Schriftband
   (das Logo des Nutzers, src/decals/lavateur_logo.svg), dazwischen eine geschlossene Tür mit Schild "FERMÉ". In den Fenstern stehen Avatare wie Schaufensterpuppen.
   Innenraum und Öffnen folgen später (Timeline: erst wenn die Figur befreit ist). Die Fenster ragen wie ein Erker vor die Fassade; der Raster-Boden davor ist gesperrt. */
function mpAvateurLogoMat(){if(!AMART.mat.lav)AMART.mat.lav=new THREE.MeshBasicMaterial({map:amartTexture('lav',DECAL_SVG.lavateur,1024,390)});return AMART.mat.lav}
function mpAvateurFront(bg,b,sbest,h){
  const nx=sbest.nx,nz=sbest.nz,ux=-nz,uz=nx,ry=-Math.atan2(uz,ux),pry=Math.atan2(nx,nz),L=sbest.L,
    P=(t,n)=>[sbest.mx+ux*t+nx*n,sbest.mz+uz*t+nz*n],
    cream=MT('#fdf6e8'),navy=MT('#2e3191'),red=MT('#ec1c24'),rose=MT('#f6dfe2'),plinth=MT('#2e3191'),
    glass=new THREE.MeshStandardMaterial({color:'#cdeaf5',roughness:.1,metalness:0,transparent:true,opacity:.2,depthWrite:false,side:THREE.DoubleSide});
  const D=1.3,N0=.32,Y0=1.3,YS=Y0+.75,YT=Y0+2.45,YG=Y0+3.4,YF=YG+1.35,dw=2.2,pil=.45;
  const Ww=Math.max(2.2,Math.min(6.6,(L-dw-2*pil-1.4)/2));
  const box=(t,n,y0,y1,w,d,mat,noShadow)=>{const m=new THREE.Mesh(BX,mat);m.scale.set(w,y1-y0,d);const p=P(t,n);m.position.set(p[0],(y0+y1)/2,p[1]);m.rotation.y=ry;m.castShadow=!noShadow;m.userData.noOutline=true;bg.add(m);return m};
  const plane=(t,n,yc,w,hh,mat)=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(w,hh),mat);const p=P(t,n);m.position.set(p[0],yc,p[1]);m.rotation.y=pry;m.userData.noBake=true;m.userData.noOutline=true;bg.add(m);return m};
  const tOut=dw/2+Ww;
  /* Rückwand (hell, mit Spiegel) und Boden der Auslage */
  [-1,1].forEach(s=>{const tc=s*(dw/2+Ww/2);
    box(tc,N0+.02,Y0,YG,Ww,.04,rose);box(tc,N0+D/2,Y0,YS-.02,Ww,D,plinth);
    /* Sockel (gemauerter Fuß) unter dem Glas, mit Füllung */
    box(tc,N0+D,Y0,YS,Ww+.1,.18,navy);box(tc,N0+D+.1,YS-.08,YS,Ww+.2,.12,cream);
    for(let k=0;k<Math.max(1,Math.round(Ww/1.5));k++){const w=Ww/Math.max(1,Math.round(Ww/1.5)),tt=tc-Ww/2+w*(k+.5);box(tt,N0+D+.1,Y0+.14,YS-.2,w-.26,.05,red)}
    /* Glas und Sprossen: vorne, dazu die zwei Seiten des Erkers */
    plane(tc,N0+D,(YS+YG)/2,Ww,YG-YS,glass);
    [-1,1].forEach(e=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(D,YG-YS),glass);const p=P(tc+e*Ww/2,N0+D/2);m.position.set(p[0],(YS+YG)/2,p[1]);m.rotation.y=pry+Math.PI/2;m.userData.noOutline=true;bg.add(m)});
    const nv=Math.max(2,Math.round(Ww/1.6));for(let k=0;k<=nv;k++){const tt=tc-Ww/2+Ww*k/nv;box(tt,N0+D,YS,YG,.09,.1,cream,true)}
    box(tc,N0+D,YT-.05,YT+.05,Ww,.12,cream,true);                                                        /* Kämpfer */
    const nu=nv*2;for(let k=1;k<nu;k++){if(k%2===0)continue;const tt=tc-Ww/2+Ww*k/nu;box(tt,N0+D,YT,YG,.06,.08,cream,true)}  /* Oberlicht, feiner geteilt */
    box(tc,N0+D/2,YG-.03,YG+.03,Ww,D,cream,true)});
  /* Pilaster an den Enden und neben der Tür, mit Sockel und Kapitell */
  [-tOut,-dw/2,dw/2,tOut].forEach(t=>{box(t,N0+D*.5,Y0,YG+.1,.4,D+.12,cream);box(t,N0+D*.5,Y0,Y0+.35,.55,D+.2,cream);box(t,N0+D*.5,YG-.1,YG+.1,.6,D+.24,cream)});
  /* Tür: Rahmen, Blatt (dunkles Rot), Oberlicht mit Strahlen, Stufe */
  box(0,N0+.14,Y0,Y0+3.2,dw+.3,.28,cream);box(0,N0+.16,Y0,Y0+3.05,dw-.1,.2,MT('#7a1f2b'));box(0,N0+.28,Y0+.45,Y0+1.2,dw-.7,.06,MT('#5a1620'));box(0,N0+.28,Y0+1.5,Y0+2.7,dw-.7,.06,MT('#5a1620'));
  box(0,N0+.5,Y0,Y0+.18,dw+.8,1.0,cream);box(0,N0+1.0,Y0,Y0+.09,dw+1.2,.6,cream);
  box(.55,N0+.3,Y0+1.35,Y0+1.5,.1,.08,MT('#e8c76a'),true);                                               /* Türklinke */
  plane(0,N0+.46,Y0+2.0,1.0,.4,signMat('FERMÉ','#ec1c24','#fdf6e8'));
  /* Schriftband (marineblau) mit dem Logo, darüber ein Gesims */
  const FW=2*tOut+.9;box(0,N0+D*.5,YG,YF,FW,D+.26,navy);box(0,N0+D*.5,YF,YF+.28,FW+.5,D+.5,cream);box(0,N0+D*.5,YF+.28,YF+.4,FW+.2,D+.3,red);
  const LH=YF-YG-.2;plane(0,N0+D+.14,(YG+YF)/2,LH*2.626,LH,mpAvateurLogoMat());
  /* Figuren wie Schaufensterpuppen auf Podesten: verschiedene Wesen, alle gleich hoch (1,2), die Langen von der Seite gesehen, jede passt in ihre Hälfte der Auslage.
     Links Pink-Blob und Skater, rechts Dino und Goldzilla (Vorbilder im Moodboard: Roller-Kaiju, Daunen-Dino, Mecha). */
  const FIGS=[['pink',-1,-1],['skater',-1,1],['dino',1,-1],['gold',1,1]],HF=1.2,PH=.45,fd=D-.35,figs=[];
  FIGS.forEach(([kind,s,e],i)=>{
    let g,ang=0;
    if(kind==='skater'){g=skater(0,0,0,0,Object.keys(PRE)[1]||'#d54291',1);if(g.userData.board)g.userData.board.visible=false;if(g.userData.arms)g.userData.arms.forEach(({sg,s:a})=>{sg.rotation.z=a*.14})}
    else{g=kind==='dino'?dino(0,0,0,1,'#f0cf36'):mpBuildGiant(kind).g;g.visible=true;ang=s*Math.PI/2}   /* von der Seite, zur Tür hin */
    const holder=new THREE.Group();holder.add(g);g.rotation.y=ang;
    holder.updateMatrixWorld(true);let bb=new THREE.Box3().setFromObject(holder),sz=bb.getSize(new THREE.Vector3());
    const sc=Math.min(HF/sz.y,(Ww/2-.1)/sz.x,fd/sz.z);g.scale.multiplyScalar(sc);holder.updateMatrixWorld(true);bb=new THREE.Box3().setFromObject(holder);const c=bb.getCenter(new THREE.Vector3());
    g.position.set(-c.x,-bb.min.y,-c.z);
    const tt=s*(dw/2+Ww/2)+e*(Ww/4),p=P(tt,N0+D*.5+.02);holder.position.set(p[0],YS-.02+PH,p[1]);holder.rotation.y=pry;holder.userData.noBake=true;bg.add(holder);
    box(tt,N0+D*.5+.02,YS-.02,YS-.02+PH,Ww/2-.06,fd+.1,navy);box(tt,N0+D*.5+.02,YS-.02+PH-.05,YS-.02+PH,Ww/2,fd+.2,cream,true);
    figs.push({kind,holder,sc,h:+(sz.y*sc).toFixed(2),w:+(sz.x*sc).toFixed(2),d:+(sz.z*sc).toFixed(2)})});
  /* Straße und Kollision: der Erker steht vor der Fassade, davor ist der Boden gesperrt */
  /* Die Karten-Maske wird nach den Gebäuden gebaut und überschreibt Markierungen von hier: darum erst danach setzen (siehe HUB.markQ in mpBuildHub) */
  (HUB.markQ=HUB.markQ||[]);[-1,1].forEach(s=>{const c=P(s*(dw/2+Ww/2),N0+D/2+.1);HUB.markQ.push([c[0],c[1],Ww/2+.25,D/2+.35,Math.atan2(-uz,ux)])});
  HUB.avateur={figs,x:sbest.mx+nx*3.2,z:sbest.mz+nz*3.2,nx,nz,doorX:P(0,N0+1.4)[0],doorZ:P(0,N0+1.4)[1],L,Ww};
}
