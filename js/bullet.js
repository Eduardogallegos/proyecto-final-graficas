import * as THREE from "../libs/three.js/r125/three.module.js";

class Bullet {
  bulletSize = 0.8;
  trailSize = 3;
  speed = 1;
  
  constructor(scene, position, direction) {
    this.scene = scene;
    this.direction = direction;
    let mat = new THREE.MeshBasicMaterial({ color: 0xff3153 });
    this.mesh = new THREE.Mesh(
      new THREE.SphereGeometry(this.bulletSize, 32, 32),
      mat
    );
    let bulletGroup = new THREE.Object3D();
    bulletGroup.add(this.mesh);
    bulletGroup.position.set(position.x, position.y - 2, position.z);
    this.raycaster = new THREE.Raycaster(bulletGroup.position, this.direction, 0, 5);
    this.scene.add(bulletGroup);
  }

  update(delta){
    this.mesh.translateOnAxis( this.direction, this.speed * delta);
    this.raycaster.ray.origin.copy(this.mesh.position);
  }
}

export { Bullet };
