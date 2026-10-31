/* ================= Atoll: vier gesicherte Systeme, Countdown, Boot ================= */
LEVELS[5]={id:5,mode:'city',pips:4,boss:'',bossColor:'#f0cf36',bossSpeed:0,grav:20,goal:'Boot',
  quest:'Rette die Insel: vier Systeme',goalQuest:'',
  intro:'Das Atoll. Hinter dem Tor liegt das letzte Boot, und in zehn Minuten legt es ab. Vier Systeme halten das Tor zu. Lös sie mit Köpfchen.',
  vendor:'Funk: Funkhütte im Westen, Alarmkasten im Osten, Kamera in der Mitte, Wachhaus im Norden. Alle vier brauchen etwas aus der Stadt.',
  lines:[],chase:'',eat:'',win:'',winSub:'',badge:''};
const ISL={s:[false,false,false,false],t:600,bonus:false,gate:false,pinTries:3,pinLock:0,failing:false,alarm:true};
const L5={colliders:[],start:{x:0,z:42,h:-Math.PI/2},core:null,lamps:[],gateDoor:null,gateCol:null,boat:null,alarms:[],sign:null};
const SECRET='STEG IM NORDEN';
function caesar(t,k){return t.replace(/[A-ZÄÖÜ]/g,c=>{const a='ABCDEFGHIJKLMNOPQRSTUVWXYZ',i=a.indexOf(c);return i<0?c:a[((i+k)%26+26)%26]})}
const PIN_OK='4711';
const LOGLINES=['07:10 Wache A: Tor','07:25 Wache A: Steg','07:40 PAUSE (beide Wachen weg)','08:10 Wache A: Tor','08:25 Wache A: Steg','08:40 PAUSE (beide Wachen weg)','09:10 Wache A: Tor','09:25 Wache A: Steg','09:40 PAUSE (beide Wachen weg)','10:10 Wache A: Tor','10:25 Wache A: Steg'];
const isl=n=>ISL.s.filter(Boolean).length;
function islandReset(){ISL.s=[false,false,false,false];ISL.t=600;ISL.bonus=false;ISL.gate=false;ISL.pinTries=3;ISL.pinLock=0;ISL.failing=false;ISL.alarm=true;islandVisuals();$('cd').hidden=false}
function islandVisuals(){if(!W5)return;L5.lamps.forEach((l,i)=>{const on=ISL.s[i];l.material.color.set(on?'#7be0a0':'#ff5f5f');l.material.emissive.set(on?'#7be0a0':'#ff5f5f')});
  if(L5.gateDoor)L5.gateDoor.visible=!ISL.gate;if(L5.gateCol)L5.gateCol.x0=ISL.gate?9999:-8;
  if(L5.core){const c=ISL.gate?'#7fffc8':'#ff4a4a';L5.core.material.color.set(c);L5.core.material.emissive.set(c)}}
function islandSolved(i,say1){ISL.s[i]=true;islandVisuals();setQuest(LV.quest,isl());SFX.win();burst(P.x,P.y+3,P.z,70);toast(['Funkspruch gelesen','Alarm aus','Kamera blind','Log gelesen'][i]+'!  '+isl()+' / 4',1500);if(say1)say('e',say1,5);
  if(isl()===4)later(1.2,()=>say('e','Alle vier Lampen leuchten grün. Das Tor lässt sich jetzt öffnen.',4))}

