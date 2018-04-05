import * as THREE from 'three';
import Config from '../config';

export default class Renderer{

  constructor(scene, canvas){
    this.scene = scene;
    this.canvas = canvas;
    this.threeRenderer = new THREE.WebGLRenderer({antialias: true});
    canvas.appendChild(this.threeRenderer.domElement);
    this.updateSize();
    document.addEventListener('DOMContentLoaded', () => this.updateSize(), false);
    window.addEventListener('resize', () => this.updateSize(), false);
  }

  updateSize(){
    this.threeRenderer.setSize(this.canvas.offsetWidth, this.canvas.offsetHeight);
  }

  render(scene, camera){
    this.threeRenderer.render(scene, camera);
  }

}
