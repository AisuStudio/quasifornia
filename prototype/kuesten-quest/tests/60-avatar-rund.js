// Avatar-Designer, Rund-Modus und Rahmen mit Reitern: vier Vorlagen als Daten, Gelenknamen wie im Spiel, Zubehör an Ankern, Farben, Regler, JSON, Reiter.
const {chromium}=require('playwright');const http=require('http'),fs=require('fs'),path=require('path');const ROOT=path.join(__dirname,'..');
const MIME={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.otf':'font/otf'};
const srv=http.createServer((q,s)=>{const u=decodeURIComponent(q.url.split('?')[0]);const f=path.join(ROOT,u.endsWith('/')?u+'index.html':u);fs.readFile(f,(e,d)=>{if(e){s.writeHead(404);s.end();return}s.writeHead(200,{'content-type':MIME[path.extname(f)]||'application/octet-stream'});s.end(d)})}).listen(9002,async()=>{let b;try{
 b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});const p=await b.newPage({viewport:{width:1280,height:760}});p.on('pageerror',e=>console.log('ERR',e.message));
 await p.goto('http://localhost:9002/tools/avatar-designer/round.html');await p.waitForFunction('window.__rnd',null,{timeout:30000});
 const base=await p.evaluate(()=>{const r=__rnd,out={};for(const k of Object.keys(r.PRESETS)){r.setPreset(k);const j=r.av.userData.joints;let n=0;r.av.traverse(o=>{if(o.isMesh&&!o.userData.outline)n++});out[k]={meshes:n,gelenke:Object.keys(j).sort().join(','),zwei:j.thigh.length===2&&j.shoulder.length===2&&j.elbow.length===2&&j.foot.length===2}}return out});
 const ks=Object.keys(base),gl=new Set(ks.map(k=>base[k].gelenke));
 console.log('Vier Vorlagen',JSON.stringify(Object.fromEntries(ks.map(k=>[k,base[k].meshes]))),ks.length===4&&gl.size===1&&ks.every(k=>base[k].zwei&&base[k].meshes>40)&&[...gl][0]==='elbow,foot,head,hips,shin,shoulder,thigh,torso');
 const ac=await p.evaluate(()=>{const r=__rnd,n=()=>{let c=0;r.av.traverse(o=>{if(o.isMesh&&!o.userData.outline)c++});return c};r.setPreset('pink');const a0=n();
   document.getElementById('a-pack').checked=false;document.getElementById('a-pack').dispatchEvent(new Event('change'));const a1=n();
   document.getElementById('a-hair').value='puff';document.getElementById('a-hair').dispatchEvent(new Event('change'));const a2=n();
   document.getElementById('a-chain').checked=true;document.getElementById('a-chain').dispatchEvent(new Event('change'));const a3=n();return {a0,a1,a2,a3,hair:r.spec.acc.hair}});
 console.log('Zubehör an Ankern',JSON.stringify(ac),ac.a1<ac.a0&&ac.a3>ac.a2&&ac.hair==='puff');
 const col=await p.evaluate(()=>{const r=__rnd;r.setPreset('pink');const i=document.getElementById('z-top');i.value='#00ff88';i.dispatchEvent(new Event('input'));let found=0;r.av.traverse(o=>{if(o.isMesh&&!o.userData.outline&&o.material.color&&o.material.color.getHexString()==='00ff88')found++});return {found,spec:r.spec.slots.top}});
 console.log('Farbzone wirkt',JSON.stringify(col),col.found>3&&col.spec==='#00ff88');
 const bd=await p.evaluate(()=>{const r=__rnd;r.setPreset('pink');const s0=r.av.scale.x;const i=document.getElementById('s-size');i.value=1.2;i.dispatchEvent(new Event('input'));const s1=r.av.scale.x;const h=document.getElementById('s-head');h.value=1.3;h.dispatchEvent(new Event('input'));return {s0:+s0.toFixed(3),s1:+s1.toFixed(3),kopf:+r.av.userData.joints.head.scale.x.toFixed(2)}});
 console.log('Regler',JSON.stringify(bd),Math.abs(bd.s1/bd.s0-1.2)<.01&&bd.kopf===1.3);
 const js=await p.evaluate(()=>{const r=__rnd;r.setPreset('blau');const j=r.toJSON();r.setPreset('gelb');r.fromJSON(j);const same=r.toJSON()===j;const bad=[];for(const t of ['{}','{"v":1}','{"v":2,"species":"canid"}','kein json']){try{r.fromJSON(t);bad.push(false)}catch(e){bad.push(true)}}
   r.fromJSON(JSON.stringify({v:2,species:'humanoid',name:'x'.repeat(200),body:{size:99,head:-5},slots:{top:'rot',skin:'#112233',evil:'#ffffff'},acc:{hair:'laser',pack:1,phones:'ja'}}));const s=r.spec;
   return {same,bytes:j.length,abgelehnt:bad.every(Boolean),size:s.body.size,head:s.body.head,top:s.slots.top,skin:s.slots.skin,fremd:'evil' in s.slots,hair:s.acc.hair,name:s.name.length}});
 console.log('JSON',JSON.stringify(js),js.same&&js.bytes<2000&&js.abgelehnt&&js.size<=1.5&&js.head>=.6&&js.top==='#d54291'&&js.skin==='#112233'&&!js.fremd&&js.hair==='none'&&js.name<=40);

 const ps=await p.evaluate(async()=>{const r=__rnd,T=r.THREE,minY=()=>{const bb=new T.Box3();r.av.updateMatrixWorld(true);r.av.traverse(o=>{if(o.isMesh&&!o.userData.outline){const b=new T.Box3().setFromObject(o);bb.union(b)}});return bb.min.y};
   r.setPreset('pink');const sk=minY();r.setPose('stand');const st=minY();const stBoard=(()=>{let n=0;r.av.traverse(o=>{if(o.isMesh&&o.geometry&&o.geometry.type==='BoxGeometry'&&o.scale.z>1.2)n++});return n})();
   r.setPose('walk');r.applyPose(0);const j=r.av.userData.joints,a=j.thigh[0].rotation.x;r.applyPose(.25);const b=j.thigh[0].rotation.x;const opp=j.thigh[1].rotation.x;r.applyPose(0.25);
   r.setPose('stand');const L=document.getElementById('s-legs');L.value=1.2;L.dispatchEvent(new Event('input'));const st2=minY();
   return {skate:+sk.toFixed(3),stehen:+st.toFixed(3),stehenLang:+st2.toFixed(3),brett:stBoard,schritt:[+a.toFixed(2),+b.toFixed(2)],gegenlaeufig:Math.abs(b+opp)<1e-6}});
 console.log('Posen',JSON.stringify(ps),Math.abs(ps.stehen)<.03&&Math.abs(ps.stehenLang)<.03&&ps.brett===0&&Math.abs(ps.schritt[0]-ps.schritt[1])>.3&&ps.gegenlaeufig);
 const hip=await p.evaluate(()=>{const r=__rnd;r.setPose('skate');r.setPreset('pink');const pel=()=>{let m=null;r.av.userData.joints.hips.children.forEach(o=>{if(o.isMesh&&Math.abs(o.scale.x-.19*r.spec.body.hipW)<1e-6)m=o});return m};
   const p0=pel().scale.y;const i=document.getElementById('s-hipDip');i.value=.08;i.dispatchEvent(new Event('input'));const p1=pel().scale.y;const w=document.getElementById('s-hipW');w.value=1.2;w.dispatchEvent(new Event('input'));const wide=pel().scale.x;
   r.fromJSON(JSON.stringify({v:2,species:'humanoid',name:'t',body:{hipDip:5,hipW:0,thighTop:99},slots:{},acc:{}}));return {p0:+p0.toFixed(3),p1:+p1.toFixed(3),wide:+wide.toFixed(3),klemmDip:r.spec.body.hipDip,klemmW:r.spec.body.hipW,klemmT:r.spec.body.thighTop}});
 console.log('Hüftregler',JSON.stringify(hip),hip.p1>hip.p0&&Math.abs(hip.wide-.228)<.005&&hip.klemmDip===.12&&hip.klemmW===.7&&hip.klemmT===1.4);
 await p.goto('http://localhost:9002/tools/avatar-designer/');await p.waitForSelector('[role=tab]');
 const tb=await p.evaluate(()=>({tabs:[...document.querySelectorAll('[role=tab]')].map(b=>b.textContent),avatarAktiv:document.querySelector('[role=tab][aria-selected=true]').textContent}));
 await p.click('[role=tab][data-id=bau]');const bau=await p.evaluate(()=>({text:document.getElementById('soon').textContent,sub:getComputedStyle(document.getElementById('sub')).display,frames:[...document.querySelectorAll('iframe')].map(f=>getComputedStyle(f).display)}));
 await p.click('[role=tab][data-id=avatar]');const av=await p.evaluate(()=>({sub:getComputedStyle(document.getElementById('sub')).display,rund:getComputedStyle(document.getElementById('f-round')).display}));
 await p.click('#s-pixel');const px=await p.evaluate(()=>({pixel:getComputedStyle(document.getElementById('f-pixel')).display,rund:getComputedStyle(document.getElementById('f-round')).display}));
 console.log('Reiter',JSON.stringify({tb,bau:bau.text.slice(0,40),bauSub:bau.sub,bauFrames:bau.frames,av,px}),tb.tabs.length===6&&tb.avatarAktiv==='Avatar'&&/bald/.test(bau.text)&&bau.sub==='none'&&bau.frames.every(d=>d==='none')&&av.sub==='flex'&&av.rund==='block'&&px.pixel==='block'&&px.rund==='none');
 }catch(e){console.log('FEHLER',e.message)}try{await b.close()}catch(e){}srv.close()});
