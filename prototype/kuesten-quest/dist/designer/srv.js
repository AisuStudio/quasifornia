/* Server-Speicher für Entwürfe (gemeinsam für Avatar und Haus). Spricht mit /api/entwurf/<art> (worker/entwuerfe.js).
   Nutzung: EntwurfSrv(boxElement, 'avatar'|'haus', {get:()=>Objekt mit Daten (name wird gesetzt), set:(Objekt)=>…})
   Jede Speicherung ist eine neue Version. Es gibt kein Löschen. Läuft nur auf der Spiel-Seite (gleiche Herkunft, Seitenpasswort);
   woanders (z. B. lokaler Dateiserver) meldet es "kein Server". */
(function(){
  const API='/api/entwurf/';
  const slug=n=>String(n).toLowerCase().replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue').replace(/ß/g,'ss').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,32);
  const mk=(t,a,c)=>{const e=document.createElement(t);if(a)Object.assign(e,a);if(c)e.append(...[].concat(c));return e};
  window.EntwurfSrv=function(box,art,hooks){
    const name=mk('input',{type:'text',maxLength:40,placeholder:'Name des Entwurfs',id:'srv-name',value:'',ariaLabel:'Name des Entwurfs'});
    name.setAttribute('aria-label','Name des Entwurfs');
    const save=mk('button',{type:'button',textContent:'Auf Server speichern',id:'srv-save'});
    const list=mk('select',{id:'srv-list'});list.setAttribute('aria-label','Gespeicherte Entwürfe');
    const ver=mk('select',{id:'srv-ver'});ver.setAttribute('aria-label','Version');
    const load=mk('button',{type:'button',textContent:'Laden',id:'srv-load'});
    const msg=mk('div',{id:'srv-msg',role:'status'});msg.style.cssText='min-height:18px;font-size:12px;opacity:.85';
    const row1=mk('div',{className:'row'},[name,save]),row2=mk('div',{className:'row'},[list,ver,load]);
    row1.style.cssText=row2.style.cssText='display:flex;flex-wrap:wrap;gap:4px;margin:4px 0';
    box.append(row1,row2,msg);
    const say=t=>{msg.textContent=t};
    async function api(path,o){let r;try{r=await fetch(API+path,{credentials:'same-origin',...o})}catch(e){const x=new Error('kein Server');x.kein=true;throw x}
      if(r.status===404&&!o&&path===art){const x=new Error('kein Server');x.kein=true;throw x}
      if(!r.ok){const t=await r.text().catch(()=>'');const x=new Error(t||('Fehler '+r.status));x.status=r.status;throw x}return r}
    async function refresh(sel){
      try{const j=await (await api(art)).json();list.innerHTML='';
        if(!j.entwuerfe.length){list.append(mk('option',{value:'',textContent:'(noch nichts gespeichert)'}));ver.innerHTML='';return}
        j.entwuerfe.forEach(e=>list.append(mk('option',{value:e.id,textContent:e.name+' (v'+e.v+')'})));
        if(sel)list.value=sel;await versions();say(j.entwuerfe.length+' Entwürfe auf dem Server.')}
      catch(e){list.innerHTML='';ver.innerHTML='';say(e.kein?'Kein Server hier. Speichern auf dem Server geht nur auf der Spiel-Seite (/designer/).':'Liste nicht geladen: '+e.message)}}
    async function versions(){ver.innerHTML='';if(!list.value)return;
      try{const j=await (await api(art+'/'+list.value+'/versionen')).json();j.versionen.slice().reverse().forEach(x=>ver.append(mk('option',{value:x.v,textContent:'Version '+x.v+' · '+new Date(x.t).toLocaleString('de-DE')})))}catch(e){}}
    list.onchange=versions;
    save.onclick=async()=>{const n=name.value.trim();const id=slug(n);if(!id){say('Bitte einen Namen eingeben (Buchstaben oder Zahlen).');return}
      let data;try{data=hooks.get(n)}catch(e){say('Daten konnten nicht gelesen werden: '+e.message);return}
      data.name=n;
      try{const r=await (await api(art+'/'+id,{method:'PUT',headers:{'content-type':'application/json'},body:JSON.stringify(data)})).json();say('Gespeichert: '+r.name+', Version '+r.v+'.');await refresh(id)}
      catch(e){say(e.kein?'Kein Server hier.':e.status===429?'Zu viele Speicherungen, bitte kurz warten.':'Nicht gespeichert: '+e.message)}};
    load.onclick=async()=>{const id=list.value;if(!id){say('Nichts zum Laden.');return}
      try{const t=await (await api(art+'/'+id+(ver.value?'?v='+ver.value:''))).text();hooks.set(JSON.parse(t));const o=JSON.parse(t);name.value=o.name||'';say('Geladen: '+(o.name||id)+(ver.value?', Version '+ver.value:'')+'.')}
      catch(e){say('Laden fehlgeschlagen: '+e.message)}};
    refresh();
    return {refresh,name,say};
  };
})();
