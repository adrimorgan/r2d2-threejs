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

    // parameters for dimensions of the figure
    this.height = (parameters.height === undefined ? 200 : parameters.height);
    this.width = this.height/2;
    this.material = (parameters.material === undefined ? new THREE.MeshPhongMaterial ({color: 0xaaaaaa, specular: 0xdddddd, shininess: 70}) : parameters.material);

    this.head = null;
    this.trunk = null;
    this.arms = null;

    this.arms = this.createArms();
    this.add (this.arms);
  }

  createArms(){
    //pie (tronco de cono)
    var foot = new THREE.Mesh(new THREE.CylinderGeometry());
    //brazo  (cilindro)
    var arm = new THREE.Mesh(new THREE.CylinderGeometry());
    arm.add(foot);
    //hombro (cubo)
    var shoulder = new THREE.Mesh(new THREE.BoxGeometry());
    shoulder.add(arm);
    //traslación derecha
    this.arms.add(shoulder);
    //traslación izquierda
    this.arms.add(shoulder);
    this.arms.castShadow = true;
    this.arms.autoUpdateMatrix = false;
    this.arms.add(this.createBody());
    return this.arms;
  }

  createBody(){
    //lente (cilindro)
    var len = new THREE.Mesh(new THREE.CylinderGeometry());
    //cabeza (semiesfera)
    this.head = new THREE.Mesh(new THREE.SphereGeometry());
    this.head.add(len);
    //tronco (cilindro)
    this.trunk = new THREE.Mesh(new THREE.CylinderGeometry());
    this.trunk.add(head);
    return this.trunk;
  }

}
