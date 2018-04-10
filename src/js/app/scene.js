import * as THREE from 'three';
import * as TrackballControls from 'three-trackballcontrols';
import GameCourt from './components/GameCourt';
import R2D2 from './components/r2d2';
import OVO from './components/ObjetoVolador';

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
    this.gameCourt = null;
    this.gameCourtWidth = 200;
    this.gameCourtLength = 700;
    this.OVOS = null;
    this.timeout = 1000;
    this.countOVOS = 20;
    this.ovosBu = this.countOVOS * 0.2;
    this.countOvosMaCreated = 0;
    this.countOvosBuCreated = 0;

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
    this.gameCourt = new GameCourt(this.gameCourtWidth,this.gameCourtLength, new THREE.MeshPhongMaterial(
      { color: 0x101010, specular: 0x777777, shininess: 70 })
    );
    this.add(this.gameCourt);
    this.createCamera(renderer);
    this.add(this.camera);

    //Añadimos el objeto R2D2
    this.robot = new R2D2(10,7,1,1,1);
    this.add(this.robot);

    //Los objetos voladores se crearán
    //cada cierto intervalo de tiempo
    this.OVOS = new THREE.Object3D();
    this.add(this.OVOS);
    this.timerOvoCreation = setInterval(this.createOvo, this.timeout);
  }

  /**
   * Metodo createCamara
   * Crea un objeto de tipo cámara en perspectiva
   * y lo sitúa en el espacio con una dirección
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

  createOvo(){

    if(this.countOvosMaCreated+this.countOvosBuCreated < this.countOVOS){

      var objectType =  'OvoMa';
      if(this.countOvosBuCreated < this.ovosBu)
        objectType = Math.random() <= 0.2 ? 'OvoBu':'OvoMa';

      if(this.countOvosBuCreated < this.ovosBu &&
          this.countOVOS-(this.countOvosMaCreated+this.countOvosBuCreated) <= this.ovosBu){
          objectType = 'OvoBu';
      }

      objectType == 'OvoBu'? this.countOvosBuCreated+=1 : this.countOvosMaCreated+=1;
      var positionX = Math.random()*this.gameCourtWidth/2 + 1;
      var positionZ = Math.random()*this.gameCourtLength + 600;
      var position = new THREE.Vector3(positionX,0,positionZ);
      var velocidad = Math.random()+3;

      this.OVOS.add(new OVO(objectType,velocidad,position));
    }

  }

  /**
   * Devuelve un objeto Camera para ser utilizado por el renderer
   * @returns {null|THREE.PerspectiveCamera}
   */
  getCamera(){
    return this.camera;
  }

  animateOVOS(){
    this.OVOS.children.forEach(function(ovo){
       ovo.animate();
    })
  }

  animate(){
    this.trackballControls.update();
    this.robot.animate();
    this.animateOVOS();
  }

  computeKey(event){
    this.robot.computeKey(event);
  }
}