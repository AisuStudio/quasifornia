/* ================= Sammelkarten: Packs mit 7 Karten, Sammlung im Rarepod (Reiter Karten) =================
   Die Karten (Bild, Name, Familie, Seltenheit, Lore-Text) liegen NICHT im Repo, sondern im R2-Bucket "designs" (karten/karten.json und karten/*.webp)
   und kommen über /api/karten und /designs/karten/…  (nur mit Seitenpasswort). Ohne diese Daten bleibt der Reiter leer und der Laden verkauft keine Packs.
   Kaufen: A-Mart, Kartenregal (Scoops). Die Sammlung liegt lokal im Browser (kq-karten). Tauschen kommt später (braucht Login und Server).
   Ein Pack hat immer 7 Karten. Seltenheitsstufen 1 bis 5 mit Gewichten (data.tiers), die letzte Karte im Pack ist mindestens "guarantee". */
const KAR={data:null,state:'leer',own:{},packs:0,sel:0,reveal:null,err:''};
(function(){try{const s=JSON.parse(localStorage.getItem('kq-karten')||'{}');if(s&&typeof s==='object'){KAR.own=s.own&&typeof s.own==='object'?s.own:{};KAR.packs=Math.max(0,Math.floor(+s.packs||0))}}catch(e){}})();
function karSave(){try{localStorage.setItem('kq-karten',JSON.stringify({own:KAR.own,packs:KAR.packs}))}catch(e){}}
const karEsc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function karOk(d){return d&&Array.isArray(d.cards)&&d.cards.length>0&&d.cards.every(c=>c&&Number.isInteger(c.id)&&typeof c.file==='string'&&typeof c.name==='string'&&c.rar>=1&&c.rar<=5)&&Array.isArray(d.tiers)&&d.tiers.length===5}
async function karLoad(force){if(KAR.state==='lädt'||(KAR.state==='da'&&!force))return;KAR.state='lädt';
  try{const r=await fetch('/api/karten',{cache:'no-cache'});if(!r.ok)throw new Error('HTTP '+r.status);const d=await r.json();if(!karOk(d))throw new Error('Format');
    d.packSize=7;d.packPrice=Math.max(1,Math.min(999,+d.packPrice||10));d.guarantee=Math.max(1,Math.min(5,+d.guarantee||3));KAR.data=d;KAR.state='da';KAR.err=''}
  catch(e){KAR.data=null;KAR.state='fehlt';KAR.err=String(e&&e.message||e)}
  try{if(typeof rpRender==='function')rpRender()}catch(e){}}
const karById=id=>KAR.data&&KAR.data.cards.find(c=>c.id===id);
const karImg=c=>'/designs/karten/'+encodeURIComponent(c.file);
const karFam=c=>(KAR.data&&KAR.data.fams&&KAR.data.fams[c.fam])||{name:c.fam||'',col:'#ffe066'};
function karGot(){return KAR.data?KAR.data.cards.filter(c=>KAR.own[c.id]>0).length:0}
/* Ziehung: erst die Seltenheitsstufe nach Gewicht, dann gleichverteilt eine Karte der Stufe. Die letzte Karte ist mindestens "guarantee". */
function karDraw(n,rnd){rnd=rnd||Math.random;const d=KAR.data;if(!d)return[];const by=[1,2,3,4,5].map(t=>d.cards.filter(c=>c.rar===t)),w=d.tiers.map((x,i)=>by[i].length?Math.max(0,+x||0):0);
  const pickTier=min=>{let tot=0;for(let i=min-1;i<5;i++)tot+=w[i];if(tot<=0){for(let i=0;i<5;i++)if(by[i].length)return i+1;return 0}let r=rnd()*tot;for(let i=min-1;i<5;i++){if(r<w[i])return i+1;r-=w[i]}return 5};
  const out=[];for(let k=0;k<n;k++){const t=pickTier(k===n-1?d.guarantee:1);const L=by[t-1];if(L.length)out.push(L[Math.floor(rnd()*L.length)])}return out}
/* Kaufen im A-Mart */
function karBuyPack(){const d=KAR.data;if(!d){toast('Kartenpacks gibt es gerade nicht',1500);return false}
  if(!SHOP.in){toast('Packs gibt es im A-Mart',1500);return false}
  if(!scCan(d.packPrice)){toast('Zu wenig Scoops: '+d.packPrice+' nötig',1500);return false}
  scAdd(-d.packPrice,'Kartenpack');KAR.packs++;karSave();tone(660,.08,'square',.04);tone(990,.1,'square',.04,0,.08);toast('Kartenpack gekauft (Rarepod, Reiter Karten)',1800);return true}
