// A-Mart-Innenraum (Level 7): hinein durch die Ladentür, Regale und Kasse öffnen den Laden, Wände und Regale blockieren, hinaus vor die Tür, nicht bei Polizei.
const {chromium}=require('playwright');const http=require('http'),fs=require('fs'),path=require('path');
const srv=http.createServer((q,s)=>{const u=q.url.split('?')[0];const f=u==='/'?path.join(__dirname,'..','dist/dev.html'):path.join(__dirname,'..',u);fs.readFile(f,(e,d)=>{if(e){s.writeHead(404);s.end();return}s.writeHead(200,{'content-type':f.endsWith('.js')?'text/javascript; charset=utf-8':'text/html; charset=utf-8'});s.end(d)})}).listen(8944,async()=>{
 const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});

 const p=await b.newPage({viewport:{width:1000,height:620}});p.on('pageerror',e=>console.log('ERR',e.message));
 await p.route(/fonts\.(googleapis|gstatic)\.com/,r=>r.abort());
 await p.goto('http://localhost:8944/?test=1');await p.waitForFunction('window.__ready',null,{timeout:120000});await p.click('#next1').then(()=>p.click('#go')).then(()=>p.click('#start'));
 const free=()=>p.evaluate(()=>{const q=__qa;q.DLG.open=false;document.getElementById('dlg').hidden=true;return true});
 const act=async()=>{await free();return p.evaluate(()=>{const e=document.getElementById('act');return e.hidden?'':e.firstElementChild.textContent})};
 /* Draußen: Aktion an der Ladentür */
 await p.evaluate(()=>{const q=__qa,s=q.HUB.shops[0];q.G.phase='play';q.P.x=s.x;q.P.z=s.z;q.P.speed=0;q.step(.03)});
 console.log('Tür draußen',await act());
 /* Polizei blockiert */
 await p.evaluate(()=>{const q=__qa;q.POL.state='chase';q.curActs().find(a=>a.label==='A-Mart betreten').fn()});
 console.log('Mit Polizei bleibt man draußen',await p.evaluate(()=>__qa.LV.id===0));
 await p.evaluate(()=>{const q=__qa;q.POL.state='idle';q.curActs().find(a=>a.label==='A-Mart betreten').fn();q.G.phase='play'});await free();
 const st=()=>p.evaluate(()=>{const q=__qa;return {lv:q.LV.id,x:+q.P.x.toFixed(1),z:+q.P.z.toFixed(1),acts:q.curActs().map(a=>a.label)}});
 let s=await st();console.log('Drinnen',JSON.stringify({lv:s.lv,start:[s.x,s.z],aktionen:s.acts.length}));
 /* Regal Sprühdosen */
 await p.evaluate(()=>{const q=__qa;q.P.x=-10.6;q.P.z=-5;q.P.speed=0;q.step(.03)});console.log('Am Dosenregal',await act());
 await p.evaluate(()=>{__qa.curActs().find(a=>/Sprühdosen/.test(a.label)).fn()});await p.waitForTimeout(250);
 console.log('Laden offen, Kaufen erlaubt',JSON.stringify(await p.evaluate(()=>({offen:!document.getElementById('inv').hidden,inShop:__qa.SHOP.in,tab:__qa.SC&&document.querySelector('#rp-tabs button[aria-pressed=true]').dataset.t,dosenKaufbar:[...document.querySelectorAll('#rp-lad button[data-can]')].some(b=>!b.disabled)}))));
 await p.evaluate(()=>{__qa.SC.n=100});await p.evaluate(()=>{__qa.invToggle(false)});
 await p.evaluate(()=>{const q=__qa;q.P.x=-5.4;q.P.z=-5;q.P.speed=0;q.step(.03)});console.log('Am Skinregal',await act());
 await p.evaluate(()=>{const q=__qa;q.P.x=15.2;q.P.z=6;q.P.speed=0;q.step(.03)});console.log('An der Kasse',await act());
 await p.evaluate(()=>{const q=__qa;q.P.x=7.2;q.P.z=-5;q.P.speed=0;q.step(.03)});console.log('Leeres Regal',await act());
 /* Kollision: gegen Regal und Wand fahren */
 const hit=await p.evaluate(()=>{const q=__qa,o={};q.P.x=-8;q.P.z=-4;q.P.h=Math.PI;q.P.speed=8;q.K.up=1;for(let i=0;i<120;i++)q.step(.03);o.regalX=+q.P.x.toFixed(1);
   q.P.x=15;q.P.z=-4;q.P.h=0;q.P.speed=8;for(let i=0;i<120;i++)q.step(.03);o.wandX=+q.P.x.toFixed(1);
   q.P.x=0;q.P.z=0;q.P.h=-Math.PI/2;q.P.speed=8;for(let i=0;i<120;i++)q.step(.03);o.hintenZ=+q.P.z.toFixed(1);
   q.P.x=0;q.P.z=0;q.P.h=Math.PI/2;q.P.speed=8;for(let i=0;i<120;i++)q.step(.03);o.vorneZ=+q.P.z.toFixed(1);q.K.up=0;return o});
 console.log('Kollision',JSON.stringify(hit),hit.regalX>-12.5&&hit.wandX<22&&hit.hintenZ>-15&&hit.vorneZ<17);
 /* Hinaus */
 await p.evaluate(()=>{const q=__qa;q.P.x=0;q.P.z=14.8;q.P.speed=0;q.step(.03)});console.log('Am Ausgang',await act());
 await p.evaluate(()=>{__qa.curActs().find(a=>a.label==='A-Mart verlassen').fn()});await free();
 const o=await p.evaluate(()=>{const q=__qa,s=q.HUB.shops[0];return {lv:q.LV.id,abstand:+Math.hypot(q.P.x-s.x,q.P.z-s.z).toFixed(1),stadtSichtbar:q.HUB&&true,phase:q.G.phase}});
 console.log('Wieder draußen',JSON.stringify(o),o.lv===0&&o.abstand<8&&o.phase==='play');
 await b.close();srv.close()})
