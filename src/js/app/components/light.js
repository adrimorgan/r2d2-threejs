import * as THREE from 'three';
import Config from '../config';

export default class Light {

  constructor(scene){
    this.scene = scene;
    this.init();
  }

  init(){
    // ambient light
    this.ambientLight = new THREE.AmbientLight(Config.ambientLight.color);
    this.ambientLight.visible = Config.ambientLight.enabled;
    this.scene.add(this.ambientLight);
  }

}
