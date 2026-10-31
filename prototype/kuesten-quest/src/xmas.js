/* ================= Lebkuchenhaus (Weihnachtsspiel kommt später) ================= */
function pickGingerBlock(maze,lab){const R=mulberry(2112),c=[];
  for(let j=0;j<5;j++)for(let i=1;i<5;i++){if(lab&&i===lab.i&&j===lab.j)continue;const a=maze.id(i,j),b=maze.id(i+1,j);
    if(maze.open.has(maze.key(a,b))&&maze.dist[a]>=2&&maze.dist[a]<=5&&a!==maze.coast&&b!==maze.coast)c.push([i,j])}
  if(!c.length){for(let j=0;j<5;j++)for(let i=1;i<5;i++)if(!(lab&&i===lab.i&&j===lab.j))c.push([i,j])}
  const [i,j]=c[Math.floor(R()*c.length)];return {i,j,cx:(i-2)*50,cz:(j-2)*50}}
function adventSignMat(){const c=document.createElement('canvas');c.width=512;c.height=256;const g=c.getContext('2d');
  g.fillStyle='#7a4a2a';g.fillRect(0,0,512,256);g.fillStyle='#8a5a34';for(let i=0;i<8;i++)g.fillRect(0,i*32+4,512,3);
  g.strokeStyle='#fff6ea';g.lineWidth=10;g.lineJoin='round';g.strokeRect(14,14,484,228);
  g.fillStyle='#fff6ea';g.textAlign='center';g.textBaseline='middle';g.font='800 56px "Baloo 2","Trebuchet MS",sans-serif';g.fillText('ÖFFNET AM',256,96);g.font='800 50px "Baloo 2","Trebuchet MS",sans-serif';g.fillText('ERSTEN ADVENT',256,172);
  [[40,40],[472,40],[40,216],[472,216]].forEach(([x,y],k)=>{g.fillStyle=['#e5383b','#2fd66b','#ffd23a','#4cc3ff'][k];g.beginPath();g.arc(x,y,12,0,7);g.fill()});
  const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return new THREE.MeshBasicMaterial({map:t,side:THREE.DoubleSide})}
