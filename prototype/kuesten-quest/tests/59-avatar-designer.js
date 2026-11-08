// Avatar-Designer v0 (tools/avatar-designer): Teile mit Netz, Malen mit Spiegelung, Füllen, Aufkleber, Körperform, JSON hin und zurück, ungültige Daten werden abgelehnt.
const {chromium}=require('playwright');const http=require('http'),fs=require('fs'),path=require('path');const ROOT=path.join(__dirname,'..');
const MIME={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.otf':'font/otf'};
const srv=http.createServer((q,s)=>{const u=decodeURIComponent(q.url.split('?')[0]);const f=path.join(ROOT,u.endsWith('/')?u+'index.html':u);fs.readFile(f,(e,d)=>{if(e){s.writeHead(404);s.end();return}s.writeHead(200,{'content-type':MIME[path.extname(f)]||'application/octet-stream'});s.end(d)})}).listen(9001,async()=>{let b;try{
 b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});const p=await b.newPage({viewport:{width:1280,height:760}});p.on('pageerror',e=>console.log('ERR',e.message));
 await p.goto('http://localhost:9001/tools/avatar-designer/');await p.waitForFunction('window.__avd',null,{timeout:30000});
 const base=await p.evaluate(()=>{const a=__avd;return {teile:Object.keys(a.PARTS).join(','),palette:a.PAL.length,netz:Object.keys(a.PARTS).map(k=>a.netW(a.PARTS[k])+'x'+a.netH(a.PARTS[k])).join(' ')}});
 console.log('Teile',JSON.stringify(base),base.teile==='head,torso,arm,leg,shoe'&&base.palette===24);
 const sp=await p.evaluate(()=>{const a=__avd,k='torso',P=a.PARTS[k],W=a.netW(P);a.paintAt(k,5,6,3,true);const m=a.mirrorPx(P,5,6),pa=a.spec.paint[k];
   a.paintAt(k,2,6,9,true);const m2=a.mirrorPx(P,2,6);return {vorn:pa[6*W+5],gespiegelt:pa[m[1]*W+m[0]],m,seite:pa[6*W+2],seiteGespiegelt:pa[m2[1]*W+m2[0]],m2,ausserhalb:a.paintAt(k,0,0,3,true)}});
 console.log('Malen spiegelt',JSON.stringify(sp),sp.vorn===3&&sp.gespiegelt===3&&sp.m[0]!==5&&sp.seite===9&&sp.seiteGespiegelt===9&&sp.ausserhalb===false);
 const fl=await p.evaluate(()=>{const a=__avd,k='head',P=a.PARTS[k],W=a.netW(P);a.fillAt(k,10,12,5,false);const pa=a.spec.paint[k];let n=0;for(let y=8;y<16;y++)for(let x=8;x<16;x++)if(pa[y*W+x]===5)n++;return {vorderseite:n,fremdeFlaeche:pa[4*W+10]}});
 console.log('Füllen bleibt in der Fläche',JSON.stringify(fl),fl.vorderseite===64&&fl.fremdeFlaeche===0);
 const dc=await p.evaluate(()=>{const a=__avd,ok=a.stamp('head',8,8,'Stern',2,true),nok=a.stamp('head',14,14,'Stern',2,false);return {ok,nok,n:a.spec.decals.length,gespiegelt:a.spec.decals.some(d=>d.flip)}});
 console.log('Aufkleber',JSON.stringify(dc),dc.ok&&!dc.nok&&dc.n>=1);
 const rt=await p.evaluate(()=>{const a=__avd;const j=a.toJSON();a.fromJSON(j);return {gleich:a.toJSON()===j,bytes:j.length,breit:(()=>{a.spec.body.width=1.2;return a.toJSON().includes('"width":1.2')})()}});
 console.log('JSON hin und zurück',JSON.stringify(rt),rt.gleich&&rt.bytes<20000);
 const bad=await p.evaluate(()=>{const a=__avd,res=[];for(const t of ['{}','{"v":2}','{"v":1,"species":"canid"}','nicht json']){try{a.fromJSON(t);res.push(false)}catch(e){res.push(true)}}
   a.fromJSON(JSON.stringify({v:1,species:'humanoid',body:{height:99,width:-3},zones:{skin:999},paint:{torso:[7,7]},decals:[{part:'x',x:0,y:0,id:'Stern',c:1},{part:'head',x:9,y:9,id:'Gift',c:1}]}));
   const s=a.spec;return {abgelehnt:res.every(Boolean),hoeheGekappt:s.body.height<=1.6,breiteGekappt:s.body.width>=.5,zoneOk:s.zones.skin===14,paintOk:s.paint.torso.every(v=>v===0),decalsLeer:s.decals.length===0}});
 console.log('Ungültige Daten',JSON.stringify(bad),Object.values(bad).every(Boolean));
 await p.evaluate(()=>{const a=__avd;a.fromJSON(JSON.stringify({v:1,species:'humanoid',body:{height:1,width:1,limb:1,head:1},zones:{skin:14,top:6,bottom:16,shoes:4},paint:{},decals:[]}));a.setCur('torso');for(let y=6;y<18;y+=2)for(let x=4;x<12;x++)a.paintAt('torso',x,y,x%2?3:5,true);a.stamp('head',8,8,'Lächeln',1,true);a.stamp('torso',5,7,'Stern',5,true);a.refresh()});
 await p.waitForTimeout(500);await p.screenshot({path:require('os').tmpdir()+'/avatar-designer.png'});
 const px=await p.evaluate(()=>{const c=document.querySelector('#view canvas'),g=document.createElement('canvas');g.width=c.width;g.height=c.height;const x=g.getContext('2d');x.drawImage(c,0,0);const d=x.getImageData(0,0,g.width,g.height).data;let v=0;for(let i=0;i<d.length;i+=4)if(d[i]>d[i+1]+40&&d[i+2]>d[i+1]+20)v++;return v});
 console.log('Vorschau zeigt rosa Pixel',px,px>100);
 }catch(e){console.log('FEHLER',e.message)}try{await b.close()}catch(e){}srv.close()});
