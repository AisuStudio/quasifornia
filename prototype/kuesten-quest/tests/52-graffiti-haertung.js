// Graffiti-Speicher gehärtet: nur echte Kennungen, nur PNG mit genau 128 x 64 Pixeln, Obergrenze für die Zahl der Bilder, Bremse gegen Dauerfeuer.
// Startet seinen eigenen lokalen Worker (Port 8791, frischer Speicher, Obergrenze 3), braucht nur npx/wrangler.
const {spawn}=require('child_process'),zlib=require('zlib'),path=require('path'),os=require('os');
const ROOT=path.join(__dirname,'..','..','..'),PORT=8791,BASE='http://localhost:'+PORT,AUTH='Basic '+Buffer.from('x:testpw').toString('base64');
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const crcT=(()=>{const t=[];for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xedb88320^(c>>>1):c>>>1;t[n]=c>>>0}return t})();
const crc=b=>{let c=0xffffffff;for(const x of b)c=crcT[(c^x)&255]^(c>>>8);return (c^0xffffffff)>>>0};
function chunk(t,d){const l=Buffer.alloc(4);l.writeUInt32BE(d.length);const td=Buffer.concat([Buffer.from(t),d]),c=Buffer.alloc(4);c.writeUInt32BE(crc(td));return Buffer.concat([l,td,c])}
function png(w,h){const ih=Buffer.alloc(13);ih.writeUInt32BE(w,0);ih.writeUInt32BE(h,4);ih[8]=8;ih[9]=0;const raw=Buffer.alloc((w+1)*h);return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',ih),chunk('IDAT',zlib.deflateSync(raw)),chunk('IEND',Buffer.alloc(0))])}
const url=b=>'data:image/png;base64,'+b.toString('base64');
const put=(id,body)=>fetch(BASE+'/api/graffiti/'+id,{method:'PUT',body,headers:{authorization:AUTH,'content-type':'text/plain'}}).then(r=>r.status);
(async()=>{
 const wr=spawn('npx',['wrangler','dev','--local','--port',String(PORT),'--persist-to',path.join(os.tmpdir(),'graftest-'+Date.now()),'--var','SITE_PASSWORD:testpw','--var','STATS_PASSWORD:statspw','--var','GRAF_MAXN:3'],{cwd:ROOT,stdio:'ignore',detached:true});
 let up=false;for(let i=0;i<60&&!up;i++){await wait(1000);try{up=(await fetch(BASE+'/api/graffiti',{headers:{authorization:AUTH}})).ok}catch(e){}}
 if(!up){console.log('übersprungen: lokaler Worker startet nicht');try{process.kill(-wr.pid)}catch(e){}return}
 try{
 const ok=url(png(128,64));
 const s1=await put('f1-2-3',ok);console.log('Gültiges Bild 128x64',s1,s1===200);
 const bad=await Promise.all([put('f99-1-1',ok),put('f1-41-0',ok),put('f1-0-25',ok),put('w10',ok),put('x1',ok)]);console.log('Ungültige Kennungen',JSON.stringify(bad),bad.every(x=>x===400));
 const s2=await put('f1-2-4',url(png(64,64)));const s3=await put('f1-2-4','data:image/png;base64,AAAA');const s4=await put('f1-2-4','<script>');const s5=await put('f1-2-4','data:image/png;base64,'+'A'.repeat(70000));
 console.log('Falsche Größe, kein PNG, Text, zu groß',JSON.stringify([s2,s3,s4,s5]),[s2,s3,s4,s5].every(x=>x===400));
 const s6=await put('f2-0-0',ok),s7=await put('w1',ok),s8=await put('w2',ok);console.log('Obergrenze 3: dritte Kennung ok, vierte voll',JSON.stringify([s6,s7,s8]),s6===200&&s7===200&&s8===507);
 const s9=await put('f1-2-3',ok);console.log('Vorhandene Kennung überschreiben geht weiter',s9,s9===200);
 const l=await fetch(BASE+'/api/graffiti',{headers:{authorization:AUTH}}).then(r=>r.json());console.log('Liste hat genau 3',Object.keys(l.items).length,Object.keys(l.items).length===3);
 let got429=false;for(let i=0;i<40;i++){if(await put('f1-2-3',ok)===429){got429=true;break}}console.log('Bremse greift bei Dauerfeuer (429)',got429);
 }finally{try{process.kill(-wr.pid)}catch(e){}}
})();
