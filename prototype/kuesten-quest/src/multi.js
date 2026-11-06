/* ================= Mehrspieler: Freundes-Raum für bis zu 5 Spieler (Schritt 1: Verbindung, andere Skater, gemeinsame Uhr) =================
   Beitritt über den Link  .../?raum=name  (Raumname: a-z, 0-9, Bindestrich). Ohne ?raum bleibt alles wie bisher (Einzelspieler).
   Der Server (worker/room.js) verteilt nur Positionen und die Uhrzeit. Spielstände, Quests und Scoops bleiben pro Person. */
const MULTI={room:null,on:false,ws:null,id:null,name:'',peers:new Map(),off:0,synced:false,rtt:1e9,max:5,state:'aus',tSend:0,tPing:0,tRetry:0,retry:2,sentSkin:null,hud:null,full:false,pw:''};
(function(){const r=(QP.get('raum')||'').toLowerCase().replace(/[^a-z0-9-]/g,'').slice(0,32);if(r)MULTI.room=r;
  let nm='';try{nm=localStorage.getItem('kq-name')||''}catch(e){}const q=(QP.get('name')||'').replace(/[^A-Za-z0-9ÄÖÜäöüß _-]/g,'').trim().slice(0,12);if(q)nm=q;
  if(!nm)nm='Skater-'+(10+Math.floor(Math.random()*90));MULTI.name=nm})();
MULTI.now=()=>Date.now()+MULTI.off;
function multiCleanName(n){n=String(n||'').replace(/[^A-Za-z0-9ÄÖÜäöüß _-]/g,'').replace(/\s+/g,' ').trim().slice(0,12);return n||'Skater'}
function multiHud(){if(MULTI.hud)return MULTI.hud;const d=document.createElement('div');d.id='multi';d.style.cssText="position:absolute;right:16px;bottom:18px;display:none;gap:8px;align-items:center;padding:7px 10px;border-radius:12px;border:3px solid #0e0b18;background:rgba(26,22,38,.88);color:#fff;font:700 13px/1 'DM Mono',monospace;z-index:3;box-shadow:0 4px 0 #0e0b18;pointer-events:auto";
  if(matchMedia('(pointer:coarse)').matches){d.style.bottom='auto';d.style.top='226px'}
  d.innerHTML='<span id="multi-t"></span><button type="button" id="multi-n" style="font:700 12px/1 \'DM Mono\',monospace;color:#fff;background:#2b2540;border:2px solid #0e0b18;border-radius:8px;padding:6px 8px;cursor:pointer">Name</button><button type="button" id="multi-l" style="font:700 12px/1 \'DM Mono\',monospace;color:#fff;background:#d54291;border:2px solid #0e0b18;border-radius:8px;padding:6px 8px;cursor:pointer">Link</button>';
  (document.getElementById('ui')||document.body).appendChild(d);
  d.querySelector('#multi-n').onclick=()=>{const v=prompt('Dein Name (bis 12 Zeichen, nur Buchstaben und Zahlen):',MULTI.name);if(v===null)return;MULTI.name=multiCleanName(v);try{localStorage.setItem('kq-name',MULTI.name)}catch(e){}multiSend({t:'name',name:MULTI.name});multiUi()};
  d.querySelector('#multi-l').onclick=()=>{const u=location.origin+location.pathname+'?raum='+MULTI.room;const done=()=>toast('Link kopiert: Freunde öffnen ihn und sind im selben Raum',2600);try{navigator.clipboard.writeText(u).then(done,()=>prompt('Link zum Kopieren:',u))}catch(e){prompt('Link zum Kopieren:',u)}};
  return MULTI.hud=d}
function multiUi(){const h=multiHud(),t=h.querySelector('#multi-t'),on=MULTI.state==='on';const vis=!!MULTI.room&&G.phase!=='title'&&!(typeof GFOPEN!=='undefined'&&GFOPEN);h.style.display=vis?'flex':'none';
  const n=1+MULTI.peers.size;t.textContent=MULTI.full?'Raum voll ('+MULTI.max+'/'+MULTI.max+')':on?'Raum '+MULTI.room+' · '+n+'/'+MULTI.max:MULTI.state==='warte'?'Verbinde …':'Verbindung weg';t.style.color=MULTI.full?'#ff8fa8':on?'#fff':'#ffd04a';h.querySelector('#multi-n').textContent=MULTI.name}
