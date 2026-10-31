// Startet alle Smoke-Tests nacheinander. Ein Test gilt als gescheitert, wenn er abstürzt,
// länger als 5 Minuten braucht oder eine Zeile "ERR" (Seitenfehler im Browser) ausgibt.
// Hinweis: Die Skripte drucken Zustände aus, sie prüfen nicht jeden Wert automatisch. Die Ausgabe bitte mitlesen.
const {spawnSync}=require('child_process'),fs=require('fs'),path=require('path');
const files=fs.readdirSync(__dirname).filter(f=>/^\d\d-.*\.js$/.test(f)).sort();
let bad=0;
for(const f of files){
  const r=spawnSync('node',[path.join(__dirname,f)],{encoding:'utf8',timeout:300000});
  const out=(r.stdout||'')+(r.stderr||'');
  const err=out.split('\n').filter(l=>/^ERR/.test(l));
  const ok=r.status===0&&!err.length;
  console.log((ok?'OK   ':'FAIL ')+f+(err.length?'  '+err[0]:''));
  if(!ok)bad++;
  if(process.argv.includes('-v'))console.log(out);
}
console.log(bad?bad+' von '+files.length+' fehlgeschlagen':'Alle '+files.length+' Skripte ohne Fehler');
process.exit(bad?1:0);
