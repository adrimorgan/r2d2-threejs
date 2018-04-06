import * as THREE from 'three';

export default class Ground extends THREE.Object3D {

    constructor(width, material, boxSize){
        super();
        this.width = width;
        this.material = material;
        this.boxSize = boxSize;

        // creación del plano
        this.ground = new THREE.Mesh(
            new THREE.BoxGeometry(
                width = this.width,
                height = 0.2,
                depth = this.width,
                widthSegments = 1
            ), 
            this.material
        );

        // posicionamiento sobre el plano X
        this.ground.applyMatrix(
            new THREE.Matrix4().makeTranslation(
                x = 0,
                y = -0.1,
                z = 0
            )
        );

        this.ground.receiveShadow = true;
        this.ground.matrixAutoUpdate = false;
        this.add(this.ground);
    }

}