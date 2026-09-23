// ============================================================
//  UTILIDAD: respuestaEstandar
//  Da un formato UNIFORME a todas las respuestas JSON de la API.
//  { success, timestamp, message, total, data }
// ============================================================
import type { Response } from 'express';

const respuestaEstandar = <T>(
    res: Response,
    statusCode: number,
    ok: boolean,
    message: string,
    data?: T
): Response => {
    // Regla para "total": si data es un arreglo -> su largo;
    // si es un objeto -> 1; si no hay nada -> 0.
    const total = Array.isArray(data) ? data.length : (data ? 1 : 0);

    return res.status(statusCode).json({
        success: ok,
        timestamp: new Date().toISOString(),
        message,
        total,                            
        data: data ?? null,
    });
};

// EXPORT CommonJS: sin esto, require() de este archivo devolvería {} y
// "respuestaEstandar" no sería una función. Los controllers/y middlewares
// la traen con  const x = require(...)  -> es EL ÚNICO idioma de export.
module.exports = respuestaEstandar;