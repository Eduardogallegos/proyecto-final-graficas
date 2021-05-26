import * as THREE from "../libs/three.js/r125/three.module.js";
import { PointerLockControls } from "../libs/three.js/r125/controls/PointerLockControls.js";
import { Knife } from "./knife.js";
import { Gun } from "./gun.js";
import { Rifle } from "./rifle.js";

class MainCharacter {
  camera = new THREE.PerspectiveCamera(
    450,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  raycaster = new THREE.Raycaster(
    new THREE.Vector3(),
    new THREE.Vector3(0, -1, 0),
    0,
    15
  );
  direction = new THREE.Vector3();
  velocity = new THREE.Vector3();
  controls = new PointerLockControls(this.camera, document.body);
  moveForward = false;
  moveBackward = false;
  moveLeft = false;
  moveRight = false;
  canJump = false;
  prevTime = Date.now();
  weaponsGroup = new THREE.Object3D();
  actualWeapon = new Knife(this.weaponsGroup);
  charPropsInScene = [];

  constructor(renderer, scene) {
    this.scene = scene;
    this.camera.add(this.weaponsGroup);
    this.renderer = renderer;
    this.initPointerLock();
    let ctx = this;
    document.addEventListener("mousedown", function(e){
      ctx.attack(e);
    }, false);
  }

  update(objects) {
    this.raycaster.ray.origin.copy(this.controls.getObject().position);
    this.raycaster.ray.origin.y -= 10;
    let intersections = this.raycaster.intersectObjects(objects);
    let onObject = intersections.length > 0;
    let time = Date.now();
    let delta = (time - this.prevTime) / 800;

    this.velocity.x -= this.velocity.x * 1.0 * delta;
    this.velocity.z -= this.velocity.z * 1.0 * delta;
    this.velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass
    this.direction.z = Number(this.moveForward) - Number(this.moveBackward);
    this.direction.x = Number(this.moveRight) - Number(this.moveLeft);
    this.direction.normalize(); // this ensures consistent movements in all directions

    if (this.moveForward || this.moveBackward)
      this.velocity.z -= this.direction.z * 400.0 * delta;

    if (this.moveLeft || this.moveRight)
      this.velocity.x -= this.direction.x * 400.0 * delta;

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
    this.prevTime = time;
    this.renderer.render(this.scene, this.camera);
  }

  resize(canvasWidth, canvasHeight) {
    this.camera.aspect = canvasWidth / canvasHeight;
    this.camera.updateProjectionMatrix();
  }

  initPointerLock() {
    let blocker = document.getElementById("blocker");
    let instructions = document.getElementById("instructions");
    let ctx = this;

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

  changeWeaponEnum(index) {
    switch (index) {
      case 1:
        if (this.actualWeapon.type != "knife") {
          this.weaponsGroup.children = [];
          this.actualWeapon = new Knife(this.weaponsGroup);
        }
        break;
      case 2:
        if (this.actualWeapon.type != "gun") {
          this.weaponsGroup.children = [];
          this.actualWeapon = new Gun(this.weaponsGroup);
        }
        break;
      case 3:
        if (this.actualWeapon.type != "rifle") {
          this.weaponsGroup.children = [];
          this.actualWeapon = new Rifle(this.weaponsGroup);
        }
        break;
    }
  }

  attack(event) {
    this.actualWeapon.attack(event)
  }

  changeDirection(newDirection) {
    switch (newDirection) {
      case 0:
        this.moveForward = true;
        break;
      case 1:
        this.moveBackward = true;
        break;
      case 2:
        this.moveLeft = true;
        break;
      case 3:
        this.moveRight = true;
        break;
    }
  }
  stopDirection(newDirection) {
    switch (newDirection) {
      case 0:
        this.moveForward = false;
        break;
      case 1:
        this.moveBackward = false;
        break;
      case 2:
        this.moveLeft = false;
        break;
      case 3:
        this.moveRight = false;
        break;
    }
  }
  jump() {
    if (this.canJump === true) this.velocity.y += 350;
    this.canJump = false;
  }
}

export { MainCharacter };
