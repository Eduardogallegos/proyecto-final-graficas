import { FBXLoader } from "../libs/three.js/r125/loaders/FBXLoader.js";
import * as THREE from "../libs/three.js/r125/three.module.js";
import { MainCharacter } from "../js/character.js"
import { Mesh } from "./libs/three.js/r125/three.module.js";

let scene,
  renderer,
  mainChar;

let objects = [],
  enemies = [];

let currentTime = Date.now();
let duration = 15000; // ms

const floorUrl = "../images/checker_large.gif";
const cubeUrl = "../images/wooden_crate_2.png";

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
      mainChar.jump();
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
  let light = new THREE.HemisphereLight(0xeeeeff, 0x777788, 0.3);
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

  let wallGeometry = new THREE.PlaneGeometry(2000, 500, 50, 50);
  //front
  let wall1 = new THREE.Mesh(
    wallGeometry,
    new THREE.MeshPhongMaterial({
      color: 0xff0000 //red
    })
  );

  wall1.position.set(0,180,-1000);
  scene.add(wall1);
  objects.push( wall1 );

  //back
  let wall2 = new THREE.Mesh(
    wallGeometry,
    new THREE.MeshPhongMaterial({
      color: 0xceeff00 //yellow
    })
  );

  wall2.rotation.y = Math.PI;
  wall2.position.set(0,180,1000);
  scene.add(wall2);
  objects.push( wall2 );

  //RIGHT
  let wall3 = new THREE.Mesh(
    wallGeometry,
    new THREE.MeshPhongMaterial({
      color: 0x00ff0d //green
    })
  );

  wall3.rotation.y = - Math.PI / 2;
  wall3.position.set(1000,180,0);
  scene.add(wall3);
  objects.push( wall3 );

  //LEFT
  let wall4 = new THREE.Mesh(
    wallGeometry,
    new THREE.MeshPhongMaterial({
      color: 0x0400ff //blue
    })
  );

  wall4.rotation.y = Math.PI / 2;
  wall4.position.set(-1000,180,0);
  scene.add(wall4);
  objects.push( wall4 );

  //BOC
  let boxGeometry = new THREE.BoxGeometry( 50, 50, 50 );
  let cubeMap = new THREE.TextureLoader().load(cubeUrl);

  let boxMaterial = new THREE.MeshPhongMaterial( { specular: 0xffffff, flatShading: true, map:cubeMap } );
        let box = new THREE.Mesh( boxGeometry, boxMaterial );
        box.position.set(0,-10,0);

        scene.add( box );
        objects.push( box );

  // COLUMNA CON CYLINDER GEOMETRY
  let geometryColumn = new THREE.CylinderGeometry( 100, 100, 225, 32 );
  let materialStructure = new THREE.MeshBasicMaterial( {color: 0x000000 } );
  let column = new THREE.Mesh( geometryColumn, materialStructure );
  
  column.position.set(-550, 43,-800);
  scene.add( column ); 
  objects.push ( column );

  //HIGH HGROUND
  let geometryHighGround = new THREE.BoxGeometry(200,225,178);
  let highGround = new THREE.Mesh(geometryHighGround, materialStructure);

  highGround.rotation.y = Math.PI / 2;
  highGround.position.set(-550,43,-900);
  scene.add ( highGround );
  objects.push ( highGround );

  let geometryHighGroundFloor = new THREE.BoxGeometry(1600,50,150);
  let highGroundFloor = new THREE.Mesh(geometryHighGroundFloor, materialStructure);

  highGroundFloor.position.set(200,130.5,-925);
  scene.add ( highGroundFloor );
  objects.push ( highGroundFloor );
  
  //STAIRS
  let geometrystairs1 = new THREE.BoxGeometry(100,225,50);
  let testMaterial = new THREE.MeshBasicMaterial ( { color: 0xebeb34 })
  let stairs1 = new THREE.Mesh(geometrystairs1, materialStructure);

  stairs1.position.set(950,43,-825);
  scene.add( stairs1 );
  objects.push( stairs1 );

  let geometrystairs2 = new THREE.BoxGeometry(100,200,50);
  let stairs2 = new THREE.Mesh(geometrystairs2, materialStructure);

  stairs2.position.set(950,30,-775);
  scene.add( stairs2 );
  objects.push( stairs2 );

  let geometrystairs3 = new THREE.BoxGeometry(100,180,50);
  let stairs3 = new THREE.Mesh(geometrystairs3, materialStructure);

  stairs3.position.set(950,20,-725);
  scene.add( stairs3 );
  objects.push( stairs3 );

  let geometrystairs4 = new THREE.BoxGeometry(100,160,50);
  let stairs4 = new THREE.Mesh(geometrystairs4, materialStructure);

  stairs4.position.set(950,10,-675);
  scene.add( stairs4 );
  objects.push( stairs4 );

  let geometrystairs5 = new THREE.BoxGeometry(100,140,50);
  let stairs5 = new THREE.Mesh(geometrystairs5, materialStructure);

  stairs5.position.set(950,0,-625);
  scene.add( stairs5 );
  objects.push( stairs5 );

  let geometrystairs6 = new THREE.BoxGeometry(100,120,50);
  let stairs6 = new THREE.Mesh(geometrystairs6, materialStructure);

  stairs6.position.set(950,-10,-575);
  scene.add( stairs6 );
  objects.push( stairs6 );

  let geometrystairs7 = new THREE.BoxGeometry(100,100,50);
  let stairs7 = new THREE.Mesh(geometrystairs7, materialStructure);

  stairs7.position.set(950,-20,-525);
  scene.add( stairs7 );
  objects.push( stairs7 );

  let geometrystairs8 = new THREE.BoxGeometry(100,80,50);
  let stairs8 = new THREE.Mesh(geometrystairs8, materialStructure);

  stairs8.position.set(950,-30,-475);
  scene.add( stairs8 );
  objects.push( stairs8 );

  let geometrystairs9 = new THREE.BoxGeometry(100,120,50);
  let stairs9 = new THREE.Mesh(geometrystairs9, materialStructure);

  stairs9.position.set(950,-10,-575);
  scene.add( stairs9 );
  objects.push( stairs9 );

  //RAMPA
  let geometryRampa = new THREE.BoxGeometry(100,400,50);
  let rampa = new THREE.Mesh(geometryRampa, testMaterial);

  rampa.position.set(950, 50,-600);
  rampa.rotation.x = - Math.PI / 3;
  scene.add( rampa );
  objects.push( rampa );

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
