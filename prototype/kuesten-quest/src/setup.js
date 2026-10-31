import * as THREE from 'three';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {ShaderPass} from 'three/addons/postprocessing/ShaderPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';

const QP=new URLSearchParams(location.search);const TEST=QP.get('test')==='1';const shot='1';
const stageEl=document.getElementById('stage');
const r=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:TEST,powerPreference:'high-performance'});
r.shadowMap.enabled=true;r.shadowMap.type=THREE.PCFSoftShadowMap;r.outputColorSpace=THREE.SRGBColorSpace;
stageEl.appendChild(r.domElement);
const sc=new THREE.Scene();let CTX='stage';
const _sadd=sc.add.bind(sc);
sc.add=function(o){if(o&&o.userData&&!o.userData.tier)o.userData.tier=CTX;return _sadd(o)};

/* Bühne / Requisiten / Actors: Materialfarbe nach Wichtigkeit */
const HAZE=new THREE.Color('#b9a9d0');
function tcol(c,t){const col=new THREE.Color(c),h={};col.getHSL(h);
  if(t==='stage'){col.setHSL(h.h,h.s*.72,h.l+(1-h.l)*.07);col.lerp(HAZE,.05)}
  else if(t==='prop'){col.setHSL(h.h,h.s*.85,h.l);col.lerp(HAZE,.07)}
  else{col.setHSL(h.h,Math.min(1,h.s*1.2+.05),h.l)}
  return col}
const MC=new Map();
function SM(o){
  if(o.map||o.vertexColors)return new THREE.MeshStandardMaterial(o);
  const {color,...rest}=o;const col=new THREE.Color(color);
  const key=CTX+'|'+col.getHexString()+'|'+JSON.stringify(rest);
  let m=MC.get(key);
  if(!m){m=new THREE.MeshStandardMaterial({...rest,color:tcol(col,CTX)});m.userData.tier=CTX;MC.set(key,m)}
  return m}
const BMC=new Map();
function BM(c,o={}){const k=c+JSON.stringify(o);let m=BMC.get(k);if(!m){m=new THREE.MeshBasicMaterial({color:c,...o});BMC.set(k,m)}return m}
const M=(c,o={})=>SM({color:c,flatShading:true,roughness:.8,...o});
const add=(g,m,x,y,z,p={})=>{const o=new THREE.Mesh(g,m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;Object.assign(o.rotation,p.rot||{});if(p.s)o.scale.set(...p.s);sc.add(o);return o};

/* Himmel, Licht */
const skyTop=new THREE.Color('#0f86d6'),skyBot=new THREE.Color('#f7d3e4');
const sky=new THREE.Mesh(new THREE.SphereGeometry(400,32,16),new THREE.ShaderMaterial({side:THREE.BackSide,depthWrite:false,fog:false,
 uniforms:{a:{value:skyTop},b:{value:skyBot}},
 vertexShader:'varying float h;void main(){h=normalize(position).y;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
 fragmentShader:'uniform vec3 a;uniform vec3 b;varying float h;void main(){gl_FragColor=vec4(mix(b,a,smoothstep(-.05,.55,h)),1.);}'}));
sky.userData.noBake=true;sc.add(sky);
const FOG1=sc.fog=new THREE.Fog(skyBot,50,320);
const OUTFOG={fc:{value:new THREE.Color(skyBot)},fn:{value:50},ff:{value:320}};
const hemi=new THREE.HemisphereLight('#ffffff','#e8a6c8',1.0);sc.add(hemi);
const sun=new THREE.DirectionalLight('#ffd9a0',2.6);sun.castShadow=true;
sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-55,right:55,top:55,bottom:-55,near:1,far:220});sun.shadow.bias=-.0004;
sc.add(sun);sc.add(sun.target);
const fill=new THREE.DirectionalLight('#ff9fd0',1.1);fill.position.set(40,12,-24);sc.add(fill);

/* Gelände */
function n(x,z){return Math.sin(x*.07)*Math.cos(z*.06)*2+Math.sin(x*.19+z*.13)*.6+Math.sin(z*.03+1)*2}
function hAt(x,wz){const z=wz-20;let h=n(x,z)*.5;const shore=z+40;h+=Math.max(-6,Math.min(0,shore*.12));if(shore>0)h+=Math.min(shore,12)*.05+.6;
 const d=Math.abs(wz+8);const k=Math.max(0,Math.min(1,(16-d)/8));return h*(1-k)+1.2*k}
const tg=new THREE.PlaneGeometry(300,260,120,100);tg.rotateX(-Math.PI/2);
{const pos=tg.attributes.position,col=[];
 for(let i=0;i<pos.count;i++){const x=pos.getX(i),z=pos.getZ(i)-10;const shore=z+40;pos.setY(i,hAt(x,pos.getZ(i)+10));
  const c=tcol(shore<2?'#dcb98a':shore<10?'#f4d89a':shore>70?'#6fcf93':'#86dba0','stage');col.push(c.r,c.g,c.b)}
 tg.setAttribute('color',new THREE.Float32BufferAttribute(col,3));tg.computeVertexNormals()}
const land=new THREE.Mesh(tg,new THREE.MeshStandardMaterial({vertexColors:true,flatShading:true,roughness:1}));land.receiveShadow=true;land.position.z=10;land.userData.noBake=true;sc.add(land);
const sea=new THREE.Mesh(new THREE.PlaneGeometry(900,900),new THREE.MeshStandardMaterial({color:tcol('#1cafd1','stage'),roughness:.25,metalness:.1,transparent:true,opacity:.92}));
sea.rotation.x=-Math.PI/2;sea.position.set(0,-.9,-150);sea.userData.noBake=true;sc.add(sea);
add(new THREE.BoxGeometry(300,.3,9),M('#9a8cb8'),0,1.15,-8);
for(let x=-140;x<140;x+=8)add(new THREE.BoxGeometry(3,.05,.4),M('#eae8e8'),x,1.33,-8);
