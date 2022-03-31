import Dude from "./Dude.js";
import Wall from "./Wall.js";
import Box from "./Box.js";
import ButtonSol from "./ButtonSol.js";

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
    let mainSoul = scene.getMeshByName("mainSoul");
    scene.toRender = () => {
        let deltaTime = engine.getDeltaTime(); // remind you something ?
        mainSoul.move();
        let heroDude = scene.getMeshByName("heroDude");
        if (heroDude) {
            heroDude.Dude.move(scene);
            var bounder = heroDude.Dude.getBoundingBox();
            bounder.actionManager = new BABYLON.ActionManager(scene);
            bounder.actionManager.registerAction(new BABYLON.ExecuteCodeAction({ trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger, parameter: { mesh: mainSoul } }, function () {
                mainSoul.position.x = 0;
                mainSoul.position.y = 5;
                mainSoul.position.z = -430;
            }));
        }
        if (scene.dudes) {
            var bounder = [];
            for (var i = 0; i < scene.dudes.length; i++) {
                scene.dudes[i].Dude.move(scene);
                bounder[i] = scene.dudes[i].Dude.getBoundingBox();
                bounder[i].actionManager = new BABYLON.ActionManager(scene);
                bounder[i].actionManager.registerAction(new BABYLON.ExecuteCodeAction({ trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger, parameter: { mesh: mainSoul } }, function () {
                    mainSoul.position.x = 0;
                    mainSoul.position.y = 5;
                    mainSoul.position.z = -430;
                }));
            }
        }
        scene.render();
    };
    scene.assetsManager.load();
}

function createScene() {
    let scene = new BABYLON.Scene(engine);
    scene.enablePhysics();
    scene.assetsManager = configureAssetManager(scene);
    let ground = createGround(scene);
    let walls = createWalls(scene);
    let plafond = creerPlafond(scene);
    let mainSoul = createMainSoul(scene);
    mainSoul.ellipsoid = new BABYLON.Vector3(5, 5, 5); // ellipse autour du mainSoul pour éviter de s'enfoncer dans le sol 
    let box = createBox(scene);
    let bouton = createButton(scene, mainSoul);
    // second parameter is the target to follow
    scene.followCamera = createFollowCamera(scene, mainSoul);
    scene.activeCamera = scene.followCamera;
    createLights(scene);
    createHeroDude(scene);
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
    const groundOptions = { width: 1000, height: 1000, subdivisions: 2 };
    //scene is optional and defaults to the current scene
    const ground = BABYLON.MeshBuilder.CreateGround("gdhm", groundOptions, scene);
    function onGroundCreated() {
        const groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
        groundMaterial.diffuseTexture = new BABYLON.Texture("images/motif4.png");
        ground.material = groundMaterial;
        // to be taken into account by collision detection
        ground.checkCollisions = true;
        ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9 }, scene);
    }
    onGroundCreated();
    return ground;
}

function creerPlafond(scene) {
    const Options = { width: 1000, height: 10, depth: 1000 };
    const plafond = BABYLON.MeshBuilder.CreateBox("plafond", Options, scene);
    plafond.position = new BABYLON.Vector3(0, 100, 0);
    const plafondMaterial = new BABYLON.StandardMaterial("plafondMaterial", scene);
    plafondMaterial.diffuseTexture = new BABYLON.Texture("images/motif.jpg");
    plafond.material = plafondMaterial;
    plafond.checkCollisions = true;
}

