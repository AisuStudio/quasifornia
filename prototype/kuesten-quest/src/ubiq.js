/* ================= UBIQ: "Phill's Phantastic Phormula" (Easter Egg, ca. 2 % des Spiels, Wink an die Erwachsenen) =================
   Eine besondere Sprühdose, die Glitches repariert. Glitches sickern wie Giftgas aus der Unterwelt: Eine Figur oder ein Gegenstand steckt in einer Wand,
   ein Brett im Boden. Mit UBIQ wird das Ding "erlöst" und an einen besseren Ort gesetzt, dafür gibt es Scoops.
   Das Spiel erkennt echte Verschränkungen selbst (Position in fester Rasterzelle) und meldet jeden Fund an /stats. Jeder repariert für sich (lokal gespeichert).
   Dose: 30 Scoops im A-Mart, 5 Ladungen, Nachfüllen 25, 15 Scoops pro Reparatur. Das endgültige Design der Dose folgt vom Nutzer (jetzt ein Platzhalter). */
const UBQ={own:false,ch:0,max:5,price:30,refill:25,reward:15,fixed:new Set(),list:[],t:0,tick:0,srv:{ok:false,busy:0,t:0,pushed:false}};
try{const s=JSON.parse(localStorage.getItem('kq-ubiq')||'null');if(s){UBQ.own=!!s.own;UBQ.ch=Math.max(0,Math.min(UBQ.max,s.ch|0));(Array.isArray(s.fixed)?s.fixed:[]).forEach(k=>UBQ.fixed.add(String(k)))}}catch(e){}
function ubqSave(){try{localStorage.setItem('kq-ubiq',JSON.stringify({own:UBQ.own,ch:UBQ.ch,fixed:[...UBQ.fixed]}))}catch(e){}}
function ubqStat(ty,g){try{if(typeof statEv==='function')statEv('glitch',ty+':'+g.type,1,g.x,g.z)}catch(e){}}
/* ---- Laden und Inventar ---- */
function ubqCanSvg(f){return doseIcon('ubiq',null,f)}
function ubqInvHTML(){if(!UBQ.own)return '';return `<div class="slot-i got"><div class="ic">${ubqCanSvg(UBQ.ch/UBQ.max)}</div><b>UBIQ</b><span>Phill's Phantastic Phormula: ${UBQ.ch} von ${UBQ.max} Ladungen</span><em>Wo etwas flackert: Enter</em></div>`}
function ubqShopHTML(){const full=UBQ.own&&UBQ.ch>=UBQ.max,cost=UBQ.own?UBQ.refill:UBQ.price,can=SHOP.in&&!full&&scCan(cost);
  return `<h3 class="edh">UBIQ</h3><p class="sub">Phill's Phantastic Phormula. Für alles, was flackert.</p><div class="skgrid"><div class="sk"><i style="background:#7be0e0"></i><b>UBIQ</b><span>${UBQ.own?UBQ.ch+' von '+UBQ.max+' Ladungen':cost+' Scoops'}</span><button type="button" data-ubq="1"${can?'':' disabled'}>${UBQ.own?(full?'Voll':'Nachfüllen '+cost):'Kaufen'}</button></div></div>`}
function ubqBuy(){const cost=UBQ.own?UBQ.refill:UBQ.price;if(UBQ.own&&UBQ.ch>=UBQ.max)return false;if(!scCan(cost)){toast('Zu wenig Scoops: '+cost+' nötig',1500);return false}
  const was=UBQ.own;UBQ.own=true;UBQ.ch=UBQ.max;ubqSave();scAdd(-cost,was?'UBIQ nachgefüllt':'UBIQ');toast(was?'UBIQ nachgefüllt':'UBIQ gekauft: Phill sei Dank',1400);try{invRender()}catch(e){}return true}
/* ---- Geteilter Stand: Der Server merkt sich, welche Glitches repariert sind (wer zuerst repariert, bekommt die Scoops). Ohne Server bleibt alles lokal. ---- */
function ubqSync(){if(UBQ.srv.busy)return;UBQ.srv.busy=1;
  try{fetch('/api/glitch',{cache:'no-store'}).then(r=>r.ok?r.json():null).then(j=>{UBQ.srv.busy=0;if(!j||!j.fixed)return;UBQ.srv.ok=true;
    for(const g of UBQ.list){const f=j.fixed[g.id];if(f&&!g.fixed){g.byOther=f.by||'';UBQ.fixed.add(g.id);ubqSettle(g)}}
    /* Früher lokal Repariertes einmalig zum Server melden, damit alle es sehen */
    if(!UBQ.srv.pushed){UBQ.srv.pushed=true;UBQ.fixed.forEach(id=>{if(!j.fixed[id]&&UBQ.list.some(g=>g.id===id))ubqClaim(id)})};ubqSave()}).catch(()=>{UBQ.srv.busy=0})}catch(e){UBQ.srv.busy=0}}
