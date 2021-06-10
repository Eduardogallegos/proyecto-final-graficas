import * as THREE from "../libs/three.js/r125/three.module.js";
//import { PointerLockControls } from "../libs/three.js/r125/controls/PointerLockControls.js";
import { FBXLoader } from "../libs/three.js/r125/loaders/FBXLoader.js";
import { Rifle } from "./rifle.js";
import { MainCharacter } from "../js/character.js";

class Enemy {

    currentTime = Date.now();
    enemyGroup =  new THREE.Object3D();
    
    duration = 15000; // ms

    constructor(renderer, scene, x, y, z, rot) {
      this.scene = scene;
      this.scene.add(this.enemyGroup);
      this.renderer = renderer;
      this.x = 0;
      this.y = 0;
      this.z = 0 
      //this.initPointerLock();
   
    
      //this.drawEnemy(this.enemies, 15, -70, -500,0);
      // this.drawEnemy(100, -70, -400,0);
      // this.drawEnemy(-100, -70, -400,0);
     
      this.loadFBX(
        "../models/US_Tank_Crew.fbx",
          {
          position: new THREE.Vector3(x,y,z), //15, -70, -150
          scale: new THREE.Vector3(.15, .15, .15),
          rotation: new THREE.Vector3(0,rot,0),
          }
      );

      // let container = document.getElementById("container")
      // container.addEventListener("scroll", this.changeWeapon, false);
      // container.addEventListener("click", this.attack, false);
    }
   
    // drawEnemy(array,x,y,z,rot){
    //     this.loadFBX(
    //       "../models/US_Tank_Crew.fbx",
    //           {
    //           position: new THREE.Vector3(x,y,z),
    //           scale: new THREE.Vector3(.2, .2, .2),
    //           rotation: new THREE.Vector3(0,rot,0),
    //           },
    //          array
    //       );
         
    // }

    setPosition(x,y,z){
      this.enemyGroup.position.set(x,y,z)
    }

    static update(enemy) {
        let now = Date.now();
        let deltat = now - this.currentTime;
        this.currentTime = now;
        let fract = deltat / this.duration;
        let angle = Math.PI * 2 * fract;
        if (enemy) enemy.rotation.y += angle / 2;
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

async loadFBX(fbxModelUrl, configuration, ) {
    try {
      let object = await new FBXLoader().loadAsync(fbxModelUrl);
      console.log(object)

    //   object.castShadow = true;
    //     object. receiveShadow = true;

    object.mixer = new THREE.AnimationMixer( this.scene );
        
    object.action = object.mixer.clipAction( object.animations[2], object).setDuration( 0.041 )
    object.action.play();
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

      //arr.push(object);

      this.enemyGroup.add(object);
    } catch (err) {
      console.error(err);
    }
  }

}

export { Enemy };
