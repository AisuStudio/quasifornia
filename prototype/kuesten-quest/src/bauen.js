/* ================= Baukasten: Bauplätze und Builder =================
   Bauplätze kommen aus der Karte: Ein Text "Bauplatz" (oder "Bauplatz 24" für 24 m Kantenlänge, sonst 20 m) auf freier Fläche.
   Am Bauplatz startet der Builder direkt im Spiel: Die Kamera kreist über dem Grundstück, ein Gitter (Zellen von 2 m) erscheint, man setzt Teile.
   Jede Zelle hat höchstens ein Teil (Form, Dach oder Gartenteil) und auf jeder der vier Seiten eine Deko (Fenster, Tür, Balkon ...).
   Gespeichert wird pro Person im Browser (localStorage "kq-bau"); ein Server-Speicher, damit alle die Häuser sehen, ist noch nicht gebaut.
   Teile sind Einträge in BAU_PARTS: neue Formen, Fenster oder Möbel später einfach dort ergänzen. */
const BAU={C:2,LV:6,open:false,plot:null,tab:'form',part:'block',col:0,rot:0,tool:'put',undo:[],hover:null,backup:'',cam:{az:.9,el:.85,d:34},drag:null,ghost:null,ui:null,ray:null,store:null};
const BAU_COLS=['#f1a7c8','#a9e6d2','#f6df73','#a9d8f0','#f6c3a8','#e7b8e8','#eae8e8','#47c2a5','#d54291','#2a3a6a','#e5383b','#8a5a3c'];
const BAU_TABS=[['form','Formen'],['org','Organisch'],['dach','Dächer'],['oeff','Fenster & Türen'],['garten','Garten']];
const BAU_G={};  /* Geometrien einmal anlegen */
function bauGeo(k){if(BAU_G[k])return BAU_G[k];let g;
  if(k==='hemi')g=new THREE.SphereGeometry(1,12,6,0,Math.PI*2,0,Math.PI/2);
  else if(k==='pyr'){g=new THREE.ConeGeometry(1.4142,1,4);g.rotateY(Math.PI/4)}
  else if(k==='prism'){const s=new THREE.Shape();s.moveTo(-1,0);s.lineTo(1,0);s.lineTo(0,1.3);s.closePath();g=new THREE.ExtrudeGeometry(s,{depth:2,bevelEnabled:false});g.translate(0,0,-1)}
  else if(k==='wedge'){const s=new THREE.Shape();s.moveTo(-1,0);s.lineTo(1,0);s.lineTo(1,1.2);s.closePath();g=new THREE.ExtrudeGeometry(s,{depth:2,bevelEnabled:false});g.translate(0,0,-1)}
  else if(k==='ico'){g=new THREE.IcosahedronGeometry(1,1);const a=g.attributes.position;for(let i=0;i<a.count;i++)if(a.getY(i)<0)a.setY(i,0);g.computeVertexNormals()}
  else if(k==='barrel'){const s=new THREE.Shape();s.moveTo(-1,0);s.absarc(0,0,1,Math.PI,0,true);s.closePath();g=new THREE.ExtrudeGeometry(s,{depth:2,bevelEnabled:false,curveSegments:10});g.translate(0,0,-1)}
  return BAU_G[k]=g}
