// Sprühdosen: Form aus der Vorlage (Höhe zu Breite wie PHs_can.svg), Aufdruck aus SVG-Texturen, Farbmarke je Farbe, UBIQ mit Schriftzug, Regal im A-Mart.
const {chromium}=require('playwright');const http=require('http'),fs=require('fs'),path=require('path');const ROOT=path.join(__dirname,'..');
const srv=http.createServer((q,s)=>{const u=q.url.split('?')[0];const f=u==='/'?path.join(ROOT,'dist/dev.html'):path.join(ROOT,u);fs.readFile(f,(e,d)=>{if(e){s.writeHead(404);s.end();return}s.writeHead(200,{'content-type':f.endsWith('.js')?'text/javascript; charset=utf-8':'text/html; charset=utf-8'});s.end(d)})}).listen(8968,async()=>{let b;try{
 b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});const p=await b.newPage({viewport:{width:900,height:560}});p.on('pageerror',e=>console.log('ERR',e.message));await p.route(/fonts/,r=>r.abort());await p.route('**/api/**',r=>r.fulfill({status:404,body:''}));
 await p.goto('http://localhost:8968/?test=1');await p.waitForFunction('window.__ready',null,{timeout:120000});await p.click('#next1').then(()=>p.click('#go')).then(()=>p.click('#start'));
 await p.evaluate(()=>{const q=__qa;q.G.phase='play';q.DLG.open=false;document.getElementById('dlg').hidden=true});
 const f=await p.evaluate(()=>{const q=__qa,c=q.makeSprayCan('farbe','#4cc3ff',256),a=q.makeSprayCan('farbe','#4cc3ff',256),d=q.makeSprayCan('farbe','#ff5fa8',256),u=q.makeSprayCan('ubiq',null,256);
  const body=c.children[0].geometry,act=c.children[3].geometry;body.computeBoundingBox();act.computeBoundingBox();const duese=c.children[3].material.color.getHexString(),dueseUbiq=u.children[3].material.color.getHexString(),dueseHell=q.makeSprayCan('farbe','#eae8e8',256).children[4].material.color.getHexString();const band=c.children[1].geometry;band.computeBoundingBox();const bandRund=band.boundingBox.max.x>0&&band.boundingBox.min.x<0&&band.boundingBox.max.z>0&&band.boundingBox.min.z<0;const bb=body.boundingBox,h=Math.max(bb.max.y,act.boundingBox.max.y)-bb.min.y,w=bb.max.x-bb.min.x;
  return {teile:c.children.length,h:+h.toFixed(3),w:+w.toFixed(3),verh:+(h/w).toFixed(2),bandRund,duese,dueseUbiq,dueseHell,gleichesMaterial:c.children[2].material===a.children[2].material,andereFarbe:c.children[2].material!==d.children[2].material,ubiqEigen:u.children[2].material!==c.children[2].material,spray:c.userData.spray===true,kinds:[c.userData.kind,u.userData.kind]}});
 console.log('Dose gebaut',JSON.stringify(f),f.teile===6&&f.h>.78&&f.h<.82&&f.verh>2.4&&f.verh<2.8&&f.spray&&f.bandRund&&f.duese==='4cc3ff'&&f.dueseUbiq==='231f20'&&f.dueseHell==='231f20');
 console.log('Material je Farbe geteilt, UBIQ eigenes',f.gleichesMaterial&&f.andereFarbe&&f.ubiqEigen&&f.kinds[0]==='farbe'&&f.kinds[1]==='ubiq');
 await p.waitForFunction(()=>__qa.DOSE.pending===0,null,{timeout:15000}).catch(()=>{});
 const t=await p.evaluate(()=>{const q=__qa,out={};for(const k of Object.keys(q.DOSE.tex)){const cv=q.DOSE.tex[k].image,g=cv.getContext('2d'),d=g.getImageData(0,0,cv.width,cv.height).data;let weiss=0,rot=0,farbig=0;for(let i=0;i<d.length;i+=4){if(d[i]>230&&d[i+1]>230&&d[i+2]>230)weiss++;if(d[i]>200&&d[i+1]<80&&d[i+2]<80)rot++;if(k!=='ubiq'&&Math.abs(d[i]-76)<12&&Math.abs(d[i+1]-195)<12&&Math.abs(d[i+2]-255)<12)farbig++}out[k]={w:cv.width,h:cv.height,weiss,rot,farbig}}return {out,pending:q.DOSE.pending}});
 const ks=Object.keys(t.out);const fk=ks.find(k=>k.includes('#4cc3ff')),uk='ubiq';
 console.log('Texturen geladen',JSON.stringify(t.out),t.pending===0&&t.out[fk].rot>200&&t.out[fk].farbig>200&&t.out[fk].weiss>200&&t.out[uk].weiss>t.out[fk].weiss*0.5&&t.out[uk].rot>100);
 await p.evaluate(()=>{__qa.pmartEnter()});await p.waitForTimeout(200);
 const r=await p.evaluate(()=>{const q=__qa;let n=0;q.sc.traverse(o=>{if(o.userData&&o.userData.spray&&o.parent&&o.parent.visible!==false)n++});return {regal:q.L7.items.cans,dosen:n}});
 console.log('Regal im A-Mart voller Sprühdosen',JSON.stringify(r),r.regal===48&&r.dosen>=48);
 /* Rarepod-Symbole: Dose aus der Vorlage mit Füllstand */
 const ic=await p.evaluate(async()=>{const q=__qa,h=q.grafCanSvg('#ff5fa8',.5),u=q.ubqCanSvg(.6),url=x=>(x.match(/src="([^"]+)"/)||[])[1];
   const px=async(src,w,hh)=>{const im=new Image();await new Promise((r,j)=>{im.onload=r;im.onerror=j;im.src=src});const c=document.createElement('canvas');c.width=w;c.height=hh;const g=c.getContext('2d');g.drawImage(im,0,0,w,hh);return g.getImageData(0,0,w,hh).data};
   const d1=await px(url(h),192,376),d2=await px(url(u),192,376);let rosa=0,gaugeRosa=0,cyan=0,weiss=0,rot=0;
   for(let y=0;y<376;y++)for(let x=0;x<192;x++){const i=(y*192+x)*4,r=d1[i],g=d1[i+1],b=d1[i+2];if(Math.abs(r-255)<25&&Math.abs(g-95)<30&&Math.abs(b-168)<30){rosa++;if(x>150)gaugeRosa++}if(r>240&&g>240&&b>240)weiss++;if(r>200&&g<70&&b<70)rot++;
     const j=i,r2=d2[j],g2=d2[j+1],b2=d2[j+2];if(x>150&&Math.abs(r2-123)<25&&Math.abs(g2-224)<25&&Math.abs(b2-224)<25)cyan++}
   return {img:h.startsWith('<img')&&u.startsWith('<img'),blob:url(h).startsWith('blob:'),rosa,gaugeRosa,cyan,weiss,rot,gleich:q.grafCanSvg('#ff5fa8',.5)===h}});
 console.log('Rarepod-Symbole als Bild',JSON.stringify(ic),ic.img&&ic.blob&&ic.rosa>300&&ic.gaugeRosa>100&&ic.cyan>100&&ic.rot>300&&ic.gleich);
 }catch(e){console.log('FEHLER',e.message)}try{await b.close()}catch(e){}srv.close()});
