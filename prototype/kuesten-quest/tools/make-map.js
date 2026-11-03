// Wandelt die Karte aus Affinity (src/map/map.svg) in Spieldaten um (src/map/map.json).
// Aufruf im Ordner prototype/kuesten-quest:  node tools/make-map.js [Datei.svg]
// Die Datei heißt immer src/map/map.svg und wird bei jedem Update überschrieben (Map_1.svg ist nur noch Historie).
//
// MASSSTAB: automatisch. Die breiteste weiße Linie (Hauptstraße/Promenade) gilt als 15 Karteneinheiten (= 7,5 m).
//   Beispiel: Breite 62.5 in Affinity -> Faktor 4.1667. Alle Koordinaten werden durch diesen Faktor geteilt, 1 Einheit = 0,5 m.
//   Heißt: in Affinity einfach beliebig skalieren, solange die Hauptstraße die breiteste weiße Linie bleibt.
//
// ERKENNUNG: zuerst über den EBENENNAMEN (Affinity-Ebene bzw. Gruppe, Ziffern am Ende egal, Groß/Klein egal), dann über FARBEN (Toleranz).
//   Ebenenname (auch "Palmen 7", "Bench3" ...)        Bedeutung
//     Palmen / Palme / Palm                          hohe Palme (jeder kleine Kreis = eine Palme)
//     Bench / Bank / Parkbank                        Parkbank (gedrehtes Rechteck, Länge und Richtung werden übernommen)
//     Hafenmauer / Mauer / Wall                      Mauer (Strich), blockiert, ca. 1,6 m hoch
//     Wasser / Water, Land, Park, Parkplatz / Parking, Sportplatz / Court, Gebaeude / Building,
//     Strasse / Road, Weg / Path, Schiene / Rail, Baum / Tree   (wie die Farben unten)
//   Füllfarbe (Toleranz ca. 28)                      Bedeutung
//     #15afe6 Wasser (riesige Fläche = Meer)  #e9cc92 Land  #6dbe44 Park (kleiner Kreis = Baum)  #f59ebb Gebäude (kleiner Kreis = Marker)
//     #d8d9d9 Parkplatz  #c3932d Sportplatz  #3b820b Palme  #fed21e Bank  (Text: #231f20 oder #2a338f)
//   Linienfarbe                                       Bedeutung
//     weiß: Breite 15 Straße, 7 Straße, 3 Fußweg (nach Teilen durch den Faktor)   #ed1f24 rot: S-Bahn (durchgezogen oben, gestrichelt unten)
//     #e9cc92 Sandweg   #d8d9d9 grau = Hafenmauer
//   BESCHRIFTUNGEN: mehrere <text> untereinander werden zu einem Label zusammengeführt ("Basketball" + "Court").
//   Gebäude bekommen ihre Art aus dem Label, das im Gebäude steht: Police, Schule, Surf Shop, Beach Shack, Warehouse,
//   Basketball Court, X-Fit, Beach Volley (Sportplatz), Leuchtturm / Tarxarox (rosa Kreis an der Küste) u. a.
//   Unbekannte Ebenen, Farben und Beschriftungen werden als WARNUNG ausgegeben (nicht stillschweigend ignoriert).
const {chromium}=require('playwright');const fs=require('fs'),path=require('path');
const R=path.join(__dirname,'..');
const SRC=process.argv[2]?path.resolve(process.argv[2]):path.join(R,'src/map/map.svg');
(async()=>{
 let svg=fs.readFileSync(SRC,'utf8').replace(/<\?xml[^>]*\?>/,'').replace(/<!DOCTYPE[^>]*>/,'');
 const vb=svg.match(/viewBox="([\d.\s-]+)"/);if(!vb)throw new Error('Keine viewBox in der SVG');const [,,VW,VH]=vb[1].trim().split(/\s+/).map(Number);
 svg=svg.replace(/<svg([^>]*)>/,(m,a)=>'<svg'+a.replace(/\s(width|height)="[^"]*"/g,'')+` width="${VW}" height="${VH}">`);
 const b=await chromium.launch();const p=await b.newPage({viewport:{width:1000,height:800}});
 await p.setContent('<body style="margin:0">'+svg+'</body>');
 const data=await p.evaluate(()=>{
  const S=document.querySelector('svg'),VB=S.viewBox.baseVal;const inv=S.getScreenCTM().inverse();const warn=[];
  const NS='https://www.affinity.studio/';
  const hex=s=>{const m=s&&s.match(/rgba?\((\d+), (\d+), (\d+)/);return m?[+m[1],+m[2],+m[3]]:null};
  const near=(c,h,tol=28)=>{const t=[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));return c&&Math.hypot(c[0]-t[0],c[1]-t[1],c[2]-t[2])<=tol};
  const hx=c=>'#'+c.map(v=>v.toString(16).padStart(2,'0')).join('');
  const names=el=>{const out=[];for(let e=el;e&&e!==document.body;e=e.parentNode){if(e.nodeType!==1)continue;const a=[e.id,e.getAttributeNS(NS,'id'),e.getAttribute('affinity:id')];a.forEach(v=>{if(v)out.push(v)})}return out};
  const norm=s=>s.toLowerCase().replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue').replace(/ß/g,'ss').replace(/[^a-z]/g,'');
  const LAYER={palmen:'palm',palme:'palm',palm:'palm',bench:'bench',bank:'bench',parkbank:'bench',hafenmauer:'wall',mauer:'wall',wall:'wall',
    wasser:'water',water:'water',meer:'sea',land:'land',park:'park',parkplatz:'lot',parking:'lot',sportplatz:'court',court:'court',gebaeude:'building',building:'building',
    strasse:'road',road:'road',weg:'path',path:'path',schiene:'rail',rail:'rail',baum:'tree',tree:'tree'};
  const GENERIC=/^(layer|seite|page|clip|group|gruppe|svg|defs|ebene|pfad|path|rect|circle|kreis|rechteck|form|shape|text)?$/;
  const layerOf=el=>{for(const n of names(el)){const k=norm(n);if(LAYER[k])return LAYER[k]}return null};
  const unknownLayer=el=>{for(const n of names(el)){const k=norm(n);if(!LAYER[k]&&!GENERIC.test(k))return n}return null};
  const tf=(el,x,y)=>{const m=inv.multiply(el.getScreenCTM());const q=new DOMPoint(x,y).matrixTransform(m);return [q.x,q.y]};
  const scl=el=>{const m=inv.multiply(el.getScreenCTM());return Math.sqrt(Math.abs(m.a*m.d-m.b*m.c))};
  function contours(el){const tag=el.tagName.toLowerCase(),out=[];
    if(tag==='polygon'||tag==='polyline'){out.push({pts:[...el.points].map(q=>tf(el,q.x,q.y)),closed:tag==='polygon'})}
    else if(tag==='rect'){const x=+el.getAttribute('x'),y=+el.getAttribute('y'),w=+el.getAttribute('width'),h=+el.getAttribute('height');out.push({pts:[[x,y],[x+w,y],[x+w,y+h],[x,y+h]].map(q=>tf(el,q[0],q[1])),closed:true})}
    else if(tag==='line'){out.push({pts:[tf(el,+el.getAttribute('x1'),+el.getAttribute('y1')),tf(el,+el.getAttribute('x2'),+el.getAttribute('y2'))],closed:false})}
    else if(tag==='circle'){const cx=+el.getAttribute('cx'),cy=+el.getAttribute('cy'),r=+el.getAttribute('r'),pts=[];for(let i=0;i<24;i++){const a=i/24*Math.PI*2;pts.push(tf(el,cx+Math.cos(a)*r,cy+Math.sin(a)*r))}const c=tf(el,cx,cy);out.push({pts,closed:true,circle:[c,r*scl(el)]})}
    else if(tag==='path'){const d=el.getAttribute('d');const subs=d.split(/(?=[Mm])/).filter(s=>s.trim());
      for(const sd of subs){const t=document.createElementNS('http://www.w3.org/2000/svg','path');t.setAttribute('d',sd);el.parentNode.appendChild(t);
        const L=t.getTotalLength(),n=Math.max(2,Math.ceil(L/12)),pts=[];for(let i=0;i<=n;i++){const q=t.getPointAtLength(L*i/n);pts.push(tf(t,q.x,q.y))}
        const closed=/[zZ]\s*$/.test(sd.trim());el.parentNode.removeChild(t);out.push({pts,closed,curves:(sd.match(/[cC]/g)||[]).length,lines:(sd.match(/[lLhHvV]/g)||[]).length})}}
    return out}
  /* Maßstab: breiteste weiße Linie = 15 Einheiten */
  let mainW=0;const all=[...S.querySelectorAll('polygon,path,rect,circle,line,polyline')].filter(e=>!e.closest('clipPath,defs'));
  for(const el of all){const cs=getComputedStyle(el),sc=cs.stroke==='none'?null:hex(cs.stroke);if(sc&&near(sc,'#ffffff',20))mainW=Math.max(mainW,(parseFloat(cs.strokeWidth)||0)*scl(el))}
  if(!mainW)throw new Error('Keine weiße Linie für die Maßstabsbestimmung gefunden');
  const F=mainW/15;const rnd=v=>Math.round(v*10)/10;const U=pts=>pts.map(q=>[rnd(q[0]/F),rnd(q[1]/F)]);
  function dpOpen(pts,eps){if(pts.length<3)return pts;const keep=new Uint8Array(pts.length);keep[0]=keep[pts.length-1]=1;const st=[[0,pts.length-1]];
    while(st.length){const [a,c]=st.pop();let md=0,mi=-1;const [ax,ay]=pts[a],[cx,cy]=pts[c];const dx=cx-ax,dy=cy-ay,L=Math.hypot(dx,dy)||1e-9;
      for(let i=a+1;i<c;i++){const d=Math.abs((pts[i][0]-ax)*dy-(pts[i][1]-ay)*dx)/L;if(d>md){md=d;mi=i}}if(md>eps&&mi>0){keep[mi]=1;st.push([a,mi],[mi,c])}}
    return pts.filter((_,i)=>keep[i])}
  function dp(pts,eps,closed){if(!closed)return dpOpen(pts,eps);let P=pts.slice();const f=P[0],l=P[P.length-1];if(Math.hypot(f[0]-l[0],f[1]-l[1])<.01)P.pop();
    if(P.length<4)return P;let m=0,md=-1;for(let i=1;i<P.length;i++){const d=Math.hypot(P[i][0]-P[0][0],P[i][1]-P[0][1]);if(d>md){md=d;m=i}}
    const A=dpOpen(P.slice(0,m+1),eps),B=dpOpen(P.slice(m).concat([P[0]]),eps);return A.concat(B.slice(1,-1))}
  const isCircle=c=>{/* Kreis: nur Kurven (keine Linien), Breite und Höhe fast gleich */if(c.lines>0||(c.curves||0)<1)return null;const P=U(c.pts),xs=P.map(q=>q[0]),ys=P.map(q=>q[1]),w=Math.max(...xs)-Math.min(...xs),h=Math.max(...ys)-Math.min(...ys);if(Math.min(w,h)<1||Math.min(w,h)/Math.max(w,h)<.8)return null;return {x:rnd((Math.max(...xs)+Math.min(...xs))/2),y:rnd((Math.max(...ys)+Math.min(...ys))/2),r:rnd((w+h)/4)}};
  const obb=P=>{let best=null;for(let a=0;a<90;a+=1){const c=Math.cos(a*Math.PI/180),s=Math.sin(a*Math.PI/180);let x0=1e9,x1=-1e9,y0=1e9,y1=-1e9;for(const p of P){const u=p[0]*c+p[1]*s,v=-p[0]*s+p[1]*c;if(u<x0)x0=u;if(u>x1)x1=u;if(v<y0)y0=v;if(v>y1)y1=v}
    const ar=(x1-x0)*(y1-y0);if(!best||ar<best.ar){const uc=(x0+x1)/2,vc=(y0+y1)/2;best={ar,a:a*Math.PI/180,cx:uc*c-vc*s,cy:uc*s+vc*c,w:x1-x0,h:y1-y0}}}
    let {a,w,h}=best;if(h>w){a+=Math.PI/2;[w,h]=[h,w]}return {x:rnd(best.cx),y:rnd(best.cy),w:rnd(w),h:rnd(h),a:Math.round(a*1000)/1000}};
  const res={W:rnd(VB.width/F),H:rnd(VB.height/F),scale:rnd(F*1000)/1000,sea:[],land:[],water:[],parks:[],trees:[],lots:[],courts:[],buildings:[],markers:[],roads:[],paths:[],rail:[],walls:[],benches:[],palms:[],labels:[],other:[],warnings:[]};
  const seenWarn=new Set();const W=(k,m)=>{if(!seenWarn.has(k)){seenWarn.add(k);res.warnings.push(m)}};
  const FILL=[['#15afe6','water'],['#03aee5','water'],['#e9cc92','land'],['#e9cb92','land'],['#6dbe44','park'],['#6cbe45','park'],['#f59ebb','building'],['#d8d9d9','lot'],['#d8d8d8','lot'],['#c3932d','court'],['#c2922c','court'],['#3b820b','palm'],['#fed21e','bench']];
  for(const el of all){const cs=getComputedStyle(el),fc=cs.fill==='none'?null:hex(cs.fill),sc=cs.stroke==='none'?null:hex(cs.stroke);
   const sw=(parseFloat(cs.strokeWidth)||0)*scl(el)/F,dash=cs.strokeDasharray&&cs.strokeDasharray!=='none';const cn=contours(el);if(!cn.length)continue;
   const lay=layerOf(el),ul=unknownLayer(el);if(ul)W('layer:'+ul,'Unbekannte Ebene "'+ul+'" (wird nach Farbe behandelt)');
   if(fc){let kind=lay&&['palm','bench','water','sea','land','park','lot','court','building','tree'].includes(lay)?lay:null;if(!kind){const f=FILL.find(([h])=>near(fc,h));kind=f?f[1]:null}
    const txt=fc&&(near(fc,'#231f20',12)||near(fc,'#2a338f',20)||near(fc,'#ffffff',6)&&!cn.some(c=>c.closed&&c.pts.length>3));
    if(!kind){W('fill:'+hx(fc),'Unbekannte Füllfarbe '+hx(fc)+' (Beispiel bei '+U([tf(el,el.getBBox().x,el.getBBox().y)])[0].join(',')+'), ignoriert');res.other.push({fill:hx(fc),at:U([tf(el,el.getBBox().x,el.getBBox().y)])[0]});}
    else{const closed=cn.filter(c=>c.pts.length>=3);if(!closed.length)continue;const circ=closed.length===1?(closed[0].circle?{x:rnd(closed[0].circle[0][0]/F),y:rnd(closed[0].circle[0][1]/F),r:rnd(closed[0].circle[1]/F)}:isCircle(closed[0])):null;
     if(kind==='palm'){const P=U(closed[0].pts),c=circ||{x:rnd(P.reduce((a,q)=>a+q[0],0)/P.length),y:rnd(P.reduce((a,q)=>a+q[1],0)/P.length),r:2.7};res.palms.push(c)}
     else if(kind==='bench'){const o=obb(U(closed[0].pts));res.benches.push(o)}
     else if(kind==='park'&&circ&&circ.r<8)res.trees.push(circ);
     else if(kind==='tree'&&circ)res.trees.push(circ);
     else if(kind==='building'&&circ&&circ.r<30)res.markers.push(circ);
     else{const C=closed.map(c=>dp(U(c.pts),.7,true));const item={c:C};
      if(kind==='water'||kind==='sea'){const xs=C[0].map(q=>q[0]),ys=C[0].map(q=>q[1]);const big=kind==='sea'||(Math.max(...xs)-Math.min(...xs)>3000&&Math.max(...ys)-Math.min(...ys)>2400);(big?res.sea:res.water).push(item)}
      else if(kind==='land')res.land.push(item);else if(kind==='park')res.parks.push(item);else if(kind==='building')res.buildings.push(item);else if(kind==='lot')res.lots.push(item);else if(kind==='court')res.courts.push(item);
      else W('shape:'+kind,'Form "'+kind+'" ohne passende Verwendung')}}}
   if(sc){let kind=lay&&['wall','road','path','rail'].includes(lay)?lay:null;
    if(!kind){if(near(sc,'#ffffff',20))kind=sw>=5?'road':'path';else if(near(sc,'#ed1f24',28))kind='rail';else if(near(sc,'#e9cc92',20))kind='sand';else if(near(sc,'#d8d9d9',20))kind='wall';else{W('stroke:'+hx(sc),'Unbekannte Linienfarbe '+hx(sc)+', ignoriert')}}
    if(kind==='road'||kind==='path'){const asRoad=kind==='road'?sw>=5:false}
    for(const c of cn){if(c.pts.length<2||!kind)continue;const pts=dp(U(c.pts),.6,false);
     if(kind==='road')(sw>=5?res.roads:res.paths).push({w:rnd(sw),pts,closed:c.closed});else if(kind==='path')res.paths.push({w:rnd(sw),pts,closed:c.closed});
     else if(kind==='rail')res.rail.push({dash:!!dash,w:rnd(sw),pts});else if(kind==='sand')res.paths.push({w:rnd(sw),pts,sand:1});else if(kind==='wall')res.walls.push({w:rnd(sw),pts})}}
  }
  /* Beschriftungen: Texte untereinander zusammenführen */
  const raw=[];for(const t of S.querySelectorAll('text')){if(t.closest('clipPath,defs'))continue;const bb=t.getBBox();const c=tf(t,bb.x+bb.width/2,bb.y+bb.height/2),m=inv.multiply(t.getScreenCTM()),fs=parseFloat(getComputedStyle(t).fontSize)*Math.sqrt(Math.abs(m.a*m.d-m.b*m.c));
    raw.push({t:t.textContent.normalize('NFKC').replace(/\s+/g,' ').trim(),x:c[0]/F,y:c[1]/F,rot:Math.round(Math.atan2(m.b,m.a)*180/Math.PI),fs:fs/F,col:hex(getComputedStyle(t).fill)})}
  const used=new Set(),labs=[];raw.forEach((a,i)=>{if(used.has(i)||!a.t)return;const grp=[a];used.add(i);let grew=true;
    while(grew){grew=false;raw.forEach((c,j)=>{if(used.has(j)||!c.t||c.rot!==a.rot||a.rot!==0)return;for(const g of grp){const dy=Math.abs(c.y-g.y);/* nächste Zeile: Zeilenabstand ca. 1,2 x Schriftgröße, fast gleiche Mitte */if(dy>=g.fs*.9&&dy<=g.fs*1.7&&Math.abs(c.x-g.x)<=g.fs*2.5){grp.push(c);used.add(j);grew=true;break}}})}
    grp.sort((p,q)=>p.y-q.y);labs.push({t:grp.map(g=>g.t).join(' ').replace(/\s*\/\s*/g,' / ').replace(/ +/g,' ').trim(),x:rnd(grp.reduce((s,g)=>s+g.x,0)/grp.length),y:rnd(grp.reduce((s,g)=>s+g.y,0)/grp.length),rot:a.rot})});
  res.labels=labs;
  return res});
 await b.close();
 fs.writeFileSync(path.join(R,'src/map/map.json'),JSON.stringify(data));
 const n=k=>Array.isArray(data[k])?data[k].length:0;
 console.log('geschrieben src/map/map.json',(fs.statSync(path.join(R,'src/map/map.json')).size/1024).toFixed(0)+' KB','| Maßstab-Faktor',data.scale,'(Hauptstraße = 15 Einheiten)');
 console.log(Object.keys(data).filter(k=>Array.isArray(data[k])&&k!=='warnings'&&k!=='other').map(k=>k+':'+n(k)).join('  '));
 console.log('Beschriftungen:',data.labels.map(l=>l.t).join(' | '));
 console.log('Straßenbreiten:',[...new Set(data.roads.map(r=>r.w))].join(','),' Pfade:',[...new Set(data.paths.map(r=>r.w+(r.sand?'s':'')))].join(','),' Mauer:',data.walls.map(w=>w.w).join(','));
 console.log('Rail:',data.rail.map(r=>(r.dash?'U ':'O ')+r.pts.length+'p').join(', '));
 if(data.warnings.length){console.log('\nWARNUNGEN ('+data.warnings.length+'):');data.warnings.forEach(w=>console.log(' - '+w))}else console.log('\nKeine Warnungen.');
})();