function buildGingerBlock(){const H=HUB.h,bx=H.bx,cyl=H.cyl,sph=H.sph,MT=H.MT,cur=H.cur(),W=24,D=20,Hh=8;
  const ginger=MT('#9a5a2a'),ginger2=MT('#b0703a'),icing=MT('#fff6ea'),snow=MT('#f4f8ff');
  /* Schneedecke auf dem Block */
  bx(snow,35,.12,35,0,-.28,0,false);
  /* Hauswand mit Zuckerguss */
  bx(ginger,W,Hh,D,0,0,0);bx(icing,W+.6,.7,D+.6,0,0,0);bx(icing,W+.6,.7,D+.6,0,Hh-.7,0);
  [-W/2,W/2].forEach(x=>bx(icing,.7,Hh,.7,x,0,-D/2));[-W/2,W/2].forEach(x=>bx(icing,.7,Hh,.7,x,0,D/2));
  for(let k=0;k<7;k++)bx(ginger2,3,2.2,.2,-10.2+k*3.4,2.6,-D/2-.12,false);
  /* Tür mit Zuckerguss und Kranz */
  bx(MT('#5a3418'),4.6,6,.5,0,0,-D/2-.3);bx(icing,5.6,.7,.6,0,6,-D/2-.3);[-2.6,2.6].forEach(x=>bx(icing,.6,6,.6,x,0,-D/2-.3));
  sph(MT('#2fa84a'),1.5,1.5,.4,0,3.6,-D/2-.7);[-1,1].forEach(s=>sph(MT('#e5383b'),.45,.45,.4,s*.9,2.5,-D/2-.9));
  /* Fenster mit warmem Licht */
  [-7.5,7.5].forEach(x=>{bx(icing,4.4,3.8,.4,x,2.6,-D/2-.2);bx(MT('#ffe9a0','#ffcf70',1),3.6,3,.2,x,3,-D/2-.4,false);bx(icing,.3,3,.25,x,3,-D/2-.5,false);bx(icing,3.6,.3,.25,x,4.5,-D/2-.5,false)});
  /* Zuckerstangen am Eingang */
  [-3.6,3.6].forEach((x,k)=>{for(let q=0;q<8;q++)cyl(MT(q%2?'#ffffff':'#e5383b'),.42,.9,x,q*.9,-D/2-1.2);sph(MT('#e5383b'),.55,.55,.55,x+(k?-.5:.5),7.4,-D/2-1.2);cyl(MT(k?'#ffffff':'#e5383b'),.36,.9,x+(k?-.3:.3),7.4,-D/2-1.2)});
  /* Dach: Lebkuchenplatten, Schnee, Zuckerguss */
  const L=15.7,th=.8,ang=40*Math.PI/180;
  [-1,1].forEach(s=>{const m=new THREE.Mesh(BX,ginger2);m.scale.set(L,th,D+2.4);m.position.set(cur.x+s*6.2,H.Y0+Hh+5.1,cur.z);m.rotation.z=-s*ang;m.castShadow=true;m.receiveShadow=true;H.add(m);
    const sn=new THREE.Mesh(BX,snow);sn.scale.set(L*.82,.55,D+2.6);sn.position.set(cur.x+s*5.2+s*.45,H.Y0+Hh+5.9,cur.z);sn.rotation.z=-s*ang;sn.castShadow=true;H.add(sn);
    const ic=new THREE.Mesh(BX,icing);ic.scale.set(.5,.5,D+2.6);ic.position.set(cur.x+s*(W/2+.1),H.Y0+Hh-.1,cur.z);ic.castShadow=true;H.add(ic)});
  bx(icing,1.2,.6,D+2.8,0,Hh+10.1,0);
  /* Giebeldreieck vorn und hinten */
  const shp=new THREE.Shape();shp.moveTo(-12,0);shp.lineTo(12,0);shp.lineTo(0,10);shp.closePath();
  [-1,1].forEach(s=>{const g=new THREE.ExtrudeGeometry(shp,{depth:.6,bevelEnabled:false});const m=new THREE.Mesh(g,ginger);m.position.set(cur.x,H.Y0+Hh,cur.z+s*(D/2+.05)-(s>0?0:.6));m.castShadow=true;H.add(m)});
  /* Gumdrops auf dem Dach */
  [[-9,.5],[-7,2.4],[-5,4.1],[-3,5.8],[-1.2,7.2],[9,.5],[7,2.4],[5,4.1],[3,5.8],[1.2,7.2]].forEach(([x,y],k)=>{const s=Math.sign(x)||1;[-8,-2,5,9].forEach((z,q)=>{if((k+q)%2===0)sph(MT(['#e5383b','#2fd66b','#ffd23a','#4cc3ff','#ff5fa8'][(k+q)%5]),.55,.45,.55,x+s*.1,Hh+y*.95+.7,z)})});
  /* Schornstein mit Schnee */
  bx(ginger,2.4,4.4,2.4,-5,Hh+4.2,4);bx(snow,2.8,.7,2.8,-5,Hh+8.5,4);bx(icing,2.8,.5,2.8,-5,Hh+7.7,4);
  /* Goldener Stern auf dem Giebel */
  sph(MT('#ffd23a','#ffd23a',1),.9,.9,.9,0,Hh+11.6,0);
  /* Lebkuchen-Zaun, Lollipops, Schneemänner */
  for(let k=0;k<12;k++){const x=-16.5+k*3;if(Math.abs(x)>4)bx(ginger2,1.6,2,.4,x,0,-D/2-6.6);bx(icing,1.6,.35,.5,x,2.1,-D/2-6.6,false)}
  [[-15,-14],[15,-14],[-15,13],[15,13]].forEach(([x,z],k)=>{cyl(MT('#fff6ea'),.3,4.6,x,0,z);sph(MT(['#e5383b','#2fd66b','#ffd23a','#ff5fa8'][k]),1.9,1.9,.5,x,5.6,z);sph(MT('#ffffff'),1,1,.55,x,5.6,z-.15)});
  [[-12,-14],[12,-14]].forEach(([x,z])=>{sph(MT('#ffffff'),1.7,1.5,1.7,x,1.4,z);sph(MT('#ffffff'),1.3,1.2,1.3,x,3.6,z);sph(MT('#ffffff'),.95,.9,.95,x,5.2,z);cyl(MT('#2a2a33'),.9,.9,x,6.0,z);cyl(MT('#2a2a33'),.5,.6,x,6.8,z);sph(MT('#ff8a2a'),.18,.18,.6,x,5.2,z-.9)});
  /* Schild vor dem Haus */
  [-3.2,3.2].forEach(x=>cyl(MT('#5a3418'),.28,3.4,x,0,-D/2-9.5));
  const sg=new THREE.Mesh(new THREE.PlaneGeometry(8.4,4.2),adventSignMat());sg.position.set(cur.x,H.Y0+4.6,cur.z-D/2-9.8);sg.rotation.y=Math.PI;sg.userData.noBake=true;H.add(sg);HUB.advSign=sg;
  HUB.gbBuilt=true}
