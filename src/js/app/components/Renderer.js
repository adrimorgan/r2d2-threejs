import * as THREE from 'three';

export default class Renderer extends THREE.WebGLRenderer {

  constructor(){
    super();
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setClearColor(new THREE.Color(0xEEEEEE), 1.0);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.add(this.renderer);
  }

  render(){
    super.render();
  }

}
