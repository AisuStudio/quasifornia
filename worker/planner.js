// Planner: Planungsdokument für das Spiel (Kapitel, Knoten, Verzweigungen). Liegt nur im Durable Object, nie im Repo.
// Ein Dokument, ein Zähler (rev) gegen versehentliches Überschreiben von einem zweiten Gerät.
// Seite /planner und /api/planner sind mit dem Auswertungspasswort geschützt (siehe index.js).
export const NODE_TYPES=new Set(['scene','branch','note','chapter']);
const MAX_BODY=1500000,MAX_GRAPHS=200,MAX_NODES=2000,MAX_EDGES=4000;
const ID=/^[A-Za-z0-9_-]{1,24}$/;
const str=(v,n)=>String(v==null?'':v).replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g,' ').slice(0,n);
const num=(v,lim)=>typeof v==='number'&&isFinite(v)?Math.max(-lim,Math.min(lim,v)):0;
/* Prüft und säubert ein Dokument. Gibt null zurück, wenn es nicht passt. Reine Funktion, gut zu testen. */
export function cleanDoc(d){
  if(!d||typeof d!=='object'||d.v!==1||typeof d.root!=='string'||!d.graphs||typeof d.graphs!=='object')return null;
  const gids=Object.keys(d.graphs);if(!gids.length||gids.length>MAX_GRAPHS||!gids.every(k=>ID.test(k))||!d.graphs[d.root])return null;
  const out={v:1,root:d.root,title:str(d.title,80),graphs:{}};
  for(const gid of gids){
    const g=d.graphs[gid];if(!g||typeof g!=='object'||!g.nodes||typeof g.nodes!=='object'||!Array.isArray(g.edges))return null;
    const nids=Object.keys(g.nodes);if(nids.length>MAX_NODES||g.edges.length>MAX_EDGES||!nids.every(k=>ID.test(k)))return null;
    const cg={id:gid,name:str(g.name,80),parent:typeof g.parent==='string'&&ID.test(g.parent)?g.parent:null,nodes:{},edges:[]};
    for(const nid of nids){const n=g.nodes[nid];if(!n||typeof n!=='object'||!NODE_TYPES.has(n.type))return null;
      cg.nodes[nid]={id:nid,type:n.type,title:str(n.title,120),text:str(n.text,4000),x:num(n.x,1e6),y:num(n.y,1e6),mandatory:!!n.mandatory};
      if(n.type==='chapter'&&typeof n.graph==='string'&&ID.test(n.graph))cg.nodes[nid].graph=n.graph}
    const seen=new Set();
    for(const e of g.edges){if(!e||typeof e!=='object'||!ID.test(String(e.id))||!cg.nodes[e.from]||!cg.nodes[e.to]||e.from===e.to)return null;
      const k=e.from+'>'+e.to;if(seen.has(k))continue;seen.add(k);cg.edges.push({id:String(e.id),from:e.from,to:e.to,label:str(e.label,60)})}
    out.graphs[gid]=cg}
  for(const gid of gids){const g=out.graphs[gid];for(const n of Object.values(g.nodes))if(n.graph&&!out.graphs[n.graph])delete n.graph}
  return out}
/* Versionen: Schnappschüsse des Dokuments in einer SQLite-Tabelle desselben Durable Objects.
   Automatisch: höchstens alle 10 Minuten (Stand vor dem Überschreiben) und sofort, wenn ein Speichern den Plan stark schrumpfen lässt.
   Benannte Versionen (keep=1) bleiben, automatische werden auf die neuesten 50 gekürzt. */
