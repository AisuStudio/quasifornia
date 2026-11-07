/* ================= Graffiti: Sprühdosen und 2D-Paint-Editor ================= */
/* Dosen kauft man im A-Mart (Scoops). Die Graffiti-Wände stehen an der Mauer. Der Editor hat eine feste Auflösung (128 x 64) und nur Dosenfarben als Palette.
   Das Bild bleibt, bis man (später: jemand anderes) drüber sprüht. Es wird im Browser gespeichert. */
const GFK='kq-cans',GFT='kq-graf-total',GF_COL=[['#2de0d0','Türkis'],['#ee7cb8','Pink'],['#ffe066','Gelb'],['#ff7a1a','Orange'],['#ffffff','Weiß'],['#1a1626','Schwarz']],GF_PRICE=2,GF_INK=2400,GF_W=128,GF_H=64;
const GF={cans:{},total:0,cur:null,col:null,size:4,open:false,undo:[],down:false,lx:0,ly:0,dabs:0};
try{const s=JSON.parse(localStorage.getItem(GFK)||'{}');GF_COL.forEach(([c])=>{GF.cans[c]=Math.max(0,s[c]|0)});GF.total=parseInt(localStorage.getItem(GFT)||'0')|0}catch(e){GF_COL.forEach(([c])=>GF.cans[c]=0)}
function grafSave(){try{localStorage.setItem(GFK,JSON.stringify(GF.cans));localStorage.setItem(GFT,String(GF.total))}catch(e){}}
function grafBuy(c){if(!scCan(GF_PRICE)){toast('Zu wenig Scoops: '+GF_PRICE+' nötig',1500);return false}
  const nm=(GF_COL.find(x=>x[0]===c)||[0,'Farbe'])[1];GF.cans[c]=(GF.cans[c]||0)+GF_INK;grafSave();scAdd(-GF_PRICE,'Sprühdose '+nm);toast('Sprühdose '+nm+' gekauft',1200);return true}

/* Sprühdosen im Inventar: Dose in der Farbe, die Füllung zeigt den Rest */
function grafCanSvg(c,f){return doseIcon('farbe',c,f)}
function grafInvHTML(){const have=GF_COL.filter(([c])=>(GF.cans[c]||0)>0);
  if(!have.length)return '<div class="slot-i"><div class="ic q">?</div><b>Sprühdosen</b><span>Noch keine. Im A-Mart gibt es Dosen für '+GF_PRICE+' Scoops.</span></div>';
  return have.map(([c,n])=>{const f=GF.cans[c]/GF_INK;return `<div class="slot-i got"><div class="ic">${grafCanSvg(c,f)}</div><b>Sprühdose ${n}</b><span>Farbe: ${Math.max(1,Math.round(f*100))}%</span><em>Wand besprühen (Enter an einer Graffiti-Wand)</em></div>`}).join('')}
function grafShopHTML(){return '<h3 class="edh">Sprühdosen</h3><p class="sub">Eine Dose kostet '+GF_PRICE+' Scoops und reicht für ein großes Bild. Sprüh an den Graffiti-Wänden an der Mauer von Port 36 (Aktion: Wand besprühen).</p><div class="skgrid">'+GF_COL.map(([c,n])=>{const ink=GF.cans[c]||0;
  return `<div class="sk"><i style="background:${c}"></i><b>${n}</b><span>${ink>0?'Farbe: '+Math.round(ink/GF_INK*100)+'%':'leer'}</span><button type="button" data-can="${c}"${scCan(GF_PRICE)&&SHOP.in?'':' disabled'}>${ink>0?'Nachfüllen':'Kaufen'} (${GF_PRICE})</button></div>`}).join('')+'</div>'}
/* Graffiti bleiben vorerst ein Jahr (früher 48 Stunden). Mit Server: dort gespeichert und für alle sichtbar; ohne Server: nur im Browser. */
const GF_TTL=365*24*3600*1000;  /* vorerst fast dauerhaft (früher 48 Stunden) */
function grafDraw(p,d){const im=new Image();im.onload=()=>{p.ctx.clearRect(0,0,GF_W,GF_H);p.ctx.drawImage(im,0,0);p.tex.needsUpdate=true};im.src=d}
function grafLegal(id){return /^w\d$/.test(id)}
function grafLoadPanel(p){try{const d=localStorage.getItem('kq-graf-'+p.id);if(!d)return;const tk='kq-graf-t-'+p.id;let t=Number(localStorage.getItem(tk))||0;if(!t){t=Date.now();localStorage.setItem(tk,String(t))}
  if(Date.now()-t>GF_TTL){localStorage.removeItem('kq-graf-'+p.id);localStorage.removeItem(tk);return}grafDraw(p,d)}catch(e){}}
