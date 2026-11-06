#!/usr/bin/env node
/* Lädt die Sammelkarten (karten.json und die Bilder) in den R2-Bucket "designs" (Ordner karten/).
   Die Karten liegen nicht im Repo, sondern privat im Repo "lore" (quasifornia/karten/karten.json, quasifornia/moodboard/Pacific Sim/).
   Aufruf:  node tools/karten-upload.js <karten.json> <Bilderordner> [--go]
   Ohne --go wird nur aufgelistet, was hochgeladen würde. Braucht eine angemeldete Wrangler-Sitzung (npx wrangler login). */
const fs=require('fs'),path=require('path'),{spawnSync}=require('child_process');
const [json,dir]=process.argv.slice(2).filter(a=>!a.startsWith('--')),go=process.argv.includes('--go');
if(!json||!dir){console.log('Aufruf: node tools/karten-upload.js <karten.json> <Bilderordner> [--go]');process.exit(1)}
const d=JSON.parse(fs.readFileSync(json,'utf8'));if(!Array.isArray(d.cards)){console.log('karten.json ist ungültig');process.exit(1)}
const jobs=[{key:'karten/karten.json',file:json,type:'application/json'}];let miss=0;
for(const c of d.cards){const f=path.join(dir,c.file);if(!fs.existsSync(f)){console.log('FEHLT',f);miss++;continue}jobs.push({key:'karten/'+c.file,file:f,type:'image/webp'})}
if(miss){console.log(miss+' Bilder fehlen, Abbruch.');process.exit(1)}
console.log(jobs.length+' Dateien'+(go?' werden hochgeladen':' (Vorschau, mit --go hochladen)'));
for(const j of jobs){const size=(fs.statSync(j.file).size/1024).toFixed(0)+' KB';console.log((go?'lade ':'· ')+j.key+'  '+size);
  if(go){const r=spawnSync('npx',['wrangler','r2','object','put','designs/'+j.key,'--file',j.file,'--content-type',j.type,'--remote'],{stdio:'inherit'});if(r.status!==0){console.log('Fehler bei '+j.key);process.exit(1)}}}
