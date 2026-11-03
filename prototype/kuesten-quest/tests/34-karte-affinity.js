// Karte aus Affinity (map.svg): neue Gebäude, Leuchtturm/Tarxarox, Bänke, Palmen, Hafenmauer, Serafin-Quest bis zum Turm.
const {chromium}=require('playwright');const http=require('http'),fs=require('fs'),path=require('path');
const srv=http.createServer((q,s)=>{const u=q.url.split('?')[0];const f=u==='/'?path.join(__dirname,'..','dist/dev.html'):path.join(__dirname,'..',u);fs.readFile(f,(e,d)=>{if(e){s.writeHead(404);s.end();return}s.writeHead(200,{'content-type':f.endsWith('.js')?'text/javascript; charset=utf-8':'text/html; charset=utf-8'});s.end(d)})}).listen(8912,async()=>{
 const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
 const p=await b.newPage();p.on('pageerror',e=>console.log('ERR',e.message));
 await p.route(/fonts\.(googleapis|gstatic)\.com/,r=>r.abort());await p.route('**/api/graffiti**',r=>r.fulfill({status:404,body:''}));
 await p.goto('http://localhost:8912/?test=1');await p.waitForFunction('window.__ready',null,{timeout:120000});
 await p.evaluate(()=>{localStorage.clear();const q=__qa;q.applyLevel(0);q.beginPlay();q.G.phase='play'});
 const r=await p.evaluate(()=>{const q=__qa,H=q.HUB,out={};
  const kinds={};H.marks.forEach(m=>kinds[m.kind]=(kinds[m.kind]||0)+1);out.gebaeudeArten=kinds;out.beschriftungenOhneGebaeude=H.labelWarn;
  out.polizeiStation=!!H.policeStation;out.polizeiStart=q.POL?'bereit':null;
  out.bänke=H.benches.length;out.palmenGezeichnet=H.drawnPalms;out.mauerStuecke=H.walls.length;
  const w=H.walls[0];out.mauerBlockiert=!q.mpWalk(w.x,w.z);
  const L=H.lighthouse,T=H.uw.tower;out.leuchtturm={da:!!L,turmGleicheStelle:Math.hypot(L.x-T.x,L.z-T.z)<.01,sockelBlockiert:!q.mpWalk(L.x+2,L.z)};
  q.step(.05);out.leuchtturmOben=L.g.visible;q.underApply(true);q.step(.05);out.leuchtturmUnten=L.g.visible;q.underApply(false);q.step(.05);
  /* Strahl nur nachts */
  q.DAY.t=.7*1800;q.DAY.dn=0;for(let i=0;i<3;i++)q.step(.05);out.strahlNachts=L.beam.visible;q.DAY.t=40;for(let i=0;i<3;i++)q.step(.05);out.strahlTags=L.beam.visible;
  /* Serafin-Quest: von der Leiter zum Turm kommen, Aufzug-Aktion am Turm */
  const U=H.uw;const st=[Math.round(U.bx),Math.round(U.bz+3)],goal=[T.x,T.z-9];const key=(x,z)=>x+','+z,seen=new Set([key(...st)]),qq=[st];let ok=false;
  while(qq.length&&!ok){const [x,z]=qq.shift();if(Math.hypot(x-goal[0],z-goal[1])<3){ok=true;break}for(const [dx,dz] of [[2,0],[-2,0],[0,2],[0,-2]]){const nx=x+dx,nz=z+dz,k=key(nx,nz);if(seen.has(k)||!q.mpWalk(nx,nz))continue;seen.add(k);qq.push([nx,nz])}}
  out.leiterZumTurm=ok;
  q.bqReset&&q.bqReset();q.BQ.gave=true;q.BQ.released=false;q.underApply(true);q.G.phase='play';q.P.x=T.x;q.P.z=T.z-9;q.P.speed=0;q.step(.05);
  out.aufzugAktion=q.curActs().some(a=>/Aufzug hinauf/.test(a.label));
  return out});
 console.log(JSON.stringify(r,null,1));
 await b.close();srv.close()})
