/* ================= Auswertung (geschlossene Beta): sammelt anonyme Ereignisse und schickt sie alle 15 s an /api/stats =================
   Erfasst werden: Spielzeit, Level, gelöste Aufträge, Scoops-Bewegungen mit Grund, gefundene Gegenstände, Portale, Polizei, Graffiti,
   Fehler im Browser, Hänger (Gas gedrückt, aber man kommt nicht weiter), Bildrate und Gerät. Aus ?nostats=1 wird nichts gesendet.
   In den Tests ist es aus (nur mit ?stats=1 an). Die Auswertung steht unter /stats (siehe worker/stats.js). */
const STAT={on:!(TEST&&!QP.has('stats'))&&!QP.has('nostats'),sid:'',pid:'',q:[],play:0,wFr:0,wMs:0,slow:0,fr:0,t:15,last:performance.now(),stuckT:0,errs:new Map(),errKeys:0,ver:'__BUILD__',gpu:'',sent:0,fail:0,dev:matchMedia('(pointer:coarse)').matches?'m':'d'};
(function(){const rid=n=>{let s='';const c='abcdefghijklmnopqrstuvwxyz0123456789';for(let i=0;i<n;i++)s+=c[Math.floor(Math.random()*c.length)];return s};STAT.sid=rid(12);
  try{STAT.pid=localStorage.getItem('kq-pid')||'';if(!/^[a-z0-9]{8,24}$/.test(STAT.pid)){STAT.pid=rid(12);localStorage.setItem('kq-pid',STAT.pid)}}catch(e){STAT.pid=STAT.sid}})();
function statEv(ty,k,n,x,z){if(!STAT.on)return;if(STAT.q.length>=60)STAT.q.shift();const inGame=typeof LV!=='undefined';STAT.q.push([ty,String(k==null?'':k).slice(0,120),typeof n==='number'&&isFinite(n)?Math.round(n*100)/100:0,typeof x==='number'?Math.round(x):null,typeof z==='number'?Math.round(z):null,inGame?LV.id:0])}
function statErr(msg){if(!STAT.on)return;msg=String(msg||'?').replace(/\s+/g,' ').slice(0,150);const c=STAT.errs.get(msg);if(c!==undefined){STAT.errs.set(msg,c+1);return}if(STAT.errKeys>=15)return;STAT.errKeys++;STAT.errs.set(msg,1)}
addEventListener('error',e=>statErr((e.message||'Fehler')+' @'+String(e.filename||'').split('/').pop()+':'+(e.lineno||0)));
addEventListener('unhandledrejection',e=>statErr('Versprechen: '+((e.reason&&e.reason.message)||e.reason||'?')));
function statGpu(){if(STAT.gpu||typeof r==='undefined')return STAT.gpu;try{const gl=r.getContext(),x=gl.getExtension('WEBGL_debug_renderer_info');STAT.gpu=String(gl.getParameter(x?x.UNMASKED_RENDERER_WEBGL:gl.RENDERER)||'').slice(0,80)}catch(e){STAT.gpu='?'}return STAT.gpu}
function statFlush(final){if(!STAT.on)return;if(document.hidden&&!final)return;
  const px=typeof P!=='undefined'?P:{x:0,z:0},fps=STAT.wMs>3000?STAT.wFr/(STAT.wMs/1000):0;
  if(fps>0&&fps<25&&STAT.wMs>5000)statEv('fps','niedrig',fps,px.x,px.z);
  STAT.errs.forEach((n,k)=>statEv('err',k,n,px.x,px.z));STAT.errs.clear();
  const body={sid:STAT.sid,pid:STAT.pid,name:typeof MULTI!=='undefined'?MULTI.name:'',ver:STAT.ver,dev:STAT.dev,ua:navigator.userAgent.slice(0,120),w:innerWidth,h:innerHeight,gpu:statGpu(),room:typeof MULTI!=='undefined'&&MULTI.room||'',
    play:Math.round(STAT.play*10)/10,lvl:typeof LV!=='undefined'?LV.id:0,under:typeof G!=='undefined'&&G.under?1:0,sc:typeof SC!=='undefined'?SC.n:null,fps:Math.round(fps*10)/10,fr:STAT.fr,slow:STAT.slow,ev:STAT.q.splice(0,40)};
  STAT.play=0;STAT.fr=0;STAT.slow=0;STAT.wFr=0;STAT.wMs=0;
  try{fetch('/api/stats',{method:'POST',body:JSON.stringify(body),keepalive:true,headers:{'content-type':'text/plain'},cache:'no-store'}).then(rs=>{if(rs.ok)STAT.sent++;else STAT.fail++}).catch(()=>{STAT.fail++})}catch(e){STAT.fail++}}
