// acortar condigo con Bind

const $ = document.querySelector.bind(document);

const $$ = document.querySelectorAll.bind(document);

//--------------------------------------------------------------------

const canvas = $("#EspacioDeCanvas");
const gridCanvas = $("#gridCanvas")

const canvas_ctx = canvas.getContext("2d");
const grid_ctx = gridCanvas.getContext("2d");

const CantidadDeCuadros = $("#CantidadDeCuadros");
let cellSize = canvas.width / parseInt(CantidadDeCuadros.value);

CantidadDeCuadros.addEventListener("change", () => {
  cellSize = canvas.width / parseInt(CantidadDeCuadros.value);
  DibujarCeldas();

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
const btn_OcultarGrillas =$("#btn_QuitarGrillas")

btn_OcultarGrillas.addEventListener("click", () =>{
  gridCanvas.classList.toggle("ocultar")
})



//-------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------

// arrastre de menu de herramientas

const contenedorHerramientas = $("#contenedorHerramientas");
let contenedorHerramientaY;
let contenedorHerramientaX;

const arrastreHerramienta = $(".arrastre");

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

  const limiteX = window.innerWidth - contenedorHerramientas.offsetWidth;
  const limiteY = window.innerHeight - contenedorHerramientas.offsetHeight;

  nuevaPosicionX = Math.max(0, Math.min(nuevaPosicionX, limiteX));
  nuevaPosicionY = Math.max(0, Math.min(nuevaPosicionY, limiteY));

  contenedorHerramientas.style.top = nuevaPosicionY + "px";
  contenedorHerramientas.style.left = nuevaPosicionX + "px";
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
  console.log("soltando");

  document.removeEventListener("mousemove", eventoMoverCaja);
  window.removeEventListener("mouseup", dejarDeArrastar);
}

//-------------------------------------------

let GuardadoDeMovimientos = {};

// evento incial de arrastre

arrastreHerramienta.addEventListener("mousedown", (e) => {
  e.preventDefault();

  GuardadoDeMovimientos.mouseInicialX = e.clientX;

  GuardadoDeMovimientos.mouseInicialY = e.clientY;

  GuardadoDeMovimientos.posicionInicialX = contenedorHerramientas.offsetLeft;
  GuardadoDeMovimientos.posicionInicialY = contenedorHerramientas.offsetTop;

  console.log("estoy arrastrando");

  arrastreActivo = true;

  document.addEventListener("mousemove", eventoMoverCaja);
  window.addEventListener("mouseup", dejarDeArrastar);
});

//-----------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------

const btn_lapiz = $("#lapiz");
const btn_borrador = $("#borrador");

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

const rellenar = $("#rellenar")

rellenar.addEventListener("click", () =>{
  quitarSelecionHerramienta();
  rellenar = true;
})


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

  if (e.buttons === 1){

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
  }
    }

    if (e.buttons & 2) moverBorrador(e);
  
}

// borrador---------------------------------------------------------
// ------------------------------------------------------------------
// -----------------------------------------------------------------

function moverBorrador(e) {
  // funcion de dibular al esta activo el dibujando

  if(!mousePresionando) return;

      let datosCeldas = sacarDatos(e);


  if (herramientas.borrador && (e.buttons === 1)) {


    if (!datosCeldas) return;

    canvas_ctx.clearRect(
      datosCeldas.celdaX * cellSize,
      datosCeldas.celdaY * cellSize,
      cellSize,
      cellSize,
    )
  }

  if(herramientas.lapiz && (e.buttons === 2)){
    canvas_ctx.clearRect(
      datosCeldas.celdaX * cellSize,
      datosCeldas.celdaY * cellSize,
      cellSize,
      cellSize
    )
  }


}




//----herramientoa de inció Canvas-------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------


canvas.addEventListener("contextmenu",(e)=>{
    e.preventDefault();

})

canvas.addEventListener("mousedown", (e) => {
  if (herramientas.borrador === true || herramientas.lapiz === true){
    

    mousePresionando = true;
    
    if(herramientas.borrador) moverBorrador(e);

    if(herramientas.lapiz) moverLapiz(e);





}

});


//-mover lapiz y borrador----------------------------------------------------------------------------

function manejarDibujo(e){  
  if(mousePresionando === false) return;

  if(herramientas.lapiz) moverLapiz(e)
    else if(herramientas.borrador) moverBorrador(e);
}


canvas.addEventListener("mousemove",manejarDibujo)




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

