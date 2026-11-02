const {chromium}=require('playwright');const http=require('http'),fs=require('fs'),path=require('path');
const srv=http.createServer((q,s)=>{const u=q.url.split('?')[0];const f=u==='/'?path.join(__dirname,'..','dist/dev.html'):path.join(__dirname,'..',u);fs.readFile(f,(e,d)=>{if(e){s.writeHead(404);s.end();return}s.writeHead(200,{'content-type':f.endsWith('.js')?'text/javascript; charset=utf-8':'text/html; charset=utf-8'});s.end(d)})}).listen(8813,async()=>{
 const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
 const p=await b.newPage({viewport:{width:1100,height:620}});p.on('pageerror',e=>console.log('ERR',e.message));
 await p.route(/fonts\.(googleapis|gstatic)\.com/,r=>r.abort());
 await p.goto('http://localhost:8813/?test=1&alt=1');await p.waitForFunction('window.__ready',null,{timeout:120000});
 await p.click('#next1').then(()=>p.click('#go1')).then(()=>p.click('#start'));
 console.log('Lauf 1',JSON.stringify(await p.evaluate(()=>{const q=__qa;q.K.up=1;for(let i=0;i<160;i++)q.step(.05);const n=q.GH.rec.length;q.win();return {n,saved:!!localStorage.getItem('kq-ghost1'),t:q.G.time.toFixed(1)}})));
 console.log('Lauf 2',JSON.stringify(await p.evaluate(()=>{const q=__qa;q.beginPlay();const vis=q.GH.av&&q.GH.av.visible;q.K.up=1;q.K.left=1;for(let i=0;i<80;i++)q.step(.05);const a=q.GH.av;return {vis,ghost:[+a.position.x.toFixed(1),+a.position.z.toFixed(1)],trace:q.GH.trace[Math.floor(q.G.time/.1)].slice(0,3),player:[+q.P.x.toFixed(1),+q.P.z.toFixed(1)]}})));
 await p.evaluate(()=>{document.getElementById('ui').style.display='none';const q=__qa;const a=q.GH.av;q.cam.position.set(a.position.x-10,5,a.position.z+3);q.cam.lookAt(a.position.x,2,a.position.z);q.render()});
 await p.screenshot({path:require('os').tmpdir()+'/geist.png'});
 await b.close();srv.close()})
