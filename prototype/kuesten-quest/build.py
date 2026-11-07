# Baut dist/kuesten-quest.html (CDN-Variante, läuft als Artifact).
# Aufruf im Ordner prototype/kuesten-quest: python3 build.py   (mit --dev: dist/dev.html mit lokalem three aus node_modules)
import re,sys,time
src=open('src/base-scene.html').read()
def seg(a,b):
    i=src.index(a);j=src.index(b,i);return src[i:j]
def sm(t):return t.replace('new THREE.MeshStandardMaterial(','SM(')
flora=seg('// ---- Flora','// villas (viktorianisch)')
flora=flora.replace("const FM=(c)=>new THREE.MeshStandardMaterial({color:c,roughness:.5});","const FM=(c)=>SM({color:c,roughness:.5});")
flora=flora.replace("if(shot!=='3')for(let i=0,x=-120;x<=120;x+=14,i++)","for(let i=0,x=-140;x<=140;x+=14,i++)")
assert "x=-140" in flora
villas=seg('// villas (viktorianisch)','// Bürgersteig')
sidecar=seg('// Bürgersteig','const bc=document.createElement')
dino=seg('// inflatable dino (hero)','// Avatar (')
dino=dino.replace("S(sp,-2.6,2.2,-.5,[1.4,2.6,1.6]);S(sp,2.6,2.2,-.5,[1.4,2.6,1.6]);","g.userData.legs=[S(sp,-2.6,2.2,-.5,[1.4,2.6,1.6]),S(sp,2.6,2.2,-.5,[1.4,2.6,1.6])];")
dino=dino.replace("blob(x,y,z,6*sc_,8*sc_);","")
assert "userData.legs" in dino and "blob(" not in dino
avatar=seg('// Avatar (','// balloons')
avatar=avatar.replace("const tz=new THREE.Group();","const tz=new THREE.Group();g.userData.tz=tz;")
avatar=avatar.replace("tz.add(sg);","tz.add(sg);(g.userData.arms||(g.userData.arms=[])).push({sg,s});")
avatar=avatar.replace("const P=new THREE.Group();","const P=new THREE.Group();g.userData.skP=P;",1)
avatar=avatar.replace("const ft=new THREE.Group();","const ft=new THREE.Group();(g.userData.skl||(g.userData.skl=[])).push({th,sh,ft,s,a,b});",1)
avatar=avatar.replace("blob(x,y,z,k*1.05,k*1.1);","")
assert "userData.arms" in avatar and "userData.skl" in avatar and "userData.skP" in avatar and "blob(" not in avatar
bal=seg('// balloons','// quest marker beacon')
cloud=seg('function cloud(','function confetti(')
decals=seg('function decal(','const AW=')
decals=decals.replace("new THREE.MeshBasicMaterial({color:cols[k%4]})","BM(cols[k%4])").replace("new THREE.MeshBasicMaterial({color:'#eae8e8'})","BM('#eae8e8')")

# villas: bunte Pastellreihe wie im Moodboard
i=villas.index("{const defs=[");j=villas.index("];",i)+2
villas=villas[:i]+"{const defs=[['#f1a7c8','#eae8e8','#47c2a5',{bay:1}],['#a9e6d2','#eae8e8','#d54291',{turret:1}],['#f6df73','#eae8e8','#d54291',{bay:1}],['#a9d8f0','#eae8e8','#f1a7c8',{}],['#f6c3a8','#eae8e8','#47c2a5',{turret:1,bay:1}],['#e7b8e8','#eae8e8','#f0cf36',{bay:1}],['#f1a7c8','#eae8e8','#d54291',{turret:1}],['#a9e6d2','#eae8e8','#f1a7c8',{bay:1}]];"+villas[j:]
# klobige Sneaker
old="S(SP,shoe,0,-.045,.07,ft,.075,.06,.16);S(BX,sole,0,-.1,.07,ft,.15,.035,.33);S(SP,MS(o.sole),0,-.045,.15,ft,.07,.04,.06);"
assert old in avatar
avatar=avatar.replace(old,"S(SP,shoe,0,-.03,.07,ft,.095,.085,.2);S(BX,sole,0,-.1,.07,ft,.2,.05,.42);S(SP,MS(o.sole),0,-.04,.17,ft,.085,.06,.1);S(CY,shoe,0,.04,0,ft,.09,.07,.09);")
avatar=avatar.replace("const PRE={","const PRE={'#47c2a5':{skin:'#d9a07a',top:'#47c2a5',bot:'#2b2a33',sole:'#d54291',hair:'cap',hc:'#d54291',lens:'#f0cf36',frame:'#141416',pack:'#f0cf36',pads:'#47c2a5',watch:1,stripe:'#eae8e8'},",1)
decals=decals.replace("const cols=['#d54291','#f0cf36','#1cafd1','#eae8e8'];","const cols=['#d54291','#f0cf36','#47c2a5','#eae8e8'];").replace("const cs=['#d54291','#f0cf36','#1cafd1','#eae8e8','#d54291'];","const cs=['#d54291','#f0cf36','#47c2a5','#eae8e8','#d54291'];")

