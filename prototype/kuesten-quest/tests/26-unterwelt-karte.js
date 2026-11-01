// Unterwelt-Minikarte: Leiter immer, Turm erst nach Serafins Scoops.
const {chromium}=require('playwright');const http=require('http'),fs=require('fs'),path=require('path');
const srv=http.createServer((q,s)=>{const u=q.url.split('?')[0];const f=u==='/'?path.join(__dirname,'..','dist/dev.html'):path.join(__dirname,'..',u);fs.readFile(f,(e,d)=>{if(e){s.writeHead(404);s.end();return}s.writeHead(200,{'content-type':f.endsWith('.js')?'text/javascript; charset=utf-8':'text/html; charset=utf-8'});s.end(d)})}).listen(8854,async()=>{
 const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
 const p=await b.newPage({viewport:{width:1100,height:700}});p.on('pageerror',e=>console.log('ERR',e.message));
 await p.route(/fonts\.(googleapis|gstatic)\.com/,r=>r.abort());
 await p.goto('http://localhost:8854/?test=1');await p.waitForFunction('window.__ready',null,{timeout:120000});await p.click('#next1').then(()=>p.click('#go')).then(()=>p.click('#start'));
 const mini=async n=>{await p.evaluate(()=>{const q=__qa;q.G.phase='play';for(let i=0;i<12;i++)q.step(.05)});const d=await p.evaluate(()=>document.getElementById('mini').toDataURL('image/png'));fs.writeFileSync(require('os').tmpdir()+'/'+n+'.png',Buffer.from(d.split(',')[1],'base64'))};
 await p.evaluate(()=>{const q=__qa;q.bqReset&&q.bqReset();q.G.phase='play';q.underApply(true);q.P.x=-134;q.P.z=119;q.P.speed=0});
 await mini('mini_vorher');
 await p.evaluate(()=>{const q=__qa;q.BQ.gave=true;q.BQ.released=false});await mini('mini_nachher');
 await p.evaluate(()=>{const q=__qa;q.P.x=20;q.P.z=40});await mini('mini_unterwegs');
 console.log('sichtbar',await p.evaluate(()=>document.getElementById('mini').classList.contains('on')));
 await b.close();srv.close()})
