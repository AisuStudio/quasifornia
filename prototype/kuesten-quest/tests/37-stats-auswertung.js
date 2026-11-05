// Auswertung (worker/stats.js) ohne Server: erfundene Sitzungen und Ereignisse mit bekannten Ergebnissen.
const path=require('path'),fs=require('fs'),os=require('os');
const tmp=path.join(os.tmpdir(),'kq-stats-test.mjs');fs.copyFileSync(path.join(__dirname,'..','..','..','worker','stats.js'),tmp);
(async()=>{const {summarize,cleanIngest}=await import(tmp);
 const now=Date.UTC(2026,10,3,12,0,0),H=3600000,D=86400000,S=[],E=[];
 const sess=(sid,pid,name,t0,play,over={})=>({sid,pid,name,t0,last:t0+play*1000,play,dev:'d',ua:'',ver:'t',w:1,h:1,gpu:'GPU A',room:'',lvl:0,under:0,sc:10,fpssum:0,fpsn:0,fr:0,slow:0,...over});
 S.push(sess('s1','pA','Anton',now-30*60000,1200,{last:now-5000,sc:42,fpssum:120,fpsn:2,fr:1000,slow:20,room:'test'}));   // online, 20 min
 S.push(sess('s2','pA','Anton',now-D-2*H,600,{sc:20}));                                                                // gestern, 10 min
 S.push(sess('s3','pB','Mia',now-2*H,300,{dev:'m',last:now-H,sc:5,fpssum:40,fpsn:2,fr:500,slow:100,gpu:'GPU B'}));     // heute, Handy, 5 min
 const ev=(sid,type,key,n,mins,x,z,lvl)=>E.push({sid,type,key,n:n||0,x:x==null?null:x,z:z==null?null:z,lvl:lvl||0,t:S.find(s=>s.sid===sid).t0+mins*60000});
 ev('s1','start','0',1,0);ev('s1','item','funk',1,3);ev('s1','sc','Auftrag: Küsten-Eis',8,5);ev('s1','q','sammeln',1,5);ev('s1','sc','Reise zu Welt 2',-5,6);ev('s1','portal','Reise zu Welt 2',1,6);
 ev('s1','sc','Skin: Mint',-12,9);ev('s1','lad','down',1,10);ev('s1','bq','gave',1,11);ev('s1','sc','Serafin',-3,11);ev('s1','err','TypeError: x ist undefiniert',2,12,10,20,0);
 ev('s1','stuck','',5,13,100,-44,0);ev('s1','stuck','',6,14,101,-45,0);ev('s1','unstick','',1,14,100,-44,0);ev('s1','pol','alarm',1,15);ev('s1','pol','erwischt',1,17);ev('s1','gr','illegal',300,14);
 ev('s2','start','0',1,0);ev('s2','q','sammeln',0,12);ev('s2','sc','Auftrag: Küsten-Eis',3,12);ev('s2','err','TypeError: x ist undefiniert',1,5,10,20,0);ev('s2','gr','legal',120,6);
 ev('s3','start','0',1,0);ev('s3','q','sammeln',1,2);ev('s3','q','tricks',1,4);ev('s3','sc','Auftrag: Küsten-Eis',8,2);ev('s3','sc','Auftrag: Trick-Serie',8,4);ev('s3','err','Versprechen: nope',1,3,0,0,1);ev('s3','ws','fehler',1,1);
 ev('s1','glitch','fund:item',1,8,5,6,0);ev('s1','glitch','fix:wand',1,9,5,6,0);ev('s3','glitch','fix:wand',1,3,5,6,0);ev('s3','glitch','fix:brett',1,4,9,9,0);
 const r=summarize(S,E,now,14),ok=(n,c)=>console.log((c?'OK   ':'FEHLER ')+n);
 console.log('Online',JSON.stringify({n:r.online.count,name:r.online.players[0]&&r.online.players[0].name,raum:r.rooms}));
 ok('Online: genau Anton',r.online.count===1&&r.online.players[0].name==='Anton'&&r.rooms[0].room==='test');
 ok('Summen: 2 Spieler, 3 Sitzungen, 35 min Spielzeit',r.total.players===2&&r.total.sessions===3&&Math.round(r.total.play)===2100);
 ok('Ø Sitzung 700 s, Median 600 s, längste 1200 s',Math.round(r.total.avg)===700&&r.total.median===600&&r.total.longest===1200);
 ok('Wiederkehrend: Anton an 2 Tagen',r.total.returning===1);
 const heute=r.perDay[r.perDay.length-1];ok('Heute: 2 Spieler, 2 Sitzungen, 25 min',heute.players===2&&heute.sessions===2&&heute.play===1500);
 ok('Gestern: 1 Spieler, 10 min',r.perDay[r.perDay.length-2].players===1&&r.perDay[r.perDay.length-2].play===600);
 ok('14 Tage in der Zeitreihe',r.perDay.length===14);ok('48 Stunden in der Stundenreihe',r.perHour.length===48);
 ok('Glitches (UBIQ): 1 echter Fund, 3 Reparaturen, Wand durch 2 Spieler',r.glitch&&r.glitch.found===1&&r.glitch.fixed===3&&r.glitch.types.find(t=>t.type==='wand').players===2&&r.glitch.types.find(t=>t.type==='brett').fixed===1);
 const q=Object.fromEntries(r.quests.map(x=>[x.key,x]));ok('Quest "sammeln": 2 Spieler',q.sammeln.players===2);ok('Quest "tricks": 1 Spieler, Median 4 min',q.tricks.players===1&&q.tricks.median===4);
 ok('Quest sammeln: Median der Zeiten (5 und 2 min) = 3,5',q.sammeln.median===3.5);
 const f=Object.fromEntries(r.funnel.map(x=>[x.label,x.n]));ok('Trichter: 2 / 2 / 1 / 1 / 2 / 1 / 1 / 0',[f['Seite geöffnet'],f['Spiel gestartet'],f['Gegenstand gefunden'],f['Portal benutzt'],f['Erster Auftrag gelöst'],f['In der Unterwelt'],f['Serafin bezahlt'],f['Geist befreit']].join()==='2,2,1,1,2,1,1,0');
 ok('Scoops: eingenommen 8+3+8+8=27, ausgegeben 5+12+3=20',r.scoops.earned===27&&r.scoops.spent===20);
 const sr=Object.fromEntries(r.scoops.reasons.map(x=>[x.key,x]));ok('Grund "Reise zu Welt" (Zahl abgeschnitten) = 5',sr['Reise zu Welt']&&sr['Reise zu Welt'].spent===5);
 ok('Kontostand: min 5, Median 23,5, max 42',r.scoops.balance.min===5&&r.scoops.balance.max===42);
 const er=r.errors[0];ok('Fehler: häufigster 3 Mal, 1 Spieler, 2 Sitzungen',er.key.startsWith('TypeError')&&er.n===3&&er.players===1&&er.sessions===2);
 ok('Fehler: zweiter von Mia im Level 1',r.errors[1].lvl===1&&r.errors[1].players===1);
 ok('Hänger: eine Zelle bei 96/-48, 2 Hänger, 1 Befreiung',r.stuck.cells.length===1&&r.stuck.cells[0].stuck===2&&r.stuck.cells[0].unstick===1&&r.stuck.points.length===3);
 ok('Leistung Computer: Median 60 fps',r.perf.d.medianFps===60&&r.perf.d.sessions===1);ok('Leistung Handy: 20 fps, 100 % unter 30, Ruckler 20 %',r.perf.m.medianFps===20&&r.perf.m.lowShare===100&&r.perf.m.slowShare===20);
 ok('Polizei und Graffiti',r.police.alarm===1&&r.police.erwischt===1&&r.graffiti.illegal===1&&r.graffiti.legal===1&&r.graffiti.dabs===420);
 ok('Netz: ein Verbindungsfehler',r.net.fehler===1);
 const pa=r.players.find(p=>p.name==='Anton');ok('Spieler Anton: 2 Sitzungen, 1800 s, 2 Aufträge? nein 1, Fehler 3, online',pa.sessions===2&&pa.play===1800&&pa.quests===1&&pa.err===3&&pa.online);
 /* Eingabeprüfung */
 ok('Ungültige Kennung abgelehnt',cleanIngest({sid:'x'})===null&&cleanIngest(null)===null&&cleanIngest({sid:'a b c d e f g'})===null);
 const c=cleanIngest({sid:'abcdef123456',pid:'zzzzzz1234',name:'<b>Max</b>',play:9999,ev:[['sc','ok',5],['boese','x',1],['err','y',1e12,'a'],'kaputt']});
 ok('Name bereinigt, Spielzeit begrenzt, Ereignisse gefiltert',c.name==='bMaxb'&&c.play===60&&c.ev.length===2&&c.ev[1].n===1e6&&c.ev[1].x===null);
 const many=cleanIngest({sid:'abcdef123456',ev:Array.from({length:100},()=>['sc','x',1])});ok('Höchstens 40 Ereignisse je Paket',many.ev.length===40);
 fs.unlinkSync(tmp)})();
