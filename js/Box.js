export default class Box {
    constructor(witdh, height, depth, n) {
        this.Options = { width: witdh, height: height, depth: depth };
        this.n = n;
        this.x = null;
        this.y = null;
        this.z = null;
    }

    Creation(scene, x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        const box = BABYLON.MeshBuilder.CreateBox("box" + this.n, this.Options, this.scene);
        // position définie
        box.position = new BABYLON.Vector3(x, y, z);
        // texture
        const boxMaterial = new BABYLON.StandardMaterial("boxM" + this.n, scene);
        boxMaterial.diffuseTexture = new BABYLON.Texture("images/boite.jpg");
        box.material = boxMaterial;
        // boxMaterial.wireframe = true;
        box.checkCollisions = true;

        var utilLayer;
        var gizmo;
        window.addEventListener('keydown', (event) => {
            if ((event.key === "t") || (event.key === "T")) { // afficher les fleches pour déplacer les box
                // déplacer les box 
                // source : https://playground.babylonjs.com/#31M2AP#6 
                // Create utility layer the gizmo will be rendered on
                utilLayer = new BABYLON.UtilityLayerRenderer(scene);
                // Create the gizmo and attach to the box
                gizmo = new BABYLON.PositionGizmo(utilLayer);
                gizmo.attachedMesh = box;
                // Keep the gizmo fixed to world rotation
                gizmo.updateGizmoRotationToMatchAttachedMesh = false;
                gizmo.updateGizmoPositionToMatchAttachedMesh = true;
            }
            if ((event.key === "y")) { // cacher les fleches pour déplacer les box
                gizmo.attachedMesh = !gizmo.attachedMesh ? box : null
            }
        }, false);

        box.physicsImpostor = new BABYLON.PhysicsImpostor(box, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 1, restitution: 0.2 }, scene);
    }

    CreationAlea(scene, Xmin, Xmax, Zmin, Zmax) {
        const box = BABYLON.MeshBuilder.CreateBox("box" + this.n, this.Options, this.scene);
        // position aléatoire
        let x = Math.floor(Math.random() * (Xmax - Xmin) + Xmin);
        let z = Math.floor(Math.random() * (Zmax - Zmin) + Zmin);
        box.position = new BABYLON.Vector3(x, 5, z);
        // texture
        const boxMaterial = new BABYLON.StandardMaterial("boxM" + this.n, scene);
        boxMaterial.diffuseTexture = new BABYLON.Texture("images/boite.jpg");
        box.material = boxMaterial;
        // boxMaterial.wireframe = true;
        box.checkCollisions = true;

        var utilLayer;
        var gizmo;
        window.addEventListener('keydown', (event) => {
            if ((event.key === "t") || (event.key === "T")) { // afficher les fleches pour déplacer les box
                // déplacer les box 
                // source : https://playground.babylonjs.com/#31M2AP#6 
                // Create utility layer the gizmo will be rendered on
                utilLayer = new BABYLON.UtilityLayerRenderer(scene);
                // Create the gizmo and attach to the box
                gizmo = new BABYLON.PositionGizmo(utilLayer);
                gizmo.attachedMesh = box;
                // Keep the gizmo fixed to world rotation
                gizmo.updateGizmoRotationToMatchAttachedMesh = false;
                gizmo.updateGizmoPositionToMatchAttachedMesh = true;
            }
            if ((event.key === "y")) { // cacher les fleches pour déplacer les box
                gizmo.attachedMesh = !gizmo.attachedMesh ? box : null
            }
        }, false);

        box.physicsImpostor = new BABYLON.PhysicsImpostor(box, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 1, restitution: 0.2 }, scene);
    }
}

