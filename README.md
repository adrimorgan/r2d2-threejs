# r2d2-threejs

Se trata de un juego realizado en JavaScript con la librería para gráficos 
en 3D Three.JS. Consiste en un juego sencillo de plataformas donde el 
usuario controla a un personaje con una apariencia similar (que no copiada) 
al personaje R2D2 de Star Wars.

Se basa en esquivar las bolas dañinas (con textura roja) que restan vida, e 
intentar recoger las verdes, que suman energía y puntos. La partida finaliza 
cuando la energía llega a 0, o el personaje sale de los límites.

## Modus operandi

```bash
$ npm install
$ npm run dev
```

`npm run dev` crea un servidor local en `localhost:8080` para reproducir el 
juego. Con el modo `npm run build` se espera *(help-wanted)* generar un 
archivo HTML con 
todo el código que permita alojar de forma remota el juego en Github Pages.