/* Teil bauen: g ist eine Gruppe in der Zelle (Mitte unten, 2 x 2 m, 2 m hoch); Dekos werden für die Seite +z gezeichnet und dann gedreht */
const bm=(g,geo,col,sx,sy,sz,x,y,z,em,ei)=>{const m=new THREE.Mesh(geo,MT(col,em,ei));m.scale.set(sx,sy,sz);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;g.add(m);return m};
const BAU_GLASS='#bfeeff';
const BAU_PARTS={
 block:{n:'Würfel',cat:'form',kind:'v',solid:1,mk:(g,c)=>{bm(g,BX,c,2,2,2,0,1,0)}},
 half:{n:'Platte',cat:'form',kind:'v',solid:1,mk:(g,c)=>{bm(g,BX,c,2,1,2,0,.5,0)}},
 wall:{n:'Mauer',cat:'form',kind:'v',solid:1,mk:(g,c)=>{bm(g,BX,c,2,2,.5,0,1,.75)}},
 round:{n:'Rundturm',cat:'form',kind:'v',solid:1,mk:(g,c)=>{bm(g,CY,c,.98,2,.98,0,1,0)}},
 pillar:{n:'Säule',cat:'form',kind:'v',solid:1,mk:(g,c)=>{bm(g,CY,c,.3,2,.3,0,1,0);bm(g,BX,c,.9,.2,.9,0,.1,0);bm(g,BX,c,.9,.2,.9,0,1.9,0)}},
 steps:{n:'Treppe',cat:'form',kind:'v',solid:1,mk:(g,c)=>{[0,1,2].forEach(i=>bm(g,BX,c,2,.6+i*.6,.66,0,(.6+i*.6)/2,-.67+i*.67))}},
 arch:{n:'Torbogen',cat:'form',kind:'v',solid:0,mk:(g,c)=>{bm(g,BX,c,.5,2,2,-.75,1,0);bm(g,BX,c,.5,2,2,.75,1,0);bm(g,BX,c,2,.5,2,0,1.75,0)}},
 geo:{n:'Geodätische Kuppel',cat:'org',kind:'v',solid:1,mk:(g,c)=>{bm(g,bauGeo('ico'),c,1.04,1.5,1.04,0,0,0)}},
 bubble:{n:'Blase',cat:'org',kind:'v',solid:1,mk:(g,c)=>{bm(g,SP,c,.96,.96,.96,0,.96,0)}},
 egg:{n:'Ei',cat:'org',kind:'v',solid:1,mk:(g,c)=>{bm(g,SP,c,.8,1.2,.8,0,1.2,0);bm(g,SP,c,.55,.35,.55,0,.2,0)}},
 ufo:{n:'Ufo-Scheibe',cat:'org',kind:'v',solid:1,mk:(g,c)=>{bm(g,CY,c,.98,.28,.98,0,.9,0);bm(g,CY,'#eae8e8',.6,.2,.6,0,.7,0);bm(g,bauGeo('hemi'),BAU_GLASS,.55,.6,.55,0,1.04,0,'#7fd8ff',.3)}},
 shell:{n:'Muschel',cat:'org',kind:'v',solid:1,mk:(g,c)=>{for(let i=0;i<5;i++)bm(g,bauGeo('hemi'),i%2?'#eae8e8':c,.98-i*.17,.5+i*.35,.98-i*.17,0,i*.12,0)}},
 tube:{n:'Röhre',cat:'org',kind:'v',solid:1,mk:(g,c)=>{const m=bm(g,CY,c,.7,1,.7,0,.8,0);m.rotation.x=Math.PI/2;m.scale.set(.7,1,.7);bm(g,SP,c,.7,.7,.7,0,.8,.95);bm(g,SP,c,.7,.7,.7,0,.8,-.95)}},
 gable:{n:'Satteldach',cat:'dach',kind:'v',solid:1,mk:(g,c)=>{bm(g,bauGeo('prism'),c,1.1,1,1,0,0,0)}},
 shed:{n:'Pultdach',cat:'dach',kind:'v',solid:1,mk:(g,c)=>{bm(g,bauGeo('wedge'),c,1,1,1,0,0,0)}},
 barrel:{n:'Tonnendach',cat:'dach',kind:'v',solid:1,mk:(g,c)=>{bm(g,bauGeo('barrel'),c,1,1.1,1,0,0,0)}},
 pyr:{n:'Pyramide',cat:'dach',kind:'v',solid:1,mk:(g,c)=>{bm(g,bauGeo('pyr'),c,1,1.8,1,0,.9,0)}},
 tent:{n:'Zeltspitze',cat:'dach',kind:'v',solid:1,mk:(g,c)=>{bm(g,CN,c,1.05,2.2,1.05,0,1.1,0)}},
 dome:{n:'Kuppel',cat:'dach',kind:'v',solid:1,mk:(g,c)=>{bm(g,bauGeo('hemi'),c,1.02,1.5,1.02,0,0,0)}},
 flat:{n:'Flachdach',cat:'dach',kind:'v',solid:1,mk:(g,c)=>{bm(g,BX,c,2.1,.25,2.1,0,.12,0);[[0,1],[0,-1],[1,0],[-1,0]].forEach(([a,b])=>bm(g,BX,'#eae8e8',a?.15:2.1,.35,b?.15:2.1,a*.97,.4,b*.97))}},
 roofgarden:{n:'Dachgarten',cat:'dach',kind:'v',solid:1,mk:(g,c)=>{bm(g,BX,'#9d7b55',2,.3,2,0,.15,0);bm(g,BX,'#6cbe45',1.8,.2,1.8,0,.38,0);[[-.5,.5],[.5,-.4],[.2,.6]].forEach(([a,b],i)=>bm(g,SP,['#ff5fa8','#ffe066','#ffffff'][i],.2,.2,.2,a,.62,b))}},
 chimney:{n:'Schornstein',cat:'dach',kind:'v',solid:0,mk:(g,c)=>{bm(g,BX,c,.6,1.8,.6,.5,.9,.4);bm(g,BX,'#3a3548',.8,.15,.8,.5,1.85,.4)}},
 solar:{n:'Solarzellen',cat:'dach',kind:'v',solid:0,mk:(g,c)=>{const m=bm(g,BX,'#2a3a6a',1.8,.08,1.6,0,.7,0,'#4cc3ff',.25);m.rotation.x=-.5;bm(g,BX,'#8a8a95',.1,.7,.1,-.7,.35,.5);bm(g,BX,'#8a8a95',.1,.7,.1,.7,.35,.5)}},
 antenna:{n:'Antenne',cat:'dach',kind:'v',solid:0,mk:(g,c)=>{bm(g,CY,'#8a8a95',.06,2,.06,0,1,0);bm(g,BX,'#8a8a95',1,.06,.06,0,1.6,0);bm(g,BX,'#8a8a95',.7,.06,.06,0,1.3,0);bm(g,SP,'#ff5fa8',.12,.12,.12,0,2.05,0,'#ff5fa8',.9)}},
 /* Dekos an den Seiten (gezeichnet für +z) */
 win:{n:'Fenster',cat:'oeff',kind:'d',mk:(g,c)=>{bm(g,BX,c,1,.9,.14,0,1.15,1.03);bm(g,BX,BAU_GLASS,.78,.7,.16,0,1.15,1.03,'#7fd8ff',.3);bm(g,BX,c,.06,.7,.18,0,1.15,1.04);bm(g,BX,c,.78,.06,.18,0,1.15,1.04)}},
 wint:{n:'Hohes Fenster',cat:'oeff',kind:'d',mk:(g,c)=>{bm(g,BX,c,.7,1.5,.14,0,1.05,1.03);bm(g,BX,BAU_GLASS,.5,1.3,.16,0,1.05,1.03,'#7fd8ff',.3)}},
 winr:{n:'Rundfenster',cat:'oeff',kind:'d',mk:(g,c)=>{const a=bm(g,CY,c,.5,.14,.5,0,1.15,1.03);a.rotation.x=Math.PI/2;const b=bm(g,CY,BAU_GLASS,.38,.16,.38,0,1.15,1.03,'#7fd8ff',.3);b.rotation.x=Math.PI/2}},
 port:{n:'Bullauge',cat:'oeff',kind:'d',mk:(g,c)=>{const a=bm(g,CY,'#d8dde3',.36,.16,.36,0,1.2,1.03);a.rotation.x=Math.PI/2;const b=bm(g,CY,BAU_GLASS,.26,.18,.26,0,1.2,1.03,'#7fd8ff',.3);b.rotation.x=Math.PI/2}},
 pano:{n:'Panoramafenster',cat:'oeff',kind:'d',mk:(g,c)=>{bm(g,BX,c,1.9,1.5,.12,0,1,1.02);bm(g,BX,BAU_GLASS,1.7,1.3,.14,0,1,1.03,'#7fd8ff',.3);bm(g,BX,c,.05,1.3,.16,0,1,1.04)}},
 door:{n:'Tür',cat:'oeff',kind:'d',mk:(g,c)=>{bm(g,BX,c,.95,1.55,.16,0,.78,1.03);bm(g,BX,'#3a3548',.8,1.42,.18,0,.74,1.04);bm(g,SP,'#f0cf36',.06,.06,.06,.3,.8,1.14)}},
 garage:{n:'Rolltor',cat:'oeff',kind:'d',mk:(g,c)=>{bm(g,BX,'#d8dde3',1.8,1.5,.14,0,.75,1.03);for(let i=0;i<5;i++)bm(g,BX,'#aab3bd',1.8,.04,.16,0,.2+i*.28,1.04)}},
 glass:{n:'Glastür',cat:'oeff',kind:'d',mk:(g,c)=>{bm(g,BX,c,1.8,1.7,.12,0,.85,1.02);bm(g,BX,BAU_GLASS,1.6,1.6,.14,0,.85,1.03,'#7fd8ff',.3);bm(g,BX,c,.06,1.6,.18,0,.85,1.04)}},
 balc:{n:'Balkon',cat:'oeff',kind:'d',mk:(g,c)=>{bm(g,BX,c,2,.14,.9,0,1,1.45);[-.95,.95].forEach(x=>bm(g,BX,'#eae8e8',.06,.7,.06,x,1.4,1.85));bm(g,BX,'#eae8e8',2,.06,.06,0,1.75,1.88);bm(g,BX,'#eae8e8',.06,.7,.8,-.97,1.4,1.45);bm(g,BX,'#eae8e8',.06,.7,.8,.97,1.4,1.45)}},
 awn:{n:'Markise',cat:'oeff',kind:'d',mk:(g,c)=>{for(let i=0;i<4;i++){const m=bm(g,BX,i%2?'#ffffff':c,.5,.06,.9,-.75+i*.5,1.6,1.4);m.rotation.x=.32}}},
 sign:{n:'Neonschild',cat:'oeff',kind:'d',mk:(g,c)=>{bm(g,BX,'#2a3a52',1.5,.5,.1,0,1.7,1.05);bm(g,BX,c,1.3,.3,.06,0,1.7,1.12,c,.9)}},
 /* Garten */
 tree:{n:'Baum',cat:'garten',kind:'v',solid:1,mk:(g,c)=>{bm(g,CY,'#8a5a3c',.18,1.2,.18,0,.6,0);bm(g,SP,c,.8,.8,.8,0,1.5,0)}},
 palm:{n:'Palme',cat:'garten',kind:'v',solid:1,mk:(g,c)=>{bm(g,CY,'#a67c52',.14,1.8,.14,0,.9,0);for(let i=0;i<5;i++){const a=i/5*Math.PI*2,l=bm(g,SP,'#47c2a5',.7,.08,.22,Math.cos(a)*.5,1.9,Math.sin(a)*.5);l.rotation.y=-a;l.rotation.z=-.2}}},
 bush:{n:'Busch',cat:'garten',kind:'v',solid:1,mk:(g,c)=>{bm(g,SP,c,.8,.6,.8,0,.5,0);bm(g,SP,c,.5,.4,.5,.4,.8,.2)}},
 flowers:{n:'Blumenbeet',cat:'garten',kind:'v',solid:0,mk:(g,c)=>{bm(g,BX,'#8a5a3c',1.8,.25,1.8,0,.12,0);for(let i=0;i<7;i++)bm(g,SP,BAU_COLS[(i*3)%BAU_COLS.length],.18,.18,.18,-.6+(i%3)*.6,.4,-.6+Math.floor(i/3)*.6)}},
 pond:{n:'Teich',cat:'garten',kind:'v',solid:0,mk:(g,c)=>{bm(g,CY,'#8a8a95',1.0,.12,1.0,0,.06,0);bm(g,CY,'#4cc3ff',.88,.14,.88,0,.07,0,'#4cc3ff',.2)}},
 pool:{n:'Pool',cat:'garten',kind:'v',solid:0,mk:(g,c)=>{bm(g,BX,'#eae8e8',2,.2,2,0,.1,0);bm(g,BX,'#4cc3ff',1.7,.22,1.7,0,.1,0,'#4cc3ff',.25)}},
 fence:{n:'Zaun',cat:'garten',kind:'v',solid:1,mk:(g,c)=>{bm(g,BX,c,2,.12,.1,0,.8,.9);bm(g,BX,c,2,.12,.1,0,.4,.9);for(let i=0;i<5;i++)bm(g,BX,c,.12,1,.12,-.9+i*.45,.5,.9)}},
 bench:{n:'Bank',cat:'garten',kind:'v',solid:0,mk:(g,c)=>{bm(g,BX,c,1.6,.12,.5,0,.5,0);bm(g,BX,c,1.6,.5,.1,0,.8,-.22);[-.6,.6].forEach(x=>bm(g,BX,'#3a3548',.1,.5,.4,x,.25,0))}},
 lamp:{n:'Laterne',cat:'garten',kind:'v',solid:0,mk:(g,c)=>{bm(g,CY,'#3a3548',.07,2,.07,0,1,0);bm(g,SP,'#fff0a8',.22,.22,.22,0,2.05,0,'#ffe066',.9)}}
};
const bauCx=(pl,gx)=>(gx-pl.NX/2+.5)*BAU.C,bauCz=(pl,gz)=>(gz-pl.NZ/2+.5)*BAU.C;
const bauOk=(pl,gx,gz)=>gx>=0&&gx<pl.NX&&gz>=0&&gz<pl.NZ&&(!pl.mask||pl.mask.has(gx+','+gz));
const bauKeyOf=o=>{while(o){if(o.userData&&o.userData.cellKey)return o.userData.cellKey;o=o.parent}return null};
const bauColOf=i=>BAU_COLS[((i%BAU_COLS.length)+BAU_COLS.length)%BAU_COLS.length];
function bauCellGroup(plot,key,cell){const [gx,gy,gz]=key.split(',').map(Number),g=new THREE.Group();
  g.position.set(bauCx(plot,gx),gy*BAU.C,bauCz(plot,gz));g.userData.cellKey=key;
  const P=BAU_PARTS[cell.v];if(P){const inner=new THREE.Group();inner.rotation.y=(cell.r||0)*Math.PI/4;P.mk(inner,bauColOf(cell.c));g.add(inner)}
  (cell.f||[]).forEach((f,i)=>{if(!f)return;const D=BAU_PARTS[f[0]];if(!D)return;const sub=new THREE.Group();sub.rotation.y=i*Math.PI/2;D.mk(sub,bauColOf(f[1]));g.add(sub)});
  g.traverse(o=>{if(o.isMesh)o.userData.cellKey=key});
  try{addOutlines(g,'prop')}catch(e){}
  return g}
