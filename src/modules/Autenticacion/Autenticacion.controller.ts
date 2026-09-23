// ============================================================
//  CONTROLADOR: Autenticacion (login)
//  PROVISORIO / prototipo (ver "Pendiente" en AGENTS.md):
//   - Las credenciales están HARDCODEADAS acá (no hay usuarios en la BD).
//   - No se genera un JWT real: devuelve un token falso.
//   - La respuesta NO usa respuestaEstandar: shape propio {ok, token}
//     (el frontend Login.jsx espera ese shape).
// ============================================================

import type { Request, Response } from 'express';
import type { ILoginDTO } from './dtos/Autenticacion.schema';

// POST /api/v1/auth/login
const login = (req: Request<{}, {}, ILoginDTO>, res: Response) => {
    // El JSON que manda el frontend lo deja express.json() en req.body.
    const { email, password } = req.body;

    // Credenciales de prueba (también hardcodeadas en el frontend).
    if (
        email === "admin@salita.com" &&
        password === "12345"
    ) {
        // 200 + shape { ok, token }. El frontend guarda este token en
        // localStorage y lo manda en el header Authorization.
        return res.status(200).json({ ok: true, token: "token_falso_123" });
    }

    // Credenciales inválidas.
    return res.status(401).json({ ok: false, error: "Credenciales inválidas" });
};

module.exports = { login };