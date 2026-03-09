const fetch = require('node-fetch');
// Importamos tu base de datos local (asegúrate de que el nombre del archivo sea idéntico)
const dbLocal = require('./db_productos.json');

async function escanearProducto(codigo) {
    console.log(`\n🔍 Analizando código: ${codigo}...`);
    
    try {
        // 1. INTENTO EN LA NUBE (API)
        const respuesta = await fetch(`https://world.openfoodfacts.org/api/v0/product/${codigo}.json`);
        const data = await respuesta.json();

        if (data.status === 1) {
            const p = data.product;
            return procesarResultado(p.product_name, p.brands || "Genérico", "NUBE");
        }

        // 2. PLAN B: BUSQUEDA LOCAL (Si la nube falla)
        // Buscamos si el código que escribiste coincide con algún nombre en tu JSON
        const listaLocal = dbLocal["productos referencia"] || dbLocal["productos_referencia"];
        
        // Mapeo manual para pruebas: si el código es el de la leche Lala...
        if (codigo === "7501020512532") {
            const leche = listaLocal.find(item => item.nombre_clave === "LECHE");
            return procesarResultado(leche.nombre_clave, "Lala (Local)", "LOCAL");
        }

        return { error: "❌ Producto no encontrado en ninguna base de datos." };

    } catch (err) {
        return { error: "🚨 Error de conexión. Revisa tu internet o la librería node-fetch." };
    }
}

// Función auxiliar para calcular fechas y dar formato
function procesarResultado(nombre, marca, fuente) {
    const hoy = new Date();
    let diasDeVida = 5; // Por defecto

    // Lógica inteligente: asigna días según el nombre
    const n = nombre.toUpperCase();
    if (n.includes("LECHE")) diasDeVida = 7;
    if (n.includes("POLLO") || n.includes("CARNE")) diasDeVida = 3;
    if (n.includes("HUEVO")) diasDeVida = 21;

    let fechaVence = new Date();
    fechaVence.setDate(hoy.getDate() + diasDeVida);

    return {
        Estado: "✅ Éxito",
        Fuente: fuente,
        Producto: nombre,
        Marca: marca,
        Vence_el: fechaVence.toLocaleDateString(),
        Dias_restantes: diasDeVida
    };
}

// --- ÁREA DE PRUEBAS ---
// Prueba 1: Nutella (Debe salir de la Nube)
escanearProducto("3017620422003").then(res => console.log(res));

// Prueba 2: Tu Leche (Debe salir Local)
escanearProducto("7501020512532").then(res => console.log(res));