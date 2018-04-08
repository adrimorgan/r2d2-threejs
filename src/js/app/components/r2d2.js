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
    constructor(refHeight,refWidth, alpha, beta,gamma){
        super();

        //Datos miembro
        this.rightArm = null;
        this.leftArm = null;
        this.armHeigth = refHeight;
        this.bodyWidth = refWidth;
        this.bottomFootRadius = 0.3*refWidth;
        this.topFootRadius = 0.1*refWidth;
        this.footHeight = 0.3*refHeight;

        //Creacion de los brazos
        this.leftArm = this.createArm();
        //Separamos la anchura del cuerpo
        this.leftArm.applyMatrix(new THREE.Matrix4().makeTranslation (this.bodyWidth, 0, 0));
        //El derecho se crea centrado en el origen
        this.rightArm = this.createArm();
        this.add(this.rightArm);
        this.add(this.leftArm);

    }

    createArm(){

        //Pie del robot: tronco de cono
        var foot = new THREE.Mesh(
            new THREE.CylinderGeometry(this.topFootRadius,this.bottomFootRadius,this.footHeight,32,32,1),
            new THREE.MeshBasicMaterial({color:0x0000ee}));

        //Para apoyarlo sobre la superficie del suelo hay que trasladar la geometria del mismo
        foot.geometry.applyMatrix(new THREE.Matrix4().makeTranslation (0, this.footHeight/2, 0));
        foot.castShadow = true;
        foot.matrixAutoUpdate = false;

        var arm = new THREE.Mesh(
            new THREE.CylinderGeometry(this.topFootRadius,this.topFootRadius,this.armHeigth),
            new THREE.MeshBasicMaterial({color:0xff00ee}));

        //Para apoyarlo sobre el pie
        arm.geometry.applyMatrix(new THREE.Matrix4().makeTranslation (0, this.armHeigth/2 + this.footHeight, 0));
        arm.castShadow = true;
        arm.matrixAutoUpdate = false;

        //Hombro
        var shoulder = new THREE.Mesh(
            new THREE.BoxGeometry(0.2*this.bodyWidth,0.2*this.bodyWidth,0.2*this.bodyWidth),
            new THREE.MeshBasicMaterial({color:0x00ff00}));

        //Trasladarlo justo encima del brazo
        var traslacion = 0.1*this.bodyWidth + this.footHeight + this.armHeigth;
        shoulder.geometry.applyMatrix(new THREE.Matrix4().makeTranslation (0, traslacion, 0));
        shoulder.castShadow = true;
        shoulder.matrixAutoUpdate = false;
        arm.add(foot);
        arm.add(shoulder);

        return arm;

    }
}















