import * as THREE from "../libs/three.js/r125/three.module.js";

class Bullet {
  constructor(scene, position) {
    this.scene = scene;
    // let defaultDirection = new THREE.Vector3(0, 0, 0);
    // let bulletList = [];
    let bulletSize = 0.8;
    let trailSize = 6;
    let mat = new THREE.MeshBasicMaterial({ color: 0x3c2f2f });
    let trailMat = new THREE.MeshBasicMaterial({ color: 0xff3153 }); //, transparent:true, opacity:0.5} );
    let mesh = new THREE.Mesh(
      new THREE.SphereGeometry(bulletSize, 32, 32),
      mat
    );
    let trail = new THREE.Mesh(
      new THREE.CylinderGeometry(bulletSize, 0, trailSize, 3),
      trailMat
    );
    mesh.add(trail);
    let bulletGroup = new THREE.Object3D();
    bulletGroup.add(mesh);
    bulletGroup.position.set(position.x + 2, position.y - 2, position.z - 10);
    this.scene.add(bulletGroup);
  }
}

export { Bullet };
