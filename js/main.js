let canvas;
let engine;
let scene;
// vars for handling inputs
let etat = [];

window.onload = startGame;

function startGame() {
    canvas = document.querySelector("#myCanvas");
    engine = new BABYLON.Engine(canvas, true);
    scene = createScene();
    scene.collisionsEnabled = true;
    scene.enablePhysics();
    // modify some default settings (i.e pointer events to prevent cursor to go out of the game window)
    modifySettings();
    scene.toRender = () => {
        let deltaTime = engine.getDeltaTime(); 
        scene.render();
    };
    scene.assetsManager.load();
}

function createScene() {
    let scene = new BABYLON.Scene(engine);
    scene.enablePhysics();
    scene.assetsManager = configureAssetManager(scene);
    let ground = createGround(scene);
    // second parameter is the target to follow
    scene.followCamera = createFollowCamera(scene);
    var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 2, segments: 32}, scene);

    // scene.activeCamera = scene.followCamera;
    createLights(scene);
    return scene;
}

function configureAssetManager(scene) {
    // useful for storing references to assets as properties. i.e scene.assets.cannonsound, etc.
    scene.assets = {};
    let assetsManager = new BABYLON.AssetsManager(scene);
    assetsManager.onProgress = function (remainingCount, totalCount, lastFinishedTask) {
        engine.loadingUIText = "We are loading the scene. " + remainingCount + " out of " + totalCount + " items still need to be loaded.";
        console.log("We are loading the scene. " + remainingCount + " out of " + totalCount + " items still need to be loaded.");
    };
    assetsManager.onFinish = function (tasks) {
        engine.runRenderLoop(function () {
            scene.toRender();
        });
    };
    return assetsManager;
}

function createGround(scene) {
    const groundOptions = { width: 1000, height: 1000};
    //scene is optional and defaults to the current scene
    const ground = BABYLON.MeshBuilder.CreateGround("ground", groundOptions, scene);
    // function onGroundCreated() {
    //     const groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
    //     groundMaterial.diffuseTexture = new BABYLON.Texture("images/motif4.png");
    //     ground.material = groundMaterial;
    //     // to be taken into account by collision detection
    //     ground.checkCollisions = true;
    //     ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9 }, scene);
    // }
    // onGroundCreated();
    console.log(ground);
    return ground;
}

function createLights(scene) {
    // i.e sun light with all light rays parallels, the vector is the direction.
    let light0 = new BABYLON.DirectionalLight("dir0", new BABYLON.Vector3(-1, -1, 0), scene); // sol
    light0.intensity = 0.2;
}

function createFollowCamera(scene) {
    let camera = new BABYLON.FreeCamera("UniversalCamera", new BABYLON.Vector3(0, 1, 10), scene);
    camera.attachControl(true);
    camera.setTarget(BABYLON.Vector3.Zero());
    // camera.radius = 60; // how far from the object to follow
    // camera.heightOffset = 12; // how high above the object to place the camera
    // camera.rotationOffset = 180; // the viewing angle
    // camera.cameraAcceleration = .1; // how fast to move
    // camera.maxCameraSpeed = 5; // speed limit
    return camera;
}

window.addEventListener("resize", () => {
    engine.resize()
});

function modifySettings() {
    scene.inputStates = {};
    scene.inputStates.left = false;
    scene.inputStates.right = false;
    scene.inputStates.up = false;
    scene.inputStates.down = false;
    scene.inputStates.space = false;
    scene.inputStates.monter = false;
    scene.inputStates.descendre = false;
    //add the listener to the main, window object, and update the states
    window.addEventListener('keydown', (event) => {
        if ((event.key === "ArrowLeft") || (event.key === "q") || (event.key === "Q")) {
            scene.inputStates.left = true;
        } else if ((event.key === "ArrowUp") || (event.key === "z") || (event.key === "Z")) {
            scene.inputStates.up = true;
        } else if ((event.key === "ArrowRight") || (event.key === "d") || (event.key === "D")) {
            scene.inputStates.right = true;
        } else if ((event.key === "ArrowDown") || (event.key === "s") || (event.key === "S")) {
            scene.inputStates.down = true;
        } else if (event.key === " ") {
            scene.inputStates.space = true;
        } else if ((event.key === "a") || (event.key === "A")) {
            scene.inputStates.monter = true;
        } else if ((event.key === "e") || (event.key === "E")) {
            scene.inputStates.descendre = true;
        } 
    }, false);
    //if the key will be released, change the states object 
    window.addEventListener('keyup', (event) => {
        if ((event.key === "ArrowLeft") || (event.key === "q") || (event.key === "Q")) {
            scene.inputStates.left = false;
        } else if ((event.key === "ArrowUp") || (event.key === "z") || (event.key === "Z")) {
            scene.inputStates.up = false;
        } else if ((event.key === "ArrowRight") || (event.key === "d") || (event.key === "D")) {
            scene.inputStates.right = false;
        } else if ((event.key === "ArrowDown") || (event.key === "s") || (event.key === "S")) {
            scene.inputStates.down = false;
        } else if (event.key === " ") {
            scene.inputStates.space = false;
        } else if ((event.key === "a") || (event.key === "A")) {
            scene.inputStates.monter = false;
        } else if ((event.key === "e") || (event.key === "E")) {
            scene.inputStates.descendre = false;
        }
    }, false);
}

