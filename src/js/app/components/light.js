import * as THREE from 'three';

export default class Light {

  constructor(type){
    super();
    switch (type) {
      case 'spot':
        this.light = new THREE.SpotLight(0xffffff);
        this.light.position.set(
          x = 60,
          y = 60,
          z = 40
        );
        this.light.castShadow = true;
        this.light.shadow.mapSize.width = 2048;
        this.light.shadow.mapSize.height = 2048;
        break;
    
      default: //ambient
        this.light = new THREE.AmbientLight(
          color = 0xccddee,
          intensity = 0.35
        );
        break;
    }
    this.add(this.light);
  }

}
