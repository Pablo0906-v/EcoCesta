const fs = require('fs');
const rutaArchivo = './db_productos.json';

function registrarNuevoProducto(nuevoProducto) {
    // 1. Leer el archivo actual
    const dataRaw = fs.readFileSync(rutaArchivo);
    let db = JSON.parse(dataRaw);

    // 2. Determinar en qué lista guardar (por si usaste espacio o guion bajo)
    const claveLista = db["productos_referencia"] ? "productos_referencia" : "productos_referencia";

    // 3. Verificar si ya existe para no duplicar
    const existe = db[claveLista].find(p => p.nombre_clave === nuevoProducto.nombre_clave.toUpperCase());

    if (!existe) {
        // Agregamos el nuevo producto a la lista
        db[claveLista].push({
            nombre_clave: nuevoProducto.nombre_clave.toUpperCase(),
            categoria: nuevoProducto.categoria,
            dias_de_vida: nuevoProducto.dias_de_vida,
            sugerencia: nuevoProducto.sugerencia
        });

        // 4. Guardar los cambios de vuelta al archivo JSON
        fs.writeFileSync(rutaArchivo, JSON.stringify(db, null, 2));
        console.log(`✅ ¡Éxito! "${nuevoProducto.nombre_clave}" guardado en EcoCesta DB.`);
    } else {
        console.log("⚠️ Este producto ya está en tu base de datos.");
    }
}

// --- PRUEBA DE REGISTRO ---
// Imagina que escaneaste un "Atún en lata" y no estaba en la nube:
registrarNuevoProducto({
    nombre_clave: "ATUN EN LATA",
    categoria: "Despensa",
    dias_de_vida: 365,
    sugerencia: "Una vez abierto, pásalo a un recipiente de vidrio, no lo dejes en la lata."
});