/* ---- Fassaden: überall sprühen (verboten, außer an den fünf legalen Wänden) ---- */
/* Sprüh-Kanten: Für jede Kante des Karten-Umrisses (alle Ringe, auch Höfe) wird ein Strahl von außen auf das gezeichnete Gebäude geschossen. Die Kante rückt an die tatsächlich sichtbare Wand
   (Umriss und gezeichnete Wand liegen nicht immer am selben Ort, bei Blöcken wie dem Shopping Court um mehrere Meter). Trifft der Strahl keine senkrechte Wand, gibt es dort keine Sprüh-Stelle.
   Die Kennung bleibt f<Gebäude>-<Kante>-<Platz>, die Kanten zählen über alle Ringe weiter (höchstens 41, wie der Server es erlaubt). */
function grafEdges(){if(GF.edges)return GF.edges;const E=[],rc=new THREE.Raycaster(),V=THREE.Vector3;
  MAPD.buildings.forEach((b,bi)=>{if(!b.bg||(b.skip&&b.kind!=='lab'&&b.kind!=='xmas'))return;b.bg.updateMatrixWorld(true);   /* Sonderbauten mit eigener Ladenfront (A-Mart, Garage, Arcade) bleiben draußen; Lab und Lebkuchenhaus haben große glatte Wände */
    const rings=b.c.map(r=>r.map(p=>[mwx(p[0]),mwz(p[1])])),inMat=(x,z)=>rings.reduce((n,r)=>n+(mpInPoly(r,x,z)?1:0),0)%2===1;let e=-1;
    rings.forEach(ring=>{for(let i=0;i<ring.length;i++){e++;if(e>40)return;const a=ring[i],c=ring[(i+1)%ring.length],dx=c[0]-a[0],dz=c[1]-a[1],L=Math.hypot(dx,dz);if(L<3.2)continue;const ux=dx/L,uz=dz/L;let nx=uz,nz=-ux;const mx=(a[0]+c[0])/2,mz=(a[1]+c[1])/2;
      if(inMat(mx+nx*.4,mz+nz*.4)){nx=-nx;nz=-nz}
      /* drei Höhen: Fensterrahmen und Erker stehen vor der Wand; die mittlere Trefferweite ist die Wand selbst */
      const shs=[];for(const y of [2.4,3.4,4.6]){rc.set(new V(mx+nx*26,y,mz+nz*26),new V(-nx,0,-nz));rc.far=44;
        for(const h of rc.intersectObject(b.bg,true)){const o=h.object;if(!o.isMesh||o.userData.outline||!h.face||(o.geometry&&o.geometry.type==='PlaneGeometry'))continue;
          const w=h.face.normal.clone().transformDirection(o.matrixWorld);if(Math.abs(w.y)>.5||w.x*nx+w.z*nz<.5)continue;shs.push((h.point.x-mx)*nx+(h.point.z-mz)*nz);break}}
      if(!shs.length)continue;shs.sort((p,q)=>p-q);const sh=shs[Math.floor((shs.length-1)/2)];if(Math.abs(sh)>16)continue;
      E.push({bi,e,ax:a[0]+nx*sh,az:a[1]+nz*sh,ux,uz,nx,nz,L,sh:+sh.toFixed(2)})}})});GF.edges=E;return E}
/* Diagnose und Test: Was für eine Wand liegt in dieser Richtung? (Strahl gegen die ganze Karte, nur senkrechte Flächen) */
function grafWhatWall(x,z,dx,dz,far){const rc=new THREE.Raycaster();rc.camera=cam;rc.set(new THREE.Vector3(x,3.4,z),new THREE.Vector3(dx,0,dz).normalize());rc.far=far||30;
  for(const h of rc.intersectObject(W0,true)){const o=h.object;if(!o.isMesh||o.userData.outline||!h.face)continue;const w=h.face.normal.clone().transformDirection(o.matrixWorld);if(Math.abs(w.y)>.5)continue;
    let a=o,g=null;while(a&&a!==W0){if(a.userData&&a.userData.blk){g=a;break}a=a.parent}const bi=g?MAPD.buildings.findIndex(b=>b.bg===g):-2;
    return {d:+h.distance.toFixed(1),x:+h.point.x.toFixed(1),z:+h.point.z.toFixed(1),bi,kind:bi>=0?(MAPD.buildings[bi].kind||'haus'):'?',skip:bi>=0?!!MAPD.buildings[bi].skip:null,geo:o.geometry.type,blk:!!g}}
  return null}
