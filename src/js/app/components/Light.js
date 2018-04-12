import * as THREE from 'three';

/**
 * Clase Light: wrapper que permite crear luces ambientales
 * y focales en funcion de parametros como el tipo,
 * color de luz, intensidad y posicion. Ademas permite
 * controlar el objetivo al que apunta, el angulo de vision
 * y la distancia focal.
 */
export default class Light extends THREE.Light{

    /**
     * Constructor de la clase
     * @param lightType Tipo de luz: 'spot' para focal, por defecto ambiental
     * @param color Color de la luz en valor hexadecimal 0x------
     * @param intensity Intensidad de la luz entre 0 y 1
     * @param position Posicion en coordenadas del mundo
     */
  constructor(lightType, color = 0xffffff, intensity = 0.85, position){
    super();

    switch (lightType) {
      case 'spot':
        this.light = new THREE.SpotLight(color);
        position = (position === undefined ? new THREE.Vector3(0,15,20) : position);
        this.light.position.set(position.x,position.y, position.z);
        this.light.castShadow = true;
        this.light.shadow.mapSize.width = 1024;
        this.light.shadow.mapSize.height = 1024;
        this.light.intensity = intensity;
        break;

      //Por defecto crea una luz ambiental
      default:
        this.light = new THREE.AmbientLight({color:color, intensity:intensity});
        break;
      }
    this.add(this.light);
  }

  setParameters(target, angle, distance){

    this.light.add(target);
    this.light.target = target;
    this.light.angle = angle;
    this.light.distance = distance

  }

}