function multiSend(o){if(MULTI.ws&&MULTI.ws.readyState===1){try{MULTI.ws.send(JSON.stringify(o))}catch(e){}}}
function multiConnect(){if(!MULTI.room||MULTI.ws||MULTI.full)return;MULTI.state='warte';
  let ws;try{ws=new WebSocket((location.protocol==='https:'?'wss://':'ws://')+location.host+'/api/room/'+MULTI.room)}catch(e){MULTI.state='aus';return}
  MULTI.ws=ws;ws.onopen=()=>{ws.send(JSON.stringify({t:'hello',name:MULTI.name,skin:P.preset,pw:MULTI.pw||undefined}));MULTI.sentSkin=P.preset;multiPing()};
  ws.onmessage=e=>{let m;try{m=JSON.parse(e.data)}catch(x){return}multiMsg(m)};
  ws.onclose=()=>{if(typeof statEv==='function'&&!MULTI.on&&!MULTI.full)statEv('ws','fehler',1);if(MULTI.ws===ws){MULTI.ws=null;MULTI.on=false;MULTI.state=MULTI.full?'voll':'aus';MULTI.tRetry=MULTI.retry;MULTI.retry=Math.min(15,MULTI.retry*1.6);multiClear()}multiUi()};
  ws.onerror=()=>{}}
function multiClear(){MULTI.peers.forEach(p=>multiRemove(p));MULTI.peers.clear();MULTI.synced=false;if(typeof polRemoteHide==='function')polRemoteHide(true)}
function multiPing(){multiSend({t:'ping',c:performance.now()})}
function multiMsg(m){
  if(m.t==='welcome'){MULTI.id=m.id;MULTI.max=m.max||5;MULTI.on=true;MULTI.state='on';MULTI.retry=2;MULTI.off=m.now-Date.now();MULTI.synced=true;m.players.forEach(p=>multiAdd(p));multiUi();toast('Im Raum "'+MULTI.room+'"',1600);termAdd('sys','','Verbunden mit Raum "'+MULTI.room+'"'+(m.locked?' (mit Passwort)':'')+'. Tippe Text und drücke Enter, um zu schreiben.');if(MULTI.pw&&!m.locked)termAdd('sys','','Hinweis: Der Raum war schon offen, dein Passwort gilt dort nicht.')}
  else if(m.t==='join'){multiAdd(m);multiUi();toast(m.name+' ist beigetreten',1500)}
  else if(m.t==='leave'){const p=MULTI.peers.get(m.id);if(p){multiRemove(p);MULTI.peers.delete(m.id);toast(p.name+' ist gegangen',1300);multiUi()}}
  else if(m.t==='p'){const p=MULTI.peers.get(m.id);if(p)multiSet(p,m)}
  else if(m.t==='name'){const p=MULTI.peers.get(m.id);if(p){p.name=m.name;multiLabel(p)}}
  else if(m.t==='skin'){const p=MULTI.peers.get(m.id);if(p){p.skin=m.skin;multiRemove(p,true)}}
  else if(m.t==='pong'){const rtt=performance.now()-m.c;if(rtt<MULTI.rtt+30){MULTI.rtt=Math.min(MULTI.rtt,rtt);MULTI.off=m.now+rtt/2-Date.now()}}
  else if(m.t==='chat'){if(typeof m.text==='string'&&m.text)termAdd('in',String(m.name||'?').slice(0,12),m.text.slice(0,200))}
  else if(m.t==='foto'){if(typeof fotPeer==='function')fotPeer(m)}
  else if(m.t==='badpw'){const w=MULTI.ws;MULTI.ws=null;if(w){try{w.close()}catch(e){}}multiClear();const r=MULTI.room;MULTI.room=null;MULTI.pw='';MULTI.on=false;MULTI.state='aus';multiUi();toast('Falsches Passwort',2400);termAdd('sys','','Falsches Passwort für Raum "'+r+'". Mit /chat '+r+' passwort nochmal versuchen.')}
  else if(m.t==='pol'){if(typeof polNetCmd==='function')polNetCmd(m)}
  else if(m.t==='polz'){if(typeof polNetIn==='function')polNetIn(m)}
  else if(m.t==='full'){if(typeof statEv==='function')statEv('ws','voll',1);MULTI.full=true;MULTI.state='voll';toast('Der Raum ist voll (höchstens '+MULTI.max+' Spieler)',3000);multiUi()}}
