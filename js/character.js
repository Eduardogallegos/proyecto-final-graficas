import * as THREE from "../libs/three.js/r125/three.module.js";
import { PointerLockControls } from "../libs/three.js/r125/controls/PointerLockControls.js";
import { FBXLoader } from "../libs/three.js/r125/loaders/FBXLoader.js";

class MainCharacter {

  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  
  downRaycaster = new THREE.Raycaster(
    new THREE.Vector3(),
    new THREE.Vector3(0, -1, 0),
    0,
    15
  );

  raycasterWalls = new THREE.Raycaster(
    new THREE.Vector3(),
    //this.camera,
    //this.frontRaycaster.ray.setFromCamera(this.scene, this.camera), //CAMARA + DONDE VE LA CAMARA raycater.ray.setcamera
    // Entender que tenemos que hay que mandarle si uso setCamera(mosue,camera)
    // crosspoint
    new THREE.Vector3(),
    0,
    this.wallDistance + 0.1
  );

  // backRaycaster = new THREE.Raycaster(
  //   new THREE.Vector3(),
  //   new THREE.Vector3(0,0,1),
  //   0,
  //   5
  // );

  // rightRaycaster = new THREE.Raycaster(
  //   new THREE.Vector3(),
  //   new THREE.Vector3(1,0,0),
  //   0,
  //   5
  // );

  // leftRaycaster = new THREE.Raycaster(
  //   new THREE.Vector3(),
  //   new THREE.Vector3(-1,0,0),
  //   0,
  //   5
  // );

  direction = new THREE.Vector3(0,0,0); //directionRay
  velocity = new THREE.Vector3();
  controls = new PointerLockControls(this.camera, document.body);
  moveForward = false;
  moveBackward = false;
  moveLeft = false;
  moveRight = false;
  canJump = false;
  playerSpeed = 5;
  wallDistance = 0.1;
  prevTime = Date.now();
  characterGroup =  new THREE.Object3D();

  constructor(renderer, scene) {
    this.scene = scene;
    this.scene.add(this.characterGroup);
    this.renderer = renderer;
    this.initPointerLock();
    this.loadFBX(
        "../models/hands/Rigged Hand.fbx",
        {
        position: new THREE.Vector3(15, -100, 15),
        scale: new THREE.Vector3(100, 100, 100),
        }
    );
    // let container = document.getElementById("container")
    // container.addEventListener("scroll", this.changeWeapon, false);
    // container.addEventListener("click", this.attack, false);
  }