/* ---------- Puzzle-Fenster ---------- */
const PUZ={open:false,kind:0};
function puzClose(){PUZ.open=false;$('puz').hidden=true}
function puzHTML(h,title,sub){$('puz-t').textContent=title;$('puz-sub').textContent=sub||'';$('puz-b').innerHTML=h;PUZ.open=true;$('puz').hidden=false;K.up=K.down=K.left=K.right=0}
$('puz-close').onclick=()=>puzClose();
function puz1(){let sh=0;const cipher=caesar(SECRET,3),has=INV.items.has('funk');
  puzHTML(`<div class="cipher" id="p1-c">${cipher}</div><div class="shift"><button type="button" id="p1-m" aria-label="weniger">−</button><span>Verschiebung <b id="p1-n">0</b></span><button type="button" id="p1-p" aria-label="mehr">+</button></div><div class="cipher plain" id="p1-r">${cipher}</div><p class="tip">${has?'Auf dem Funkzettel steht: "Die Banditen schieben jeden Buchstaben um 3 weiter."':'Tipp: Schieb die Buchstaben zurück, bis ein Satz entsteht. Es gibt nur 25 Möglichkeiten. Ein Funkzettel aus der Stadt würde die Zahl verraten.'}</p><button class="btn" id="p1-go" type="button">Funkspruch lesen</button>`,'Funkhütte','Der abgefangene Funkspruch ist verschlüsselt.');
  const upd=()=>{$('p1-n').textContent=sh;$('p1-r').textContent=caesar(cipher,-sh)};
  $('p1-m').onclick=()=>{sh=(sh+25)%26;upd();tone(300,.05,'square',.03)};$('p1-p').onclick=()=>{sh=(sh+1)%26;upd();tone(380,.05,'square',.03)};
  $('p1-go').onclick=()=>{if(caesar(cipher,-sh)===SECRET){puzClose();islandSolved(0,'Der Funkspruch lautet: "'+SECRET+'". Caesar-Codes sind schwach: Es gibt nur 25 Schlüssel, jeder kann sie durchprobieren.')}else{toast('Das ergibt keinen Satz',900);SFX.thud()}}}
function puz2(){
  if(!INV.items.has('schraube')){dlgStart('',['Die Abdeckung des Alarmkastens ist verschraubt. Du brauchst einen Schraubendreher. In der Stadt gibt es einen bei einem Laden.']);return}
  const st={A:1,B:1,C:0};
  puzHTML(`<div class="logic">ALARM = (A UND B) ODER (NICHT C)</div><div class="sw" id="p2-sw"><button type="button" data-k="A">A</button><button type="button" data-k="B">B</button><button type="button" data-k="C">C</button></div><div class="alarm" id="p2-o"></div><p class="tip">UND ist nur wahr, wenn beides wahr ist. ODER ist wahr, wenn mindestens eins wahr ist. NICHT dreht um. Schalte so, dass der Alarm AUS ist.</p><button class="btn" id="p2-go" type="button">Bestätigen</button>`,'Alarmkasten','Du hast die Schrauben gelöst. Drei Schalter, ein Alarm.');
  const out=()=>((st.A&&st.B)||!st.C)?1:0;
  const upd=()=>{[...$('p2-sw').children].forEach(b=>{b.className=st[b.dataset.k]?'on':'';b.textContent=b.dataset.k+': '+(st[b.dataset.k]?'AN':'AUS')});$('p2-o').textContent='Alarm: '+(out()?'AN':'AUS');$('p2-o').className='alarm '+(out()?'bad':'good')};
  $('p2-sw').onclick=e=>{const b=e.target.closest('button');if(!b)return;st[b.dataset.k]^=1;upd();tone(440,.05,'square',.03)};upd();
  $('p2-go').onclick=()=>{if(!out()){puzClose();ISL.alarm=false;islandSolved(1,'Der Alarm schweigt. Logikgatter sind Ja-Nein-Entscheider: Mit A=AUS oder B=AUS und C=AN ist die Formel falsch.')}else{toast('Der Alarm heult noch',900);SFX.thud()}}}
