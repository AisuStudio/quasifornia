/* ================= Unterwelt: Gegner, Kürbis-Laternen, Quests ================= */
/* Kürbis-Zombies steigen aus dem Boden und folgen dir, Geister schweben heran. Das Skateboard (Mausklick, F oder E) wirft sie um.
   Aufträge: Grabwächter (6 Zombies), Geisterjagd (4 Geister), Kürbisernte (8 Kürbis-Laternen). */
const UWK='kq-uw',UWQ={z:0,g:0,k:0,kc:[]},UW_GOAL={z:6,g:4,k:8};
try{const s=JSON.parse(localStorage.getItem(UWK)||'null');if(s){UWQ.z=s.z|0;UWQ.g=s.g|0;UWQ.k=s.k|0;UWQ.kc=Array.isArray(s.kc)?s.kc:[]}}catch(e){}
function uwSave(){try{localStorage.setItem(UWK,JSON.stringify(UWQ))}catch(e){}}
const UWE={list:[],pumpkins:[],stun:0,ready:false};
function uwProgText(id){const m={gruft:['z','Zombies'],geister:['g','Geister'],kuerbis:['k','Kürbisse']}[id];return m?'('+Math.min(UWQ[m[0]],UW_GOAL[m[0]])+'/'+UW_GOAL[m[0]]+' '+m[1]+')':''}
function uwHud(){if(!G.under)return;setQuest('Unterwelt: Zombies '+Math.min(UWQ.z,6)+'/6 · Geister '+Math.min(UWQ.g,4)+'/4 · Kürbisse '+Math.min(UWQ.k,8)+'/8',null)}
function uwCheck(){if(UWQ.z>=UW_GOAL.z&&!SC.au.gruft)auComplete('gruft');if(UWQ.g>=UW_GOAL.g&&!SC.au.geister)auComplete('geister');if(UWQ.k>=UW_GOAL.k&&!SC.au.kuerbis)auComplete('kuerbis')}
function uwSpots(n,seed,minFromEntry){const R=mulberry(seed),out=[],blk=(x,z,m)=>HUB.colliders.some(c=>c.top>=900&&x>c.x0-m&&x<c.x1+m&&z>c.z0-m&&z<c.z1+m);
  for(let t=0;t<900&&out.length<n;t++){const i=Math.floor(R()*5),j=Math.floor(R()*5),side=Math.floor(R()*4),u=(R()-.5)*28,w=15.6+R()*1.6,cx=(i-2)*50,cz=(j-2)*50;
    const x=side===0?cx+u:side===1?cx+u:side===2?cx-w:cx+w,z=side===0?cz-w:side===1?cz+w:cz+u;
    if(blk(x,z,1.6)||Math.hypot(x-HUB.uw.bx,z-HUB.uw.bz)<minFromEntry||Math.hypot(x-128,z-128)<14)continue;
    if(out.every(o=>Math.hypot(o[0]-x,o[1]-z)>22))out.push([x,z])}return out}
function uwMat(c,em,tr){const m=new THREE.MeshStandardMaterial({color:c,roughness:.8,emissive:em||'#000000',emissiveIntensity:em?.9:0});if(tr){m.transparent=true;m.opacity=tr}return m}
function uwPart(g,geo,mat,x,y,z,sx=1,sy=1,sz=1,rx=0){const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);m.scale.set(sx,sy,sz);m.rotation.x=rx;m.castShadow=true;g.add(m);return m}
function mkZombie(){const g=new THREE.Group(),skin=uwMat('#4f9c8f'),cloth=uwMat('#2e1f5a'),pump=uwMat('#ff7a1a','#ff5a00'),teal=uwMat('#2de0d0','#2de0d0');
  uwPart(g,new THREE.CapsuleGeometry(.42,.8,4,10),cloth,0,1.0,0);[-1,1].forEach(s=>{uwPart(g,BX,cloth,s*.2,.35,0,.26,.7,.3);uwPart(g,BX,skin,s*.55,1.4,.5,.18,.18,.9)});
  uwPart(g,SP,pump,0,1.95,0,.58,.5,.58);uwPart(g,BX,uwMat('#2de0d0','#12a89e'),0,2.5,0,.1,.2,.1);[-1,1].forEach(s=>uwPart(g,BX,teal,s*.22,2.02,.5,.14,.14,.06));uwPart(g,BX,teal,0,1.82,.54,.36,.08,.06);
  addOutlines(g,'actor');return g}
