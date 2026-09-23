// ============================================================
//  MIDDLEWARE: errorHandler (manejo centralizado de errores)
//  Es un middleware ESPECIAL: tiene 4 parámetros (err, req, res, next).
//  Express lo detecta por tener los 4 parámetros y lo ejecuta cuando
//  algún controller llama next(err). Debe registrarse SIEMPRE al FINAL.
// ============================================================

import type { Request, Response, NextFunction } from 'express';

const respuestaEstandar = require('../utils/respuestaEstandar');

// err: any EXPLÍCITO (permitido): un error handler debe poder recibir
// cualquier cosa que un controller le pase con next(err).
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    // Si el error trae su propio status (ej: err.status = 400 lo setea el
    // controller), lo usamos; si no, asumimos 500 (error interno).
    const estado = err.status || 500;
    // Para 500 NO mostramos internals al cliente, solo un mensaje genérico.
    // Para el resto (400/404/409) sí mostramos el message real.
    const mensaje = estado === 500 ? 'Error interno del servidor' : err.message;

    // El 500 sí se loguea completo en consola para poder debuggear.
    if (estado === 500) {
        console.error(`[ERROR] ${err.message}`);
    }

    // Respuesta con el formato uniforme de la API (ver utils/respuestaEstandar).
    return respuestaEstandar(res, estado, false, mensaje, null);
};

module.exports = errorHandler;