import * as THREE from 'three';

export default class Camera extends THREE.Camera {

  constructor(){
    super();
    this.camera = new THREE.PerspectiveCamera(
      fov = 45,
      aspect = window.innerWidth / window.innerHeight,
      near = 0.1,
      far = 1000
    );
    this.camera.lookAt(new THREE.Vector3(0, 20, 0));
    this.add(this.camera);
  }

}
