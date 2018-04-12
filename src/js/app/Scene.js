import * as THREE from 'three';
import * as TrackballControls from 'three-trackballcontrols';
import GameCourt from './components/GameCourt';
import R2D2 from './components/R2D2';
import OVO from './components/ObjetoVolador';
import metalImg from '../../public/assets/images/gameCourt.jpg';
import Light from "./components/Light";

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
    this.sceneAmbientLight = null;
    this.sceneSpotlight = null;
    this.camera = null;
    this.gameCourt = null;
    this.gameCourtWidth = 800;
    this.gameCourtLength = 800;
    this.OVOS = null;
    this.timeout = 1000;
    this.countOVOS = 20;
    this.ovosBu = this.countOVOS * 0.2;
    this.countOvosMaCreated = 0;
    this.countOvosBuCreated = 0;

    //Luz ambiental de la escena
    this.sceneAmbientLight = new Light('ambient');
    this.add(this.sceneAmbientLight);

    //Luz direccional de la escena
    this.sceneSpotlight = new Light('spot',0xffffff,0.2,new THREE.Vector3(0,30,-30));
    this.add(this.sceneSpotlight);

    //Objeto que representa la superficie
    var loader = new THREE.TextureLoader();
    var gameCourtTexture = loader.load(metalImg);
    this.gameCourt = new GameCourt(this.gameCourtWidth,this.gameCourtLength, new THREE.MeshPhongMaterial(
      {map:gameCourtTexture}));
    this.add(this.gameCourt);
    this.createCamera(renderer);
    this.add(this.camera);

    //Añadimos el objeto R2D2
    this.robot = new R2D2(20,14,1,1,1);
    this.add(this.robot);

    //Los objetos voladores se crearán
    //cada cierto intervalo de tiempo
    this.OVOS = new THREE.Object3D();
    this.add(this.OVOS);
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
      var velocidad = Math.random()+2;

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
    this.animateOVOS();
  }

  computeKey(event){
      this.robot.updateMatrixWorld();
      this.robot.computeKey(event);
  }
}