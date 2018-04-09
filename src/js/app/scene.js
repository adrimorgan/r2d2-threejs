import * as THREE from 'three';
import * as TrackballControls from 'three-trackballcontrols';
import Light from './components/light';
import Ground from './components/ground';
import R2D2 from './components/r2d2';

/**
 * Clase Scene: agrupa los elementos de
 * iluminacion, una camara simple y un objeto
 * que representa la superficie sobre la que se
 * trabajará.
 */
export default class Scene extends THREE.Scene {

  constructor(renderer){
    super();

    //Datos miembro
    this.ambientLight = null;
    this.spotLight = null;
    this.camera = null;
    this.ground = null;

    //Luz ambiental
    this.ambientLight = new THREE.AmbientLight(0xffffff,0.85);
    this.add(this.ambientLight);

    //Luz direccional
    this.spotLight =  new THREE.SpotLight( 0xffffff );
    this.spotLight.position.set( 0, 30, -50 );
    this.spotLight.castShadow = true;
    this.spotLight.shadow.mapSize.width = 1024;
    this.spotLight.shadow.mapSize.height = 1024;
    this.add(this.spotLight );

    //Objeto que representa la superficie
    this.ground = new Ground(100,700, new THREE.MeshPhongMaterial(
      { color: 0x101010, specular: 0x777777, shininess: 70 })
    );
    this.add(this.ground);
    this.createCamera(renderer);
    this.add(this.camera);

    //Añadimos el objeto R2D2
    this.robot = new R2D2(10,7,1,1,1);
    this.add(this.robot);
  }

  /**
   * Metodo createCamara
   * Crea un objeto de tipo cámara en perspectiva
   * y lo sitúa en el espacio con una dirección
   * Lo ideal sería utilizar la clase Camera pero
   * no he conseguido que funcione (la clase Ground externa
   * SI que funciona)
   */
  createCamera (renderer) {
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set (0, 50, -70);
    var look = new THREE.Vector3 (0,0,50);
    this.camera.lookAt(look);

    this.trackballControls = new TrackballControls(this.camera, renderer);
    this.trackballControls.minDistance = 25;
    this.trackballControls.maxDistance = 250;
    this.trackballControls.rotateSpeed = 2;
    this.trackballControls.zoomSpeed = 2;
    this.trackballControls.panSpeed = 0.25;
    this.trackballControls.target = look;
  }

  /**
   * Devuelve un objeto Camera para ser utilizado por el renderer
   * @returns {null|THREE.PerspectiveCamera}
   */
  getCamera(){
    return this.camera;
  }

  animate(){
    this.trackballControls.update();
    this.robot.animate();
  }

  computeKey(event){
    this.robot.computeKey(event);
  }
}