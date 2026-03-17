import { $, $$ } from './dom.js';
import { state } from './status.js';


export function setupTools() {
    console.log("Herramientas listas");


const btn_lapiz = $("#lapiz");
const btn_borrador = $("#borrador");
const btn_rellenar = $("#rellenar");
const btn_gotero = $("#gotero");


let herramientas = {
  lapiz: true,
  borrador: false,
  rellenar: false,
  gotero: false,
};

function quitarSelecionHerramienta() {
  for (let elemento in herramientas) {
    herramientas[elemento] = false;
  }
}

btn_lapiz.addEventListener("click", () => {
  quitarSelecionHerramienta();

  herramientas.lapiz = true;
});

btn_borrador.addEventListener("click", () => {
  quitarSelecionHerramienta();

  herramientas.borrador = true;
});

btn_rellenar.addEventListener("click", () => {
  quitarSelecionHerramienta();
  herramientas.rellenar = true;
});

btn_gotero.addEventListener("click", (e) =>{
    quitarSelecionHerramienta();
    herramientas.gotero = true;

  })

//--sacar datos de posicion y dibuo y borrado de celdas---------------------------------------------------------------------------------------------

let mousePresionando = false;

function sacarDatos(e) {
  const rect = state.canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  let celdaX = Math.floor(x / state.cellSize);
  let celdaY = Math.floor(y / state.cellSize);

  if (celdaX < 0 || celdaY < 0) return;
  if (celdaX >= state.canvas.width / state.cellSize) return;
  if (celdaY >= state.canvas.height / state.cellSize) return;

  return { celdaX, celdaY };
}

// Lapiz --------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------

let colorDibujado = "#000";

function moverLapiz(e) {
  // funcion de dibular al esta activo el dibujando

  if (e.buttons === 1) {
    if (mousePresionando === true && herramientas.lapiz === true) {
      let datosCeldas = sacarDatos(e);
      if (!datosCeldas) return;

      state.canvas_ctx.fillStyle = `${colorDibujado}`;

      state.canvas_ctx.fillRect(
        datosCeldas.celdaX * state.cellSize,
        datosCeldas.celdaY * state.cellSize,
        state.cellSize,
        state.cellSize,
      );

      state.matriz[datosCeldas.celdaY][datosCeldas.celdaX] = colorDibujado;
    }
  }

  if (e.buttons & 2) moverBorrador(e);
}

// borrador---------------------------------------------------------
// ------------------------------------------------------------------
// -----------------------------------------------------------------

function borrado(datosCeldas) {
  state.canvas_ctx.clearRect(
    datosCeldas.celdaX * state.cellSize,
    datosCeldas.celdaY * state.cellSize,
    state.cellSize,
    state.cellSize,
  );
}

function moverBorrador(e) {
  // funcion de dibular al esta activo el dibujando

  if (!mousePresionando) return;

  let datosCeldas = sacarDatos(e);

  if (herramientas.borrador && e.buttons === 1) {
    if (!datosCeldas) return;

    borrado(datosCeldas);

    state.matriz[datosCeldas.celdaY][datosCeldas.celdaX] = null;
  }

  if (herramientas.lapiz && e.buttons === 2) {
    borrado(datosCeldas);

    state.matriz[datosCeldas.celdaY][datosCeldas.celdaX] = null;
  }
}

//----herramientoa de inció Canvas-------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------

state.canvas.addEventListener("contextmenu", (e) => {
  e.preventDefault();
});

state.canvas.addEventListener("mousedown", (e) => {
  if (
    herramientas.borrador === true ||
    herramientas.lapiz === true ||
    herramientas.rellenar === true ||
    herramientas.gotero === true
  ) {
    mousePresionando = true;

    if (herramientas.borrador) moverBorrador(e);

    if (herramientas.lapiz) moverLapiz(e);

    if (herramientas.rellenar) rellenar(e);

    if (herramientas.gotero) gotero(e);
  }
});

//-mover lapiz y borrador----------------------------------------------------------------------------

function manejarDibujo(e) {
  if (mousePresionando === false) return;

  if (herramientas.lapiz) moverLapiz(e);
  else if (herramientas.borrador) moverBorrador(e);
}

state.canvas.addEventListener("mousemove", manejarDibujo);

// desactivar mouse presionado para las herramientas

state.canvas.addEventListener("mouseup", () => {
  mousePresionando = false;
});

// Cambiar Color Lapiz---------------------------------------------------

const color = $("#colorLapiz");

color.addEventListener("change", () => {
  colorDibujado = color.value;

  guardarColor(color.value)

  
});

//rellenar -------------------------------------------------------------------------------------

let columnas = parseInt(state.CantidadDeCuadros.value);
let filas = columnas;

state.matriz = Array.from({ length: filas }, () => Array(columnas).fill(null));

function rellenarBase(fila, columna, colorOriginal, colorNuevo) {

  if (fila < 0 || fila >= state.filas || columna < 0 || columna >= state.columnas) return;

  if (state.matriz[fila][columna] !== colorOriginal) return;

  state.matriz[fila][columna] = colorNuevo;

  state.canvas_ctx.fillStyle = colorNuevo;
  state.canvas_ctx.fillRect(
    columna * state.cellSize,
    fila * state.cellSize,
    state.cellSize,
    state.cellSize
  );

  rellenarBase(fila + 1, columna, colorOriginal, colorNuevo);
  rellenarBase(fila - 1, columna, colorOriginal, colorNuevo);
  rellenarBase(fila, columna + 1, colorOriginal, colorNuevo);
  rellenarBase(fila, columna - 1, colorOriginal, colorNuevo);
}


function rellenar(e) {
  const datos = sacarDatos(e);
  if (!datos) return;

  const fila = datos.celdaY;
  const columna = datos.celdaX;

  const colorOriginal = state.matriz[fila][columna];     
  const colorNuevo = colorDibujado;

  if (colorOriginal === colorNuevo) return;

  rellenarBase(fila, columna, colorOriginal, colorNuevo);
}



  // funcion de guardado de colores en el menu de colores

  function guardarColor(color_a_guardar){
    state.paleta.push(color_a_guardar)
    renderColores(state.paleta)
  }

  function renderColores(){
    const menuColores = $("#menuColores")

    menuColores.innerHTML = "";

    state.paleta.forEach (colorAgregar =>{
      const boton = document.createElement("button");
      boton.style.background = colorAgregar;
      boton.style.width =  30 + "px";
      boton.style.height = 30 + "px";
      boton.className = "color-boton";
      boton.dataset.color = colorAgregar;

      boton.addEventListener("click", () =>{
      colorDibujado = boton.dataset.color;
      btn_cambiarcolor(colorDibujado)

      })

      menuColores.appendChild(boton);


    })

  }

    //GOTERO

  function gotero(e){

      
  if (!mousePresionando) return;

  let datosCeldas = sacarDatos(e);

  if (herramientas.gotero && e.buttons === 1) {
    if (!datosCeldas) return;


   colorDibujado = state.matriz[datosCeldas.celdaY][datosCeldas.celdaX];

   quitarSelecionHerramienta();

   herramientas.lapiz = true;

  
  }
  btn_cambiarcolor(colorDibujado)

  

}


    // funcion cambiar de color al boton de colores

function btn_cambiarcolor(e){
  color.value = `${e}`;
  console.log(e);

}


}

