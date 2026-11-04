// Musik aus R2 (lokaler Worker mit lokalem Bucket): Liste, Titel aus musik.json, Streaming mit Range, ungültige Namen, Passwortschutz, Auswahl im Rarepod.
// Vorher:  cd quasifornia && npx wrangler dev --local --port 8790 --var SITE_PASSWORD:testpw --var STATS_PASSWORD:statspw
const {chromium}=require('playwright');const http=require('http'),fs=require('fs'),path=require('path'),os=require('os'),cp=require('child_process');
const WK={host:'localhost',port:8790},AUTH='Basic '+Buffer.from('x:testpw').toString('base64');
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const srv=http.createServer((q,s)=>{const u=q.url.split('?')[0];
  if(u.startsWith('/api/')||u.startsWith('/musik/')){const pr=http.request({...WK,path:q.url,method:q.method,headers:{...q.headers,host:'localhost:8790',authorization:AUTH}},r=>{s.writeHead(r.statusCode,r.headers);r.pipe(s)});q.pipe(pr);return}
  const f=u==='/'?path.join(__dirname,'..','dist/dev.html'):path.join(__dirname,'..',u);fs.readFile(f,(e,d)=>{if(e){s.writeHead(404);s.end();return}s.writeHead(200,{'content-type':f.endsWith('.js')?'text/javascript; charset=utf-8':'text/html; charset=utf-8'});s.end(d)})});
srv.listen(8947,async()=>{
 const W=(p,o={})=>fetch('http://localhost:8790'+p,{...o,headers:{authorization:AUTH,...(o.headers||{})}});
 try{const r=await W('/api/graffiti');if(!r.ok)throw 0}catch(e){console.log('übersprungen: kein lokaler Worker (npx wrangler dev --local --port 8790 --var SITE_PASSWORD:testpw --var STATS_PASSWORD:statspw)');srv.close();return}
 /* zwei kleine WAV-Dateien und eine musik.json in den lokalen Bucket legen */
 const wav=(sec)=>{const n=Math.round(8000*sec),b=Buffer.alloc(44+n,128);b.write('RIFF',0);b.writeUInt32LE(36+n,4);b.write('WAVEfmt ',8);b.writeUInt32LE(16,16);b.writeUInt16LE(1,20);b.writeUInt16LE(1,22);b.writeUInt32LE(8000,24);b.writeUInt32LE(8000,28);b.writeUInt16LE(1,32);b.writeUInt16LE(8,34);b.write('data',36);b.writeUInt32LE(n,40);return b};
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'musik-')),files={'test-erstes_lied.wav':wav(.6),'zweites lied.wav':wav(.4),'musik.json':Buffer.from(JSON.stringify([{file:'zweites lied.wav',title:'Zweites Lied <b>',artist:'Packed Rich',info:'Album X'}]))};
 let putOk=true;for(const [k,v] of Object.entries(files)){fs.writeFileSync(path.join(dir,k),v);const r=cp.spawnSync('npx',['wrangler','r2','object','put','quasifornia-musik/'+k,'--file',path.join(dir,k),'--local'],{cwd:path.join(__dirname,'..','..','..'),encoding:'utf8'});if(r.status!==0){putOk=false;console.log('put fehlgeschlagen',k,(r.stderr||'').slice(0,200))}}
 await wait(800);
 const lst=await W('/api/musik').then(r=>r.json()).catch(()=>({tracks:[]}));
 if(!putOk||!lst.tracks.length){console.log('übersprungen: lokaler Worker ohne R2-Bucket (Worker nach Änderung an wrangler.jsonc neu starten)');srv.close();return}
 console.log('Liste',JSON.stringify(lst.tracks.map(t=>[t.key,t.title,t.artist])));
 console.log('Titel aus musik.json, sonst aus dem Dateinamen',lst.tracks.some(t=>t.title==='Zweites Lied <b>'&&t.artist==='Packed Rich')&&lst.tracks.some(t=>t.title==='test-erstes lied'||t.title==='test-erstes lied'.replace('-','-')));
 console.log('musik.json ist keine Musikdatei',!lst.tracks.some(t=>t.key==='musik.json'));
 /* Datei, Range, ungültig, ohne Passwort */
 const full=await W('/musik/'+encodeURIComponent('test-erstes_lied.wav'));const buf=Buffer.from(await full.arrayBuffer());
 console.log('Datei',full.status,full.headers.get('content-type'),buf.length,full.headers.get('accept-ranges'),buf.length===files['test-erstes_lied.wav'].length);
 const part=await W('/musik/'+encodeURIComponent('test-erstes_lied.wav'),{headers:{range:'bytes=100-199'}});const pb=Buffer.from(await part.arrayBuffer());
 console.log('Range',part.status,part.headers.get('content-range'),pb.length,part.status===206&&pb.length===100&&part.headers.get('content-range')==='bytes 100-199/'+buf.length);
 const bad=await Promise.all(['../x.wav','musik.json','a%2Fb.wav','ohne-endung','x.exe'].map(k=>W('/musik/'+k).then(r=>r.status)));console.log('Ungültige Namen',JSON.stringify(bad),bad.every(s=>s===404||s===400));
 const anon=await Promise.all([fetch('http://localhost:8790/api/musik'),fetch('http://localhost:8790/musik/'+encodeURIComponent('test-erstes_lied.wav'))].map(p=>p.then(r=>r.status)));console.log('Ohne Passwort',JSON.stringify(anon),anon.every(s=>s===401));
 /* Rarepod: Liste und Auswahl */
 const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
 const ctx=await b.newContext({viewport:{width:1000,height:640}});await ctx.route(/fonts/,r=>r.abort());await ctx.route('**/api/graffiti**',r=>r.fulfill({status:404,body:''}));const p=await ctx.newPage();p.on('pageerror',e=>console.log('ERR',e.message));
 await p.goto('http://localhost:8947/?test=1');await p.waitForFunction('window.__ready',null,{timeout:120000});await wait(1200);
 await p.evaluate(()=>{const q=__qa;q.G.phase='play';q.DLG.open=false;document.getElementById('dlg').hidden=true;q.rpTab('mus');q.invToggle(true)});await wait(300);
 const ui=await p.evaluate(()=>({titel:[...document.querySelectorAll('.trk button')].map(b=>b.textContent),weiter:!!document.getElementById('pl-next'),html:document.querySelector('#rp-mus .np2').innerHTML,b:document.querySelector('#rp-mus').innerHTML.includes('<b>Zweites')}));
 console.log('Rarepod Musik',JSON.stringify(ui.titel),ui.weiter,'kein eingeschleustes HTML',!ui.b);
 await p.evaluate(()=>{document.querySelectorAll('.trk button')[1].click()});await wait(300);
 console.log('Auswahl setzt die Quelle',JSON.stringify(await p.evaluate(()=>({src:decodeURIComponent(new URL(__qa.MUS.src).pathname),i:__qa.MUSE.i,aktiv:document.querySelectorAll('.trk button[aria-pressed=true]').length}))));
 await p.evaluate(()=>{document.getElementById('pl-next').click()});await wait(200);console.log('Weiter springt',await p.evaluate(()=>__qa.MUSE.i));
 await b.close();srv.close()})
