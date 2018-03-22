/// The R2D2 class
/**
 * @author Arthur & Adrian
 *
 * @param parameters = {
 *    height: <float>,
 *    material: <Material>
 * }
 */

class R2D2 extends THREE.Object3D {

  constructor (parameters) {
    super();

    // Parámetros para las dimensiones del robot
    this.height = (parameters.height === undefined ? 25 : parameters.height);
    this.width = this.height/2;
    this.material = (parameters.material === undefined ?
        new THREE.MeshPhongMaterial ({color: 0xffffff, specular: 0xccccff, shininess: 70}) : this.material);

    // Partes del cuerpo
    this.len = null;
    this.head = null;
    this.trunk = null;
    this.rightShoulder = null;
    this.rightForearm = null;
    this.rightFoot = null;
    this.leftShoulder = null;
    this.leftForearm = null;
    this.leftFoot = null;

    //Dimensiones de los pies
    this.footHeight = this.height*0.1;
    this.footTopRadius = this.width*0.075;
    this.footBottomRadius = this.width*0.15;

    //Dimensiones de los brazos
    this.armHeight = this.height*0.5;
    this.armRadius = this.width*0.07;

    //Dimensiones de los hombros
    this.shoulderDims = this.width*0.15;

    this.trunk = this.createBody();
  }

  createBody(){
    /*
    * crear lente
    * trasladar lente
    * añadir lente a cabeza
    * rotar cabeza
    * trasladar cabeza
    * añadir cabeza a tronco
    * rotar tronco
    * trasladar tronco
    * añadir tronco a cuerpo
    * */

    /*
    * crear hombro
    * trasladar hombro
    * crear brazo
    * añadir hombro a brazo
    * trasladar hombro
    * crear pie
    * añadir hombro a pie
    * trasladar pie a x y -x
    * añadir pies a cuerpo
    * */

    //lente (cilindro)
    var len = new THREE.Mesh(new THREE.CylinderGeometry(this.armRadius, this.armRadius, 1, 16,32),this.material);
    len.geometry.applyMatrix (new THREE.Matrix4().makeRotationY (Math.PI / 90));
    len.geometry.applyMatrix (new THREE.Matrix4().makeTranslation (this.width/2, this.height,10));

    //cabeza (semiesfera)
    this.head = new THREE.Mesh(new THREE.SphereGeometry(this.width/2.5,32,32),this.material);
    this.head.geometry.applyMatrix (new THREE.Matrix4().makeTranslation (this.width/1, this.height/1,0));
    this.head.add(len);

    //Creacion de los dos brazos
    this.rightFoot = this.createShoulder();
    this.leftFoot = this.createShoulder();
    this.leftFoot.position.x = this.width;

    this.add(this.rightFoot);
    this.add(this.leftFoot);

    //tronco (cilindro)
    this.trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(this.width/2.25,this.width/2.25, this.height/2,32,32),this.material);
    this.trunk.add(this.head);
    this.trunk.geometry.applyMatrix (new THREE.Matrix4().makeTranslation (this.width/2, this.height/2,0));
    return this.trunk;
  }


  //Metodo que crea el hombro del robot
  createShoulder(){
    var shoulder = new THREE.Mesh (
        new THREE.BoxGeometry (this.shoulderDims, this.shoulderDims, this.shoulderDims),
        this.material);
    shoulder.geometry.applyMatrix (new THREE.Matrix4().makeTranslation (0,this.armHeight + this.footHeight/2, 0));
    shoulder.castShadow = true;
    shoulder.autoUpdateMatrix = false;
    shoulder.add(this.createArm());
    return shoulder;
  }

  //Metodo que crea el brazo del robot
  createArm(){
    var arm = new THREE.Mesh(
        new THREE.CylinderGeometry(this.armRadius,this.armRadius,this.armHeight,16,32),this.material);
    arm.geometry.applyMatrix (new THREE.Matrix4().makeTranslation (0,3*this.footHeight, 0));
    arm.castShadow=true;
    arm.autoUpdateMatrix = false;
    arm.add(this.createFoot());
    return arm;
  }

  //Metodo para crear el pie del robot, un tronco de cono
  createFoot(){
    var foot = new THREE.Mesh(
        new THREE.CylinderGeometry(this.footTopRadius, this.footBottomRadius,this.footHeight,16,32 ), this.material);
    foot.geometry.applyMatrix (new THREE.Matrix4().makeTranslation (0, this.footHeight/2, 0));
    foot.castShadow = true;
    foot.autoUpdateMatrix = false;
    return foot;
  }

}

/*
1) cabeza = new Mesh(esf, m)
2) cuerpo = new Mesh(cilin, m)
3) cuerpo.rotation.x = __
4) cabeza.position.y = __
5) cuerpo.add(cabeza)
*/
