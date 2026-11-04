// Deck-Designs aus R2 (lokaler Worker mit lokalem Bucket "designs", Ordner decks/): Liste, Bild, ungültige Namen, Passwortschutz, Auswahl im Rarepod, Design liegt auf dem Deck.
// Vorher:  cd quasifornia && npx wrangler dev --local --port 8790 --var SITE_PASSWORD:testpw --var STATS_PASSWORD:statspw
const {chromium}=require('playwright');const http=require('http'),fs=require('fs'),path=require('path'),os=require('os'),cp=require('child_process'),zlib=require('zlib');
const WK={host:'localhost',port:8790},AUTH='Basic '+Buffer.from('x:testpw').toString('base64');
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const srv=http.createServer((q,s)=>{const u=q.url.split('?')[0];
  if(u.startsWith('/api/')||u.startsWith('/designs/')){const pr=http.request({...WK,path:q.url,method:q.method,headers:{...q.headers,host:'localhost:8790',authorization:AUTH}},r=>{s.writeHead(r.statusCode,r.headers);r.pipe(s)});q.pipe(pr);return}
  const f=u==='/'?path.join(__dirname,'..','dist/dev.html'):path.join(__dirname,'..',u);fs.readFile(f,(e,d)=>{if(e){s.writeHead(404);s.end();return}s.writeHead(200,{'content-type':f.endsWith('.js')?'text/javascript; charset=utf-8':'text/html; charset=utf-8'});s.end(d)})});
srv.listen(8948,async()=>{
 const W=(p,o={})=>fetch('http://localhost:8790'+p,{...o,headers:{authorization:AUTH,...(o.headers||{})}});
 try{const r=await W('/api/graffiti');if(!r.ok)throw 0}catch(e){console.log('übersprungen: kein lokaler Worker (npx wrangler dev --local --port 8790 --var SITE_PASSWORD:testpw --var STATS_PASSWORD:statspw)');srv.close();return}
 /* kleine PNGs: 8 x 24 (hoch) und 24 x 8 (quer) */
 const crcT=(()=>{const t=[];for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xedb88320^(c>>>1):c>>>1;t[n]=c>>>0}return t})();const crc=b=>{let c=~0;for(const x of b)c=crcT[(c^x)&255]^(c>>>8);return (~c)>>>0};
 const chunk=(t,d)=>{const l=Buffer.alloc(4);l.writeUInt32BE(d.length);const td=Buffer.concat([Buffer.from(t),d]),c=Buffer.alloc(4);c.writeUInt32BE(crc(td));return Buffer.concat([l,td,c])};
 const png=(w,h,rgb)=>{const raw=Buffer.alloc((w*3+1)*h);for(let y=0;y<h;y++){raw[y*(w*3+1)]=0;for(let x=0;x<w;x++){const o=y*(w*3+1)+1+x*3;raw[o]=rgb[0];raw[o+1]=rgb[1];raw[o+2]=rgb[2]}}const ih=Buffer.alloc(13);ih.writeUInt32BE(w,0);ih.writeUInt32BE(h,4);ih[8]=8;ih[9]=2;return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',ih),chunk('IDAT',zlib.deflateSync(raw)),chunk('IEND',Buffer.alloc(0))])};
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'decks-')),files={'decks/hoch eins.png':png(8,24,[213,66,145]),'decks/quer_zwei.png':png(24,8,[36,153,187]),'andere/versteckt.png':png(8,8,[0,0,0])};
 let putOk=true;for(const [k,v] of Object.entries(files)){const f=path.join(dir,path.basename(k));fs.writeFileSync(f,v);const r=cp.spawnSync('npx',['wrangler','r2','object','put','designs/'+k,'--file',f,'--local'],{cwd:path.join(__dirname,'..','..','..'),encoding:'utf8'});if(r.status!==0){putOk=false;console.log('put fehlgeschlagen',k,(r.stderr||'').slice(0,200))}}
 await wait(800);
 const lst=await W('/api/designs').then(r=>r.json()).catch(()=>({decks:[]}));
 if(!putOk||!lst.decks.length){console.log('übersprungen: lokaler Worker ohne Bucket "designs" (Worker nach Änderung an wrangler.jsonc neu starten)');srv.close();return}
 console.log('Liste',JSON.stringify(lst.decks.map(d=>[d.key,d.title])),lst.decks.length===2&&!lst.decks.some(d=>/andere/.test(d.key)));
 const img=await W('/designs/'+'decks/hoch eins.png'.split('/').map(encodeURIComponent).join('/'));const ib=Buffer.from(await img.arrayBuffer());console.log('Bild',img.status,img.headers.get('content-type'),ib.length===files['decks/hoch eins.png'].length);
 const bad=await Promise.all(['../x.png','decks/x.exe','decks/%2e%2e/x.png','nix.png'].map(k=>W('/designs/'+k).then(r=>r.status)));console.log('Ungültig',JSON.stringify(bad),bad.every(s=>s===404||s===400));
 const anon=await Promise.all([fetch('http://localhost:8790/api/designs'),fetch('http://localhost:8790/designs/decks/quer_zwei.png')].map(p=>p.then(r=>r.status)));console.log('Ohne Passwort',JSON.stringify(anon),anon.every(s=>s===401));
 const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
 const ctx=await b.newContext({viewport:{width:1000,height:640}});await ctx.route(/fonts/,r=>r.abort());await ctx.route('**/api/graffiti**',r=>r.fulfill({status:404,body:''}));const p=await ctx.newPage();p.on('pageerror',e=>console.log('ERR',e.message));
 await p.goto('http://localhost:8948/?test=1');await p.waitForFunction('window.__ready',null,{timeout:120000});await p.click('#next1').then(()=>p.click('#go')).then(()=>p.click('#start'));
 await p.evaluate(()=>{const q=__qa;q.G.phase='play';q.DLG.open=false;document.getElementById('dlg').hidden=true;q.rpTab('dck');q.invToggle(true)});await wait(900);
 console.log('Rarepod Decks',JSON.stringify(await p.evaluate(()=>({karten:document.querySelectorAll('#rp-dck .dk').length,bilder:[...document.querySelectorAll('#rp-dck .dk img')].map(i=>decodeURIComponent(new URL(i.src).pathname))}))));
 await p.evaluate(()=>{document.querySelectorAll('#rp-dck .dk')[0].click()});await wait(900);
 const e1=await p.evaluate(()=>{const q=__qa;q.step(.03);const inl=q.P.av.userData.board.userData.inlay;return {key:q.DECK.key,mitBild:!!(inl.material.map&&inl.material.map.image),hochformat:inl.material.map&&inl.material.map.image.height>inl.material.map.image.width,gespeichert:localStorage.getItem('kq-deck')}});console.log('Deck gewählt',JSON.stringify(e1),e1.mitBild&&e1.hochformat);
 await p.evaluate(()=>{document.querySelectorAll('#rp-dck .dk')[1].click()});await wait(900);
 const e2=await p.evaluate(()=>{const q=__qa;q.step(.03);const m=q.P.av.userData.board.userData.inlay.material.map;return {hochformat:m&&m.image.height>m.image.width}});console.log('Querformat wird gedreht',JSON.stringify(e2),e2.hochformat);
 await p.evaluate(()=>{document.getElementById('dk-reset').click()});await wait(300);
 console.log('Standard zurück',await p.evaluate(()=>{const q=__qa;q.step(.03);return !q.P.av.userData.board.userData.inlay.material.map&&q.DECK.key===''}));
 await b.close();srv.close()})
