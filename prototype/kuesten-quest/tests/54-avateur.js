// L’Avateur (Außenseite): lachsrotes Haus im Süden mit Schaufenstern, Logo, geschlossener Tür und Figuren in den Auslagen.
const {chromium}=require('playwright');const http=require('http'),fs=require('fs'),path=require('path');const ROOT=path.join(__dirname,'..');
const srv=http.createServer((q,s)=>{const u=q.url.split('?')[0];const f=u==='/'?path.join(ROOT,'dist/dev.html'):path.join(ROOT,u);fs.readFile(f,(e,d)=>{if(e){s.writeHead(404);s.end();return}s.writeHead(200,{'content-type':f.endsWith('.js')?'text/javascript; charset=utf-8':'text/html; charset=utf-8'});s.end(d)})}).listen(8988,async()=>{let b;try{
 b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});const p=await b.newPage({viewport:{width:900,height:560}});p.on('pageerror',e=>console.log('ERR',e.message));await p.route(/fonts/,r=>r.abort());await p.route('**/api/**',r=>r.fulfill({status:404,body:''}));
 await p.goto('http://localhost:8988/?test=1');await p.waitForFunction('window.__ready',null,{timeout:120000});await p.click('#next1').then(()=>p.click('#go')).then(()=>p.click('#start'));
 await p.evaluate(()=>{const q=__qa;q.G.phase='play';q.DLG.open=false;document.getElementById('dlg').hidden=true});
 const r=await p.evaluate(()=>{const q=__qa,a=q.HUB.avateur,kinds=q.MAPD.buildings.filter(b=>b.kind==='avateur');if(!a)return {keine:true};
  const ux=-a.nz,uz=a.nx,pt=(t,n)=>[a.doorX-a.nx*1.4+ux*t+a.nx*n,a.doorZ-a.nz*1.4+uz*t+a.nz*n];const bay=pt(a.Ww/2+1.1,.97),davor=pt(a.Ww/2+1.1,2.9),stufe=pt(0,.83);
  return {haeuser:kinds.length,label:kinds[0]&&kinds[0].label,figs:a.figs.map(f=>({k:f.kind,h:f.h,w:f.w,d:f.d})),Ww:a.Ww,
   bayGesperrt:!q.mpWalk(bay[0],bay[1]),davorFrei:q.mpWalk(davor[0],davor[1]),stufeFrei:q.mpWalk(stufe[0],stufe[1])}});
 console.log('Haus erkannt',JSON.stringify({haeuser:r.haeuser,label:r.label}),r.haeuser===1&&r.label==='L’Avateur');
 const kinds=r.figs.map(f=>f.k),hs=r.figs.map(f=>f.h);console.log('Vier verschiedene Wesen',JSON.stringify(kinds),new Set(kinds).size===4);
 console.log('Gleich hoch (±0,3)',JSON.stringify(hs),Math.max(...hs)-Math.min(...hs)<=.3&&Math.min(...hs)>.8);
 console.log('Jede passt in ihre Auslage',JSON.stringify(r.figs.map(f=>[f.w,f.d])),r.figs.every(f=>f.w<=r.Ww/2&&f.d<=1.0));
 console.log('Erker gesperrt, Weg davor und Stufe frei',JSON.stringify([r.bayGesperrt,r.davorFrei,r.stufeFrei]),r.bayGesperrt&&r.davorFrei&&r.stufeFrei);
 await p.waitForFunction(()=>__qa.AMART&&__qa.AMART.pending===0,null,{timeout:15000}).catch(()=>{});
 const t=await p.evaluate(()=>{const q=__qa,tx=q.AMART&&q.AMART.tex.lav;if(!tx)return {keine:true};const cv=tx.image,d=cv.getContext('2d').getImageData(0,0,cv.width,cv.height).data;let blau=0,rot=0,weiss=0;for(let i=0;i<d.length;i+=4){if(d[i]<80&&d[i+1]<80&&d[i+2]>110)blau++;if(d[i]>200&&d[i+1]<70&&d[i+2]<70)rot++;if(d[i]>240&&d[i+1]>240&&d[i+2]>240)weiss++}return {w:cv.width,h:cv.height,blau,rot,weiss}});
 console.log('Logo-Textur geladen',JSON.stringify(t),!t.keine&&t.blau>2000&&t.rot>1000&&t.weiss>50000);
 }catch(e){console.log('FEHLER',e.message)}try{await b.close()}catch(e){}srv.close()});
