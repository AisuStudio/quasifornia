// Sammelkarten: Packs mit 7 Karten, Ziehung nach Seltenheit, Kaufen im P-Mart, Sammlung im Rarepod, Speichern.
// Karten und Bilder kommen im Spiel vom Server (R2); der Test liefert sie über page.route aus einer Testdatei (kein Worker nötig).
const {chromium}=require('playwright');const http=require('http'),fs=require('fs'),path=require('path');
const ROOT=path.join(__dirname,'..');
const rar=[1,2,3,4,5],DATA={v:1,packSize:7,packPrice:30,tiers:[40,28,18,10,4],guarantee:3,fams:{a:{name:'Fam A',col:'#ff5fa8'},b:{name:'Fam B',col:'#47c2a5'}},
 cards:Array.from({length:46},(_,i)=>({id:i+1,file:'t'+(i+1)+'.webp',fam:i%2?'a':'b',name:'Karte '+(i+1),rar:rar[i%5===4&&i>40?4:(i<5?0:i<15?1:i<33?2:i<43?3:4)],ort:'Test',stufe:1,lore:'Text '+(i+1)}))};
const PNG=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==','base64');
const srv=http.createServer((q,s)=>{const u=q.url.split('?')[0];const f=u==='/'?path.join(ROOT,'dist/dev.html'):path.join(ROOT,u);fs.readFile(f,(e,d)=>{if(e){s.writeHead(404);s.end();return}s.writeHead(200,{'content-type':f.endsWith('.js')?'text/javascript; charset=utf-8':'text/html; charset=utf-8'});s.end(d)})}).listen(8953,async()=>{
 const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
 const ctx=await b.newContext({viewport:{width:1000,height:700}});await ctx.route(/fonts/,r=>r.abort());await ctx.route('**/api/graffiti**',r=>r.fulfill({status:404,body:''}));
 await ctx.route('**/api/karten',r=>r.fulfill({status:200,contentType:'application/json',body:JSON.stringify(DATA)}));await ctx.route('**/designs/karten/**',r=>r.fulfill({status:200,contentType:'image/png',body:PNG}));
 const p=await ctx.newPage();p.on('pageerror',e=>console.log('ERR',e.message));
 const boot=async()=>{await p.goto('http://localhost:8953/?test=1');await p.waitForFunction('window.__ready',null,{timeout:120000});await p.click('#next1').then(()=>p.click('#go')).then(()=>p.click('#start'));
  await p.evaluate(()=>{const q=__qa;q.G.phase='play';q.DLG.open=false;document.getElementById('dlg').hidden=true});await p.waitForFunction(()=>__qa.KAR.state==='da',null,{timeout:10000})};
 await boot();
 console.log('Karten geladen',await p.evaluate(()=>__qa.KAR.data.cards.length)===46);
 /* Ziehung */
 const dr=await p.evaluate(()=>{const q=__qa;let n=0,t=[0,0,0,0,0,0],lastOk=true,sizeOk=true;for(let i=0;i<4000;i++){const c=q.karDraw(7);if(c.length!==7)sizeOk=false;if(c[6].rar<3)lastOk=false;c.forEach(x=>{t[x.rar]++;n++})}return {t,n,lastOk,sizeOk}});
 const sh=dr.t.slice(1).map(x=>x/dr.n);console.log('Ziehung',JSON.stringify(dr),sh.map(x=>x.toFixed(2)).join(' '),dr.sizeOk&&dr.lastOk&&sh[0]>sh[1]&&sh[1]>sh[2]&&sh[2]>sh[3]&&sh[3]>sh[4]&&sh[4]>0);
 /* Kaufen */
 const k1=await p.evaluate(()=>{const q=__qa;q.SC.n=100;q.SHOP.in=false;const a=q.karBuyPack();return {a,packs:q.KAR.packs,sc:q.SC.n}});console.log('Kaufen draußen gesperrt',JSON.stringify(k1),!k1.a&&k1.packs===0&&k1.sc===100);
 const k2=await p.evaluate(()=>{const q=__qa;q.SHOP.in=true;const a=q.karBuyPack();return {a,packs:q.KAR.packs,sc:q.SC.n}});console.log('Kaufen im Laden',JSON.stringify(k2),k2.a&&k2.packs===1&&k2.sc===70);
 const k3=await p.evaluate(()=>{const q=__qa;q.SC.n=10;const a=q.karBuyPack();return {a,packs:q.KAR.packs,sc:q.SC.n}});console.log('Zu wenig Scoops',JSON.stringify(k3),!k3.a&&k3.packs===1&&k3.sc===10);
 /* Rarepod */
 await p.evaluate(()=>{document.getElementById('b-inv').click();document.querySelector('#rp-tabs [data-t=kar]').click()});await p.waitForTimeout(200);
 const u1=await p.evaluate(()=>({q:document.querySelectorAll('#rp-kar .kth.q').length,th:document.querySelectorAll('#rp-kar .kth[data-s]').length,btn:!document.getElementById('kar-open').disabled}));console.log('Sammlung leer, Pack bereit',JSON.stringify(u1),u1.q===46&&u1.th===0&&u1.btn);
 await p.evaluate(()=>document.getElementById('kar-open').click());await p.waitForTimeout(300);
 const u2=await p.evaluate(()=>({slots:document.querySelectorAll('#rp-kar .kslot').length,neu:document.querySelectorAll('#rp-kar .kc-new').length,packs:__qa.KAR.packs,got:Object.values(__qa.KAR.own).reduce((a,b)=>a+b,0),btn:document.getElementById('kar-open').disabled}));
 console.log('Pack geöffnet',JSON.stringify(u2),u2.slots===7&&u2.packs===0&&u2.got===7&&u2.neu>=1&&u2.btn);
 const d0=await p.evaluate(()=>document.querySelectorAll('#rp-kar .kslot .kcard.down').length);console.log('Alle sieben verdeckt',d0===7);await p.evaluate(()=>document.querySelector('#rp-kar .kslot .kcard').click());const fl=await p.evaluate(()=>({down:document.querySelectorAll('#rp-kar .kslot .kcard.down').length,all:document.querySelectorAll('#rp-kar .kslot .kcard').length}));console.log('Karten starten verdeckt, eine aufgedeckt',JSON.stringify(fl),fl.all===7&&fl.down===6);
 await p.evaluate(()=>document.getElementById('kar-all').click());const fa=await p.evaluate(()=>({f:7-document.querySelectorAll('#rp-kar .kslot .kcard.down').length,t:document.getElementById('kar-all').textContent}));console.log('Alle aufgedeckt',JSON.stringify(fa),fa.f===7&&fa.t==='Fertig');
 await p.evaluate(()=>document.getElementById('kar-all').click());const u3=await p.evaluate(()=>({slots:document.querySelectorAll('#rp-kar .kslot').length,th:document.querySelectorAll('#rp-kar .kth[data-s]').length,got:__qa.KAR.data.cards.filter(c=>__qa.KAR.own[c.id]>0).length}));
 console.log('Fertig, Karten in der Sammlung',JSON.stringify(u3),u3.slots===0&&u3.th===u3.got&&u3.got>=1);
 await p.evaluate(()=>document.querySelector('#rp-kar .kth[data-s]').click());const big=await p.evaluate(()=>document.querySelectorAll('#rp-kar .kbig .kcard').length);console.log('Detailkarte',big===1);
 await p.screenshot({path:require('os').tmpdir()+'/t_karten.png'});
 /* Speichern */
 const own=await p.evaluate(()=>JSON.stringify(__qa.KAR.own));await boot();console.log('Nach Neuladen gespeichert',await p.evaluate(()=>JSON.stringify(__qa.KAR.own))===own);
 /* Laden-Anzeige und Regal */
 await p.evaluate(()=>{const q=__qa;q.SC.n=100;q.shopEnter('cards')});await p.waitForTimeout(300);
 const sp=await p.evaluate(()=>({sec:!!document.getElementById('kar-shop'),btn:!!document.querySelector('[data-kpack]')&&!document.querySelector('[data-kpack]').disabled}));console.log('Kartenpack im Laden',JSON.stringify(sp),sp.sec&&sp.btn);
 await p.evaluate(()=>{const q=__qa;q.applyLevel(7);q.beginPlay()});const acts=await p.evaluate(()=>__qa.L7.acts.map(a=>a.label));console.log('Regal im P-Mart',acts.some(a=>/Sammelkarten/.test(a)));
 await b.close();srv.close()});
