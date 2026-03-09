const Tesseract = require('tesseract.js');
const fs = require('fs');

// 1. CARGAR TU BASE DE DATOS
const rawData = fs.readFileSync('db_productos.json', 'utf8');
const db = JSON.parse(rawData);

const imagen = 'ticket.jpg';

console.log("🔍 EcoCesta analizando tu compra...");

Tesseract.recognize(imagen, 'spa')
  .then(({ data: { text } }) => {
    const textoTicket = text.toUpperCase();
    console.log("\n--- PRODUCTOS DETECTADOS EN TU ALACENA ---");
    
    let encontrados = 0;

    // 2. COMPARAR TEXTO DEL TICKET CON TU JSON
    db.productos_referencia.forEach(producto => {
      if (textoTicket.includes(producto.nombre_clave)) {
        encontrados++;
        
        // Calcular fecha
        let hoy = new Date();
        let vence = new Date();
        vence.setDate(hoy.getDate() + producto.dias_de_vida);

        console.log(`✅ ${producto.nombre_clave}`);
        console.log(`   📅 Vence el: ${vence.toLocaleDateString()}`);
        console.log(`   💡 Tip: ${producto.sugerencia}\n`);
      }
    });

    if (encontrados === 0) {
      console.log("No detecté productos conocidos. ¡Prueba con otra foto!");
    } else {
      console.log(`✨ Análisis completo. Guardamos ${encontrados} productos.`);
    }
  })
  .catch(err => console.error("Error:", err));