function createWalls(scene) {
    // (scene, witdh, height, depth, x, y, z, number)
    // murs extérieurs
    var wall1 = new Wall(scene, 1000, 100, 10, 0, 50, 500); // mur 1 x en face
    var wall2 = new Wall(scene, 1000, 100, 10, 0, 50, -500); // mur 2 x derriere
    var wall3 = new Wall(scene, 10, 100, 1000, 500, 50, 0); // mur 3 z à droite
    var wall4 = new Wall(scene, 10, 100, 1000, -500, 50, 0); // mur 4 z à gauche
    // premier couloir
    var wall5 = new Wall(scene, 10, 100, 200, 30, 50, -400);
    var wall6 = new Wall(scene, 10, 100, 200, -30, 50, -400);
    // premiere piece
    var wall7 = new Wall(scene, 200, 100, 10, -130, 50, -300); var wall8 = new Wall(scene, 200, 100, 10, 130, 50, -300);
    var wall9 = new Wall(scene, 10, 100, 110, -230, 50, -250); var wall10 = new Wall(scene, 10, 100, 150, 230, 50, -225);
    var wall11 = new Wall(scene, 140, 100, 10, -160, 50, -150); var wall12 = new Wall(scene, 140, 100, 10, 160, 50, -150);
    var wall13 = new Wall(scene, 60, 100, 10, 40, 50, -150); var wall14 = new Wall(scene, 60, 100, 10, -40, 50, -150);
    var wall15 = new Wall(scene, 10, 100, 30, -230, 50, -160);
    // deuxieme piece
    var wall16 = new Wall(scene, 10, 100, 200, 30, 50, -50); var wall17 = new Wall(scene, 10, 100, 200, -30, 50, -50);
    var wall18 = new Wall(scene, 200, 100, 10, -130, 50, 50); var wall19 = new Wall(scene, 200, 100, 10, 130, 50, 50);
    var wall20 = new Wall(scene, 10, 100, 150, -230, 50, 125); var wall21 = new Wall(scene, 10, 100, 150, 230, 50, 125);
    var wall22 = new Wall(scene, 140, 100, 10, -160, 50, 200); var wall23 = new Wall(scene, 140, 100, 10, 160, 50, 200);
    var wall24 = new Wall(scene, 60, 100, 10, 40, 50, 200); var wall25 = new Wall(scene, 60, 100, 10, -40, 50, 200);
    // troisieme piece
    var wall26 = new Wall(scene, 70, 100, 10, -270, 50, -150); var wall27 = new Wall(scene, 170, 100, 10, -410, 50, -150);
    var wall28 = new Wall(scene, 10, 100, 170, -350, 50, -60); var wall29 = new Wall(scene, 10, 100, 150, -350, 50, 120);
    var wall30 = new Wall(scene, 140, 100, 10, -160, 50, 200); var wall31 = new Wall(scene, 140, 100, 10, -160, 50, 200);
    var wall32 = new Wall(scene, 55, 100, 10, -327.5, 50, 200); var wall33 = new Wall(scene, 50, 100, 10, -255, 50, 200);
    // quatrieme piece
    var wall34 = new Wall(scene, 70, 100, 10, 265, 50, -150); var wall35 = new Wall(scene, 170, 100, 10, 405, 50, -150);
    var wall36 = new Wall(scene, 10, 100, 170, 350, 50, -60); var wall37 = new Wall(scene, 10, 100, 150, 350, 50, 120);
    var wall38 = new Wall(scene, 140, 100, 10, 160, 50, 200); var wall39 = new Wall(scene, 50, 100, 10, 255, 50, 200);
    var wall40 = new Wall(scene, 200, 100, 10, 400, 50, 200);
    // cinquieme piece
    var wall41 = new Wall(scene, 10, 100, 300, -30, 50, 350); var wall42 = new Wall(scene, 10, 100, 300, -200, 50, 350);
    // sixieme piece
    var wall43 = new Wall(scene, 10, 100, 300, 30, 50, 350);
    // portes
    var porte1 = new Wall(scene, 10, 100, 20, -230, 50, -185, 1);
    var porte2 = new Wall(scene, 20, 100, 10, -80, 50, -150, 2); // 1
    var porte3 = new Wall(scene, 20, 100, 10, 0, 50, -150, 3); // 1
    var porte4 = new Wall(scene, 20, 100, 10, 80, 50, -150, 4); // 1
    var porte5 = new Wall(scene, 20, 100, 10, -80, 50, 200, 5); // 2
    var porte6 = new Wall(scene, 20, 100, 10, 0, 50, 200, 6); // 2 // porte de sortie
    var porte7 = new Wall(scene, 20, 100, 10, 80, 50, 200, 7); // 2
    var porte9 = new Wall(scene, 20, 100, 10, -315, 50, -150, 9); // 3
    var porte10 = new Wall(scene, 10, 100, 20, -350, 50, 35, 10); // 3
    var porte12 = new Wall(scene, 20, 100, 10, -290, 50, 200, 12); // 3
    var porte8 = new Wall(scene, 20, 100, 10, 310, 50, -150, 8); // 4
    var porte11 = new Wall(scene, 10, 100, 20, 350, 50, 35, 11); // 4
    var porte13 = new Wall(scene, 20, 100, 10, 290, 50, 200, 13); // 4
    // panneau sortie
    const Options = { width: 15, height: 7, depth: 3 };
    const panneau = BABYLON.MeshBuilder.CreateBox("panneau", Options, scene);
    panneau.position = new BABYLON.Vector3(0, 30, 493);
    const panneauMaterial = new BABYLON.StandardMaterial("panneauM", scene);
    panneauMaterial.diffuseTexture = new BABYLON.Texture("images/panneau.PNG");
    panneau.material = panneauMaterial;
    const Options2 = { width: 15, height: 7, depth: 3 };
    const panneau2 = BABYLON.MeshBuilder.CreateBox("panneau", Options2, scene);
    panneau2.position = new BABYLON.Vector3(20, 35, 193);
    const panneauMaterial2 = new BABYLON.StandardMaterial("panneauM2", scene);
    panneauMaterial2.diffuseTexture = new BABYLON.Texture("images/panneau.PNG");
    panneau2.material = panneauMaterial2;
}