function bauRefresh(plot,key){const old=plot.cg.get(key);if(old){plot.g.remove(old);old.traverse(o=>{if(o.isMesh&&o.userData.own&&o.geometry)o.geometry.dispose()});plot.cg.delete(key)}
  const cell=plot.cells.get(key);if(!cell)return;const g=bauCellGroup(plot,key,cell);plot.g.add(g);plot.cg.set(key,g)}
function bauSerialize(plot){const o={};plot.cells.forEach((c,k)=>{o[k]=[c.v,c.c,c.r||0,(c.f||[]).map(f=>f||0)]});return {cells:o,rew:plot.rew?1:0}}
function bauLoadInto(plot,data){plot.cells.clear();plot.cg.forEach(g=>plot.g.remove(g));plot.cg.clear();
  if(data&&data.cells)Object.keys(data.cells).forEach(k=>{const a=data.cells[k];if(!Array.isArray(a)||!BAU_PARTS[a[0]])return;const [gx,gy,gz]=k.split(',').map(Number);if(!(bauOk(plot,gx,gz)&&gy>=0&&gy<BAU.LV))return;
    plot.cells.set(k,{v:a[0],c:a[1]|0,r:a[2]|0,f:[0,1,2,3].map(i=>{const f=(a[3]||[])[i];return f&&BAU_PARTS[f[0]]?[f[0],f[1]|0]:0})})});
  plot.rew=!!(data&&data.rew);plot.cells.forEach((c,k)=>bauRefresh(plot,k))}
