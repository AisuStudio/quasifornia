const {chromium}=require('playwright');const http=require('http'),fs=require('fs'),path=require('path');
const ROOT=require('path').join(__dirname,'..');
const srv=http.createServer((q,s)=>{const u=q.url.split('?')[0];const f=u==='/'?path.join(ROOT,'dist/dev.html'):path.join(ROOT,u);
 fs.readFile(f,(e,d)=>{if(e){s.writeHead(404);s.end();return}s.writeHead(200,{'content-type':f.endsWith('.js')?'text/javascript; charset=utf-8':'text/html; charset=utf-8'});s.end(d)})}).listen(8806,async()=>{
 const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
 const ctx=await b.newContext({viewport:{width:1280,height:800}});const p=await ctx.newPage();
 p.on('pageerror',e=>console.log('ERR',e.message));p.on('console',m=>{const t=m.text();if(!/GPU stall|Font|fonts.g|Failed to load/.test(t))console.log('LOG',t.slice(0,300))});
 await p.route(/fonts\.(googleapis|gstatic)\.com/,r=>r.abort());
 await p.goto('http://localhost:8806/?test=1');await p.waitForFunction('window.__ready',null,{timeout:120000});
 const shot=async n=>{await p.evaluate('__qa.render()');await p.screenshot({path:require("os").tmpdir()+`/t_i_${n}.png`})};
 const T=(x,z,h=0)=>p.evaluate(([x,z,h])=>{const q=__qa;q.P.x=x;q.P.z=z;q.P.h=h;q.P.speed=0;q.P.y=1.3;for(let i=0;i<3;i++)q.step(.03)},[x,z,h]);
 const act=()=>p.evaluate(()=>{const q=__qa;let best=null,bd=1e9;for(const a of q.curActs()){const d=Math.hypot(q.P.x-a.x,q.P.z-a.z);if(d<a.r&&d<bd){bd=d;best=a}}return best?best.label:null});
 const talk=async()=>{let n=0;while(await p.evaluate(()=>__qa.DLG.open)&&n<30){await p.evaluate(()=>__qa.dlgNext());await p.evaluate(()=>__qa.dlgNext());n++}};
 await p.click('#next1').then(()=>p.click('#go'));
 // Zugang über Portal-Funktion
 await p.evaluate(()=>{__qa.INV.items.clear()});
 await p.evaluate(()=>{__qa.applyLevel(5);__qa.beginPlay()});
 await p.evaluate(()=>{for(let i=0;i<20;i++)__qa.step(.05)});
 console.log('Insel',await p.evaluate(()=>JSON.stringify({lv:__qa.LV.id,ph:__qa.G.phase,t:__qa.ISL.t,pos:[Math.round(__qa.P.x),Math.round(__qa.P.z)],cd:document.getElementById('cd-t').textContent,cdHidden:document.getElementById('cd').hidden,quest:document.getElementById('q-title').textContent})));
 await p.evaluate(()=>{for(let i=0;i<8;i++)__qa.step(.05);__qa.render()});await shot('start');
 // Übersichtskamera
 await p.evaluate(()=>{document.getElementById('ui').style.display='none';const q=__qa;q.cam.position.set(0,150,95);q.cam.lookAt(0,0,-10);q.cam.fov=60;q.cam.updateProjectionMatrix();q.render()});
 await p.screenshot({path:require('os').tmpdir()+'/t_i_top.png'});await p.evaluate(()=>{document.getElementById('ui').style.display=''});
 // Gate vorher
 await T(0,-17);console.log('Tor-Label (0/4)',await act());
 // P2 ohne Schraubendreher
 await T(43,12);console.log('Alarm-Label',await act());await p.evaluate(()=>__qa.actGo());console.log('Dialog offen (ohne Item)',await p.evaluate(()=>__qa.DLG.open));await talk();
 // P1 Funkspruch
 await T(-42,12);console.log('Funk-Label',await act());await p.evaluate(()=>__qa.actGo());console.log('Puzzle 1 offen',await p.evaluate(()=>__qa.PUZ.open));
 await p.click('#p1-go');console.log('falsch (Shift 0) gelöst?',await p.evaluate(()=>__qa.ISL.s[0]));
 await p.click('#p1-p');await p.click('#p1-p');await p.click('#p1-p');await p.evaluate(()=>{__qa.render()});await shot('puz1');
 await p.click('#p1-go');console.log('Shift 3 gelöst?',await p.evaluate(()=>JSON.stringify({s:__qa.ISL.s,open:__qa.PUZ.open})));await talk();
 // P2 mit Item
 await p.evaluate(()=>{__qa.INV.items.add('schraube')});await T(43,12);await p.evaluate(()=>__qa.actGo());
 console.log('Puzzle 2 offen',await p.evaluate(()=>__qa.PUZ.open));await p.click('#p2-go');console.log('Alarm noch an: gelöst?',await p.evaluate(()=>__qa.ISL.s[1]));
 await p.click('#p2-sw button[data-k="C"]');await p.click('#p2-go');console.log('nur C an: gelöst?',await p.evaluate(()=>__qa.ISL.s[1]));await p.click('#p2-sw button[data-k="A"]');await p.evaluate(()=>{__qa.render()});await shot('puz2');await p.click('#p2-go');console.log('C an -> gelöst?',await p.evaluate(()=>JSON.stringify({s:__qa.ISL.s,alarm:__qa.ISL.alarm})));await talk();
 // P3 PIN
 await T(0,21);await p.evaluate(()=>__qa.actGo());
 for(let r=0;r<3;r++){for(const d of '1234')await p.click(`#p3-k button[data-d="${d}"]`);await p.click('#p3-k button[data-a="ok"]')}
 console.log('PIN 3x falsch',await p.evaluate(()=>JSON.stringify({tries:__qa.ISL.pinTries,lock:Math.round((__qa.ISL.pinLock-Date.now())/1000),dis:[...document.querySelectorAll('#p3-k button')].every(b=>b.disabled)})));
 await p.evaluate(()=>{__qa.render()});await shot('puz3');
 await p.evaluate(()=>{__qa.ISL.pinLock=Date.now()-1});await new Promise(r=>setTimeout(r,800));
 for(const d of '4711')await p.click(`#p3-k button[data-d="${d}"]`);await p.click('#p3-k button[data-a="ok"]');
 console.log('PIN richtig',await p.evaluate(()=>JSON.stringify({s:__qa.ISL.s,open:__qa.PUZ.open})));await talk();
 // P4 Log
 await T(-30,-12);await p.evaluate(()=>__qa.actGo());console.log('Dialog ohne USB',await p.evaluate(()=>__qa.DLG.open));await talk();
 await p.evaluate(()=>{__qa.INV.items.add('usb')});await p.evaluate(()=>__qa.actGo());
 await p.evaluate(()=>{__qa.render()});await shot('puz4');
 await p.click('#p4-o button[data-o="10:30"]');console.log('falsche Antwort gelöst?',await p.evaluate(()=>__qa.ISL.s[3]));
 await p.click('#p4-o button[data-o="10:40"]');console.log('richtig',await p.evaluate(()=>JSON.stringify({s:__qa.ISL.s,open:__qa.PUZ.open})));await talk();
 // Kiosk
 await T(22,33);console.log('Kiosk-Label ohne Bon',await act());await p.evaluate(()=>__qa.actGo());await talk();
 await p.evaluate(()=>{__qa.INV.items.add('losung')});const t0=await p.evaluate(()=>__qa.ISL.t);await p.evaluate(()=>__qa.actGo());await talk();console.log('Bonus +60:',await p.evaluate(t=>Math.round(__qa.ISL.t-t),t0),await p.evaluate(()=>__qa.ISL.bonus));
 // Tor
 await T(0,-17);console.log('Tor-Label (4/4)',await act());await p.evaluate(()=>__qa.actGo());await talk();
 console.log('Tor offen',await p.evaluate(()=>JSON.stringify({gate:__qa.ISL.gate,doorVis:__qa.L5.gateDoor.visible,colx0:__qa.L5.gateCol.x0})));
 await p.evaluate(()=>{__qa.render()});await shot('gate_open');
 // Durch das Tor fahren (Kollision frei)
 await p.evaluate(()=>{const q=__qa;q.P.x=0;q.P.z=-14;q.P.h=-Math.PI/2;q.P.speed=8;for(let i=0;i<40;i++){q.K.up=1;q.step(.05)}});console.log('nach Tor z=',await p.evaluate(()=>Math.round(__qa.P.z)));
 // Boot
 await T(78,-36);console.log('Boot-Label',await act());await p.evaluate(()=>{__qa.render()});await shot('boat');
 await p.evaluate(()=>__qa.actGo());console.log('Ende',await p.evaluate(()=>JSON.stringify({ph:__qa.G.phase,h1:document.querySelector('#card h1')&&document.querySelector('#card h1').textContent})));
 // Countdown-Fail
 await p.evaluate(()=>{__qa.applyLevel(5);__qa.beginPlay();__qa.ISL.t=.2;for(let i=0;i<6;i++)__qa.step(.1)});
 console.log('Fail',await p.evaluate(()=>JSON.stringify({failing:__qa.ISL.failing,dlg:__qa.DLG.open})));await talk();
 console.log('Neustart',await p.evaluate(()=>JSON.stringify({lv:__qa.LV.id,t:Math.round(__qa.ISL.t),s:__qa.ISL.s,ph:__qa.G.phase})));
 await b.close();srv.close()})
