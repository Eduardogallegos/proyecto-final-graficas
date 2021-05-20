import { FBXLoader } from "../libs/three.js/r125/loaders/FBXLoader.js";
import * as THREE from "../libs/three.js/r125/three.module.js";
import { MainCharacter } from "../js/character.js"

let scene,
  renderer,
  mainChar;

let objects = [],
  enemies = [];

let currentTime = Date.now();
let duration = 15000; // ms

const floorUrl = "../images/checker_large.gif";

function onKeyDown(event) {
  console.log("Codigo" + event.keyCode)
  switch (event.keyCode) {
    case 38: // up
    case 87: // w
      mainChar.changeDirection(0);
      duration = 2000;
      break;

    case 37: // left
    case 65: // a
      mainChar.changeDirection(2);
      duration = 2000;
      break;

    case 40: // down
    case 83: // s
      mainChar.changeDirection(1);  
      duration = 2000;
      break;

    case 39: // right
    case 68: // d
      mainChar.changeDirection(3);
      duration = 2000;
      break;

    case 32: // space
      mainChar.jump();
      duration = 2000;
      break;
  }
}

function onKeyUp(event) {
  switch (event.keyCode) {
    case 38: // up
    case 87: // w
      mainChar.stopDirection(0);
      duration = 15000;
      break;

    case 37: // left
    case 65: // a
      mainChar.stopDirection(2);
      duration = 15000;
      break;

    case 40: // down
    case 83: // s
      mainChar.stopDirection(1);
      duration = 15000;
      break;

    case 39: // right
    case 68: // d
      mainChar.stopDirection(3);
      duration = 15000;
      break;
    case 32:
      duration = 15000;
      break;
  }
}

function createScene(canvas) {
  renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });

  renderer.setSize(canvas.width, canvas.height);

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);
  scene.fog = new THREE.Fog(0xffffff, 0, 550);

  // A light source positioned directly above the scene, with color fading from the sky color to the ground color.
  // HemisphereLight( skyColor, groundColor, intensity )
  // skyColor - (optional) hexadecimal color of the sky. Default is 0xffffff.
  // groundColor - (optional) hexadecimal color of the ground. Default is 0xffffff.
  // intensity - (optional) numeric value of the light's strength/intensity. Default is 1.
  mainChar = new MainCharacter(renderer, scene)
  let light = new THREE.HemisphereLight(0xeeeeff, 0x777788, 0.75);
  light.position.set(0.5, 1, 0.75);
  scene.add(light);

  document.addEventListener("keydown", onKeyDown, false);
  document.addEventListener("keyup", onKeyUp, false);

  // floor

  let map = new THREE.TextureLoader().load(floorUrl);
  map.wrapS = map.wrapT = THREE.RepeatWrapping;
  map.repeat.set(8, 8);

  let floorGeometry = new THREE.PlaneGeometry(2000, 2000, 100, 100);
  let floor = new THREE.Mesh(
    floorGeometry,
    new THREE.MeshPhongMaterial({
      color: 0xffffff,
      map: map,
      side: THREE.DoubleSide,
    })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0, -70, 0);
  scene.add(floor);

  //ASSETS
  // Load walls && house assets
  loadFBX(
    "./models/house.fbx",
    {
      position: new THREE.Vector3(0, -74, -20),
      scale: new THREE.Vector3(0.05, 0.05, 0.05),
    },
    objects
  );
  // Method to load OBJ models
  //loadObj(objModel, {position: new THREE.Vector3(-8, 0, 0), scale: new THREE.Vector3(3, 3, 3), rotation: new THREE.Vector3(0, 1.58, 0) });
  
  loadEnemies();
}

function setVectorValue(vector, configuration, property, initialValues) {
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

async function loadFBX(fbxModelUrl, configuration, arr) {
  try {
    let object = await new FBXLoader().loadAsync(fbxModelUrl);

    setVectorValue(
      object.position,
      configuration,
      "position",
      new THREE.Vector3(0, 0, 0)
    );
    setVectorValue(
      object.scale,
      configuration,
      "scale",
      new THREE.Vector3(1, 1, 1)
    );
    setVectorValue(
      object.rotation,
      configuration,
      "rotation",
      new THREE.Vector3(0, 0, 0)
    );

    arr.push(object);

    scene.add(object);
  } catch (err) {
    console.error(err);
  }
}

function loadEnemies() {
  /**
   * Function called on every frame to keep the number of enemies on the scene
   * Until now keep it as 1 enemy
   */
  if (!enemies.length) {
    loadFBX(
      "./models/enemy/uga-uga/uga-uga.fbx",
      {
        position: new THREE.Vector3(0, -15, -150),
        scale: new THREE.Vector3(1, 1, 1),
      },
      enemies
    );
  }
}

function update() {
  requestAnimationFrame(update);

  if (mainChar.areControlsLocked()) {
    // Manage enemies
    loadEnemies();
    moveEnemies();
    mainChar.update(objects);
  }
}

function moveEnemies() {
  let now = Date.now();
  let deltat = now - currentTime;
  currentTime = now;
  let fract = deltat / duration;
  let angle = Math.PI * 2 * fract;

  for (const object of enemies) if (object) object.rotation.y += angle / 2;
}

function main() {
  const canvas = document.getElementById("webglcanvas");
  createScene(canvas);
  update();
}

function resize() {
  const canvas = document.getElementById("webglcanvas");

  canvas.width = document.body.clientWidth;
  canvas.height = document.body.clientHeight;
  
  mainChar.resize(canvas.width, canvas.height);

  renderer.setSize(canvas.width, canvas.height);
}

window.onload = () => {
  main();
  resize();
};

window.addEventListener("resize", resize, false);