function bauStore(){if(BAU.store)return BAU.store;try{BAU.store=JSON.parse(localStorage.getItem('kq-bau')||'{}')||{}}catch(e){BAU.store={}}return BAU.store}
function bauSave(plot){const s=bauStore();s[plot.id]=bauSerialize(plot);try{localStorage.setItem('kq-bau',JSON.stringify(s))}catch(e){}}
/* Zellen, die den Weg versperren: Kollisionsfläche im Raster neu setzen */
function bauRaster(plot){const S=plot.snap;if(S){for(let y=0;y<S.h;y++)for(let x=0;x<S.w;x++){const i=(S.iy0+y)*MP.w+S.ix0+x;if(i>=0&&i<MP.cls.length&&S.iy0+y>=0&&S.ix0+x>=0&&S.ix0+x<MP.w)MP.cls[i]=S.data[y*S.w+x]}}
  const seen=new Set();plot.cells.forEach((c,k)=>{const P=BAU_PARTS[c.v];if(!P||!P.solid)return;const [gx,,gz]=k.split(',').map(Number),kk=gx+','+gz;if(seen.has(kk))return;seen.add(kk);
    const w=mpTf(plot.x,plot.z,plot.yaw,bauCx(plot,gx),bauCz(plot,gz));mpMarkRect(w[0],w[1],BAU.C/2,BAU.C/2,plot.yaw)})}
function bauSnap(plot){const hx=plot.NX*BAU.C/2+2,hz=plot.NZ*BAU.C/2+2,xs=[],zs=[];[[-hx,-hz],[hx,-hz],[hx,hz],[-hx,hz]].forEach(([a,b])=>{const w=mpTf(plot.x,plot.z,plot.yaw,a,b);xs.push(mux(w[0])-MP.PLAY.x0);zs.push(muy(w[1])-MP.PLAY.y0)});
  const ix0=Math.max(0,Math.floor(Math.min(...xs))),ix1=Math.min(MP.w-1,Math.ceil(Math.max(...xs))),iy0=Math.max(0,Math.floor(Math.min(...zs))),iy1=Math.min(MP.h-1,Math.ceil(Math.max(...zs)));
  const w=ix1-ix0+1,hh=iy1-iy0+1,data=new Uint8Array(Math.max(0,w*hh));if(!MP.cls||w<=0||hh<=0)return null;for(let y=0;y<hh;y++)for(let x=0;x<w;x++)data[y*w+x]=MP.cls[(iy0+y)*MP.w+ix0+x];return {ix0,iy0,w,h:hh,data}}
