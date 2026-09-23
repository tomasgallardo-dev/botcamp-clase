// ============================================================
//  MIDDLEWARE: rutaNoEncontrada (404)
//  Se registra DESPUÉS de todas las rutas y antes del errorHandler.
//  Si una petición no casó con ninguna ruta, Express la pasa acá
//  (es el único lugar que responde 404 en toda la app).
// ============================================================

import type { Request, Response, NextFunction } from 'express';

const rutaNoEncontrada = (req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({
        success: false,
        timestamp: new Date().toISOString(),
        error: "Ruta No Encontrada (404)",
        // Ej: "La ruta /api/v1/inexistente no existe en el servidor"
        message: `La ruta ${req.originalUrl} no existe en el servidor`,
    });
};

module.exports = rutaNoEncontrada;