// Riesen auf der Minikarte und Scoops fürs Fotografieren: Marker in Artfarbe, Foto mit Riese im Bild gibt Scoops (einmal pro Auftritt), auch mit Fisheye; zu weit, abgewandt, zu klein und verdeckt gibt nichts.
const {chromium}=require('playwright');const http=require('http'),fs=require('fs'),path=require('path');
const srv=http.createServer((q,s)=>{const u=q.url.split('?')[0];const f=u==='/'?path.join(__dirname,'..','dist/dev.html'):path.join(__dirname,'..',u);fs.readFile(f,(e,d)=>{if(e){s.writeHead(404);s.end();return}s.writeHead(200,{'content-type':f.endsWith('.js')?'text/javascript':f.endsWith('.otf')?'font/otf':'text/html'});s.end(d)})});
srv.listen(8979,async()=>{let b;try{
 b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});const p=await b.newPage({viewport:{width:1000,height:640}});p.on('pageerror',e=>console.log('ERR',e.message));
 await p.route(/fonts\.(googleapis|gstatic)\.com/,r=>r.abort());await p.route('**/api/**',r=>r.fulfill({status:404,body:''}));
 await p.goto('http://localhost:8979/?test=1');await p.waitForFunction('window.__ready',null,{timeout:120000});await p.click('#next1').then(()=>p.click('#go')).then(()=>p.click('#start'));
 await p.evaluate(()=>{const q=__qa;q.G.phase='play';q.DLG.open=false;document.getElementById('dlg').hidden=true;try{localStorage.removeItem('kq-giantshots');localStorage.removeItem('kq-fish')}catch(e){}q.GFOTO.done=[]});
 const T0=Date.UTC(2026,10,3,12,0,0);
 /* Riese starten (Rocket Fist) und davor stellen: erste Ringposition mit freier Sicht */
 const setup=await p.evaluate(T0=>{const q=__qa,M=q.MULTI;let T=null;for(let k=0;k<24&&!T;k++){const base=Math.floor(T0/q.GIANT.PERIOD)*q.GIANT.PERIOD+k*q.GIANT.PERIOD;for(let s=20;s<120&&!T;s+=2){const st=q.giantState(base+s*1000);if(st&&st.kind==='mecha'&&st.fade>=1)T=base+s*1000}}
   M.on=true;M.synced=true;M.off=T-Date.now();q.P.x=0;q.P.z=0;q.step(.02);window.__place=(ang,dist,look)=>{const st=q.GIANT.cur;q.P.x=st.x+Math.cos(ang)*dist;q.P.z=st.z+Math.sin(ang)*dist;q.P.h=Math.atan2(st.z-q.P.z,st.x-q.P.x)+(look||0);q.P.speed=0;for(let i=0;i<50;i++)q.step(.02);q.render();return q.fotGiant()};
   let found=null;for(let a=0;a<8&&!found;a++){const g=window.__place(a*Math.PI/4,45,0);if(g&&g.free&&g.h>.2)found={a,h:+g.h.toFixed(2),d:Math.round(g.d)}}return {T,found}},T0);
 console.log('Stelle mit freier Sicht gefunden',JSON.stringify(setup.found),!!setup.found);
 /* Minikarte: Marker in der Farbe der Art */
 const mm=await p.evaluate(()=>{const q=__qa,st=q.GIANT.cur;q.HUB.mmT=1;q.step(.02);q.HUB.mmT=1;q.step(.02);const x=75+(st.x-q.P.x)*.5,y=75+(st.z-q.P.z)*.5,g=document.getElementById('mini').getContext('2d'),d=g.getImageData(Math.round(x)-5,Math.round(y)-1,1,1).data;return {pos:[Math.round(x),Math.round(y)],rgb:[d[0],d[1],d[2]]}});
 console.log('Minikarte: Marker orange (Rocket Fist)',JSON.stringify(mm),Math.abs(mm.rgb[0]-255)<12&&Math.abs(mm.rgb[1]-122)<14&&Math.abs(mm.rgb[2]-26)<20);
 /* Foto mit Riese im Bild: Scoops und Bildunterschrift */
 const sc0=await p.evaluate(()=>__qa.SC.n);
 /* Außerhalb des Kartenausschnitts: Marker am Rand */
 const edge=await p.evaluate(()=>{const q=__qa,st=q.GIANT.cur,sx=q.P.x,sz=q.P.z;q.P.x=st.x+400;q.P.z=st.z;q.HUB.mmT=1;q.step(.02);q.HUB.mmT=1;q.step(.02);const g=document.getElementById('mini').getContext('2d');let best=0;const im=g.getImageData(0,0,150,150).data;let n=0;for(let y=0;y<150;y++)for(let x=0;x<150;x++){const i=(y*150+x)*4;if(Math.abs(im[i]-255)<10&&Math.abs(im[i+1]-122)<12&&Math.abs(im[i+2]-26)<18&&(x<12||x>137||y<12||y>137))n++}q.P.x=sx;q.P.z=sz;return n});
 console.log('Minikarte: Marker am Rand, wenn der Riese weit weg ist',edge,edge>20);
 const f1=await p.evaluate(a=>{const q=__qa;window.__place(a*Math.PI/4,45,0);const f=q.fotSnap();return {n:q.SC.n,txt:f.txt,toast:document.getElementById('toast').getAttribute('data-t')}},setup.found.a);
 console.log('Foto: +12 Scoops, Name in der Unterschrift',sc0,JSON.stringify(f1),f1.n-sc0===12&&/Rocket Fist/.test(f1.txt)&&/\+12 Scoops/.test(f1.toast));
 const f2=await p.evaluate(a=>{const q=__qa;window.__place(a*Math.PI/4,45,0);const before=q.SC.n;q.fotSnap();return {diff:q.SC.n-before,toast:document.getElementById('toast').getAttribute('data-t')}},setup.found.a);
 console.log('Zweites Foto desselben Auftritts: nichts mehr',JSON.stringify(f2),f2.diff===0&&/schon fotografiert/.test(f2.toast));
 /* Mit Fisheye zählt es auch (neuer Auftritt simuliert) */
 const f3=await p.evaluate(a=>{const q=__qa;q.GFOTO.done=[];q.fishSet(true);const g0=window.__place(a*Math.PI/4,45,0);const before=q.SC.n;q.fotSnap();const r={diff:q.SC.n-before,sichtbar:!!g0&&g0.free,h:g0?+g0.h.toFixed(2):0};q.fishSet(false);return r},setup.found.a);
 console.log('Mit Fisheye zählt es',JSON.stringify(f3),f3.sichtbar&&f3.diff===12);
 /* Zu weit, abgewandt, zu klein, verdeckt */
 const neg=await p.evaluate(a=>{const q=__qa,out={};q.GFOTO.done=[];const ang=a*Math.PI/4;
   const gW=window.__place(ang,200,0);out.weit=gW===null;
   const gA=window.__place(ang,45,Math.PI);out.abgewandt=gA===null;
   window.__place(ang,110,0);let b0=q.SC.n;q.fotSnap();out.kleinDiff=q.SC.n-b0;out.kleinToast=document.getElementById('toast').getAttribute('data-t')||'';
   window.__place(ang,45,0);const st=q.GIANT.cur,cp=q.cam.position.clone(),T=q.THREE,wall=new T.Mesh(new T.BoxGeometry(120,120,2),new T.MeshStandardMaterial({color:'#888'}));wall.position.set((cp.x+st.x)/2,40,(cp.z+st.z)/2);wall.lookAt(cp.x,40,cp.z);q.W0.add(wall);wall.updateMatrixWorld(true);
   const gV=q.fotGiant();out.verdeckt=!!gV&&gV.free===false;b0=q.SC.n;q.fotSnap();out.verdecktDiff=q.SC.n-b0;q.W0.remove(wall);return out},setup.found.a);
 console.log('Nichts bei weit, abgewandt, zu klein, verdeckt',JSON.stringify(neg),neg.weit&&neg.abgewandt&&neg.kleinDiff===0&&/Näher ran/.test(neg.kleinToast)&&neg.verdeckt&&neg.verdecktDiff===0);
 const ls=await p.evaluate(()=>JSON.parse(localStorage.getItem('kq-giantshots')||'[]').length);console.log('Auftritt gemerkt (gegen Neuladen-Farmen)',ls,ls>=1);
 }catch(e){console.log('ERR',e.message)}finally{if(b)await b.close();srv.close()}});