function grafSlot(id){const m=/^f(\d+)-(\d+)-(\d+)$/.exec(id);if(!m)return null;const E=grafEdges().find(x=>x.bi===+m[1]&&x.e===+m[2]);if(!E)return null;const k=+m[3];
  /* kurze Wandstücke (unter 5,8 m): ein einziger Platz in der Mitte, die Fläche schrumpft mit der Wand; sonst Plätze alle 6 m mit 5,6 m Breite */
  let t,w;if(E.L<5.8){if(k!==0)return null;t=E.L/2;w=Math.max(2.4,E.L-.6)}else{t=k*6+3;w=5.6;if(t+2.8>E.L)return null}
  return {id,k,E,w,x:E.ax+E.ux*t+E.nx*.1,z:E.az+E.uz*t+E.nz*.1,nx:E.nx,nz:E.nz,yaw:Math.atan2(E.nx,E.nz)}}
function grafFacadeNear(){const px=P.x,pz=P.z;let best=null;for(const E of grafEdges()){const rx=px-E.ax,rz=pz-E.az,t=Math.max(0,Math.min(E.L,rx*E.ux+rz*E.uz)),cx=E.ax+E.ux*t,cz=E.az+E.uz*t,d=Math.hypot(px-cx,pz-cz),side=rx*E.nx+rz*E.nz;
    if(d<3.8&&side>-.3&&(!best||d<best.d))best={d,E,t}}
  if(!best)return null;const E=best.E,k=Math.max(0,Math.min(Math.floor(E.L/6)-1,Math.floor(best.t/6))),id='f'+E.bi+'-'+E.e+'-'+k,sl=grafSlot(id);if(!sl)return null;
  const door=(HUB.doors||[]).some(d=>Math.hypot(d[0]-sl.x,d[1]-sl.z)<4.2);return {id,sl,door,ax:sl.x+sl.nx*2.4,az:sl.z+sl.nz*2.4}}
function grafEnsurePanel(id){let p=HUB.graf.panels.find(q=>q.id===id);if(p)return p;const sl=grafSlot(id);if(!sl)return null;
  const cv=document.createElement('canvas');cv.width=GF_W;cv.height=GF_H;const cx=cv.getContext('2d');cx.imageSmoothingEnabled=false;
  const tex=new THREE.CanvasTexture(cv);tex.magFilter=THREE.NearestFilter;tex.minFilter=THREE.NearestFilter;tex.generateMipmaps=false;tex.colorSpace=THREE.SRGBColorSpace;
  const pl=new THREE.Mesh(new THREE.PlaneGeometry(sl.w,sl.w/2),new THREE.MeshBasicMaterial({map:tex,transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2}));
  pl.position.set(sl.x,1.3+2.1,sl.z);pl.rotation.y=sl.yaw;pl.userData.noBake=true;pl.userData.noOutline=true;W0.add(pl);
  p={id,dyn:true,x:sl.x,z:sl.z,ry:sl.yaw,cv,ctx:cx,tex,mesh:pl,ax:sl.x+sl.nx*2.4,az:sl.z+sl.nz*2.4};HUB.graf.panels.push(p);return p}
function grafRemovePanel(p){if(p.mesh){W0.remove(p.mesh);p.mesh.geometry.dispose();p.mesh.material.dispose()}const i=HUB.graf.panels.indexOf(p);if(i>=0)HUB.graf.panels.splice(i,1)}
/* ---- Server ---- */
const GFSRV={ok:null,known:{},timer:0,busy:false,retryAt:0};
async function grafApi(path,init){const r=await fetch('/api/graffiti'+path,{credentials:'same-origin',cache:'no-store',...init});if(!r.ok)throw new Error(r.status);return r}
async function grafSync(){if(GFSRV.busy||Date.now()<GFSRV.retryAt||!HUB.graf)return;GFSRV.busy=true;
  try{const j=await (await grafApi('')).json();if(!j||typeof j.items!=='object')throw new Error('format');GFSRV.ok=true;const items=j.items;
    for(const id of Object.keys(items)){if(GFSRV.known[id]===items[id])continue;const p=grafLegal(id)?HUB.graf.panels.find(q=>q.id===id):grafEnsurePanel(id);if(!p)continue;
      const d=await (await grafApi('/'+id)).text();GFSRV.known[id]=items[id];grafDraw(p,d);try{localStorage.setItem('kq-graf-'+id,d);localStorage.setItem('kq-graf-t-'+id,String(Date.now()))}catch(e){}}
    for(const p of HUB.graf.panels.slice()){if(items[p.id]!==undefined)continue;
      let local=null;try{local=localStorage.getItem('kq-graf-'+p.id)}catch(e){}
      if(local&&GFSRV.known[p.id]===undefined){try{await grafApi('/'+p.id,{method:'PUT',body:local,headers:{'content-type':'text/plain'}});GFSRV.known[p.id]=-1}catch(e){}}
      else if(GFSRV.known[p.id]!==undefined){if(p.dyn)grafRemovePanel(p);else{p.ctx.clearRect(0,0,GF_W,GF_H);grafBase(p)}delete GFSRV.known[p.id];try{localStorage.removeItem('kq-graf-'+p.id);localStorage.removeItem('kq-graf-t-'+p.id)}catch(e){}}}
  }catch(e){GFSRV.ok=false;GFSRV.retryAt=Date.now()+120000}finally{GFSRV.busy=false}}
