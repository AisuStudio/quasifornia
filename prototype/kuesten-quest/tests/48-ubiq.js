// UBIQ (Phill's Phantastic Phormula): Dose im A-Mart kaufen und nachfüllen, Glitches flackern und lassen sich reparieren (Scoops, Ladungen, Speicher), echte Verschränkungen werden erkannt und gemeldet.
const {chromium}=require('playwright');const http=require('http'),fs=require('fs'),path=require('path');
const srv=http.createServer((q,s)=>{const u=q.url.split('?')[0];const f=u==='/'?path.join(__dirname,'..','dist/dev.html'):path.join(__dirname,'..',u);fs.readFile(f,(e,d)=>{if(e){s.writeHead(404);s.end();return}s.writeHead(200,{'content-type':f.endsWith('.js')?'text/javascript; charset=utf-8':'text/html; charset=utf-8'});s.end(d)})}).listen(8949,async()=>{
 const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});

 const p=await b.newPage({viewport:{width:1000,height:640}});p.on('pageerror',e=>console.log('ERR',e.message));
 await p.route(/fonts\.(googleapis|gstatic)\.com/,r=>r.abort());
 await p.goto('http://localhost:8949/?test=1&ubiq=1&stats=1');await p.waitForFunction('window.__ready',null,{timeout:120000});await p.click('#next1').then(()=>p.click('#go')).then(()=>p.click('#start'));
 const free=()=>p.evaluate(()=>{const q=__qa;q.DLG.open=false;document.getElementById('dlg').hidden=true;return true});
 await p.evaluate(()=>{localStorage.removeItem('kq-ubiq')});
 const g0=await p.evaluate(()=>{const q=__qa;return {n:q.UBQ.list.length,arten:q.UBQ.list.map(g=>g.type).join(','),alleAmWegesrand:q.UBQ.list.every(g=>q.mpWalk(g.tx,g.tz))}});
 console.log('Glitch-Stellen',JSON.stringify(g0),g0.n>=3&&g0.alleAmWegesrand);
 /* Laden: kaufen, nachfüllen */
 const shop=await p.evaluate(()=>{const q=__qa,o={};q.G.phase='play';q.SC.n=100;q.shopEnter();const btn=()=>document.querySelector('#rp-lad [data-ubq]');
   o.kartePreis=document.querySelector('#rp-lad').textContent.includes('30 Scoops');btn().click();o.nachKauf={own:q.UBQ.own,ch:q.UBQ.ch,scoops:q.SC.n};
   o.vollGesperrt=btn().disabled;q.UBQ.ch=2;q.rpTab('lad');btn().click();o.nachFuellen={ch:q.UBQ.ch,scoops:q.SC.n};
   o.invSlot=document.querySelector('#inv-grid').textContent.includes('UBIQ');return o});
 console.log('Laden',JSON.stringify(shop),shop.kartePreis&&shop.nachKauf.own&&shop.nachKauf.ch===5&&shop.nachKauf.scoops===70&&shop.vollGesperrt&&shop.nachFuellen.ch===5&&shop.nachFuellen.scoops===45&&shop.invSlot);
 /* Reparatur */
 await p.evaluate(()=>{__qa.invToggle(false)});await free();
 const rep=await p.evaluate(()=>{const q=__qa,o={},g=q.UBQ.list[0];g.seen=true;q.G.phase='play';q.P.x=g.x+Math.sign(g.tx-g.x)*2.2;q.P.z=g.z+Math.sign(g.tz-g.z)*2.2;q.P.speed=0;for(let i=0;i<4;i++)q.step(.03);
   o.aktion=(document.getElementById('act').firstElementChild||{}).textContent;const labels=q.curActs().filter(a=>/UBIQ/.test(a.label)).length;o.aktionen=labels;
   const sc0=q.SC.n,ch0=q.UBQ.ch;q.ubiqUse(g);o.nach={fixed:g.fixed,ch:q.UBQ.ch,scoops:q.SC.n-sc0,pos:[+g.obj.position.x.toFixed(1),+g.obj.position.z.toFixed(1)],ziel:[+g.tx.toFixed(1),+g.tz.toFixed(1)],gespeichert:JSON.parse(localStorage.getItem('kq-ubiq')).fixed.includes(g.id)};
   q.ubiqUse(g);o.zweiter={ch:q.UBQ.ch,scoops:q.SC.n-sc0};return o});
 console.log('Reparatur',JSON.stringify(rep),rep.aktion&&/UBIQ sprühen/.test(rep.aktion)&&rep.nach.fixed&&rep.nach.scoops===15&&rep.nach.ch===4&&rep.nach.pos[0]===rep.nach.ziel[0]&&rep.nach.gespeichert&&rep.zweiter.ch===4&&rep.zweiter.scoops===15);
 /* Ohne Ladung: Hinweis statt Reparatur */
 const leer=await p.evaluate(()=>{const q=__qa,g=q.UBQ.list.find(x=>!x.fixed);q.UBQ.ch=0;q.G.phase='play';q.P.x=g.x;q.P.z=g.z;q.step(.03);const lab=q.curActs().find(a=>/Glitch:/.test(a.label));q.ubiqUse(g);return {label:!!lab,dialog:q.DLG.open,fixed:g.fixed}});
 console.log('Dose leer',JSON.stringify(leer),leer.label&&leer.dialog&&!leer.fixed);await free();
 /* Echte Verschränkung: ein Sammelgegenstand in einer festen Zelle wird erkannt, gemeldet und erlöst */
 const echt=await p.evaluate(()=>{const q=__qa,o={},it=q.HUB.items[0];let cell=null;for(let x=-200;x<260&&!cell;x+=1)for(let z=-330;z<260;z+=1)if(q.mpAt(x,z)===5){cell=[x,z];break}
   it.x=cell[0];it.z=cell[1];q.STAT.q.length=0;q.UBQ.fixed.clear();q.ubiqInitWorld();const g=q.UBQ.list.find(x=>x.type==='item');o.erkannt=!!g;o.gemeldet=q.STAT.q.some(e=>e[0]==='glitch'&&/^fund:item/.test(e[1]));
   q.UBQ.own=true;q.UBQ.ch=3;g.seen=true;q.ubiqUse(g);o.nachher={zelle:q.mpAt(it.x,it.z),frei:q.mpWalk(it.x,it.z)};o.gemeldetFix=q.STAT.q.some(e=>e[0]==='glitch'&&/^fix:item/.test(e[1]));return o});
 console.log('Echte Verschränkung',JSON.stringify(echt),echt.erkannt&&echt.gemeldet&&echt.nachher.frei&&echt.gemeldetFix);
 /* Stand im Rarepod (Steuerung): zeigt die Versionskennung des Builds */
 const ver=await p.evaluate(()=>{const q=__qa;q.invToggle(true);q.rpTab('key');const t=document.getElementById('rp-key').textContent;return {zeile:(t.match(/Stand\s+\S+/)||[''])[0]}});console.log('Stand-Zeile',JSON.stringify(ver),/^Stand\s+\S+/.test(ver.zeile)&&!/undefined|\?$/.test(ver.zeile));
 await b.close();srv.close()})
