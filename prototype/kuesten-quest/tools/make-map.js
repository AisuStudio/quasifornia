// Wandelt die Karte (src/map/Map_1.svg) in Spieldaten um (src/map/map.json).
// Aufruf im Ordner prototype/kuesten-quest: node tools/make-map.js
// Erkannt wird nach Farben und Linienstärken, die Ebenen müssen nicht benannt sein:
//   Füllung  #03aee5 Wasser, #e9cb92 Land, #6cbe45 Park/Bäume, #f59ebb Gebäude/Marker, #d8d8d8 Parkplatz, #c2922c Sportplatz
//   Linie    weiß 15/7/3 Straßen, rot durchgezogen = S-Bahn oberirdisch, rot gestrichelt = unterirdisch
const {chromium}=require('playwright');const fs=require('fs'),path=require('path');
const R=path.join(__dirname,'..');
(async()=>{
 const svg=fs.readFileSync(path.join(R,'src/map/Map_1.svg'),'utf8').replace(/<\?xml[^>]*\?>/,'');
 const b=await chromium.launch();const p=await b.newPage({viewport:{width:1000,height:800}});
 await p.setContent('<body style="margin:0">'+svg.replace('<svg ','<svg width="3561.09" height="2766.22" ')+'</body>');
 const data=await p.evaluate(()=>{
  const S=document.querySelector('svg'),VB=S.viewBox.baseVal;const inv=S.getScreenCTM().inverse();
  const rnd=v=>Math.round(v*10)/10;
  const tp=(el,x,y)=>{const m=inv.multiply(el.getScreenCTM());const q=new DOMPoint(x,y).matrixTransform(m);return [rnd(q.x),rnd(q.y)]};
  function dpOpen(pts,eps){
    if(pts.length<3)return pts;const keep=new Uint8Array(pts.length);keep[0]=keep[pts.length-1]=1;
    const st=[[0,pts.length-1]];while(st.length){const [a,c]=st.pop();let md=0,mi=-1;const [ax,ay]=pts[a],[cx,cy]=pts[c];const dx=cx-ax,dy=cy-ay,L=Math.hypot(dx,dy)||1e-9;
      for(let i=a+1;i<c;i++){const d=Math.abs((pts[i][0]-ax)*dy-(pts[i][1]-ay)*dx)/L;if(d>md){md=d;mi=i}}
      if(md>eps&&mi>0){keep[mi]=1;st.push([a,mi],[mi,c])}}
    return pts.filter((_,i)=>keep[i])}
  function dp(pts,eps,closed){
    if(!closed)return dpOpen(pts,eps);
    let P=pts.slice();const f=P[0],l=P[P.length-1];if(Math.hypot(f[0]-l[0],f[1]-l[1])<.01)P.pop();
    if(P.length<4)return P;let m=0,md=-1;for(let i=1;i<P.length;i++){const d=Math.hypot(P[i][0]-P[0][0],P[i][1]-P[0][1]);if(d>md){md=d;m=i}}
    const A=dpOpen(P.slice(0,m+1),eps),B=dpOpen(P.slice(m).concat([P[0]]),eps);return A.concat(B.slice(1,-1))}
  function contours(el){ // alle Teilpfade als Punktlisten (Dokumentkoordinaten)
    const tag=el.tagName.toLowerCase(),out=[];
    if(tag==='polygon'||tag==='polyline'){const pts=[...el.points].map(q=>tp(el,q.x,q.y));out.push({pts,closed:tag==='polygon'})}
    else if(tag==='rect'){const x=+el.getAttribute('x'),y=+el.getAttribute('y'),w=+el.getAttribute('width'),h=+el.getAttribute('height');out.push({pts:[[x,y],[x+w,y],[x+w,y+h],[x,y+h]].map(q=>tp(el,q[0],q[1])),closed:true})}
    else if(tag==='line'){out.push({pts:[tp(el,+el.getAttribute('x1'),+el.getAttribute('y1')),tp(el,+el.getAttribute('x2'),+el.getAttribute('y2'))],closed:false})}
    else if(tag==='circle'){const cx=+el.getAttribute('cx'),cy=+el.getAttribute('cy'),r=+el.getAttribute('r');const pts=[];for(let i=0;i<16;i++){const a=i/16*Math.PI*2;pts.push(tp(el,cx+Math.cos(a)*r,cy+Math.sin(a)*r))}out.push({pts,closed:true,circle:[tp(el,cx,cy),r]})}
    else if(tag==='path'){const d=el.getAttribute('d');const subs=d.split(/(?=M)/).filter(s=>s.trim());
      for(const sd of subs){const t=document.createElementNS('http://www.w3.org/2000/svg','path');t.setAttribute('d',sd);if(el.getAttribute('transform'))t.setAttribute('transform',el.getAttribute('transform'));el.parentNode.appendChild(t);
        const L=t.getTotalLength(),n=Math.max(2,Math.ceil(L/3)),pts=[];for(let i=0;i<=n;i++){const q=t.getPointAtLength(L*i/n);pts.push(tp(t,q.x,q.y))}
        const closed=/[zZ]\s*$/.test(sd.trim());el.parentNode.removeChild(t);out.push({pts,closed})}}
    return out}
  const col=s=>{const m=s.match(/rgba?\((\d+), (\d+), (\d+)/);if(!m)return null;return '#'+[1,2,3].map(i=>(+m[i]).toString(16).padStart(2,'0')).join('')};
  const res={W:VB.width,H:VB.height,sea:[],land:[],water:[],parks:[],trees:[],lots:[],courts:[],buildings:[],markers:[],roads:[],paths:[],rail:[],labels:[],other:[]};
  const els=[...S.querySelectorAll('polygon,path,rect,circle,line,polyline')];
  for(const el of els){const cs=getComputedStyle(el),fill=cs.fill==='none'?null:col(cs.fill),stroke=cs.stroke==='none'?null:col(cs.stroke),sw=parseFloat(cs.strokeWidth)||0,dash=cs.strokeDasharray&&cs.strokeDasharray!=='none';
   const cn=contours(el);if(!cn.length)continue;
   if(fill){const C=cn.filter(c=>c.pts.length>=3).map(c=>dp(c.pts,.7,true));if(!C.length)continue;const item={c:C};
    if(fill==='#03aee5'){const xs=C[0].map(q=>q[0]),ys=C[0].map(q=>q[1]);const big=Math.max(...xs)-Math.min(...xs)>3000&&Math.max(...ys)-Math.min(...ys)>2400;(big?res.sea:res.water).push(item)}
    else if(fill==='#e9cb92')res.land.push(item);
    else if(fill==='#6cbe45'){if(el.tagName==='circle'){res.trees.push({x:cn[0].circle[0][0],y:cn[0].circle[0][1],r:cn[0].circle[1]})}else res.parks.push(item)}
    else if(fill==='#f59ebb'){if(el.tagName==='circle'&&cn[0].circle)res.markers.push({x:cn[0].circle[0][0],y:cn[0].circle[0][1],r:cn[0].circle[1]});else res.buildings.push(item)}
    else if(fill==='#d8d8d8')res.lots.push(item);
    else if(fill==='#c2922c')res.courts.push(item);
    else if(!stroke&&!['#231f20','#ffffff','#2b338e'].includes(fill))res.other.push({fill,n:C.length})}
   if(stroke){const w=sw;for(const c of cn){if(c.pts.length<2)continue;const pts=dp(c.pts,.6,false);
     if(stroke==='#ffffff')(w>=12?res.roads:w>=5?res.roads:res.paths).push({w,pts,closed:c.closed});
     else if(stroke==='#ed2024')res.rail.push({dash:!!dash,w,pts});
     else if(stroke==='#e9cb92')res.paths.push({w,pts,sand:1});
     }}}
  for(const t of S.querySelectorAll('text')){const bb=t.getBBox();const c=tp(t,bb.x+bb.width/2,bb.y+bb.height/2);const m=inv.multiply(t.getScreenCTM());const rot=Math.round(Math.atan2(m.b,m.a)*180/Math.PI);res.labels.push({t:t.textContent.replace(/\s+/g,' ').trim(),x:c[0],y:c[1],rot})}
  return res});
 await b.close();
 // Kleinkram runden
 const out=path.join(R,'src/map/map.json');fs.writeFileSync(out,JSON.stringify(data));
 const n=k=>Array.isArray(data[k])?data[k].length:0;
 console.log('geschrieben',out,(fs.statSync(out).size/1024).toFixed(0)+' KB');
 console.log(Object.keys(data).filter(k=>Array.isArray(data[k])).map(k=>k+':'+n(k)).join('  '));
 console.log('Beschriftungen:',data.labels.map(l=>l.t).join(' | '));
 console.log('Andere Füllungen:',JSON.stringify(data.other));
 console.log('Straßenbreiten:',[...new Set(data.roads.map(r=>r.w))].join(','),' Pfade:',[...new Set(data.paths.map(r=>r.w+(r.sand?'s':'')))].join(','));
 console.log('Rail:',data.rail.map(r=>(r.dash?'U ':'O ')+r.pts.length+'p').join(', '));
})();
