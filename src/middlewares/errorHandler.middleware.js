// ============================================================
//  MIDDLEWARE: manejo de rutas no encontradas (404)
//  Descripción: Se registra al final de app.js. Cuando el usuario
//  pide una ruta que NO existe en el servidor, este middleware
//  responde con un error 404 y un mensaje claro.
// ============================================================

const rutaNoEncontrada = (req, res, next) => {
    res.status(404).json({
        success: false,
        timestamp: new Date().toISOString(),
        error: "Ruta No Encontrada (404)",
        message: `La ruta ${req.originalUrl} no existe en el servidor`,
    });
};

module.exports = rutaNoEncontrada;