// boutons pour ouvrir les portes
function createButton(scene, mainSoul) {
    var buttonSol1 = new ButtonSol(10, 2, 10, 1); // (witdh, height, depth, n) 
    buttonSol1.Creation(scene, false, -75, 0, -420); // (scene, alea, x, y, z)
    let wall1 = scene.getMeshByName("mur1");
    buttonSol1.buttonClik(scene, wall1, mainSoul, 1); // (scene, mur concerné, mainSoul, numéro du mur)
    // premiere piece
    var buttonSol2 = new ButtonSol(10, 2, 10, 2); buttonSol2.Creation(scene, false, -95, 0, -165);
    let wall2 = scene.getMeshByName("mur2"); buttonSol2.buttonClik(scene, wall2, mainSoul, 2);
    var buttonSol3 = new ButtonSol(10, 2, 10, 3); buttonSol3.Creation(scene, false, 15, 0, -165);
    let wall3 = scene.getMeshByName("mur3"); buttonSol3.buttonClik(scene, wall3, mainSoul, 3);
    var buttonSol4 = new ButtonSol(10, 2, 10, 4); buttonSol4.Creation(scene, false, 95, 0, -165);
    let wall4 = scene.getMeshByName("mur4"); buttonSol4.buttonClik(scene, wall4, mainSoul, 4);
    // deuxieme piece
    var buttonSol5 = new ButtonSol(10, 2, 10, 5); buttonSol5.Creation(scene, false, -105, 0, 160);
    let wall5 = scene.getMeshByName("mur5"); buttonSol5.buttonClik(scene, wall5, mainSoul, 5);
    var buttonSol7 = new ButtonSol(10, 2, 10, 7); buttonSol7.Creation(scene, false, 105, 0, 160);
    let wall7 = scene.getMeshByName("mur7"); buttonSol7.buttonClik(scene, wall7, mainSoul, 7);
    // troisieme piece
    var buttonSol9 = new ButtonSol(10, 2, 10, 9); buttonSol9.Creation(scene, false, -330, 0, -125);
    let wall9 = scene.getMeshByName("mur9"); buttonSol9.buttonClik(scene, wall9, mainSoul, 9);
    var buttonSol10 = new ButtonSol(10, 2, 10, 10); buttonSol10.Creation(scene, false, -335, 0, 15);
    let wall10 = scene.getMeshByName("mur10"); buttonSol10.buttonClik(scene, wall10, mainSoul, 10);
    var buttonSol12 = new ButtonSol(10, 2, 10, 12); buttonSol12.Creation(scene, false, -275, 0, 215);
    let wall12 = scene.getMeshByName("mur12"); buttonSol12.buttonClik(scene, wall12, mainSoul, 12);
    // quatrieme piece
    var buttonSol8 = new ButtonSol(10, 2, 10, 8); buttonSol8.Creation(scene, false, 325, 0, -125);
    let wall8 = scene.getMeshByName("mur8"); buttonSol8.buttonClik(scene, wall8, mainSoul, 8);
    var buttonSol11 = new ButtonSol(10, 2, 10, 11); buttonSol11.Creation(scene, false, 335, 0, 15);
    let wall11 = scene.getMeshByName("mur11"); buttonSol11.buttonClik(scene, wall11, mainSoul, 11);
    var buttonSol18 = new ButtonSol(10, 2, 10, 18); buttonSol18.Creation(scene, false, 480, 0, -135);
    let wall18 = scene.getMeshByName("mur11"); buttonSol18.buttonClik(scene, wall18, mainSoul, 18);
    var buttonSol13 = new ButtonSol(10, 2, 10, 13); buttonSol13.Creation(scene, false, 275, 0, 175);
    let wall13 = scene.getMeshByName("mur13"); buttonSol13.buttonClik(scene, wall13, mainSoul, 13);
    // pour ouvrir la derniere pièce
    var buttonWall1 = new ButtonSol(10, 3, 10, 6); buttonWall1.Creation(scene, false, 20, 20, 197); // 2
    buttonWall1.buttonClik(scene, null, mainSoul, 6);
    var buttonWall2 = new ButtonSol(10, 3, 10, 14); buttonWall2.Creation(scene, false, -480, 20, 497); // 5
    buttonWall2.buttonClik(scene, null, mainSoul, 14);
    var buttonWall3 = new ButtonSol(10, 3, 10, 15); buttonWall3.Creation(scene, false, -105, 10, 497);
    buttonWall3.buttonClik(scene, null, mainSoul, 15);
    var buttonWall4 = new ButtonSol(10, 3, 10, 16); buttonWall4.Creation(scene, false, 480, 10, 497); // 6
    buttonWall4.buttonClik(scene, null, mainSoul, 16);
    var buttonWall5 = new ButtonSol(10, 3, 10, 17); buttonWall5.Creation(scene, false, 60, 20, -497);
    buttonWall5.buttonClik(scene, null, mainSoul, 17);
    var buttonWall6 = new ButtonSol(10, 3, 10, 19); buttonWall6.Creation(scene, false, 0, 20, -497); // 1
    buttonWall6.buttonClik(scene, null, mainSoul, 19);
}

