import * as THREE from 'three';
import $ from 'jquery';
import dat from 'dat.gui';
import Scene from './app/Scene';

var GUIcontrols = null;

/**
 * Funcion que crea la interfaz grafica para controlar
 * los grados de libertad del robot
 */
function createGUI(){
  GUIcontrols = new function() {
    this.headRotation = 0;
    this.bodyRotation = 0;
    this.armsLength = 100;
  }

  //Elementos de la GUI para controlar los grados de libertad
  //del robot
  var gui = new dat.GUI();
  var headRotationFolder = gui.addFolder('Rotación cabeza');
  headRotationFolder.add(GUIcontrols, 'headRotation', -80, 80, 1).name('Valor:');
  var bodyRotationFolder = gui.addFolder('Rotación cuerpo');
  bodyRotationFolder.add(GUIcontrols, 'bodyRotation', -45, 30, 1).name('Valor:');
  var armsLengthFolder = gui.addFolder('Longitud brazos');
  armsLengthFolder.add(GUIcontrols, 'armsLength', 100, 120, 1).name('Valor:');
}

/**
 * Funcion para crear el renderer de la escena
 * @returns {WebGLRenderer}
 */
function createRenderer(){
  var renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
  renderer.setClearColor(new THREE.Color(0x000000), 0); //color de fondo
  renderer.setSize( window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  document.body.appendChild( renderer.domElement );
  return renderer;
}

/**
 * Funcion que ejecuta el bucle de renderizado
 * de la escena y la camara activa en ese momento
 */
function render () {
  requestAnimationFrame( render );
  renderer.render(scene, scene.getActiveCamera());
  if(!scene.endedGame)
    scene.animate(GUIcontrols);
}

/**
 * Funcion que controla los eventos
 * de teclado. Permite cambiar la camara
 * de la escena, pausar el juego y mover
 * el robot.
 * @param event
 */
function computeKey(event){
  if(event.code == 'KeyV')
    scene.changeActiveCamera();
  else if(event.code == 'Space' && !scene.endedGame) //barra espaciadora
    scene.pauseGame();
  else if(!scene.pausedGame)
    scene.computeKey(event);
}

/**
 * Funcion de creacion de objetos voladores.
 * Se crearán mientras el juego siga en ejecucion
 * o no se hayan creado todos
 */
function createOvo(){
  if(!scene.pausedGame && !scene.endedGame)
    scene.createOvo();
  if(scene.countOvosBuCreated + scene.countOvosMaCreated >= scene.countOVOS)
    window.clearInterval(intervalo);
}

var renderer = createRenderer();
var scene = new Scene(renderer.domElement);
var intervalo = window.setInterval(createOvo, scene.timeout);
createGUI();
render();

$(function() {
  var idListener = window.addEventListener('keydown', computeKey);
  scene.idListener = idListener;
});