function lockPin(){return Math.max(0,Math.ceil((ISL.pinLock-Date.now())/1000))}
function puz3(){let buf='';const has=INV.items.has('handbuch');
  puzHTML(`<div class="cam">Kamera-Modell Q-7 · Verwaltung</div><div class="pinD" id="p3-d"></div><p id="p3-i" class="tip"></p><div class="keys3" id="p3-k"></div><p class="tip">${has?'Handbuch, Seite 13: "Kamera Q-7, Werks-PIN: 4711. Bitte nach dem Einbau ändern!"':'Das Handbuch eines Wartungstechnikers könnte Werks-PINs verraten. In der Stadt liegt eins in einem Wohnhaus.'}</p>`,'Kamera-Mast','Vier Ziffern. Nach drei Fehlern sperrt die Anmeldung.');
  const upd=()=>{const lk=lockPin();if(lk&&!ISL.pinLock)ISL.pinLock=0;if(!lk&&ISL.pinLock){ISL.pinLock=0;ISL.pinTries=3}
    $('p3-d').innerHTML=Array.from({length:4},(_,i)=>`<i>${buf[i]||''}</i>`).join('');
    $('p3-i').innerHTML=lk?`<b class="bad">Gesperrt: ${lk} s</b>`:'Versuche: '+'●'.repeat(ISL.pinTries)+'○'.repeat(3-ISL.pinTries);[...$('p3-k').children].forEach(b=>b.disabled=!!lk)};
  $('p3-k').innerHTML=[1,2,3,4,5,6,7,8,9].map(n=>`<button type="button" data-d="${n}">${n}</button>`).join('')+'<button type="button" data-a="del">←</button><button type="button" data-d="0">0</button><button type="button" data-a="ok">OK</button>';
  $('p3-k').onclick=e=>{const b=e.target.closest('button');if(!b||lockPin())return;if(b.dataset.d!==undefined){if(buf.length<4){buf+=b.dataset.d;tone(420,.05,'square',.03)}}else if(b.dataset.a==='del')buf=buf.slice(0,-1);else if(buf.length===4){
      if(buf===PIN_OK){puzClose();islandSolved(2,'Die Kamera ist blind. Standard-Passwörter sind die häufigste echte Sicherheitslücke: Immer ändern, nie lassen.')}
      else{ISL.pinTries--;buf='';SFX.thud();if(ISL.pinTries<=0){ISL.pinLock=Date.now()+30000;toast('Gesperrt für 30 Sekunden',1300)}}}
    upd()};upd();window.__p3tick=setInterval(()=>{if(!PUZ.open||!$('p3-d')){clearInterval(window.__p3tick);return}upd()},500)}
function puz4(){
  if(!INV.items.has('usb')){dlgStart('',['Das Terminal wartet auf einen Datenträger. Auf dem USB-Stick aus dem Büroviertel steht PATROUILLE. Den brauchst du.']);return}
  puzHTML(`<div class="logb">${LOGLINES.map(l=>`<div class="${l.includes('PAUSE')?'pz':''}">${l}</div>`).join('')}<div class="q">?</div></div><p class="tip">Die Wachen halten einen Rhythmus ein. Wann beginnt die nächste Pause?</p><div class="opts" id="p4-o">${['10:30','10:40','10:55','11:10'].map(o=>`<button type="button" data-o="${o}">${o}</button>`).join('')}</div>`,'Wachhaus','patrouille.log vom USB-Stick:');
  $('p4-o').onclick=e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.o==='10:40'){puzClose();islandSolved(3,'Jede Stunde um :10 Tor, :25 Steg, :40 Pause. Logs verraten Muster. Wer Muster liest, findet Lücken, bevor es jemand anderes tut.')}else{toast('Das passt nicht ins Muster',900);SFX.thud()}}}
addEventListener('keydown',e=>{if(!PUZ.open)return;e.stopImmediatePropagation();if(e.code==='Escape'){e.preventDefault();puzClose()}},true);

