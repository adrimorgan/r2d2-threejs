import Scene from './app/scene';

// Lee el objeto lienzo del HTML, crea la escena en él y lanza el programa
function run() {
  var canvas = document.getElementById('canvas');
  new Scene(canvas);
}

run();
