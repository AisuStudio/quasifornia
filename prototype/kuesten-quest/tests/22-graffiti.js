// Graffiti: Dosen kaufen, Editor, Wand speichern, Auftrag.
const {chromium}=require('playwright');const http=require('http'),fs=require('fs'),path=require('path');
const srv=http.createServer((q,s)=>{const u=q.url.split('?')[0];const f=u==='/'?path.join(__dirname,'..','dist/dev.html'):path.join(__dirname,'..',u);fs.readFile(f,(e,d)=>{if(e){s.writeHead(404);s.end();return}s.writeHead(200,{'content-type':f.endsWith('.js')?'text/javascript; charset=utf-8':'text/html; charset=utf-8'});s.end(d)})}).listen(8839,async()=>{
 const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
 const p=await b.newPage({viewport:{width:1100,height:760}});p.on('pageerror',e=>console.log('ERR',e.message));
 await p.route(/fonts\.(googleapis|gstatic)\.com/,r=>r.abort());
 await p.goto('http://localhost:8839/?test=1');await p.waitForFunction('window.__ready',null,{timeout:120000});await p.click('#next1').then(()=>p.click('#go'));
 console.log('Wände',JSON.stringify(await p.evaluate(()=>__qa.HUB.graf.panels.map(p=>p.id+':'+Math.round(p.ax)+','+Math.round(p.az)))));
 console.log('ohne Dose',JSON.stringify(await p.evaluate(()=>{const q=__qa,pn=q.HUB.graf.panels[0];q.G.phase='play';q.P.x=pn.ax;q.P.z=pn.az;q.P.speed=0;q.step(.03);const acts=q.curActs().map(a=>a.label).filter(l=>/Wand/.test(l));q.grafOpen(pn);return {acts,editorOffen:q.GF.open,dialog:q.DLG.open}})));
 await p.evaluate(()=>{const q=__qa;let n=0;while(q.DLG.open&&n++<10)q.dlgNext()});
 console.log('Dose kaufen',JSON.stringify(await p.evaluate(()=>{const q=__qa;q.SC.n=30;const ok=q.grafBuy('#2de0d0');const ok2=q.grafBuy('#ee7cb8');return {ok,ok2,scoops:q.SC.n,tuerkis:Math.round(q.GF.cans['#2de0d0'])}})));
 await p.evaluate(()=>{const q=__qa;q.grafOpen(q.HUB.graf.panels[0])});
 const r=await p.evaluate(()=>{const c=document.getElementById('graf-cv').getBoundingClientRect();return {x:c.left,y:c.top,w:c.width,h:c.height}});
 console.log('Editor offen',JSON.stringify(await p.evaluate(()=>({offen:__qa.GF.open,sichtbar:!document.getElementById('graf').hidden}))));
 for(let k=0;k<6;k++){await p.mouse.move(r.x+r.w*.1,r.y+r.h*(.2+k*.1));await p.mouse.down();await p.mouse.move(r.x+r.w*.5,r.y+r.h*(.25+k*.1),{steps:6});await p.mouse.move(r.x+r.w*.9,r.y+r.h*(.2+k*.1),{steps:6});await p.mouse.up()}
 await p.click('#graf-pal .gpal:nth-child(2)');
 await p.click('#graf [data-sz="7"]');
 await p.mouse.move(r.x+r.w*.3,r.y+r.h*.85);await p.mouse.down();await p.mouse.move(r.x+r.w*.7,r.y+r.h*.85,{steps:8});await p.mouse.up();
 await p.screenshot({path:require('os').tmpdir()+'/graf_editor.png'});
 console.log('gemalt',JSON.stringify(await p.evaluate(()=>{const q=__qa,cx=document.getElementById('graf-cv').getContext('2d'),d=cx.getImageData(0,0,128,64).data;let teal=0,pink=0;for(let i=0;i<d.length;i+=4){if(d[i]<80&&d[i+1]>190&&d[i+2]>180)teal++;if(d[i]>220&&d[i+1]>100&&d[i+1]<140&&d[i+2]>160)pink++}return {tuerkisPixel:teal,pinkPixel:pink,dabs:q.GF.dabs,tuerkisTank:Math.round(q.GF.cans['#2de0d0'])}})));
 await p.click('#graf-done');
 console.log('gespeichert',JSON.stringify(await p.evaluate(()=>{const q=__qa;return {offen:q.GF.open,gespeichert:!!localStorage.getItem('kq-graf-n1'),auftrag:q.SC.au.graffiti||0,gesamt:q.GF.total}})));
 await p.reload();await p.waitForFunction('window.__ready',null,{timeout:120000});await p.click('#next1').then(()=>p.click('#go'));await p.waitForTimeout(400);
 console.log('nach Neuladen',JSON.stringify(await p.evaluate(()=>{const q=__qa,pn=q.HUB.graf.panels[0],d=pn.ctx.getImageData(0,0,128,64).data;let teal=0;for(let i=0;i<d.length;i+=4)if(d[i]<80&&d[i+1]>190&&d[i+2]>180)teal++;return {tuerkisPixel:teal,tank:Math.round(q.GF.cans['#2de0d0'])}})));
 console.log('Abbrechen',JSON.stringify(await p.evaluate(()=>{const q=__qa,pn=q.HUB.graf.panels[1];q.grafOpen(pn);const cx=document.getElementById('graf-cv').getContext('2d');cx.fillStyle='#fff';cx.fillRect(0,0,128,64);q.grafClose(false);const d=pn.ctx.getImageData(10,10,1,1).data;return {offen:q.GF.open,pixelWeiss:d[0]>240&&d[1]>240}})));
 await p.evaluate(()=>{document.getElementById('ui').style.display='none';const q=__qa,pn=q.HUB.graf.panels[0];q.cam.position.set(pn.x+5,6,pn.z+22);q.cam.lookAt(pn.x,6,pn.z);q.cam.fov=55;q.cam.updateProjectionMatrix();q.render()});
 await p.screenshot({path:require('os').tmpdir()+'/graf_wand.png'});
 await b.close();srv.close()})