/* ---------- Aktionen auf der Insel ---------- */
function islandActs(a){
  a.push({x:-42,z:12,r:8,label:ISL.s[0]?'Funkgerät (erledigt)':'Funkgerät benutzen',fn:()=>ISL.s[0]?say('e','Das Funkgerät rauscht zufrieden.',2.4):puz1()});
  a.push({x:43,z:12,r:8,label:ISL.s[1]?'Alarmkasten (erledigt)':'Alarmkasten öffnen',fn:()=>ISL.s[1]?say('e','Der Kasten ist still.',2.4):puz2()});
  a.push({x:0,z:21,r:8,label:ISL.s[2]?'Kamera (erledigt)':'Kamera-Mast bedienen',fn:()=>ISL.s[2]?say('e','Die Kamera schaut ins Leere.',2.4):puz3()});
  a.push({x:-30,z:-12,r:8,label:ISL.s[3]?'Terminal (erledigt)':'Wachhaus-Terminal',fn:()=>ISL.s[3]?say('e','Das Terminal zeigt nur noch den Bildschirmschoner.',2.4):puz4()});
  a.push({x:0,z:-20,r:9,label:ISL.gate?'Tor (offen)':isl()===4?'Tor öffnen':'Tor (gesperrt: '+isl()+'/4)',fn:()=>{if(ISL.gate)return;if(isl()<4)return say('e','Das Tor bleibt zu. Es fehlen noch '+(4-isl())+' Lampen.',3);ISL.gate=true;islandVisuals();SFX.win();burst(P.x,P.y+3,P.z,80);say('e','Das Tor schwingt auf. Der Reaktor färbt sich grün. Jetzt schnell zum Boot.',4.6)}});
  a.push({x:22,z:33,r:7,label:ISL.bonus?'Möwen-Imbiss (Menü gegessen)':INV.items.has('losung')?'Möwen-Menü bestellen':'Möwen-Imbiss',fn:()=>{if(ISL.bonus)return say('e','Du hast das Möwen-Menü schon gegessen. Eine Möwe schaut vorwurfsvoll.',3);
    if(!INV.items.has('losung'))return dlgStart('Möwen-Imbiss',['Wir haben geschlossen. Außer für Leute mit der Losung. Frag mich nicht, welche.']);
    dlgStart('Möwen-Imbiss',['"Frag nach dem Möwen-Menü"? Du kennst die Losung! Hier, frisch aus der Fritteuse. Das gibt Kraft.'],()=>{ISL.bonus=true;ISL.t+=60;SFX.collect(4);toast('+60 Sekunden!',1400);burst(P.x,P.y+2,P.z,50)})}});
  a.push({x:80,z:-36,r:8,label:ISL.gate?'Boot besteigen':'Das Boot (hinter dem Tor)',fn:()=>{if(!ISL.gate)return say('e','Das Boot liegt hinter dem Tor. Erst die vier Systeme lösen.',3);islandWin()}})}
function islandWin(){G.phase='win';SFX.win();burst(P.x,P.y+3,P.z,140);const left=Math.max(0,Math.round(ISL.t));$('cd').hidden=true;
  $('overlay').hidden=false;$('card').innerHTML=`<h1>Insel gerettet!</h1><p class="sub">Das Tor ist offen, der Reaktor grün, und der Techniker winkt vom Steg. Das letzte Boot legt mit dir ab.</p>
   <div class="stats"><div><div class="n">${Math.floor(left/60)}:${String(left%60).padStart(2,'0')}</div><div class="l">Zeit übrig</div></div><div><div class="n">${ISL.bonus?'Ja':'Nein'}</div><div class="l">Möwen-Menü</div></div><div><div class="n">4/4</div><div class="l">Systeme</div></div></div>
   <div class="badge"><i>★</i><span>Erfolg: Inselretter:in. Du hast vier Systeme mit Köpfchen gelöst: Verschlüsselung, Logik, Passwörter und Muster.</span></div>
   <button class="btn" id="i-city" type="button">Zurück zur Stadt</button><button class="btn sec" id="i-again" type="button">Atoll noch einmal</button>`;
  $('i-city').onclick=()=>{ac();applyLevel(0);beginPlay()};$('i-again').onclick=()=>{ac();applyLevel(5);beginPlay()};$('i-city').focus({preventScroll:true})}
