// Fisheye (Taste 0): Umschalten mit Einblendung, weiter Bildwinkel, Bild verändert sich, Rarepod-Foto enthält die Verzerrung, im Builder aus, nicht beim Tippen in Feldern, bleibt gespeichert, zusammen mit Pixel-Modus.
const {chromium}=require('playwright');const http=require('http'),fs=require('fs'),path=require('path');
const srv=http.createServer((q,s)=>{const u=q.url.split('?')[0];const f=u==='/'?path.join(__dirname,'..','dist/dev.html'):path.join(__dirname,'..',u);fs.readFile(f,(e,d)=>{if(e){s.writeHead(404);s.end();return}s.writeHead(200,{'content-type':f.endsWith('.js')?'text/javascript':f.endsWith('.otf')?'font/otf':'text/html'});s.end(d)})});
srv.listen(8976,async()=>{let b;try{
 b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});const p=await b.newPage({viewport:{width:1000,height:640}});p.on('pageerror',e=>console.log('ERR',e.message));
 await p.route(/fonts\.(googleapis|gstatic)\.com/,r=>r.abort());await p.route('**/api/**',r=>r.fulfill({status:404,body:''}));
 await p.goto('http://localhost:8976/?test=1');await p.waitForFunction('window.__ready',null,{timeout:120000});await p.click('#next1').then(()=>p.click('#go')).then(()=>p.click('#start'));
 await p.evaluate(()=>{const q=__qa;q.G.phase='play';q.DLG.open=false;document.getElementById('dlg').hidden=true;try{localStorage.removeItem('kq-fish')}catch(e){}for(let i=0;i<5;i++)q.step(.03);q.render()});
 const a0=await p.evaluate(()=>({on:__qa.FISH.on,act:__qa.fishActive()}));
 console.log('Standard aus',JSON.stringify(a0),!a0.on&&!a0.act);
 /* Bild ohne Fisheye merken */
 const grab=()=>p.evaluate(()=>{const q=__qa,c=document.createElement('canvas');c.width=64;c.height=48;const x=c.getContext('2d');x.drawImage(q.R.domElement,0,0,q.R.domElement.width,q.R.domElement.height,0,0,64,48);return Array.from(x.getImageData(0,0,64,48).data)});
 const A=await grab();
 await p.keyboard.press('Digit0');await p.waitForTimeout(100);
 const t1=await p.evaluate(()=>{const q=__qa;for(let i=0;i<3;i++)q.step(.03);q.render();return {on:q.FISH.on,act:q.fishActive(),toast:document.getElementById('toast').getAttribute('data-t')||'',fov:Math.round(q.cam.fov),ls:localStorage.getItem('kq-fish')}});
 console.log('Taste 0 schaltet ein',JSON.stringify(t1),t1.on&&t1.act&&/Fisheye an/.test(t1.toast)&&t1.fov===100&&t1.ls==='1');
 const B=await grab();const diff=(x,y)=>{let s=0;for(let i=0;i<x.length;i+=4)s+=Math.abs(x[i]-y[i])+Math.abs(x[i+1]-y[i+1])+Math.abs(x[i+2]-y[i+2]);return s/(x.length/4)/3};
 console.log('Bild verändert sich',Math.round(diff(A,B)*10)/10,diff(A,B)>3);
 /* Foto enthält die Verzerrung: Foto-Inhalt ähnelt dem Fisheye-Bild mehr als dem normalen */
 const ph=await p.evaluate(async()=>{const q=__qa,f=q.fotSnap();const im=new Image();im.src=f.img;await im.decode();const R=q.R.domElement,w=R.width,h=R.height,S=Math.min(1,1280/w),sw=Math.round(w*S),sh=Math.round(h*S);
   const c=document.createElement('canvas');c.width=64;c.height=48;const x=c.getContext('2d');x.drawImage(im,18,18,sw,sh,0,0,64,48);return Array.from(x.getImageData(0,0,64,48).data)});
 const dB=diff(ph,B),dA=diff(ph,A);console.log('Foto enthält Fisheye',Math.round(dB*10)/10,'<',Math.round(dA*10)/10,dB<dA);
 /* Im Builder aus */
 const bd=await p.evaluate(()=>{const q=__qa,s=q.HUB.shops[0],pl=q.bauAddPlot(s.x+30,s.z+30,0,20,'t76');q.P.x=pl.x;q.P.z=pl.z;q.bauOpen(pl);const inB=q.fishActive();q.bauClose(false);return {inB,after:q.fishActive()}});
 console.log('Im Builder aus, danach wieder an',JSON.stringify(bd),!bd.inB&&bd.after);
 /* Beim Tippen in einem Feld keine Wirkung */
 await p.evaluate(()=>{const i=document.createElement('input');i.id='t76in';document.body.appendChild(i);i.focus()});await p.keyboard.press('Digit0');
 const ty=await p.evaluate(()=>__qa.FISH.on);console.log('Tippen im Feld schaltet nicht um',ty,ty===true);
 await p.evaluate(()=>document.getElementById('t76in').blur());await p.click('body',{position:{x:5,y:5}}).catch(()=>{});
 /* Ausschalten und zusammen mit Pixel-Modus */
 await p.keyboard.press('Digit0');const off=await p.evaluate(()=>({on:__qa.FISH.on,toast:document.getElementById('toast').getAttribute('data-t')||''}));
 console.log('Taste 0 schaltet aus',JSON.stringify(off),!off.on&&/Fisheye aus/.test(off.toast));
 const px=await p.evaluate(()=>{const q=__qa;q.fishSet(true);q.setPix(true);for(let i=0;i<3;i++)q.step(.03);q.render();const ok=q.fishActive();q.setPix(false);q.fishSet(false);q.step(.03);q.render();return {ok}});
 console.log('Mit Pixel-Modus ohne Fehler',JSON.stringify(px),px.ok);
 }catch(e){console.log('ERR',e.message)}finally{if(b)await b.close();srv.close()}});
