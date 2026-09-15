// ============================================================
//  CONFIG: conexión a MongoDB
//  Este archivo define y EXPORTA la función connectDB.
//  Se importa en app.ts y se ejecuta una sola vez al arrancar.
//  MongoDB es "schemaless" pero mongoose (ODM) nos deja definir
//  esquemas, validaciones y relaciones en cada modelo.
// ============================================================

const mongoose = require('mongoose');

// async => mongoose.connect devuelve una promesa; esperamos su resultado.
const connectDB = async () => {
    try {
        // Conectarse usando la URL del .env
        // (ej: mongodb://127.0.0.1:27017/salita_municipal)
        await mongoose.connect(process.env.DATABASE_URL);
    } catch (error) {
        // Si acá no hay Mongo corriendo, el proceso NO puede seguir:
        // logueamos el error y matamos el proceso (exit code 1).
        console.error('🔴 Error al conectar a la base de datos:', error);
        process.exit(1);
    }
};

// Evento de mongoose: corre cuando la conexión quedó establecida.
// En nuestro boot se ve el "🟢 Conexión a la base de datos establecida".
mongoose.connection.on('connected', () => {
    console.log('🟢 Conexión a la base de datos establecida');
});

// Evento de mongoose: corre si la conexión se pierde (Mongo se cayó).
mongoose.connection.on('disconnected', () => {
    console.log('🟡 Conexión a la base de datos perdida');
});

// SIGINT = Ctrl+C en la terminal. Antes de cerrar, cerramos la conexión
// a Mongo de forma limpia (evita conexiones colgadas).
process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('🔵 Conexión a la base de datos cerrada por terminación de la aplicación');
    process.exit(0);
});

// Exportamos la FUNCIÓN (no un objeto) para que app.ts la llame: connectDB().
module.exports = connectDB;