function islandFail(){if(ISL.failing)return;ISL.failing=true;SFX.siren();dlgStart('Funk',['Das letzte Boot legt ab. Ohne dich.','Die Insel startet neu. Dir ist nichts passiert, nur der Countdown hat gewonnen. Versuch es noch einmal.'],()=>{applyLevel(5);beginPlay()})}
function stepIsland(dt){
  if(LV.id!==5||!W5||!W5.visible)return;const t=G.t;
  if(G.phase==='play'&&!ISL.failing&&!(INV.open||DLG.open||PAD.open||PUZ.open)){ISL.t-=dt;if(ISL.t<=0){ISL.t=0;islandFail()}}
  const s=Math.max(0,Math.ceil(ISL.t));$('cd-t').textContent=Math.floor(s/60)+':'+String(s%60).padStart(2,'0');$('cd').classList.toggle('low',s<60);
  if(L5.core)L5.core.scale.setScalar(4.2*(1+.05*Math.sin(t*3)));
  L5.alarms.forEach((a,i)=>{a.visible=ISL.alarm&&Math.sin(t*6+i)>-.2});
  if(L5.boat)L5.boat.position.y=1.2+Math.sin(t*1.4)*.25,L5.boat.rotation.z=Math.sin(t*1.1)*.04;
  if(L5.sign)L5.sign.rotation.y=Math.sin(t*.8)*.1}