function ubqClaim(id){return fetch('/api/glitch/'+encodeURIComponent(id),{method:'POST',body:JSON.stringify({name:typeof MULTI!=='undefined'?MULTI.name:''}),headers:{'content-type':'text/plain'},cache:'no-store'}).then(r=>r.ok?r.json():null)}
/* ---- Glitches ---- */
function ubqNearSpecial(X,Z,r){return MAPD.buildings.some(b=>{if(!b.skip)return false;const q=b.c[0];for(let i=0;i<q.length;i++){const p=q[i],u=q[(i+1)%q.length],ax=mwx(p[0]),az=mwz(p[1]),bx=mwx(u[0]),bz=mwz(u[1]),dx=bx-ax,dz=bz-az,L2=dx*dx+dz*dz||1e-9;let t=((X-ax)*dx+(Z-az)*dz)/L2;t=Math.max(0,Math.min(1,t));if(Math.hypot(X-ax-dx*t,Z-az-dz*t)<r)return true}return false})}
function ubqWallSpot(X,Z,maxD){let best=null;MAPD.buildings.forEach(b=>{if(b.skip)return;/* Sonderbauten (A-Mart, Labor, X-Mas) haben eigene Wände, die nicht am Kartenumriss liegen */const r=b.c[0];for(let i=0;i<r.length;i++){const p=r[i],q=r[(i+1)%r.length],ax=mwx(p[0]),az=mwz(p[1]),bx=mwx(q[0]),bz=mwz(q[1]),dx=bx-ax,dz=bz-az,L2=dx*dx+dz*dz||1e-9;if(L2<9)continue;
    let t=((X-ax)*dx+(Z-az)*dz)/L2;t=Math.max(.15,Math.min(.85,t));const px=ax+dx*t,pz=az+dz*t,d=Math.hypot(X-px,Z-pz);if(d>maxD||(best&&d>=best.d))continue;
    const L=Math.sqrt(L2);let nx=-dz/L,nz=dx/L;if(nx*(X-px)+nz*(Z-pz)<0){nx=-nx;nz=-nz}
    /* Nicht neben Sonderbauten (A-Mart, Labor, X-Mas): Ihr Block ist größer als der Kartenumriss und verdeckt dort die Wand */
    if(ubqNearSpecial(px,pz,7))continue;
    /* Der Fußweg vor der Wand muss begehbar sein */
    if(!mpWalk(px+nx*1.6,pz+nz*1.6))continue;best={x:px,z:pz,nx,nz,d}}});return best}
function ubqFree(x,z,r){if(mpFree(x,z,r,false))return [x,z];return mpFindFree(mux(x),muy(z),r,14,false)||[x,z]}
function ubqFlickerMats(obj){const ms=[];obj.traverse(o=>{if(o.isMesh&&o.material&&o.material.isMeshStandardMaterial){o.material=o.material.clone();ms.push({m:o.material,e:o.material.emissive.clone(),i:o.material.emissiveIntensity})}});return ms}
function ubqAdd(g){g.mats=ubqFlickerMats(g.obj);g.bx=g.obj.position.x;g.bz=g.obj.position.z;g.by=g.obj.position.y;g.fixed=UBQ.fixed.has(g.id);UBQ.list.push(g);if(g.fixed)ubqSettle(g,true);else if(g.type==='item')ubqStat('fund',g);return g}
function ubqNpc(x,z,ry,col){const g=skater(x,cityGround(x,z),z,ry,col||'#47c2a5',1.35);W0.add(g);g.userData.noBake=true;if(g.userData.board)g.userData.board.visible=false;if(g.userData.tz)g.userData.tz.rotation.x=.1;
  if(g.userData.arms)g.userData.arms.forEach(({sg,s})=>{sg.rotation.z=s*.35});return g}
