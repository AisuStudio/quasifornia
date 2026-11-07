/* ================= A-Mart: Logo und Banderole (Vorlagen des Nutzers: src/decals/amart_logo.svg und amart_banderole.svg) =================
   Die Banderole ist ein Streifenmuster in Mint mit weißen Streifen und farbigen Balken; sie läuft waagerecht rundherum und wiederholt sich seitlich.
   Das Logo ist ein quadratisches Schild (Mint mit Kreis, Streifen-A und Schriftzug MART, darunter DAILY DOSE).
   Beides wird aus der SVG in eine Textur gezeichnet; das Bild lädt später, die Textur aktualisiert sich dann selbst. */
const AMART={tex:{},mat:{},pending:0,BAND_ASPECT:229.14/316.95,MINT:'#00e8b6'};
function amartTexture(key,svg,w,h,repeat){
  if(AMART.tex[key])return AMART.tex[key];
  const cv=document.createElement('canvas');cv.width=w;cv.height=h;const g=cv.getContext('2d');g.fillStyle=AMART.MINT;g.fillRect(0,0,w,h);
  const tx=new THREE.CanvasTexture(cv);tx.colorSpace=THREE.SRGBColorSpace;tx.anisotropy=4;
  if(repeat){tx.wrapS=THREE.RepeatWrapping;tx.repeat.set(repeat,1)}
  AMART.tex[key]=tx;const im=new Image();AMART.pending++;
  im.onload=()=>{g.clearRect(0,0,w,h);g.drawImage(im,0,0,w,h);tx.needsUpdate=true;AMART.pending--};im.onerror=()=>{AMART.pending--};
  im.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg.replace('viewBox=','width="'+w+'" height="'+h+'" viewBox='));return tx}
/* Quadratisches Logo als Material (ohne Beleuchtung, bleibt immer gut lesbar) */
function amartLogoMat(){if(!AMART.mat.logo)AMART.mat.logo=new THREE.MeshBasicMaterial({map:amartTexture('logo',DECAL_SVG.amartLogo,512,512)});return AMART.mat.logo}
/* Banderole (unbeleuchtet wie das Logo, damit die Farben genau der Vorlage entsprechen) für eine Fläche der Länge len und Höhe h (Welteinheiten): Das Muster wiederholt sich seitlich und bleibt unverzerrt. */
function amartBandMat(len,h){const rep=+(len/(h*AMART.BAND_ASPECT)).toFixed(2),key='band'+rep;
  if(!AMART.mat[key])AMART.mat[key]=new THREE.MeshBasicMaterial({map:amartTexture(key,DECAL_SVG.amartBand,229,317,rep)});return AMART.mat[key]}
