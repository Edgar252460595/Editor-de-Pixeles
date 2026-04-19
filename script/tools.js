import { $, $$ } from "./dom.js";
import { state } from "./status.js";
import { limpiarCanvas, DibujarCeldas } from "./canvas.js";

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
    forma: false,
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

  btn_gotero.addEventListener("click", (e) => {
    quitarSelecionHerramienta();
    herramientas.gotero = true;
  });

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

        const tamaño = state.tamaño_lapiz;

        for (let x = 0; x < tamaño; x++) {
          for (let y = 0; y < tamaño; y++) {
            const celdaX = datosCeldas.celdaX + x;
            const celdaY = datosCeldas.celdaY + y;

            // evitar errores si se sale del canvas
            if (
              celdaX >= state.matriz[0].length ||
              celdaY >= state.matriz.length
            )
              continue;

            state.canvas_ctx.fillRect(
              celdaX * state.cellSize,
              celdaY * state.cellSize,
              state.cellSize,
              state.cellSize,
            );

            state.matriz[celdaY][celdaX] = colorDibujado;
          }
        }
      }
    }

    if (e.buttons & 2) moverBorrador(e);
  }

  // borrador---------------------------------------------------------
  // ------------------------------------------------------------------
  // -----------------------------------------------------------------

  function borrado(datosCeldas) {
    const tamaño = state.tamaño_lapiz;

    for (let x = 0; x < tamaño; x++) {
      for (let y = 0; y < tamaño; y++) {
        const celdaX = datosCeldas.celdaX + x;
        const celdaY = datosCeldas.celdaY + y;

        // evitar salirte del canvas
        if (celdaX >= state.matriz[0].length || celdaY >= state.matriz.length)
          continue;

        state.canvas_ctx.clearRect(
          celdaX * state.cellSize,
          celdaY * state.cellSize,
          state.cellSize,
          state.cellSize,
        );

        // limpiar también la matriz
        state.matriz[celdaY][celdaX] = null;
      }
    }
  }

  function moverBorrador(e) {
    // funcion de dibular al esta activo el dibujando

    if (!mousePresionando) return;

    let datosCeldas = sacarDatos(e);

    if (herramientas.borrador && e.buttons === 1) {
      if (!datosCeldas) return;

      borrado(datosCeldas);
    }

    if (herramientas.lapiz && e.buttons === 2) {
      borrado(datosCeldas);
    }
  }
  // limpiar canvas -------------------------------------------------------------------------------------------------------
  let limpiarCanva = $("#limpiarCanva");

  limpiarCanva.addEventListener("click", () => {
    guardarEstado()
     // 💥 limpiar matriz también
  for (let y = 0; y < state.matriz.length; y++) {
    for (let x = 0; x < state.matriz[y].length; x++) {
      state.matriz[y][x] = null;
    }
  }
    DibujarCeldas();
  });
  //----herramientoa de inció Canvas-------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------

  state.canvas.addEventListener("contextmenu", (e) => {
    e.preventDefault();
  });

  state.canvas.addEventListener("mousedown", (e) => {
    console.log("pasoCurva:", pasoCurva);
    if (
      herramientas.borrador === true ||
      herramientas.lapiz === true ||
      herramientas.rellenar === true ||
      herramientas.gotero === true
    ) {

      guardarEstado()

      mousePresionando = true;

      if (herramientas.borrador) moverBorrador(e);

      if (herramientas.lapiz) moverLapiz(e);

      if (herramientas.rellenar) rellenar(e);

      if (herramientas.gotero) gotero(e);
    }

    if (herramientas.forma && !formas.curva) {
      inicioforma = sacarDatos(e);
    }
    if (herramientas.forma && formas.curva) {
      let punto = sacarDatos(e);
      if (!punto) return;

      if (pasoCurva === 0) {
        inicioforma = punto;
        pasoCurva = 1;
        return;
      }

      if (pasoCurva === 1) {
        controlforma = punto;
        pasoCurva = 2;
        return;
      }

      if (pasoCurva === 2) {
        let fin = punto;
        guardarEstado()

        dibujarCurva(inicioforma, controlforma, fin);
        // reset
        inicioforma = null;
        controlforma = null;
        pasoCurva = 0;

        clearPreview();
        return;
      }
    }
  });

  //-mover lapiz y borrador----------------------------------------------------------------------------

  function manejarDibujo(e) {
    let datos = sacarDatos(e);

    if (!datos) return;
    previewLapiz(datos);

    if (herramientas.forma && inicioforma) {
      // 💥 SOLO PREVIEW DE CURVA CUANDO YA HAY ALGO QUE MOSTRAR
      if (formas.curva) {
        if (pasoCurva === 1 || pasoCurva === 2) {
          previewForma(inicioforma, datos);
        }
      } else {
        previewForma(inicioforma, datos);
      }
    }

    if (mousePresionando === false) return;

    if (herramientas.lapiz) {
      moverLapiz(e);
    } else if (herramientas.borrador) moverBorrador(e);
  }

  state.canvas.addEventListener("mousemove", manejarDibujo);

  // desactivar mouse presionado para las herramientas

  state.canvas.addEventListener("mouseup", (e) => {
    //  SI ES CURVA, NO HACER NADA AQUÍ
    if (formas.curva) {
      mousePresionando = false;
      return;
    }

    if (herramientas.forma && inicioforma) {
      let fin = sacarDatos(e);
      if (!fin) return;

      dibujarForma(inicioforma, fin);
    }

    inicioforma = null;
    mousePresionando = false;
    clearPreview();
  });

  // Cambiar Color Lapiz---------------------------------------------------

  const color = $("#colorLapiz");

  color.addEventListener("change", () => {
    colorDibujado = color.value;

    guardarColor(color.value);
  });

  // cambiar tamaño lapiz----------------------------------------------------------------
  const tamaño_lapiz = $("#Tamaño_lapiz");

  tamaño_lapiz.addEventListener("change", (e) => {
    state.tamaño_lapiz = tamaño_lapiz.value;
  });

  // previsualizar dibujado -----------------------------------------------------
  function previewLapiz(datosCeldas) {
    const ctx = state.overlay_ctx;

    ctx.clearRect(
      0,
      0,
      state.predibujadoCanvas.width,
      state.predibujadoCanvas.height,
    );

    const tamaño = state.tamaño_lapiz;

    ctx.globalAlpha = 0.5;
    ctx.fillStyle = colorDibujado;

    for (let x = 0; x < tamaño; x++) {
      for (let y = 0; y < tamaño; y++) {
        const celdaX = datosCeldas.celdaX + x;
        const celdaY = datosCeldas.celdaY + y;

        ctx.fillRect(
          celdaX * state.cellSize,
          celdaY * state.cellSize,
          state.cellSize,
          state.cellSize,
        );
      }
    }

    ctx.globalAlpha = 1;
  }

  //rellenar -------------------------------------------------------------------------------------

  let columnas = parseInt(state.CantidadDeCuadros.value);
  let filas = columnas;

  state.matriz = Array.from({ length: filas }, () =>
    Array(columnas).fill(null),
  );

  function rellenarBase(fila, columna, colorOriginal, colorNuevo) {
    if (
      fila < 0 ||
      fila >= state.filas ||
      columna < 0 ||
      columna >= state.columnas
    )
      return;

    if (state.matriz[fila][columna] !== colorOriginal) return;

    state.matriz[fila][columna] = colorNuevo;

    state.canvas_ctx.fillStyle = colorNuevo;
    state.canvas_ctx.fillRect(
      columna * state.cellSize,
      fila * state.cellSize,
      state.cellSize,
      state.cellSize,
    );

    rellenarBase(fila + 1, columna, colorOriginal, colorNuevo);
    rellenarBase(fila - 1, columna, colorOriginal, colorNuevo);
    rellenarBase(fila, columna + 1, colorOriginal, colorNuevo);
    rellenarBase(fila, columna - 1, colorOriginal, colorNuevo);
  }

  function rellenar(e) {
    guardarEstado()

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

  function guardarColor(color_a_guardar) {
    if (state.paleta.includes(color_a_guardar)) {
      return;
    }

    if (state.paleta.length > 12) {
      state.paleta.shift();
    }

    state.paleta.push(color_a_guardar);
    renderColores();
  }

  function renderColores() {
    const menuColores = $("#menuColores");

    menuColores.querySelectorAll(".color-boton").forEach((btn) => btn.remove());

    state.paleta.forEach((colorAgregar) => {
      const boton = document.createElement("button");
      boton.style.background = colorAgregar;
      boton.style.width = 30 + "px";
      boton.style.height = 30 + "px";
      boton.style.margin = 3 + "px";
      boton.className = "color-boton";
      boton.dataset.color = colorAgregar;

      boton.addEventListener("click", () => {
        colorDibujado = boton.dataset.color;
        btn_cambiarcolor(colorDibujado);
      });

      menuColores.appendChild(boton);
    });
  }

  //GOTERO

  function gotero(e) {
    if (!mousePresionando) return;

    let datosCeldas = sacarDatos(e);

    if (herramientas.gotero && e.buttons === 1) {
      if (!datosCeldas) return;

      colorDibujado = state.matriz[datosCeldas.celdaY][datosCeldas.celdaX];

      quitarSelecionHerramienta();

      herramientas.lapiz = true;
    }
    btn_cambiarcolor(colorDibujado);
  }

  // funcion cambiar de color al boton de colores

  function btn_cambiarcolor(e) {
    color.value = `${e}`;
    console.log(e);
  }

  // figuras geometricas

  const menuFiguras = $$("#menuFiguras li");

  let formas = {
    triangulo: false,
    circulo: false,
    cuadrado: false,
    recta: false,
    curva: false,
  };

  function quitarSelecionFormas() {
    for (let elemento in formas) {
      formas[elemento] = false;
    }
  }

  menuFiguras.forEach((opcion) => {
    opcion.addEventListener("click", () => {
      quitarSelecionFormas();

      const figura = opcion.dataset.forma;

      formas[figura] = true;

      quitarSelecionHerramienta();

      herramientas.forma = true;

      pasoCurva = 0;
      controlforma = null;
      inicioforma = null;

      console.log(formas);
    });
  });

  // triangulo

  let inicioforma = null;

  function generarTriangulo(inicio, fin) {
    let puntos = [];

    let x0 = inicio.celdaX;
    let y0 = inicio.celdaY;

    let x1 = fin.celdaX;
    let y1 = fin.celdaY;

    // Dirección del triángulo
    let dx = x1 - x0;
    let dy = y1 - y0;

    let steps = Math.max(Math.abs(dx), Math.abs(dy));
    if (steps === 0) return puntos;

    // Vector perpendicular (clave del giro)
    let px = -dy;
    let py = dx;

    for (let i = 0; i <= steps; i++) {
      let t = i / steps;

      // Punto central del “esqueleto”
      let cx = x0 + dx * t;
      let cy = y0 + dy * t;

      // expansión del triángulo
      let base = Math.floor(t * steps * 0.5);

      for (let b = -base; b <= base; b++) {
        let bx = cx + px * (b / steps);
        let by = cy + py * (b / steps);

        let pxFinal = Math.round(bx);
        let pyFinal = Math.round(by);

        if (i === steps || Math.abs(b) === base) {
          puntos.push({
            x: pxFinal,
            y: pyFinal,
          });
        }
      }
    }

    return puntos;
  }

  function clearPreview() {
    const ctx = state.overlay_ctx;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }

  // cuadrado
  function generarCuadrado(inicio, fin) {
    let puntos = [];

    let x0 = inicio.celdaX;
    let y0 = inicio.celdaY;
    let x1 = fin.celdaX;
    let y1 = fin.celdaY;

    let minX = Math.min(x0, x1);
    let maxX = Math.max(x0, x1);
    let minY = Math.min(y0, y1);
    let maxY = Math.max(y0, y1);

    for (let x = minX; x <= maxX; x++) {
      for (let y = minY; y <= maxY; y++) {
        if (x === minX || x === maxX || y === minY || y === maxY) {
          puntos.push({ x, y });
        }
      }
    }

    return puntos;
  }

  // circulo

  function generarCirculo(inicio, fin) {
    let puntos = [];

    let x0 = inicio.celdaX;
    let y0 = inicio.celdaY;
    let x1 = fin.celdaX;
    let y1 = fin.celdaY;

    let minX = Math.min(x0, x1);
    let maxX = Math.max(x0, x1);
    let minY = Math.min(y0, y1);
    let maxY = Math.max(y0, y1);

    // 🔒 centro fijo en enteros
    let cx = Math.floor((minX + maxX) / 2);
    let cy = Math.floor((minY + maxY) / 2);

    // 🔒 radios enteros
    let rx = Math.floor((maxX - minX) / 2);
    let ry = Math.floor((maxY - minY) / 2);

    function dentro(x, y) {
      if (rx === 0 || ry === 0) return false;

      let dx = (x - cx) / rx;
      let dy = (y - cy) / ry;
      return dx * dx + dy * dy <= 1;
    }

    for (let x = minX; x <= maxX; x++) {
      for (let y = minY; y <= maxY; y++) {
        if (!dentro(x, y)) continue;

        if (
          !dentro(x + 1, y) ||
          !dentro(x - 1, y) ||
          !dentro(x, y + 1) ||
          !dentro(x, y - 1)
        ) {
          puntos.push({ x, y });
        }
      }
    }

    return puntos;
  }

  // linea recta
  function generarRecta(inicio, fin) {
    let puntos = [];

    let x0 = inicio.celdaX;
    let y0 = inicio.celdaY;
    let x1 = fin.celdaX;
    let y1 = fin.celdaY;

    let dx = Math.abs(x1 - x0);
    let dy = Math.abs(y1 - y0);

    let sx = x0 < x1 ? 1 : -1;
    let sy = y0 < y1 ? 1 : -1;

    let err = dx - dy;

    while (true) {
      puntos.push({ x: x0, y: y0 });

      if (x0 === x1 && y0 === y1) break;

      let e2 = 2 * err;

      if (e2 > -dy) {
        err -= dy;
        x0 += sx;
      }

      if (e2 < dx) {
        err += dx;
        y0 += sy;
      }
    }

    return puntos;
  }

  // linea curva

  let controlforma = null;
  let pasoCurva = 0;

  function generarCurva(inicio, control, fin) {
    if (!inicio || !control || !fin) return [];
    let puntos = [];

    let x0 = inicio.celdaX;
    let y0 = inicio.celdaY;
    let x1 = control.celdaX;
    let y1 = control.celdaY;
    let x2 = fin.celdaX;
    let y2 = fin.celdaY;

    let steps = Math.max(Math.abs(x2 - x0), Math.abs(y2 - y0)) * 2;

    for (let i = 0; i <= steps; i++) {
      let t = i / steps;

      let x = (1 - t) * (1 - t) * x0 + 2 * (1 - t) * t * x1 + t * t * x2;

      let y = (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * y1 + t * t * y2;

      puntos.push({
        x: Math.round(x),
        y: Math.round(y),
      });
    }

    return puntos;
  }

  function dibujarCurva(inicio, control, fin) {
    const ctx = state.canvas_ctx;

    let puntos = generarCurva(inicio, control, fin);

    ctx.fillStyle = colorDibujado;

    for (let p of puntos) {
      if (
        p.x < 0 ||
        p.y < 0 ||
        p.x >= state.matriz[0].length ||
        p.y >= state.matriz.length
      )
        continue;

      ctx.fillRect(
        p.x * state.cellSize,
        p.y * state.cellSize,
        state.cellSize,
        state.cellSize,
      );

      state.matriz[p.y][p.x] = colorDibujado;
    }
  }

  function obtenerFormaActiva() {
    for (let f in formas) {
      if (formas[f]) return f;
    }
  }

  let generadores = {
    triangulo: generarTriangulo,
    recta: generarRecta,
    circulo: generarCirculo,
    cuadrado: generarCuadrado,
  };

  function previewForma(inicio, fin) {
    const ctx = state.overlay_ctx;

    ctx.clearRect(
      0,
      0,
      state.predibujadoCanvas.width,
      state.predibujadoCanvas.height,
    );

    const formaActiva = obtenerFormaActiva();
    let puntos = [];

    // 💥 CASO ESPECIAL: CURVA
    if (formaActiva === "curva") {
      if (pasoCurva === 1 && inicio) {
        // preview como línea (inicio → mouse)
        puntos = generarRecta(inicio, fin);
      }

      if (pasoCurva === 2 && inicio && controlforma) {
        // preview real de la curva
        puntos = generarCurva(inicio, controlforma, fin);
      }
    } else {
      // 💥 TODAS LAS DEMÁS FORMAS
      puntos = generadores[formaActiva](inicio, fin);
    }

    ctx.globalAlpha = 0.6;
    ctx.fillStyle = colorDibujado;

    for (let p of puntos) {
      ctx.fillRect(
        p.x * state.cellSize,
        p.y * state.cellSize,
        state.cellSize,
        state.cellSize,
      );
    }

    ctx.globalAlpha = 1;
  }

  function dibujarForma(inicio, fin) {
    const ctx = state.canvas_ctx;

    const formaActiva = obtenerFormaActiva();

    let puntos = generadores[formaActiva](inicio, fin);

    ctx.fillStyle = colorDibujado;

    for (let p of puntos) {
      if (
        p.x < 0 ||
        p.y < 0 ||
        p.x >= state.matriz[0].length ||
        p.y >= state.matriz.length
      )
        continue;

      ctx.fillRect(
        p.x * state.cellSize,
        p.y * state.cellSize,
        state.cellSize,
        state.cellSize,
      );

      state.matriz[p.y][p.x] = colorDibujado;
    }
  }

// deshacer y rehacer

// state.historial  este es el array donde guardare el historial

let btn_deshacer = $("#deshacer")
let btn_rehacer = $("#rehacer")


function guardarEstado() {
  // cortar futuro si hiciste undo y luego dibujas
  state.historial = state.historial.slice(0, state.pasoActual + 1);

  const copia = state.matriz.map(fila => [...fila]);

  state.historial.push(copia);
  state.pasoActual++;

  // 💥 LIMITE DE 50
  if (state.historial.length > 50) {
    state.historial.shift(); // elimina el más viejo
    state.pasoActual--; // ajustar índice
  }
}

function restaurarEstado(indice) {
  if (indice < 0 || indice >= state.historial.length) return;

  state.matriz = state.historial[indice].map(fila => [...fila]);

  limpiarCanvas();
  DibujarCeldas(); // 💥 vuelve a dibujar la grilla

  for (let y = 0; y < state.matriz.length; y++) {
    for (let x = 0; x < state.matriz[y].length; x++) {
      let color = state.matriz[y][x];
      if (color) {
        state.canvas_ctx.fillStyle = color;
        state.canvas_ctx.fillRect(
          x * state.cellSize,
          y * state.cellSize,
          state.cellSize,
          state.cellSize
        );
      }
    }
  }
}


btn_deshacer.addEventListener("click", () => {
  if (state.pasoActual <= 0) return;

  state.pasoActual--;
  restaurarEstado(state.pasoActual);
});


btn_rehacer.addEventListener("click", () => {
  if (state.pasoActual >= state.historial.length - 1) return;

  state.pasoActual++;
  restaurarEstado(state.pasoActual);
});




}