function createBox(scene) { // (witdh, height, depth, n)  
    // position définie  (scene, alea, x, y, z)
    new Box(10, 10, 10, 1).Creation(scene, 50, 5, 70); // 2
    new Box(10, 10, 10, 2).Creation(scene, 78, 5, 70); // 2
    new Box(10, 10, 10, 3).Creation(scene, 90, 5, 70); // 2
    new Box(10, 10, 10, 4).Creation(scene, 82, 15, 70); // 2
    new Box(10, 10, 10, 5).Creation(scene, 450, 5, -125);
    new Box(10, 10, 10, 6).Creation(scene, 478, 5, -125);
    new Box(10, 10, 10, 7).Creation(scene, 490, 5, -125);
    new Box(10, 10, 10, 8).Creation(scene, 482, 15, -125);
    new Box(10, 10, 10, 9).Creation(scene, -278, 5, 227); // 5  
    new Box(10, 10, 10, 10).Creation(scene, 50, 5, -485);
    new Box(10, 10, 10, 11).Creation(scene, 70, 5, -478); //60, 10, -497
    new Box(10, 10, 10, 12).Creation(scene, 70, 5, -490);
    new Box(10, 10, 10, 13).Creation(scene, 70, 15, -482);

    // position aléatoire  (scene, Xmin, Xmax, Zmin, Zmax)
    for (var i = 14; i < 20; i++) { // 5
        new Box(10, 10, 10, i).CreationAlea(scene, -490, -205, 220, 490);
    }
    for (var i = 20; i < 30; i++) { // 6
        new Box(10, 10, 10, i).CreationAlea(scene, 80, 490, 220, 490);
    }
    for (var i = 30; i < 35; i++) {
        new Box(10, 10, 10, i).CreationAlea(scene, -180, -80, 220, 490);
    }
    for (var i = 35; i < 38; i++) {
        new Box(10, 10, 10, i).CreationAlea(scene, 250, 490, -490, -200);
    }
}

