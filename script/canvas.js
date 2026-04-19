import { $, $$ } from "./dom.js";
import { state } from "./status.js";


// funcion de limpiar canvas
export function limpiarCanvas() {
    state.canvas_ctx.clearRect(0, 0, state.canvas.width, state.canvas.height);
    state.grid_ctx.clearRect(
      0,
      0,
      state.gridCanvas.width,
      state.gridCanvas.height,
    );

    state.canvas_ctx.beginPath();
    state.grid_ctx.beginPath();
  }

// funcion de dibujar cuadriculas



  export function DibujarCeldas() {
    limpiarCanvas();

    state.grid_ctx.beginPath();

    const gridSize = state.canvas.width / state.cellSize;

    for (let i = 0; i < gridSize; i++) {
      state.grid_ctx.moveTo(i * state.cellSize, 0);
      state.grid_ctx.lineTo(i * state.cellSize, state.canvas.height);

      state.grid_ctx.moveTo(0, i * state.cellSize);
      state.grid_ctx.lineTo(state.canvas.width, i * state.cellSize);
    }
    state.grid_ctx.strokeStyle = "#ccc";
    state.grid_ctx.stroke();
  }



// general
export function initCanvas() {
  console.log("Canvas iniciado");

  //

  //-- funcion de dibujar cuadriculas------------------------------------------------------------------

  state.canvas = $("#EspacioDeCanvas");
  state.gridCanvas = $("#gridCanvas");
  state.predibujadoCanvas = $("#predibujadoCanvas");


  state.canvas_ctx = state.canvas.getContext("2d");
  state.grid_ctx = state.gridCanvas.getContext("2d");
  state.overlay_ctx = state.predibujadoCanvas.getContext("2d")

  state.CantidadDeCuadros = $("#CantidadDeCuadros");

  state.cellSize = state.canvas.width / parseInt(state.CantidadDeCuadros.value);

  // inicializar tamaño
  state.columnas = parseInt(state.CantidadDeCuadros.value);
  state.filas = state.columnas;

  // crear matriz desde el inicio
  state.matriz = Array.from({ length: state.filas }, () =>
    Array(state.columnas).fill(null),
  );

  state.CantidadDeCuadros.addEventListener("change", () => {
    state.columnas = parseInt(state.CantidadDeCuadros.value);
    state.filas = state.columnas;

    state.cellSize = state.canvas.width / state.columnas;

    state.matriz = Array.from({ length: state.filas }, () =>
      Array(state.columnas).fill(null),
    );

    DibujarCeldas();

    console.log("Nuevo tamaño:", state.columnas);
  });

  

  //--------------------------------------------------------------------

  // pre cargar canva

  DibujarCeldas();

  //---Oculatar grillas----------------------------------------------------------------------------------------------------
  const btn_OcultarGrillas = $("#btn_QuitarGrillas");

  btn_OcultarGrillas.addEventListener("click", () => {
    state.gridCanvas.classList.toggle("ocultar");
  });
}