function karShopHTML(){const d=KAR.data;if(!d)return '';const can=SHOP.in&&scCan(d.packPrice);
  return `<h3 class="edh" id="kar-shop">Sammelkarten</h3><div class="kpack"><div class="kp-ic"><i></i><i></i><i></i></div><div><b>Kartenpack</b><span>${d.packSize} Karten · ${d.packPrice} Scoops</span><span>Du hast ${KAR.packs} ungeöffnete${KAR.packs===1?'s Pack':' Packs'}. Öffnen im Reiter Karten.</span></div><button type="button" data-kpack="1"${can?'':' disabled'}>Kaufen</button></div>`}
/* Pack öffnen */
function karOpenPack(rnd){if(!KAR.data||KAR.packs<1)return null;const cards=karDraw(KAR.data.packSize,rnd);if(cards.length<KAR.data.packSize)return null;
  KAR.packs--;const items=cards.map(c=>{const neu=!(KAR.own[c.id]>0);KAR.own[c.id]=(KAR.own[c.id]||0)+1;return {id:c.id,neu,up:false}});KAR.reveal={items};KAR.fresh=true;karSave();
  try{statEv('karten','pack',1)}catch(e){}tone(520,.06,'square',.04);tone(780,.08,'square',.04,0,.07);return cards}
/* Muster für die Rückseite: zufällig, aber je Karte immer gleich */
const KAR_PAST=['#ffd1e6','#ffeeb0','#c9f0e3','#d9d0f5','#cfe6ff','#ffdcc2','#e4f5c8'],KAR_BASE=['#fff3f8','#fffbe8','#eefaf5'],KAR_PAT={};
function karPat(id){if(KAR_PAT[id])return KAR_PAT[id];let a=id*7919+13;const rnd=()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
  let o='<svg xmlns="http://www.w3.org/2000/svg" width="320" height="448"><rect width="100%" height="100%" fill="'+KAR_BASE[id%3]+'"/>';
  for(let i=0;i<34;i++){const x=(rnd()*320).toFixed(1),y=(rnd()*448).toFixed(1),c=KAR_PAST[Math.floor(rnd()*KAR_PAST.length)],k=Math.floor(rnd()*5),z=6+rnd()*16,rot=(rnd()*360).toFixed(0),tr='transform="translate('+x+' '+y+') rotate('+rot+')"';
    if(k===0)o+='<circle r="'+z.toFixed(1)+'" cx="'+x+'" cy="'+y+'" fill="'+c+'" opacity=".42"/>';
    else if(k===1)o+='<rect x="'+(-z/2).toFixed(1)+'" y="'+(-z/2).toFixed(1)+'" width="'+z.toFixed(1)+'" height="'+z.toFixed(1)+'" '+tr+' fill="'+c+'" opacity=".42"/>';
    else if(k===2)o+='<path d="M0 '+(-z).toFixed(1)+' L'+z.toFixed(1)+' 0 0 '+z.toFixed(1)+' '+(-z).toFixed(1)+' 0Z" '+tr+' fill="'+c+'" opacity=".42"/>';
    else if(k===3)o+='<path d="M'+(-z).toFixed(1)+' 0 q'+(z/2).toFixed(1)+' '+(-z).toFixed(1)+' '+z.toFixed(1)+' 0 t'+z.toFixed(1)+' 0" fill="none" stroke="'+c+'" stroke-width="2.5" stroke-linecap="round" opacity=".5" '+tr+'/>';
    else o+='<path d="M'+(-z/2).toFixed(1)+' 0H'+(z/2).toFixed(1)+'M0 '+(-z/2).toFixed(1)+'V'+(z/2).toFixed(1)+'" stroke="'+c+'" stroke-width="2.5" stroke-linecap="round" opacity=".5" transform="translate('+x+' '+y+')"/>'}
  return KAR_PAT[id]='url("data:image/svg+xml;utf8,'+encodeURIComponent(o+'</svg>')+'")'}
function karDots(n){let s='';for(let i=0;i<5;i++)s+='<i'+(i<n?' class="on"':'')+'></i>';return '<span class="kc-rar" aria-label="Seltenheit '+n+' von 5">'+s+'</span>'}
/* Eine Karte mit Vorder- und Rückseite (Klick dreht sie) */
function karCardHTML(c,w,opt){opt=opt||{};const f=karFam(c),nr=String(c.id).padStart(3,'0')+' / '+String(KAR.data.cards.length).padStart(3,'0');
  return `<div class="kcard${opt.flip?' flip':''}${opt.down?' down':''}" data-k="${c.id}" style="--kw:${w}px;--kc:${karEsc(f.col)}"><div class="kc-in">`+
   `<div class="kc-f"><div class="kc-pic"><img src="${karEsc(karImg(c))}" alt="" loading="lazy" decoding="async"></div><div class="kc-nm">${karEsc(c.name)}</div><div class="kc-m"><span class="kc-fam">${karEsc(f.name)}</span>${karDots(c.rar)}</div><div class="kc-m"><span>Nr. ${nr}</span><span>Seltenheit ${c.rar} von 5</span></div>${opt.neu?'<b class="kc-new">NEU</b>':''}</div>`+
   `<div class="kc-b" style="background-image:${karPat(c.id)}"><span class="kc-tag">${karEsc(f.name)}</span><h4>${karEsc(c.name)}</h4><p>${karEsc(c.lore||'')}</p><dl><dt>Fundort</dt><dd>${karEsc(c.ort||'')}</dd><dt>Stufe</dt><dd>${karEsc(c.stufe||1)}</dd><dt>Nummer</dt><dd>${nr}</dd></dl></div></div></div>`}
