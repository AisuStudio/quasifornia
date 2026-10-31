
{const gold=MS('#f0cf36',{emissive:'#a66b28',emissiveIntensity:.45,roughness:.3}),dark=MS('#141416');
 if(X.chain){for(let q=0;q<X.chain;q++){const ch=new THREE.Mesh(new THREE.TorusGeometry(.1+q*.03,.017,6,20),gold);ch.position.set(0,.62-q*.05,.03+q*.012);ch.rotation.x=Math.PI/2+.28;ch.castShadow=true;tz.add(ch)}
  if(X.pendant){const py=.62-X.chain*.05-.07,pz=.145+X.chain*.02;
   if(X.pendant==='star')S(new THREE.OctahedronGeometry(1),gold,0,py,pz,tz,.055,.075,.03);
   if(X.pendant==='ice'){const cn=S(new THREE.ConeGeometry(1,2,10),MS('#d9a86a'),0,py-.02,pz,tz,.05,.06,.05);cn.rotation.x=Math.PI;S(SP,MS('#f1a7c8'),0,py+.05,pz,tz,.05,.05,.05)}
   if(X.pendant==='ring')S(new THREE.TorusGeometry(.05,.014,6,14),gold,0,py,pz,tz)}}
 if(X.earring)[-1,1].forEach(s=>{const e=new THREE.Mesh(new THREE.TorusGeometry(.03,.007,6,12),gold);e.position.set(s*.118,-.045,-.01);e.rotation.y=Math.PI/2;hd.add(e)});
 if(X.bangles&&g.userData.arms)g.userData.arms.forEach(({sg})=>{const eg=sg.userData.eg;if(!eg)return;[0,1].forEach(q=>{const bg=new THREE.Mesh(new THREE.TorusGeometry(.058,.013,6,14),gold);bg.position.y=-.2-q*.035;bg.rotation.x=Math.PI/2;bg.castShadow=true;eg.add(bg)})});
 if(X.scarf){const sc2=new THREE.Mesh(new THREE.TorusGeometry(.12,.034,8,18),MS(X.scarf));sc2.position.set(0,.64,.02);sc2.rotation.x=Math.PI/2+.2;sc2.castShadow=true;tz.add(sc2);S(BX,MS(X.scarf),.07,.5,.13,tz,.07,.2,.02)}
 if(X.bag){S(BX,MS(X.bag),0,.04,.15,tz,.26,.1,.07);S(BX,dark,0,.07,.186,tz,.2,.012,.01);S(CY,dark,0,.07,0,tz,.2,.015,.17)}
 if(X.phonesNeck){const t=new THREE.Mesh(new THREE.TorusGeometry(.13,.012,6,16,Math.PI),MS(X.phonesNeck));t.position.set(0,.7,.02);t.rotation.set(Math.PI/2+.25,0,Math.PI);tz.add(t);[-1,1].forEach(s=>{const c2=S(CY,MS(X.phonesNeck),s*.12,.52,.12,tz,.04,.02,.04);c2.rotation.x=Math.PI/2})}
 const hemi2=new THREE.SphereGeometry(1,16,9,0,Math.PI*2,0,Math.PI/2);
 if(X.hat==='bucket'){S(CY,MS(X.hc||'#eae8e8'),0,.07,0,hd,.2,.012,.2);S(hemi2,MS(X.hc||'#eae8e8'),0,.07,0,hd,.13,.12,.13)}
 if(X.hat==='beanie'){S(hemi2,MS(X.hc),0,.035,0,hd,.13,.14,.14);const cf=new THREE.Mesh(new THREE.TorusGeometry(.125,.028,8,18),MS(X.hc2||X.hc));cf.position.set(0,.04,0);cf.rotation.x=Math.PI/2;hd.add(cf);S(SP,MS(X.hc2||'#f0cf36'),0,.19,0,hd,.04,.04,.04)}
 if(X.hat==='fwdcap'){S(hemi2,MS(X.hc),0,.02,0,hd,.125,.12,.135);const br=S(BX,MS(X.hc2||X.hc),0,.035,.14,hd,.15,.016,.1);br.rotation.x=-.12}
 if(X.hat==='crown'){const cr=new THREE.Mesh(new THREE.CylinderGeometry(.11,.095,.06,12,1,true),gold);cr.position.set(0,.14,0);hd.add(cr);for(let q=0;q<6;q++){const a=q/6*Math.PI*2;S(new THREE.ConeGeometry(1,2,6),gold,Math.cos(a)*.105,.2,Math.sin(a)*.105,hd,.022,.04,.022)}}
 if(X.gl==='visor'){S(BX,MS(o.lens,{roughness:.15}),0,.022,.118,hd,.27,.05,.02);S(BX,MS(o.frame),0,.052,.12,hd,.28,.01,.024)}
 if(X.gl==='big')[-1,1].forEach(s=>{S(SP,MS(o.lens,{roughness:.15}),s*.06,.02,.116,hd,.062,.05,.014);S(SP,MS(o.frame),s*.06,.02,.111,hd,.07,.058,.012)});
 if(X.gl==='heart')[-1,1].forEach(s=>{S(SP,MS('#d54291',{roughness:.2}),s*.04,.032,.118,hd,.034,.034,.014);S(SP,MS('#d54291',{roughness:.2}),s*.07,.032,.118,hd,.034,.034,.014);const t=S(new THREE.ConeGeometry(1,2,6),MS('#d54291',{roughness:.2}),s*.055,.003,.118,hd,.04,.04,.012);t.rotation.z=Math.PI})}
