import * as THREE from 'three'


/**
 * Clase ObjetoVolador: representa un objeto volador de la escena.
 * Este objeto tendrá un tipo (OvoBu u OvoMa), un color representativo,
 * una velocidad de movimiento y una posicion inicial donde se crea el objeto
 */
export default class ObjetoVolador extends THREE.Object3D{


    /**
     * Constructor de la clase
     * @param tipoObjeto cadena OvoBu u OvoMa
     * @param velocidad velocidad de movimiento entre 0 y 1
     * @param posicionInicial posicion (x,y,z) desde la que parte
     */
    constructor(tipoObjeto, velocidad, posicionInicial, radioEsfera= 3){
        super();

        this.OVO = null;
        this.radioEsfera = radioEsfera;
        this.tipoObjeto = tipoObjeto;
        this.color = this.tipoObjeto == 'OvoBu' ? 0x00ff00 : 0xff0000;
        this.velocidad = velocidad;
        this.posicionInicial = posicionInicial;
        this.OVO = new THREE.Mesh(
            new THREE.SphereGeometry(radioEsfera,32,32),
            new THREE.MeshPhongMaterial({color: this.color, specular: this.color, shininess : 0.8})
        );

        this.OVO.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0,this.radioEsfera,0));
        this.OVO.position.x = this.posicionInicial.x;
        this.OVO.position.z = this.posicionInicial.z;
        this.add(this.OVO);

    }

    animate(){
        this.OVO.position.z -= this.velocidad;
    }

}