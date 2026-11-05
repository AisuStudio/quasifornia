// Steuerung: Fahren nur mit WASD, Pfeiltasten lösen Tricks aus (↑ Kickflip, ← Pop Shove-it, → 360 Flip), alte Tricktasten gehen weiter.
const {chromium}=require('playwright');const http=require('http'),fs=require('fs'),path=require('path');
const srv=http.createServer((q,s)=>{const u=q.url.split('?')[0];const f=u==='/'?path.join(__dirname,'..','dist/dev.html'):path.join(__dirname,'..',u);fs.readFile(f,(e,d)=>{if(e){s.writeHead(404);s.end();return}s.writeHead(200,{'content-type':f.endsWith('.js')?'text/javascript; charset=utf-8':'text/html; charset=utf-8'});s.end(d)})}).listen(8943,async()=>{

 const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
 const p=await b.newPage({viewport:{width:1100,height:620}});p.on('pageerror',e=>console.log('ERR',e.message));
 await p.route(/fonts\.(googleapis|gstatic)\.com/,r=>r.abort());
 await p.goto('http://localhost:8943/?test=1&alt=1');await p.waitForFunction('window.__ready',null,{timeout:120000});await p.click('#next1').then(()=>p.click('#go')).then(()=>p.click('#start'));
 const key=(t,c,extra)=>p.evaluate(([t,c])=>window.dispatchEvent(new KeyboardEvent(t,{code:c,bubbles:true,cancelable:true})),[t,c]);
 const fresh=()=>p.evaluate(()=>{const q=__qa;q.G.phase='play';q.P.x=-60;q.P.z=0;q.P.h=0;q.K.up=q.K.down=q.K.left=q.K.right=0;q.step(.05);for(let i=0;i<40;i++)q.step(.03);q.Tk.active=false;q.Tk.usedAir=false;return true});
 /* Pfeile fahren nicht */
 await fresh();for(const c of ['ArrowUp','ArrowDown','ArrowLeft','ArrowRight']){await key('keydown',c);await key('keyup',c)}
 console.log('Pfeile setzen kein Gas oder Lenken',JSON.stringify(await p.evaluate(()=>({up:__qa.K.up,down:__qa.K.down,left:__qa.K.left,right:__qa.K.right}))));
 /* WASD fahren */
 await key('keydown','KeyW');await key('keydown','KeyA');console.log('W und A wirken',JSON.stringify(await p.evaluate(()=>({up:__qa.K.up,left:__qa.K.left}))));await key('keyup','KeyW');await key('keyup','KeyA');
 /* Pfeile als Tricks, alte Tasten als Ersatz */
 for(const [c,kind] of [['ArrowUp','kickflip'],['ArrowLeft','shove'],['ArrowRight','tre'],['ShiftLeft','kickflip'],['KeyQ','shove'],['KeyR','tre']]){await fresh();await key('keydown',c);await key('keyup',c);
   console.log(c,'->',JSON.stringify(await p.evaluate(()=>({aktiv:__qa.Tk.active,art:__qa.Tk.kind}))),kind)}
 await fresh();await key('keydown','ArrowDown');console.log('Pfeil runter löst nichts aus',!(await p.evaluate(()=>__qa.Tk.active)));
 /* Anstoßen: beim Beschleunigen aktiv, bei Reisegeschwindigkeit nicht, ohne Gas nicht */
 await fresh();const pu=await p.evaluate(()=>{const q=__qa,o={};q.P.speed=0;q.K.up=1;let mx=0,ph=new Set();for(let i=0;i<60;i++){q.step(.03);mx=Math.max(mx,q.PUSH.w);ph.add(Math.round(q.PUSH.ph*4))}o.anstossBeiStart=+mx.toFixed(2);o.phasen=ph.size;
   q.P.speed=q.SPEED_MAX?q.SPEED_MAX*1.6:13;for(let i=0;i<40;i++){q.step(.03);q.P.speed=13}o.beiTempo=+q.PUSH.w.toFixed(2);
   q.K.up=0;q.P.speed=0;for(let i=0;i<40;i++)q.step(.03);o.ohneGas=+q.PUSH.w.toFixed(2);return o});
 console.log('Anstoßen',JSON.stringify(pu),pu.anstossBeiStart>.8&&pu.phasen>2&&pu.beiTempo<.05&&pu.ohneGas<.05);
 /* Positions-Anzeige: Taste V, x, z, Winkel (0° = Norden), Klick kopiert */
 const hud=await p.evaluate(async()=>{const q=__qa,o={};q.G.phase='play';q.P.x=-21.4;q.P.z=59.2;q.P.h=-Math.PI/2;q.POSH.on=false;q.posHudSet(false);return o});
 await p.keyboard.press('v');await p.evaluate(()=>{__qa.posHudStep(.2);__qa.posHudStep(.2)});
 const h1=await p.evaluate(()=>({an:__qa.POSH.on,text:document.getElementById('poshud').textContent,sichtbar:document.getElementById('poshud').style.display}));
 console.log('Positions-Anzeige an',JSON.stringify(h1.text.split('\n')[0]),h1.an&&h1.sichtbar==='block'&&/x -21\.4\s+z 59\.2\s+Winkel 0° N\b/.test(h1.text)&&/Stand/.test(h1.text));
 await p.evaluate(()=>{__qa.P.h=0;__qa.posHudStep(.2)});console.log('Blick nach Osten = 90°',/Winkel 90° O\b/.test(await p.evaluate(()=>document.getElementById('poshud').textContent)));
 await p.keyboard.press('v');await p.evaluate(()=>{__qa.posHudStep(.2)});console.log('Taste V schaltet aus',await p.evaluate(()=>!__qa.POSH.on&&document.getElementById('poshud').style.display==='none'));
 await b.close();srv.close()})