/* Reiter im Rarepod */
function karRender(){const el=document.getElementById('rp-kar');if(!el||typeof SC==='undefined'||SC.tab!=='kar')return;
  if(KAR.state==='leer')karLoad();
  if(!KAR.data){el.innerHTML='<p class="sub">'+(KAR.state==='lädt'?'Karten werden geladen …':'Die Sammelkarten sind gerade nicht erreichbar.')+'</p>';return}
  const d=KAR.data,got=karGot();
  let h=`<p class="sub">Sammlung: <b>${got} von ${d.cards.length}</b> Karten. Ein Pack hat immer ${d.packSize} Karten und kostet ${d.packPrice} Scoops im A-Mart.</p><div class="kbar"><span>Ungeöffnete Packs: <b>${KAR.packs}</b></span><button type="button" class="btn" id="kar-open"${KAR.packs>0?'':' disabled'}>Pack öffnen</button></div>`;
  if(KAR.reveal){const it=KAR.reveal.items,allUp=it.every(x=>x.up);
    h+=`<div class="kreveal">`+it.map((x,i)=>{const c=karById(x.id);return `<div class="kslot" data-i="${i}">${karCardHTML(c,140,{flip:!x.up,down:!x.up,neu:x.neu})}</div>`}).join('')+`</div><div class="kbar"><button type="button" class="btn sec" id="kar-all">${allUp?'Fertig':'Alle aufdecken'}</button></div>`}
  h+=`<div class="kgrid">`+d.cards.map(c=>{const n=KAR.own[c.id]||0,f=karFam(c);return n>0
    ?`<button type="button" class="kth${KAR.sel===c.id?' on':''}" data-s="${c.id}" style="--kc:${karEsc(f.col)}" title="${karEsc(c.name)}"><img src="${karEsc(karImg(c))}" alt="" loading="lazy" decoding="async"><span>${karEsc(c.name)}</span>${n>1?'<b>×'+n+'</b>':''}</button>`
    :`<div class="kth q" aria-label="Noch nicht gefunden"><span>?</span><em>${String(c.id).padStart(3,'0')}</em></div>`}).join('')+'</div>';
  const sc=KAR.sel?karById(KAR.sel):null;if(sc&&KAR.own[sc.id]>0)h+=`<h3 class="edh">${karEsc(sc.name)}</h3><div class="kbig">${karCardHTML(sc,300)}</div><p class="sub">Klick dreht die Karte um.</p>`;
  el.innerHTML=h;
  const ob=el.querySelector('#kar-open');if(ob)ob.onclick=()=>{if(karOpenPack())karRender()};if(KAR.fresh){KAR.fresh=false;const rv=el.querySelector('.kreveal');if(rv)setTimeout(()=>rv.scrollIntoView({block:'nearest'}),0)}
  el.querySelectorAll('.kslot .kcard').forEach(k=>{const i=+k.parentNode.dataset.i;k.onclick=()=>{const x=KAR.reveal&&KAR.reveal.items[i];if(!x)return;x.up=true;k.classList.remove('flip','down');tone(900+i*60,.05,'square',.03);const ab=document.getElementById('kar-all');if(ab&&KAR.reveal.items.every(y=>y.up))ab.textContent='Fertig'}});
  const ab=el.querySelector('#kar-all');if(ab)ab.onclick=()=>{const it=KAR.reveal.items;if(it.every(x=>x.up)){KAR.reveal=null;karRender();return}it.forEach(x=>x.up=true);el.querySelectorAll('.kslot .kcard').forEach(k=>k.classList.remove('flip','down'));ab.textContent='Fertig'};
  el.querySelectorAll('.kth[data-s]').forEach(b=>b.onclick=()=>{KAR.sel=+b.dataset.s;karRender();const t=el.querySelector('.kbig');if(t)t.scrollIntoView({block:'nearest'})});
  el.querySelectorAll('.kbig .kcard').forEach(k=>k.onclick=()=>k.classList.toggle('flip'))}

karLoad();
