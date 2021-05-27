import * as THREE from "../libs/three.js/r125/three.module.js";
import { OBJLoader } from "../libs/three.js/r125/loaders/OBJLoader.js";

class Bullet {
    bulletModel = {obj:'../models/bullet/45.obj', map:'../models/bullet/dirt_texture.jpg', normalMap:'../models/bullet/metal_scratches.jpg', specularMap:'../models/bullet/metal_scratches_1.jpg'};
    bulletList = [];

    constructor(group){
        this.group = group;
        this.loadObj(this.bulletModel, this.bulletList)
    }
     onError ( err ){ console.error( err ); };

 onProgress( xhr ) {

    if ( xhr.lengthComputable ) {

        const percentComplete = xhr.loaded / xhr.total * 100;
        console.log( xhr.target.responseURL, Math.round( percentComplete, 2 ) + '% downloaded' );
    }
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
  async loadObj(objModelUrl, configuration) {
    try {
      const object = await new OBJLoader().loadAsync(
        objModelUrl.obj,
        this.onProgress,
        this.onError
      );
      let texture = objModelUrl.hasOwnProperty("map")
        ? new THREE.TextureLoader().load(objModelUrl.map)
        : null;
      let normalMap = objModelUrl.hasOwnProperty("normalMap")
        ? new THREE.TextureLoader().load(objModelUrl.normalMap)
        : null;
      let specularMap = objModelUrl.hasOwnProperty("specularMap")
        ? new THREE.TextureLoader().load(objModelUrl.specularMap)
        : null;

      console.log(object);

      object.traverse(function (child) {
        if (child.isMesh) {
          child.material.map = texture;
          child.material.normalMap = normalMap;
          child.material.specularMap = specularMap;
        }
      });

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

      this.group.add(object);
    } catch (err) {
      return this.onError(err);
    }
  }
}

export { Bullet };
