// Akira’s Garage (Außenseite): Gebäude 6 und 8 werden zu einem Gebäude, vier Rolltore nach Osten, Kundentür nach Westen, Logo-Schild, Kollision.
const {chromium}=require('playwright');const http=require('http'),fs=require('fs'),path=require('path');const ROOT=path.join(__dirname,'..');
const srv=http.createServer((q,s)=>{const u=q.url.split('?')[0];const f=u==='/'?path.join(ROOT,'dist/dev.html'):path.join(ROOT,u);fs.readFile(f,(e,d)=>{if(e){s.writeHead(404);s.end();return}s.writeHead(200,{'content-type':f.endsWith('.js')?'text/javascript; charset=utf-8':'text/html; charset=utf-8'});s.end(d)})}).listen(8996,async()=>{let b;try{
 b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});const p=await b.newPage({viewport:{width:900,height:560}});p.on('pageerror',e=>console.log('ERR',e.message));await p.route(/fonts/,r=>r.abort());await p.route('**/api/**',r=>r.fulfill({status:404,body:''}));
 await p.goto('http://localhost:8996/?test=1');await p.waitForFunction('window.__ready',null,{timeout:120000});await p.click('#next1').then(()=>p.click('#go')).then(()=>p.click('#start'));
 await p.evaluate(()=>{const q=__qa;q.G.phase='play';q.DLG.open=false;document.getElementById('dlg').hidden=true});
 const r=await p.evaluate(()=>{const q=__qa,g=q.HUB.garage,B=q.MAPD.buildings;if(!g)return {keine:true};
  const gk=B.filter(b=>b.kind==='garage'),gt=B.filter(b=>b.kind==='garage-teil'),walk=(x,z)=>q.mpWalk(x,z);
  return {garage:gk.length,teil:gt.length,teilSkip:gt.every(b=>b.skip),label:gk[0]&&gk[0].label,L:Math.round(g.L),D:Math.round(g.D),ost:g.nx>.9,tueren:g.doors.length,
   mitteBlockiert:!walk(g.x,g.z),vorOstFrei:g.doors.every(d=>walk(d[0],d[1])),kundentuerFrei:walk(g.customerDoor[0],g.customerDoor[1])}});
 console.log('Gebäude 6 und 8 zu einem',JSON.stringify({garage:r.garage,teil:r.teil,teilSkip:r.teilSkip,label:r.label}),r.garage===1&&r.teil===1&&r.teilSkip&&r.label==='Akira’s Garage');
 console.log('Maße und Ausrichtung nach Osten',JSON.stringify({L:r.L,D:r.D,ost:r.ost}),r.L>=38&&r.L<=46&&r.D>=12&&r.D<=20&&r.ost);
 console.log('Vier Rolltore',r.tueren,r.tueren===4);
 console.log('Innen gesperrt, davor und Kundentür frei',JSON.stringify([r.mitteBlockiert,r.vorOstFrei,r.kundentuerFrei]),r.mitteBlockiert&&r.vorOstFrei&&r.kundentuerFrei);
 await p.waitForFunction(()=>__qa.AMART&&__qa.AMART.pending===0,null,{timeout:15000}).catch(()=>{});
 const t=await p.evaluate(()=>{const q=__qa,tx=q.AMART.tex.garage;if(!tx)return {keine:true};const cv=tx.image,d=cv.getContext('2d').getImageData(0,0,cv.width,cv.height).data;let gelb=0,vio=0;for(let i=0;i<d.length;i+=4){if(d[i]>240&&d[i+1]>230&&d[i+2]<60)gelb++;if(d[i]<110&&d[i+1]<60&&d[i+2]>200)vio++}return {w:cv.width,h:cv.height,gelb,vio}});
 console.log('Logo-Textur geladen',JSON.stringify(t),!t.keine&&t.gelb>50000&&t.vio>10000);
 }catch(e){console.log('FEHLER',e.message)}try{await b.close()}catch(e){}srv.close()});
