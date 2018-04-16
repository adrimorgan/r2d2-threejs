import * as THREE from 'three';
import armsImg from '../../../public/assets/images/military.jpeg'
import headImg from '../../../public/assets/images/gold.jpg'
import bootsImg from '../../../public/assets/images/boots.png'
import blueGlass from '../../../public/assets/images/blueGlass2.jpg'
import Light from "./Light";

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
     * @param position Coordenada Z de situacion en el plano
     */
    constructor(refHeight, refWidth, position){
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
        this.eye = null;
        this.headLight = null;

        //Vectores dirección del robot
        this.forwardVector = null;
        this.backwardVector = null;

        //Valores de referencia: alto y ancho
        this.armHeight = refHeight;
        this.bodyWidth = refWidth;
        this.shoulderWidth = refWidth*0.2;
        this.bottomFootRadius = 0.3*refWidth;
        this.topFootRadius = 0.1*refWidth;
        this.footHeight = 0.3*refHeight;
        this.totalHeight = this.footHeight+this.armHeight+this.shoulderWidth+this.bodyWidth;

        //Variable de control del movimiento
        this.rotationDegrees = (15 * Math.PI/180);

        //Variables de control de grados de libertad (los grados deben expresarse en radianes)
        // La cabeza girará entre -80º y 80º (eje Y)
        this.minHeadRotation = (-80 * Math.PI/180);
        this.maxHeadRotation = (80 * Math.PI/180);
        // El cuerpo se balanceará entre -45º y 30º (eje X)
        this.minBodyRotation = (-45 * Math.PI/180);
        this.maxBodyRotation = (30 * Math.PI/180);
        // Los brazos podrán escalarse (solo en eje Y) hasta un 20% más
        this.minArmsScale = 1;
        this.maxArmsScale = 1.2;

        //Variables del juego (energía y puntos)
        this.energy = 300;
        this.gamePoints = 0;

        //Creación del robot
        this.createFeet();
        this.add(this.rightFoot);
        this.add(this.leftFoot);

        //Creacion de las flechas que indican las direcciones
        //forward y backward
        this.createDirectionVectors();
        this.add(this.forwardVector);
        this.add(this.backwardVector);

        this.position.z = position.z;
    }

    /**
     * Metodo que crea los vectores directores
     * que utilizará el robot como referencia para
     * desplazarse hacia adelante y hacia atras.
     */
    createDirectionVectors(){
        //dirección de forward y backward vector
        var forwardDir = new THREE.Vector3(0,0,5);
        var backwardDir = new THREE.Vector3(0,0,-5)
        //Normalizacion de vectores
        forwardDir.normalize();
        backwardDir.normalize();

        //Vector origen a la altura del pecho del robot
        var origin = new THREE.Vector3( 0, this.armHeight+this.footHeight, 0 );
        var size = 5;
        var color = 0xff0000;

        //Creamos nuestros vectores dirección para poder mover al robot por la escena.
        //No queremos que aparezcan en la escena asi que la visibilidad sera false
        this.forwardVector = new THREE.ArrowHelper( forwardDir, origin, size, color );
        this.backwardVector = new THREE.ArrowHelper( backwardDir, origin, size, color );
        this.forwardVector.visible = false;
        this.backwardVector.visible = false;
    }

    /**
     * Metodo para crear los pies del robot. Cada
     * brazo colgara jerarquicamente de cada pie
     */
    createFeet() {
        //Creación del pie derecho y traslacion para apoyarlo sobre el plano X
        this.rightFoot = new THREE.Mesh(
            new THREE.CylinderGeometry(this.topFootRadius, this.bottomFootRadius, this.footHeight, 32, 32, 1),
            new THREE.MeshPhongMaterial({ map: new THREE.TextureLoader().load(bootsImg) }));
        this.rightFoot.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(-(this.bodyWidth + this.shoulderWidth) / 2, this.footHeight / 2, 0));
        this.rightFoot.castShadow = true;
        this.rightFoot.matrixAutoUpdate = false;
        this.rightFoot.updateMatrix();

        //Creación del pie izauierdo: lo trasladamos tambien en el eje X
        this.leftFoot = new THREE.Mesh(
            new THREE.CylinderGeometry(this.topFootRadius, this.bottomFootRadius, this.footHeight, 32, 32, 1),
            new THREE.MeshPhongMaterial({ map: new THREE.TextureLoader().load(bootsImg) }));
        this.leftFoot.geometry.applyMatrix(new THREE.Matrix4().makeTranslation((this.bodyWidth + this.shoulderWidth)/2, this.footHeight / 2, 0));
        this.leftFoot.castShadow = true;
        this.leftFoot.matrixAutoUpdate = false;
        this.leftFoot.updateMatrix();

        //Creación de los brazos: serán añadidos como hijos de esta geometria
        this.createArms();
        this.rightFoot.add(this.rightArm);
        this.leftFoot.add(this.leftArm);
    }

    /**
     * Metodo que crea los brazos del robot. Cada hombro
     * colgara de su respectivo brazo de forma que permita
     * desplazarlos cuando el brazo suba o baje.
     */
    createArms() {
        //Creación del brazo derecho y traslacion para apoyarlo sobre el eje y posteriormente a
        //la altura del pie que le corresponda
        this.rightArm = new THREE.Mesh(
            new THREE.CylinderGeometry(this.topFootRadius, this.topFootRadius, this.armHeight),
            new THREE.MeshPhongMaterial({ map: new THREE.TextureLoader().load(bootsImg) }));

        this.rightArm.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(-(this.bodyWidth + this.shoulderWidth) / 2, this.armHeight / 2, 0));
        this.rightArm.castShadow = true;
        this.rightArm.matrixAutoUpdate = false;
        this.rightArm.position.y = this.footHeight;
        this.rightArm.updateMatrix();

        //Creación del brazo izquierdo de la misma forma
        this.leftArm = new THREE.Mesh(
            new THREE.CylinderGeometry(this.topFootRadius, this.topFootRadius, this.armHeight),
            new THREE.MeshPhongMaterial({ map: new THREE.TextureLoader().load(bootsImg) }));

        this.leftArm.geometry.applyMatrix(new THREE.Matrix4().makeTranslation((this.bodyWidth + this.shoulderWidth) / 2, this.armHeight / 2, 0));
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

    /**
     * Metodo que crea los hombros. El cuerpo entero colgará de
     * uno de los dos hombros, de forma que el cuerpo suba o baje
     * en funcion del movimiento de los hombros cuando son elevados
     * por los brazos.
     */
    createShoulders() {
        //Creamos el hombro derecho y lo situamos sobre el plano X y posteriomente lo
        //desplazamos hasta estar encima del brazo
        this.rightShoulder = new THREE.Mesh(
            new THREE.BoxGeometry(this.shoulderWidth, this.shoulderWidth, this.shoulderWidth),
            new THREE.MeshPhongMaterial({ map: new THREE.TextureLoader().load(armsImg) }));

        this.rightShoulder.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(-(this.bodyWidth + this.shoulderWidth) / 2, this.shoulderWidth * 0.5, 0));
        //Trasladarlo justo encima del brazo
        this.rightShoulder.castShadow = true;
        this.rightShoulder.matrixAutoUpdate = false;
        this.rightShoulder.position.y = this.armHeight + this.footHeight;
        this.rightShoulder.updateMatrix();

        //Hombro derecho
        this.leftShoulder = new THREE.Mesh(
            new THREE.BoxGeometry(this.shoulderWidth, this.shoulderWidth, this.shoulderWidth),
            new THREE.MeshPhongMaterial({ map: new THREE.TextureLoader().load(armsImg) }));

        this.leftShoulder.geometry.applyMatrix(new THREE.Matrix4().makeTranslation((this.bodyWidth + this.shoulderWidth) / 2, this.shoulderWidth * 0.5, 0));
        //Trasladarlo justo encima del brazo
        this.leftShoulder.castShadow = true;
        this.leftShoulder.matrixAutoUpdate = false;
        this.leftShoulder.position.y = this.armHeight + this.footHeight;
        this.leftShoulder.updateMatrix();

        //Creación del cuerpo
        this.createBody();
        this.rightShoulder.add(this.body);
    }

    /**
     * Metodo que crea el cuerpo del robot. De éste colgará la
     * cabeza del robot, de forma que a esta última le afecten
     * las transformaciones que se apliquen sobre el cuerpo.
     */
    createBody() {
        //Creación del cuerpo del robot: el eje de coordenadas del cuerpo
        //estará situado a la altura de los hombros, de forma que la rotacion
        //se realice con respecto a estos
        this.body = new THREE.Mesh(
            new THREE.CylinderGeometry(this.bodyWidth / 2, this.bodyWidth / 2, this.armHeight + this.shoulderWidth, 32, 32),
            new THREE.MeshPhongMaterial({ map: new THREE.TextureLoader().load(armsImg) }));
        this.body.castShadow = true;

        //Trasladamos el cuerpo un poco mas abajo de la mitad de su altura para que
        //se ajuste mejor a los hombros
        this.body.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, -this.footHeight, 0));
        this.body.geometry.applyMatrix(new THREE.Matrix4().makeRotationY(-Math.PI/2.25));
        this.body.rotation.x = 0;
        this.createHead();
        this.body.add(this.head);
        this.body.rotateX(-2*this.rotationDegrees);
    }

    /**
     * Metodo que crea la cabeza del robot, que tiene a su vez
     * un ojo en medio de ésta. Al ser hija del cuerpo, se ve
     * afectada por las transformaciones del mismo.
     */
    createHead() {
        //Creamos la mitad de una esfera para la cabeza,
        //que tendrá una lente en el centro simulando un ojo
        this.head = new THREE.Mesh(new THREE.SphereGeometry(this.bodyWidth / 2, 32, 32, 0, Math.PI * 2, 0, 0.5 * Math.PI),
            new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(headImg)}));
        this.head.position.y += 1.9 * this.shoulderWidth;
        this.head.rotation.y = 0;

        //Creamos el ojo del robot
        this.eye = new THREE.Mesh(new THREE.CylinderGeometry(this.shoulderWidth / 2, this.shoulderWidth / 2, this.shoulderWidth, 32, 32),
            new THREE.MeshPhongMaterial({ map: new THREE.TextureLoader().load(blueGlass) }));
        this.head.castShadow = true;
        this.eye.geometry.applyMatrix(new THREE.Matrix4().makeRotationX(Math.PI / 2));
        this.eye.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, this.bodyWidth / 4, this.bodyWidth/2.5));
        this.eye.rotation.y = 0;
        //Creamos la luz que sale del ojo del robot
        this.createHeadLight();
        this.head.add(this.eye);
        this.head.rotateY(2*this.rotationDegrees);
    }

    /**
     * Metodo que crea la luz de la cabeza del robot.
     * Este elemento cuelga de la cabeza de forma que se vea
     * afectado por las transformaciones aplicadas.
     */
    createHeadLight(){
        //Creamos la luz focal con un grado de inclinacion de 30º
        //sobre el ojo del robot, como si fuera una luz de casco de minero
        var lightPositionY = this.footHeight+this.armHeight+this.bodyWidth;
        var lightPositionZ = this.bodyWidth/2;
        this.headLight = new Light(0x0000ff, 2.0, new THREE.Vector3(0, lightPositionY, lightPositionZ));

        //El objetivo al que apunta la luz esta a su misma altura pero negativa
        //y media unidad de anchura por delante, de forma que la distancia focal no sea
        //excesivamente grande
        var lightTarget = new THREE.Object3D();
        lightTarget.position.set(0,-lightPositionY, lightPositionZ*6);

        var lightAngle = 30*Math.PI/180; //30 grados de iluminacion total
        var distance = 200; //Distancia focal
        this.headLight.setParameters(lightTarget,lightAngle,distance);
        this.eye.add(this.headLight);
    }

    /**
     * Metodo que detecta los eventos de teclado
     * para controlar el movimiento del robot por
     * el campo de juego
     * @param event Evento de teclado
     */
    computeKey(event){
        //Realiza una accion en funcion del tipo de tecla pulsada
        switch(event.code){
            case 'ArrowUp':
                var vector = new THREE.Vector3();
                vector.setFromMatrixPosition(this.forwardVector.cone.matrixWorld);
                this.position.x = vector.x;
                this.position.z = vector.z;
                this.energy -= 1;
                break;
            case 'ArrowDown':
                var vector = new THREE.Vector3();
                vector.setFromMatrixPosition(this.backwardVector.cone.matrixWorld);
                this.position.x = vector.x;
                this.position.z = vector.z;
                this.energy -= 1;
                break;
            case 'ArrowLeft':
                this.rotateY(this.rotationDegrees);
                this.energy -= 1;
                break;
            case 'ArrowRight':
                this.rotateY(-this.rotationDegrees);
                this.energy -= 1;
                break;
            default:
                break;
        }
    }

    /**
     * Metodo que gestiona las colisiones del robot
     * con los objetos voladores de la escena
     * @param type 'OvoBu' o 'OvoMa'
     */
    handleCollision(type){
        switch(type){
            //Aumenta puntos y/o energia del robot
            case 'OvoBu':
                var pointsNumber = Math.floor(Math.random()*5);
                this.gamePoints += pointsNumber;
                this.energy += (5 - pointsNumber);
                document.getElementById('puntos').textContent = this.gamePoints;
                break;
            //Disminuye la energia del robot
            case 'OvoMa':
                this.energy -= 10;
                break;
            default:
                break;
        }
    }

    /**
     * Metodo que controla la animacion del robot.
     * @param controls Elementos del GUI que controlan
     * los grados de libertad del robot
     */
    animate(controls){
        //Rotacion de la cabeza y cuerpo
        this.head.rotation.y = (controls.headRotation * Math.PI/180);
        this.body.rotation.x = (controls.bodyRotation * Math.PI/180);

        //Movimiento de subir y bajar del robot
        this.rightArm.scale.y = controls.armsLength/100;
        this.rightArm.updateMatrix();
        this.rightShoulder.position.y = ((this.armHeight + this.shoulderWidth + (this.shoulderWidth * 0.5)) * controls.armsLength/100);
        this.rightShoulder.updateMatrix();

        this.leftArm.scale.y = controls.armsLength/100;
        this.leftArm.updateMatrix();
        this.leftShoulder.position.y = ((this.armHeight + this.shoulderWidth + (this.shoulderWidth * 0.5)) * controls.armsLength / 100);
        this.leftShoulder.updateMatrix();
    }
}
