import * as THREE from 'three';
import * as TrackballControls from 'three-trackballcontrols';
import GameCourt from './components/GameCourt';
import R2D2 from './components/R2D2';
import OVO from './components/ObjetoVolador';
import metalImg from '../../public/assets/images/gameCourt.jpg';
import Light from "./components/Light";
import Camera from "./components/Camera";

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
    this.thirdPersonCamera = null;
    this.firstPersonCamera = null;
    this.activeCamera = null;
    this.gameCourt = null;
    this.gameCourtWidth = 300;
    this.gameCourtLength = 800;
    this.OVOS = null;
    this.timeout = 500;
    this.countOVOS = 30;
    this.ovosBu = this.countOVOS * 0.2;
    this.countOvosMaCreated = 0;
    this.countOvosBuCreated = 0;
    this.pausedGame = false;
    this.endedGame = false;
    this.colliders = [];
    this.raycaster = new THREE.Raycaster();
    this.idListener = 0;

    //Luz ambiental de la escena
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    this.add(this.ambientLight);

    //Luces focales de la escena
    this.sceneSpotlight = new Light(0xffffff, 0.6, new THREE.Vector3(-150, 300, 400));
    this.add(this.sceneSpotlight);
    this.sceneSpotlight2 = new Light(0xffffff, 0.3, new THREE.Vector3(150, 100, -400));
    this.add(this.sceneSpotlight2);

    //Objeto que representa la superficie
    var loader = new THREE.TextureLoader();
    var gameCourtTexture = loader.load(metalImg);
    this.gameCourt = new GameCourt(
      this.gameCourtWidth,
      this.gameCourtLength,
      new THREE.MeshPhongMaterial( {map:gameCourtTexture} )
    );
    this.add(this.gameCourt);

    //Camara de tercera persona (perspectiva)
    this.createThirdPersonCamera(renderer);
    this.add(this.thirdPersonCamera);
    this.activeCamera = 'TPC';

    //Añadimos el objeto R2D2
    this.robot = new R2D2(20,14,new THREE.Vector3(0,0,(-this.gameCourtLength/2)+20));
    this.add(this.robot);

    //Creamos la camara de primera persona
    this.createFirstPersonCamera();
    this.robot.head.add(this.firstPersonCamera);

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
  createThirdPersonCamera (renderer) {
    var lookAt = new THREE.Vector3(0, 50, -this.gameCourtLength/3);
    this.thirdPersonCamera = new Camera(75, window.innerWidth/window.innerHeight,1, 1000, new THREE.Vector3(0,300,-this.gameCourtLength),lookAt);
    this.trackballControls = new TrackballControls(this.thirdPersonCamera.camera, renderer);
    this.trackballControls.minDistance = 25;
    this.trackballControls.maxDistance = 250;
    this.trackballControls.rotateSpeed = 2;
    this.trackballControls.zoomSpeed = 2;
    this.trackballControls.panSpeed = 0.25;
    this.trackballControls.target = lookAt;
  }

  createFirstPersonCamera(){
    var lookAt = new THREE.Vector3(0, this.robot.totalHeight-this.robot.bodyWidth*2,this.robot.bodyWidth*2);
    this.firstPersonCamera = new Camera(
      75,
      window.innerWidth/window.innerHeight,
      1,
      1000,
      new THREE.Vector3(0, this.robot.totalHeight-this.robot.bodyWidth*2, this.robot.bodyWidth/2),
      lookAt
    );
  }

  createOvo(){
    if(this.countOvosMaCreated+this.countOvosBuCreated < this.countOVOS){
      var objectType =  'OvoMa';
      if(this.countOvosBuCreated < this.ovosBu)
        objectType = Math.random() <= 0.2 ? 'OvoBu':'OvoMa';

      if(this.countOvosBuCreated < this.ovosBu && this.countOVOS-(this.countOvosMaCreated+this.countOvosBuCreated) <= this.ovosBu)
        objectType = 'OvoBu';

      objectType == 'OvoBu' ? this.countOvosBuCreated+=1 : this.countOvosMaCreated+=1;
      var newOVO = new OVO(
        objectType, 
        -(this.gameCourtWidth/2), 
        (this.gameCourtWidth), 
        (this.gameCourtLength/2)-10, 
        this.gameCourtLength/2,
        -(this.gameCourtLength/2)
      );
      this.OVOS.add(newOVO);
      this.colliders.push(newOVO.OVO);
    }
  }

  /**
   * Devuelve un objeto Camera para ser utilizado por el renderer
   */
  getActiveCamera(){
    if(this.activeCamera == 'TPC')
      return this.thirdPersonCamera.getCamera();
    else
      return this.firstPersonCamera.getCamera();
  }

  changeActiveCamera(){
    this.activeCamera = (this.activeCamera == 'TPC'? 'FPC': 'TPC');
  }

  pauseGame(){
    if(this.pausedGame){
      this.pausedGame = false;
      document.getElementById('juego-en-pausa').style.display = 'none';
    } else {
      this.pausedGame = true;
      document.getElementById('juego-en-pausa').style.display = 'initial';
    }
  }

  endGame(){
    this.pauseGame();
    this.endedGame = true;
    document.getElementById('juego-en-pausa').textContent = 'JUEGO TERMINADO';
  }

  animateOVOS(){
    this.OVOS.children.forEach(function(ovo){
      ovo.animate();
    })
  }

  animate(){
    if(!this.pausedGame){
      if (this.activeCamera == 'TPC')
        this.trackballControls.update();
      this.animateOVOS();
      this.searchCollisions();
      if((this.robot.energy <= 0) || (!this.checkRobotInsideCourt()))
        this.endGame();
      document.getElementById('energia').textContent = this.robot.energy;
      if(this.robot.energy >= 50)
        document.getElementById('barra-energia').style.backgroundColor = 'green';
      else if(this.robot.energy < 50 && this.robot.energy >= 30)
        document.getElementById('barra-energia').style.backgroundColor = 'orange';
      else //if(this.robot.energy <= 30)
        document.getElementById('barra-energia').style.backgroundColor = 'red';
    }
  }

  checkRobotInsideCourt(){
    return (
      (this.robot.position.x >= -(this.gameCourtWidth/2))
      && (this.robot.position.x <= (this.gameCourtWidth/2))
      && (this.robot.position.z >= -(this.gameCourtLength/2))
      && (this.robot.position.z <= (this.gameCourtLength/2))
    );
  }

  computeKey(event) {
    this.robot.updateMatrixWorld();
    this.robot.computeKey(event);
  }

  searchCollisions(){
    //A partir de que tengamos al menos un objeto colisionable, buscamos
    //el espacio cercano al robot en busca de posibles colisiones
    if (this.colliders.length > 1) {

      //Obtenemos el punto de origen del cuerpo del robot
      var origin = new THREE.Vector3().setFromMatrixPosition(this.robot.body.matrixWorld);
      var finished = false;

      //Para cada vertice del cuerpo del robot, trazamos un rayo desde el punto de origen
      //con direccion el vertice seleccionado, de longitud el ancho del cuerpo
      for (var i = 0; !finished && i < this.robot.body.geometry.vertices.length; i++) {

        var localVertex = this.robot.body.geometry.vertices[i].clone();
        var globalVertex = localVertex.applyMatrix4(this.robot.body.matrix);
        var directionVector = globalVertex.sub(this.robot.body.position);
        var ray = new THREE.Raycaster(origin, directionVector.clone().normalize());
        var collisionResults = ray.intersectObjects(this.colliders);

        if (collisionResults.length > 0 && collisionResults[0].distance < (1+this.robot.bodyWidth/2)
           && !(collisionResults[0].object.parent.haColisionado)) {
          finished = true;
          //this.colliders.splice(this.colliders.indexOf(collisionResults[0].object), 1);
          collisionResults[0].object.parent.haColisionado = true;
          this.robot.handleCollision(collisionResults[0].object.parent.tipoObjeto);
        }
      }
    }
  }
}