/* ================= Graffiti: Sprühdosen und 2D-Paint-Editor ================= */
/* Dosen kauft man im P-Mart (Scoops). Die Graffiti-Wände stehen an der Mauer. Der Editor hat eine feste Auflösung (128 x 64) und nur Dosenfarben als Palette.
   Das Bild bleibt, bis man (später: jemand anderes) drüber sprüht. Es wird im Browser gespeichert. */
const GFK='kq-cans',GFT='kq-graf-total',GF_COL=[['#2de0d0','Türkis'],['#ee7cb8','Pink'],['#ffe066','Gelb'],['#ff7a1a','Orange'],['#ffffff','Weiß'],['#1a1626','Schwarz']],GF_PRICE=2,GF_INK=2400,GF_W=128,GF_H=64;
const GF={cans:{},total:0,cur:null,col:null,size:4,open:false,undo:[],down:false,lx:0,ly:0,dabs:0};
try{const s=JSON.parse(localStorage.getItem(GFK)||'{}');GF_COL.forEach(([c])=>{GF.cans[c]=Math.max(0,s[c]|0)});GF.total=parseInt(localStorage.getItem(GFT)||'0')|0}catch(e){GF_COL.forEach(([c])=>GF.cans[c]=0)}
function grafSave(){try{localStorage.setItem(GFK,JSON.stringify(GF.cans));localStorage.setItem(GFT,String(GF.total))}catch(e){}}
function grafBuy(c){if(!scCan(GF_PRICE)){toast('Zu wenig Scoops: '+GF_PRICE+' nötig',1500);return false}
  const nm=(GF_COL.find(x=>x[0]===c)||[0,'Farbe'])[1];GF.cans[c]=(GF.cans[c]||0)+GF_INK;grafSave();scAdd(-GF_PRICE,'Sprühdose '+nm);toast('Sprühdose '+nm+' gekauft',1200);return true}

/* Sprühdosen im Inventar: Dose in der Farbe, die Füllung zeigt den Rest */
function grafCanSvg(c,f){const h=36*Math.max(0,Math.min(1,f)),y=14+36-h;return `<svg viewBox="0 0 40 56" width="44" height="56" aria-hidden="true"><rect x="15" y="1" width="10" height="5" rx="1.5" fill="#cfcfe0" stroke="#0e0b18" stroke-width="1.5"/><rect x="17" y="6" width="6" height="4" fill="#8a8aa0" stroke="#0e0b18" stroke-width="1.2"/><rect x="9" y="10" width="22" height="42" rx="5" fill="#3a3a50" stroke="#0e0b18" stroke-width="2"/><clipPath id="gc${c.slice(1)}"><rect x="9" y="10" width="22" height="42" rx="5"/></clipPath><rect x="9" y="${y.toFixed(1)}" width="22" height="${(h+2).toFixed(1)}" fill="${c}" clip-path="url(#gc${c.slice(1)})"/><rect x="9" y="10" width="22" height="42" rx="5" fill="none" stroke="#0e0b18" stroke-width="2"/><rect x="12" y="14" width="3" height="30" rx="1.5" fill="#ffffff" opacity=".28"/></svg>`}
function grafInvHTML(){const have=GF_COL.filter(([c])=>(GF.cans[c]||0)>0);
  if(!have.length)return '<div class="slot-i"><div class="ic q">?</div><b>Sprühdosen</b><span>Noch keine. Im P-Mart gibt es Dosen für '+GF_PRICE+' Scoops.</span></div>';
  return have.map(([c,n])=>{const f=GF.cans[c]/GF_INK;return `<div class="slot-i got"><div class="ic">${grafCanSvg(c,f)}</div><b>Sprühdose ${n}</b><span>Farbe: ${Math.max(1,Math.round(f*100))}%</span><em>Wand besprühen (Enter an einer Graffiti-Wand)</em></div>`}).join('')}
function grafShopHTML(){return '<h3 class="edh">Sprühdosen</h3><p class="sub">Eine Dose kostet '+GF_PRICE+' Scoops und reicht für ein großes Bild. Sprüh an den Graffiti-Wänden an der Mauer von Port Lupo (Aktion: Wand besprühen).</p><div class="skgrid">'+GF_COL.map(([c,n])=>{const ink=GF.cans[c]||0;
  return `<div class="sk"><i style="background:${c}"></i><b>${n}</b><span>${ink>0?'Farbe: '+Math.round(ink/GF_INK*100)+'%':'leer'}</span><button type="button" data-can="${c}"${scCan(GF_PRICE)&&SHOP.in?'':' disabled'}>${ink>0?'Nachfüllen':'Kaufen'} (${GF_PRICE})</button></div>`}).join('')+'</div>'}
