import * as THREE from 'three';

/**
 * Clase R2D2: modelo jerarquico de un robot parecido a
 * R2D2 donde tendrá 3 grados de libertad: podra elevarse
 * con sus brazos, balancearse hacia delante y atras y
 * girar la cabeza hasta determinada posicion
 */
export default class R2D2 extends THREE.Object3D {

    /**
     * @param refHeight altura de referencia de los brazos
     * @param refWidth anchura de referencia del cuerpo
     * @param alpha angulo balanceo (35º hacia delante, 45º hacia atras
     * @param beta angulo giro de la cabeza (80º como maximo)
     * @param gamma escalado no mayor del 20% de la altura original
     */
    constructor(refHeight, refWidth, alpha, beta, gamma){
        super();

        //Datos miembro: partes del brazo por
        //separado
        this.rightShoulder = null;
        this.leftShoulder = null;
        this.rightArm = null;
        this.leftArm = null;
        this.rightFoot = null;
        this.leftFoot = null;

        //Brazos completos
        this.wholeRightArm = null;

        this.armHeigth = refHeight;
        this.bodyWidth = refWidth;
        this.bottomFootRadius = 0.3*refWidth;
        this.topFootRadius = 0.1*refWidth;
        this.footHeight = 0.3*refHeight;

        //Creacion de los brazos
        this.wholeRightArm = this.createRightArm();
        this.add(this.wholeRightArm);

    }

    createRightArm(){

        //Pie del robot: tronco de cono
        this.rightFoot = new THREE.Mesh(
            new THREE.CylinderGeometry(this.topFootRadius,this.bottomFootRadius,this.footHeight,32,32,1),
            new THREE.MeshBasicMaterial({color:0x0000ee}));

        //Para apoyarlo sobre la superficie del suelo hay que trasladar la geometria del mismo
        this.rightFoot.geometry.applyMatrix(new THREE.Matrix4().makeTranslation (0, this.footHeight/2, 0));
        this.rightFoot.castShadow = true;
        this.rightFoot.matrixAutoUpdate = false;
        this.rightFoot.position.y = 0;

        this.rightArm = new THREE.Mesh(
            new THREE.CylinderGeometry(this.topFootRadius,this.topFootRadius,this.armHeigth),
            new THREE.MeshBasicMaterial({color:0xff00ee}));

        //Para apoyarlo sobre el pie
        this.rightArm.geometry.applyMatrix(new THREE.Matrix4().makeTranslation (0, this.armHeigth/2 + this.footHeight, 0));
        this.rightArm.castShadow = true;
        this.rightArm.matrixAutoUpdate = false;
        this.rightArm.scale.y = 1;
        this.rightFoot.add(this.rightArm)

        //Hombro
        this.rightShoulder = new THREE.Mesh(
            new THREE.BoxGeometry(0.2*this.bodyWidth,0.2*this.bodyWidth,0.2*this.bodyWidth),
            new THREE.MeshBasicMaterial({color:0x00ff00}));

        //Trasladarlo justo encima del brazo
        var traslacion = 0.1*this.bodyWidth + this.footHeight + this.armHeigth;
        this.rightShoulder.geometry.applyMatrix(new THREE.Matrix4().makeTranslation (0, traslacion, 0));
        this.rightShoulder.castShadow = true;
        this.rightShoulder.matrixAutoUpdate = false;

        //Creacion del modelo
        this.rightFoot.add(this.rightShoulder);
        return this.rightFoot;
    }

    setPosition(){
        this.rightArm.scale.y = 1.5;
        this.rightArm.updateMatrix();
    }
}















