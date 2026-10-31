/* ================= Atoll-Einstieg: Labor, gefesselter Mann, Code, Eis, Schlüssel ================= */
const QKEY='kq-atoll';
const Q={talked:false,dictated:false,corrected:false,doorOpen:false,hasKey:false,freed:false,ice:false,tries:3,lockUntil:0};
try{const s=JSON.parse(localStorage.getItem(QKEY)||'{}');['talked','dictated','corrected','doorOpen','hasKey','freed'].forEach(k=>{if(s[k])Q[k]=true})}catch(e){}
function qSave(){try{localStorage.setItem(QKEY,JSON.stringify({talked:Q.talked,dictated:Q.dictated,corrected:Q.corrected,doorOpen:Q.doorOpen,hasKey:Q.hasKey,freed:Q.freed}))}catch(e){}}
const CODE=(()=>{const R=mulberry(1717),d=[];for(let i=0;i<10;i++)d.push(Math.floor(R()*10));return d})();
const MIS=3,DICT=(()=>{const d=CODE.slice(0,6),R=mulberry(99);d[MIS]=(CODE[MIS]+1+Math.floor(R()*8))%10;return d})();
const DW=['Null','Eins','Zwei','Drei','Vier','Fünf','Sechs','Sieben','Acht','Neun'];
const ITEM_POS={funk:6,schraube:7,usb:8,handbuch:9};
const codeStr=()=>CODE.join('');
function itemExtra(id){const p=ITEM_POS[id];
  if(p!==undefined){const t={funk:'Entzifferte Geheimschrift',schraube:'Am Schaft eingeritzt',usb:'Aus patrouille.log',handbuch:'Auf die Rückseite gekritzelt'}[id];return `${t}: ${p+1}. Ziffer = <b>${CODE[p]}</b>`}
  if(id==='losung')return 'Notiz dazu: "Der Schlüssel liegt hinter dem Möwen-Poster."';return ''}
function codeSheet(){const a=[];for(let i=0;i<10;i++){let c='_';if(i<6&&Q.dictated)c=String(Q.corrected&&i===MIS?CODE[i]:DICT[i]);else if(i>=6){const id=Object.keys(ITEM_POS).find(k=>ITEM_POS[k]===i);if(INV.items.has(id))c=String(CODE[i])}a.push(c)}return a}
function questSlotsHTML(){let h='';
  if(Q.dictated){const s=codeSheet();h+=`<div class="slot-i got"><div class="ic q" style="font-size:22px;letter-spacing:.06em">${s.slice(0,6).join(' ')} <span style="opacity:.5">|</span> ${s.slice(6).join(' ')}</div><b>Code-Notizen</b><span>Diktat des Mannes (Ziffern 1 bis 6, eine könnte falsch sein) und gefundene Ziffern 7 bis 10. Unten: "_" = noch unbekannt.</span></div>`}
  if(Q.ice)h+=`<div class="slot-i got"><div class="ic"><span style="font:800 38px/1 var(--display)">&#9660;</span></div><b>Eis</b><span>Schmilzt zum Glück nicht. Bring es dem gefesselten Mann.</span></div>`;
  if(Q.hasKey)h+=`<div class="slot-i got"><div class="ic"><span style="font:800 34px/1 var(--display);color:var(--gold)">&#9919;</span></div><b>Handschellen-Schlüssel</b><span>Klein, kalt und aus einem Schaltkasten.</span><em>Passt beim Mann vor dem Labor</em></div>`;
  return h}
function questReset(){Object.assign(Q,{talked:false,dictated:false,corrected:false,doorOpen:false,hasKey:false,freed:false,ice:false,tries:3,lockUntil:0});qSave();if(HUB.man)atollRefresh();if(typeof invRender==='function')invRender()}

/* ---------- Dialog ---------- */
const DLG={open:false,lines:[],i:0,done:null,shown:0};
function dlgStart(who,lines,done){DLG.open=true;DLG.lines=lines;DLG.i=0;DLG.done=done||null;K.up=K.down=K.left=K.right=0;$('dlg-who').textContent=who||'';$('dlg').hidden=false;dlgShow();SFX&&tone(300,.05,'square',.03)}
function dlgShow(){DLG.shown=0;$('dlg-text').textContent='';$('dlg-next').textContent=DLG.i>=DLG.lines.length-1?'Fertig ▶':'Weiter ▶'}
function dlgNext(){const l=DLG.lines[DLG.i];if(DLG.shown<l.length){DLG.shown=l.length;$('dlg-text').textContent=l;return}
  DLG.i++;if(DLG.i>=DLG.lines.length){DLG.open=false;$('dlg').hidden=true;const f=DLG.done;DLG.done=null;if(f)f();return}dlgShow()}