  update(objects) {

    let time = Date.now();
    let delta = (time - this.prevTime) / 800;

    // this.velocity.x -= this.velocity.x * this.playerSpeed * delta;
    // this.velocity.z -= this.velocity.z * this.playerSpeed * delta;
    this.velocity.y -= 10 * 100.0 * delta; // 100.0 = mass
    //this.direction.z = Number(this.moveForward) - Number(this.moveBackward);
    //this.direction.x = Number(this.moveRight) - Number(this.moveLeft);
    this.direction.normalize(); // this ensures consistent movements in all directions
    
    this.downRaycaster.ray.origin.copy(this.controls.getObject().position);
    this.downRaycaster.ray.origin.y -= 40;
    let downintersections = this.downRaycaster.intersectObjects(objects);

    
    let dirCopy = new THREE.Vector3().copy(this.direction);
    // console.log(dirCopy);
    let vectorDir = dirCopy.applyMatrix4(new THREE.Matrix4().extractRotation(this.controls.getObject().matrix)).normalize();
    //console.log (vectorDir);
    
    this.raycasterWalls.ray.origin.copy(this.controls.getObject().position);
    this.raycasterWalls.ray.direction.copy(vectorDir);
    let intersectionWalls = this.raycasterWalls.intersectObjects(objects);

    if ( this.moveForward && !(dirCopy.z!== 0 && intersectionWalls.length >= 1)) this.controls.getObject().translateZ(-this.playerSpeed * delta * 100);
    if ( this.moveBackward && !(dirCopy.z!==0 && intersectionWalls.length >= 1)) this.controls.getObject().translateZ(this.playerSpeed * delta * 100);
    if ( this.moveLeft && !(dirCopy.x!==0 && intersectionWalls.length >= 1)) this.controls.getObject().translateX(-this.playerSpeed * delta * 100);
    if ( this.moveRight && !(dirCopy.x!==0 && intersectionWalls.length >= 1)) this.controls.getObject().translateX(this.playerSpeed * delta * 100);



    // let frontBump = frontintersections.length > 0;
    // this.backRaycaster.ray.origin.copy(this.controls.getObject().position);
    // let backintersections = this.backRaycaster.intersectObjects(objects);
    // let backBump = backintersections.length > 0;

    // this.rightRaycaster.ray.origin.copy(this.controls.getObject().position);
    // let rightintersections = this.rightRaycaster.intersectObjects(objects);
    // let rightBump = rightintersections.length > 0;

    // this.leftRaycaster.ray.origin.copy(this.controls.getObject().position);
    // let leftintersections = this.leftRaycaster.intersectObjects(objects);
    // let leftBump = leftintersections.length > 0;

    
    // MOVIMIENTO
    // if (this.moveForward || this.moveBackward)
    //   this.velocity.z -= this.direction.z * 800.0 * delta;

    // if (this.moveLeft || this.moveRight)
    //   this.velocity.x -= this.direction.x * 800.0 * delta;

    // SALTO
    if (downintersections.length > 0 === true) {
      this.velocity.y = Math.max(0, this.velocity.y);
      this.canJump = true;
    }

    //LOGICA PARA NO ATRAVESAR COSAS
    // if (frontBump === true){
    //   this.velocity.z = Math.max(0, this.velocity.z);
    // }
    // if (backBump === true){
    //   this.velocity.z = Math.min(0, this.velocity.z);
    // }
    // if (rightBump === true){
    //   this.velocity.x = Math.max(0, this.velocity.x);
    // }
    // if (leftBump === true){
    //   this.velocity.x = Math.min(0, this.velocity.x);
    // }

    // this.controls.moveRight(-this.velocity.x * delta);
    // this.controls.moveForward(-this.velocity.z * delta);

    this.controls.getObject().position.y += this.velocity.y * delta; // new behavior

    if (this.controls.getObject().position.y < 10) {
      this.velocity.y = 0;
      this.controls.getObject().position.y = 10;
      this.canJump = true;
    }

    this.characterGroup.position.set(this.camera.position.x, this.camera.position.y, this.camera.position.z);
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

  setVectorValue(vector, configuration, property, initialValues) {
    if (configuration !== undefined) {
      if (property in configuration) {
        console.log("setting:", property, "with", configuration[property]);
        vector.set(
          configuration[property].x,
          configuration[property].y,
          configuration[property].z
        );
        return;
      }
    }

    console.log("setting:", property, "with", initialValues);
    vector.set(initialValues.x, initialValues.y, initialValues.z);
  }

  async loadFBX(fbxModelUrl, configuration) {
    try {
      let object = await new FBXLoader().loadAsync(fbxModelUrl);
      console.log(object)

    //   object.castShadow = true;
    //     object. receiveShadow = true;

    //     object.mixer = new THREE.AnimationMixer( this.scene );
        
    //     object.action = object.mixer.clipAction( object.animations[2], object).setDuration( 0.041 )
    //     object.action.play();
      this.setVectorValue(
        object.position,
        configuration,
        "position",
        new THREE.Vector3(0, 0, 0)
      );
      this.setVectorValue(
        object.scale,
        configuration,
        "scale",
        new THREE.Vector3(1, 1, 1)
      );
      this.setVectorValue(
        object.rotation,
        configuration,
        "rotation",
        new THREE.Vector3(0, 0, 0)
      );

      this.characterGroup.add(object);
    } catch (err) {
      console.error(err);
    }
  }

  areControlsLocked = () => this.controls.isLocked;

  changeWeapon(event) {
    console.log("Changing weapon" + event);
  }
  changeWeaponEnum(index) {
    console.log("Changing weapon @ " + index);
  }
  attack(event) {
    console.log("Attacking" + event);
  }
  changeDirection(newDirection) {
    switch (newDirection) {
      case 0:
        this.moveForward = true;
        this.direction.z = -this.wallDistance;
        break;
      case 1:
        this.moveBackward = true;
        this.direction.z = this.wallDistance;
        break;
      case 2:
        this.moveLeft = true;
        this.direction.x = -this.wallDistance;
        break;
      case 3:
        this.moveRight = true;
        this.direction.x = this.wallDistance;
        break;
    }
  }
  stopDirection(newDirection) {
    switch (newDirection) {
      case 0:
        this.moveForward = false;
        this.direction.z = 0;
        break;
      case 1:
        this.moveBackward = false;
        this.direction.z = 0;
        break;
      case 2:
        this.moveLeft = false;
        this.direction.x = 0;
        break;
      case 3:
        this.moveRight = false;
        this.direction.x = 0;
        break;
    }
  }
  jump() {
    if (this.canJump === true) this.velocity.y += 350;
    this.canJump = false;
  }
}

export { MainCharacter };