function createLights(scene) {
    // i.e sun light with all light rays parallels, the vector is the direction.
    let light0 = new BABYLON.DirectionalLight("dir0", new BABYLON.Vector3(-1, -1, 0), scene); // sol
    light0.intensity = 0.2;
    let light1 = new BABYLON.DirectionalLight("dir1", new BABYLON.Vector3(-1, 1, 0), scene); // mur à gauche
    light1.intensity = 0.15;
    // let light2 = new BABYLON.DirectionalLight("dir2", new BABYLON.Vector3(0, 1, 0), scene); // plafond
    // light2.intensity = 0.05;
    let light3 = new BABYLON.HemisphericLight("dir3", new BABYLON.Vector3(0, 1, 1), scene); // mur en face
    light3.intensity = 0.3;
    // let light4 = new BABYLON.DirectionalLight("dir3", new BABYLON.Vector3(0, 0.5, -1), scene); // mur derriere
    // light4.intensity = 0.3;
    let light5 = new BABYLON.HemisphericLight("dir5", new BABYLON.Vector3(1, 1, 0), scene); // mur de droite
    light5.intensity = 0.3;
}

function createFollowCamera(scene, target) {
    let camera = new BABYLON.FollowCamera("mainSoulFollowCamera", target.position, scene, target);
    camera.radius = 60; // how far from the object to follow
    camera.heightOffset = 12; // how high above the object to place the camera
    camera.rotationOffset = 180; // the viewing angle
    camera.cameraAcceleration = .1; // how fast to move
    camera.maxCameraSpeed = 5; // speed limit
    return camera;
}

let zMovement = 5;