setInterval(()=>{if(DLG.open){const l=DLG.lines[DLG.i]||'';if(DLG.shown<l.length){DLG.shown=Math.min(l.length,DLG.shown+2);$('dlg-text').textContent=l.slice(0,DLG.shown)}}},28);
$('dlg-next').onclick=()=>dlgNext();

/* ---------- Code-Tastenfeld ---------- */
const PAD={open:false,buf:''};
function padOpen(){PAD.open=true;PAD.buf='';K.up=K.down=K.left=K.right=0;$('pad').hidden=false;padRefresh();$('pad-ok').focus({preventScroll:true})}
function padClose(){PAD.open=false;$('pad').hidden=true}
function lockLeft(){return Math.max(0,Math.ceil((Q.lockUntil-Date.now())/1000))}
function padRefresh(){const lk=lockLeft();if(lk===0&&Q.lockUntil){Q.lockUntil=0;Q.tries=3}
  $('pad-disp').innerHTML=Array.from({length:10},(_,i)=>`<i class="${i<PAD.buf.length?'f':''}">${PAD.buf[i]||''}</i>`).join('');
  $('pad-info').innerHTML=lk?`<b class="bad">Tür gesperrt: ${lk} s</b> Zu viele falsche Versuche. Bring dem Mann ein Eis, vielleicht fällt ihm etwas ein.`:`Versuche übrig: <b>${'●'.repeat(Q.tries)}${'○'.repeat(3-Q.tries)}</b>`;
  const s=codeSheet();$('pad-note').textContent='Notizen: '+s.slice(0,6).join(' ')+'  |  '+s.slice(6).join(' ');
  [...$('pad-keys').children].forEach(b=>b.disabled=!!lk)}
function padKey(d){if(lockLeft()||PAD.buf.length>=10)return;PAD.buf+=d;tone(420+d*30,.05,'square',.03);padRefresh()}
function padDel(){PAD.buf=PAD.buf.slice(0,-1);padRefresh()}
function padOk(){if(lockLeft())return;if(PAD.buf.length<10){toast('Zehn Ziffern nötig',900);return}
  if(PAD.buf===codeStr()){SFX.win();padClose();Q.doorOpen=true;qSave();toast('Tür offen!',1200);burst(P.x,P.y+3,P.z,60);later(.6,enterLab);return}
  Q.tries--;PAD.buf='';SFX.thud();$('pad').classList.remove('shake');void $('pad').offsetWidth;$('pad').classList.add('shake');
  if(Q.tries<=0){Q.lockUntil=Date.now()+60000;say('e','Die Tür piept dreimal beleidigt und sperrt für eine Minute. Brute-Force funktioniert hier nicht.',4)}
  padRefresh()}
$('pad-keys').innerHTML=[1,2,3,4,5,6,7,8,9].map(n=>`<button type="button" data-d="${n}">${n}</button>`).join('')+'<button type="button" data-a="del">←</button><button type="button" data-d="0">0</button><button type="button" id="pad-ok" data-a="ok">OK</button>';
$('pad-keys').onclick=e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.d!==undefined)padKey(+b.dataset.d);else if(b.dataset.a==='del')padDel();else padOk()};
$('pad-close').onclick=()=>padClose();
setInterval(()=>{if(PAD.open)padRefresh()},500);

/* ---------- Interaktionen ---------- */
const ACT={cur:null};
function actGo(){if(ACT.cur&&G.phase==='play'&&!INV.open&&!DLG.open&&!PAD.open){ac();ACT.cur.fn()}}
$('act').onclick=()=>actGo();
addEventListener('keydown',e=>{
  if(DLG.open){e.stopImmediatePropagation();if(e.code==='Enter'||e.code==='Space'||e.code==='KeyE'){e.preventDefault();dlgNext()}return}
  if(PAD.open){e.stopImmediatePropagation();if(/^Digit[0-9]$/.test(e.code)||/^Numpad[0-9]$/.test(e.code)){e.preventDefault();padKey(+e.code.slice(-1))}else if(e.code==='Backspace'){e.preventDefault();padDel()}else if(e.code==='Enter'){e.preventDefault();padOk()}else if(e.code==='Escape'){e.preventDefault();padClose()}return}
  if(e.code==='Enter'&&G.phase==='play'&&!e.repeat&&!INV.open){e.preventDefault();actGo()}},true);

