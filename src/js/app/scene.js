// global imports
import * as THREE from 'three';
import DatGUI from 'dat.gui';

// local imports
import Camera from './components/camera';
import Light from './components/light';
import Renderer from './components/renderer';

export default class Scene {

  constructor(canvas){
    this.canvas = canvas;
    this.scene = new THREE.Scene();
    this.renderer = new Renderer(this.scene, canvas);
    this.camera = new Camera(this.renderer.threeRenderer);
    this.light = new Light(this.scene);
  }

  render(){
    this.renderer.render(this.scene, this.camera.threeCamera);
    requestAnimationFrame(this.render.bind(this));
  }

}