function createMainSoul(scene) {
    let mainSoul = new BABYLON.MeshBuilder.CreateSphere("mainSoul", { diameter: 10, segments: 40 }, scene);
    let mainSoulMaterial = new BABYLON.StandardMaterial("mainSoulMaterial", scene);
    mainSoulMaterial.diffuseTexture = new BABYLON.Texture("images/drap.webp", scene);
    mainSoulMaterial.diffuseColor = new BABYLON.Color3.White;
    mainSoulMaterial.emissiveColor = new BABYLON.Color3(93/255, 169/255, 171/255);
    mainSoulMaterial.diffuseTexture.uScale *= 2;
    mainSoulMaterial.alpha = 0.3;
	mainSoulMaterial.backFaceCulling = false;
    mainSoulMaterial.needDepthPrePass = true;
    mainSoul.material = mainSoulMaterial;
    // By default the box/mainSoul is in 0, 0, 0, let's change that...
    mainSoul.position.x = 0;
    mainSoul.position.y = 5;
    mainSoul.position.z = -430;
    mainSoul.speed = 1;
    mainSoul.frontVector = new BABYLON.Vector3(0, 0, 1)
    mainSoul.move = () => {
        // if we want to move while taking into account collision detections, collision uses by default "ellipsoids"
        let yMovement = 0;
        if (mainSoul.position.y > 2) { zMovement = 0; yMovement = -2; }
        if (scene.inputStates.up)  mainSoul.moveWithCollisions(mainSoul.frontVector.multiplyByFloats(mainSoul.speed, mainSoul.speed, mainSoul.speed));
        if (scene.inputStates.down)  mainSoul.moveWithCollisions(mainSoul.frontVector.multiplyByFloats(-mainSoul.speed, -mainSoul.speed, -mainSoul.speed));
        if (scene.inputStates.left) {
            mainSoul.rotation.y -= 0.02;
            mainSoul.frontVector = new BABYLON.Vector3(Math.sin(mainSoul.rotation.y), 0, Math.cos(mainSoul.rotation.y));
        }
        if (scene.inputStates.right) {
            mainSoul.rotation.y += 0.02;
            mainSoul.frontVector = new BABYLON.Vector3(Math.sin(mainSoul.rotation.y), 0, Math.cos(mainSoul.rotation.y));
        }
        // le mainSoul va plus vite si on appuie sur la touche espace
        if (scene.inputStates.space) mainSoul.speed = 4;
        if (scene.inputStates.space === false) mainSoul.speed = 1;
        // le mainSoul va s'envoler
        if (scene.inputStates.monter) mainSoul.position.y += 0.3;
        // le mainSoul va redescendre
        if (scene.inputStates.descendre) mainSoul.position.y -= 0.3;
        // tire des lasers
        if (scene.inputStates.laser) mainSoul.fireLasers();
    }
    mainSoul.checkCollisions = true;

    // to avoid firing too many cannonball rapidly
    mainSoul.canFireLasers = true;
    mainSoul.fireLasersAfter = 0.3; // in seconds
    mainSoul.fireLasers = function () {
        console.log("coucou je tire");
        if (!this.canFireLasers) return;
        // ok, we fire, let's put the above property to false
        this.canFireLasers = false;
        // let's be able to fire again after a while
        setTimeout(() => {
            this.canFireLasers = true;
        }, 1000 * this.fireLasersAfter);
        // create a ray
        let origin = this.position; // position of the mainSoul
        // Looks a little up (0.1 in y)
        let direction = new BABYLON.Vector3(this.frontVector.x, this.frontVector.y, this.frontVector.z);
        let length = 1000;
        let ray = new BABYLON.Ray(origin, direction, length);
        // to make the ray visible :
        let rayHelper = new BABYLON.RayHelper(ray);
        rayHelper.show(scene, new BABYLON.Color3.Red());
        // to make ray disappear after 200ms
        setTimeout(() => {
            rayHelper.hide(ray);
        }, 200);
        // See also multiPickWithRay if you want to kill "through" multiple objects
        // this would return an array of boundingBoxes.... instead of one.
        let pickInfo = scene.pickWithRay(ray, (mesh) => {
            return mesh.name.startsWith("bounder");
        });
        if (pickInfo.pickedMesh) {
            // the mesh is a bounding box of a dude
            console.log(pickInfo.pickedMesh.name);
            let bounder = pickInfo.pickedMesh;
            let dude = bounder.dudeMesh.Dude;
            // let's decrease the dude health, pass him the hit point
            dude.decreaseHealth();
        }
    };

    return mainSoul;
}