/* Bauplatz anlegen (aus der Karte oder per Test). size in Metern (Quadrat); o: {NX,NZ,poly (lokale Eckpunkte in m),mask (Set "gx,gz"),type}. */
function bauAddPlot(x,z,yaw,size,id,o){o=o||{};const NX=o.NX||Math.max(4,Math.min(18,Math.round((size||20)/2))),NZ=o.NZ||NX,
  plot={id:id||('p'+Math.round(x)+'_'+Math.round(z)),x,z,yaw,NX,NZ,type:o.type||'frei',mask:o.mask||null,poly:o.poly||null,g:new THREE.Group(),cells:new Map(),cg:new Map(),rew:false,snap:null,site:null,grid:null,pick:null};
  plot.snap=bauSnap(plot);const y0=typeof cityGround==='function'?cityGround(x,z):1.3;
  plot.g.position.set(x,y0,z);plot.g.rotation.y=yaw;plot.g.userData.noBake=true;W0.add(plot.g);
  const SX=NX*BAU.C,SZ=NZ*BAU.C,site=new THREE.Group();plot.site=site;plot.g.add(site);
  const poly=plot.poly||[[-SX/2,-SZ/2],[SX/2,-SZ/2],[SX/2,SZ/2],[-SX/2,SZ/2]];
  {const sh=new THREE.Shape(poly.map(q=>new THREE.Vector2(q[0],-q[1]))),geo=new THREE.ShapeGeometry(sh);geo.rotateX(-Math.PI/2);const base=new THREE.Mesh(geo,MT('#d9c7a0'));base.position.y=.05;base.receiveShadow=true;site.add(base)}
  poly.forEach((q,i)=>{const p=new THREE.Mesh(CY,MT('#f0cf36'));p.scale.set(.18,1.5,.18);p.position.set(q[0],.8,q[1]);p.castShadow=true;site.add(p);const t=new THREE.Mesh(SP,MT('#ff8a2a'));t.scale.set(.3,.3,.3);t.position.set(q[0],1.6,q[1]);site.add(t);
    const b=poly[(i+1)%poly.length],dx=b[0]-q[0],dz=b[1]-q[1],len=Math.hypot(dx,dz),tp=new THREE.Mesh(BX,MT(i%2?'#ffe066':'#141416'));tp.scale.set(len,.12,.08);tp.position.set((q[0]+b[0])/2,1.1,(q[1]+b[1])/2);tp.rotation.y=-Math.atan2(dz,dx);site.add(tp)});
  {/* Schild an der Kante, die der Straße am nächsten liegt (sonst vorne) */
    let best=0,bd=1e9;poly.forEach((q,i)=>{const b=poly[(i+1)%poly.length],m=mpTf(x,z,yaw,(q[0]+b[0])/2,(q[1]+b[1])/2);const n=typeof mpNearRoad==='function'?mpNearRoad(mux(m[0]),muy(m[1])):null;const d=n?n.d:i;if(d<bd){bd=d;best=i}});
    const a=poly[best],b=poly[(best+1)%poly.length],mx=(a[0]+b[0])/2,mz=(a[1]+b[1])/2,ang=Math.atan2(b[1]-a[1],b[0]-a[0]),nx=(b[1]-a[1]),nz=-(b[0]-a[0]),cs=poly.reduce((u,q)=>[u[0]+q[0]/poly.length,u[1]+q[1]/poly.length],[0,0]),out=(nx*(mx-cs[0])+nz*(mz-cs[1]))>=0?1:-1;
    const cv=document.createElement('canvas');cv.width=512;cv.height=160;const c=cv.getContext('2d');c.fillStyle=plot.type==='gewerbe'?'#8fd0ff':plot.type==='wohn'?'#ffb8d8':'#ffe066';c.fillRect(0,0,512,160);c.strokeStyle='#141416';c.lineWidth=10;c.strokeRect(5,5,502,150);c.fillStyle='#141416';c.font='800 '+(bauTypeName(plot).length>9?52:78)+'px "Smarta Nova","Trebuchet MS",sans-serif';c.textAlign='center';c.textBaseline='middle';c.fillText(bauTypeName(plot).toUpperCase(),256,84);
    const tx=new THREE.CanvasTexture(cv);tx.colorSpace=THREE.SRGBColorSpace;const sg=new THREE.Mesh(new THREE.PlaneGeometry(4.6,1.4),new THREE.MeshBasicMaterial({map:tx}));sg.position.set(mx+out*Math.sin(ang)*.0,2.7,mz);sg.rotation.y=-Math.atan2(nz*out,nx*out)+Math.PI/2-Math.PI/2;
    sg.rotation.y=Math.atan2(nx*out,nz*out);site.add(sg);const pl=new THREE.Mesh(CY,MT('#8a8a95'));pl.scale.set(.1,2.5,.1);pl.position.set(mx,1.25,mz);site.add(pl)}
  const pk=new THREE.Mesh(new THREE.PlaneGeometry(SX+8,SZ+8),new THREE.MeshBasicMaterial({visible:false}));pk.rotation.x=-Math.PI/2;pk.position.y=.1;plot.g.add(pk);plot.pick=pk;
  {const pts=[],V=(a,b,c)=>new THREE.Vector3(a,.14,b);for(let gx=0;gx<NX;gx++)for(let gz=0;gz<NZ;gz++){if(!bauOk(plot,gx,gz))continue;const x0=gx*BAU.C-SX/2,z0=gz*BAU.C-SZ/2,x1=x0+BAU.C,z1=z0+BAU.C;pts.push(V(x0,z0),V(x1,z0),V(x1,z0),V(x1,z1),V(x1,z1),V(x0,z1),V(x0,z1),V(x0,z0))}
    const gr=new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(pts),new THREE.LineBasicMaterial({color:'#ffffff',transparent:true,opacity:.7}));gr.visible=false;plot.g.add(gr);plot.grid=gr}
  const data=bauStore()[plot.id];if(data){bauLoadInto(plot,data);bauRaster(plot)}bauSiteUpdate(plot);
  (HUB.plots||(HUB.plots=[])).push(plot);return plot}
function bauSiteUpdate(plot){/* Baustellen-Zubehör weg, sobald etwas steht */const built=plot.cells.size>0;plot.site.children.forEach((o,i)=>{if(i>0)o.visible=!built});plot.site.children[0].material=MT(built?'#9fd68a':'#d9c7a0')}
function bauPlotsFromMap(){HUB.plots=HUB.plots||[];HUB.plotWarn=[];const L=(typeof MAPD!=='undefined'&&MAPD.labels)||[];
  const typeOf=ring=>{const l=L.find(l=>/plot|bauplatz|grundst/i.test(l.t)&&mpInPoly(ring,l.x,l.y));return !l?'frei':/re[cs]i?d|wohn/i.test(l.t)?'wohn':/commerc|gewerb/i.test(l.t)?'gewerbe':'frei'};
  (MAPD.plots||[]).forEach((pl,i)=>{const ring=pl.c[0];if(!ring||ring.length<3)return;const o=mpObb(ring),X=mwx(o.cx),Z=mwz(o.cy);
    /* Raster: Achse u (Breite) der Karte wird lokales x. Gruppendrehung = -Winkel. */
    let yaw=-o.a;const wM=o.w*MP.SC,hM=o.h*MP.SC;let NX=Math.max(3,Math.floor(wM/BAU.C)),NZ=Math.max(3,Math.floor(hM/BAU.C));NX=Math.min(NX,18);NZ=Math.min(NZ,18);
    /* lokale Eckpunkte */
    const loc=ring.map(q=>{const dx=mwx(q[0])-X,dz=mwz(q[1])-Z;return [dx*Math.cos(yaw)-dz*Math.sin(yaw),dx*Math.sin(yaw)+dz*Math.cos(yaw)]});
    /* Zellen, deren Mitte im Umriss liegt */
    const mask=new Set(),inP=(x,z)=>{let c=false;for(let a=0,b=loc.length-1;a<loc.length;b=a++){const A=loc[a],B=loc[b];if((A[1]>z)!==(B[1]>z)&&x<(B[0]-A[0])*(z-A[1])/(B[1]-A[1])+A[0])c=!c}return c};
    for(let gx=0;gx<NX;gx++)for(let gz=0;gz<NZ;gz++)if(inP((gx-NX/2+.5)*BAU.C,(gz-NZ/2+.5)*BAU.C))mask.add(gx+','+gz);
    if(mask.size<4){HUB.plotWarn.push('Bauplatz '+i+' ist zu klein');return}
    /* +z soll zur Straße zeigen */
    const nr=mpNearRoad(o.cx,o.cy);if(nr){const wx=mwx(nr.x)-X,wz=mwz(nr.y)-Z,lz=wx*Math.sin(yaw)+wz*Math.cos(yaw);if(lz<0){yaw+=Math.PI;loc.forEach(q=>{q[0]=-q[0];q[1]=-q[1]});const m2=new Set();mask.forEach(k=>{const [a,b]=k.split(',').map(Number);m2.add((NX-1-a)+','+(NZ-1-b))});mask.clear();m2.forEach(k=>mask.add(k))}}
    if(typeof mpFree==='function'&&!mpAt(X,Z))HUB.plotWarn.push('Bauplatz '+i+' liegt im Wasser');
    bauAddPlot(X,Z,yaw,0,'plot'+i,{NX,NZ,poly:loc,mask,type:typeOf(ring)})});
  /* Alte Textmarke (Bauplatz / Bauplatz 24) als Quadrat, falls keine Umrisse in der Karte stehen */
  if(!(MAPD.plots||[]).length)L.forEach(l=>{if(!/^\s*Bauplatz/i.test(l.t))return;const m=l.t.match(/(\d+)/),size=m?Math.max(8,Math.min(36,+m[1])):20,ux=l.x,uy=l.y,X=mwx(ux),Z=mwz(uy);if(HUB.plots.some(p=>Math.hypot(p.x-X,p.z-Z)<2))return;
    bauAddPlot(X,Z,typeof mpFrontYaw==='function'?mpFrontYaw(ux,uy):0,size)})}
