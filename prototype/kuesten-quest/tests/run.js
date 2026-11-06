// Startet alle Smoke-Tests nacheinander. Ein Test gilt als gescheitert, wenn er abstürzt,
// länger als 5 Minuten braucht, eine Zeile "ERR" (Seitenfehler im Browser) ausgibt oder eine Zeile mit "false", "NaN" oder "undefined" enden lässt.
// Konvention: Eine Prüfzeile endet mit true (in Ordnung) oder false (Fehler). Negative Prüfungen werden so geschrieben, dass true gut bedeutet, z. B. !(Wert).
// Hinweis: Zeilen, die nur einen Zustand drucken, werden nicht bewertet. Die Ausgabe bitte bei Änderungen mitlesen.
const {spawnSync}=require('child_process'),fs=require('fs'),path=require('path');
const files=fs.readdirSync(__dirname).filter(f=>/^\d\d-.*\.js$/.test(f)).sort();
let bad=0;
for(const f of files){
  const r=spawnSync('node',[path.join(__dirname,f)],{encoding:'utf8',timeout:300000});
  const out=(r.stdout||'')+(r.stderr||'');
  const err=out.split('\n').filter(l=>/^ERR/.test(l)||/\b(false|NaN|undefined)\s*$/.test(l));
  const ok=r.status===0&&!err.length;
  console.log((ok?'OK   ':'FAIL ')+f+(err.length?'  '+err[0]:''));
  if(!ok)bad++;
  if(process.argv.includes('-v'))console.log(out);
}
console.log(bad?bad+' von '+files.length+' fehlgeschlagen':'Alle '+files.length+' Skripte ohne Fehler');
process.exit(bad?1:0);
