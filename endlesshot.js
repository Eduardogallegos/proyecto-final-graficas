import { FBXLoader } from '../libs/three.js/r125/loaders/FBXLoader.js';
import * as THREE from '../libs/three.js/r125/three.module.js'
import { PointerLockControls } from '../libs/three.js/r125/controls/PointerLockControls.js';

let camera, scene, renderer, controls, raycaster, blocker, instructions, velocity, direction;

let objects = [], 
enemies = [];

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;
let prevTime = Date.now();
let currentTime = Date.now();
let duration = 10000; // ms

const floorUrl = "../images/checker_large.gif";

function initPointerLock()
{
    blocker = document.getElementById( 'blocker' );
    instructions = document.getElementById( 'instructions' );

    controls = new PointerLockControls( camera, document.body );

    controls.addEventListener( 'lock', function () {
        instructions.style.display = 'none';
        blocker.style.display = 'none';
    } );
    
    controls.addEventListener( 'unlock', function () {
        blocker.style.display = 'block';
        instructions.style.display = '';
    } );

    instructions.addEventListener( 'click', function () {
        controls.lock();
    }, false );

    scene.add( controls.getObject() );
}

function onKeyDown ( event )
{
    switch ( event.keyCode ) {

        case 38: // up
        case 87: // w
            moveForward = true;
            duration = 2000;
            break;

        case 37: // left
        case 65: // a
            moveLeft = true;
            duration = 2000;
            break;

        case 40: // down
        case 83: // s
            moveBackward = true;
            duration = 2000;
            break;

        case 39: // right
        case 68: // d
            moveRight = true;
            duration = 2000;
            break;

        case 32: // space
            if ( canJump === true ) velocity.y += 350;
            canJump = false;
            duration = 2000;
            break;
    }

}

function onKeyUp( event ) {

    switch( event.keyCode ) {

        case 38: // up
        case 87: // w
            moveForward = false;
            duration = 10000;
            break;

        case 37: // left
        case 65: // a
            moveLeft = false;
            duration = 10000;
            break;

        case 40: // down
        case 83: // s
            moveBackward = false;
            duration = 10000;
            break;

        case 39: // right
        case 68: // d
            moveRight = false;
            duration = 10000;
            break;

    }
}

function createScene(canvas) 
{    
    renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );

    renderer.setSize(canvas.width, canvas.height);

    velocity = new THREE.Vector3();
    direction = new THREE.Vector3();
    
    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xffffff );
    scene.fog = new THREE.Fog( 0xffffff, 0, 550 );

    // A light source positioned directly above the scene, with color fading from the sky color to the ground color. 
    // HemisphereLight( skyColor, groundColor, intensity )
    // skyColor - (optional) hexadecimal color of the sky. Default is 0xffffff.
    // groundColor - (optional) hexadecimal color of the ground. Default is 0xffffff.
    // intensity - (optional) numeric value of the light's strength/intensity. Default is 1.

    let light = new THREE.HemisphereLight( 0xeeeeff, 0x777788, 0.75 );
    light.position.set( 0.5, 1, 0.75 );
    scene.add( light );

    document.addEventListener( 'keydown', onKeyDown, false );
    document.addEventListener( 'keyup', onKeyUp, false );

    // Raycaster( origin, direction, near, far )
    // origin — The origin vector where the ray casts from.
    // direction — The direction vector that gives direction to the ray. Should be normalized.
    // near — All results returned are further away than near. Near can't be negative. Default value is 0.
    // far — All results returned are closer then far. Far can't be lower then near . Default value is Infinity.
    raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 15 );

    // floor

    let map = new THREE.TextureLoader().load(floorUrl);
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(8, 8);

    let floorGeometry = new THREE.PlaneGeometry( 2000, 2000, 100, 100 );
    let floor = new THREE.Mesh(floorGeometry, new THREE.MeshPhongMaterial({color:0xffffff, map:map, side:THREE.DoubleSide}));
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0,-70,0)
    scene.add( floor );

    //ASSETS
    // Load walls && house assets
    loadFBX('./models/house.fbx', {position: new THREE.Vector3(0, -74, -20), scale:new THREE.Vector3(0.05, 0.05, 0.05) }, objects);
    // Method to load OBJ models
    //loadObj(objModel, {position: new THREE.Vector3(-8, 0, 0), scale: new THREE.Vector3(3, 3, 3), rotation: new THREE.Vector3(0, 1.58, 0) });

    initPointerLock();
    loadEnemies();
}