# --- Accessoires
ACC="const ACC={'#d54291':{chain:2,pendant:'star',earring:1,bangles:1,bag:'#47c2a5'},'#2499bb':{chain:1,pendant:'ring',earring:1,scarf:'#47c2a5',gl:'heart',bangles:1},'#47c2a5':{hat:'fwdcap',hc:'#eae8e8',hc2:'#d54291',gl:'visor',chain:3,pendant:'ice',bag:'#f0cf36'},'#f0cf36':{chain:4,pendant:'ice',gl:'big',earring:1,bangles:1,hat:'crown'},'D':{hat:'bucket',hc:'#f1a7c8',gl:'visor',scarf:'#d54291',bag:'#d54291',chain:1,pendant:'ring',phonesNeck:'#1cafd1'}};\n"
avatar=avatar.replace("const PRE={",ACC+"const PRE={",1)
avatar=avatar.replace("const o=PRE[c]||PRE['#d54291'];","const o=Object.assign({},PRE[c]||PRE['#d54291'],PRE_OVR);const X=Object.assign({hc:'#eae8e8',hc2:'#f0cf36'},ACC[c]||{},ACC_OVR);if(X.pendant&&!X.chain)X.chain=1;",1)
for h in ("cap","bun","puff","helmet"):
    assert "if(o.hair==='%s'){"%h in avatar
    avatar=avatar.replace("if(o.hair==='%s'){"%h,"if(o.hair==='%s'&&!X.hat){"%h,1)
assert "sg.add(eg);" in avatar
avatar=avatar.replace("sg.add(eg);","sg.add(eg);sg.userData.eg=eg;",1)
ACCB=open('src/acc_block.js').read()
tail="g.position.set(x,y,z);g.rotation.y=ry;g.scale.setScalar(k);sc.add(g);return g}"
assert tail in avatar
avatar=avatar.replace(tail,ACCB+tail,1)

old_b="const deckM=M('#2499bb');S(BX,deckM,0,.17,0,g,.42,.035,1.55);S(BX,MS('#f0cf36'),0,.19,0,g,.3,.01,1.3);"
assert old_b in avatar
DECK="""/* Boardformen: Eintrag = Breite, Länge, Länge der Kicktails (end), Winkel der Kicktails (kick), Dicke (th). Neue Formen später einfach hier ergänzen. */
const BOARD_SHAPES={popsicle:{w:.42,len:1.55,end:.26,kick:.34,th:.035}};
function boardDeck(parent,mDeck,mInlay,key,sc,y){const B=BOARD_SHAPES[key]||BOARD_SHAPES.popsicle,s=sc||1,W=B.w*s,L=B.len*s,E=B.end*s,T=B.th*s,Mi=L-2*E,r=W/2,y0=y||0;
  const mk=(geo,mat,px,py,pz,rx,ry)=>{const m=new THREE.Mesh(geo,mat);m.position.set(px,py,pz);if(rx)m.rotation.x=rx;if(ry)m.rotation.y=ry;m.castShadow=true;parent.add(m);return m};
  const sh=new THREE.Shape();sh.moveTo(-r,0);sh.lineTo(r,0);sh.lineTo(r,E-r);sh.absarc(0,E-r,r,0,Math.PI,false);sh.lineTo(-r,0);
  const eg=new THREE.ExtrudeGeometry(sh,{depth:T,bevelEnabled:false,curveSegments:8});eg.rotateX(Math.PI/2);eg.translate(0,T,0);
  mk(new THREE.BoxGeometry(W,T,Mi),mDeck,0,y0+T/2,0);
  mk(eg,mDeck,0,y0,Mi/2,-B.kick);mk(eg,mDeck,0,y0,-Mi/2,B.kick,Math.PI);
  const inl=mk(new THREE.BoxGeometry(W*.9,T*.3,Mi*.98),mInlay,0,y0+T+T*.15,0);parent.userData.inlay=inl;inl.userData.inlayMat=mInlay;return parent}
"""
avatar=avatar.replace("function skater(",DECK+"function skater(",1)
avatar=avatar.replace(old_b,"const boardG=new THREE.Group();g.add(boardG);g.userData.board=boardG;boardDeck(boardG,M('#2499bb'),MS('#f0cf36'),'popsicle',1,.1525);",1)
old_w="const w=S(CY,MS(o.sole),a*1.1,.075,b,g,.075,.05,.075);"
assert old_w in avatar
avatar=avatar.replace(old_w,"const w=S(CY,MS(o.sole),a*1.1,.075,b,boardG,.075,.05,.075);",1)
old_a="S(BX,MS('#8a8a95'),0,.115,b,g,.3,.03,.05)"
assert old_a in avatar
avatar=avatar.replace(old_a,"S(BX,MS('#8a8a95'),0,.115,b,boardG,.3,.03,.05)",1)

