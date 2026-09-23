// ============================================================
//  MIDDLEWARE: validarDatos
//  Fábrica: recibe un schema Zod y devuelve un middleware de Express.
//  safeParse NO lanza excepción: devuelve { success, data } o { success, error }.
// ============================================================

import type { Request, Response, NextFunction } from 'express';
import  { z } from 'zod';

const respuestaEstandar = require('../utils/respuestaEstandar');

const validarSchema = (schema: z.ZodType<any, any, any>) => {
    // El RETURN de la fábrica: el middleware que Express va a usar.
    return (req: Request, res: Response, next: NextFunction) => {
        const resultado = schema.safeParse({
            body: req.body,
            query: req.query,
            params: req.params,
        });

        if (!resultado.success) {
            const detalles = resultado.error.issues.map((issue) => ({
                campo: issue.path.join('.') || '(cuerpo completo)',
                mensaje: issue.message,
            }));
            return respuestaEstandar(res, 400, false, 'Error de validación', detalles);
        }

        // El body ya validado pasa al controller.
        req.body = resultado.data.body;
        next();
    };
};

module.exports = { validarSchema };