function manTalk(){
  const w='Mann am Boden';
  if(Q.hasKey&&!Q.freed)return freeMan();
  if(!Q.dictated)return dlgStart(w,['Pst! Hier unten! Ich bin Kiesel, Techniker im Labor. Die Kriminelle haben mich verschnürt.','Sie haben den Reaktor übernommen. Wenn niemand eingreift, fliegt gleich die ganze Insel in die Luft. Du musst da rein.','Die Tür hat einen 10-stelligen Code. Ich sag ihn dir, so gut ich ihn noch weiß: '+DICT.map(d=>DW[d]).join(' … ')+'.','Die letzten vier Ziffern haben sie in der Stadt versteckt: auf einem Funkzettel, einem Schraubendreher, einem USB-Stick und einem Wartungs-Handbuch.','Aber Vorsicht: Nach drei falschen Eingaben sperrt die Tür eine Minute. Und mein Kopf ist ganz leer. Mir knurrt der Magen …'],()=>{Q.talked=true;Q.dictated=true;qSave();invRender();toast('Code-Notizen im Inventar',1500)});
  if(Q.ice&&!Q.corrected)return giveIce();
  if(!Q.corrected)return dlgStart(w,[Q.tries<3||Q.lockUntil?'Hm, falsch? Mein Magen knurrt so laut, dass ich mich selbst nicht höre. Ein Eis wäre jetzt ein Traum. Beim Eiswagen in der Nähe der Start-Ecke gibt es welche.':'Hast du den Code schon probiert? Meine Ohren sind nicht, was sie mal waren. Und mir knurrt der Magen.']);
  if(!Q.freed)return dlgStart(w,['Der Schlüssel für die Handschellen liegt irgendwo im Labor, vermutlich in einem Schaltkasten. Schaltkästen sind immer verschraubt, nimm einen Schraubendreher mit!']);
  dlgStart(w,['Das Atoll-Portal ist hier. Pass auf dich auf!'])}
function giveIce(){dlgStart('Mann am Boden',['Ein Eis! Pistazie, mein Lieblings…, mhmm.','Jetzt arbeitet mein Kopf wieder. Moment: Ich habe mich verhört. Die vierte Ziffer war nicht '+DICT[MIS]+', sondern '+CODE[MIS]+'. Verzeih mir!'],()=>{Q.ice=false;Q.corrected=true;qSave();invRender();SFX.collect(2);toast('Code-Notiz korrigiert',1500)})}
function freeMan(){dlgStart('Mann am Boden',['Der Schlüssel! Klick … die Handschellen sind ab. Endlich wieder Arme!','Danke. Komm mit, ich bringe dich zum Atoll-Portal.'],()=>{Q.freed=true;qSave();SFX.win();manWalk()})}
function doorUse(){
  if(!Q.dictated)return say('e','Die Tür ist verriegelt. Der Mann am Boden scheint etwas sagen zu wollen.',3.4);
  if(Q.doorOpen||Q.hasKey)return enterLab();
  padOpen()}
function vanUse(){if(Q.ice)return say('e','Du hast schon ein Eis. Mehr passt nicht in die Hand.',2.6);
  Q.ice=true;SFX.collect(3);toast('Eis erhalten!',1200);burst(P.x,P.y+2,P.z,30);invRender();say('e',Q.dictated?'Ein Eis. Es sieht aus wie eine Medizin für gefesselte Männer.':'Ein Eis. Der Eisverkäufer sagt, es kostet nichts. Du fragst nicht nach.',3.2)}

function enterLab(){LEVELS[4].vendor=INV.items.has('losung')?'Auf dem Möwen-Bon steht: "Frag nach dem Möwen-Menü." Vielleicht hängt hier irgendwo ein Möwen-Poster.':'Such den Schlüssel für die Handschellen. Schaltkästen sind meistens verschraubt.';HUB.spawnAt=null;applyLevel(4);beginPlay()}
function leaveLab(){const L=HUB.lab;HUB.spawnAt={x:L.cx-1,z:L.cz-21,h:-Math.PI/2};applyLevel(0);beginPlay()}
function atollEnter(){HUB.atollHit=1;G.phase='win';SFX.win();burst(P.x,P.y+3,P.z,120);
  $('overlay').hidden=false;$('card').innerHTML=`<h1>Das Atoll</h1><p class="sub">Das Portal summt. Dahinter liegt die Insel mit dem Reaktor und den vier gesicherten Systemen. Sie ist noch nicht gebaut: Hier endet der Prototyp.</p><div class="badge"><i>★</i><span>Erfolg: Labor-Retter:in. Der Techniker lebt, die Insel noch nicht ganz.</span></div><button class="btn" id="a-city" type="button">Zurück zur Stadt</button><p class="note">Nächster Schritt: das Atoll mit den vier Rätseln (Funkspruch, Alarm, Kamera, Patrouillen-Log).</p>`;
  $('a-city').onclick=()=>{ac();HUB.atollHit=0;applyLevel(0);beginPlay()};$('a-city').focus({preventScroll:true})}

