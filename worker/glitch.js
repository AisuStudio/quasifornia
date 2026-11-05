// Geteilter Stand der Glitch-Reparaturen (UBIQ): Wer zuerst repariert, gewinnt (atomar im Durable Object). Alle anderen sehen den Glitch als repariert.
// GET /api/glitch -> {fixed:{id:{t,by}}} · POST /api/glitch/<id> -> {first:true} oder {first:false,by,t} · POST /api/glitch/reset (nur mit Auswertungs-Passwort, siehe index.js)
import {cleanName} from './room.js';
export const GLITCH_ID=/^[a-z0-9-]{1,40}$/;
export class Glitch{
  constructor(state){this.sql=state.storage.sql;this.sql.exec('CREATE TABLE IF NOT EXISTS fixed(id TEXT PRIMARY KEY,t INTEGER,by TEXT)')}
  async fetch(request){
    const url=new URL(request.url),H={'content-type':'application/json; charset=utf-8','cache-control':'private, no-store','x-robots-tag':'noindex, nofollow'},J=(o,s)=>new Response(JSON.stringify(o),{status:s||200,headers:H});
    if(url.pathname==='/api/glitch'){if(request.method!=='GET')return J({error:'?'},405);const rows=this.sql.exec('SELECT id,t,by FROM fixed').toArray();return J({fixed:Object.fromEntries(rows.map(r=>[r.id,{t:r.t,by:r.by}]))})}
    if(url.pathname==='/api/glitch/reset'){if(request.method!=='POST')return J({error:'?'},405);this.sql.exec('DELETE FROM fixed');return J({ok:true})}
    const m=url.pathname.match(/^\/api\/glitch\/([^\/]+)$/);
    if(m&&request.method==='POST'){const id=m[1];if(!GLITCH_ID.test(id))return J({error:'Ungültige Kennung'},400);
      let by='';try{const txt=await request.text();if(txt.length<=300){const b=JSON.parse(txt||'{}');if(b&&typeof b.name==='string')by=cleanName(b.name)}}catch(e){}
      const ex=this.sql.exec('SELECT t,by FROM fixed WHERE id=?',id).toArray();if(ex.length)return J({first:false,by:ex[0].by,t:ex[0].t});
      this.sql.exec('INSERT INTO fixed(id,t,by) VALUES(?,?,?)',id,Date.now(),by);return J({first:true})}
    return J({error:'nicht gefunden'},404)}}
