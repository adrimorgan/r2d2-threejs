import * as THREE from 'three';
import $ from 'jquery';
import dat from 'dat.gui';
import Scene from './app/Scene';

var GUIcontrols = null;

function createGUI(){
  GUIcontrols = new function() {
    this.headRotation = 0;
    this.bodyRotation = 0;
    this.armsLength = 100;
  }

  var gui = new dat.GUI();
  var headRotationFolder = gui.addFolder('Rotación cabeza');
  headRotationFolder.add(GUIcontrols, 'headRotation', -80, 80, 1).name('Valor:');
  var bodyRotationFolder = gui.addFolder('Rotación cuerpo');
  bodyRotationFolder.add(GUIcontrols, 'bodyRotation', -45, 30, 1).name('Valor:');
  var armsLengthFolder = gui.addFolder('Longitud brazos');
  armsLengthFolder.add(GUIcontrols, 'armsLength', 100, 120, 1).name('Valor:');
}

function createRenderer(){
  var renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
  renderer.setClearColor(new THREE.Color(0x000000), 0); //background color
  renderer.setSize( window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  document.body.appendChild( renderer.domElement );
  return renderer;
}

function render () {
  requestAnimationFrame( render );
  renderer.render(scene, scene.getActiveCamera());
  if(!scene.endedGame)
    scene.animate(GUIcontrols);
}

function computeKey(event){
  if(event.code == 'KeyV')
    scene.changeActiveCamera();
  else if(event.code == 'Space' && !scene.endedGame) //barra espaciadora
    scene.pauseGame();
  else if(!scene.pausedGame)
    scene.computeKey(event);
}

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
