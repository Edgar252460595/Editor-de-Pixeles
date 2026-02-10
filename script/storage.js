import { $, $$ } from './dom.js';
import { state } from './status.js';



export function saveProject() {
    console.log("Proyecto guardado");

    
const formato_Imagen = $("#formatoImagen")

const tamaño_Imagen = $("#tamañoImagen")

const btn_Guardar = $("#guardarImagen")





function guardadoImagenEscalada(nuevotamaño){
  const tempCanvas = document.createElement("canvas");
  const tempCtx = tempCanvas.getContext("2d"); 

  
  tempCanvas.width = nuevotamaño;
  tempCanvas.height = nuevotamaño;

  tempCtx.drawImage(state.canvas, 0, 0, nuevotamaño, nuevotamaño);


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



}