import { $, $$ } from './dom.js';

export function initUI() {
    console.log("UI lista");

    
// arrastre de menu de herramientas

const contenedorMenus = $$(".contenedorMenus");

const arrastreMenu = $$(".arrastre");

let contenedorActivo = null;


//arrastre activo

let arrastreActivo = false;

// funcion de movimiento

function moverCaja(
  posicionInicialX,
  posicionInicialY,
  desplazamientoX,
  desplazamientoY,
) {
  let nuevaPosicionX = posicionInicialX + desplazamientoX;
  let nuevaPosicionY = posicionInicialY + desplazamientoY;

  const limiteX = window.innerWidth - contenedorActivo.offsetWidth;
  const limiteY = window.innerHeight - contenedorActivo.offsetHeight;

  nuevaPosicionX = Math.max(0, Math.min(nuevaPosicionX, limiteX));
  nuevaPosicionY = Math.max(0, Math.min(nuevaPosicionY, limiteY));

  contenedorActivo.style.top = nuevaPosicionY + "px";
  contenedorActivo.style.left = nuevaPosicionX + "px";
}

// posision y movimiento del mouse

function sacarPosiciondelMouse(
  mouseInicialX,
  mouseInicialY,
  mouseActualX,
  mouseActualY,
) {
  let desplazamientoX = mouseActualX - mouseInicialX;
  let desplazamientoY = mouseActualY - mouseInicialY;

  return { desplazamientoX, desplazamientoY };
}

//evento de movimiento

function eventoMoverCaja(e) {
  if (arrastreActivo === true) {
    let mouseActualX = e.clientX;
    let mouseActualY = e.clientY;

    let desplazar = sacarPosiciondelMouse(
      GuardadoDeMovimientos.mouseInicialX,
      GuardadoDeMovimientos.mouseInicialY,
      mouseActualX,
      mouseActualY,
    );

    moverCaja(
      GuardadoDeMovimientos.posicionInicialX,
      GuardadoDeMovimientos.posicionInicialY,
      desplazar.desplazamientoX,
      desplazar.desplazamientoY,
    );
  }
}

// funcion dejar de mover----------------------------

function dejarDeArrastar() {
  arrastreActivo = false;
  contenedorActivo = null;
  console.log("soltando");

  document.removeEventListener("mousemove", eventoMoverCaja);
  window.removeEventListener("mouseup", dejarDeArrastar);
}

//-------------------------------------------

let GuardadoDeMovimientos = {};

// evento incial de arrastre

arrastreMenu.forEach(arrastre => {
arrastre.addEventListener("mousedown", (e) => {
  e.preventDefault();
 
  contenedorActivo = arrastre.closest(".contenedorMenus")

  GuardadoDeMovimientos.mouseInicialX = e.clientX;

  GuardadoDeMovimientos.mouseInicialY = e.clientY;

  GuardadoDeMovimientos.posicionInicialX = contenedorActivo.offsetLeft;
  GuardadoDeMovimientos.posicionInicialY = contenedorActivo.offsetTop;

  console.log("estoy arrastrando");

  arrastreActivo = true;

  document.addEventListener("mousemove", eventoMoverCaja);
  window.addEventListener("mouseup", dejarDeArrastar);
})

});

}