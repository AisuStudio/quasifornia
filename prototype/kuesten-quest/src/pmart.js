/* ================= P-Mart-Innenraum (Level 7): erster betretbarer Laden =================
   Wie das Labor (Level 4) ein eigener Raum mit Wänden und Kollisionen. Man kommt durch die Ladentür in der Stadt hinein und geht durch die Tür unten wieder hinaus.
   Regale: Sprühdosen, Skins (Farben) und ein leeres Regal für später. Beim Regal oder an der Kasse öffnet sich der Laden im Rarepod (Kaufen mit Scoops).
   Der Raum ist von vorne offen niedrig gebaut, damit die Kamera darüber schauen kann. */
LEVELS[7]={id:7,mode:'city',pips:1,boss:'',bossColor:'#f0cf36',bossSpeed:0,grav:20,goal:'Einkaufen',
  quest:'Stöbere im P-Mart',goalQuest:'',
  intro:'Im P-Mart riecht es nach Sprühfarbe und Mochi. Such dir etwas am Regal aus, bezahlt wird an der Kasse.',
  vendor:'Willkommen im P-Mart!',lines:[],chase:'',eat:'',win:'',winSub:'',badge:''};
let W7=null;const L7={colliders:[],start:{x:0,z:13,h:-Math.PI/2},acts:[],items:{cans:0,skins:0}};
const PM_CAN_COLS=['#ff5fa8','#4cc3ff','#ffe066','#47c2a5','#8e5bd6','#ff8a2a','#e5383b','#eae8e8'];
function buildLevel7(){
  if(W7)return;W7=new THREE.Group();W7.userData.noBake=true;W7.visible=false;sc.add(W7);
  const Y=1.3,add=o=>{W7.add(o);return o};
  const box=(w,h,d,x,y,z,col,em,ei,cast=true)=>{const m=new THREE.Mesh(BX,MT(col,em,ei));m.scale.set(w,h,d);m.position.set(x,Y+y+h/2,z);m.castShadow=cast;m.receiveShadow=true;return add(m)};
  const cylm=(r,h,x,y,z,col,em,ei)=>{const m=new THREE.Mesh(CY,MT(col,em,ei));m.scale.set(r,h,r);m.position.set(x,Y+y+h/2,z);m.castShadow=true;return add(m)};
  const col=(x0,x1,z0,z1)=>L7.colliders.push({x0,x1,z0,z1,top:999});
  const sign=(text,w,h,x,y,z,ry,bg,fg,font)=>{const cv=document.createElement('canvas');cv.width=512;cv.height=Math.round(512*h/w);const g=cv.getContext('2d');g.fillStyle=bg;g.fillRect(0,0,cv.width,cv.height);g.strokeStyle=fg;g.lineWidth=8;g.strokeRect(8,8,cv.width-16,cv.height-16);
    g.fillStyle=fg;g.font=(font||'800 ')+Math.round(cv.height*.46)+'px "Smarta Nova","Trebuchet MS",sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText(text,cv.width/2,cv.height/2+4);
    const tx=new THREE.CanvasTexture(cv);tx.colorSpace=THREE.SRGBColorSpace;const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:tx}));m.position.set(x,Y+y,z);m.rotation.y=ry;m.userData.noBake=true;return add(m)};
  /* Boden: Fliesen in Mint und Weiß */
  const ft=document.createElement('canvas');ft.width=ft.height=128;{const g=ft.getContext('2d');g.fillStyle='#f6efe6';g.fillRect(0,0,128,128);g.fillStyle='#bfeadb';g.fillRect(0,0,64,64);g.fillRect(64,64,64,64)}
  const ftx=new THREE.CanvasTexture(ft);ftx.colorSpace=THREE.SRGBColorSpace;ftx.wrapS=ftx.wrapT=THREE.RepeatWrapping;ftx.repeat.set(11,8.5);
  const fl=new THREE.Mesh(new THREE.PlaneGeometry(44,34),new THREE.MeshStandardMaterial({map:ftx,roughness:.55}));fl.rotation.x=-Math.PI/2;fl.position.set(0,Y+.02,0);fl.receiveShadow=true;fl.userData.noBake=true;add(fl);
  /* Wände: hinten und seitlich hoch, vorne niedrig (Kamera schaut darüber). Blaues Band wie draußen. */
  const wallC='#f6efe6',blue='#2f7fe0';
  box(48,10,2,0,0,-18,wallC);box(2,10,34,-23,0,0,wallC);box(2,10,34,23,0,0,wallC);box(48,3.2,2,0,0,18,wallC);
  box(48,1.2,.3,0,3.4,-16.9,blue,blue,.25,false);box(.3,1.2,34,-21.9,3.4,0,blue,blue,.25,false);box(.3,1.2,34,21.9,3.4,0,blue,blue,.25,false);box(44,.7,.3,0,1.9,17.0,blue,blue,.25,false);
  col(-25,25,-20,-17);col(-25,-22,-20,20);col(22,25,-20,20);col(-25,25,17,20);
  /* Tür (Ausgang) vorne in der Mitte */
  box(.5,3,.5,-3.4,0,16.9,'#2f7fe0');box(.5,3,.5,3.4,0,16.9,'#2f7fe0');box(7.3,.5,.5,0,3,16.9,'#2f7fe0');box(6.2,2.9,.12,0,0,17.15,'#9fe8ff','#9fe8ff',.35,false);
  sign('P-MART',14,3.6,0,6.6,-16.85,0,'#2f7fe0','#ffffff');sign('AUSGANG',5,1.2,0,3.9,16.8,Math.PI,'#e5383b','#ffffff');
  /* Kühlregale an der Rückwand mit bunten Getränken */
  for(let u=0;u<5;u++){const x=-17+u*8.5;box(7.6,4.6,1.8,x,0,-15.4,'#dfe7ee');box(7,3.8,.1,x,.5,-14.5,'#9fe8ff','#9fe8ff',.25,false);
    for(let r=0;r<3;r++)for(let k=0;k<7;k++)cylm(.28,.7,x-3+k*1,.7+r*1.05,-15.0,PM_CAN_COLS[(u*3+r*5+k)%PM_CAN_COLS.length],null,0)}
  col(-21,21,-17,-14.4);
  /* Gondelregale: Sprühdosen, Skins, Boards (leer, bald) */
  const SX=[-14,-2,10],SZ0=-10,SL=12,SW=2.6;
  SX.forEach((x,si)=>{box(SW,.4,SL,x,0,SZ0+SL/2,'#c9d4de');box(SW,3.6,.3,x,.4,SZ0+SL/2,'#dfe7ee',null,0,false);[.4,1.4,2.4].forEach(y=>box(SW,.15,SL,x,y,SZ0+SL/2,'#eae8e8',null,0,false));
    box(SW+.2,.5,SL+.2,x,3.7,SZ0+SL/2,blue,blue,.3,false);col(x-SW/2-.2,x+SW/2+.2,SZ0-.2,SZ0+SL+.2);
    const lab=['SPRÜHDOSEN','SKINS','BOARDS · BALD'][si];[1,-1].forEach(sd=>sign(lab,SW*1.9,1,x+sd*(SW/2+.15),4.9,SZ0+SL/2,sd*Math.PI/2,si===2?'#8a8a95':'#ffffff',si===2?'#ffffff':blue));
    [-1,1].forEach(side=>{[0,1,2].forEach(lv=>{for(let k=0;k<8;k++){const z=SZ0+.9+k*1.45,y=.55+lv*1+.2,px=x+side*(SW/2-.55);
      if(si===0){cylm(.3,.85,px,y-.2,z,PM_CAN_COLS[(k+lv*3+(side>0?2:0))%PM_CAN_COLS.length],null,0);L7.items.cans++}
      else if(si===1){const sk=SKIN_LIST[(k+lv*2+(side>0?3:0))%SKIN_LIST.length];box(.95,.3,1.1,px,y-.15+(k%2)*.3,z,sk[2]);L7.items.skins++}}})})});
  /* Kasse rechts: Tresen, Kassensystem, Süßigkeiten-Ständer */
  box(3,1.6,11,18,0,6,'#2f7fe0');box(3.4,.25,11.4,18,1.6,6,'#ffffff');box(.9,.7,.9,18,1.85,3.5,'#2a3a52');box(.9,.5,.08,17.65,2.3,3.5,'#0a1a2a','#7ff0ff',.9,false);
  for(let k=0;k<5;k++)box(.7,.5,.5,17.4,1.85,8+k*.8,PM_CAN_COLS[k%PM_CAN_COLS.length]);
  col(16,19.8,.2,11.8);
  /* Kassierer hinter dem Tresen */
  const cs=skater(20.6,Y,6,-Math.PI/2,'#47c2a5',1.35);W7.add(cs);cs.userData.noBake=true;if(cs.userData.board)cs.userData.board.visible=false;if(cs.userData.tz)cs.userData.tz.rotation.x=.1;
  if(cs.userData.arms)cs.userData.arms.forEach(({sg,s})=>{sg.rotation.z=s*.35});L7.cashier=cs;
  /* Deko: Pflanzen, Fußmatte, Körbe */
  [[-19.5,14.5],[19.5,14.5]].forEach(([x,z])=>{cylm(1.1,1.2,x,0,z,'#d54291');cylm(.25,2.2,x,1.2,z,'#47c2a5');[0,1,2].forEach(i=>{const s=new THREE.Mesh(SP,MT('#47c2a5'));s.scale.set(1.3,.9,1.3);s.position.set(x+Math.cos(i*2.1)*.6,Y+3.4+i*.2,z+Math.sin(i*2.1)*.6);add(s)});col(x-1.2,x+1.2,z-1.2,z+1.2)});
  box(6,.08,3,0,0,14.6,'#2f7fe0',null,0,false);
  /* Aktionen */
  L7.acts=[
    {x:0,z:14.8,r:4.5,label:'P-Mart verlassen',fn:()=>pmartLeave()},
    {x:-10.6,z:-5,r:3.3,label:'Regal ansehen: Sprühdosen',fn:()=>shopEnter('cans')},
    {x:-5.4,z:-5,r:3.3,label:'Regal ansehen: Skins',fn:()=>shopEnter('skins')},
    {x:7.2,z:-5,r:3.6,label:'Regal ansehen: Boards',fn:()=>say('e','Das Regal ist noch leer. Hier kommen bald Boards in allen Formen und Farben hin.',3)},
    {x:15.2,z:6,r:4.6,label:'Mit der Kassiererin sprechen',fn:()=>shopEnter()}];}
function pmartActs(a){L7.acts.forEach(o=>a.push(o))}
function pmartEnter(shop){if(typeof POL!=='undefined'&&POL.state&&POL.state!=='idle'){toast('Nicht jetzt: Die Polizei ist hinter dir!',1800);return}
  HUB.pmShop=shop||(HUB.shops&&HUB.shops[0])||null;HUB.spawnAt=null;applyLevel(7);beginPlay()}
function pmartLeave(){const s=HUB.pmShop,H=HUB;let sp=null;
  if(s&&s.cx!==undefined){const dx=s.x-s.cx,dz=s.z-s.cz,l=Math.hypot(dx,dz)||1;sp={x:s.x+dx/l*4,z:s.z+dz/l*4,h:Math.atan2(dz,dx)}}else if(s)sp={x:s.x,z:s.z+4,h:Math.PI/2};
  H.spawnAt=sp;applyLevel(0);beginPlay()}
