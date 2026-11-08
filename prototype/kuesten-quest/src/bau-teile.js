/* ================= Bau-Teile: Katalog und Zellen-Bau (gemeinsam für Spiel und Designer) =================
   Reine Teile-Daten ohne Spielzustand: Farben, Geometrien, Teile (BAU_PARTS) und bauColOf.
   Erwartet als Umgebung: THREE, MT(farbe,emissiv,stärke) und die Geometrien BX, CY, CN, SP.
   Das Spiel (bauen.js) und der Designer (tools/avatar-designer/haus.html) laden genau diese Datei.
   Neue Formen, Fenster oder Möbel nur hier ergänzen. */
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
const bauColOf=i=>BAU_COLS[((i%BAU_COLS.length)+BAU_COLS.length)%BAU_COLS.length];
/* Zellen und Bauplatz (Plot = {NX,NZ,x,z,g,cells:Map,cg:Map,mask?}); Zellgröße 2 m, bis zu 6 Ebenen */
const BAU_C=2,BAU_LV=6;
const bauCx=(pl,gx)=>(gx-pl.NX/2+.5)*BAU_C,bauCz=(pl,gz)=>(gz-pl.NZ/2+.5)*BAU_C;
const bauOk=(pl,gx,gz)=>gx>=0&&gx<pl.NX&&gz>=0&&gz<pl.NZ&&(!pl.mask||pl.mask.has(gx+','+gz));
const bauKeyOf=o=>{while(o){if(o.userData&&o.userData.cellKey)return o.userData.cellKey;o=o.parent}return null};
function bauCellGroup(plot,key,cell){const [gx,gy,gz]=key.split(',').map(Number),g=new THREE.Group();
  g.position.set(bauCx(plot,gx),gy*BAU_C,bauCz(plot,gz));g.userData.cellKey=key;
  const P=BAU_PARTS[cell.v];if(P){const inner=new THREE.Group();inner.rotation.y=(cell.r||0)*Math.PI/4;P.mk(inner,bauColOf(cell.c));g.add(inner)}
  (cell.f||[]).forEach((f,i)=>{if(!f)return;const D=BAU_PARTS[f[0]];if(!D)return;const sub=new THREE.Group();sub.rotation.y=i*Math.PI/2;D.mk(sub,bauColOf(f[1]));g.add(sub)});
  g.traverse(o=>{if(o.isMesh)o.userData.cellKey=key});
  try{addOutlines(g,'prop')}catch(e){}
  return g}
function bauRefresh(plot,key){const old=plot.cg.get(key);if(old){plot.g.remove(old);old.traverse(o=>{if(o.isMesh&&o.userData.own&&o.geometry)o.geometry.dispose()});plot.cg.delete(key)}
  const cell=plot.cells.get(key);if(!cell)return;const g=bauCellGroup(plot,key,cell);plot.g.add(g);plot.cg.set(key,g)}
function bauSerialize(plot){const o={};plot.cells.forEach((c,k)=>{o[k]=[c.v,c.c,c.r||0,(c.f||[]).map(f=>f||0)]});return {cells:o,rew:plot.rew?1:0}}
function bauLoadInto(plot,data){plot.cells.clear();plot.cg.forEach(g=>plot.g.remove(g));plot.cg.clear();
  if(data&&data.cells)Object.keys(data.cells).forEach(k=>{const a=data.cells[k];if(!Array.isArray(a)||!BAU_PARTS[a[0]])return;const [gx,gy,gz]=k.split(',').map(Number);if(!(bauOk(plot,gx,gz)&&gy>=0&&gy<BAU_LV))return;
    plot.cells.set(k,{v:a[0],c:a[1]|0,r:a[2]|0,f:[0,1,2,3].map(i=>{const f=(a[3]||[])[i];return f&&BAU_PARTS[f[0]]?[f[0],f[1]|0]:0})})});
  plot.rew=!!(data&&data.rew);plot.cells.forEach((c,k)=>bauRefresh(plot,k))}
