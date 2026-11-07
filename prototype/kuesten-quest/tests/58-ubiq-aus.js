// UBIQ ist per Schalter aus: ohne ?ubiq=1 keine Dose im Laden, kein Rarepod-Eintrag, keine Glitches, keine Aktion, kein Kauf. Mit ?ubiq=1 ist alles wieder da.
const {chromium}=require('playwright');const http=require('http'),fs=require('fs'),path=require('path');const ROOT=path.join(__dirname,'..');
const srv=http.createServer((q,s)=>{const u=q.url.split('?')[0];const f=u==='/'?path.join(ROOT,'dist/dev.html'):path.join(ROOT,u);fs.readFile(f,(e,d)=>{if(e){s.writeHead(404);s.end();return}s.writeHead(200,{'content-type':f.endsWith('.js')?'text/javascript; charset=utf-8':'text/html; charset=utf-8'});s.end(d)})}).listen(8999,async()=>{let b;try{
 b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
 const probe=async(qs)=>{const p=await b.newPage({viewport:{width:900,height:560}});p.on('pageerror',e=>console.log('ERR',e.message));await p.route(/fonts/,r=>r.abort());await p.route('**/api/**',r=>r.fulfill({status:404,body:''}));
  await p.goto('http://localhost:8999/?test=1'+qs);await p.waitForFunction('window.__ready',null,{timeout:120000});await p.click('#next1').then(()=>p.click('#go')).then(()=>p.click('#start'));
  await p.evaluate(()=>{const q=__qa;q.G.phase='play';q.DLG.open=false;document.getElementById('dlg').hidden=true});
  const r=await p.evaluate(()=>{const q=__qa;q.UBQ.own=true;q.UBQ.ch=3;q.SC.n=100;q.SHOP.in=true;const a=[];q.ubiqActs(a);const bought=q.ubqBuy();
   return {glitches:q.UBQ.list.length,shop:q.ubqShopHTML().length,inv:q.ubqInvHTML().length,acts:a.length,kauf:bought}});
  await p.close();return r};
 const aus=await probe(''),an=await probe('&ubiq=1');
 console.log('UBIQ aus',JSON.stringify(aus),aus.glitches===0&&aus.shop===0&&aus.inv===0&&aus.acts===0&&aus.kauf===false);
 console.log('UBIQ an (?ubiq=1)',JSON.stringify(an),an.glitches>0&&an.shop>0&&an.inv>0);
 }catch(e){console.log('FEHLER',e.message)}try{await b.close()}catch(e){}srv.close()});