export const SNAP_EVERY=10*60000,KEEP_AUTO=50,MAX_KEPT=100,SHRINK=0.7,SHRINK_MIN=5;
export const countNodes=d=>Object.values(d.graphs).reduce((a,g)=>a+Object.keys(g.nodes).length,0);
const countEdges=d=>Object.values(d.graphs).reduce((a,g)=>a+g.edges.length,0);
export class Planner{
  constructor(state){this.st=state.storage;this.sql=state.storage.sql||null;this.now=()=>Date.now();
    if(this.sql)this.sql.exec('CREATE TABLE IF NOT EXISTS ver(id INTEGER PRIMARY KEY AUTOINCREMENT,t INTEGER,label TEXT,keep INTEGER,nodes INTEGER,edges INTEGER,rev INTEGER,doc TEXT)')}
  rows(q,...a){return this.sql.exec(q,...a).toArray()}
  snapshot(doc,rev,label,keep){
    this.sql.exec('INSERT INTO ver(t,label,keep,nodes,edges,rev,doc) VALUES(?,?,?,?,?,?,?)',this.now(),str(label,60),keep?1:0,countNodes(doc),countEdges(doc),rev,JSON.stringify(doc));
    this.sql.exec('DELETE FROM ver WHERE keep=0 AND id NOT IN (SELECT id FROM ver WHERE keep=0 ORDER BY id DESC LIMIT '+KEEP_AUTO+')')}
  /* Vor dem Überschreiben: den alten Stand sichern, wenn Zeit oder Schrumpfen es verlangen. */
  async autoSnap(prev,prevRev,next){
    if(!this.sql)return;const now=this.now();if(!prev){await this.st.put({snapT:now});return}
    const lastT=(await this.st.get('snapT'))||0,a=countNodes(prev),b=countNodes(next);
    const shrink=a>=SHRINK_MIN&&b<a*SHRINK;
    if(!shrink&&now-lastT<SNAP_EVERY)return;
    const l=this.rows('SELECT doc FROM ver ORDER BY id DESC LIMIT 1')[0],pj=JSON.stringify(prev);
    if(l&&l.doc===pj&&!shrink){await this.st.put({snapT:now});return}
    this.snapshot(prev,prevRev,shrink?'Automatisch (vor starkem Schrumpfen)':'Automatisch',false);await this.st.put({snapT:now})}
  async fetch(request){const H={'content-type':'application/json; charset=utf-8','cache-control':'no-store'},url=new URL(request.url),J=(o,s=200)=>new Response(JSON.stringify(o),{status:s,headers:H});
    if(url.pathname==='/api/planner'){
      if(request.method==='GET'){const doc=(await this.st.get('doc'))||null,rev=(await this.st.get('rev'))||0;return J({rev,doc})}
      if(request.method==='PUT'){const txt=await request.text();if(txt.length>MAX_BODY)return J({error:'zu groß'},413);
        let b;try{b=JSON.parse(txt)}catch(e){return J({error:'kein JSON'},400)}
        const doc=cleanDoc(b&&b.doc);if(!doc)return J({error:'Dokument ungültig'},400);
        const rev=(await this.st.get('rev'))||0;
        if(!b||b.rev!==rev)return J({error:'Stand ist veraltet',rev},409);
        await this.autoSnap((await this.st.get('doc'))||null,rev,doc);
        await this.st.put({doc,rev:rev+1});return J({ok:true,rev:rev+1})}
      return new Response('?',{status:405})}
    if(url.pathname==='/api/planner/versions'||url.pathname.startsWith('/api/planner/versions/')){
      if(!this.sql)return J({error:'Versionen nicht verfügbar'},501);
      if(url.pathname==='/api/planner/versions'){
        if(request.method==='GET')return J({versions:this.rows('SELECT id,t,label,keep,nodes,edges,rev FROM ver ORDER BY id DESC')});
        if(request.method==='POST'){let b={};try{b=JSON.parse(await request.text()||'{}')}catch(e){return J({error:'kein JSON'},400)}
          const doc=(await this.st.get('doc'))||null;if(!doc)return J({error:'Noch nichts gespeichert'},400);
          if(this.rows('SELECT COUNT(*) AS n FROM ver WHERE keep=1')[0].n>=MAX_KEPT)return J({error:'Zu viele benannte Versionen (höchstens '+MAX_KEPT+')'},409);
          this.snapshot(doc,(await this.st.get('rev'))||0,b.label||'Version',true);return J({ok:true,id:this.rows('SELECT MAX(id) AS id FROM ver')[0].id})}
        return new Response('?',{status:405})}
      const id=parseInt(url.pathname.slice(22),10);if(!(id>0))return J({error:'?'},404);
      if(request.method==='GET'){const r=this.rows('SELECT id,t,label,keep,nodes,edges,rev,doc FROM ver WHERE id=?',id)[0];if(!r)return J({error:'nicht gefunden'},404);const {doc,...meta}=r;return J({...meta,doc:JSON.parse(doc)})}
      if(request.method==='DELETE'){const r=this.rows('SELECT id FROM ver WHERE id=?',id)[0];if(!r)return J({error:'nicht gefunden'},404);this.sql.exec('DELETE FROM ver WHERE id=?',id);return J({ok:true})}
      return new Response('?',{status:405})}
    return new Response('?',{status:404})}}
