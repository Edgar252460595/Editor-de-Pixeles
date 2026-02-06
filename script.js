// acortar condigo con Bind

const $ = document.querySelector.bind(document);

const $$ = document.querySelectorAll.bind(document);

//-- funcion de dibujar cuadriculas------------------------------------------------------------------

const canvas = $("#EspacioDeCanvas");
const gridCanvas = $("#gridCanvas");

const canvas_ctx = canvas.getContext("2d");
const grid_ctx = gridCanvas.getContext("2d");

const CantidadDeCuadros = $("#CantidadDeCuadros");
let cellSize = canvas.width / parseInt(CantidadDeCuadros.value);

CantidadDeCuadros.addEventListener("change", () => {
  cellSize = canvas.width / parseInt(CantidadDeCuadros.value);
  DibujarCeldas();
  columnas = parseInt(CantidadDeCuadros.value);
  filas = columnas;

  matriz = Array.from({ length: filas }, () => Array(columnas).fill(null));

  console.log(cellSize);
});

//--funcion de dibujo de celdas------------------------------------------------------------------

function limpiarCanvas() {
  canvas_ctx.clearRect(0, 0, canvas.width, canvas.height);
  grid_ctx.clearRect(0, 0, gridCanvas.width, gridCanvas.height);

  canvas_ctx.beginPath();
  grid_ctx.beginPath();
}

function DibujarCeldas() {
  limpiarCanvas();

  grid_ctx.beginPath();

  const gridSize = canvas.width / cellSize;

  for (let i = 0; i < gridSize; i++) {
    grid_ctx.moveTo(i * cellSize, 0);
    grid_ctx.lineTo(i * cellSize, canvas.height);

    grid_ctx.moveTo(0, i * cellSize);
    grid_ctx.lineTo(canvas.width, i * cellSize);
  }
  grid_ctx.strokeStyle = "#ccc";
  grid_ctx.stroke();
}

//--------------------------------------------------------------------

// pre cargar canva

DibujarCeldas();

//---Oculatar grillas----------------------------------------------------------------------------------------------------
const btn_OcultarGrillas = $("#btn_QuitarGrillas");

btn_OcultarGrillas.addEventListener("click", () => {
  gridCanvas.classList.toggle("ocultar");
});

//-------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------

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

//-----------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------
//--herramientas---------------------------------------------------------------------------------------------

const btn_lapiz = $("#lapiz");
const btn_borrador = $("#borrador");
const btn_rellenar = $("#rellenar");

let herramientas = {
  lapiz: true,
  borrador: false,
  rellenar: false,
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

//--sacar datos de posicion y dibuo y borrado de celdas---------------------------------------------------------------------------------------------

let mousePresionando = false;

function sacarDatos(e) {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  let celdaX = Math.floor(x / cellSize);
  let celdaY = Math.floor(y / cellSize);

  if (celdaX < 0 || celdaY < 0) return;
  if (celdaX >= canvas.width / cellSize) return;
  if (celdaY >= canvas.height / cellSize) return;

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

      canvas_ctx.fillStyle = `${colorDibujado}`;

      canvas_ctx.fillRect(
        datosCeldas.celdaX * cellSize,
        datosCeldas.celdaY * cellSize,
        cellSize,
        cellSize,
      );

      matriz[datosCeldas.celdaY][datosCeldas.celdaX] = colorDibujado;
    }
  }

  if (e.buttons & 2) moverBorrador(e);
}

// borrador---------------------------------------------------------
// ------------------------------------------------------------------
// -----------------------------------------------------------------

function borrado(datosCeldas) {
  canvas_ctx.clearRect(
    datosCeldas.celdaX * cellSize,
    datosCeldas.celdaY * cellSize,
    cellSize,
    cellSize,
  );
}

function moverBorrador(e) {
  // funcion de dibular al esta activo el dibujando

  if (!mousePresionando) return;

  let datosCeldas = sacarDatos(e);

  if (herramientas.borrador && e.buttons === 1) {
    if (!datosCeldas) return;

    borrado(datosCeldas);

    matriz[datosCeldas.celdaY][datosCeldas.celdaX] = null;
  }

  if (herramientas.lapiz && e.buttons === 2) {
    borrado(datosCeldas);

    matriz[datosCeldas.celdaY][datosCeldas.celdaX] = null;
  }
}

