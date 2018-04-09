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
     * @param gamma escalado de brazos no mayor del 20% de la altura original
     */
    constructor(refHeight, refWidth, alpha, beta, gamma){
        super();

        //Partes del cuerpo
        //Partes del brazo completo
        this.rightFoot = null;
        this.leftFoot = null;
        this.rightArm = null;
        this.leftArm = null;
        this.rightShoulder = null;
        this.leftShoulder = null;

        //Cuerpo y cabeza
        this.body = null;
        this.head = null;

        //Valores de referencia: alto y ancho
        this.armHeight = refHeight;
        this.bodyWidth = refWidth;
        this.shoulderWidth = refWidth*0.2;
        this.bottomFootRadius = 0.3*refWidth;
        this.topFootRadius = 0.1*refWidth;
        this.footHeight = 0.3*refHeight;

        //Variables de control de movimiento
        this.growingArms = true;

        //Creación
        this.createFeet();
        this.add(this.rightFoot);
        this.add(this.leftFoot);

        window.addEventListener("keydown", this.walk, false);
    }

    createFeet(){
        //Creación del pie derecho y traslacion para apoyarlo sobre el plano X
        this.rightFoot = new THREE.Mesh(
            new THREE.CylinderGeometry(this.topFootRadius, this.bottomFootRadius, this.footHeight,32,32,1),
            new THREE.MeshBasicMaterial({color:0x0000ee}));
        this.rightFoot.geometry.applyMatrix(new THREE.Matrix4().makeTranslation (0, this.footHeight/2, 0));
        this.rightFoot.castShadow = true;
        this.rightFoot.matrixAutoUpdate = false;
        this.rightFoot.position.x -= (this.bodyWidth+this.shoulderWidth)/2;
        this.rightFoot.updateMatrix();

        //Creación del pie izauierdo: lo trasladamos tambien en el eje X
        this.leftFoot = new THREE.Mesh(
            new THREE.CylinderGeometry(this.topFootRadius, this.bottomFootRadius, this.footHeight,32,32,1),
            new THREE.MeshBasicMaterial({color:0x0000ee}));
        this.leftFoot.geometry.applyMatrix(new THREE.Matrix4().makeTranslation (this.bodyWidth+this.shoulderWidth, this.footHeight/2, 0));
        this.leftFoot.castShadow = true;
        this.leftFoot.matrixAutoUpdate = false;
        this.leftFoot.position.x -= (this.bodyWidth+this.shoulderWidth)/2;
        this.leftFoot.updateMatrix();


        //Creación de los brazos: serán añadidos como hijos de esta geometria
        this.createArms();
        this.rightFoot.add(this.rightArm);
        this.leftFoot.add(this.leftArm);
    }

    createArms(){
        //Creación del brazo derecho y traslacion para apoyarlo sobre el eje y posteriormente a
        //la altura del pie que le corresponda
        this.rightArm = new THREE.Mesh(
            new THREE.CylinderGeometry(this.topFootRadius,this.topFootRadius,this.armHeight),
            new THREE.MeshBasicMaterial({color:0xffffff}));

        this.rightArm.geometry.applyMatrix(new THREE.Matrix4().makeTranslation (0, this.armHeight/2, 0));
        this.rightArm.castShadow = true;
        this.rightArm.matrixAutoUpdate = false;
        this.rightArm.position.y = this.footHeight;
        this.rightArm.updateMatrix();

        //Creación del brazo izquierdo de la misma forma
        this.leftArm = new THREE.Mesh(
            new THREE.CylinderGeometry(this.topFootRadius,this.topFootRadius,this.armHeight),
            new THREE.MeshBasicMaterial({color:0xffffff}));

        this.leftArm.geometry.applyMatrix(new THREE.Matrix4().makeTranslation (this.bodyWidth+this.shoulderWidth, this.armHeight/2, 0));
        this.leftArm.castShadow = true;
        this.leftArm.matrixAutoUpdate = false;
        this.leftArm.position.y = this.footHeight;
        this.leftArm.updateMatrix();
        
        //Creación de los hombros: serán hijos de la geometria de los pies
        //y contendrán ademas el cuerpo del robot
        this.createShoulders();
        this.rightFoot.add(this.rightShoulder);
        this.leftFoot.add(this.leftShoulder);
    }

    createShoulders(){
        //Creamos el hombro derecho y lo situamos sobre el plano X y posteriomente lo
        //desplazamos hasta estar encima del brazo
        this.rightShoulder = new THREE.Mesh(
            new THREE.BoxGeometry(this.shoulderWidth,this.shoulderWidth,this.shoulderWidth),
            new THREE.MeshBasicMaterial({color:0x0000ff}));

        this.rightShoulder.geometry.applyMatrix(new THREE.Matrix4().makeTranslation (0, this.shoulderWidth*0.5, 0));
        //Trasladarlo justo encima del brazo
        this.rightShoulder.castShadow = true;
        this.rightShoulder.matrixAutoUpdate = false;
        this.rightShoulder.position.y = this.armHeight + this.footHeight;
        this.rightShoulder.updateMatrix();

        //Hombro derecho
        this.leftShoulder = new THREE.Mesh(
            new THREE.BoxGeometry(this.shoulderWidth,this.shoulderWidth,this.shoulderWidth),
            new THREE.MeshBasicMaterial({color:0x0000ff}));

        this.leftShoulder.geometry.applyMatrix(new THREE.Matrix4().makeTranslation (this.bodyWidth+this.shoulderWidth, this.bodyWidth*0.1, 0));
        //Trasladarlo justo encima del brazo
        this.leftShoulder.castShadow = true;
        this.leftShoulder.matrixAutoUpdate = false;
        this.leftShoulder.position.y = this.armHeight + this.footHeight;
        this.leftShoulder.updateMatrix();

        //Creación del cuerpo
        this.createBody();
        this.rightShoulder.add(this.body);
    }

    createBody(){
        //Creación del cuerpo del robot: el eje de coordenadas del cuerpo
        //estará situado a la altura de los hombros, de forma que la rotacion
        //se realice con respecto a estos
        this.body = new THREE.Mesh(
            new THREE.CylinderGeometry(this.bodyWidth/2,this.bodyWidth/2,this.armHeight+this.shoulderWidth,32,32),
            new THREE.MeshBasicMaterial({color:0xc0c0c0}));

        //Trasladamos el cuerpo un poco mas abajo de la mitad de su altura para que
        //se ajuste mejor a los hombros
        this.body.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0,-this.footHeight,0));
        this.body.position.x = this.bodyWidth/2 + this.shoulderWidth/2;
        this.body.rotation.x = 0;
        this.createHead();
        this.body.add(this.head);
    }

    createHead(){
        //Creamos la mitad de una esfera para la cabeza,
        //que tendrá una lente en el centro simulando un ojo
        this.head = new THREE.Mesh(new THREE.SphereGeometry(this.bodyWidth/2,32,32,0, Math.PI*2,0,0.5*Math.PI), new THREE.MeshBasicMaterial({color:0x0000ff}));
        this.head.position.y += 1.9*this.shoulderWidth;
        this.head.rotation.y = 0;
        var robotEye = new THREE.Mesh(new THREE.CylinderGeometry(this.shoulderWidth/2,this.shoulderWidth/2,this.shoulderWidth,32,32),
            new THREE.MeshBasicMaterial({color:0xff0000}));
        robotEye.geometry.applyMatrix(new THREE.Matrix4().makeRotationX(Math.PI/2));
        robotEye.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0,this.bodyWidth/4,this.bodyWidth/2.5));
        this.head.add(robotEye);
    }

    computeKey(event){
        switch(event.code){
            case 'ArrowUp':
                this.position.z += 1;
                break;
            case 'ArrowDown':
                this.position.z -= 1;
                break;
            case 'ArrowLeft':
                this.rotation.y += 0.2;
                break;
            case 'ArrowRight':
                this.rotation.y -= 0.2;
                break;
            case 'KeyA':
                this.body.rotation.x += 0.2;
                break;
            case 'KeyS':
                this.body.rotation.x -= 0.2;
                break;            
            default:
                alert('Letra no reconocida');
                break;
        }
    }

    animate(){
        // if(this.growingArms){
        //     this.rightArm.scale.y = 1.5;
        //     this.rightArm.updateMatrix();
        //     this.rightShoulder.position.y = this.rightArm.position.y;
        //     this.rightShoulder.updateMatrix();
        // } else {
            
        // }

        //_______________________________________________________________________
        //AQUI PRUEBA "A MANO" LOS DISTINTOS GRADOS DE LIBERTAD
        //CUANDO SE ESCALE UN BRAZO, HAY QUE ESCALAR EL OTRO TAMBIEN, POR LO QUE
        //HABRA QUE TRASLADAR AMBOS HOMBROS. PUEDE QUE HAYA ALGUNA FORMA DE HACER LA
        //HERENCIA DE FORMA QUE CUANDO SE APLIQUE UN ESCALADO AL BRAZO DERECHO, SE APLIQUE
        //DE FORMA AUTOMATICA AL IZQUIERDO, PERO NO SE COMO XD
        //PD: GUAPO :3
        //_______________________________________________________________________
        
        // this.body.rotation.x += 0.1;
        // this.body.updateMatrix();
        //this.head.rotation.y = Math.PI/2;
        //this.head.updateMatrix();
    }
}

















