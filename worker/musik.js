// Musik aus dem R2-Bucket (Binding MUSIK): Liste unter /api/musik, Dateien unter /musik/<datei> (mit Range für Spulen und Streaming).
// Optional liegt im Bucket eine Datei musik.json mit Titelangaben: [{"file":"song.m4a","title":"Titel","artist":"Künstler","info":"Album, Jahr"}]
export const MUSIK_RE=/^(?!.*\.\.)(?!\/)[\w .,'&()+\-\/]{1,160}\.(m4a|mp3|ogg|aac|wav|flac)$/i;
export const DESIGN_RE=/^(?!.*\.\.)(?!\/)[\w .,'&()+\-\/]{1,160}\.(png|jpe?g|webp)$/i;
const TYPES={m4a:'audio/mp4',mp3:'audio/mpeg',ogg:'audio/ogg',aac:'audio/aac',wav:'audio/wav',flac:'audio/flac',png:'image/png',jpg:'image/jpeg',jpeg:'image/jpeg',webp:'image/webp',json:'application/json; charset=utf-8'};
const J={'content-type':'application/json; charset=utf-8','cache-control':'private, no-store'};
export function niceTitle(key){return key.split('/').pop().replace(/\.[^.]+$/,'').replace(/[_]+/g,' ').replace(/\s+/g,' ').trim()}
export async function musikList(env){
  if(!env.MUSIK)return new Response(JSON.stringify({tracks:[]}),{headers:J});
  const l=await env.MUSIK.list({limit:500});let man=[];
  if(l.objects.some(o=>o.key==='musik.json')){try{const o=await env.MUSIK.get('musik.json');const j=JSON.parse(await o.text());if(Array.isArray(j))man=j}catch(e){}}
  const by=new Map(man.filter(m=>m&&typeof m.file==='string').map(m=>[m.file,m]));
  const tracks=l.objects.filter(o=>MUSIK_RE.test(o.key)).map(o=>{const m=by.get(o.key)||{};return {key:o.key,size:o.size,title:String(m.title||niceTitle(o.key)).slice(0,80),artist:String(m.artist||'').slice(0,120),info:String(m.info||'').slice(0,160)}}).sort((a,b)=>a.key.localeCompare(b.key));
  return new Response(JSON.stringify({tracks}),{headers:J})}
export async function r2File(bucket,request,key,re){
  if(!bucket||!re.test(key))return new Response('nicht gefunden',{status:404});
  const rng=request.headers.get('range');let obj;
  try{obj=await bucket.get(key,rng?{range:request.headers}:{})}catch(e){return new Response('Bereich ungültig',{status:416})}
  if(!obj)return new Response('nicht gefunden',{status:404});
  const h=new Headers();try{obj.writeHttpMetadata(h)}catch(e){}
  if(!h.get('content-type'))h.set('content-type',TYPES[key.split('.').pop().toLowerCase()]||'application/octet-stream');
  h.set('etag',obj.httpEtag);h.set('accept-ranges','bytes');h.set('cache-control',key.endsWith('.json')?'private, no-cache':'private, max-age=3600');h.set('x-robots-tag','noindex');
  let status=200;
  if(rng&&obj.range&&typeof obj.range.offset==='number'){const off=obj.range.offset,len=obj.range.length===undefined?obj.size-off:obj.range.length;status=206;h.set('content-range','bytes '+off+'-'+(off+len-1)+'/'+obj.size);h.set('content-length',String(len))}
  else h.set('content-length',String(obj.size));
  if(request.method==='HEAD')return new Response(null,{status,headers:h});
  return new Response(obj.body,{status,headers:h})}
export function musikFile(env,request,key){return r2File(env.MUSIK,request,key,MUSIK_RE)}
/* Deck-Designs (Popsicle-Grafiken) aus dem Bucket "designs", Ordner decks/ */
export async function designList(env,prefix){
  if(!env.DESIGNS)return new Response(JSON.stringify({decks:[]}),{headers:J});
  const l=await env.DESIGNS.list({prefix:prefix||'decks/',limit:500});
  const decks=l.objects.filter(o=>DESIGN_RE.test(o.key)&&o.size<6e6).map(o=>({key:o.key,size:o.size,title:niceTitle(o.key)})).sort((a,b)=>a.key.localeCompare(b.key));
  return new Response(JSON.stringify({decks}),{headers:J})}
export function designFile(env,request,key){return r2File(env.DESIGNS,request,key,DESIGN_RE)}