MORE="Object.assign(PRE,{'#ff8a2a':{skin:'#f0c8a8',top:'#ff8a2a',bot:'#312e42',sole:'#47c2a5',hair:'bun',hc:'#312e42',lens:'#1cafd1',frame:'#141416',pack:'#8e5bd6',pads:'#ff8a2a',watch:1,stripe:'#eae8e8'},'#8e5bd6':{skin:'#8a5a3c',top:'#8e5bd6',bot:'#f0cf36',sole:'#d54291',hair:'puff',hc:'#141416',lens:'#f1a7c8',frame:'#eae8e8',pads:'#f0cf36',stripe:'#f0cf36'},'#e5383b':{skin:'#d9a07a',top:'#e5383b',bot:'#eae8e8',sole:'#141416',hair:'helmet',hc:'#141416',lens:'#f0cf36',frame:'#141416',pack:'#f0cf36',pads:'#141416',watch:1,stripe:'#eae8e8'},'#9be12c':{skin:'#f0c8a8',top:'#9be12c',bot:'#d54291',sole:'#eae8e8',hair:'cap',hc:'#d54291',lens:'#d54291',frame:'#141416',pack:'#d54291',pads:'#9be12c',stripe:'#d54291'},'#4cc3ff':{skin:'#c98e6a',top:'#4cc3ff',bot:'#eae8e8',sole:'#f1a7c8',hair:'bun',hc:'#141416',lens:'#f0cf36',frame:'#eae8e8',phones:'#f1a7c8',watch:1,stripe:'#eae8e8'},'#2a2733':{skin:'#e0a98a',top:'#2a2733',bot:'#2a2733',sole:'#47c2a5',hair:'cap',hc:'#47c2a5',lens:'#47c2a5',frame:'#141416',pack:'#47c2a5',pads:'#47c2a5',stripe:'#47c2a5'}});Object.assign(ACC,{'#ff8a2a':{hat:'beanie',hc:'#47c2a5',hc2:'#f0cf36',gl:'big',chain:2,pendant:'star',earring:1},'#8e5bd6':{chain:3,pendant:'ice',earring:1,bangles:1,scarf:'#f0cf36',gl:'visor'},'#e5383b':{hat:'fwdcap',hc:'#141416',hc2:'#e5383b',gl:'big',chain:1,pendant:'ring',bag:'#141416'},'#9be12c':{hat:'bucket',hc:'#d54291',gl:'heart',chain:2,pendant:'star',bangles:1,earring:1},'#4cc3ff':{scarf:'#f1a7c8',gl:'visor',chain:1,pendant:'ring',bag:'#f1a7c8',bangles:1},'#2a2733':{hat:'beanie',hc:'#141416',hc2:'#47c2a5',gl:'visor',chain:4,pendant:'ice',bangles:1,earring:1}});\n"
assert "function skater(" in avatar
avatar=avatar.replace("function skater(",MORE+"function skater(",1)

