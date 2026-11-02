// Misst pro Welt: Dreiecke, Zeichenaufrufe, Geometrien, Texturen und die Zeit für einen Frame (Software-Rendering, nur relativ aussagekräftig).
const {chromium}=require('playwright');const http=require('http'),fs=require('fs'),path=require('path');
const srv=http.createServer((q,s)=>{const u=q.url.split('?')[0];const f=u==='/'?path.join(__dirname,'..','dist/dev.html'):path.join(__dirname,'..',u);fs.readFile(f,(e,d)=>{if(e){s.writeHead(404);s.end();return}s.writeHead(200,{'content-type':f.endsWith('.js')?'text/javascript; charset=utf-8':'text/html; charset=utf-8'});s.end(d)})}).listen(8816,async()=>{
 const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
 const p=await b.newPage({viewport:{width:1100,height:620}});p.on('pageerror',e=>console.log('ERR',e.message));
 await p.route(/fonts\.(googleapis|gstatic)\.com/,r=>r.abort());
 const t0=Date.now();await p.goto('http://localhost:8816/?test=1&alt=1');await p.waitForFunction('window.__ready',null,{timeout:120000});
 console.log('Ladezeit bis bereit (ms):',Date.now()-t0);
 for(const n of [0,1,2,3,4,5]){
  const row=await p.evaluate(async(n)=>{const q=__qa;const t=performance.now();q.applyLevel(n);q.beginPlay();const build=performance.now()-t;q.step(.03);
    const r=q.R;r.info.reset();r.render(q.sc,q.cam);const i=r.info;const out={n,aufbauMs:Math.round(build),tris:i.render.triangles,calls:i.render.calls,geo:i.memory.geometries,tex:i.memory.textures};
    const t1=performance.now();for(let k=0;k<10;k++)q.render();out.frameMs=Math.round((performance.now()-t1)/10);
    let meshes=0,inst=0,vis=0;q.sc.traverse(o=>{if(o.isMesh){meshes++;if(o.visible)vis++;if(o.isInstancedMesh)inst++}});out.meshes=meshes;out.sichtbar=vis;out.instanced=inst;return out},n);
  console.log(JSON.stringify(row))}
 await b.close();srv.close()})
