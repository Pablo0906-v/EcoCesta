const Tesseract = require('tesseract.js');

// 1. Aquí ponemos el nombre de la imagen que guardaste
const imagenPrueba = 'ticket.jpg'; 

console.log("--- INICIANDO ESCÁNER DE ECOCESTA ---");
console.log("Leyendo imagen... esto puede tardar unos segundos.");

// 2. Función mágica de Reconocimiento de Texto
Tesseract.recognize(
  imagenPrueba,
  'spa', // Idioma: Español
  { 
    logger: m => {
      // Esto nos muestra el progreso en la terminal
      if (m.status === 'recognizing text') {
        console.log(`Progreso: ${Math.round(m.progress * 100)}%`);
      }
    } 
  }
).then(({ data: { text } }) => {
  // 3. Resultado final
  console.log("\n✅ LECTURA COMPLETADA:");
  console.log("-----------------------");
  console.log(text.toUpperCase()); // Lo ponemos en mayúsculas para que coincida con tu JSON
  console.log("-----------------------");
  
  // Tip para el siguiente paso:
  console.log("Siguiente paso: Filtrar estas palabras con tu db_productos.json");
}).catch(err => {
  console.error("❌ Error al leer la imagen:", err.message);
});