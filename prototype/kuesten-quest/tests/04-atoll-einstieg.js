const {chromium}=require('playwright');const http=require('http'),fs=require('fs'),path=require('path');
const ROOT=require('path').join(__dirname,'..');
const srv=http.createServer((q,s)=>{const u=q.url.split('?')[0];const f=u==='/'?path.join(ROOT,'dist/dev.html'):path.join(ROOT,u);
 fs.readFile(f,(e,d)=>{if(e){s.writeHead(404);s.end();return}s.writeHead(200,{'content-type':f.endsWith('.js')?'text/javascript; charset=utf-8':'text/html; charset=utf-8'});s.end(d)})}).listen(8805,async()=>{
 const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
 const ctx=await b.newContext({viewport:{width:1280,height:800}});const p=await ctx.newPage();
 p.on('pageerror',e=>console.log('ERR',e.message));p.on('console',m=>{const t=m.text();if(!/GPU stall|Font|fonts.g|Failed to load/.test(t))console.log('LOG',t.slice(0,300))});
 await p.route(/fonts\.(googleapis|gstatic)\.com/,r=>r.abort());
 await p.goto('http://localhost:8805/?test=1');await p.waitForFunction('window.__ready',null,{timeout:120000});
 const shot=async n=>{await p.evaluate('__qa.render()');await p.screenshot({path:require("os").tmpdir()+`/t_${n}.png`})};
 const T=(x,z,h=0)=>p.evaluate(([x,z,h])=>{const q=__qa;q.P.x=x;q.P.z=z;q.P.h=h;q.P.speed=0;q.P.y=1.3;for(let i=0;i<3;i++)q.step(.03)},[x,z,h]);
 const act=()=>p.evaluate(()=>__qa.curActs&&(()=>{const q=__qa;let best=null,bd=1e9;for(const a of q.curActs()){const d=Math.hypot(q.P.x-a.x,q.P.z-a.z);if(d<a.r&&d<bd){bd=d;best=a}}return best?best.label:null})());
 const talk=async()=>{await p.evaluate(()=>__qa.actGo());let n=0;while(await p.evaluate(()=>__qa.DLG.open)&&n<30){await p.evaluate(()=>__qa.dlgNext());await p.evaluate(()=>__qa.dlgNext());n++}return n};
 await p.click('#next1').then(()=>p.click('#go'));
 const L=await p.evaluate(()=>JSON.stringify({lab:__qa.HUB.lab,man:__qa.HUB.man&&[__qa.HUB.man.x,__qa.HUB.man.z],atoll:__qa.HUB.atoll&&[__qa.HUB.atoll.x,__qa.HUB.atoll.z],items:__qa.HUB.items.map(i=>[i.def.id,Math.round(i.x),Math.round(i.z)]),code:__qa.CODE.join(''),dict:__qa.DICT.join('')}));
 console.log('Lab',L);
 const lab=JSON.parse(L).lab;
 // Ansicht Labor
 await p.evaluate(([cx,cz])=>{document.getElementById('ui').style.display='none';const q=__qa;q.P.x=cx+6;q.P.z=cz-27;q.P.h=Math.PI;q.step(.03);q.cam.position.set(cx+22,10,cz-42);q.cam.lookAt(cx+2,5,cz-14);q.cam.fov=60;q.cam.updateProjectionMatrix();q.render()},[lab.cx,lab.cz]);
 await p.screenshot({path:require('os').tmpdir()+'/t_lab_ext.png'});
 await p.evaluate(()=>{document.getElementById('ui').style.display=''});
 // Tür vor Gespräch
 await T(lab.doorX,lab.doorZ-1);console.log('Tür-Label (vor Gespräch)',await act());
 await p.evaluate(()=>__qa.actGo());console.log('Tür ohne Gespräch: Pad offen?',await p.evaluate(()=>__qa.PAD.open));
 // Mann
 await T(lab.manX-1,lab.manZ-3);console.log('Mann-Label',await act());
 const n1=await talk();console.log('Dialog Schritte',n1,'Q',await p.evaluate(()=>JSON.stringify({t:__qa.Q.talked,d:__qa.Q.dictated})));
 await p.evaluate(()=>{__qa.render()});await shot('man');
 // Tür / Pad
 await T(lab.doorX,lab.doorZ-1);console.log('Tür-Label (nach Gespräch)',await act());
 await p.evaluate(()=>__qa.actGo());console.log('Pad offen',await p.evaluate(()=>__qa.PAD.open));
 const wrong='1234567890';
 for(let r=0;r<3;r++){for(const d of wrong)await p.evaluate(d=>__qa.padKey(+d),d);await p.evaluate(()=>__qa.padOk());console.log('Versuch',r+1,await p.evaluate(()=>JSON.stringify({tries:__qa.Q.tries,lock:Math.round((__qa.Q.lockUntil-Date.now())/1000),buf:__qa.PAD.buf})))}
 await p.evaluate(()=>{__qa.render()});await shot('pad_lock');
 // Sperre: richtiger Code wirkungslos?
 for(const d of (await p.evaluate(()=>__qa.CODE.join(''))))await p.evaluate(d=>__qa.padKey(+d),d);
 console.log('Tasten in Sperre ignoriert, buf:',await p.evaluate(()=>__qa.PAD.buf.length));
 await p.evaluate(()=>{const q=__qa;q.PAD.open=false;document.getElementById('pad').hidden=true});
 // Eis
 await T(-38,24);console.log('Eiswagen-Label',await act());await p.evaluate(()=>__qa.actGo());console.log('Eis',await p.evaluate(()=>__qa.Q.ice));
 await T(lab.manX-1,lab.manZ-3);console.log('Mann-Label mit Eis',await act());
 await talk();console.log('Korrigiert',await p.evaluate(()=>JSON.stringify({c:__qa.Q.corrected,ice:__qa.Q.ice,sheet:document.getElementById('inv-grid')&&1})));
 // Sperre simulieren abgelaufen
 await p.evaluate(()=>{__qa.Q.lockUntil=Date.now()-1});
 // Items sammeln: direkt setzen
 await p.evaluate(()=>{['funk','schraube','usb','handbuch','losung'].forEach(id=>__qa.INV.items.add(id))});
 await T(lab.doorX,lab.doorZ-1);await p.evaluate(()=>__qa.actGo());
 console.log('Pad offen (Sperre vorbei)',await p.evaluate(()=>__qa.PAD.open+' tries='+__qa.Q.tries));
 for(const d of (await p.evaluate(()=>__qa.CODE.join(''))))await p.evaluate(d=>__qa.padKey(+d),d);
 await p.evaluate(()=>__qa.padOk());
 await p.evaluate(()=>{for(let i=0;i<30;i++)__qa.step(.05)});
 console.log('Im Labor',await p.evaluate(()=>JSON.stringify({lv:__qa.LV.id,ph:__qa.G.phase,pos:[Math.round(__qa.P.x),Math.round(__qa.P.z)],quest:document.getElementById('q-title').textContent})));
 await p.evaluate(()=>{for(let i=0;i<10;i++)__qa.step(.05);__qa.render()});await shot('lab_in');
 // Schlüssel: Schaltkasten
 await T(-34,-20,-Math.PI/2);console.log('Kasten-Label',await act());
 await p.evaluate(()=>{__qa.INV.items.delete('schraube')});await talk();console.log('ohne Schraubendreher: Schlüssel?',await p.evaluate(()=>__qa.Q.hasKey));
 await p.evaluate(()=>{__qa.INV.items.add('schraube')});await talk();console.log('mit Schraubendreher: Schlüssel?',await p.evaluate(()=>__qa.Q.hasKey));
 await p.evaluate(()=>{for(let i=0;i<4;i++)__qa.step(.05);__qa.render()});await shot('lab_key');
 // raus
 await T(0,26);console.log('Ausgang-Label',await act());await p.evaluate(()=>__qa.actGo());await p.evaluate(()=>{for(let i=0;i<6;i++)__qa.step(.05)});
 console.log('Zurück',await p.evaluate(()=>JSON.stringify({lv:__qa.LV.id,pos:[Math.round(__qa.P.x),Math.round(__qa.P.z)],doorX:__qa.HUB.lab.doorX,doorZ:__qa.HUB.lab.doorZ})));
 // Mann befreien
 await T(lab.manX-1,lab.manZ-3);console.log('Mann-Label mit Schlüssel',await act());await talk();
 console.log('Befreit',await p.evaluate(()=>JSON.stringify({freed:__qa.Q.freed,state:__qa.HUB.man.state,portalVis:__qa.HUB.atoll.g.visible})));
 await p.evaluate(()=>{for(let i=0;i<20;i++)__qa.step(.05);__qa.render()});await shot('walk');
 for(let i=0;i<60;i++){await p.evaluate(()=>{for(let j=0;j<10;j++)__qa.step(.05)});if(await p.evaluate(()=>__qa.HUB.man.state)==='stand')break}
 console.log('Mann am Portal',await p.evaluate(()=>JSON.stringify({state:__qa.HUB.man.state,x:Math.round(__qa.HUB.man.x),z:Math.round(__qa.HUB.man.z),portal:[Math.round(__qa.HUB.atoll.x),Math.round(__qa.HUB.atoll.z)]})));
 await p.evaluate(()=>{__qa.render()});await shot('atoll_portal');
 // Portal betreten
 await p.evaluate(()=>{const q=__qa,A=q.HUB.atoll;q.P.x=A.x;q.P.z=A.z;q.step(.03)});
 console.log('Atoll-Karte',await p.evaluate(()=>JSON.stringify({ph:__qa.G.phase,h1:document.querySelector('#card h1')&&document.querySelector('#card h1').textContent})));
 await b.close();srv.close()})
