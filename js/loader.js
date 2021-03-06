import * as THREE from "../libs/three.js/r125/three.module.js";

const floorUrl = "../images/metall010-new-tileable.png";
const cubeUrl = "../images/wooden_crate_2.png";

class Loader {

    loadScene(scene, objects) {
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
                color: 0x0000000 //BLACK
            })
        );

        wall1.position.set(0, 180, -1000);
        scene.add(wall1);
        objects.push(wall1);

        //back
        let wall2 = new THREE.Mesh(
            wallGeometry,
            new THREE.MeshPhongMaterial({
                color: 0x0000000 //BLACK
            })               
        );

        wall2.rotation.y = Math.PI;
        wall2.position.set(0, 180, 1000);
        scene.add(wall2);
        objects.push(wall2);

        //RIGHT
        let wall3 = new THREE.Mesh(
            wallGeometry,
            new THREE.MeshPhongMaterial({
                color: 0x0000000 //BLACK
            })
        );

        wall3.rotation.y = -Math.PI / 2;
        wall3.position.set(1000, 180, 0);
        scene.add(wall3);
        objects.push(wall3);

        //LEFT
        let wall4 = new THREE.Mesh(
            wallGeometry,
            new THREE.MeshPhongMaterial({
                color: 0x0000000 //BLACK
            })
        );

        wall4.rotation.y = Math.PI / 2;
        wall4.position.set(-1000, 180, 0);
        scene.add(wall4);
        objects.push(wall4);

        //BOX
        let boxGeometry = new THREE.BoxGeometry(50, 80, 50);
        let cubeMap = new THREE.TextureLoader().load(cubeUrl);

        for ( let i = 0; i < 50; i ++ ) {
            let boxMaterial = new THREE.MeshPhongMaterial( { specular: 0xffffff, flatShading: true, map:cubeMap } );

            let box = new THREE.Mesh( boxGeometry, boxMaterial );
            box.position.x = Math.floor( Math.random() * 1000);
            box.position.y = -30;
            box.position.z = Math.floor( Math.random() * 900 );

            scene.add( box );
            objects.push( box );
        }   

        // COLUMNA CON CYLINDER GEOMETRY
        let geometryColumn = new THREE.CylinderGeometry(100, 100, 225, 32);
        let materialStructure = new THREE.MeshBasicMaterial({
            color: 0x000000
        });
        let column = new THREE.Mesh(geometryColumn, materialStructure);

        column.position.set(-550, 43, -800);
        scene.add(column);
        objects.push(column);

        let geometryColumn2 = new THREE.CylinderGeometry(100, 100, 190, 32);
        let column2 = new THREE.Mesh(geometryColumn2, materialStructure);

        column2.position.set(-900, 23, 0);
        scene.add(column2);
        objects.push(column2);

        //HIGH HGROUND
        let geometryHighGround = new THREE.BoxGeometry(200, 225, 178);
        let highGround = new THREE.Mesh(geometryHighGround, materialStructure);

        highGround.rotation.y = Math.PI / 2;
        highGround.position.set(-550, 43, -900);
        scene.add(highGround);
        objects.push(highGround);

        let geometryHighGroundFloor = new THREE.BoxGeometry(1600, 50, 150);
        let highGroundFloor = new THREE.Mesh(geometryHighGroundFloor, materialStructure);

        highGroundFloor.position.set(200, 130.5, -925);
        scene.add(highGroundFloor);
        objects.push(highGroundFloor);

        //let testMaterial = new THREE.MeshBasicMaterial ( { color: 0xebeb34 })

        //RAMPA
        let geometryRampa = new THREE.BoxGeometry(400, 400, 50);
        let rampa = new THREE.Mesh(geometryRampa, materialStructure);

        rampa.position.set(950, 39, -688);
        rampa.rotation.x = (-61.5 * Math.PI) / 180;
        scene.add(rampa);
        objects.push(rampa);

        //PLATAFORMA
        let geometryPlataform = new THREE.BoxGeometry(100,20,50);
        let platform = new THREE.Mesh(geometryPlataform, materialStructure);
        
        platform.position.set(-750,0,0)
        scene.add(platform);
        objects.push(platform);
    }
}

export { Loader };