/* ---------- Insel bauen ---------- */
let W5=null;
function buildLevel5(){
  if(W5)return;W5=new THREE.Group();W5.userData.noBake=true;W5.visible=false;sc.add(W5);
  const Y=1.3,add=o=>{W5.add(o);return o};
  const box=(w,h,d,x,y,z,col,em,ei,cast=true)=>{const m=new THREE.Mesh(BX,MT(col,em,ei));m.scale.set(w,h,d);m.position.set(x,Y+y+h/2,z);m.castShadow=cast;m.receiveShadow=true;return add(m)};
  const cylm=(r,h,x,y,z,col,em,ei)=>{const m=new THREE.Mesh(CY,MT(col,em,ei));m.scale.set(r,h,r);m.position.set(x,Y+y+h/2,z);m.castShadow=true;return add(m)};
  const sphm=(rx,ry,rz,x,y,z,col,em,ei)=>{const m=new THREE.Mesh(SP,MT(col,em,ei));m.scale.set(rx,ry,rz);m.position.set(x,Y+y,z);return add(m)};
  const col=(x0,x1,z0,z1)=>{const c={x0,x1,z0,z1,top:999};L5.colliders.push(c);return c};
  /* Meer, Strand, Gras */
  const sea=new THREE.Mesh(new THREE.PlaneGeometry(900,900),new THREE.MeshStandardMaterial({color:'#1cafd1',roughness:.25,metalness:.1}));sea.rotation.x=-Math.PI/2;sea.position.set(0,1.0,0);sea.userData.noBake=true;add(sea);
  const ell=(a,b,y,c)=>{const m=new THREE.Mesh(new THREE.CircleGeometry(1,64),new THREE.MeshStandardMaterial({color:c,roughness:1}));m.scale.set(a,b,1);m.rotation.x=-Math.PI/2;m.position.set(0,y,0);m.receiveShadow=true;m.userData.noBake=true;return add(m)};
  ell(96,68,1.12,'#bff3ea');ell(88,62,1.25,'#f4d89a');ell(74,48,1.28,'#86dba0');ell(30,20,1.3,'#76cf90');
  /* Funkhütte */
  box(9,5.4,7,-48,0,8,'#e5383b');box(10,.6,8,-48,5.4,8,'#ffffff');box(2.2,3.2,.3,-43.4,0,8,'#7a4a2a');box(3,1.6,.2,-51,2.4,4.4,'#7fd0f0','#7fd0f0',.4,false);
  cylm(.25,10,-52,5.4,12,'#cfcfe0');{const d=new THREE.Mesh(new THREE.SphereGeometry(1,16,10,0,Math.PI*2,0,Math.PI/2),MT('#ffffff'));d.scale.set(2.6,1,2.6);d.position.set(-52,Y+15.6,12);d.rotation.x=-.8;d.castShadow=true;add(d)}
  col(-53,-43,4,12);
  /* Alarmgelände */
  box(14,.3,14,46,0,10,'#cfc4e0');box(.4,2.4,14,39,0,10,'#8a96a4');box(14,2.4,.4,46,0,3,'#8a96a4');box(14,2.4,.4,46,0,17,'#8a96a4');
  box(5,6,2.6,52,0,10,'#7a8794');box(4.2,1.6,.2,52,3.8,8.6,'#ff2a4a','#ff2a4a',.8,false);col(48.8,55.4,7.4,12.6);col(38.6,39.4,3,17);col(39,53,2.8,3.2);col(39,53,16.8,17.2);
  for(let q=0;q<4;q++)sphm(.22,.22,.22,50.6+(q%2)*2.8,1.4+(q>1?2.4:0),8.6,'#cfcfe0');
  /* Kamera-Mast */
  cylm(.5,12,0,0,18,'#8a96a4');box(2.6,1.2,1.6,0,12,18,'#2a3a52');sphm(.6,.6,.6,0,12.6,19.3,'#7ff0ff','#7ff0ff',.9);box(3.2,1.6,.2,0,3.4,16.9,'#ffd23a','#ffd23a',.5,false);col(-1,1,17,19);
  /* Wachhaus (Container) */
  box(10,5,5,-30,0,-16,'#2a3a52');box(4,2,.2,-30,2.2,-13.4,'#0a1a2a','#7be0a0',.9,false);box(1.6,3.2,.3,-26.4,0,-13.4,'#8a5a3a');box(10.4,.5,5.4,-30,5,-16,'#4a5a72');col(-35.2,-24.8,-18.6,-13.4);
  /* Hauptgate */
  box(64,5.4,.8,-40,0,-26,'#8a96a4');box(64,5.4,.8,40,0,-26,'#8a96a4');col(-72,-8,-26.6,-25.4);col(8,72,-26.6,-25.4);
  for(let k=0;k<20;k++){const x=-70+k*3.4;if(Math.abs(x)>8)box(.2,1.4,1,x,5.4,-26,'#ffd23a','#ffd23a',.3,false)}
  [-8.8,8.8].forEach(x=>box(1.6,9,1.6,x,0,-26,'#ff8a2a'));box(19,1.4,1.6,0,9,-26,'#ff8a2a');
  L5.gateDoor=box(16,5.6,.5,0,0,-26,'#5a6a8a','#ff5f5f',.25);L5.gateDoor.userData.noBake=true;L5.gateCol=col(-8,8,-26.5,-25.5);
  [-6,-2,2,6].forEach((x,i)=>{const m=new THREE.Mesh(SP,new THREE.MeshStandardMaterial({color:'#ff5f5f',emissive:'#ff5f5f',emissiveIntensity:1}));m.scale.set(.7,.7,.7);m.position.set(x,Y+8.4,-24.9);m.userData.noBake=true;add(m);L5.lamps.push(m)});
  /* Reaktor hinter dem Tor */
  cylm(10,2,0,0,-44,'#7a8794');cylm(8,10,0,2,-44,'#cfd6dd');sphm(7.6,5.4,7.6,0,12,-44,'#9fffd8','#40ffb0',.5);box(16,4,10,0,0,-34,'#b7c3cf');col(-8.6,8.6,-39,-29);col(-11,11,-55,-33);
  [-20,20].forEach(x=>{cylm(3.2,14,x,0,-40,'#cfd6dd');cylm(3.3,.7,x,12,-40,'#ff5f5f','#ff5f5f',.7)});col(-23.4,-16.6,-43.4,-36.6);col(16.6,23.4,-43.4,-36.6);
  /* Dock und Boot */
  box(30,.5,5,70,-.2,-36,'#a66b28');for(let k=0;k<10;k++)box(.4,1,.4,56+k*3,-.9,-33.6,'#7a4a1f');
  /* Möwen-Imbiss */
  box(8,4.4,5,22,0,40,'#ff8a2a');box(9,.5,6,22,4.4,40,'#ffffff');for(let k=0;k<6;k++)box(1.5,.2,2.4,18.3+k*1.5,3.2,36.8,k%2?'#ffffff':'#e5383b');col(17.5,26.5,37.2,42.8);
  /* Kisten der Kriminellen */
  [[-14,-22],[-10,-22.6],[12,-22.4],[16,-22]].forEach(([x,z],k)=>box(2.6,2.6,2.6,x,0,z,['#a66b28','#8a5a3a'][k%2]));[[-6,-22.6],[6,-22.6]].forEach(([x,z])=>cylm(.9,2,x,0,z,'#e5383b'));
  col(-15.5,-8.5,-24,-21);col(10.5,17.5,-24,-21);
  /* Palmen und Bäume aus Formeln */
  {const oS=FSP,oH=FW.h,oL=FW.lb,oB=FW.sb;FSP=new THREE.SphereGeometry(1,7,5);FCYL=6;FW.h=.40;FW.lb=0;FW.sb=0;
   [[-70,30],[-60,38],[-36,44],[-14,48],[14,50],[38,44],[58,36],[70,24],[74,8],[-74,12],[-72,-6],[-66,-18],[66,-10],[72,-22],[-40,-34],[40,-30],[-60,-30],[60,-32],[-8,30],[10,28],[-24,30]].forEach(([x,z],k)=>{const R3=mulberry(500+k),kind=k%4===3?'balloon':'palm',gp=FLORA[kind](R3,1.05);gp.position.set(x,Y+.02,z);gp.rotation.y=R3()*6.28;gp.traverse(o=>{if(o.isMesh)o.castShadow=true});add(gp)});
   FSP=oS;FCYL=10;FW.h=oH;FW.lb=oL;FW.sb=oB}
  bakeGroup(W5);
  /* dynamische Teile */
  L5.core=sphm(4.2,4.2,4.2,0,12,-44,'#ff4a4a','#ff4a4a',1.1);L5.core.userData.noBake=true;
  L5.alarms=[[-52,2.2,16],[52,6.6,12],[-30,5.8,-13]].map(([x,y,z])=>{const m=sphm(.6,.6,.6,x,y,z,'#ff2a4a','#ff2a4a',1.1);m.userData.noBake=true;return m});
  const boat=new THREE.Group();const hull=new THREE.Mesh(SP,MT('#ffffff'));hull.scale.set(7.5,2.2,3.2);hull.castShadow=true;boat.add(hull);
  const stripe=new THREE.Mesh(SP,MT('#e5383b'));stripe.scale.set(7.6,.5,3.3);stripe.position.y=.8;boat.add(stripe);
  const cab=new THREE.Mesh(BX,MT('#ffd23a'));cab.scale.set(3,2.4,2.4);cab.position.set(-1,2.4,0);cab.castShadow=true;boat.add(cab);
  const flag=new THREE.Mesh(BX,MT('#ff5fa8','#ff5fa8',.6));flag.scale.set(.2,.2,1.4);flag.position.set(-1,4.7,.8);boat.add(flag);const mast=new THREE.Mesh(CY,MT('#cfcfe0'));mast.scale.set(.15,3.2,.15);mast.position.set(-1,4.2,0);boat.add(mast);
  boat.position.set(90,1.2,-36);boat.userData.noBake=true;add(boat);L5.boat=boat;
  /* Kiosk-Schild */
  {const sg=new THREE.Mesh(new THREE.PlaneGeometry(7,1.75),signMat('MÖWEN-IMBISS','#ffe066','#3a1a10'));sg.position.set(22,Y+6.5,37);sg.rotation.y=Math.PI;sg.userData.noBake=true;add(sg);L5.sign=sg}
  {const sg=new THREE.Mesh(new THREE.PlaneGeometry(8,2),signMat('REAKTOR','#ff5f5f','#3a0a10'));sg.position.set(0,Y+5,-28.8);sg.rotation.y=Math.PI;sg.userData.noBake=true;add(sg)}
  islandVisuals()}
