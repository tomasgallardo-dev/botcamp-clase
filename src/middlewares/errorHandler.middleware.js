//  MIDDLEWARE: manejo centralizado de errores (err, req, res, next)
//  Se registra SIEMPRE al final de la cadena de middlewares.

const respuestaEstandar = require('../utils/respuestaEstandar');

const errorHandler = (err, req, res, next) => {
    const estado = err.status || 500;
    const mensaje = estado === 500 ? 'Error interno del servidor' : err.message;

    if (estado === 500) {
        console.error(`[ERROR] ${err.message}`);
    }

    return respuestaEstandar(res, estado, false, mensaje, null);
};

module.exports = errorHandler;