// Baut den Postkarten-Look des Logos: Buchstaben ausgestanzt, dahinter Szenenbilder (src/logo/scenes/*.jpg), roter Schatten, dunkle Kontur.
// Aufruf im Ordner prototype/kuesten-quest: node tools/make-logo.js   (schreibt src/logo/port36_postcard.svg)
const {chromium}=require('playwright');const fs=require('fs'),path=require('path');
const R=path.join(__dirname,'..'),L=path.join(R,'src/logo');
(async()=>{
 const svg=fs.readFileSync(path.join(L,'port36_logo.svg'),'utf8');
 const b=await chromium.launch();const p=await b.newPage();await p.setContent('<body>'+svg.replace(/<\?xml[^>]*\?>/,'')+'</body>');
 const letters=await p.evaluate(()=>[...document.querySelectorAll('path')].map(e=>{const bb=e.getBBox();return {d:e.getAttribute('d'),x:bb.x,y:bb.y,w:bb.width,h:bb.height}}));
 await b.close();
 letters.sort((a,c)=>a.x-c.x);
 const scenes=['p-kueste','o-cafe','r-burger','t-hochbahn','3-unterwelt','6-kanal'].map(n=>'data:image/jpeg;base64,'+fs.readFileSync(path.join(L,'scenes',n+'.jpg')).toString('base64'));
 let defs='',lay='';
 letters.forEach((l,i)=>{defs+=`<clipPath id="c${i}"><path d="${l.d}"/></clipPath>`;
  lay+=`<g transform="translate(7 10)"><path d="${l.d}" fill="#d63a2f" stroke="#7a1d18" stroke-width="16" stroke-linejoin="round"/></g>`;});
 letters.forEach((l,i)=>{const pad=6;
  lay+=`<path d="${l.d}" fill="#14111f" stroke="#14111f" stroke-width="16" stroke-linejoin="round"/>`;
  lay+=`<g clip-path="url(#c${i})"><image href="${scenes[i]}" x="${l.x-pad}" y="${l.y-pad}" width="${l.w+2*pad}" height="${l.h+2*pad}" preserveAspectRatio="xMidYMid slice"/></g>`;
  lay+=`<path d="${l.d}" fill="none" stroke="#fff3d6" stroke-width="7" stroke-linejoin="round"/>`;
  lay+=`<path d="${l.d}" fill="none" stroke="#14111f" stroke-width="2" stroke-linejoin="round" transform="translate(0 0)"/>`;});
 const out=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="-16 -14 610 236"><defs>${defs}</defs>${lay}</svg>`;
 fs.writeFileSync(path.join(L,'port36_postcard.svg'),out);console.log('geschrieben',out.length,'Zeichen');
})();
