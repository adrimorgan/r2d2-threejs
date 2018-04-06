import * as THREE from 'three';
import Camera from './components/camera';
import Light from './components/light';
import Ground from './components/ground';
//import {MetallicImage} from '../../public/assets/img/metallic.jpg';

export default class Scene extends THREE.Scene {

  constructor(renderer){
    super();

    // cámara en perspectiva
    this.camera = new Camera();
    this.add(this.camera);

    // luz ambiental
    this.ambientLight = new Light('ambient');
    this.add(this.ambientLight);

    // modelo suelo
    this.ground = new Ground(
      width = 300,
      material = new THREE.MeshPhongMaterial(
        { map: new THREE.TextureLoader().load('../../public/assets/img/metallic.jpg') }
      ),
      boxSize = 4
    );
    this.add(this.ground);

    // modelo r2d2
    //this.r2d2 = new R2D2(...);
    //this.add(this.r2d2);
  }
}