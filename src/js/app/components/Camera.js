import * as THREE from 'three';

export default class Camera extends THREE.Camera {

  constructor(fov=75,aspect=window.innerWidth/window.innerHeight,near = 1,far=1000, position, lookAt){
    super();
    this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    position = (position === undefined? new THREE.Vector3(60,30,60) : position);
    this.camera.position.set (position.x,position.y, position.z);
    lookAt = (lookAt === undefined? new THREE.Vector3(0,20,0) : lookAt);
    this.camera.lookAt(lookAt.x,lookAt.y,lookAt.z);
    this.add(this.camera);
  }

  setTarget(target){
    this.camera.target = target;
  }

  getCamera(){
    return this.camera;
  }
}