function statsStep(){if(!STAT.on)return;const now=performance.now();let d=now-STAT.last;STAT.last=now;if(document.hidden||d>1000||d<=0)return;
  const playing=G.phase==='play'||G.phase==='chase'||G.phase==='caught';
  if(playing){STAT.play+=d/1000;STAT.fr++;STAT.wFr++;STAT.wMs+=d;if(d>50)STAT.slow++}
  /* Hänger: Gas gedrückt, aber die Figur kommt nicht vom Fleck (Wand, Zaun, Fehler in der Karte) */
  const free=!(INV.open||DLG.open||PAD.open||PUZ.open||GFOPEN)&&!(typeof GR!=='undefined'&&GR.on);
  if(playing&&free&&LV.id===0&&K.up&&P.speed<.8&&G.phase==='play'){STAT.stuckT+=d/1000;if(STAT.stuckT>4){statEv('stuck','',STAT.stuckT,P.x,P.z);STAT.stuckT=-8}}else if(STAT.stuckT>0)STAT.stuckT=0;
  STAT.t-=d/1000;if(STAT.t<=0){STAT.t=15;statFlush(false)}}
addEventListener('pagehide',()=>statFlush(true));addEventListener('visibilitychange',()=>{if(document.hidden)statFlush(true)});
/* Haken: bestehende Funktionen umhüllen (Name bleibt, Verhalten bleibt, es wird nur gezählt) */
{const o=scAdd;scAdd=function(d,why){const r=o.apply(this,arguments);try{const w=String(why==null?'?':why);statEv('sc',w,d);if(/^Reise zu Welt/.test(w))statEv('portal',w,1,P.x,P.z)}catch(e){}return r}}
{const o=auComplete;auComplete=function(id){const first=!(SC.au&&SC.au[id]),r=o.apply(this,arguments);try{if(r)statEv('q',id,first?1:0)}catch(e){}return r}}
{const o=applyLevel;applyLevel=function(n){const r=o.apply(this,arguments);try{statEv('lvl',String(n),1)}catch(e){}return r}}
{const o=beginPlay;beginPlay=function(){const r=o.apply(this,arguments);try{statEv('start',String(LV.id),1)}catch(e){}return r}}
{const o=collectItem;collectItem=function(it){const r=o.apply(this,arguments);try{statEv('item',it&&it.def&&it.def.id,1,P.x,P.z)}catch(e){}return r}}
{const o=startCoastRace;startCoastRace=function(){const r=o.apply(this,arguments);try{statEv('race','start',1,P.x,P.z)}catch(e){}return r}}
{const o=win;win=function(){const r=o.apply(this,arguments);try{statEv('race','win',G.time||0)}catch(e){}return r}}
{const o=caught;caught=function(){const r=o.apply(this,arguments);try{statEv('race','erwischt',G.time||0)}catch(e){}return r}}
{const o=underApply;underApply=function(on){const was=!!G.under,r=o.apply(this,arguments);try{if(!!G.under!==was)statEv('lad',G.under?'down':'up',1,P.x,P.z)}catch(e){}return r}}
{const o=towerUp;towerUp=function(){const r=o.apply(this,arguments);try{statEv('tower','up',1)}catch(e){}return r}}
{const o=beggarTalk;beggarTalk=function(){const g=BQ.gave,r=o.apply(this,arguments);try{if(!g&&BQ.gave)statEv('bq','gave',1)}catch(e){}return r}}
{const o=releaseTry;releaseTry=function(){const g=BQ.released,r=o.apply(this,arguments);try{if(!g&&BQ.released)statEv('bq','released',1)}catch(e){}return r}}
{const o=shopEnter;shopEnter=function(){const r=o.apply(this,arguments);try{statEv('shop','enter',1)}catch(e){}return r}}
{const o=trickScored;trickScored=function(key){const r=o.apply(this,arguments);try{statEv('trick',key,1)}catch(e){}return r}}
{const o=polAlertGo;polAlertGo=function(p,role){const was=POL.state,r=o.apply(this,arguments);try{if(was==='idle'&&POL.state==='warn')statEv('pol',role==='second'?'alarm2':'alarm',1,P.x,P.z)}catch(e){}return r}}
{const o=polCatch;polCatch=function(){const r=o.apply(this,arguments);try{statEv('pol','erwischt',1,P.x,P.z)}catch(e){}return r}}
{const o=polEnd;polEnd=function(msg){const was=POL.state,r=o.apply(this,arguments);try{statEv('pol',/Glück/.test(msg||'')?'entkommen':was==='caught'?'bezahlt':'ende',1,P.x,P.z)}catch(e){}return r}}
{const o=grafClose;grafClose=function(save){const p=GF.cur,d=GF.dabs,r=o.apply(this,arguments);try{if(save&&p&&d>0)statEv('gr',grafLegal(p.id)?'legal':'illegal',d,P.x,P.z)}catch(e){}return r}}
{const o=mpUnstick;mpUnstick=function(){const x=P.x,z=P.z,r=o.apply(this,arguments);try{statEv('unstick','',1,x,z)}catch(e){}return r}}
