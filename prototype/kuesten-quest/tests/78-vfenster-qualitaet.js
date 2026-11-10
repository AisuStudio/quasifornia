// V-Fenster als Messhilfe (FPS, Aufrufe, Dreiecke, Auflösung, Grafik, Qualität), Qualitätsstufen Hoch/Mittel/Leicht/Auto (Pixeldichte, Schatten, Konturen), Auto geht runter und wieder hoch, Schalter "Bauplätze aus", Letzter Stand vor dem Beenden.
const {chromium}=require('playwright');const http=require('http'),fs=require('fs'),path=require('path');
const srv=http.createServer((q,s)=>{const u=q.url.split('?')[0];const f=u==='/'?path.join(__dirname,'..','dist/dev.html'):path.join(__dirname,'..',u);fs.readFile(f,(e,d)=>{if(e){s.writeHead(404);s.end();return}s.writeHead(200,{'content-type':f.endsWith('.js')?'text/javascript':f.endsWith('.otf')?'font/otf':'text/html'});s.end(d)})});
srv.listen(8978,async()=>{let b;try{
 b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
 const mk=async(qs,pre)=>{const ctx=await b.newContext({viewport:{width:1000,height:640},deviceScaleFactor:2});await ctx.route(/fonts\.(googleapis|gstatic)\.com/,r=>r.abort());await ctx.route('**/api/**',r=>r.fulfill({status:404,body:''}));if(pre)await ctx.addInitScript(pre);const p=await ctx.newPage();p.on('pageerror',e=>console.log('ERR',e.message));
  await p.goto('http://localhost:8978/?test=1'+(qs||''));await p.waitForFunction('window.__ready',null,{timeout:120000});await p.click('#next1').then(()=>p.click('#go')).then(()=>p.click('#start'));
  await p.evaluate(()=>{const q=__qa;q.G.phase='play';q.DLG.open=false;document.getElementById('dlg').hidden=true;for(let i=0;i<4;i++)q.step(.03);q.render()});return p};
 const p=await mk('&q=hoch','try{localStorage.clear()}catch(e){}');
 await p.keyboard.press('KeyV');await p.evaluate(()=>{const q=__qa;q.POSH.t=0;for(let i=0;i<3;i++)q.step(.2);q.render();q.POSH.t=0;q.step(.2)});
 const t=await p.evaluate(()=>document.getElementById('posh-t').textContent);
 console.log('V-Fenster zeigt Messwerte',JSON.stringify(t.split('\n').slice(0,5)),/FPS \d+/.test(t)&&/Aufrufe \d+/.test(t)&&/Dreiecke/.test(t)&&/Bild \d+×\d+/.test(t)&&/Qualität Hoch/.test(t)&&/Grafik /.test(t));
 const calls=await p.evaluate(()=>__qa.R.info.render.calls);console.log('Aufrufe über alle Schritte gezählt',calls,calls>100);
 /* Stufen: Pixeldichte, Schatten, Konturen */
 const st=async k=>{await p.click('#pq-'+k);return p.evaluate(()=>{const q=__qa,R=q.R.domElement;return {w:R.width,cur:q.QUAL.cur,mode:q.QUAL.mode,shadow:q.QUAL.tiers[q.QUAL.cur].sh}})};
 const H=await st('hoch');const M=await st('mittel');const Lz=await st('leicht');
 const shadows=await p.evaluate(()=>({cast:__qa.SUN.castShadow,size:__qa.SUN.shadow.mapSize.x}));
 console.log('Pixeldichte nach Stufe (Breite des Bildes)',H.w,M.w,Lz.w,H.w>M.w&&M.w>Lz.w);
 console.log('Leicht: Schatten aus',JSON.stringify(shadows),shadows&&shadows.cast===false);
 const out=await p.evaluate(()=>{const q=__qa;q.step(.1);q.render();let n=0;q.sc.traverse(o=>{if(o.isMesh&&o.userData.outline)n++});return {ol:n}});
 await p.click('#pq-hoch');const sh2=await p.evaluate(()=>({cast:__qa.SUN.castShadow,size:__qa.SUN.shadow.mapSize.x}));
 console.log('Hoch: Schatten wieder an mit 2048',JSON.stringify(sh2),sh2.cast&&sh2.size===2048);
 await p.click('#pq-mittel');const sh3=await p.evaluate(()=>__qa.SUN.shadow.mapSize.x);console.log('Mittel: Schattenkarte 1024',sh3,sh3===1024);
 /* Auto: dauerhaft langsam geht runter; danach nicht wieder auf die zu langsame Stufe; von unten (Start niedrig) geht es bei dauerhaft schnell hoch */
 const au=await p.evaluate(()=>{const q=__qa,r={};q.qualMode('auto');q.qualApply('hoch');q.QUAL.cool=0;for(let i=0;i<3;i++)q.qualWindow(18);r.nach3=q.QUAL.cur;
   q.QUAL.cool=0;for(let i=0;i<14;i++)q.qualWindow(90);r.nachSchnell=q.QUAL.cur;q.QUAL.cool=0;for(let i=0;i<3;i++)q.qualWindow(18);r.unten=q.QUAL.cur;
   q.QUAL.cool=0;for(let i=0;i<3;i++)q.qualWindow(18);r.nochMal=q.QUAL.cur;
   q.qualMode('auto');q.qualApply('leicht');q.QUAL.cool=0;for(let i=0;i<13;i++)q.qualWindow(90);r.auf1=q.QUAL.cur;q.QUAL.cool=0;for(let i=0;i<13;i++)q.qualWindow(90);r.auf2=q.QUAL.cur;q.QUAL.cool=0;for(let i=0;i<13;i++)q.qualWindow(90);r.auf3=q.QUAL.cur;
   q.QUAL.cool=0;for(let i=0;i<20;i++)q.qualWindow(50);r.mittleres=q.QUAL.cur;return r});
 console.log('Auto: runter bei langsam, nie zurück auf zu langsame Stufe, hoch bei schnell',JSON.stringify(au),au.nach3==='mittel'&&au.nachSchnell==='mittel'&&au.unten==='leicht'&&au.nochMal==='leicht'&&au.auf1==='mittel'&&au.auf2==='hoch'&&au.auf3==='hoch'&&au.mittleres==='hoch');
 /* Bauplätze aus */
 await p.evaluate(()=>{const q=__qa,s=q.HUB.shops[0],pl=q.bauAddPlot(s.x+30,s.z+30,0,20,'t78');q.P.x=pl.x;q.P.z=pl.z;q.step(.03)});
 const a1=await p.evaluate(()=>__qa.curActs().filter(a=>/Bauplatz/.test(a.label)).length);
 await p.click('#pq-plots');const a2=await p.evaluate(()=>{const q=__qa;q.step(.03);return {acts:q.curActs().filter(a=>/Bauplatz/.test(a.label)).length,vis:q.HUB.plots.some(x=>x.g.visible),flag:q.QUAL.noPlots,ls:localStorage.getItem('kq-noplots')}});
 console.log('Bauplätze aus: keine Aktion, nicht sichtbar',a1,JSON.stringify(a2),a1>=1&&a2.acts===0&&!a2.vis&&a2.flag&&a2.ls==='1');
 await p.click('#pq-plots');const a3=await p.evaluate(()=>({vis:__qa.HUB.plots.every(x=>x.g.visible)}));console.log('Bauplätze wieder an',JSON.stringify(a3),a3.vis);
 /* Fisheye-Knopf */
 await p.click('#pq-fish');const f1=await p.evaluate(()=>__qa.FISH.on);await p.click('#pq-fish');console.log('Fisheye-Knopf schaltet um',f1,f1===true);
 /* Klick auf den Text kopiert (Zwischenablage: Ersatzweg) und löst keinen Wurf aus */
 /* Letzter Stand: wird gespeichert, nach unsauberem Ende (kein pagehide) als NICHT sauber gezeigt */
 const rec=await p.evaluate(()=>{const q=__qa;q.POSH.sv=0;q.POSH.t=0;q.step(.2);return JSON.parse(localStorage.getItem('kq-last')||'null')});
 console.log('Letzter Stand gespeichert',JSON.stringify(rec),rec&&rec.ok===0&&typeof rec.fps==='number'&&rec.q);
 const ctxStore=await p.evaluate(()=>localStorage.getItem('kq-last'));
 const p2=await mk('&q=leicht','try{localStorage.setItem("kq-last",'+JSON.stringify(JSON.stringify({t:Date.now()-120000,x:12.5,z:-40.2,fps:7,calls:1650,tri:1900000,q:'Hoch',ok:0}))+');localStorage.setItem("kq-pos","1")}catch(e){}');
 await p2.evaluate(()=>{const q=__qa;q.POSH.t=0;q.step(.2);q.POSH.t=0;q.step(.2)});
 const t2=await p2.evaluate(()=>({txt:document.getElementById('posh-t').textContent,q:__qa.QUAL.cur,mode:__qa.QUAL.mode}));
 console.log('Nach Absturz: Zuletzt-Zeile und Adress-Schalter ?q=leicht',JSON.stringify(t2.txt.split('\n').filter(l=>/Zuletzt/.test(l))),t2.q,/Zuletzt \(NICHT sauber beendet\) vor 2 min: x 12.5 z -40.2  FPS 7  Aufrufe 1650/.test(t2.txt)&&t2.q==='leicht'&&t2.mode==='leicht');
 }catch(e){console.log('ERR',e.message)}finally{if(b)await b.close();srv.close()}});
