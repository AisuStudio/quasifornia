// Skin-Editor: Teile kaufen, anlegen, ablegen.
const {chromium}=require('playwright');const http=require('http'),fs=require('fs'),path=require('path');
const srv=http.createServer((q,s)=>{const u=q.url.split('?')[0];const f=u==='/'?path.join(__dirname,'..','dist/dev.html'):path.join(__dirname,'..',u);fs.readFile(f,(e,d)=>{if(e){s.writeHead(404);s.end();return}s.writeHead(200,{'content-type':f.endsWith('.js')?'text/javascript; charset=utf-8':'text/html; charset=utf-8'});s.end(d)})}).listen(8822,async()=>{
 const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
 const p=await b.newPage({viewport:{width:1100,height:700}});p.on('pageerror',e=>console.log('ERR',e.message));
 await p.route(/fonts\.(googleapis|gstatic)\.com/,r=>r.abort());
 await p.goto('http://localhost:8822/?test=1');await p.waitForFunction('window.__ready',null,{timeout:120000});await p.click('#next1').then(()=>p.click('#go')).then(()=>p.click('#start'));
 const tori=()=>p.evaluate(()=>{let n=0;__qa.P.av.traverse(o=>{if(o.isMesh&&o.geometry.type==='TorusGeometry')n++});return n});
 const t0=await tori();console.log('Torus vorher',t0);
 console.log('Kaufen XXL-Kette',JSON.stringify(await p.evaluate(()=>{const r=__qa.edBuy('chain4');return {r,n:__qa.SC.n}})));
 console.log('Zu wenig',JSON.stringify(await p.evaluate(()=>{__qa.SC.n=2;const r=__qa.edBuy('hcrown');return {r,own:__qa.ED.owned.has('hcrown')}})));
 await p.evaluate(()=>{__qa.SC.n=40;__qa.edToggle('chain4');__qa.edBuy('hcrown');__qa.edToggle('hcrown');__qa.edBuy('gheart');__qa.edToggle('gheart');__qa.edBuy('pice');__qa.edToggle('pice')});
 console.log('Angelegt',JSON.stringify(await p.evaluate(()=>({on:__qa.ED.on,ovr:__qa.ACC_OVR}))),'Torus nachher',await tori());
 console.log('Farben',JSON.stringify(await p.evaluate(()=>{const q=__qa;q.SC.n=30;const a=q.edColor('skin','#8a5a3c');const n0=q.SC.n;const b=q.edColor('top','#47c2a5');const n1=q.SC.n;const c=q.edColor('bot','#f0cf36');return {a,b,c,kosten:n0-n1,n:q.SC.n,ovr:q.PRE_OVR}})));
 await p.keyboard.press('i');await p.waitForTimeout(250);await p.click('#rp-tabs button[data-t=edi]');await p.waitForTimeout(500);await p.screenshot({path:require('os').tmpdir()+'/editor.png'});
 await p.evaluate(()=>__qa.edToggle('chain4'));console.log('Abgelegt Torus',await tori(),JSON.stringify(await p.evaluate(()=>__qa.ACC_OVR)));
 console.log('gespeichert',await p.evaluate(()=>localStorage.getItem('kq-edit')));
 await b.close();srv.close()})
