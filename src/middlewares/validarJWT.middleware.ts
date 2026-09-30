// ============================================================
//  MIDDLEWARE: validarJWT (protección de rutas)
//  Lee el header Authorization, exige "Bearer <token>", verifica
//  la firma/expiración con el secreto del .env y deja el payload
//  en req.usuario para que el controller lo use (si lo necesita).
//  Si falta o es inválido -> 401 (respuestaEstandar).
// ============================================================

import type { Request, Response, NextFunction } from 'express';

const jwt = require('jsonwebtoken');
const respuestaEstandar = require('../utils/respuestaEstandar.js');

// Coincide con los valores del enum Rol del modelo Usuario.
type Rol = 'ADMIN' | 'RECEPCIONISTA';

interface TokenPayload {
    id: string;
    email: string;
    user: string;
    rol: Rol;
}

// Le agrega `req.usuario` al objeto Request de Express (solo en TS).
declare global {
    namespace Express {
        interface Request {
            usuario?: TokenPayload;
        }
    }
}

const validarJWT = (req: Request, res: Response, next: NextFunction) => {
    // el header por defecto viene como string | undefined; TS lo achica con el if.
    const headerAuth = req.headers.authorization;

    if (!headerAuth || !headerAuth.startsWith('Bearer ')) {
        return respuestaEstandar(res, 401, false, 'No hay token en la peticion');
    }

    // split(' ') corta por espacios: ['Bearer', '<token>'] -> posición [1].
    const token = headerAuth.split(' ')[1];
    if (!token) {
        return respuestaEstandar(res, 401, false, 'No hay token en la peticion');
    }

    try {
        // Verifica firma Y expiración. Si el token es inválido o venció, tira.
        const decodificado = jwt.verify(token, process.env.JWT_SECRET as string) as TokenPayload;

        req.usuario = decodificado;

        next();
    } catch (error: any) {
        return respuestaEstandar(res, 401, false, 'Token es invalido o expirado');
    }
};

module.exports = { validarJWT };