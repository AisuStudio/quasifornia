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
  constructor(state){this.state=state;this.last=new Map();this.rate=new Map()}
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
    if(m.t==='ping'){this.send(ws,{t:'pong',now:Date.now(),c:typeof m.c==='number'?m.c:0});return}
    if(m.t==='name'){const a={...me,name:cleanName(m.name)};ws.serializeAttachment(a);for(const p of this.peers())if(p.a.id!==me.id)this.send(p.ws,{t:'name',id:me.id,name:a.name});return}
    if(m.t==='skin'&&SKIN_RE.test(m.skin)){const a={...me,skin:m.skin};ws.serializeAttachment(a);for(const p of this.peers())if(p.a.id!==me.id)this.send(p.ws,{t:'skin',id:me.id,skin:a.skin});return}}
  webSocketClose(ws){this.gone(ws)}
  webSocketError(ws){this.gone(ws)}
  gone(ws){const a=ws.deserializeAttachment();if(!a||!a.id)return;this.last.delete(a.id);this.rate.delete(a.id);for(const p of this.peers())if(p.a.id!==a.id)this.send(p.ws,{t:'leave',id:a.id})}}