function grafBase(p){const cx=p.ctx;cx.fillStyle='#2b2840';cx.fillRect(0,0,GF_W,GF_H);cx.fillStyle='#4a4468';cx.font='700 9px sans-serif';cx.textAlign='center';cx.fillText('HIER SPRÜHEN',64,34);p.tex.needsUpdate=true}
async function grafPush(p){if(GFSRV.ok===false&&Date.now()<GFSRV.retryAt)return;try{await grafApi('/'+p.id,{method:'PUT',body:p.cv.toDataURL('image/png'),headers:{'content-type':'text/plain'}});GFSRV.ok=true;GFSRV.known[p.id]=-1}catch(e){GFSRV.ok=false;GFSRV.retryAt=Date.now()+120000}}
function grafInitWorld(){if(!HUB.graf)return;GF.edges=null;GFSRV.known={};
  try{for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k&&/^kq-graf-f\d+-\d+-\d+$/.test(k)){const id=k.slice(8),p=grafEnsurePanel(id);if(p)grafLoadPanel(p)}}}catch(e){}
  grafSync();clearInterval(GFSRV.timer);GFSRV.timer=setInterval(()=>{if(LV.id===0&&!document.hidden)grafSync()},60000)}
function grafOpen(p){if(!p||GF.open)return;const have=GF_COL.some(([c])=>GF.cans[c]>0);
  if(!have)return dlgStart('',['Eine leere Wand wartet auf dich. Zum Sprühen brauchst du eine Dose.','Im A-Mart (mintgrünes Band, auf der Minikarte als A) gibt es Sprühdosen für '+GF_PRICE+' Scoops.']);
  GF.cur=p;GF.open=true;GFOPEN=true;K.up=K.down=K.left=K.right=0;GF.dabs=0;GF.undo=[];GF.polQueued=false;
  if(!grafLegal(p.id))toast('Verbotene Wand! Danach kommt die Polizei ('+(polNight()?'nachts nach 3 Minuten':'nach 1 Minute')+'). Strafe: 10 Scoops',3000)
  const cv=$('graf-cv'),cx=cv.getContext('2d');cx.imageSmoothingEnabled=false;cx.clearRect(0,0,GF_W,GF_H);cx.drawImage(p.cv,0,0);
  GF.col=(GF_COL.find(([c])=>GF.cans[c]>0)||GF_COL[0])[0];$('graf').hidden=false;grafPal();$('graf-done').focus({preventScroll:true})}
function grafPal(){const pal=$('graf-pal');pal.innerHTML=GF_COL.map(([c,n])=>{const ink=GF.cans[c]||0;return `<button type="button" class="gpal${c===GF.col?' on':''}${ink>0?'':' empty'}" data-c="${c}" style="--c:${c}" title="${n}"><i style="width:${Math.round(Math.min(1,ink/GF_INK)*100)}%"></i></button>`}).join('');
  pal.querySelectorAll('button').forEach(b=>b.onclick=()=>{if((GF.cans[b.dataset.c]||0)<=0){toast('Diese Dose ist leer. Im Laden nachfüllen.',1200);return}GF.col=b.dataset.c;grafPal()})}