//----herramientoa de inció Canvas-------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------

canvas.addEventListener("contextmenu", (e) => {
  e.preventDefault();
});

canvas.addEventListener("mousedown", (e) => {
  if (
    herramientas.borrador === true ||
    herramientas.lapiz === true ||
    herramientas.rellenar === true
  ) {
    mousePresionando = true;

    if (herramientas.borrador) moverBorrador(e);

    if (herramientas.lapiz) moverLapiz(e);

    if (herramientas.rellenar) rellenar(e);
  }
});

//-mover lapiz y borrador----------------------------------------------------------------------------

function manejarDibujo(e) {
  if (mousePresionando === false) return;

  if (herramientas.lapiz) moverLapiz(e);
  else if (herramientas.borrador) moverBorrador(e);
}

canvas.addEventListener("mousemove", manejarDibujo);

// desactivar mouse presionado para las herramientas

canvas.addEventListener("mouseup", () => {
  mousePresionando = false;
});

// Cambiar Color Lapiz---------------------------------------------------

const color = $("#colorLapiz");

color.addEventListener("change", () => {
  colorDibujado = color.value;
});

//rellenar -------------------------------------------------------------------------------------

let columnas = parseInt(CantidadDeCuadros.value);
let filas = columnas;

let matriz = Array.from({ length: filas }, () => Array(columnas).fill(null));

function rellenarBase(fila, columna, colorOriginal, colorNuevo) {
  if (fila < 0 || fila >= filas || columna < 0 || columna >= columnas) return;

  if (matriz[fila][columna] !== colorOriginal) return;

  matriz[fila][columna] = colorNuevo;

  canvas_ctx.fillStyle = colorNuevo;
  canvas_ctx.fillRect(columna * cellSize, fila * cellSize, cellSize, cellSize);

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

  const colorOriginal = matriz[fila][columna];
  const colorNuevo = colorDibujado;

  if (colorOriginal === colorNuevo) return;

  rellenarBase(fila, columna, colorOriginal, colorNuevo);
}

//-- guardado-----------------------------------------------------------------------------

const formato_Imagen = $("#formatoImagen")

const tamaño_Imagen = $("#tamañoImagen")

const btn_Guardar = $("#guardarImagen")





function guardadoImagenEscalada(nuevotamaño){
  const tempCanvas = document.createElement("canvas");
  const tempCtx = tempCanvas.getContext("2d"); 

  
  tempCanvas.width = nuevotamaño;
  tempCanvas.height = nuevotamaño;

  tempCtx.drawImage(canvas, 0, 0, nuevotamaño, nuevotamaño);


  let tipoImagen = formato_Imagen.value;


if(tipoImagen === "png"){
  const enlace = document.createElement("a")
  enlace.download = "mi_dibujo.png"
  enlace.href = tempCanvas.toDataURL("image/png")
  enlace.click()
}

if(tipoImagen === "jpeg"){
  
  guardarJpeg(tempCanvas)

}


}




function guardarJpeg(canvasEscalado){
  const tempCanvas = document.createElement("canvas")
  tempCanvas.width = canvasEscalado.width
  tempCanvas.height = canvasEscalado.height
  const tempCtx = tempCanvas.getContext("2d")


  //fondo blanco

  tempCtx.fillStyle = "#ffffff"
  tempCtx.fillRect(0,0, tempCanvas.width, tempCanvas.height)

  //dibujar imagen original encima

  tempCtx.drawImage(canvasEscalado,0,0)

  const enlace = document.createElement("a")
  enlace.download = "mi_dibujo.jpeg"
  enlace.href = tempCanvas.toDataURL("image/jpeg", 0.9)
  enlace.click()


}




btn_Guardar.addEventListener("click", ()=>{


guardadoImagenEscalada(parseInt(tamaño_Imagen.value))

})