function multiAdd(d){if(MULTI.peers.has(d.id)||d.id===MULTI.id)return;const p={id:d.id,name:d.name,skin:d.skin,g:null,label:null,x:0,y:1.3,z:0,h:0,v:0,u:0,tx:0,ty:1.3,tz:0,th:0,seen:0,age:99,has:false};MULTI.peers.set(d.id,p);if(d.s)multiSet(p,d.s)}
function multiSet(p,m){p.tx=m.x;p.ty=m.y;p.tz=m.z;p.th=m.h;p.v=m.v;p.u=m.u;p.seen=performance.now();if(!p.has){p.x=m.x;p.y=m.y;p.z=m.z;p.h=m.h;p.has=true}}
function multiLabel(p){if(!p.label)return;const c=p.label.material.map.image,g=c.getContext('2d');g.clearRect(0,0,256,64);g.font='800 30px "Baloo 2","Trebuchet MS",sans-serif';g.textAlign='center';g.textBaseline='middle';const w=Math.min(240,g.measureText(p.name).width+28);g.fillStyle='rgba(26,22,38,.86)';g.beginPath();g.roundRect(128-w/2,8,w,48,16);g.fill();g.fillStyle=p.skin&&p.skin[0]==='#'?p.skin:'#e8f0ff';g.fillText(p.name,128,33);p.label.material.map.needsUpdate=true}
function multiBuild(p){const n0=sc.children.length;const g=skater(p.x,p.y,p.z,0,p.skin,1.35);g.rotation.order='YZX';dynOf(g);
  while(sc.children.length>n0)sc.remove(sc.children[sc.children.length-1]);  /* das Schatten-Blob, das skater() anlegt, bleibt sonst an der Startstelle stehen */
  W0.add(g);g.userData.noBake=true;addOutlines(g,'actor');const cv=document.createElement('canvas');cv.width=256;cv.height=64;const tx=new THREE.CanvasTexture(cv);tx.colorSpace=THREE.SRGBColorSpace;
  const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:tx,transparent:true,depthWrite:false}));sp.scale.set(4.2,1.05,1);sp.position.set(0,3.6,0);sp.userData.noOutline=true;g.add(sp);p.g=g;p.label=sp;multiLabel(p)}
function multiRemove(p,keepData){if(p.g){W0.remove(p.g);p.g.traverse(o=>{if(o.geometry&&o.geometry.dispose&&o.userData.own)o.geometry.dispose()});if(p.label){p.label.material.map.dispose();p.label.material.dispose()}p.g=null;p.label=null}}
function multiStep(dt){
  if(!MULTI.room)return;
  if(!MULTI.ws&&!MULTI.full&&(G.phase==='play'||G.phase==='chase'||G.phase==='caught')){MULTI.tRetry-=dt;if(MULTI.tRetry<=0){MULTI.tRetry=99;multiConnect()}}
  multiUi();if(!MULTI.on)return;
  const now=performance.now(),see=LV.id===0&&G.phase!=='title';
  /* senden: ca. 10 Mal pro Sekunde, nur in Port Lupo */
  MULTI.tSend-=dt;if(MULTI.tSend<=0&&LV.id===0&&(G.phase==='play'||G.phase==='chase'||G.phase==='caught')){MULTI.tSend=.1;multiSend({t:'s',x:P.x,y:P.y,z:P.z,h:P.h,v:P.speed,u:G.under?1:0})}
  if(typeof polNetOut==='function')polNetOut(dt);
  if(MULTI.sentSkin!==P.preset){MULTI.sentSkin=P.preset;multiSend({t:'skin',skin:P.preset})}
  MULTI.tPing-=dt;if(MULTI.tPing<=0){MULTI.tPing=25;multiPing()}
  /* andere Skater: glätten und zeichnen */
  MULTI.peers.forEach(p=>{const age=(now-p.seen)/1000,show=see&&p.has&&age<5&&(!!p.u)===(!!G.under);
    if(!show){if(p.g)p.g.visible=false;return}
    if(!p.g)multiBuild(p);const g=p.g;g.visible=true;
    const ex=Math.min(.25,age),k=1-Math.exp(-dt*11),tx=p.tx+Math.cos(p.th)*p.v*ex,tz=p.tz+Math.sin(p.th)*p.v*ex;
    p.x+=(tx-p.x)*k;p.z+=(tz-p.z)*k;p.y+=(p.ty-p.y)*k;let dh=p.th-p.h;dh=Math.atan2(Math.sin(dh),Math.cos(dh));p.h+=dh*k;
    g.position.set(p.x,p.y,p.z);g.rotation.y=Math.PI/2-p.h;g.rotation.z=Math.max(-.25,Math.min(.25,dh*.9))*Math.min(1,p.v/5)})}