function grafClose(save){if(!GF.open)return;const p=GF.cur;
  if(save&&p){p.ctx.clearRect(0,0,GF_W,GF_H);p.ctx.drawImage($('graf-cv'),0,0);p.tex.needsUpdate=true;if(GF.dabs>0){try{localStorage.setItem('kq-graf-'+p.id,p.cv.toDataURL('image/png'));localStorage.setItem('kq-graf-t-'+p.id,String(Date.now()))}catch(e){}grafPush(p);}
    GF.total+=GF.dabs;grafSave();if(GF.dabs>0){SFX.win();toast('Graffiti gesprüht!',1300);if(GF.total>=400&&!SC.au.graffiti)auComplete('graffiti')}}
  else grafSave();
  GF.open=false;GFOPEN=false;$('graf').hidden=true;GF.cur=null}
function grafPt(e){const cv=$('graf-cv'),r=cv.getBoundingClientRect();return [Math.floor((e.clientX-r.left)/r.width*GF_W),Math.floor((e.clientY-r.top)/r.height*GF_H)]}
function grafSpray(x,y){const cx=$('graf-cv').getContext('2d'),c=GF.col;if((GF.cans[c]||0)<=0)return;
  /* Polizei: der Countdown startet 2 Sekunden nachdem man auf einer verbotenen Wand zu sprühen beginnt */
  if(!GF.polQueued&&GF.cur&&!grafLegal(GF.cur.id)){GF.polQueued=true;const pn=GF.cur;setTimeout(()=>{if(typeof polAlert==='function')polAlert(pn)},2000)}const R=GF.size;cx.fillStyle=c;
  const n=Math.max(4,Math.round(R*R*1.9));for(let i=0;i<n;i++){const a=Math.random()*6.283,d=Math.sqrt(Math.random())*R,px=Math.round(x+Math.cos(a)*d),py=Math.round(y+Math.sin(a)*d);if(px<0||py<0||px>=GF_W||py>=GF_H)continue;cx.fillRect(px,py,1,1)}
  GF.cans[c]-=n*.07;GF.dabs+=n;if(GF.cans[c]<=0){GF.cans[c]=0;toast('Dose leer!',900);grafPal()}}
(function(){const cv=$('graf-cv');if(!cv)return;
  cv.addEventListener('pointerdown',e=>{if(!GF.open)return;e.preventDefault();cv.setPointerCapture(e.pointerId);GF.down=true;const cx=cv.getContext('2d');GF.undo.push(cx.getImageData(0,0,GF_W,GF_H));if(GF.undo.length>12)GF.undo.shift();const [x,y]=grafPt(e);GF.lx=x;GF.ly=y;grafSpray(x,y);if(Math.random()<.3)tone(900+Math.random()*300,.05,'sawtooth',.012)});
  cv.addEventListener('pointermove',e=>{if(!GF.down)return;const [x,y]=grafPt(e),dx=x-GF.lx,dy=y-GF.ly,st=Math.max(1,Math.ceil(Math.hypot(dx,dy)/Math.max(1,GF.size*.6)));for(let i=1;i<=st;i++)grafSpray(GF.lx+dx*i/st,GF.ly+dy*i/st);GF.lx=x;GF.ly=y});
  const up=()=>{if(GF.down){GF.down=false;grafPal()}};cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);
  document.querySelectorAll('#graf [data-sz]').forEach(b=>b.onclick=()=>{GF.size=+b.dataset.sz;document.querySelectorAll('#graf [data-sz]').forEach(x=>x.classList.toggle('on',x===b))});
  $('graf-undo').onclick=()=>{const s=GF.undo.pop();if(s)cv.getContext('2d').putImageData(s,0,0)};
  $('graf-done').onclick=()=>grafClose(true);$('graf-cancel').onclick=()=>grafClose(false);
  addEventListener('keydown',e=>{if(!GF.open)return;e.stopImmediatePropagation();if(e.code==='Escape'){e.preventDefault();grafClose(false)}else if(e.code==='KeyZ'&&(e.ctrlKey||e.metaKey)){e.preventDefault();$('graf-undo').click()}},true)})();
function grafActs(a){if(!HUB.graf)return;let near=false;for(const p of HUB.graf.panels){if(p.dyn)continue;a.push({x:p.ax,z:p.az,r:7.5,label:'Wand besprühen',fn:()=>grafOpen(p)});if(Math.hypot(P.x-p.ax,P.z-p.az)<9)near=true}
  if(near||!NEWMAP)return;const f=grafFacadeNear();if(!f)return;
  if(f.door)return;a.push({x:f.ax,z:f.az,r:4.6,label:'Hier sprühen (verboten)',fn:()=>{const p=grafEnsurePanel(f.id);if(p)grafOpen(p)}})}
