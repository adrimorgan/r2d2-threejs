import * as THREE from 'three';
import $ from 'jquery';
import Scene from './app/Scene';


function createRenderer(){
  var renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
  renderer.setClearColor(new THREE.Color(0x000000), 0); //background color
  renderer.setSize( window.innerWidth-50, window.innerHeight-200);
  renderer.shadowMap.enabled = true;
  document.body.appendChild( renderer.domElement );
  return renderer;
}

function render () {
  requestAnimationFrame( render );
  renderer.render(scene, scene.getActiveCamera());
  if(!scene.endedGame)
    scene.animate();
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
render();

$(function() {
  var idListener = window.addEventListener('keydown', computeKey);
  scene.idListener = idListener;
});
