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
/* Dokumente: "main" (Hauptplan) und Entwürfe. Jedes Dokument hat eigenen Stand, eigene rev und eigene Versionen.
   Versionen: Schnappschüsse des Dokuments in einer SQLite-Tabelle desselben Durable Objects.
   Automatisch: höchstens alle 10 Minuten (Stand vor dem Überschreiben) und sofort, wenn ein Speichern den Plan stark schrumpfen lässt.
   Benannte Versionen (keep=1) bleiben, automatische werden auf die neuesten 50 gekürzt (je Dokument). */
export const SNAP_EVERY=10*60000,KEEP_AUTO=50,MAX_KEPT=100,SHRINK=0.7,SHRINK_MIN=5,MAX_DOCS=20;
export const countNodes=d=>Object.values(d.graphs).reduce((a,g)=>a+Object.keys(g.nodes).length,0);
const countEdges=d=>Object.values(d.graphs).reduce((a,g)=>a+g.edges.length,0);
const DOC_ID=/^[a-z0-9]{3,16}$/;
const kd=id=>id==='main'?'doc':'doc:'+id,kr=id=>id==='main'?'rev':'rev:'+id,ks=id=>id==='main'?'snapT':'snapT:'+id,ku=id=>'upd:'+id;
export const blankDoc=name=>({v:1,root:'g0',title:str(name,80),graphs:{g0:{id:'g0',name:str(name,80),parent:null,nodes:{},edges:[]}}});
export class Planner{
  constructor(state){this.st=state.storage;this.sql=state.storage.sql||null;this.now=()=>Date.now();
    if(this.sql){this.sql.exec("CREATE TABLE IF NOT EXISTS ver(id INTEGER PRIMARY KEY AUTOINCREMENT,t INTEGER,label TEXT,keep INTEGER,nodes INTEGER,edges INTEGER,rev INTEGER,doc TEXT,did TEXT DEFAULT 'main')");
      try{this.sql.exec("ALTER TABLE ver ADD COLUMN did TEXT DEFAULT 'main'")}catch(e){}}}
  rows(q,...a){return this.sql.exec(q,...a).toArray()}
  async docsList(){let r=await this.st.get('docs');if(!Array.isArray(r)||!r.length){r=[{id:'main',name:'Hauptplan',created:this.now()}];await this.st.put({docs:r})}return r}
  snapshot(did,doc,rev,label,keep){
    this.sql.exec('INSERT INTO ver(t,label,keep,nodes,edges,rev,doc,did) VALUES(?,?,?,?,?,?,?,?)',this.now(),str(label,60),keep?1:0,countNodes(doc),countEdges(doc),rev,JSON.stringify(doc),did);
    this.sql.exec('DELETE FROM ver WHERE did=? AND keep=0 AND id NOT IN (SELECT id FROM ver WHERE did=? AND keep=0 ORDER BY id DESC LIMIT '+KEEP_AUTO+')',did,did)}
  /* Vor dem Überschreiben: den alten Stand sichern, wenn Zeit oder Schrumpfen es verlangen. */
  async autoSnap(did,prev,prevRev,next){
    if(!this.sql)return;const now=this.now();if(!prev){await this.st.put({[ks(did)]:now});return}
    const lastT=(await this.st.get(ks(did)))||0,a=countNodes(prev),b=countNodes(next);
    const shrink=a>=SHRINK_MIN&&b<a*SHRINK;
    if(!shrink&&now-lastT<SNAP_EVERY)return;
    const l=this.rows('SELECT doc FROM ver WHERE did=? ORDER BY id DESC LIMIT 1',did)[0],pj=JSON.stringify(prev);
    if(l&&l.doc===pj&&!shrink){await this.st.put({[ks(did)]:now});return}
    this.snapshot(did,prev,prevRev,shrink?'Automatisch (vor starkem Schrumpfen)':'Automatisch',false);await this.st.put({[ks(did)]:now})}
  async fetch(request){const H={'content-type':'application/json; charset=utf-8','cache-control':'no-store'},url=new URL(request.url),J=(o,s=200)=>new Response(JSON.stringify(o),{status:s,headers:H}),M=request.method;
    const dq=url.searchParams.get('d')||'main';
    const needDoc=async()=>{if(!DOC_ID.test(dq))return null;return (await this.docsList()).some(x=>x.id===dq)?dq:null};
    if(url.pathname==='/api/planner'){
      const did=await needDoc();if(!did)return J({error:'Dokument nicht gefunden'},404);
      if(M==='GET'){const doc=(await this.st.get(kd(did)))||null,rev=(await this.st.get(kr(did)))||0;return J({rev,doc})}
      if(M==='PUT'){const txt=await request.text();if(txt.length>MAX_BODY)return J({error:'zu groß'},413);
        let b;try{b=JSON.parse(txt)}catch(e){return J({error:'kein JSON'},400)}
        const doc=cleanDoc(b&&b.doc);if(!doc)return J({error:'Dokument ungültig'},400);
        const rev=(await this.st.get(kr(did)))||0;
        if(!b||b.rev!==rev)return J({error:'Stand ist veraltet',rev},409);
        await this.autoSnap(did,(await this.st.get(kd(did)))||null,rev,doc);
        await this.st.put({[kd(did)]:doc,[kr(did)]:rev+1,[ku(did)]:this.now()});return J({ok:true,rev:rev+1})}
      return new Response('?',{status:405})}
    const md=url.pathname.match(/^\/api\/planner\/docs(?:\/([a-z0-9]{3,16}))?$/);
    if(md){const id=md[1];
      if(!id){
        if(M==='GET'){const out=[];for(const x of await this.docsList()){const d=await this.st.get(kd(x.id));out.push({id:x.id,name:x.name,created:x.created,updated:(await this.st.get(ku(x.id)))||x.created,nodes:d?countNodes(d):0})}return J({docs:out})}
        if(M==='POST'){let b;try{b=JSON.parse(await request.text()||'{}')}catch(e){return J({error:'kein JSON'},400)}
          const list=await this.docsList();if(list.length>=MAX_DOCS)return J({error:'Zu viele Dokumente (höchstens '+MAX_DOCS+')'},409);
          const name=str(b.name,60).trim();if(!name)return J({error:'Name fehlt'},400);
          let doc;
          if(b.from==='copy'){const sd=DOC_ID.test(String(b.d||'main'))?String(b.d||'main'):'';if(!list.some(x=>x.id===sd))return J({error:'Quelle nicht gefunden'},404);doc=await this.st.get(kd(sd));if(!doc)return J({error:'Quelle ist leer'},400)}
          else if(b.from==='version'){if(!this.sql)return J({error:'Versionen nicht verfügbar'},501);const vid=parseInt(b.version,10),r=vid>0?this.rows('SELECT doc FROM ver WHERE id=?',vid)[0]:null;if(!r)return J({error:'Version nicht gefunden'},404);doc=cleanDoc(JSON.parse(r.doc));if(!doc)return J({error:'Version unlesbar'},400)}
          else doc=blankDoc(name);
          let id;do{id=Math.random().toString(36).slice(2,10)}while(id.length<3||list.some(x=>x.id===id));
          list.push({id,name,created:this.now()});
          await this.st.put({docs:list,[kd(id)]:doc,[kr(id)]:0,[ks(id)]:this.now(),[ku(id)]:this.now()});return J({ok:true,id})}
        return new Response('?',{status:405})}
      const list=await this.docsList(),ex=list.find(x=>x.id===id);if(!ex)return J({error:'Dokument nicht gefunden'},404);
      if(M==='PUT'){let b;try{b=JSON.parse(await request.text()||'{}')}catch(e){return J({error:'kein JSON'},400)}const name=str(b.name,60).trim();if(!name)return J({error:'Name fehlt'},400);ex.name=name;await this.st.put({docs:list});return J({ok:true})}
      if(M==='DELETE'){if(id==='main')return J({error:'Der Hauptplan lässt sich nicht löschen'},400);
        await this.st.put({docs:list.filter(x=>x.id!==id)});await this.st.delete([kd(id),kr(id),ks(id),ku(id)]);if(this.sql)this.sql.exec('DELETE FROM ver WHERE did=?',id);return J({ok:true})}
      return new Response('?',{status:405})}
    const mv=url.pathname.match(/^\/api\/planner\/versions(?:\/(\d+))?$/);
    if(mv){
      if(!this.sql)return J({error:'Versionen nicht verfügbar'},501);
      const did=await needDoc();if(!did)return J({error:'Dokument nicht gefunden'},404);
      if(!mv[1]){
        if(M==='GET')return J({versions:this.rows('SELECT id,t,label,keep,nodes,edges,rev FROM ver WHERE did=? ORDER BY id DESC',did)});
        if(M==='POST'){let b={};try{b=JSON.parse(await request.text()||'{}')}catch(e){return J({error:'kein JSON'},400)}
          const doc=(await this.st.get(kd(did)))||null;if(!doc)return J({error:'Noch nichts gespeichert'},400);
          if(this.rows('SELECT COUNT(*) AS n FROM ver WHERE did=? AND keep=1',did)[0].n>=MAX_KEPT)return J({error:'Zu viele benannte Versionen (höchstens '+MAX_KEPT+')'},409);
          this.snapshot(did,doc,(await this.st.get(kr(did)))||0,b.label||'Version',true);return J({ok:true,id:this.rows('SELECT MAX(id) AS id FROM ver')[0].id})}
        return new Response('?',{status:405})}
      const id=parseInt(mv[1],10);if(!(id>0))return J({error:'?'},404);
      if(M==='GET'){const r=this.rows('SELECT id,t,label,keep,nodes,edges,rev,doc FROM ver WHERE id=? AND did=?',id,did)[0];if(!r)return J({error:'nicht gefunden'},404);const {doc,...meta}=r;return J({...meta,doc:JSON.parse(doc)})}
      if(M==='DELETE'){const r=this.rows('SELECT id FROM ver WHERE id=? AND did=?',id,did)[0];if(!r)return J({error:'nicht gefunden'},404);this.sql.exec('DELETE FROM ver WHERE id=?',id);return J({ok:true})}
      return new Response('?',{status:405})}
    return new Response('?',{status:404})}}