/* ---------- Labor-Gebäude (außen) ---------- */
function pickLabBlock(maze){const R=mulberry(555),c=[];
  for(let j=0;j<5;j++)for(let i=1;i<5;i++){const a=maze.id(i,j),b=maze.id(i+1,j);if(maze.open.has(maze.key(a,b))&&maze.dist[a]>=4&&maze.dist[a]<=8&&!maze.pick.includes(a)&&!maze.pick.includes(b)&&a!==maze.coast&&b!==maze.coast)c.push([i,j,a,b])}
  if(!c.length){for(let j=0;j<5;j++)for(let i=1;i<5;i++){const a=maze.id(i,j),b=maze.id(i+1,j);if(maze.open.has(maze.key(a,b))&&maze.dist[a]>=3)c.push([i,j,a,b])}}
  const [i,j,a,b]=c[Math.floor(R()*c.length)];const cx=(i-2)*50,cz=(j-2)*50;
  const cand=[b,a].filter(n=>!maze.pick.includes(n)&&n!==maze.coast),pn=cand.length?cand[0]:b;
  return {i,j,cx,cz,a,b,portalNode:pn,doorX:cx-2,doorZ:cz-21,manX:cx+9,manZ:cz-21.5,portalX:NODE(pn%6),portalZ:NODE(Math.floor(pn/6))}}
function buildLabBlock(){const H=HUB.h,bx=H.bx,cyl=H.cyl,sph=H.sph,sign=H.sign,MT=H.MT,W=30,D=24,Hh=10;
  bx(MT('#dfe7ee'),W,Hh,D,0,0,0);bx(MT('#b7c3cf'),W+1,.6,D+1,0,Hh,0);
  for(let k=0;k<10;k++)bx(MT(k%2?'#141416':'#ffd23a'),3,1.4,.3,-13.5+k*3,0,-D/2-.15);
  bx(MT('#7fd0f0','#7fd0f0',.45),W-6,1.8,.2,0,5.6,-D/2-.1,false);
  bx(MT('#3a4452'),5.4,5.2,.6,-2,0,-D/2-.3);bx(MT('#ff8a2a','#ff8a2a',.4),6.2,.4,.7,-2,5.2,-D/2-.3);
  bx(MT('#1a1626'),1.4,2,.5,3.6,1.2,-D/2-.45);sph(MT('#7be0a0','#7be0a0',1),.32,.32,.32,3.6,2.9,-D/2-.8,false);
  sph(MT('#9fffd8','#40ffb0',.9),7,5.2,7,0,Hh,0);bx(MT('#cfd6dd'),4,1,4,0,Hh+4.8,0);
  [[-11,5],[11,5]].forEach(([x,z])=>{cyl(MT('#cfd6dd'),3.4,14,x,0,z);cyl(MT('#ff5f5f','#ff5f5f',.7),3.5,.7,x,12,z);sph(MT('#ffffff'),2.2,1.4,2.2,x,15.6,z,false)});
  cyl(MT('#cfcfe0'),.2,9,-13,Hh,-8);sph(MT('#ff2a4a','#ff2a4a',1),.55,.55,.55,-13,Hh+9.4,-8,false);
  sign('LABOR','#7ff0ff',0,Hh-1.8,-D/2-.2,8,2,Math.PI,'#10183a');sign('ZUTRITT VERBOTEN','#ff5f5f',-9.5,2.6,-D/2-.2,6.6,1.6,Math.PI,'#3a0a10');
  for(let k=0;k<3;k++)bx(MT(['#a66b28','#8a5a3a','#c98a4a'][k]),2.2,2.2,2.2,-12+k*2.6,0,-D/2-3.4);bx(MT('#5a6a8a'),1.4,2,1.4,12,0,-D/2-2.6);
  HUB.labBuilt=true}
