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
export class Planner{
  constructor(state){this.st=state.storage}
  async fetch(request){const H={'content-type':'application/json; charset=utf-8','cache-control':'no-store'},url=new URL(request.url);
    if(url.pathname!=='/api/planner')return new Response('?',{status:404});
    if(request.method==='GET'){const doc=(await this.st.get('doc'))||null,rev=(await this.st.get('rev'))||0;return new Response(JSON.stringify({rev,doc}),{headers:H})}
    if(request.method==='PUT'){const txt=await request.text();if(txt.length>MAX_BODY)return new Response(JSON.stringify({error:'zu groß'}),{status:413,headers:H});
      let b;try{b=JSON.parse(txt)}catch(e){return new Response(JSON.stringify({error:'kein JSON'}),{status:400,headers:H})}
      const doc=cleanDoc(b&&b.doc);if(!doc)return new Response(JSON.stringify({error:'Dokument ungültig'}),{status:400,headers:H});
      const rev=(await this.st.get('rev'))||0;
      if(!b||b.rev!==rev)return new Response(JSON.stringify({error:'Stand ist veraltet',rev}),{status:409,headers:H});
      await this.st.put({doc,rev:rev+1});return new Response(JSON.stringify({ok:true,rev:rev+1}),{headers:H})}
    return new Response('?',{status:405})}}