/* Blinkende Lichterketten (nach bakeGroup anlegen, damit sie dynamisch bleiben) */
function buildGingerLights(){const g=HUB.gb;if(!g)return;const Hh=8,D=20,W=24,y0=HUB.h.Y0;const P=[];
  const add=(x,y,z)=>P.push([g.cx+x,y0+y,g.cz+z]);
  for(let x=-12;x<=12.01;x+=1.5)add(x,Hh+.1,-D/2-.5);
  for(let z=-10;z<=10.01;z+=1.5){add(-W/2-.5,Hh+.1,z);add(W/2+.5,Hh+.1,z)}
  for(let k=0;k<=10;k++){const t=k/10;add(-12+12*t,Hh+10*t+.1,-D/2-1);add(12-12*t,Hh+10*t+.1,-D/2-1)}
  for(let k=0;k<=10;k++){const a=Math.PI*k/10;add(Math.cos(a)*3.1,6.2+Math.sin(a)*1.4,-D/2-.9)}
  [-7.5,7.5].forEach(x=>{for(let k=-2;k<=2;k++){add(x+k*.9,4.8,-D/2-.7);if(Math.abs(k)===2)add(x+k*.9,2,-D/2-.7)}});
  for(let q=0;q<10;q++)add(-14.5+q*3.2,.9,-D/2-6.7);
  const cols=['#ff3b3b','#2fd66b','#ffd23a','#4cc3ff','#ff5fa8'],geo=new THREE.SphereGeometry(.34,7,5),m4=new THREE.Matrix4();
  const mk=()=>{const mat=new THREE.MeshBasicMaterial({color:'#ffffff',fog:false}),n=Math.ceil(P.length/2),im=new THREE.InstancedMesh(geo,mat,n);im.userData.noBake=true;im.userData.noOutline=true;im.frustumCulled=false;return im};
  const A=mk(),B=mk();let ia=0,ib=0;
  P.forEach((p,k)=>{const im=k%2?B:A,i=k%2?ib++:ia++;m4.makeTranslation(p[0],p[1],p[2]);im.setMatrixAt(i,m4);im.setColorAt(i,new THREE.Color(cols[(k*2+Math.floor(k/9))%5]))});
  A.count=ia;B.count=ib;[A,B].forEach(im=>{im.instanceMatrix.needsUpdate=true;if(im.instanceColor)im.instanceColor.needsUpdate=true;HUB.h.add(im)});
  /* weicher Schein hinter dem Haus */
  const gl=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex('255,190,110'),transparent:true,opacity:.5,depthWrite:false,blending:THREE.AdditiveBlending,fog:false}));gl.scale.set(46,30,1);gl.position.set(g.cx,y0+8,g.cz-12);gl.userData.noBake=true;HUB.h.add(gl);
  const st=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex('255,230,120'),transparent:true,opacity:.9,depthWrite:false,blending:THREE.AdditiveBlending,fog:false}));st.scale.set(7,7,1);st.position.set(g.cx,y0+Hh+11.6,g.cz);st.userData.noBake=true;HUB.h.add(st);
  HUB.gl={A,B,gl,st,t:0}}
function stepXmas(dt){const l=HUB.gl;if(!l||!W0||!W0.visible)return;l.t+=dt;const ph=Math.floor(l.t/.6)%2;l.A.visible=ph===0;l.B.visible=ph===1;l.st.material.opacity=.7+.25*Math.sin(l.t*3);l.gl.material.opacity=.42+.1*Math.sin(l.t*1.7)}