/* Endzustand nach der Reparatur: Ding steht am besseren Ort */
function ubqSettle(g,silent){g.fixed=true;g.mats.forEach(o=>{o.m.emissive.copy(o.e);o.m.emissiveIntensity=o.i});g.obj.visible=true;g.obj.position.set(g.tx,g.ty,g.tz);if(g.finish)g.finish(g)}
function ubiqInitWorld(){UBQ.list.length=0;
  /* 1) Ein Passant steckt in der Wand nahe der Leiter zur Unterwelt (von dort sickert das Gas) */
  if(HUB.uw){const w=ubqWallSpot(HUB.uw.bx,HUB.uw.bz,60);
    if(w){const h=Math.atan2(w.nz,w.nx),npc=ubqNpc(w.x-w.nx*.32,w.z-w.nz*.32,Math.PI/2-h,'#47c2a5'),t=ubqFree(w.x+w.nx*1.8,w.z+w.nz*1.8,.6);
      ubqAdd({id:'wand-leiter',type:'wand',label:'Passant in der Wand',obj:npc,x:w.x,z:w.z,tx:t[0],ty:npc.position.y,tz:t[1],
        finish:g=>{g.obj.rotation.y=Math.PI/2-Math.atan2(g.tz-g.z,g.tx-g.x)},
        talk:["Ich bin … in der … Wand? Oder die Wand in mir? Das ist heute schwer zu sagen.","Das Flackern kommt aus dem Keller. Es riecht nach … Kupfer."],
        talkNo:["Ich bin … hier. Und dort. Und in der Wand.","Wenn du eine Dose UBIQ hättest, Phills Phantastic Phormula … Im A-Mart soll es sie geben."],
        thanks:["Oh. Ich bin wieder ganz da. Und auf der richtigen Seite der Wand.","Falls du dich fragst, was in der Dose war: Phills fantastische Formel. Frag nicht. Es wirkt."]})}}
  /* 2) Ein Kristall dreht sich durch eine Wand in der Nähe des A-Mart */
  {const s=HUB.shops&&HUB.shops[0];if(s){const w=ubqWallSpot(s.x+10,s.z,50);
    if(w){const gem=new THREE.Mesh(new THREE.OctahedronGeometry(.85),MT('#c8f7ff','#7be0e0',.8));gem.position.set(w.x+w.nx*.45,cityGround(w.x,w.z)+1.9,w.z+w.nz*.45);gem.userData.noBake=true;gem.userData.noOutline=true;W0.add(gem);const t=ubqFree(w.x+w.nx*2,w.z+w.nz*2,.7);
      ubqAdd({id:'stein-pmart',type:'stein',label:'Kristall in der Wand',obj:gem,x:w.x,z:w.z,tx:t[0],ty:cityGround(t[0],t[1])+1.6,tz:t[1],spin:true,
        talk:["Ein pinker Kristall, halb in der Wand. Er dreht sich einfach durch den Stein, als wäre das nichts."],
        talkNo:["Der Kristall dreht sich durch die Wand. Irgendetwas stimmt nicht. Eine Dose UBIQ aus dem A-Mart könnte das richten."],
        thanks:["Der Kristall schwebt frei und dreht sich zufrieden vor der Wand."]})}}}
  /* 3) Ein Brett steckt senkrecht im Boden vor dem Tor des Skateparks */
  if(SKATE.on&&SKATE.gate){const gx=SKATE.gate[0],gz=SKATE.gate[1],dx=gx-SKATE.cx,dz=gz-SKATE.cz,l=Math.hypot(dx,dz)||1,f=ubqFree(gx+dx/l*3.4,gz+dz/l*3.4,.8),grp=new THREE.Group();
    boardDeck(grp,MT('#8e5bd6'),MT('#7be0e0'),'popsicle',1.6,0);grp.position.set(f[0],cityGround(f[0],f[1])-.55,f[1]);grp.rotation.set(-1.25,.6,0);grp.userData.noBake=true;W0.add(grp);
    ubqAdd({id:'brett-skate',type:'brett',label:'Brett im Boden',obj:grp,x:f[0],z:f[1],tx:f[0]+dx/l*.4,ty:cityGround(f[0],f[1])+.06,tz:f[1]+dz/l*.4,
      finish:g=>{g.obj.rotation.set(0,.6,0)},
      talk:["Ein Skateboard steckt senkrecht im Beton. Es flackert, als wüsste es nicht, ob es Brett oder Boden ist."],
      talkNo:["Das Brett steckt im Boden und flackert. UBIQ würde helfen."],thanks:["Das Brett liegt wieder flach. Es sieht dich an, soweit ein Brett das kann."]})}
  /* Sicherheitsnetz: Sammelgegenstände, die in festen Rasterzellen stecken, werden als Glitch gemeldet und lassen sich erlösen */
  (HUB.items||[]).forEach(it=>{if(mpAt(it.x,it.z)!==5)return;const t=ubqFree(it.x,it.z,.8);ubqAdd({id:'item-'+it.def.id,type:'item',label:'Verschränkter Gegenstand',obj:it.g,x:it.x,z:it.z,tx:t[0],ty:it.g.position.y,tz:t[1],item:it,
    talk:['Der Gegenstand steckt in der Wand.'],talkNo:['Der Gegenstand steckt in der Wand. UBIQ würde ihn befreien.'],thanks:['Der Gegenstand liegt wieder frei.'],
    finish:g=>{g.item.x=g.tx;g.item.z=g.tz;[g.item.ring,g.item.beam].forEach(o=>{if(o){o.position.x=g.tx;o.position.z=g.tz}})}})})}
