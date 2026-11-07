// Arcade of Fate (Außenseite): Anbau an der Ostseite des Blocks Shopping Court, Logo-Schild, Leuchtschicht nur bei Nacht, Kollision.
const {chromium}=require('playwright');const http=require('http'),fs=require('fs'),path=require('path');const ROOT=path.join(__dirname,'..');
const srv=http.createServer((q,s)=>{const u=q.url.split('?')[0];const f=u==='/'?path.join(ROOT,'dist/dev.html'):path.join(ROOT,u);fs.readFile(f,(e,d)=>{if(e){s.writeHead(404);s.end();return}s.writeHead(200,{'content-type':f.endsWith('.js')?'text/javascript; charset=utf-8':'text/html; charset=utf-8'});s.end(d)})}).listen(8997,async()=>{let b;try{
 b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});const p=await b.newPage({viewport:{width:900,height:560}});p.on('pageerror',e=>console.log('ERR',e.message));await p.route(/fonts/,r=>r.abort());await p.route('**/api/**',r=>r.fulfill({status:404,body:''}));
 await p.goto('http://localhost:8997/?test=1');await p.waitForFunction('window.__ready',null,{timeout:120000});await p.click('#next1').then(()=>p.click('#go')).then(()=>p.click('#start'));
 await p.evaluate(()=>{const q=__qa;q.G.phase='play';q.DLG.open=false;document.getElementById('dlg').hidden=true});
 await p.waitForFunction(()=>__qa.AMART&&__qa.AMART.pending===0,null,{timeout:15000}).catch(()=>{});
 const r=await p.evaluate(()=>{const q=__qa,A=q.HUB.arcade,court=q.MAPD.buildings.find(b=>b.kind==='shopping');if(!A||!court)return {keine:true};
  const cx=q.MAPD.buildings.filter(b=>b.kind==='shopping').length;
  return {eins:cx===1,ost:A.nx>.8,L:Math.round(A.L),D:Math.round(A.D),flach:A.D<2,tuerFrei:q.mpWalk(A.door[0],A.door[1]),kinder:A.glow.parent.children.length>=15}});
 console.log('Arcade da',JSON.stringify(r),await p.evaluate(()=>__qa.HUB.arcade.glow.parent.children.length),!r.keine&&r.eins&&r.ost&&r.flach&&r.tuerFrei&&r.kinder);
 const g=await p.evaluate(()=>{const q=__qa,A=q.HUB.arcade,at=t=>{q.DAY.t=t*1800;for(let k=0;k<3;k++)q.step(.02);return {dn:+q.DAY.dn.toFixed(2),op:+A.glow.material.opacity.toFixed(2),vis:A.glow.visible,hell:+A.base.color.r.toFixed(2)}};return {tag:at(.3),nacht:at(.7)}});
 console.log('Leuchten',JSON.stringify(g),g.tag.op===0&&!g.tag.vis&&g.tag.hell===1&&g.nacht.op>.5&&g.nacht.vis&&g.nacht.hell<.6);
 const t=await p.evaluate(()=>{const q=__qa,tx=q.AMART.tex.arcade;if(!tx)return {keine:true};const cv=tx.image,d=cv.getContext('2d').getImageData(0,0,cv.width,cv.height).data;let gelb=0,rot=0;for(let i=0;i<d.length;i+=4){if(d[i]>240&&d[i+1]>180&&d[i+2]<60)gelb++;if(d[i]>240&&d[i+1]<40&&d[i+2]<40)rot++}return {gelb,rot}});
 console.log('Logo-Textur geladen',JSON.stringify(t),!t.keine&&t.gelb>500&&t.rot>3000);
 }catch(e){console.log('FEHLER',e.message)}try{await b.close()}catch(e){}srv.close()});
