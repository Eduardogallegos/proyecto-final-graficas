import { FBXLoader } from "../libs/three.js/r125/loaders/FBXLoader.js";
import * as THREE from "../libs/three.js/r125/three.module.js";
import { MainCharacter } from "../js/character.js";
import { Enemy } from "../js/enemy.js";
import { Loader } from "./js/loader.js";

let scene,
  renderer,
  mainChar,
  loader;

let objects = [],
  enemies = [];

let currentTime = Date.now();
let duration = 15000; // ms


function onKeyDown(event) {
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
      mainChar.jump()
      duration = 2000;
      break;
    case 49:
      mainChar.changeWeaponEnum(1);
      break;
    case 50:
      mainChar.changeWeaponEnum(2);
      break;
    case 51:
      mainChar.changeWeaponEnum(3);
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
    
    case 32: //space
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
  loader = new Loader(scene,objects);

  let ambientlight = new THREE.AmbientLight(0xffffff, 0.2);
  ambientlight.position.set(0.5, 1, 0.75);
  scene.add(ambientlight);

  let light = new THREE.PointLight(0xffffff, 0.8, 18);
	light.position.set(0.5, 1, 0.75);
	light.castShadow = true;
	light.shadow.camera.near = 0.1;
	light.shadow.camera.far = 25;
	scene.add(light);

  document.addEventListener("keydown", onKeyDown, false);
  document.addEventListener("keyup", onKeyUp, false);

  loader.loadScene(scene, objects);

  //ASSETS
  // TANK
  loadFBX(
    "./models/US_Tank/US_Sherman_Tank.fbx",
    {
      position: new THREE.Vector3(-800, -74, -600),
      scale: new THREE.Vector3(0.65, 0.65, 0.65),
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
    console.log(object);
    
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

    if (object.children.length > 0){
      object.children.forEach(chamaco => {
        if (chamaco.type == "Mesh"){
          arr.push(chamaco);
        }
      });
    }

    arr.push(object);

    scene.add(object);
  } catch (err) {
    console.error(err);
  }
}

//carga 4 enemigos en posiciones distintas
function loadEnemies() {
  /**
   * Function called on every frame to keep the number of enemies on the scene
   * Until now keep it as 1 enemy
   */
 
  if (enemies.length < 6) {
      enemies.push(new Enemy(renderer,scene, mainChar.camera.position.x + getRndInteger(-300,300), mainChar.camera.position.y - 70, mainChar.camera.position.z + getRndInteger(-300,300), 0))
      
    // enemies.push(new Enemy(renderer,scene, mainChar.camera.position.x , mainChar.camera.position.y - 70, mainChar.camera.position.z -300, 0),
    // new Enemy(renderer,scene, mainChar.camera.position.x- 150, mainChar.camera.position.y - 70, mainChar.camera.position.z -200, .5),
    // new Enemy(renderer,scene, mainChar.camera.position.x- 250, mainChar.camera.position.y - 70, mainChar.camera.position.z -200, .5),
    // new Enemy(renderer,scene, mainChar.camera.position.x + 250, mainChar.camera.position.y - 70, mainChar.camera.position.z -200, -1));
    // console.log(enemies);
  }

}

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min) ) + min;
}

function update() {
  requestAnimationFrame(update);
  // actualiza posicion de enemigos en cuanto a la camara del jugador 
  // if(mainChar.moveBackward  || mainChar.moveLeft || mainChar.moveRight){
  //   // for (const enemy of enemies) {
  //   //   enemies[2].updatePosition(mainChar.camera.position.x , mainChar.camera.position.y - 70, mainChar.camera.position.z -400, 0);
  //   // } 
  //   let i;
  //   for (i = 0; i < enemies.length; i++) {
  //     enemies[i].setPosition(mainChar.camera.position.x,mainChar.camera.position.y,mainChar.camera.position.z);
  //   }


  // }

  if (mainChar.areControlsLocked()) {
    // Manage enemies
    // loadEnemies;
    //for (const enemy of enemies) if (enemy) Enemy.update(enemy);
    mainChar.update(objects, enemies);
  }

  loadEnemies();
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



