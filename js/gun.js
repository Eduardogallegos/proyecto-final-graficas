import * as THREE from "../libs/three.js/r125/three.module.js";
import { FBXLoader } from "../libs/three.js/r125/loaders/FBXLoader.js";
// Handgun_fbx_7.4_binary.fbx
class Gun {
  type = "gun";
  isAttacking = false;

  constructor(group) {
    this.group = group;
    this.loadFBX("../models/weapons/Pistol.fbx", {
      position: new THREE.Vector3(2, -4, -4),
      scale: new THREE.Vector3(0.02, 0.02, 0.02),
    });
  }

  async attack(event) {
    if (!this.isAttacking) {
      this.isAttacking = true;
      console.log("Attacking gun");
      console.log(event);
      let xRotation = 0.2;
      this.group.rotation.x += xRotation;
      await this.sleep(400);
      this.group.rotation.x -= xRotation;
      this.isAttacking = false;
    }
  }

  sleep = (milliseconds) =>
    new Promise((resolve) => setTimeout(resolve, milliseconds));

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
      console.log(object);

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
        new THREE.Vector3(0, 3, 0)
      );

      this.group.add(object);
    } catch (err) {
      console.error(err);
    }
  }
}

export { Gun };