function buildAtollQuestObjects(){const L=HUB.lab;if(!L)return;
  /* gefesselter Mann */
  const man=skater(L.manX,1.3,L.manZ,Math.PI,'D',1.35);dynOf(man);man.userData.board.visible=false;
  const rope=new THREE.MeshStandardMaterial({color:'#c9a46a',roughness:.9}),dark=new THREE.MeshStandardMaterial({color:'#2a2a33',metalness:.6,roughness:.4});
  [[1.25,.46],[.62,.42]].forEach(([y,r])=>{const t=new THREE.Mesh(new THREE.TorusGeometry(r,.05,6,14),rope);t.position.y=y;t.rotation.x=Math.PI/2;man.add(t)});
  [-1,1].forEach(s=>{const t=new THREE.Mesh(new THREE.TorusGeometry(.1,.035,6,10),dark);t.position.set(s*.26,.9,.18);t.rotation.y=Math.PI/2;man.add(t)});
  addOutlines(man,'actor');
  sc.remove(man);W0.add(man);const bl=mkBlob(3.4,3.4);sc.remove(bl);W0.add(bl);
  HUB.man={g:man,state:'tied',x:L.manX,z:L.manZ,path:[],pi:0,bl};
  /* Atoll-Portal (erst nach der Befreiung sichtbar) */
  const g=portal(L.portalX,8,L.portalZ);sc.remove(g);g.rotation.y=0;g.children[0].material.color.set('#2fd6b0');g.children[0].material.emissive.set('#2fd6b0');[1,2,3].forEach(i=>g.children[i].material.color.set(['#ffe066','#1cafd1','#ffffff'][i-1]));g.userData.noBake=true;W0.add(g);
  const beam=new THREE.Mesh(new THREE.CylinderGeometry(3,3,90,16,1,true),BM('#2fd6b0',{transparent:true,opacity:.3,side:THREE.DoubleSide,depthWrite:false,fog:false}));beam.position.set(L.portalX,45,L.portalZ);beam.userData.noBake=true;beam.userData.noOutline=true;W0.add(beam);
  addOutlines(g,'actor');HUB.atoll={g,beam,x:L.portalX,z:L.portalZ};
  /* Eiswagen */
  icevan(-40,21.5,Math.PI/2,'#8fd6e4');const van=sc.children[sc.children.length-1];sc.remove(van);van.userData.noBake=true;W0.add(van);addOutlines(van,'prop');
  HUB.colliders.push({x0:-43.6,x1:-36.4,z0:19.2,z1:23.8,top:999});HUB.van={x:-40,z:21.5};
  atollRefresh()}
function atollRefresh(){const m=HUB.man,A=HUB.atoll,L=HUB.lab;if(!m||!A)return;
  A.g.visible=Q.freed;A.beam.visible=Q.freed;
  if(Q.freed){m.state='stand';m.x=L.portalX+(L.portalX>L.cx?-4:4);m.z=L.portalZ+(L.portalZ>0?-4:4);m.g.position.set(m.x,1.3,m.z);m.g.rotation.set(0,Math.PI/2,0);m.g.children.forEach(c=>{if(c.geometry&&c.geometry.type==='TorusGeometry')c.visible=false})}
  else{m.state='tied';m.x=L.manX;m.z=L.manZ;m.g.position.set(m.x,1.3+.55,m.z);m.g.rotation.set(0,Math.PI,Math.PI/2);m.g.children.forEach(c=>{if(c.geometry&&c.geometry.type==='TorusGeometry')c.visible=true})}}
function manWalk(){const m=HUB.man,L=HUB.lab,A=HUB.atoll;A.g.visible=true;A.beam.visible=true;
  m.g.rotation.set(0,Math.PI,0);m.g.position.y=1.3;m.g.children.forEach(c=>{if(c.geometry&&c.geometry.type==='TorusGeometry')c.visible=false});
  const tz=L.portalZ+(L.portalZ>0?-4:4),px=L.portalX+(L.portalX>L.cx?-4:4);m.path=[[m.x,L.cz-25],[px,L.cz-25],[px,tz]];m.pi=0;m.state='walk'}