/* ---- Flackern ---- */
function ubiqStep(dt){UBQ.t+=dt;UBQ.srv.t-=dt;if(UBQ.srv.t<=0){UBQ.srv.t=45;ubqSync()}UBQ.tick-=dt;const flick=UBQ.tick<=0;if(flick)UBQ.tick=.07;
  for(const g of UBQ.list){if(g.fixed){if(g.spin)g.obj.rotation.y+=dt*1.2;continue}
    if(Math.hypot(P.x-g.x,P.z-g.z)>70){g.obj.visible=true;continue}
    if(g.spin)g.obj.rotation.y+=dt*2.4;
    if(flick){const r=Math.random();g.obj.visible=r>.07;const j=(Math.random()-.5)*.14;g.obj.position.x=g.bx+j;g.obj.position.z=g.bz-j*.7;
      const c=r<.5?'#00ffff':'#ff00ff';g.mats.forEach(o=>{o.m.emissive.set(c);o.m.emissiveIntensity=.35+Math.random()*.9})}}}
/* ---- Aktion ---- */
function ubiqActs(a){if(LV.id!==0||G.under)return;for(const g of UBQ.list){if(g.fixed||Math.hypot(P.x-g.x,P.z-g.z)>40)continue;
  a.push({x:g.x,z:g.z,r:6.5,label:UBQ.ch>0?'UBIQ sprühen: '+g.label:'Glitch: '+g.label,pri:9,fn:()=>ubiqUse(g)})}}
function ubiqUse(g){if(g.fixed)return;if(UBQ.ch<=0){dlgStart('',UBQ.own?['Das flackert. Deine Dose UBIQ ist leer. Im A-Mart gibt es Nachschub.']:g.talkNo||g.talk);return}
  if(g.talk&&!g.seen){g.seen=true;dlgStart('',g.talk,()=>ubiqFix(g));return}ubiqFix(g)}
function ubiqFix(g){if(g.fixed||g.busy||UBQ.ch<=0)return;g.busy=true;
  const done=(first,by)=>{g.busy=false;if(g.fixed)return;
    if(!first){g.byOther=by||'';UBQ.fixed.add(g.id);ubqSave();ubqSettle(g);toast('Schon repariert'+(by?' von '+by:'')+'. Deine Ladung bleibt.',2400);return}
    UBQ.ch--;ubqSave();burst(g.x,2.6,g.z,46);try{tone(520,.1,'sawtooth',.05);tone(880,.18,'square',.04,0,.1)}catch(e){}
    ubqSettle(g);UBQ.fixed.add(g.id);ubqSave();scAdd(UBQ.reward,'UBIQ-Reparatur');ubqStat('fix',g);toast('Repariert! +'+UBQ.reward+' Scoops. Ladungen: '+UBQ.ch+'/'+UBQ.max,2200);
    if(g.thanks)setTimeout(()=>{try{dlgStart('',g.thanks)}catch(e){}},500)};
  if(!UBQ.srv.ok){done(true);return}
  ubqClaim(g.id).then(j=>{if(!j)done(true);else done(!!j.first,j.by)}).catch(()=>done(true))}
