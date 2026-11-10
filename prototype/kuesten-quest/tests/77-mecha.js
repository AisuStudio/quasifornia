// Mecha-Riese "Rocket Fist": vierte Art im Fahrplan, gleiche Gelenke wie die anderen, Höhe etwa 20 m, erhobene Raketenfaust, schlanke Dreieckszahl, stärkeres und weiteres Kamerawackeln als die anderen Riesen.
const {chromium}=require('playwright');const http=require('http'),fs=require('fs'),path=require('path');
const srv=http.createServer((q,s)=>{const u=q.url.split('?')[0];const f=u==='/'?path.join(__dirname,'..','dist/dev.html'):path.join(__dirname,'..',u);fs.readFile(f,(e,d)=>{if(e){s.writeHead(404);s.end();return}s.writeHead(200,{'content-type':f.endsWith('.js')?'text/javascript':f.endsWith('.otf')?'font/otf':'text/html'});s.end(d)})});
srv.listen(8977,async()=>{let b;try{
 b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});const p=await b.newPage({viewport:{width:900,height:560}});p.on('pageerror',e=>console.log('ERR',e.message));
 await p.route(/fonts\.(googleapis|gstatic)\.com/,r=>r.abort());await p.route('**/api/**',r=>r.fulfill({status:404,body:''}));
 await p.goto('http://localhost:8977/?test=1');await p.waitForFunction('window.__ready',null,{timeout:120000});await p.click('#next1').then(()=>p.click('#go')).then(()=>p.click('#start'));
 await p.evaluate(()=>{const q=__qa;q.G.phase='play';q.DLG.open=false;document.getElementById('dlg').hidden=true});
 const T0=Date.UTC(2026,10,3,12,0,0);
 const k=await p.evaluate(()=>{const q=__qa;return {kinds:q.GIANT.kinds,name:q.GIANT.names.mecha,shake:q.GIANT.SHAKE}});
 console.log('Vierte Art im Fahrplan',JSON.stringify(k.kinds),k.name,k.kinds.length===4&&k.kinds[3]==='mecha'&&k.name==='Rocket Fist'&&k.shake.mecha.r>k.shake.pink.r&&k.shake.mecha.s>k.shake.pink.s);
 /* Zeitpunkt suchen, an dem die jeweilige Art voll sichtbar läuft */
 const at=(kind)=>p.evaluate(([T0,kind])=>{const q=__qa;for(let k=0;k<24;k++){const base=Math.floor(T0/q.GIANT.PERIOD)*q.GIANT.PERIOD+k*q.GIANT.PERIOD;for(let s=20;s<120;s+=2){const st=q.giantState(base+s*1000);if(st&&st.kind===kind&&st.fade>=1)return base+s*1000}}return null},[T0,kind]);
 const Tm=await at('mecha'),Tp=await at('pink');
 const info=await p.evaluate(T=>{const q=__qa,M=q.MULTI;M.on=true;M.synced=true;M.off=T-Date.now();q.P.x=0;q.P.z=0;for(let i=0;i<3;i++)q.step(.02);const st=q.GIANT.cur,o=q.GIANT.pool[st.kind],g=o.g;
   let tris=0,top=-1e9,meshes=0;g.updateMatrixWorld(true);g.traverse(m=>{if(m.isMesh){meshes++;const gg=m.geometry;tris+=(gg.index?gg.index.count:gg.attributes.position.count)/3;gg.computeBoundingBox();const bb=gg.boundingBox,e=m.matrixWorld.elements;for(const y of [bb.min.y,bb.max.y])for(const x of [bb.min.x,bb.max.x])for(const z of [bb.min.z,bb.max.z])top=Math.max(top,e[1]*x+e[5]*y+e[9]*z+e[13])}});
   return {kind:st.kind,sichtbar:g.visible,legs:o.legs.length,arms:o.arms.length,hasHead:!!o.head,hasBody:!!o.body,hasTail:!!o.tail,pose:typeof o.pose,hoehe:+(top-1.3).toFixed(1),tris:Math.round(tris),meshes,faust:+o.arms[1].rotation.x.toFixed(2),arm0:+o.arms[0].rotation.x.toFixed(2)}},Tm);
 console.log('Mecha läuft',JSON.stringify(info),info.kind==='mecha'&&info.sichtbar&&info.legs===2&&info.arms===2&&info.hasHead&&info.hasBody&&info.hasTail&&info.pose==='function');
 console.log('Höhe etwa 20 m, wenige Dreiecke',info.hoehe,info.tris,info.hoehe>=18&&info.hoehe<=21&&info.tris<30000);
 console.log('Raketenfaust erhoben, anderer Arm schwingt',info.faust,info.arm0,info.faust<-2.2&&Math.abs(info.arm0)<.5);
 /* Schritte: Beine schwingen */
 const sw=await p.evaluate(()=>{const q=__qa,o=q.GIANT.pool.mecha,M=q.MULTI;let mn=9,mx=-9;for(let i=0;i<120;i++){M.off+=100;q.step(.02);mn=Math.min(mn,o.legs[0].rotation.x);mx=Math.max(mx,o.legs[0].rotation.x)}return {mn:+mn.toFixed(2),mx:+mx.toFixed(2)}});
 console.log('Beine schwingen',JSON.stringify(sw),sw.mx-sw.mn>.6);
 /* Kamerawackeln: gleicher Abstand zu Mecha und Pink-Blob; Mecha wackelt stärker, und noch in 70 Einheiten, wo der Pink-Blob nichts spürt */
 const shake=(T,dist)=>p.evaluate(([T,dist])=>{const q=__qa,M=q.MULTI;M.on=true;M.synced=true;M.off=T-Date.now();q.G.shake=0;q.step(.02);const st=q.GIANT.cur;q.P.x=st.x+dist;q.P.z=st.z;let mx=0;for(let i=0;i<260;i++){M.off+=40;q.G.shake=Math.max(0,q.G.shake);q.step(.016);mx=Math.max(mx,q.G.shake);q.P.x=q.GIANT.cur.x+dist;q.P.z=q.GIANT.cur.z}return +mx.toFixed(3)},[T,dist]);
 const sm30=await shake(Tm,30),sp30=await shake(Tp,30),sm70=await shake(Tm,70),sp70=await shake(Tp,70),sm120=await shake(Tm,120);
 console.log('Wackeln bei 30 und 70 Einheiten (Mecha, Pink-Blob)',JSON.stringify({sm30,sp30,sm70,sp70,sm120}),sm30>sp30*1.5&&sm70>.1&&sp70<.01&&sm120<.01);
 }catch(e){console.log('ERR',e.message)}finally{if(b)await b.close();srv.close()}});