function setVectorValue(vector, configuration, property, initialValues)
{
    if(configuration !== undefined)
    {
        if(property in configuration)
        {
            console.log("setting:", property, "with", configuration[property]);
            vector.set(configuration[property].x, configuration[property].y, configuration[property].z);
            return;
        }
    }

    console.log("setting:", property, "with", initialValues);
    vector.set(initialValues.x, initialValues.y, initialValues.z);
}

async function loadFBX(fbxModelUrl, configuration, arr)
{
    try{
        let object = await new FBXLoader().loadAsync(fbxModelUrl);

        setVectorValue(object.position, configuration, 'position', new THREE.Vector3(0,0,0));
        setVectorValue(object.scale, configuration, 'scale', new THREE.Vector3(1, 1, 1));
        setVectorValue(object.rotation, configuration, 'rotation', new THREE.Vector3(0,0,0));
        
        arr.push(object);

        scene.add( object );
    }
    catch(err)
    {
        console.error( err );
    }
}

function loadEnemies(){
    /**
     * Function called on every frame to keep the number of enemies on the scene
     * Until now keep it as 1 enemy
     */
    if (!enemies.length){
        loadFBX('./models/enemy/uga-uga/uga-uga.fbx', {position: new THREE.Vector3(0, -15, -150), scale:new THREE.Vector3(1, 1, 1) }, enemies);
    }

}

function update() 
{
    requestAnimationFrame( update );

    if ( controls.isLocked === true ) 
    {
        // Manage enemies
        loadEnemies();
        moveEnemies();

        raycaster.ray.origin.copy( controls.getObject().position );
        raycaster.ray.origin.y -= 10;

        let intersections = raycaster.intersectObjects( objects );
        let onObject = intersections.length > 0;
        let time = Date.now();
        let delta = ( time - prevTime ) / 800;

        velocity.x -= velocity.x * 1.0 * delta;
        velocity.z -= velocity.z * 1.0 * delta;
        velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

        direction.z = Number( moveForward ) - Number( moveBackward );
        direction.x = Number( moveRight ) - Number( moveLeft );

        direction.normalize(); // this ensures consistent movements in all directions

        if ( moveForward || moveBackward ) velocity.z -= direction.z * 400.0 * delta;

        if ( moveLeft || moveRight ) velocity.x -= direction.x * 400.0 * delta;

        if ( onObject === true ) {
            velocity.y = Math.max( 0, velocity.y );
            canJump = true;
        }

        controls.moveRight( - velocity.x * delta );
        controls.moveForward( - velocity.z * delta );

        controls.getObject().position.y += ( velocity.y * delta ); // new behavior

        if ( controls.getObject().position.y < 10 ) {
            velocity.y = 0;
            controls.getObject().position.y = 10;
            canJump = true;
        }
        
        prevTime = time;
    }

    renderer.render( scene, camera );


}

function moveEnemies(){
    let now = Date.now();
    let deltat = now - currentTime;
    currentTime = now;
    let fract = deltat / duration;
    let angle = Math.PI * 2 * fract;

    for(const object of enemies)
    if(object)
        object.rotation.y += angle / 2;
 }

function main()
{
    const canvas = document.getElementById("webglcanvas");
    createScene(canvas);
    update();
}

function resize()
{
    const canvas = document.getElementById("webglcanvas");

    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;

    camera.aspect = canvas.width / canvas.height;

    camera.updateProjectionMatrix();
    renderer.setSize(canvas.width, canvas.height);
}

window.onload = () => {
    main();
    resize(); 
};

window.addEventListener('resize', resize, false);