/* ---------- Schritt pro Frame ---------- */
function curActs(){const a=[],L=HUB.lab;
  if(LV.id===0&&HUB.built&&L){
    const m=HUB.man;
    if(m&&!Q.freed)a.push({x:L.manX,z:L.manZ,r:6.5,label:Q.hasKey?'Mann befreien (Schlüssel)':(Q.ice&&Q.dictated&&!Q.corrected)?'Dem Mann das Eis geben':'Mit dem Mann sprechen',fn:manTalk});
    else if(m&&Q.freed&&m.state==='stand')a.push({x:m.x,z:m.z,r:6,label:'Mit dem Mann sprechen',fn:manTalk});
    a.push({x:L.doorX,z:L.doorZ,r:9,label:!Q.dictated?'Labor-Tür (verriegelt)':(Q.doorOpen||Q.hasKey)?'Labor betreten':'Code eingeben',fn:doorUse});
    if(HUB.van&&!Q.ice)a.push({x:HUB.van.x,z:HUB.van.z,r:7,label:'Eis holen',fn:vanUse})}
  else if(LV.id===4){
    a.push({x:0,z:27.5,r:7,label:'Labor verlassen',fn:leaveLab});
    a.push({x:-34,z:-23,r:7,label:Q.hasKey?'Schaltkasten (leer)':'Schaltkasten untersuchen',fn:()=>{if(Q.hasKey)return dlgStart('',['Leer. Nur noch ein bisschen Staub und ein ordentlicher Kabelsalat.']);
      if(!INV.items.has('schraube'))return dlgStart('',['Das Gehäuse ist verschraubt. Ohne Schraubendreher geht nichts. Vielleicht verkauft ihn ein Laden in der Stadt.']);
      dlgStart('',['Du löst die Schrauben, eine nach der anderen. Die Tür springt auf.','Im Kasten liegt ein kleiner Schlüssel. Er passt zu Handschellen.'],()=>{Q.hasKey=true;qSave();invRender();setQuest(LV.quest,1);SFX.win();burst(P.x,P.y+3,P.z,60);toast('Schlüssel gefunden!',1400);say('e','Mit dem Schlüssel solltest du zurück zum Mann vor dem Labor.',3.4)})}});
    a.push({x:34,z:-23,r:7,label:'Spind untersuchen',fn:()=>dlgStart('',['Ein Pausenbrot, schon leicht grün. Kein Schlüssel.'])});
    a.push({x:32,z:17,r:7,label:'Schreibtisch untersuchen',fn:()=>dlgStart('',['Eine Kaffeetasse, ein Notizzettel: "Reaktor NICHT anfassen!" und darunter jemand mit Kuli: "Zu spät." Kein Schlüssel.'])})}
  return a}
function stepAtoll(dt){
  const ui=INV.open||DLG.open||PAD.open;
  const m=HUB.man;
  if(m&&LV.id===0){
    m.bl.visible=true;m.bl.position.set(m.x,1.34,m.z);
    if(m.state==='walk'){const t=m.path[m.pi];if(!t){m.state='stand';m.g.rotation.set(0,Math.PI/2,0);say('e','Der Techniker zeigt auf das Portal. "Hier ist es. Dahinter liegt das Atoll."',4.4);}else{const dx=t[0]-m.x,dz=t[1]-m.z,d=Math.hypot(dx,dz),sp=5.2*dt;if(d<sp+.2){m.pi++}else{m.x+=dx/d*sp;m.z+=dz/d*sp;m.g.rotation.y=Math.PI/2-Math.atan2(dz,dx)}
      m.g.position.set(m.x,1.3,m.z);const u=m.g.userData;if(u.arms)u.arms.forEach(({sg,s})=>{sg.rotation.z=s*(.7+.4*Math.sin(G.t*9+(s>0?0:3)))})}}
    if(m.state==='tied'){const u=m.g.userData;if(u.arms)u.arms.forEach(({sg,s})=>{sg.rotation.z=s*.25});m.g.position.y=1.3+.55+Math.sin(G.t*1.8)*.03}
    else if(m.state==='stand'){const u=m.g.userData;if(u.arms)u.arms.forEach(({sg,s})=>{sg.rotation.z=s*(.5+.15*Math.sin(G.t*2))})}
    if(HUB.atoll&&Q.freed){const A=HUB.atoll;A.g.children.forEach((c,i)=>{if(i>0)c.rotation.z+=dt*(i%2?1.4:-1.1)});
      if(G.phase==='play'&&!HUB.atollHit&&Math.hypot(P.x-A.x,P.z-A.z)<5.2&&m.state!=='walk')atollEnter()}}
  else if(m)m.bl.visible=false;
  /* Aktion in der Nähe */
  let best=null,bd=1e9;
  if(G.phase==='play'&&!ui&&(LV.id===0||LV.id===4))for(const a of curActs()){const d=Math.hypot(P.x-a.x,P.z-a.z);if(d<a.r&&d<bd){bd=d;best=a}}
  ACT.cur=best;const el=$('act');if(best){el.hidden=false;el.firstElementChild.textContent=best.label}else el.hidden=true;
  if(LV.id===4)stepLevel4(dt)}

/* ---------- Labor-Innenraum (Level 4) ---------- */
LEVELS[4]={id:4,mode:'city',pips:1,boss:'',bossColor:'#f0cf36',bossSpeed:0,grav:20,goal:'Schlüssel',
  quest:'Finde den Schlüssel',goalQuest:'',
  intro:'Du bist im Labor. Der Reaktor summt, irgendwo piept ein Alarm. Hier muss ein Schlüssel für die Handschellen liegen.',
  vendor:'Such den Schlüssel für die Handschellen.',lines:[],chase:'',eat:'',win:'',winSub:'',badge:''};
