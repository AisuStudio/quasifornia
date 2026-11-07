// Sprühwände an der sichtbaren Wand: Kanten per Strahl gegen das gezeichnete Gebäude, kurze Wandstücke, Shopping Court, Kennungen bleiben im erlaubten Bereich.
const {chromium}=require('playwright');const http=require('http'),fs=require('fs'),path=require('path');const ROOT=path.join(__dirname,'..');
const srv=http.createServer((q,s)=>{const u=q.url.split('?')[0];const f=u==='/'?path.join(ROOT,'dist/dev.html'):path.join(ROOT,u);fs.readFile(f,(e,d)=>{if(e){s.writeHead(404);s.end();return}s.writeHead(200,{'content-type':f.endsWith('.js')?'text/javascript; charset=utf-8':'text/html; charset=utf-8'});s.end(d)})}).listen(8998,async()=>{let b;try{
 b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});const p=await b.newPage({viewport:{width:900,height:560}});p.on('pageerror',e=>console.log('ERR',e.message));await p.route(/fonts/,r=>r.abort());await p.route('**/api/**',r=>r.fulfill({status:404,body:''}));
 await p.goto('http://localhost:8998/?test=1');await p.waitForFunction('window.__ready',null,{timeout:120000});await p.click('#next1').then(()=>p.click('#go')).then(()=>p.click('#start'));
 await p.evaluate(()=>{const q=__qa;q.G.phase='play';q.DLG.open=false;document.getElementById('dlg').hidden=true});
 const r=await p.evaluate(()=>{const q=__qa;q.GF.edges=null;const t0=performance.now(),E=q.grafEdges(),ms=performance.now()-t0;
  const kurz=E.filter(e=>e.L<5.8).length,idOk=E.every(e=>e.bi<=80&&e.e<=40),slots=E.filter(e=>q.grafSlot&&true).length;
  return {n:E.length,kurz,idOk,schnell:ms<1500,shop:E.filter(e=>e.bi===39).length}});
 console.log('Kanten',JSON.stringify(r),r.n>180&&r.kurz>10&&r.idOk&&r.schnell&&r.shop>=6);
 /* Shopping Court: an der gelben Außenwand gibt es jetzt einen Sprühplatz (vorher gar keinen) */
 const s=await p.evaluate(()=>{const q=__qa,x0=-99.9,z0=-56.3,out=[];for(const a of [20,40,60]){const rr=a*Math.PI/180,dx=Math.cos(rr),dz=Math.sin(rr),h=q.grafWhatWall(x0,z0,dx,dz,14);if(!h)continue;q.P.x=x0+dx*(h.d-1.6);q.P.z=z0+dz*(h.d-1.6);q.P.speed=0;const f=q.grafFacadeNear();out.push(f&&/^f39-/.test(f.id))}return out});
 console.log('Shopping Court besprühbar',JSON.stringify(s),s.length>0&&s.every(Boolean));
 /* kurze Wandstücke: die Fläche schrumpft und bleibt innerhalb der Wand */
 const k=await p.evaluate(()=>{const q=__qa,E=q.grafEdges().filter(e=>e.L<5.8)[0];if(!E)return {keine:true};const sl=q.grafSlot('f'+E.bi+'-'+E.e+'-0'),sl2=q.grafSlot('f'+E.bi+'-'+E.e+'-1');return {w:+sl.w.toFixed(1),klein:sl.w<=E.L,keinZweiter:sl2===null}});
 console.log('Kurze Wand',JSON.stringify(k),!k.keine&&k.klein&&k.keinZweiter&&k.w>=2.4);
 }catch(e){console.log('FEHLER',e.message)}try{await b.close()}catch(e){}srv.close()});