function grafLoadPanel(p){try{const d=localStorage.getItem('kq-graf-'+p.id);if(!d)return;const im=new Image();im.onload=()=>{p.ctx.drawImage(im,0,0);p.tex.needsUpdate=true};im.src=d}catch(e){}}
function grafOpen(p){if(!p||GF.open)return;const have=GF_COL.some(([c])=>GF.cans[c]>0);
  if(!have)return dlgStart('',['Eine leere Wand wartet auf dich. Zum Sprühen brauchst du eine Dose.','Im P-Mart (blaues Band, auf der Minikarte als P) gibt es Sprühdosen für '+GF_PRICE+' Scoops.']);
  GF.cur=p;GF.open=true;GFOPEN=true;K.up=K.down=K.left=K.right=0;GF.dabs=0;GF.undo=[];
  const cv=$('graf-cv'),cx=cv.getContext('2d');cx.imageSmoothingEnabled=false;cx.clearRect(0,0,GF_W,GF_H);cx.drawImage(p.cv,0,0);
  GF.col=(GF_COL.find(([c])=>GF.cans[c]>0)||GF_COL[0])[0];$('graf').hidden=false;grafPal();$('graf-done').focus({preventScroll:true})}
function grafPal(){const pal=$('graf-pal');pal.innerHTML=GF_COL.map(([c,n])=>{const ink=GF.cans[c]||0;return `<button type="button" class="gpal${c===GF.col?' on':''}${ink>0?'':' empty'}" data-c="${c}" style="--c:${c}" title="${n}"><i style="width:${Math.round(Math.min(1,ink/GF_INK)*100)}%"></i></button>`}).join('');
  pal.querySelectorAll('button').forEach(b=>b.onclick=()=>{if((GF.cans[b.dataset.c]||0)<=0){toast('Diese Dose ist leer. Im Laden nachfüllen.',1200);return}GF.col=b.dataset.c;grafPal()})}
function grafClose(save){if(!GF.open)return;const p=GF.cur;
  if(save&&p){p.ctx.clearRect(0,0,GF_W,GF_H);p.ctx.drawImage($('graf-cv'),0,0);p.tex.needsUpdate=true;try{localStorage.setItem('kq-graf-'+p.id,p.cv.toDataURL('image/png'))}catch(e){}
    GF.total+=GF.dabs;grafSave();if(GF.dabs>0){SFX.win();toast('Graffiti gesprüht!',1300);if(GF.total>=400&&!SC.au.graffiti)auComplete('graffiti')}}
  else grafSave();
  GF.open=false;GFOPEN=false;$('graf').hidden=true;GF.cur=null}
function grafPt(e){const cv=$('graf-cv'),r=cv.getBoundingClientRect();return [Math.floor((e.clientX-r.left)/r.width*GF_W),Math.floor((e.clientY-r.top)/r.height*GF_H)]}
function grafSpray(x,y){const cx=$('graf-cv').getContext('2d'),c=GF.col;if((GF.cans[c]||0)<=0)return;const R=GF.size;cx.fillStyle=c;
  const n=Math.max(4,Math.round(R*R*1.9));for(let i=0;i<n;i++){const a=Math.random()*6.283,d=Math.sqrt(Math.random())*R,px=Math.round(x+Math.cos(a)*d),py=Math.round(y+Math.sin(a)*d);if(px<0||py<0||px>=GF_W||py>=GF_H)continue;cx.fillRect(px,py,1,1)}
  GF.cans[c]-=n*.07;GF.dabs+=n;if(GF.cans[c]<=0){GF.cans[c]=0;toast('Dose leer!',900);grafPal()}}
(function(){const cv=$('graf-cv');if(!cv)return;
  cv.addEventListener('pointerdown',e=>{if(!GF.open)return;e.preventDefault();cv.setPointerCapture(e.pointerId);GF.down=true;const cx=cv.getContext('2d');GF.undo.push(cx.getImageData(0,0,GF_W,GF_H));if(GF.undo.length>12)GF.undo.shift();const [x,y]=grafPt(e);GF.lx=x;GF.ly=y;grafSpray(x,y);if(Math.random()<.3)tone(900+Math.random()*300,.05,'sawtooth',.012)});
  cv.addEventListener('pointermove',e=>{if(!GF.down)return;const [x,y]=grafPt(e),dx=x-GF.lx,dy=y-GF.ly,st=Math.max(1,Math.ceil(Math.hypot(dx,dy)/Math.max(1,GF.size*.6)));for(let i=1;i<=st;i++)grafSpray(GF.lx+dx*i/st,GF.ly+dy*i/st);GF.lx=x;GF.ly=y});
  const up=()=>{if(GF.down){GF.down=false;grafPal()}};cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);
  document.querySelectorAll('#graf [data-sz]').forEach(b=>b.onclick=()=>{GF.size=+b.dataset.sz;document.querySelectorAll('#graf [data-sz]').forEach(x=>x.classList.toggle('on',x===b))});
  $('graf-undo').onclick=()=>{const s=GF.undo.pop();if(s)cv.getContext('2d').putImageData(s,0,0)};
  $('graf-done').onclick=()=>grafClose(true);$('graf-cancel').onclick=()=>grafClose(false);
  addEventListener('keydown',e=>{if(!GF.open)return;e.stopImmediatePropagation();if(e.code==='Escape'){e.preventDefault();grafClose(false)}else if(e.code==='KeyZ'&&(e.ctrlKey||e.metaKey)){e.preventDefault();$('graf-undo').click()}},true)})();
function grafActs(a){if(!HUB.graf)return;for(const p of HUB.graf.panels)a.push({x:p.ax,z:p.az,r:7.5,label:'Wand besprühen',fn:()=>grafOpen(p)})}