function mkGhost(){const g=new THREE.Group(),gm=uwMat('#cffcf6','#2de0d0',.88),dk=uwMat('#07070d');
  uwPart(g,new THREE.CylinderGeometry(.52,.7,1.4,12),gm,0,1.2,0);uwPart(g,SP,gm,0,1.95,0,.62,.62,.62);for(let k=0;k<6;k++){const a=k/6*Math.PI*2;uwPart(g,SP,gm,Math.cos(a)*.55,.5,Math.sin(a)*.55,.28,.3,.28)}
  [-1,1].forEach(s=>uwPart(g,SP,dk,s*.22,2.05,.52,.1,.16,.08));uwPart(g,SP,dk,0,1.75,.56,.14,.12,.08);return g}
function mkLantern(){const g=new THREE.Group(),pump=uwMat('#ff9a2a','#ff7a00'),teal=uwMat('#2de0d0','#2de0d0');
  uwPart(g,SP,pump,0,0,0,.75,.62,.75);uwPart(g,BX,uwMat('#2de0d0','#12a89e'),0,.7,0,.1,.22,.1);[-1,1].forEach(s=>uwPart(g,BX,teal,s*.27,.05,.7,.15,.15,.06));uwPart(g,BX,teal,0,-.2,.72,.4,.08,.06);
  const beam=new THREE.Mesh(new THREE.CylinderGeometry(.5,.5,30,10,1,true),new THREE.MeshBasicMaterial({color:'#2de0d0',transparent:true,opacity:.2,side:THREE.DoubleSide,depthWrite:false}));beam.position.y=15;g.add(beam);return g}
function uwInit(){if(UWE.ready||!HUB.uw||!HUB.uw.g)return;UWE.ready=true;const UWg=HUB.uw.g;
  uwSpots(12,4401,26).forEach(([x,z])=>{const g=mkZombie(),mound=new THREE.Mesh(new THREE.SphereGeometry(1,8,5,0,Math.PI*2,0,Math.PI/2),uwMat('#1a1626'));mound.scale.set(1.1,.35,1.1);
    const e={kind:'z',g,mound,x,z,hx:x,hz:z,y:0,state:'sleep',t:0,respawn:0,sp:3.3,r:2.0};g.visible=false;UWg.add(g);UWg.add(mound);UWE.list.push(e)});
  uwSpots(7,4402,18).forEach(([x,z])=>{const g=mkGhost();const e={kind:'g',g,mound:null,x,z,hx:x,hz:z,y:0,state:'sleep',t:0,respawn:0,sp:2.5,r:2.3};g.visible=false;UWg.add(g);UWE.list.push(e)});
  uwSpots(14,4403,16).slice(0,8).forEach(([x,z],i)=>{const g=mkLantern();g.position.set(x,1.6+hillG(x,z)+1.2,z);UWg.add(g);UWE.pumpkins.push({g,x,z,id:i,y:g.position.y})})}
function uwEnemyPos(e){return new V3(e.x,e.y+1.5,e.z)}
function uwNearest(){let b=null,bd=55;for(const e of UWE.list){if(e.state==='sleep'||e.state==='dead')continue;const d=Math.hypot(e.x-P.x,e.z-P.z);if(d<bd){bd=d;b=e}}return b?{type:'enemy',e:b}:null}
function hitEnemy(e){e.state='dead';e.g.visible=false;e.respawn=28;if(e.mound)e.mound.visible=false;T.cd=THROW_CD;T.state='back';T.t=0;burst(e.x,e.y+1.5,e.z,60);SFX.thud();SFX.boing();G.shake=Math.max(G.shake,.4);
  if(e.kind==='z'){UWQ.z++;toast('ZOMBIE UMGEHAUEN! '+Math.min(UWQ.z,6)+'/6',1000)}else{UWQ.g++;toast('GEIST VERTRIEBEN! '+Math.min(UWQ.g,4)+'/4',1000)}
  uwSave();uwHud();uwCheck()}