/* Aktionen am Bauplatz */
function bauActs(a){(HUB.plots||[]).forEach(p=>{if(Math.hypot(P.x-p.x,P.z-p.z)>60)return;const built=p.cells.size>0;
  a.push({x:p.x,z:p.z,r:Math.max(p.NX,p.NZ)*BAU.C*.5+3.5,label:(built?'Umbauen: ':'Bauen: ')+bauTypeName(p),fn:()=>bauOpen(p)})})}
function bauCounts(plot){const o={vol:0,door:0,win:0,roof:0,garden:0,shop:0,sign:0};plot.cells.forEach(c=>{const P=BAU_PARTS[c.v];if(P){if(P.cat==='dach')o.roof++;else if(P.cat==='garten')o.garden++;else o.vol++}
  (c.f||[]).forEach(f=>{if(!f)return;if(f[0]==='pano'||f[0]==='glass')o.shop++;if(f[0]==='sign')o.sign++;if(f[0]==='door'||f[0]==='garage'||f[0]==='glass')o.door++;else if(['win','wint','winr','port','pano'].includes(f[0]))o.win++})});return o}
const BAU_REQS={
  wohn:[['Bauteile (4)',c=>c.vol>=4],['Tür oder Tor',c=>c.door>=1],['Fenster (2)',c=>c.win>=2],['Dach',c=>c.roof>=1],['Garten (1 Teil)',c=>c.garden>=1]],
  gewerbe:[['Bauteile (4)',c=>c.vol>=4],['Tür oder Tor',c=>c.door>=1],['Schaufenster (Panorama oder Glastür)',c=>c.shop>=1],['Neonschild',c=>c.sign>=1]],
  frei:[['Bauteile (4)',c=>c.vol>=4],['Tür oder Tor',c=>c.door>=1],['Fenster (2)',c=>c.win>=2]]};
const bauReq=pl=>BAU_REQS[pl.type]||BAU_REQS.frei;
const bauTypeName=pl=>pl.type==='wohn'?'Wohngrundstück':pl.type==='gewerbe'?'Gewerbegrundstück':'Bauplatz';
const BAU_REWARD=50;
/* ---- Builder-Oberfläche ---- */
function bauUi(){if(BAU.ui)return BAU.ui;const d=document.createElement('div');d.id='bld';d.hidden=true;
  d.innerHTML='<h2 id="bld-h">Bauplatz</h2><div id="bld-tabs"></div><div id="bld-parts"></div><div id="bld-cols"></div><div id="bld-tools"></div><div id="bld-req"></div><p id="bld-hint">Klick: setzen · Rechtsklick: entfernen · Ziehen: Kamera · Rad: Zoom · R: drehen · Z: zurück</p><div id="bld-end"><button type="button" id="bld-done" class="btn">Fertig · Esc</button><button type="button" id="bld-cancel" class="btn sec">Abbrechen</button></div>';
  (document.getElementById('ui')||document.body).appendChild(d);BAU.ui=d;
  d.querySelector('#bld-done').onclick=()=>bauClose(true);d.querySelector('#bld-cancel').onclick=()=>bauClose(false);return d}
function bauUiRender(){const d=bauUi(),pl=BAU.plot;if(!pl)return;d.querySelector('#bld-h').textContent=bauTypeName(pl);
  d.querySelector('#bld-tabs').innerHTML=BAU_TABS.map(([k,n])=>`<button type="button" data-t="${k}" aria-pressed="${BAU.tab===k}">${n}</button>`).join('');
  d.querySelector('#bld-parts').innerHTML=Object.keys(BAU_PARTS).filter(k=>BAU_PARTS[k].cat===BAU.tab).map(k=>`<button type="button" data-p="${k}" aria-pressed="${BAU.tool==='put'&&BAU.part===k}"><i style="background:${bauColOf(BAU.col)}"></i>${BAU_PARTS[k].n}</button>`).join('');
  d.querySelector('#bld-cols').innerHTML=BAU_COLS.map((c,i)=>`<button type="button" data-c="${i}" aria-label="Farbe ${i+1}" aria-pressed="${BAU.col===i}" style="background:${c}"></button>`).join('');
  d.querySelector('#bld-tools').innerHTML=[['rot','Drehen (R)'],['paint','Pinsel (P)'],['erase','Radierer (X)'],['undo','Zurück (Z)']].map(([k,n])=>`<button type="button" data-k="${k}" aria-pressed="${(k==='paint'||k==='erase')&&BAU.tool===k}">${n}</button>`).join('');
  const cn=bauCounts(pl);d.querySelector('#bld-req').innerHTML='<b>Bauauftrag</b>'+bauReq(pl).map(([n,f])=>`<span class="${f(cn)?'ok':''}">${f(cn)?'✓':'○'} ${n}</span>`).join('')+(pl.rew?'<span class="ok">Belohnung erhalten</span>':'<span>Belohnung: '+BAU_REWARD+' Scoops</span>');
  d.querySelectorAll('#bld-tabs button').forEach(b=>b.onclick=()=>{BAU.tab=b.dataset.t;const first=Object.keys(BAU_PARTS).find(k=>BAU_PARTS[k].cat===BAU.tab);if(BAU.tool==='put')BAU.part=first;bauUiRender()});
  d.querySelectorAll('#bld-parts button').forEach(b=>b.onclick=()=>{BAU.part=b.dataset.p;BAU.tool='put';bauUiRender()});
  d.querySelectorAll('#bld-cols button').forEach(b=>b.onclick=()=>{BAU.col=+b.dataset.c;bauUiRender()});
  d.querySelectorAll('#bld-tools button').forEach(b=>b.onclick=()=>{const k=b.dataset.k;if(k==='rot')BAU.rot=(BAU.rot+1)&7;else if(k==='undo')bauUndo();else BAU.tool=BAU.tool===k?'put':k;bauGhost();bauUiRender()})}
