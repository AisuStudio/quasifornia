/* ================= Der Bettler und sein Geist (Quest) ================= */
/* Ablauf: Bettler an der Kanalbrücke, mindestens 3 Scoops geben, danach bekommt man den Releaser und ein Gedicht mit einem Tipp zum Gebüsch.
   In der Unterwelt steht der Turm Tarxarox. Oben wartet der Gegenpart (Geist) des Bettlers. Mit dem Releaser lässt man ihn frei: 30 Scoops. */
const BQK='kq-bettler',BQ={gave:false,released:false,up:false};
try{const s=JSON.parse(localStorage.getItem(BQK)||'null');if(s){BQ.gave=!!s.gave;BQ.released=!!s.released}}catch(e){}
function bqSave(){try{localStorage.setItem(BQK,JSON.stringify({gave:BQ.gave,released:BQ.released}))}catch(e){}}
function bqHasReleaser(){return BQ.gave&&!BQ.released}
const BQ_POEM=['Tief im Busch, da musst du suchen,','zwischen Gumpern, zwischen Buchen,','hinab, hinauf zum Tarxarox,','meinen Geist zur Freiheit lockst.'];
function beggarTalk(){
  if(!BQ.gave){
    if(SC.n<3)return dlgStart('Serafin',['Ein paar Scoops für einen alten Bettler? Ich bin Serafin.','Mindestens drei. Nicht weniger, sonst klingt es nach nichts. Komm wieder, wenn du welche hast.']);
    return dlgStart('Serafin',['Ein paar Scoops für einen alten Bettler? Ich bin Serafin.','Mindestens drei. Du siehst aus, als hättest du drei übrig.'],()=>{
      if(SC.n<3)return;scAdd(-3,'Serafin');BQ.gave=true;bqSave();invRender();SFX.win();burst(P.x,P.y+3,P.z,40);toast('Releaser und Gedicht erhalten',1900);
      dlgStart('Serafin',['Danke. Das war mehr als Geld. Das war ein Anfang.','Hier, nimm den Releaser. Er ist klein, aber er löst, was fest sitzt.','Und hör gut zu, ich sage dir ein Gedicht auf:',BQ_POEM[0]+' '+BQ_POEM[1],BQ_POEM[2]+' '+BQ_POEM[3],'Mehr verrate ich nicht. Ich habe da unten jemanden, der mir fehlt. Meinen Gegenpart. Lass ihn frei.'])})}
  if(!BQ.released)return dlgStart('Serafin',['Du hast den Releaser. Tief im Busch, wo Gumper und Buchen stehen, gibt es eine Leiter.','Unten, im Turm Tarxarox, wartet mein Gegenpart. Lass ihn frei.']);
  dlgStart('Serafin',['Ich fühle mich leichter. Als hätte jemand eine Tür in mir aufgemacht.','Danke, Skater.'])}
function towerUp(){const T=HUB.uw&&HUB.uw.tower;if(!T)return;toast('Aufzug hinauf …',1000);tone(260,.5,'triangle',.06,260);later(.5,()=>{P.x=T.x;P.z=T.z+5.5;P.y=T.top+4;P.vy=0;P.speed=0;BQ.up=true})}
function towerDown(){const T=HUB.uw&&HUB.uw.tower;if(!T)return;toast('Aufzug hinab …',1000);tone(260,.5,'triangle',.06,-200);later(.5,()=>{P.x=T.x;P.z=T.z-9;P.y=2;P.vy=0;P.speed=0;BQ.up=false})}
function releaseTry(){const U=HUB.uw;
  if(BQ.released)return dlgStart('',['Der Käfig ist leer. Es duftet nach Kürbis und Freiheit.']);
  if(!bqHasReleaser())return dlgStart('',['Ein Geist schwebt in einem türkisen Lichtkäfig. Er sieht Serafin ähnlich, nur kopfüber und leuchtend.','"Löse mich", flüstert er. Aber du hast nichts, womit du den Käfig öffnen könntest. Vielleicht gibt dir jemand oben etwas dafür.']);
  dlgStart('',['Du hältst den Releaser an den Käfig. Er summt, klickt, und das Licht wird heller.','Der Geist atmet aus. "Danke. Sag ihm, ich bin jetzt frei."'],()=>{
    BQ.released=true;bqSave();U.rel=1;SFX.win();burst(P.x,P.y+3,P.z,120);invRender();auComplete('bettler');say('e','Der Geist steigt auf und löst sich in türkisem Licht auf. Auf dem Boden liegen 30 Scoops. Du steckst sie ein.',5)})}
function bettlerActs(a){
  if(G.under&&HUB.uw&&HUB.uw.tower){const T=HUB.uw.tower;
    if(P.y>20){a.push({x:T.x,z:T.z+1,r:9.5,label:BQ.released?'Leerer Käfig':(bqHasReleaser()?'Geist freilassen (Releaser)':'Gefangener Geist'),fn:releaseTry});a.push({x:T.x-4.8,z:T.z+5.6,r:4.5,label:'Aufzug hinab',fn:towerDown})}
    else a.push({x:T.x,z:T.z-9,r:6.5,label:'Aufzug hinauf (Tarxarox)',fn:towerUp})}
  else if(HUB.beggar)a.push({x:HUB.beggar.x,z:HUB.beggar.z+1.5,r:6.5,label:!BQ.gave?'Serafin Scoops geben (3)':'Mit Serafin sprechen',fn:beggarTalk})}
function bqSlotsHTML(){let h='';
  if(bqHasReleaser())h+=`<div class="slot-i got"><div class="ic"><span style="font:800 34px/1 var(--display);color:#2de0d0">&#9670;</span></div><b>Releaser</b><span>Klein und summend. Löst, was fest sitzt.</span><em>Unterwelt: Turm Tarxarox</em></div>`;
  if(BQ.gave)h+=`<div class="slot-i got"><div class="ic q" style="font-size:12px;line-height:1.3;padding:4px;text-align:center">${BQ_POEM.join('<br>')}</div><b>Serafins Gedicht</b><span>Ein Tipp, wo die Leiter in die Unterwelt ist.</span></div>`;
  return h}
function bqReset(){BQ.gave=false;BQ.released=false;BQ.up=false;bqSave();if(HUB.uw&&HUB.uw.ghost){HUB.uw.ghost.visible=true;HUB.uw.rel=0}}