assert "const FSP=new THREE.SphereGeometry(1,14,10);" in flora
flora=flora.replace("const FSP=new THREE.SphereGeometry(1,14,10);","let FSP=new THREE.SphereGeometry(1,14,10);",1)
assert "function fcol(R,l=.5,sat=.55,acc){" in flora
flora=flora.replace("function fcol(R,l=.5,sat=.55,acc){","function fcol(R,l=.5,sat=.55,acc){const _c=fcol0(R,l,sat,acc),hs={};_c.getHSL(hs);return _c.setHSL(Math.round(hs.h*40)/40,Math.round(hs.s*8)/8,Math.round(hs.l*10)/10)}\nfunction fcol0(R,l=.5,sat=.55,acc){l=Math.min(.78,l+(FW.lb||0));sat=Math.min(1,sat+(FW.sb||0));",1)

assert "new THREE.CylinderGeometry(r1,r0,L,10)" in flora
flora=flora.replace("new THREE.CylinderGeometry(r1,r0,L,10)","new THREE.CylinderGeometry(r1,r0,L,FCYL)",1)
flora=flora.replace("let FSP=","let FCYL=10;let FSP=",1)
chunks=[flora,villas,sidecar,dino,avatar,bal,decals]
chunks=[sm(c) for c in chunks]
setup=open('src/setup.js').read();game=open('src/game.js').read()
import json as _json
DECALS='const DECAL_SVG='+_json.dumps({'can':re.sub(r'>\s+<','><',open('src/decals/PHs_can.svg',encoding='utf8').read().replace('<?xml version="1.0" encoding="UTF-8"?>','')).strip(),'ubiq':re.sub(r'>\s+<','><',open('src/decals/PHs_UBIQ.svg',encoding='utf8').read().replace('<?xml version="1.0" encoding="UTF-8"?>','')).strip(),'amartLogo':re.sub(r'>\s+<','><',open('src/decals/amart_logo.svg',encoding='utf8').read().replace('<?xml version="1.0" encoding="UTF-8"?>','')).strip(),'lavateur':re.sub(r'>\s+<','><',open('src/decals/lavateur_logo.svg',encoding='utf8').read().replace('<?xml version="1.0" encoding="UTF-8"?>','')).strip(),'amartBand':re.sub(r'>\s+<','><',open('src/decals/amart_banderole.svg',encoding='utf8').read().replace('<?xml version="1.0" encoding="UTF-8"?>','')).strip()})+';\n'
game=game.replace('window.__qa={',open('src/atoll.js').read()+'\n'+DECALS+open('src/dose.js').read()+'\n'+open('src/amart.js').read()+'\n'+open('src/pmart.js').read()+'\n'+open('src/bauen.js').read()+'\n'+open('src/ubiq.js').read()+'\n'+open('src/island.js').read()+'\n'+open('src/xmas.js').read()+'\n'+open('src/bettler.js').read()+'\n'+open('src/unter.js').read()+'\n'+open('src/graffiti.js').read()+'\n'+open('src/karte.js').read()+'\n'+open('src/avateur.js').read()+'\n'+open('src/multi.js').read()+'\n'+open('src/foto.js').read()+'\n'+open('src/karten.js').read()+'\n'+open('src/stats.js').read().replace('__BUILD__',time.strftime('%m%d-%H%M'))+'\nwindow.__qa={',1)
import json
logo=re.sub(r'<\?xml[^>]*\?>','',open('src/logo/port36_postcard.svg').read()).replace('<svg ','<svg class="logo-svg" role="img" aria-label="Logo" ',1).strip()
mapjson=open('src/map/map.json').read()
js=setup+'\n'+'\n'.join(chunks)+'\n'+game.replace('__LOGO_SVG__',json.dumps(logo)).replace('__MAPDATA__',mapjson)
import base64
head=open('src/head.html').read();body=open('src/body.html').read()
FONT=base64.b64encode(open('src/fonts/smarta-nova.otf','rb').read()).decode()
head=head.replace('</style>','@font-face{font-family:"Smarta Nova";src:url(data:font/otf;base64,'+FONT+') format("opentype");font-weight:100 900;font-display:swap}\n</style>',1)
def build(prod):
    if prod:
        imap='{"imports":{"three":"https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js","three/addons/":"https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/"}}'
    else:
        imap='{"imports":{"three":"./node_modules/three/build/three.module.js","three/addons/":"./node_modules/three/examples/jsm/"}}'
    return head+body+'<script type="importmap">'+imap+'</script>\n<script type="module">\n'+js+'\n</script>\n'
import sys,os
os.makedirs('dist',exist_ok=True)
if '--dev' in sys.argv:open('dist/dev.html','w').write(build(False))
open('dist/kuesten-quest.html','w').write(build(True))
print(len(js))