/* ---- Setzen, Entfernen, Malen (auch für Tests) ---- */
function bauPush(plot,key){BAU.undo.push([key,plot.cells.has(key)?JSON.parse(JSON.stringify(plot.cells.get(key))):null]);if(BAU.undo.length>120)BAU.undo.shift()}
function bauPutVol(plot,gx,gy,gz,id,c,r){const key=gx+','+gy+','+gz;if(!BAU_PARTS[id]||BAU_PARTS[id].kind!=='v')return false;if(!bauOk(plot,gx,gz)||gy<0||gy>=BAU.LV)return false;if(plot.cells.has(key))return false;
  bauPush(plot,key);plot.cells.set(key,{v:id,c:c|0,r:r|0,f:[0,0,0,0]});bauRefresh(plot,key);return true}
function bauPutDeco(plot,gx,gy,gz,face,id,c){const key=gx+','+gy+','+gz,cell=plot.cells.get(key);if(!cell||!BAU_PARTS[id]||BAU_PARTS[id].kind!=='d'||face<0||face>3)return false;
  bauPush(plot,key);cell.f=cell.f||[0,0,0,0];cell.f[face]=[id,c|0];bauRefresh(plot,key);return true}
function bauErase(plot,key,face){const cell=plot.cells.get(key);if(!cell)return false;bauPush(plot,key);
  if(face!==undefined&&face>=0&&cell.f&&cell.f[face])cell.f[face]=0;else plot.cells.delete(key);bauRefresh(plot,key);return true}
function bauPaint(plot,key,face,c){const cell=plot.cells.get(key);if(!cell)return false;bauPush(plot,key);if(face>=0&&cell.f&&cell.f[face])cell.f[face][1]=c;else cell.c=c;bauRefresh(plot,key);return true}
function bauUndo(){const pl=BAU.plot,u=BAU.undo.pop();if(!pl||!u)return;const [key,old]=u;if(old)pl.cells.set(key,old);else pl.cells.delete(key);bauRefresh(pl,key);if(BAU.ui)bauUiRender()}
/* ---- Zeigen mit der Maus ---- */
function bauPick(ev){const pl=BAU.plot;if(!pl)return null;const rc=r.domElement.getBoundingClientRect();if(!BAU.ray)BAU.ray=new THREE.Raycaster();
  const ndc=new THREE.Vector2((ev.clientX-rc.left)/rc.width*2-1,-((ev.clientY-rc.top)/rc.height*2-1));BAU.ray.setFromCamera(ndc,cam);
  pl.g.updateMatrixWorld(true);const hits=BAU.ray.intersectObjects([pl.pick,...pl.cg.values()],true);if(!hits.length)return null;const h=hits[0],key=bauKeyOf(h.object);
  const inv=pl.g.quaternion.clone().invert();
  if(key&&pl.cells.has(key)){const n=h.face.normal.clone().transformDirection(h.object.matrixWorld).applyQuaternion(inv),ax=Math.abs(n.x)>Math.abs(n.y)&&Math.abs(n.x)>Math.abs(n.z)?'x':Math.abs(n.z)>Math.abs(n.y)?'z':'y';
    const [gx,gy,gz]=key.split(',').map(Number),sg=Math.sign(ax==='x'?n.x:ax==='z'?n.z:n.y)||1,face=ax==='z'?(sg>0?0:2):ax==='x'?(sg>0?1:3):-1;
    return {key,cell:[gx,gy,gz],face,next:ax==='x'?[gx+sg,gy,gz]:ax==='z'?[gx,gy,gz+sg]:[gx,gy+sg,gz],part:true}}
  const lp=pl.g.worldToLocal(h.point.clone()),gx=Math.floor(lp.x/BAU.C+pl.NX/2),gz=Math.floor(lp.z/BAU.C+pl.NZ/2);
  return {key:null,cell:[gx,0,gz],face:-1,next:[gx,0,gz],part:false}}
function bauGhost(){const pl=BAU.plot;if(BAU.ghost){if(BAU.ghost.parent)BAU.ghost.parent.remove(BAU.ghost);BAU.ghost=null}
  const t=BAU.hover;if(!pl||!t||BAU.tool!=='put')return;const P=BAU_PARTS[BAU.part];if(!P)return;const g=new THREE.Group();let cx,cy,cz;
  if(P.kind==='v'){[cx,cy,cz]=t.next;if(!bauOk(pl,cx,cz)||cy<0||cy>=BAU.LV||pl.cells.has(cx+','+cy+','+cz))return;const inner=new THREE.Group();inner.rotation.y=BAU.rot*Math.PI/4;P.mk(inner,bauColOf(BAU.col));g.add(inner)}
  else{if(!t.part||t.face<0)return;[cx,cy,cz]=t.cell;const sub=new THREE.Group();sub.rotation.y=t.face*Math.PI/2;P.mk(sub,bauColOf(BAU.col));g.add(sub)}
  g.position.set(bauCx(pl,cx),cy*BAU.C,bauCz(pl,cz));
  g.traverse(o=>{if(o.isMesh){o.material=o.material.clone();o.material.transparent=true;o.material.opacity=.55;o.castShadow=false}});pl.g.add(g);BAU.ghost=g}
