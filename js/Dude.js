export default class Dude {
    constructor(dudeMesh, id, speed, scene) {
        this.dudeMesh = dudeMesh;
        this.id = id;
        this.scene = scene;
        this.scaling = 0.25;
        this.health = 3; // three shots to kill the dude !
        if (speed)
            this.speed = speed;
        else
            this.speed = 0.3;
        // in case, attach the instance to the mesh itself, in case we need to retrieve
        // it after a scene.getMeshByName that would return the Mesh
        // SEE IN RENDER LOOP !
        dudeMesh.Dude = this;

        if (Dude.boundingBoxParameters == undefined) {
            Dude.boundingBoxParameters = this.calculateBoundingBoxParameters();
        }
        this.bounder = this.createBoundingBox();
        this.bounder.dudeMesh = this.dudeMesh;
    }

    move(scene) {
        // as move can be called even before the bbox is ready.
        if (!this.bounder) return;
        // let's put the dude at the BBox position. in the rest of this
        // method, we will not move the dude but the BBox instead
        this.dudeMesh.position = new BABYLON.Vector3(this.bounder.position.x, this.bounder.position.y, this.bounder.position.z);
        // follow the tank
        let tank = scene.getMeshByName("heroTank");
        // let's compute the direction vector that goes from Dude to the tank
        let direction = tank.position.subtract(this.dudeMesh.position);
        let distance = direction.length(); // we take the vector that is not normalized, not the dir vector
        //console.log(distance);
        let dir = direction.normalize();
        // angle between Dude and tank, to set the new rotation.y of the Dude so that he will look towards the tank
        // make a drawing in the X/Z plan to uderstand....
        let alpha = Math.atan2(-dir.x, -dir.z);
        this.dudeMesh.rotation.y = alpha;
        if (this.dudeMesh.position.y > 1) { this.dudeMesh.position.y = 1; }
        // // let make the Dude move towards the tank
        if (distance > 15 && distance < 180) {
            //a.restart();   
            this.bounder.moveWithCollisions(dir.multiplyByFloats(this.speed, this.speed, this.speed));
        }
    };

    // fait faire un tour de terrain, il se déplace en ronde en forme de carré
    bougerAleatoirement(x, z, scene, tank, cpt) {
        if (!this.bounder) return;
        this.dudeMesh.position = new BABYLON.Vector3(this.bounder.position.x, this.bounder.position.y, this.bounder.position.z);
        var verif;
        let direction = tank.position.subtract(this.dudeMesh.position);
        let distance = direction.length();
        if (distance < 200) {
            this.move(scene);
            verif = 1;
        }
        else { verif = 0; }

        if (verif === 0) {
            if (cpt === 5000) {
                this.bounder.position.x = this.dudeMesh.position.x;
                this.bounder.position.y = this.dudeMesh.position.y;
                this.bounder.position.z = this.dudeMesh.position.z;
                let position = new BABYLON.Vector3(x, 1, z);
                let direction = position.subtract(this.dudeMesh.position);
                let distance = direction.length();
                let dir = direction.normalize();
                let alpha = Math.atan2(-dir.x, -dir.z);
                this.dudeMesh.rotation.y = alpha;
                if (distance > 5) {
                    this.bounder.moveWithCollisions(dir.multiplyByFloats(this.speed, this.speed, this.speed));
                }
            }
        }
    }

    // fait faire des aller retour
    faireAllerRetour(ronde, scene, tank) {
        if (!this.bounder) return;
        this.dudeMesh.position = new BABYLON.Vector3(this.bounder.position.x, this.bounder.position.y, this.bounder.position.z);
        var verif;
        let direction = tank.position.subtract(this.dudeMesh.position);
        let distance = direction.length();
        if (distance < 100) {
            this.move(scene);
            verif = 1;
        }
        else { verif = 0; }

        if (ronde === 0 && verif === 0) {
            let position = new BABYLON.Vector3(300, 1, -300);
            let direction = position.subtract(this.dudeMesh.position);
            let distance = direction.length();
            let dir = direction.normalize();
            let alpha = Math.atan2(-dir.x, -dir.z);
            this.dudeMesh.rotation.y = alpha;
            if (distance > 5) {
                this.bounder.moveWithCollisions(dir.multiplyByFloats(this.speed, this.speed, this.speed));
                return 0;
            }
            else {
                return 1;
            }
        }
        if (ronde === 1 && verif === 0) {
            let position = new BABYLON.Vector3(300, 1, 300);
            let direction = position.subtract(this.dudeMesh.position);
            let distance = direction.length();
            let dir = direction.normalize();
            let alpha = Math.atan2(-dir.x, -dir.z);
            this.dudeMesh.rotation.y = alpha;
            if (distance > 5) {
                this.bounder.moveWithCollisions(dir.multiplyByFloats(this.speed, this.speed, this.speed));
                return 1;
            }
            else {
                return 0;
            }
        }
    }

    // fait faire un tour de terrain, il se déplace en ronde en forme de carré
    faireUneRonde(ronde, scene, tank) {
        if (!this.bounder) return;
        this.dudeMesh.position = new BABYLON.Vector3(this.bounder.position.x, this.bounder.position.y, this.bounder.position.z);
        var verif;
        let direction = tank.position.subtract(this.dudeMesh.position);
        let distance = direction.length();
        if (distance < 100) {
            this.move(scene);
            verif = 1;
        }
        else { verif = 0; }

        if (ronde === 0 && verif === 0) {
            let position = new BABYLON.Vector3(200, 1, -200);
            let direction = position.subtract(this.dudeMesh.position);
            let distance = direction.length();
            let dir = direction.normalize();
            let alpha = Math.atan2(-dir.x, -dir.z);
            this.dudeMesh.rotation.y = alpha;
            if (distance > 5) {
                this.bounder.moveWithCollisions(dir.multiplyByFloats(this.speed, this.speed, this.speed));
                return 0;
            }
            else {
                return 1;
            }
        }
        if (ronde === 1 && verif === 0) {
            let position = new BABYLON.Vector3(200, 1, 200);
            let direction = position.subtract(this.dudeMesh.position);
            let distance = direction.length();
            let dir = direction.normalize();
            let alpha = Math.atan2(-dir.x, -dir.z);
            this.dudeMesh.rotation.y = alpha;
            if (distance > 5) {
                this.bounder.moveWithCollisions(dir.multiplyByFloats(this.speed, this.speed, this.speed));
                return 1;
            }
            else {
                return 2;
            }
        }
        if (ronde === 2 && verif === 0) {
            let position = new BABYLON.Vector3(-200, 1, 200);
            let direction = position.subtract(this.dudeMesh.position);
            let distance = direction.length();
            let dir = direction.normalize();
            let alpha = Math.atan2(-dir.x, -dir.z);
            this.dudeMesh.rotation.y = alpha;
            if (distance > 5) {
                this.bounder.moveWithCollisions(dir.multiplyByFloats(this.speed, this.speed, this.speed));
                return 2;
            }
            else {
                return 3;
            }
        }
        if (ronde === 3 && verif === 0) {
            let position = new BABYLON.Vector3(-200, 1, -200);
            let direction = position.subtract(this.dudeMesh.position);
            let distance = direction.length();
            let dir = direction.normalize();
            let alpha = Math.atan2(-dir.x, -dir.z);
            this.dudeMesh.rotation.y = alpha;
            if (distance > 5) {
                this.bounder.moveWithCollisions(dir.multiplyByFloats(this.speed, this.speed, this.speed));
                return 3;
            }
            else {
                return 0;
            }
        }
    }

    getBoundingBoxHeightScaled() {
        let bbInfo = Dude.boundingBoxParameters;
        let max = bbInfo.boundingBox.maximum;
        let min = bbInfo.boundingBox.minimum;
        let lengthY = (max._y - min._y) * this.scaling;
        return lengthY;
    }

    decreaseHealth() {
        this.health--;
        if (this.health <= 0) {
            this.gotKilled();
        }
    }

    gotKilled() {
        BABYLON.ParticleHelper.CreateAsync("explosion", this.scene).then((set) => {
            set.systems.forEach((s) => {
                s.emitter = this.bounder.position; // bug in ParticleHelper : y pos taken into account only by parts of the particles systems. ?
                s.disposeOnStop = true;
            });
            set.start();
        });
        this.dudeMesh.dispose();
        this.bounder.dispose();
    }

    calculateBoundingBoxParameters() {
        // Compute BoundingBoxInfo for the Dude, for this we visit all children meshes
        let childrenMeshes = this.dudeMesh.getChildren();
        let bbInfo = this.totalBoundingInfo(childrenMeshes);
        return bbInfo;
    }

    totalBoundingInfo(meshes) {
        var boundingInfo = meshes[0].getBoundingInfo();
        var min = boundingInfo.minimum.add(meshes[0].position);
        var max = boundingInfo.maximum.add(meshes[0].position);
        for (var i = 1; i < meshes.length; i++) {
            boundingInfo = meshes[i].getBoundingInfo();
            min = BABYLON.Vector3.Minimize(min, boundingInfo.minimum.add(meshes[i].position));
            max = BABYLON.Vector3.Maximize(max, boundingInfo.maximum.add(meshes[i].position));
        }
        return new BABYLON.BoundingInfo(min, max);
    }

    createBoundingBox() {
        // Create a box as BoundingBox of the Dude
        let bounder = new BABYLON.Mesh.CreateBox("bounder" + (this.id).toString(), 1, this.scene);
        let bounderMaterial = new BABYLON.StandardMaterial("bounderMaterial", this.scene);
        bounderMaterial.alpha = .4;
        bounder.material = bounderMaterial;
        bounder.checkCollisions = true;
        bounder.position = this.dudeMesh.position.clone();
        let bbInfo = Dude.boundingBoxParameters;
        let max = bbInfo.boundingBox.maximum;
        let min = bbInfo.boundingBox.minimum;
        // Not perfect, but kinda of works...
        // Looks like collisions are computed on a box that has half the size... ?
        bounder.scaling.x = (max._x - min._x) * this.scaling;
        bounder.scaling.y = (max._y - min._y) * this.scaling * 2;
        bounder.scaling.z = (max._z - min._z) * this.scaling * 3;
        bounder.isVisible = false;
        return bounder;
    }

    getBoundingBox() {
        return this.bounder;
    }
}