function uwSpawn(){uwInit();UWE.stun=0;UWE.list.forEach(e=>{e.state='sleep';e.respawn=0;e.x=e.hx;e.z=e.hz;e.g.visible=false;if(e.mound){e.mound.visible=true;e.mound.position.set(e.hx,1.3+hillG(e.hx,e.hz),e.hz)}});
  UWE.pumpkins.forEach(p=>{p.g.visible=!UWQ.kc.includes(p.id)});uwHud()}
function uwClear(){UWE.list.forEach(e=>{e.g.visible=false});setQuest(LV.quest,HUB.found?HUB.found.size:0)}
function uwStep(dt){if(!UWE.ready)return;UWE.stun=Math.max(0,UWE.stun-dt);
  const blds=HUB.colliders.filter(c=>c.top>=900);
  for(const e of UWE.list){
    if(e.state==='dead'){e.respawn-=dt;if(e.respawn<=0){e.state='sleep';e.x=e.hx;e.z=e.hz;if(e.mound){e.mound.visible=true}}continue}
    const dx=P.x-e.x,dz=P.z-e.z,d=Math.hypot(dx,dz),gy=cityGround(e.x,e.z);
    if(e.state==='sleep'){if(d<(e.kind==='z'?34:28)){e.state='rise';e.t=0;e.g.visible=true;tone(90,.4,'sawtooth',.05,-40)}else continue}
    if(e.state==='rise'){e.t+=dt;e.y=gy-2.2+Math.min(1,e.t/1.1)*(e.kind==='z'?2.2:5.4);e.g.position.set(e.x,e.y,e.z);e.g.rotation.y=Math.atan2(dx,dz);if(e.t>=1.1)e.state='chase';continue}
    /* chase */
    const wob=Math.sin(G.t*2+e.hx)*.6,ux=dx/(d||1),uz=dz/(d||1);e.x+=(ux+uz*wob*.25)*e.sp*dt;e.z+=(uz-ux*wob*.25)*e.sp*dt;
    if(e.kind==='z'){for(const c of blds){if(e.x>c.x0-.9&&e.x<c.x1+.9&&e.z>c.z0-.9&&e.z<c.z1+.9){const l=e.x-c.x0,r=c.x1-e.x,t=e.z-c.z0,b=c.z1-e.z,m=Math.min(l,r,t,b);if(m===l)e.x=c.x0-.9;else if(m===r)e.x=c.x1+.9;else if(m===t)e.z=c.z0-.9;else e.z=c.z1+.9}}
      e.y=cityGround(e.x,e.z)}else e.y=cityGround(e.x,e.z)+2.4+Math.sin(G.t*2.4+e.hz)*.5;
    e.g.position.set(e.x,e.y,e.z);e.g.rotation.y=Math.atan2(dx,dz);if(e.kind==='z')e.g.children.forEach((c,i)=>{if(i>=3&&i<5)c.rotation.x=Math.sin(G.t*6+i)*.3});
    if(d<e.r&&Math.abs(P.y-e.y)<4&&UWE.stun<=0&&G.phase==='play'){UWE.stun=1.4;P.speed*=.25;P.x-=ux*3;P.z-=uz*3;SFX.thud();G.shake=Math.max(G.shake,.35);toast(e.kind==='z'?'Autsch! Ein Kürbis-Zombie!':'Huch! Ein Geist!',800)}}
  for(const p of UWE.pumpkins){if(!p.g.visible)continue;p.g.position.y=p.y+Math.sin(G.t*2+p.id)*.3;p.g.rotation.y+=dt*1.4;
    if(Math.hypot(P.x-p.x,P.z-p.z)<3.4&&G.phase==='play'){p.g.visible=false;UWQ.kc.push(p.id);UWQ.k++;uwSave();SFX.collect(UWQ.k);burst(p.x,p.y,p.z,40);toast('Kürbis-Laterne '+Math.min(UWQ.k,8)+'/8',900);uwHud();uwCheck()}}}
function uwReset(){UWQ.z=0;UWQ.g=0;UWQ.k=0;UWQ.kc=[];uwSave();if(UWE.ready)uwSpawn()}
