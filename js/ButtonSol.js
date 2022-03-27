export default class ButtonSol {
    constructor(witdh, height, depth, n) {
        this.Options = { width: witdh, height: height, depth: depth };
        this.n = n;
    }

    Creation(scene, alea, x, y, z) {
        const button = BABYLON.MeshBuilder.CreateBox("buttonSol" + this.n, this.Options, this.scene);
        if (alea === true) {
            // position aléatoire
            let x = Math.floor(Math.random() * (500 - (-500) + 1)) + (-500);
            let z = Math.floor(Math.random() * (500 - (-500) + 1)) + (-500);
            button.position = new BABYLON.Vector3(x, 5, z);
        }
        else {
            // position définie
            button.position = new BABYLON.Vector3(x, y, z);
        }
        // texture
        const buttonMaterial = new BABYLON.StandardMaterial("buttonSolM" + this.n, scene);
        buttonMaterial.diffuseColor = new BABYLON.Color3(1, 1, 1);
        button.material = buttonMaterial;
        // boxMaterial.wireframe = true;
        button.checkCollisions = true;
    }

    buttonClik(scene, wall, tank, n) {
        let button = scene.getMeshByName("buttonSol" + this.n);
        button.actionManager = new BABYLON.ActionManager(scene);

        // si collision avec le personnage le mur se soulève
        button.actionManager.registerAction(new BABYLON.ExecuteCodeAction({ trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger, parameter: { mesh: tank } }, function () {
            wall.position.y += 30;
            if (wall.position.y > 80) { wall.position.y = 80; }
        }));
        button.actionManager.registerAction(new BABYLON.ExecuteCodeAction({ trigger: BABYLON.ActionManager.OnIntersectionExitTrigger, parameter: { mesh: tank } }, function () {
            if (tank.position.y > 5) { tank.position.y = 5; }
            if (n === 5 || n === 7) { wall.position.y -= 30; } // ces boutons doivent rester enfoncé pour garder la porte ouverte
            if (n === 9 || n === 10 || n === 11) { // ces boutons fermeront la porte automatiquement apres 200ms
                setTimeout(() => {
                    wall.position.y -= 30;
                    if (wall.position.y < 50) { wall.position.y = 50; }
                }, 5000);
            }
        }));

        // si collision avec une box le mur se soulève
        for (var i = 1; i < 38; i++) {
            button.actionManager.registerAction(new BABYLON.ExecuteCodeAction({ trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger, parameter: { mesh: scene.getMeshByName("box" + i) } }, function () {
                wall.position.y += 30;
                if (wall.position.y > 80) { wall.position.y = 80; }
            }));
            button.actionManager.registerAction(new BABYLON.ExecuteCodeAction({ trigger: BABYLON.ActionManager.OnIntersectionExitTrigger, parameter: { mesh: scene.getMeshByName("box" + i) } }, function () {
                wall.position.y -= 30;
                if (wall.position.y < 50) { wall.position.y = 50; }
            }));
        }

        // click avec la souris pour ouvrir la derniere porte vers la sortie
        // source : https://playground.babylonjs.com/#J19GYK#0
        // quand on passe la souris sur un bouton, il devient blanc pour signifier qu'il est clickable
        var makeOverOut = function (mesh) {
            mesh.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOutTrigger, mesh.material, "emissiveColor", mesh.material.emissiveColor));
            mesh.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOverTrigger, mesh.material, "emissiveColor", BABYLON.Color3.White()));
            mesh.actionManager.registerAction(new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPointerOutTrigger, mesh, "scaling", new BABYLON.Vector3(1, 1, 1), 150));
            mesh.actionManager.registerAction(new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPointerOverTrigger, mesh, "scaling", new BABYLON.Vector3(1.1, 1.1, 1.1), 150));
        }
        var a, b, c, d, e, f = null;
        if (n === 6) {
            makeOverOut(button);
            button.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, function () {
                if (a === 1) { }
                else {
                    let wall = scene.getMeshByName("mur6");
                    wall.position.y += 3;
                    if (wall.position.y >= 60) {
                        wall.position.y = 80;
                    }
                    a = 1;
                }

            }));
        }
        if (n === 14) {
            makeOverOut(button);
            button.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, function () {
                if (b === 1) { }
                else {
                    let wall = scene.getMeshByName("mur6");
                    wall.position.y += 1;
                    if (wall.position.y >= 60) {
                        wall.position.y = 80;
                    }
                    b = 1;
                }
            }));
        }
        if (n === 15) {
            makeOverOut(button);
            button.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, function () {
                if (c === 1) { }
                else {
                    let wall = scene.getMeshByName("mur6");
                    wall.position.y += 1;
                    if (wall.position.y >= 60) {
                        wall.position.y = 80;
                    }
                    c = 1;
                }
            }));
        }
        if (n === 16) {
            makeOverOut(button);
            button.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, function () {
                if (d === 1) { }
                else {
                    let wall = scene.getMeshByName("mur6");
                    wall.position.y += 2;
                    if (wall.position.y >= 60) {
                        wall.position.y = 80;
                    }
                    d = 1;
                }
            }));
        }
        if (n === 17) {
            makeOverOut(button);
            button.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, function () {
                if (e === 1) { }
                else {
                    let wall = scene.getMeshByName("mur6");
                    wall.position.y += 2;
                    if (wall.position.y >= 60) {
                        wall.position.y = 80;
                    }
                    e = 1;
                }
            }));
        }
        if (n === 19) {
            makeOverOut(button);
            button.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, function () {
                if (f === 1) { }
                else {
                    let wall = scene.getMeshByName("mur6");
                    wall.position.y += 1;
                    if (wall.position.y >= 60) {
                        wall.position.y = 80;
                    }
                    f = 1;
                }
            }));
        }
    }
}
