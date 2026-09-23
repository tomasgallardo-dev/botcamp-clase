/* ============================================================
    Autenticacion.schema.ts   (reemplaza a AutenticacionDTO.ts)
    Body de POST /api/v1/auth/login validado con zod.
    OJO: el login sigue devolviendo {ok, token} (shape propio, no
    respuestaEstandar) y las credenciales siguen hardcodeadas.
 ============================================================ */
import { z } from 'zod';

export const loginSchema = z.object({
    body: z.object({
        email: z.email({ error: 'Email invalido' }),
        password: z.string({ error: 'La contraseña es obligatoria' }).min(1, 'La contraseña es obligatoria'),
    })
});

export type ILoginDTO = z.infer<typeof loginSchema>['body'];