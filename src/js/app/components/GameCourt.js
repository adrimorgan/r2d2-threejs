import * as THREE from 'three';

/**
 * Clase GameCourt: representa la superficie
 * de apoyo donde se desarrollaran las acciones
 */
export default class GameCourt extends THREE.Object3D {

    constructor(aWidth, aDepth, material){
        super();

        //Datos miembro
        this.width = aWidth;
        this.height = 0.2
        this.depth = aDepth;
        this.material = material;

        // Creación del plano que representa el suelo
        this.ground = new THREE.Mesh(
            new THREE.BoxGeometry(this.width, this.height, this.depth),
            this.material
        );
        this.ground.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, (this.depth/2 - this.width/2)));

        this.ground.receiveShadow = true;
        this.ground.matrixAutoUpdate = false;
        this.add(this.ground);
    }
}