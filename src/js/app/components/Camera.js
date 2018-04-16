import * as THREE from 'three';

/**
 * Clase Camera: permite crear camaras en perspectiva
 * para utilizar tanto en la escena como en elementos
 * individuales
 */

export default class Camera extends THREE.Camera {

    /**
     * Constructor de la clase
     * @param fov angulo de vision en grados
     * @param aspect anchura entre altura de la ventana
     * @param near plano de renderizado cercano
     * @param far plano de renderizado lejano
     * @param position (x,y,z) indicando la posicion de la camara
     * @param lookAt elemento al que mira
     */
  constructor(fov=75,aspect=window.innerWidth/window.innerHeight,near = 1,far=1000, position, lookAt){
    super();
    this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    position = (position === undefined? new THREE.Vector3(60,30,60) : position);
    this.camera.position.set (position.x,position.y, position.z);
    lookAt = (lookAt === undefined? new THREE.Vector3(0,20,0) : lookAt);
    this.camera.lookAt(lookAt.x,lookAt.y,lookAt.z);
    this.add(this.camera);
  }

    /**
     * Setter del objetivo de la camara
     * @param target objetivo de la camara
     */
  setTarget(target){
    this.camera.target = target;
  }

    /**
     * Getter de la camara
     * @returns {THREE.PerspectiveCamera|PerspectiveCamera}
     */
  getCamera(){
    return this.camera;
  }
}
