// © 2026 BinoITA (bino.dev, @bino.devs) — CC BY 4.0: se lo riusi, cita "@bino.devs — github.com/BinoITA/bino-dev-reels"
// Calcola dove mettere la telecamera perché il personaggio stia tra due altezze dello schermo (piedi e punta).
// Uso: node inquadra.mjs '[{"nome":"K1","bino":[0.6,0,0.9],"az":10,"el":0.2,"fov":30,"piedi":1370,"bulbo":560,"top":2.75}]'
import * as THREE from "three";
const W=1080,H=1920;
// per ogni richiesta: posizione di Bino, azimut (gradi, 0 = davanti +z), elevazione camera (altezza relativa), fov, piedi e bulbo desiderati
const req = JSON.parse(process.argv[2]);
for (const r of req) {
  let best=null;
  for (let d=4; d<=40; d+=0.1) for (let ty=0.2; ty<=4.5; ty+=0.05) {
    const a=r.az*Math.PI/180; const b=r.bino;
    const pos=[b[0]+Math.sin(a)*d, ty + d*r.el, b[2]+Math.cos(a)*d];
    const cam=new THREE.PerspectiveCamera(r.fov,W/H,0.1,200); cam.position.set(...pos); cam.lookAt(b[0],ty,b[2]); cam.updateMatrixWorld(); cam.updateProjectionMatrix();
    const p=(y)=>(-new THREE.Vector3(b[0],y,b[2]).project(cam).y*.5+.5)*H;
    const e=Math.abs(p(0)-r.piedi)+Math.abs(p(r.top??2.75)-r.bulbo);
    if(!best||e<best.e) best={e,pos:pos.map(x=>+x.toFixed(2)),guarda:[b[0],+ty.toFixed(2),b[2]]};
  }
  console.log(r.nome.padEnd(6), JSON.stringify({pos:best.pos,guarda:best.guarda,fov:r.fov}), 'err', best.e.toFixed(0));
}
