// Haus-Designer (Reiter Gebäude): gleiche Teile-Datei wie das Spiel, Setzen mit der Maus, Export lässt sich im Spiel laden und kommt unverändert zurück.
const {chromium}=require('playwright');const http=require('http'),fs=require('fs'),path=require('path');const ROOT=path.join(__dirname,'..');
const MIME={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.otf':'font/otf'};
const srv=http.createServer((q,s)=>{const u=decodeURIComponent(q.url.split('?')[0]);const f=path.join(ROOT,u==='/'?'dist/dev.html':u);fs.readFile(f,(e,d)=>{if(e){s.statusCode=404;s.end();return}s.setHeader('content-type',MIME[path.extname(f)]||'application/octet-stream');s.end(d)})});
srv.listen(9003,async()=>{let b;try{
 b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
 const p=await b.newPage({viewport:{width:1200,height:760}});p.on('pageerror',e=>console.log('ERR',e.message));
 await p.route(/fonts\.(googleapis|gstatic)\.com/,r=>r.abort());
 await p.goto('http://localhost:9003/tools/avatar-designer/haus.html');await p.waitForFunction('window.__haus&&window.__haus.ready',null,{timeout:30000});
 const a=await p.evaluate(()=>({teile:__haus.parts().length,farben:__haus.cols(),tabs:document.querySelectorAll('#tabs button').length,knoepfe:document.querySelectorAll('#parts button').length}));
 console.log('Teile aus bau-teile.js',JSON.stringify(a),a.teile>40&&a.farben===12&&a.tabs===5&&a.knoepfe>3);
 /* Setzen mit der Maus: Boden anklicken */
 const pt=await p.evaluate(()=>{const h=__haus,T=THREE;const c=document.getElementById('cv'),b=c.getBoundingClientRect();return {w:b.width,h:b.height,x:b.left,y:b.top}});
 const clickAt=async(x,y,btn)=>{await p.mouse.move(x,y);await p.mouse.down({button:btn||'left'});await p.mouse.up({button:btn||'left'});await p.waitForTimeout(80)};
 const cx=pt.x+pt.w/2,cy=pt.y+pt.h/2+40;
 await clickAt(cx,cy);const n1=await p.evaluate(()=>__haus.plot.cells.size);
 await clickAt(cx,cy,'right');await clickAt(cx,cy,'right');
 console.log('Klick setzt, Rechtsklick radiert',n1,await p.evaluate(()=>__haus.plot.cells.size),n1>=1);
 /* Haus per API bauen: Wände, Dach, Fenster, Tür, Garten */
 const exp=await p.evaluate(()=>{const h=__haus;h.plot.cells.clear();for(let x=3;x<6;x++)for(let z=3;z<6;z++)h.put(x,0,z,'block',x%12,0);h.put(4,1,4,'gable',2,1);h.put(7,0,7,'tree',7,0);
   const w=h.deco(4,0,5,0,'win',3),d=h.deco(3,0,3,2,'door',8),pn=h.deco(5,0,5,1,'pano',3);const bad=h.put(99,0,99,'block',0,0),bad2=h.put(1,0,1,'win',0,0);h.paint('4,0,4',-1,5);return {w,d,pn,bad,bad2,s:h.serialize()}});
 console.log('Dekos und ungültige Eingaben',exp.w,exp.d,exp.pn,'abgelehnt',!exp.bad,!exp.bad2,exp.w&&exp.d&&exp.pn&&!exp.bad&&!exp.bad2);
 const json=JSON.stringify(exp.s);
 /* Im Spiel laden und zurückholen */
 const g=await b.newPage({viewport:{width:1100,height:680}});g.on('pageerror',e=>console.log('ERR',e.message));await g.route(/fonts\.(googleapis|gstatic)\.com/,r=>r.abort());
 await g.goto('http://localhost:9003/?test=1');await g.waitForFunction('window.__ready',null,{timeout:120000});await g.click('#next1').then(()=>g.click('#go')).then(()=>g.click('#start'));
 const back=await g.evaluate(j=>{const q=__qa,s=q.HUB.shops[0],pl=q.bauAddPlot(s.x+30,s.z+30,0,20,'t61');q.bauLoadInto(pl,JSON.parse(j));const o=q.bauSerialize(pl);const r=JSON.stringify(o);return {n:pl.cells.size,gleich:r===j,len:j.length,teile:Object.keys(q.BAU_PARTS).length,meshes:(()=>{let c=0;pl.g.traverse(m=>{if(m.isMesh)c++});return c})()}},json);
 console.log('Export im Spiel geladen und gleich zurück',JSON.stringify(back),back.gleich&&back.n===11&&back.meshes>40&&back.teile===a.teile);
 /* Rahmen: Reiter Gebäude zeigt den Haus-Designer */
 const f=await b.newPage({viewport:{width:1280,height:760}});f.on('pageerror',e=>console.log('ERR',e.message));await f.route(/fonts\.(googleapis|gstatic)\.com/,r=>r.abort());
 await f.goto('http://localhost:9003/tools/avatar-designer/index.html');await f.click('[role=tab][data-id=bau]');await f.waitForTimeout(800);
 const rf=await f.evaluate(()=>{const i=document.getElementById('f-haus');return {on:i.classList.contains('on'),ready:!!(i.contentWindow.__haus&&i.contentWindow.__haus.ready),soon:document.getElementById('soon').className,sub:document.getElementById('sub').style.display}});
 console.log('Reiter Gebäude',JSON.stringify(rf),rf.on&&rf.ready&&rf.soon===''&&rf.sub==='none');
 await f.screenshot({path:process.env.SHOT||'/tmp/haus.png'});
 }catch(e){console.log('ERR',e.message)}finally{if(b)await b.close();srv.close()}});