/* ================= Terminal im Rarepod: Slash-Befehle und Text-Chat im Raum ================= */
const TERM={log:[],hud:null,help:['/chat name passwort  Raum erstellen oder beitreten (der Erste legt das Passwort fest)','/verlassen  Raum verlassen','/hilfe  diese Liste','Text ohne / geht als Nachricht an alle im Raum']};
function termHud(){if(TERM.hud)return TERM.hud;const d=document.createElement('div');d.id='chathud';(document.getElementById('ui')||document.body).appendChild(d);return TERM.hud=d}
function termAdd(kind,who,text){TERM.log.push({k:kind,w:who,t:text});if(TERM.log.length>80)TERM.log.shift();
  if(kind==='in'){const h=termHud(),l=document.createElement('div'),b=document.createElement('b');b.textContent=who+': ';l.appendChild(b);l.appendChild(document.createTextNode(text));h.appendChild(l);while(h.children.length>5)h.removeChild(h.firstChild);setTimeout(()=>{if(l.parentNode)l.parentNode.removeChild(l)},14000)}
  if(typeof termRender==='function')termRender()}
function termCmd(line){line=String(line||'').replace(/\s+/g,' ').trim().slice(0,200);if(!line)return;
  if(line[0]!=='/'){if(MULTI.on){multiSend({t:'chat',text:line});termAdd('me',MULTI.name,line)}else termAdd('sys','','Du bist in keinem Raum. Mit /chat name passwort beitreten.');return}
  termAdd('cmd','',line.replace(/^(\/chat\s+\S+\s+).*/i,'$1***'));
  const a=line.split(' '),c=a[0].toLowerCase();
  if(c==='/hilfe'||c==='/help'){TERM.help.forEach(h=>termAdd('sys','',h));return}
  if(c==='/verlassen'){if(!MULTI.room){termAdd('sys','','Du bist in keinem Raum.');return}termLeave();termAdd('sys','','Raum verlassen.');return}
  if(c==='/chat'){const n=(a[1]||'').toLowerCase(),pw=a[2]||'';
    if(!/^[a-z0-9-]{1,32}$/.test(n)||!pw||pw.length>32||a.length>3){termAdd('sys','','So geht es: /chat name passwort (Name: a-z, 0-9, Bindestrich; Passwort ohne Leerzeichen, bis 32 Zeichen)');return}
    termJoin(n,pw);return}
  termAdd('sys','','Unbekannter Befehl. /hilfe zeigt alle.')}
function termLeave(){const w=MULTI.ws;MULTI.ws=null;if(w){try{w.close()}catch(e){}}multiClear();MULTI.room=null;MULTI.pw='';MULTI.on=false;MULTI.full=false;MULTI.state='aus';multiUi()}
function termJoin(n,pw){const w=MULTI.ws;MULTI.ws=null;if(w){try{w.close()}catch(e){}}multiClear();
  MULTI.room=n;MULTI.pw=pw;MULTI.on=false;MULTI.full=false;MULTI.state='aus';MULTI.rtt=1e9;MULTI.retry=2;MULTI.tRetry=0;termAdd('sys','','Verbinde mit Raum "'+n+'" …');multiUi();multiConnect()}
