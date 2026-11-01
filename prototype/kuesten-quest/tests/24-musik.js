// Musik-Player im Rarepod: Pause, Lautstärke, Effekte getrennt, Steuerung-Reiter.
const {chromium}=require('playwright');const http=require('http'),fs=require('fs'),path=require('path');
const srv=http.createServer((q,s)=>{const u=q.url.split('?')[0];const f=u==='/'?path.join(__dirname,'..','dist/dev.html'):path.join(__dirname,'..',u);fs.readFile(f,(e,d)=>{if(e){s.writeHead(404);s.end();return}s.writeHead(200,{'content-type':f.endsWith('.js')?'text/javascript; charset=utf-8':'text/html; charset=utf-8'});s.end(d)})}).listen(8852,async()=>{
 const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
 const p=await b.newPage({viewport:{width:1100,height:760}});p.on('pageerror',e=>console.log('ERR',e.message));
 await p.route(/fonts\.(googleapis|gstatic)\.com/,r=>r.abort());
 await p.goto('http://localhost:8852/?test=1');await p.waitForFunction('window.__ready',null,{timeout:120000});await p.click('#next1').then(()=>p.click('#go')).then(()=>p.click('#start'));
 const st=()=>p.evaluate(()=>({musikPause:__qa.MUSE.paused,sfxAus:__qa.G.muted,knopf:document.getElementById('b-snd').textContent,vol:+__qa.MUS.volume.toFixed(2),gespeichert:localStorage.getItem('kq-mus')}));
 console.log('Start',JSON.stringify(await st()));
 await p.keyboard.press('m');console.log('M',JSON.stringify(await st()));
 await p.keyboard.press('i');await p.waitForTimeout(250);await p.click('#rp-tabs button[data-t=mus]');await p.waitForTimeout(250);
 await p.click('#pl-play');console.log('Player Play',JSON.stringify(await st()));
 await p.click('#pl-sfx');console.log('Effekte aus',JSON.stringify(await st()));
 await p.evaluate(()=>{const r=document.getElementById('pl-vol');r.value=30;r.dispatchEvent(new Event('input',{bubbles:true}))});console.log('Lautstärke 30',JSON.stringify(await st()));
 await p.screenshot({path:require('os').tmpdir()+'/player.png'});
 await p.click('#rp-tabs button[data-t=key]');await p.waitForTimeout(250);console.log('Steuerung sichtbar',await p.evaluate(()=>!document.getElementById('rp-key').hidden&&document.getElementById('rp-key').textContent.includes('Curb Grind')));
 await p.screenshot({path:require('os').tmpdir()+'/steuerung.png'});
 await b.close();srv.close()})
