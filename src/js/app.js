import * as THREE from 'three';
import Scene from './app/Scene'

function createRenderer(){

  var renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(new THREE.Color(0xD2FAF9),1.0); //background color
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

