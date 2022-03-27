export default class Wall {
    constructor(scene, witdh, height, depth, x, y, z, n) {
        const Options = { width: witdh, height: height, depth: depth };
        const wall = BABYLON.MeshBuilder.CreateBox("mur" + n, Options, scene);
        wall.position = new BABYLON.Vector3(x, y, z);
        const wallMaterial = new BABYLON.StandardMaterial("wallM" + n, scene);
        wallMaterial.diffuseTexture = new BABYLON.Texture("images/motif.jpg");
        wall.material = wallMaterial;
        wall.checkCollisions = true;
    }
}
