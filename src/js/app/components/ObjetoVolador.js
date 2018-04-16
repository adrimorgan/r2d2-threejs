import * as THREE from 'three';
import GreenTexture from '../../../public/assets/images/green.jpg';
import RedTexture from '../../../public/assets/images/lava.jpg';

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
    constructor(tipoObjeto, minX, maxX, minZ, maxZ, finalTablero, radioEsfera=6){
        super();
        this.tipoObjeto = tipoObjeto;
        this.radioEsfera = radioEsfera;
        this.finalTablero = finalTablero;
        this.minX = minX;
        this.maxX = maxX;
        this.minZ = minZ;
        this.maxZ = maxZ;
        this.cteDificultad = 1;
        this.castShadow = true;

        var loader = new THREE.TextureLoader();
        this.textura = (this.tipoObjeto == 'OvoBu') ? 
            loader.load(GreenTexture) : 
            loader.load(RedTexture);
        this.OVO = new THREE.Mesh(
            new THREE.SphereGeometry(radioEsfera, 16, 16),
            new THREE.MeshPhongMaterial({ map: this.textura })
        );

        this.OVO.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, this.radioEsfera + 15, 0));
        this.ubicarAleatoriamente();
        this.add(this.OVO);
    }

    ubicarAleatoriamente(){
        this.OVO.position.x = Math.floor(this.minX + Math.random() * this.maxX);
        this.OVO.position.z = Math.floor(this.minZ + Math.random() * (this.maxZ-this.minZ));
        this.velocidad = this.cteDificultad + Math.random() * 2;
        this.haColisionado = false;
    }

    animate(hardnessMode){
        // si ha cambiado la dificultad, se incrementa la velocidad
        if(hardnessMode != 0)
            this.cteDificultad = hardnessMode;

        // se reubica el OVO al principio del tablero (quizás con nueva
        // dificultad)
        if (this.OVO.position.z > this.finalTablero)
            this.OVO.position.z -= this.velocidad;
        else
            this.ubicarAleatoriamente();
    }
}