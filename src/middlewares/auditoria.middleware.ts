// ============================================================
//  MIDDLEWARE: auditoría (log de peticiones)
//  Un middleware de Express es una función (req, res, next).
//  Se registra en app.ts con app.use(...) y corre en TODAS las
//  peticiones ANTES de llegar a la ruta.
//  - req:  datos de la petición entrante (método, URL, body, params)
//  - res:  la respuesta que se va a enviar
// - next: función que llama al SIGUIENTE middleware de la cadena
// ============================================================

// import type: SOLO tipos, se borra al compilar (no toca el runtime).
import type { Request, Response, NextFunction } from 'express';

const auditoriaMunicipal = (req: Request, res: Response, next: NextFunction) => {
    const horaActual = new Date().toLocaleTimeString();
    const metodo = req.method;          // ej: GET, POST, PUT, DELETE, PATCH
    const ruta = req.originalUrl;       // ej: /api/v1/pacientes

    // Log por cada petición: [18:47:21] GET /api/v1/pacientes
    console.log(`[${horaActual}] ${metodo} ${ruta}`);

    // SIEMPRE hay que llamar next(): es lo que permite que la petición
    // siga avanzando. Sin next(), la petición se cuelga.
    next();
};

module.exports = auditoriaMunicipal;