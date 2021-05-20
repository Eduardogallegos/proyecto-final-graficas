import * as THREE from "../libs/three.js/r125/three.module.js";
import { PointerLockControls } from "../libs/three.js/r125/controls/PointerLockControls.js";

class MainCharacter {
  constructor(renderer, scene) {
    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    this.raycaster = new THREE.Raycaster(
      new THREE.Vector3(),
      new THREE.Vector3(0, -1, 0),
      0,
      15
    );
    this.scene = scene;
    this.renderer = renderer;
    this.direction = new THREE.Vector3();
    this.velocity = new THREE.Vector3();
    this.controls = new PointerLockControls(this.camera, document.body);
    this.moveForward = false;
    this.moveBackward = false;
    this.moveLeft = false;
    this.moveRight = false;
    this.canJump = false;
    this.directions = [
      this.moveForward,
      this.moveBackward,
      this.moveLeft,
      this.moveRight,
    ];
    this.initPointerLock();
  }

  update(objects, prevTime) {
    this.raycaster.ray.origin.copy(this.controls.getObject().position);
    this.raycaster.ray.origin.y -= 10;
    let intersections = this.raycaster.intersectObjects(objects);
    let onObject = intersections.length > 0;
    let time = Date.now();
    let delta = (time - prevTime) / 800;

    this.velocity.x -= this.velocity.x * 1.0 * delta;
    this.velocity.z -= this.velocity.z * 1.0 * delta;
    this.velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass
    this.direction.z = Number(this.moveForward) - Number(this.moveBackward);
    this.direction.x = Number(this.moveRight) - Number(this.moveLeft);
    this.direction.normalize(); // this ensures consistent movements in all directions

    if (this.moveForward || this.moveBackward) this.velocity.z -= this.direction.z * 400.0 * delta;

    if (this.moveLeft || this.moveRight) this.velocity.x -= this.direction.x * 400.0 * delta;

    if (onObject === true) {
        this.velocity.y = Math.max(0, this.velocity.y);
        this.canJump = true;
    }
    this.controls.moveRight(-this.velocity.x * delta);
    this.controls.moveForward(-this.velocity.z * delta);

    this.controls.getObject().position.y += this.velocity.y * delta; // new behavior

    if (this.controls.getObject().position.y < 10) {
        this.velocity.y = 0;
      this.controls.getObject().position.y = 10;
      this.canJump = true;
    }
    prevTime = time;
    this.renderer.render(this.scene, this.camera);
  }

  resize(canvasWidth, canvasHeight) {
    this.camera.aspect = canvasWidth / canvasHeight;
    this.camera.updateProjectionMatriz;
  }

  initPointerLock() {
    let blocker = document.getElementById("blocker");
    let instructions = document.getElementById("instructions");
    let ctx = this

    this.controls.addEventListener("lock", function () {
      instructions.style.display = "none";
      blocker.style.display = "none";
    });

    this.controls.addEventListener("unlock", function () {
      blocker.style.display = "block";
      instructions.style.display = "";
    });

    instructions.addEventListener(
      "click",
      function () {
        ctx.controls.lock();
      },
      false
    );

    this.scene.add(this.controls.getObject());
  }

  areControlsLocked = () => this.controls.isLocked;
  changeWeapon() {}
  attack() {}
  changeDirection(newDirection) {
    this.directions[newDirection] = true;
  }
  stopDirection(newDirection) {
    this.directions[newDirection] = false;
  }
  jump() {
    if (this.canJump === true) this.velocity.y += 350;
    this.canJump = false;
  }
}

export { MainCharacter };