function bauAct(ev,erase){const pl=BAU.plot,t=bauPick(ev);if(!pl||!t)return;
  if(erase||BAU.tool==='erase'){if(t.part)bauErase(pl,t.key,t.face>=0&&pl.cells.get(t.key).f&&pl.cells.get(t.key).f[t.face]?t.face:undefined)}
  else if(BAU.tool==='paint'){if(t.part)bauPaint(pl,t.key,t.face,BAU.col)}
  else{const P=BAU_PARTS[BAU.part];if(P.kind==='v')bauPutVol(pl,t.next[0],t.next[1],t.next[2],BAU.part,BAU.col,BAU.rot);else if(t.part&&t.face>=0)bauPutDeco(pl,t.cell[0],t.cell[1],t.cell[2],t.face,BAU.part,BAU.col)}
  bauSiteUpdate(pl);bauUiRender();BAU.hover=bauPick(ev);bauGhost()}
/* ---- Öffnen und Schließen ---- */
function bauOpen(plot){if(BAU.open||!plot)return;if(typeof POL!=='undefined'&&POL.state&&POL.state!=='idle'){toast('Nicht jetzt: Die Polizei ist hinter dir!',1800);return}
  BAU.plot=plot;BAU.open=true;BAU.undo=[];BAU.backup=JSON.stringify(bauSerialize(plot));BAU.hover=null;BAU.cam.az=plot.yaw+Math.PI*.9;BAU.cam.d=Math.max(28,Math.max(plot.NX,plot.NZ)*BAU.C*1.7);BAU.cam.el=.85;
  K.up=K.down=K.left=K.right=0;P.speed=0;plot.grid.visible=true;
  /* Der Boden bleibt begehbar, solange man baut: Raster des Platzes zurück auf den Ursprung, damit nichts den Zeiger stört (nur Optik) */
  bauUi().hidden=false;bauUiRender();
  say('e','Bauplatz! Setz Teile ins Gitter. Fenster und Türen klebst du an die Wand eines Teils.',3)}
function bauClose(save){const pl=BAU.plot;if(!BAU.open||!pl)return;
  if(!save){bauLoadInto(pl,JSON.parse(BAU.backup))}
  else{const was=pl.rew;bauSave(pl);bauRaster(pl);if(typeof mpUnstick==='function'&&!mpWalk(P.x,P.z))mpUnstick();const cn=bauCounts(pl);if(!pl.rew&&bauReq(pl).every(([,f])=>f(cn))){pl.rew=true;bauSave(pl);scAdd(BAU_REWARD,'Bauauftrag');SFX.win();burst(pl.x,6,pl.z,60);toast('Bauauftrag erfüllt! +'+BAU_REWARD+' Scoops',2600)}else if(!was&&pl.cells.size)toast('Gespeichert. Für die Belohnung fehlen noch Teile (siehe Bauauftrag).',2600)}
  bauSiteUpdate(pl);pl.grid.visible=false;if(BAU.ghost){if(BAU.ghost.parent)BAU.ghost.parent.remove(BAU.ghost);BAU.ghost=null}
  BAU.open=false;BAU.plot=null;if(BAU.ui)BAU.ui.hidden=true}
/* Kamera des Builders: kreist um die Mitte des Grundstücks */
function bauFrame(dt){const pl=BAU.plot;if(!pl)return;const c=BAU.cam,cx=pl.x,cz=pl.z,cy=(pl.g.position.y)+2;
  camPos.set(cx+Math.sin(c.az)*Math.cos(c.el)*c.d,cy+Math.sin(c.el)*c.d,cz+Math.cos(c.az)*Math.cos(c.el)*c.d);camLook.set(cx,cy,cz);
  cam.position.copy(camPos);cam.lookAt(camLook);cam.fov=52;cam.updateProjectionMatrix()}
(function(){
  const cv=()=>r.domElement;
  const start=()=>{const el=cv();if(el._bau)return;el._bau=1;
    el.addEventListener('pointerdown',e=>{if(!BAU.open)return;e.preventDefault();BAU.drag={x:e.clientX,y:e.clientY,moved:0,btn:e.button,az:BAU.cam.az,el:BAU.cam.el};try{el.setPointerCapture(e.pointerId)}catch(x){}});
    el.addEventListener('pointermove',e=>{if(!BAU.open)return;const d=BAU.drag;if(d){const dx=e.clientX-d.x,dy=e.clientY-d.y;d.moved=Math.max(d.moved,Math.abs(dx)+Math.abs(dy));if(d.moved>6){BAU.cam.az=d.az-dx*.008;BAU.cam.el=Math.max(.2,Math.min(1.45,d.el+dy*.006))}}
      else{BAU.hover=bauPick(e);bauGhost()}});
    el.addEventListener('pointerup',e=>{if(!BAU.open)return;const d=BAU.drag;BAU.drag=null;if(d&&d.moved<=6)bauAct(e,d.btn===2)});
    el.addEventListener('contextmenu',e=>{if(BAU.open)e.preventDefault()});
    el.addEventListener('wheel',e=>{if(!BAU.open)return;e.preventDefault();BAU.cam.d=Math.max(12,Math.min(80,BAU.cam.d*(1+Math.sign(e.deltaY)*.1)))},{passive:false})};
  if(typeof r!=='undefined')start();
  addEventListener('keydown',e=>{if(!BAU.open)return;e.stopImmediatePropagation();const k=e.code;
    if(k==='Escape'){e.preventDefault();bauClose(true)}
    else if(k==='KeyR'&&!e.repeat){BAU.rot=(BAU.rot+1)&7;bauGhost()}
    else if(k==='KeyZ'&&!e.repeat)bauUndo();
    else if(k==='KeyX'&&!e.repeat){BAU.tool=BAU.tool==='erase'?'put':'erase';bauGhost();bauUiRender()}
    else if(k==='KeyP'&&!e.repeat){BAU.tool=BAU.tool==='paint'?'put':'paint';bauGhost();bauUiRender()}
    else if(k==='KeyA'||k==='ArrowLeft')BAU.cam.az-=.08;else if(k==='KeyD'||k==='ArrowRight')BAU.cam.az+=.08;
    else if(k==='KeyW'||k==='ArrowUp')BAU.cam.d=Math.max(12,BAU.cam.d-2);else if(k==='KeyS'||k==='ArrowDown')BAU.cam.d=Math.min(80,BAU.cam.d+2);
    else if(k==='KeyQ')BAU.cam.el=Math.min(1.45,BAU.cam.el+.05);else if(k==='KeyE')BAU.cam.el=Math.max(.2,BAU.cam.el-.05)},true);
  addEventListener('keyup',e=>{if(BAU.open)e.stopImmediatePropagation()},true)})();
