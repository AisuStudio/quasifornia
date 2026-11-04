// Unterwelt: Vorwärts/Rückwärts vertauscht, links/rechts gleich; oben unverändert; Touch-Gas/Bremse ebenso; kein Hängenbleiben beim Wechsel.
const {chromium}=require('playwright');const http=require('http'),fs=require('fs'),path=require('path');
const srv=http.createServer((q,s)=>{const u=q.url.split('?')[0];const f=u==='/'?path.join(__dirname,'..','dist/dev.html'):path.join(__dirname,'..',u);fs.readFile(f,(e,d)=>{if(e){s.writeHead(404);s.end();return}s.writeHead(200,{'content-type':f.endsWith('.js')?'text/javascript; charset=utf-8':'text/html; charset=utf-8'});s.end(d)})}).listen(8904,async()=>{
 const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
 const p=await b.newPage({hasTouch:true});p.on('pageerror',e=>console.log('ERR',e.message));
 await p.route(/fonts\.(googleapis|gstatic)\.com/,r=>r.abort());await p.route('**/api/graffiti**',r=>r.fulfill({status:404,body:''}));
 await p.goto('http://localhost:8904/?test=1');await p.waitForFunction('window.__ready',null,{timeout:120000});
 await p.evaluate(()=>{localStorage.clear();const q=__qa;q.applyLevel(0);q.beginPlay();q.G.phase='play'});
 const K=()=>p.evaluate(()=>({up:__qa.K.up,down:__qa.K.down,left:__qa.K.left,right:__qa.K.right,unten:!!__qa.G.under}));
 const key=async(type,code)=>p.evaluate(([t,c])=>window.dispatchEvent(new KeyboardEvent(t,{code:c,bubbles:true,cancelable:true})),[type,code]);
 /* oben unverändert */
 await key('keydown','KeyW');console.log('oben W',JSON.stringify(await K()));await key('keyup','KeyW');
 await key('keydown','KeyS');console.log('oben Pfeil runter',JSON.stringify(await K()));await key('keyup','KeyS');
 /* unten */
 await p.evaluate(()=>__qa.underApply(true));
 await key('keydown','KeyW');console.log('unten W',JSON.stringify(await K()));await key('keyup','KeyW');
 await key('keydown','KeyS');console.log('unten S',JSON.stringify(await K()));await key('keyup','KeyS');
 await key('keydown','KeyW');console.log('unten Pfeil hoch',JSON.stringify(await K()));await key('keyup','KeyW');
 await key('keydown','KeyS');console.log('unten Pfeil runter',JSON.stringify(await K()));await key('keyup','KeyS');
 await key('keydown','KeyA');await key('keydown','KeyD');console.log('unten A+D',JSON.stringify(await K()));await key('keyup','KeyA');await key('keyup','KeyD');
 /* Fahrverhalten unten: S beschleunigt, W bremst */
 console.log('Fahren unten',JSON.stringify(await p.evaluate(()=>{const q=__qa;q.P.speed=0;q.KR.down=1;q.kSync();for(let i=0;i<40;i++)q.step(.05);const mitS=q.P.speed;q.KR.down=0;q.KR.up=1;q.kSync();for(let i=0;i<60;i++)q.step(.05);const mitW=q.P.speed;q.KR.up=0;q.kSync();return {nachS:+mitS.toFixed(1),nachW:+mitW.toFixed(1)}})));
 /* Wechsel bei gehaltener Taste: nichts bleibt hängen */
 await key('keydown','KeyW');await p.evaluate(()=>__qa.underApply(false));console.log('W gehalten, hoch gewechselt',JSON.stringify(await K()));await key('keyup','KeyW');console.log('W losgelassen',JSON.stringify(await K()));
 /* Touch */
 await p.evaluate(()=>{document.getElementById('touch').classList.add('on')});
 const tap=async(id,down)=>p.evaluate(([id,d])=>{const b=document.getElementById(id);b.dispatchEvent(new PointerEvent(d?'pointerdown':'pointerup',{bubbles:true,cancelable:true,pointerType:'touch'}))},[id,down]);
 await tap('t-gas',true);console.log('Touch oben Gas',JSON.stringify(await K()));await tap('t-gas',false);
 await tap('t-brake',true);console.log('Touch oben Bremse',JSON.stringify(await K()));await tap('t-brake',false);
 await p.evaluate(()=>__qa.underApply(true));
 await tap('t-gas',true);console.log('Touch unten Gas',JSON.stringify(await K()));await tap('t-gas',false);
 await tap('t-brake',true);console.log('Touch unten Bremse',JSON.stringify(await K()));await tap('t-brake',false);
 await tap('t-left',true);console.log('Touch unten links',JSON.stringify(await K()));await tap('t-left',false);
 await b.close();srv.close()})
