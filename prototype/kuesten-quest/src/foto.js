/* ================= Rarepod-Kamera: Fotos machen, lokal speichern, teilen =================
   Taste C (oder Knopf im Rarepod, Reiter Fotos) nimmt die aktuelle Ansicht auf, mit Polaroid-Rahmen: Ort, Datum, Koordinaten und Blickwinkel.
   Die Fotos bleiben lokal im Browser (IndexedDB "kq-fotos", höchstens 60), nichts wird hochgeladen.
   Teilen: Herunterladen, Kopieren, Teilen-Menü des Geräts (wo es das gibt) oder "An den Raum zeigen": ein kleines Vorschaubild läuft über den Raum
   (der Server leitet nur weiter und speichert nichts) und verschwindet beim Neuladen. Filme: später. */
const FOTO={list:[],peer:[],db:null,ready:false,max:60,sel:null,tShow:0,flash:null};
function fotIdb(){return new Promise((res,rej)=>{try{const q=indexedDB.open('kq-fotos',1);q.onupgradeneeded=()=>q.result.createObjectStore('f',{keyPath:'id'});q.onsuccess=()=>res(q.result);q.onerror=()=>rej(q.error)}catch(e){rej(e)}})}
async function fotLoad(){try{FOTO.db=await fotIdb();const all=await new Promise(r=>{const o=FOTO.db.transaction('f').objectStore('f').getAll();o.onsuccess=()=>r(o.result||[]);o.onerror=()=>r([])});FOTO.list=all.sort((a,b)=>b.t-a.t)}catch(e){FOTO.db=null}FOTO.ready=true;if(typeof fotRender==='function')fotRender()}
function fotPut(f){if(!FOTO.db)return;try{FOTO.db.transaction('f','readwrite').objectStore('f').put(f)}catch(e){}}
function fotDelDb(id){if(!FOTO.db)return;try{FOTO.db.transaction('f','readwrite').objectStore('f').delete(id)}catch(e){}}
const fotDir=w=>{w=((w%360)+360)%360;return ['N','NO','O','SO','S','SW','W','NW'][Math.round(w/45)%8]};
function fotScale(cv,maxW,q){const c=document.createElement('canvas'),k=Math.min(1,maxW/cv.width);c.width=Math.round(cv.width*k);c.height=Math.round(cv.height*k);c.getContext('2d').drawImage(cv,0,0,c.width,c.height);return c.toDataURL('image/jpeg',q)}
/* Foto aufnehmen: Das Bild muss direkt nach dem Zeichnen kopiert werden, sonst ist der Zeichenpuffer schon leer. */
function fotSnap(){if(G.phase==='title')return null;try{render()}catch(e){}
  const src=r.domElement,w=src.width,h=src.height;if(!w||!h)return null;const S=Math.min(1,1280/w),sw=Math.round(w*S),sh=Math.round(h*S),B=18,BB=92;
  const cv=document.createElement('canvas');cv.width=sw+2*B;cv.height=sh+B+BB;const g=cv.getContext('2d');g.fillStyle='#fdf6e8';g.fillRect(0,0,cv.width,cv.height);g.drawImage(src,0,0,w,h,B,B,sw,sh);
  g.strokeStyle='rgba(14,11,24,.35)';g.lineWidth=2;g.strokeRect(B,B,sw,sh);
  let wk=Math.atan2(Math.cos(P.h),-Math.sin(P.h))*180/Math.PI;wk=((wk%360)+360)%360;
  const ort=LV.id===0?(G.under?'Unterwelt':'Port Lupo'):'Level '+LV.id,datum=new Date().toLocaleString('de-DE',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'}),
    z1=ort+' · '+datum,z2='x '+P.x.toFixed(1)+'  z '+P.z.toFixed(1)+'  '+Math.round(wk)+'° '+fotDir(wk)+(typeof MULTI!=='undefined'&&MULTI.name?'  ·  '+MULTI.name:'');
  g.fillStyle='#1a1626';g.font='800 '+Math.round(BB*.3)+'px "Baloo 2","Trebuchet MS",sans-serif';g.textBaseline='middle';g.fillText(z1,B,sh+B+BB*.36);
  g.fillStyle='#6b6480';g.font='500 '+Math.round(BB*.21)+'px "DM Mono",monospace';g.fillText(z2,B,sh+B+BB*.72);
  const f={id:'f'+Date.now().toString(36)+Math.floor(Math.random()*1296).toString(36),t:Date.now(),txt:z1+' | '+z2,img:cv.toDataURL('image/jpeg',.88),th:fotScale(cv,300,.72)};
  FOTO.list.unshift(f);while(FOTO.list.length>FOTO.max){const o=FOTO.list.pop();fotDelDb(o.id)}fotPut(f);
  try{if(typeof statEv==='function')statEv('foto','mach',1,P.x,P.z)}catch(e){}
  fotFlash();try{tone(1500,.04,'square',.04);tone(900,.07,'square',.03,0,.05)}catch(e){}toast('Foto gespeichert (Rarepod, Reiter Fotos)',1600);if(typeof fotRender==='function')fotRender();return f}
function fotFlash(){let d=FOTO.flash;if(!d){d=FOTO.flash=document.createElement('div');d.style.cssText='position:absolute;inset:0;background:#fff;opacity:0;pointer-events:none;z-index:6;transition:opacity .35s ease-out';(document.getElementById('ui')||document.body).appendChild(d)}
  d.style.transition='none';d.style.opacity='.85';void d.offsetWidth;d.style.transition='opacity .35s ease-out';d.style.opacity='0'}
/* ---- Teilen ---- */
const fotById=id=>FOTO.list.find(f=>f.id===id)||FOTO.peer.find(f=>f.id===id);
function fotDownload(f){const a=document.createElement('a');a.href=f.img;a.download='quasifornia-'+f.id+'.jpg';document.body.appendChild(a);a.click();a.remove()}
async function fotBlob(f,type){const im=new Image();await new Promise((res,rej)=>{im.onload=res;im.onerror=rej;im.src=f.img});const c=document.createElement('canvas');c.width=im.naturalWidth;c.height=im.naturalHeight;c.getContext('2d').drawImage(im,0,0);return new Promise(res=>c.toBlob(res,type||'image/png',.9))}
async function fotCopy(f){try{const b=await fotBlob(f,'image/png');await navigator.clipboard.write([new ClipboardItem({'image/png':b})]);toast('Foto kopiert',1200)}catch(e){toast('Kopieren geht hier nicht. Nimm Herunterladen.',2200)}}
async function fotShareDevice(f){try{const b=await fotBlob(f,'image/jpeg'),file=new File([b],'quasifornia-'+f.id+'.jpg',{type:'image/jpeg'});if(navigator.canShare&&navigator.canShare({files:[file]}))await navigator.share({files:[file],title:'Quasifornia'});else toast('Teilen-Menü gibt es hier nicht. Nimm Herunterladen.',2200)}catch(e){}}
function fotToRoom(f){if(typeof MULTI==='undefined'||!MULTI.on){toast('Du bist in keinem Raum (Terminal: /chat name passwort)',2400);return false}
  const now=Date.now();if(now-FOTO.tShow<3000){toast('Kurz warten, dann nochmal zeigen',1200);return false}
  const th=f.th;if(!th||th.length>60000){toast('Foto zu groß zum Zeigen',1600);return false}
  FOTO.tShow=now;multiSend({t:'foto',img:th});try{statEv('foto','zeig',1,P.x,P.z)}catch(e){}toast('An den Raum gezeigt',1400);return true}
function fotPeer(m){if(!m||typeof m.img!=='string'||!/^data:image\/jpeg;base64,[A-Za-z0-9+\/=]+$/.test(m.img)||m.img.length>64000)return;
  const f={id:'p'+Date.now().toString(36)+Math.floor(Math.random()*1296).toString(36),t:Date.now(),name:String(m.name||'?').slice(0,12),img:m.img,th:m.img,txt:'Foto von '+String(m.name||'?').slice(0,12),peer:1};
  FOTO.peer.unshift(f);if(FOTO.peer.length>12)FOTO.peer.pop();toast(f.name+' zeigt ein Foto (Rarepod, Reiter Fotos)',2600);if(typeof fotRender==='function')fotRender()}
/* ---- Reiter im Rarepod ---- */
function fotRender(){const el=document.getElementById('rp-fot');if(!el||typeof SC==='undefined'||SC.tab!=='fot')return;
  const sel=FOTO.sel?fotById(FOTO.sel):null,esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const canShare=typeof navigator!=='undefined'&&!!navigator.share;
  let h='<p class="sub">Mit <b>C</b> machst du ein Foto. Es bleibt auf deinem Gerät ('+FOTO.list.length+' von '+FOTO.max+').</p><button type="button" class="btn" id="fot-snap">Foto machen · C</button>';
  if(sel)h+=`<div class="fbig"><img src="${sel.img}" alt="Foto"><p class="sub">${esc(sel.txt)}</p><div class="frow"><button type="button" data-a="dl">Herunterladen</button><button type="button" data-a="cp">Kopieren</button>${canShare?'<button type="button" data-a="sh">Teilen …</button>':''}${sel.peer?'':'<button type="button" data-a="rm">An den Raum zeigen</button><button type="button" data-a="del">Löschen</button>'}<button type="button" data-a="zu">Schließen</button></div></div>`;
  h+='<div class="fgrid">'+(FOTO.list.length?FOTO.list.map(f=>`<button type="button" class="fth${FOTO.sel===f.id?' on':''}" data-f="${f.id}" title="${esc(f.txt)}"><img src="${f.th}" alt=""></button>`).join(''):'<p class="sub">Noch keine Fotos.</p>')+'</div>';
  if(FOTO.peer.length)h+='<h3 class="edh">Von der Crew (verschwindet beim Neuladen)</h3><div class="fgrid">'+FOTO.peer.map(f=>`<button type="button" class="fth${FOTO.sel===f.id?' on':''}" data-f="${f.id}" title="${esc(f.txt)}"><img src="${f.th}" alt=""><b>${esc(f.name)}</b></button>`).join('')+'</div>';
  el.innerHTML=h;
  const sn=el.querySelector('#fot-snap');if(sn)sn.onclick=()=>{invToggle(false);setTimeout(()=>{fotSnap();invToggle(true)},180)};
  el.querySelectorAll('.fth').forEach(b=>b.onclick=()=>{FOTO.sel=b.dataset.f;fotRender()});
  el.querySelectorAll('.frow button').forEach(b=>b.onclick=()=>{const f=fotById(FOTO.sel);if(!f)return;const a=b.dataset.a;
    if(a==='dl')fotDownload(f);else if(a==='cp')fotCopy(f);else if(a==='sh')fotShareDevice(f);else if(a==='rm')fotToRoom(f);
    else if(a==='del'){FOTO.list=FOTO.list.filter(x=>x.id!==f.id);fotDelDb(f.id);FOTO.sel=null;fotRender()}else if(a==='zu'){FOTO.sel=null;fotRender()}})}
addEventListener('keydown',e=>{if(e.code!=='KeyC'||e.repeat||e.ctrlKey||e.metaKey||e.altKey||(e.target&&e.target.tagName==='INPUT'))return;if(G.phase==='title'||INV.open||(typeof DLG!=='undefined'&&DLG.open)||(typeof PAD!=='undefined'&&PAD.open)||(typeof PUZ!=='undefined'&&PUZ.open)||GFOPEN||(typeof BAU!=='undefined'&&BAU.open))return;fotSnap()});
fotLoad();
