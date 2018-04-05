/**
  * @author Arthur & Adrián
  * @version 0.1
  */

// Para representar una escena con Three.JS necesitamos tres elementos: escena, cámara y render.
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set(60, 30, 60);
var look = new THREE.Vector3(0, 20, 0);
camera.lookAt(look);
var renderer = new THREE.WebGLRenderer();

// renderizamos la app entera, podemos usar la mitad si necesitamos más rendimiento
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var r2d2 = new R2D2({});
scene.add(r2d2);

function animate(){
  requestAnimationFrame(animate);
  // r2d2.rotation.x += 0.05;
  // r2d2.rotation.y += 0.1;
  renderer.render(scene, camera);
}
animate();
