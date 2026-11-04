// Terminal und Chat im Rarepod (zwei Browser, lokaler Worker): /chat name passwort, falsches Passwort, Nachrichten, Tastenschutz im Eingabefeld, /verlassen.
// Vorher:  cd quasifornia && npx wrangler dev --local --port 8790 --var SITE_PASSWORD:testpw --var STATS_PASSWORD:statspw
const {chromium}=require('playwright');const http=require('http'),net=require('net'),fs=require('fs'),path=require('path');
const WK={host:'localhost',port:8790},AUTH='Basic '+Buffer.from('x:testpw').toString('base64');
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const srv=http.createServer((q,s)=>{const u=q.url.split('?')[0];
  if(u.startsWith('/api/')){const pr=http.request({...WK,path:q.url,method:q.method,headers:{...q.headers,host:'localhost:8790',authorization:AUTH}},r=>{s.writeHead(r.statusCode,r.headers);r.pipe(s)});q.pipe(pr);return}
  const f=u==='/'?path.join(__dirname,'..','dist/dev.html'):path.join(__dirname,'..',u);fs.readFile(f,(e,d)=>{if(e){s.writeHead(404);s.end();return}s.writeHead(200,{'content-type':f.endsWith('.js')?'text/javascript; charset=utf-8':'text/html; charset=utf-8'});s.end(d)})});
srv.on('upgrade',(req,sock,head)=>{const up=net.connect(WK.port,WK.host,()=>{const hs=Object.entries({...req.headers,host:'localhost:8790',origin:'http://localhost:8790',authorization:AUTH}).map(([k,v])=>k+': '+v).join('\r\n');up.write(req.method+' '+req.url+' HTTP/1.1\r\n'+hs+'\r\n\r\n');if(head&&head.length)up.write(head);sock.pipe(up);up.pipe(sock)});up.on('error',()=>sock.destroy());sock.on('error',()=>up.destroy())});
srv.listen(8942,async()=>{
 try{const r=await fetch('http://localhost:8790/api/graffiti',{headers:{authorization:AUTH}});if(!r.ok)throw 0}catch(e){console.log('übersprungen: kein lokaler Worker (npx wrangler dev --local --port 8790 --var SITE_PASSWORD:testpw --var STATS_PASSWORD:statspw)');srv.close();return}
 const raum='p'+Math.random().toString(36).slice(2,7),br=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
 const open=async(name)=>{const ctx=await br.newContext({viewport:{width:800,height:500}});await ctx.route(/fonts/,r=>r.abort());await ctx.route('**/api/graffiti**',r=>r.fulfill({status:404,body:''}));const p=await ctx.newPage();p.on('pageerror',e=>console.log('ERR',name,e.message));
   await p.goto('http://localhost:8942/?test=1&name='+name);await p.waitForFunction('window.__ready',null,{timeout:120000});
   await p.evaluate(()=>{localStorage.clear();const q=__qa;q.applyLevel(0);q.beginPlay();q.G.phase='play';q.SC.n=50;window.__tick=setInterval(()=>{if(!window.__hold)q.step(.05)},40)});return p}; const A=await open('Anton'),B=await open('Mia');await wait(1500);
 const st=p=>p.evaluate(()=>({room:__qa.MULTI.room,on:__qa.MULTI.on,peers:__qa.MULTI.peers.size,log:__qa.TERM.log.map(e=>(e.w?e.w+': ':'')+e.t),hud:(document.getElementById('chathud')||{}).textContent||''}));
 const has=(s,re)=>s.log.some(l=>re.test(l));
 await A.evaluate(()=>__qa.termCmd('/chat testraum geheim'));await wait(1500);let a=await st(A);
 console.log('A erstellt Raum mit Passwort',a.on&&a.room==='testraum'&&has(a,/mit Passwort/));
 console.log('Passwort steht nicht im Log',!a.log.some(l=>/geheim/.test(l)));
 await B.evaluate(()=>__qa.termCmd('/chat testraum falsch'));await wait(1500);let b=await st(B);
 console.log('B mit falschem Passwort abgewiesen',!b.on&&b.room===null&&has(b,/Falsches Passwort/));
 await B.evaluate(()=>__qa.termCmd('/chat testraum geheim'));await wait(1800);b=await st(B);a=await st(A);
 console.log('B mit richtigem Passwort drin',b.on&&b.peers===1&&a.peers===1);
 await B.evaluate(()=>__qa.termCmd('Hallo Anton'));await wait(600);a=await st(A);b=await st(B);
 console.log('Nachricht kommt bei A an',has(a,/Mia: Hallo Anton/)&&/Hallo Anton/.test(a.hud),'| B sieht eigene Zeile',has(b,/Mia: Hallo Anton/));
 await B.evaluate(()=>__qa.termCmd('<img src=x onerror=window.__x=1>'));await wait(700);a=await st(A);
 console.log('HTML wird nur als Text gezeigt',has(a,/<img src=x/)&&!(await A.evaluate(()=>window.__x))&&!(await A.evaluate(()=>!!document.querySelector('#chathud img, #term-log img'))));
 await A.evaluate(()=>{__qa.invToggle(true);__qa.rpTab('ter')});await wait(300);
 const m0=await A.evaluate(()=>({muted:__qa.G.muted,snd:typeof __qa.MUSE!=='undefined'?__qa.MUSE.paused:null}));
 await A.keyboard.type('Ich mag Musik, Nina!',{delay:15});await A.keyboard.press('Enter');await wait(700);
 const open1=await A.evaluate(()=>__qa.INV.open),m1=await A.evaluate(()=>({muted:__qa.G.muted,snd:typeof __qa.MUSE!=='undefined'?__qa.MUSE.paused:null}));
 b=await st(B);
 console.log('Rarepod bleibt offen, Musik/Effekte unverändert',open1&&JSON.stringify(m0)===JSON.stringify(m1),'| B bekommt vollen Text',has(b,/Anton: Ich mag Musik, Nina!/));
 await A.keyboard.press('Escape');await wait(200);console.log('Esc schließt das Rarepod',!(await A.evaluate(()=>__qa.INV.open)));
 await B.evaluate(()=>__qa.termCmd('/chat nurname'));await wait(300);b=await st(B);
 console.log('Falsche Syntax erklärt',has(b,/So geht es: \/chat name passwort/)&&b.on);
 await B.evaluate(()=>__qa.termCmd('/gibtsnicht'));await wait(200);b=await st(B);console.log('Unbekannter Befehl',has(b,/Unbekannter Befehl/));
 await B.evaluate(()=>__qa.termCmd('/verlassen'));await wait(1000);b=await st(B);a=await st(A);
 console.log('B verlassen',!b.on&&b.room===null,'| A sieht niemanden mehr',a.peers===0);
 await A.evaluate(()=>__qa.termCmd('/verlassen'));await wait(800);
 await B.evaluate(()=>__qa.termCmd('/chat testraum neupw'));await wait(1500);b=await st(B);
 console.log('Leerer Raum nimmt neues Passwort',b.on&&has(b,/mit Passwort/));
 await A.evaluate(()=>__qa.termCmd('/chat testraum geheim'));await wait(1500);a=await st(A);
 console.log('Altes Passwort gilt nicht mehr',!a.on&&has(a,/Falsches Passwort/));
 await br.close();srv.close()});
