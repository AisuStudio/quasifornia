// Freundes-Raum für bis zu 5 Spieler: reiner Relay-Server (der Server simuliert die Welt nicht).
// Jeder Browser sendet ca. 10 Mal pro Sekunde seine Position, der Server verteilt sie an die anderen und liefert die gemeinsame Uhr.
// Zugang: nur über den Passwortschutz in index.js, Räume heißen wie im Link (?raum=name), jeder Raum hat höchstens 5 Plätze.
export const ROOM_MAX=5,NAME_RE=/[^A-Za-z0-9ÄÖÜäöüß _-]/g,SKIN_RE=/^(#[0-9a-fA-F]{6}|D)$/;
const num=(v,lim)=>typeof v==='number'&&isFinite(v)&&Math.abs(v)<=lim;
export function cleanName(n){n=String(n==null?'':n).replace(NAME_RE,'').replace(/\s+/g,' ').trim().slice(0,12);return n||'Skater'}
export function cleanState(m){
  if(!m||m.t!=='s'||!num(m.x,3000)||!num(m.z,3000)||!num(m.y,500)||!num(m.h,100)||!num(m.v,100))return null;
  return {x:Math.round(m.x*100)/100,y:Math.round(m.y*100)/100,z:Math.round(m.z*100)/100,h:Math.round(m.h*1000)/1000,v:Math.round(m.v*10)/10,u:m.u?1:0,tr:m.tr&&typeof m.tr==='string'?m.tr.slice(0,10):0}}
export class Room{
  constructor(state){this.state=state;this.last=new Map();this.rate=new Map();this.inc=null;this.zrate=0}
  peers(){const out=[];for(const w of this.state.getWebSockets()){const a=w.deserializeAttachment();if(a&&a.id)out.push({ws:w,a})}return out}
  send(ws,o){try{ws.send(JSON.stringify(o))}catch(e){}}
  async fetch(request){
    if(request.headers.get('upgrade')!=='websocket')return new Response('WebSocket nötig',{status:426});
    const pair=new WebSocketPair(),client=pair[0],server=pair[1];
    this.state.acceptWebSocket(server);
    return new Response(null,{status:101,webSocket:client})}
  webSocketMessage(ws,raw){
    if(typeof raw!=='string'||raw.length>600)return;let m;try{m=JSON.parse(raw)}catch(e){return}
    const me=ws.deserializeAttachment()||{};
    if(m.t==='hello'){
      if(me.id)return;const peers=this.peers();if(peers.length>=ROOM_MAX){this.send(ws,{t:'full',max:ROOM_MAX});try{ws.close(4013,'Raum ist voll')}catch(e){}return}
      const id=Math.random().toString(36).slice(2,8),a={id,name:cleanName(m.name),skin:SKIN_RE.test(m.skin)?m.skin:'#d54291'};ws.serializeAttachment(a);
      this.send(ws,{t:'welcome',id,now:Date.now(),max:ROOM_MAX,players:peers.map(p=>({id:p.a.id,name:p.a.name,skin:p.a.skin,s:this.last.get(p.a.id)||null}))});
      for(const p of peers)this.send(p.ws,{t:'join',id,name:a.name,skin:a.skin});return}
    if(!me.id)return;
    if(m.t==='s'){const now=Date.now(),lr=this.rate.get(me.id)||0;if(now-lr<40)return;this.rate.set(me.id,now);
      const s=cleanState(m);if(!s)return;this.last.set(me.id,s);const out=JSON.stringify({t:'p',id:me.id,...s});
      for(const p of this.peers())if(p.a.id!==me.id){try{p.ws.send(out)}catch(e){}}return}
    if(m.t==='pol'){this.pol(ws,me,m);return}
    if(m.t==='polz'){const now=Date.now();if(!this.inc||this.inc.owner!==me.id||now-this.zrate<40||raw.length>1400)return;this.zrate=now;this.inc.last=now;
      const out=JSON.stringify({...m,id:me.id});for(const p of this.peers())if(p.a.id!==me.id){try{p.ws.send(out)}catch(e){}}return}
    if(m.t==='ping'){this.send(ws,{t:'pong',now:Date.now(),c:typeof m.c==='number'?m.c:0});return}
    if(m.t==='name'){const a={...me,name:cleanName(m.name)};ws.serializeAttachment(a);for(const p of this.peers())if(p.a.id!==me.id)this.send(p.ws,{t:'name',id:me.id,name:a.name});return}
    if(m.t==='skin'&&SKIN_RE.test(m.skin)){const a={...me,skin:m.skin};ws.serializeAttachment(a);for(const p of this.peers())if(p.a.id!==me.id)this.send(p.ws,{t:'skin',id:me.id,skin:a.skin});return}}
  /* Polizei im Raum: Wer zuerst sprüht, ist "owner" und wird gejagt; sein Browser rechnet die Polizei und sendet sie als "polz" an die anderen.
     Ein zweiter Sprüher ("second") bekommt später einen zweiten Wagen. Ein dritter wird abgewiesen. Die Warnung bekommt nur der Sprüher selbst. */
  polSend(id,o){for(const p of this.peers())if(p.a.id===id){this.send(p.ws,o);return true}return false}
  pol(ws,me,m){const now=Date.now(),I=this.inc;
    if(I&&now-I.last>600000)this.inc=null;
    if(m.a==='start'){const J=this.inc;
      if(!J){this.inc={owner:me.id,second:null,t0:now,last:now};this.send(ws,{t:'pol',a:'grant',role:'owner'});return}
      if(J.owner===me.id){J.last=now;this.send(ws,{t:'pol',a:'grant',role:'owner'});return}
      if(!J.second||J.second===me.id){J.second=me.id;this.send(ws,{t:'pol',a:'grant',role:'second'});return}
      this.send(ws,{t:'pol',a:'deny'});return}
    if(!I)return;
    if(m.a==='launch'&&I.second===me.id&&num(m.x,3000)&&num(m.z,3000)){this.polSend(I.owner,{t:'pol',a:'launch',from:me.id,x:m.x,z:m.z});return}
    if(I.owner!==me.id)return;
    if((m.a==='caught'||m.a==='free')&&I.second&&m.to===I.second){this.polSend(I.second,{t:'pol',a:m.a});if(m.a==='free'||m.a==='caught')I.second=null;return}
    if(m.a==='end'){this.inc=null;for(const p of this.peers())if(p.a.id!==me.id)this.send(p.ws,{t:'pol',a:'gone'});return}}
  webSocketClose(ws){this.gone(ws)}
  webSocketError(ws){this.gone(ws)}
  gone(ws){const a=ws.deserializeAttachment();if(!a||!a.id)return;const I=this.inc;if(I){if(I.owner===a.id){this.inc=null;for(const p of this.peers())if(p.a.id!==a.id)this.send(p.ws,{t:'pol',a:'gone'})}else if(I.second===a.id){I.second=null;this.polSend(I.owner,{t:'pol',a:'secondgone'})}}this.last.delete(a.id);this.rate.delete(a.id);for(const p of this.peers())if(p.a.id!==a.id)this.send(p.ws,{t:'leave',id:a.id})}}
