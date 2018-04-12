import * as THREE from 'three';
import $ from 'jquery';
import Scene from './app/Scene';
import Light from './app/components/Light'


function createRenderer(){
  var renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
  renderer.setClearColor(new THREE.Color(0x000000), 0); //background color
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.shadowMap.enabled = true;
  document.body.appendChild( renderer.domElement );
  return renderer;
}

function render () {
  requestAnimationFrame( render );
  renderer.render(scene, scene.getCamera());
  scene.animate();
}

function computeKey(event){
  scene.computeKey(event);
}

function createOvos(){
  scene.createOvo();

  if(scene.countOvosBuCreated + scene.countOvosMaCreated >= scene.countOVOS){
        console.log('OUT!!!');
        window.clearInterval(intervalo);
    }
}

var renderer = createRenderer();
var scene = new Scene(renderer.domElement);
var intervalo = window.setInterval(createOvos,scene.timeout);
render();

$(function() {
  window.addEventListener('keydown', computeKey);
});
