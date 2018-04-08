import * as THREE from 'three';

export default class Camera extends THREE.Camera {

  constructor(){
    super();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set (60, 30, 60);
    this.camera.lookAt(new THREE.Vector3(0, 20, 0));
    this.add(this.camera);
  }

}