function createHeroDude(scene) {
    // load the Dude 3D animated model
    // name, folder, skeleton name 
    let meshTask = scene.assetsManager.addMeshTask("Dude task", "him", "models/Dude/", "Dude.babylon");
    meshTask.onSuccess = function (task) {
        onDudeImported(task.loadedMeshes, task.loadedSkeletons);
    };
    function onDudeImported(newMeshes, skeletons) {
        let heroDude = newMeshes[0];
        heroDude.position = new BABYLON.Vector3(0, 0, 5);  // The original dude
        // make it smaller 
        heroDude.scaling = new BABYLON.Vector3(0.22, 0.22, 0.22);
        heroDude.speed = 0.2;
        // give it a name so that we can query the scene to get it by name
        heroDude.name = "heroDude";
        // there might be more than one skeleton in an imported animated model. Try console.log(skeletons.length)
        // here we've got only 1. 
        // animation parameters are skeleton, starting frame, ending frame,  a boolean that indicate if we're gonna 
        // loop the animation, speed, 
        heroDude.animation = scene.beginAnimation(skeletons[0], 0, 120, true, 1);
        let hero = new Dude(heroDude, -1, 0.3, scene);
        hero.ellipsoid = new BABYLON.Vector3(10, 1, 10);
        // make clones
        scene.dudes = [];
        for (let i = 0; i < 12; i++) {
            etat[i] = 0;
            scene.dudes[i] = doClone(heroDude, skeletons, i);
            scene.beginAnimation(scene.dudes[i].skeleton, 0, 120, true, 1);
            // Create instance with move method etc.
            var temp = new Dude(scene.dudes[i], i, 0.3, scene);
            // remember that the instances are attached to the meshes
            // and the meshes have a property "Dude" that IS the instance
            // see render loop then....
            // scene.dudes[i].checkCollisions = true;
            scene.dudes[i].ellipsoid = new BABYLON.Vector3(10, 1, 10);
        }
        scene.dudes.unshift(heroDude);
    }
}

function doClone(originalMesh, skeletons, id) {
    let myClone;
    let xrand, zrand;
    if (id < 3) { // 5 
        xrand = Math.floor(Math.random() * (-205 - -490) + -490);
        zrand = Math.floor(Math.random() * (490 - 220) + 220);
    }
    if (id >= 3 && id < 6) { // 6 
        xrand = Math.floor(Math.random() * (490 - 80) + 80);
        zrand = Math.floor(Math.random() * (490 - 220) + 220);
    }
    if (id >= 6 && id < 9) {
        xrand = Math.floor(Math.random() * (490 - 250) + 250);
        zrand = Math.floor(Math.random() * (-200 - -490) + -490);
    }
    if (id >= 9) {
        xrand = Math.floor(Math.random() * (-250 - -490) + -490);
        zrand = Math.floor(Math.random() * (-200 - -490) + -490);
    }
    myClone = originalMesh.clone("clone_" + id);
    myClone.position = new BABYLON.Vector3(xrand, 0, zrand);
    if (!skeletons) return myClone;
    // The mesh has at least one skeleton
    if (!originalMesh.getChildren()) {
        myClone.skeleton = skeletons[0].clone("clone_" + id + "_skeleton");
        return myClone;
    } else {
        if (skeletons.length === 1) {
            // the skeleton controls/animates all children, like in the Dude model
            let clonedSkeleton = skeletons[0].clone("clone_" + id + "_skeleton");
            myClone.skeleton = clonedSkeleton;
            let nbChildren = myClone.getChildren().length;
            for (let i = 0; i < nbChildren; i++) {
                myClone.getChildren()[i].skeleton = clonedSkeleton
            }
            return myClone;
        } else if (skeletons.length === originalMesh.getChildren().length) {
            // each child has its own skeleton
            for (let i = 0; i < myClone.getChildren().length; i++) {
                myClone.getChildren()[i].skeleton = skeletons[i].clone("clone_" + id + "_skeleton_" + i);
            }
            return myClone;
        }
    }
    return myClone;
}

window.addEventListener("resize", () => {
    engine.resize()
});

function modifySettings() {
    // key listeners for the mainSoul
    scene.inputStates = {};
    scene.inputStates.left = false;
    scene.inputStates.right = false;
    scene.inputStates.up = false;
    scene.inputStates.down = false;
    scene.inputStates.space = false;
    scene.inputStates.monter = false;
    scene.inputStates.descendre = false;
    scene.inputStates.laser = false;
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
        } else if (event.key === "l") {
            scene.inputStates.laser = true;
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
        } else if (event.key === "l") {
            scene.inputStates.laser = false;
        }
    }, false);
}

