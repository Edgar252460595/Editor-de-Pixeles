import { $, $$ } from './dom.js';
import { state } from './status.js';

export function initCanvas() {
    console.log("Canvas iniciado");



//-- funcion de dibujar cuadriculas------------------------------------------------------------------

state.canvas = $("#EspacioDeCanvas");
state.gridCanvas = $("#gridCanvas");

state.canvas_ctx = state.canvas.getContext("2d");
state.grid_ctx = state.gridCanvas.getContext("2d");

state.CantidadDeCuadros = $("#CantidadDeCuadros");

state.cellSize = state.canvas.width / parseInt(CantidadDeCuadros.value);

state.CantidadDeCuadros.addEventListener("change", () => {
  state.cellSize = state.canvas.width / parseInt(CantidadDeCuadros.value);
  DibujarCeldas();
  state.columnas = parseInt(CantidadDeCuadros.value);
  state.filas = state.columnas;

  state.matriz = Array.from({ length: state.filas }, () => Array(state.columnas).fill(null));

  console.log(state.cellSize);
});

//--funcion de dibujo de celdas------------------------------------------------------------------

function limpiarCanvas() {
  state.canvas_ctx.clearRect(0, 0, state.canvas.width, state.canvas.height);
  state.grid_ctx.clearRect(0, 0, state.gridCanvas.width, state.gridCanvas.height);

  state.canvas_ctx.beginPath();
  state.grid_ctx.beginPath();
}

function DibujarCeldas() {
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

//--------------------------------------------------------------------

// pre cargar canva

DibujarCeldas();

// pre cargar canva

DibujarCeldas();

//---Oculatar grillas----------------------------------------------------------------------------------------------------
const btn_OcultarGrillas = $("#btn_QuitarGrillas");

btn_OcultarGrillas.addEventListener("click", () => {
  gridCanvas.classList.toggle("ocultar");
});























}