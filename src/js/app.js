import * as THREE from 'three';
import Scene from './app/scene';

function createRenderer(){
  var renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(new THREE.Color(0x000000),1.0); //background color
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

var renderer = createRenderer();
var scene = new Scene(renderer.domElement);

render();