Object.defineProperty(LEVELS[0],'intro',{get(){return Q.freed?'Zurück in der Stadt. Der Techniker steht beim Atoll-Portal.':Q.hasKey?'Zurück in der Stadt. Der Mann vor dem Labor wartet auf seinen Schlüssel.':HUB.spawnAt?'Du stehst wieder vor dem Labor.':'Willkommen in der Stadt. Im Westen liegt die Küste: Wer sie erreicht, startet das Rennen. Vor einem Labor liegt ein gefesselter Mann.'},set(v){}});
let W4=null;const L4={colliders:[],start:{x:0,z:23,h:-Math.PI/2},lights:[],core:null,alarms:[]};
function buildLevel4(){
  if(W4)return;W4=new THREE.Group();W4.userData.noBake=true;W4.visible=false;sc.add(W4);
  const Y=1.3,add=o=>{W4.add(o);return o};
  const box=(w,h,d,x,y,z,col,em,ei,cast=true)=>{const m=new THREE.Mesh(BX,MT(col,em,ei));m.scale.set(w,h,d);m.position.set(x,Y+y+h/2,z);m.castShadow=cast;m.receiveShadow=true;return add(m)};
  const cylm=(r,h,x,y,z,col,em,ei)=>{const m=new THREE.Mesh(CY,MT(col,em,ei));m.scale.set(r,h,r);m.position.set(x,Y+y+h/2,z);m.castShadow=true;return add(m)};
  const sphm=(rx,ry,rz,x,y,z,col,em,ei)=>{const m=new THREE.Mesh(SP,MT(col,em,ei));m.scale.set(rx,ry,rz);m.position.set(x,Y+y,z);return add(m)};
  const col=(x0,x1,z0,z1)=>L4.colliders.push({x0,x1,z0,z1,top:999});
  /* Boden mit Fliesen */
  const ft=document.createElement('canvas');ft.width=ft.height=128;{const g=ft.getContext('2d');g.fillStyle='#cfd8e0';g.fillRect(0,0,128,128);g.fillStyle='#bcc8d2';g.fillRect(0,0,64,64);g.fillRect(64,64,64,64);g.strokeStyle='#9aa8b4';g.lineWidth=2;g.strokeRect(0,0,128,128)}
  const ftx=new THREE.CanvasTexture(ft);ftx.colorSpace=THREE.SRGBColorSpace;ftx.wrapS=ftx.wrapT=THREE.RepeatWrapping;ftx.repeat.set(16,12);
  const fl=new THREE.Mesh(new THREE.PlaneGeometry(88,66),new THREE.MeshStandardMaterial({map:ftx,roughness:.5}));fl.rotation.x=-Math.PI/2;fl.position.set(0,Y+.02,0);fl.receiveShadow=true;fl.userData.noBake=true;add(fl);
  /* Wände */
  const wallC='#dfe7ee',trim='#4cc3ff';
  [[0,-31,88,2],[0,31,88,2],[-43,0,2,64],[43,0,2,64]].forEach(([x,z,w,d])=>{box(w,11,d,x,0,z,wallC);box(w>d?w:.4,.5,w>d?.4:d,x+(w>d?0:(x<0?1.1:-1.1)),2.2,z+(w>d?(z<0?1.1:-1.1):0),trim,trim,.8,false)});
  col(-46,46,-35,-30.2);col(-46,46,30.2,35);col(-46,-42.2,-35,35);col(42.2,46,-35,35);
  /* Trennwände */
  box(1,9,22,-20,0,-19,wallC);col(-20.6,-19.4,-30,-8);box(1,9,22,20,0,19,wallC);col(19.4,20.6,8,30);
  /* Reaktor */
  cylm(6.4,2,0,0,0,'#7a8794');cylm(5,8,0,2,0,'#cfd6dd');sphm(4.2,3.6,4.2,0,10.6,0,'#9fffd8','#40ffb0',.9);
  [3,6].forEach(y=>cylm(5.4,.5,0,y,0,'#ffd23a','#ffd23a',.4));col(-7.6,7.6,-7.6,7.6);
  for(let k=0;k<16;k++){const a=k/16*Math.PI*2;box(1.6,.06,.7,Math.cos(a)*9.4,0,Math.sin(a)*9.4,k%2?'#141416':'#ffd23a',null,0,false).rotation.y=-a}
  /* Konsolen und Rohre */
  for(let k=0;k<6;k++){const x=-34+k*13;box(6,3.4,2.4,x,0,-27.4,'#2a3a52');box(5.2,1.8,.2,x,3.4,-26.3,'#0a1a2a',k%2?'#7ff0ff':'#7be0a0',.9,false);col(x-3.2,x+3.2,-29,-26)}
  for(let k=0;k<4;k++)cylm(.5,10,-38+k*2.2,0,24+k*.2,'#8a96a4');
  /* Attrappen und Schlüsselkasten */
  box(4,5,2.2,-34,0,-24,'#7a8794');for(let q=0;q<4;q++)sphm(.22,.22,.22,-35.4+(q%2)*2.8,1.4+(q>1?2.4:0),-22.8,'#ff8a2a','#ff8a2a',.4);box(3,.5,.2,-34,5.2,-22.9,'#ffd23a','#ffd23a',.5,false);col(-36.4,-31.6,-26,-21.6);
  {const gc=document.createElement('canvas');gc.width=gc.height=128;const g=gc.getContext('2d');g.fillStyle='#4cc3ff';g.fillRect(0,0,128,128);g.fillStyle='#fff';g.beginPath();g.ellipse(64,66,36,18,-.2,0,7);g.fill();g.beginPath();g.arc(98,52,10,0,7);g.fill();g.fillStyle='#ffd23a';g.beginPath();g.moveTo(106,52);g.lineTo(122,56);g.lineTo(106,60);g.fill();g.fillStyle='#2a3a52';g.beginPath();g.moveTo(30,62);g.quadraticCurveTo(10,40,34,46);g.lineTo(46,60);g.fill();g.fillRect(100,50,3,3);g.strokeStyle='#fff';g.lineWidth=4;g.strokeRect(4,4,120,120);
   const gt=new THREE.CanvasTexture(gc);gt.colorSpace=THREE.SRGBColorSpace;const pm=new THREE.Mesh(new THREE.PlaneGeometry(4,4),new THREE.MeshBasicMaterial({map:gt}));pm.position.set(-41.8,Y+7.6,-24);pm.rotation.y=Math.PI/2;pm.userData.noBake=true;add(pm)}
  box(3,7,2.2,34,0,-24,'#8a96a4');for(let q=0;q<4;q++)box(2.2,.2,.1,34,2+q*1.2,-22.9,'#4a5664',null,0,false);col(32,36,-26,-21.8);
  box(8,2.4,3.6,32,0,18,'#7a5a3a');box(1.4,.5,1.4,30,2.4,18,'#ffffff');box(2,.1,1.4,34,2.4,18,'#fff6ea');col(27.6,36.4,15.8,20.2);
  /* Kisten und Pizza der Kriminellen */
  [[-30,22],[-26,24],[-34,25]].forEach(([x,z],k)=>box(3,3,3,x,0,z,['#a66b28','#8a5a3a','#c98a4a'][k]));col(-36,-24,20,27);
  box(2.2,.3,2.2,26,0,-6,'#ffffff');box(2.2,.3,2.2,26.3,.3,-6.1,'#e5383b');
  /* Ausgang */
  box(7,.4,.6,0,9,30,'#2a3a52');box(.8,9,.6,-3.4,0,30,'#2a3a52');box(.8,9,.6,3.4,0,30,'#2a3a52');
  const ex=new THREE.Mesh(new THREE.PlaneGeometry(6,1.5),signMat('AUSGANG','#7be0a0','#10282a'));ex.position.set(0,Y+10,29.4);ex.rotation.y=Math.PI;ex.userData.noBake=true;add(ex);
  /* Alarmlichter */
  L4.lights=[new THREE.PointLight('#7fffc8',90,45,1.6),new THREE.PointLight('#7ff0ff',60,60,1.8)];L4.lights[0].position.set(0,9,0);L4.lights[1].position.set(0,14,-10);L4.lights.forEach(l=>add(l));
  box(88,.8,66,0,10.6,0,'#2a3444',null,0,false);
  bakeGroup(W4);
  /* dynamische Teile erneut anlegen: Kern, Alarme */
  L4.core=sphm(2.6,2.6,2.6,0,5.6,0,'#c8ffe8','#7fffc8',1.2);L4.core.userData.noBake=true;L4.alarms=[[-41,-8],[41,8],[-41,22],[41,-22]].map(([x,z])=>{const m=sphm(.6,.6,.6,x,8.5,z,'#ff2a4a','#ff2a4a',1);m.userData.noBake=true;return m})}
function stepLevel4(dt){if(!W4||!W4.visible)return;const t=G.t;if(L4.core)L4.core.scale.setScalar(2.6*(1+.06*Math.sin(t*3)));L4.alarms.forEach((a,i)=>{a.material.emissiveIntensity=.2+.8*Math.max(0,Math.sin(t*5+i*1.6))})}
invRender();
