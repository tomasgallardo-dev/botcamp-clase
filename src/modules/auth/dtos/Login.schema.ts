/* ============================================================
    Login.schema.ts   (ex Autenticacion.schema.ts)
    Body de POST /api/v1/auth/login validado con zod.
    El login devuelve {ok, token} (shape propio, no respuestaEstandar)
    y valida contra la colección `usuarios` (bcrypt + JWT).
 ============================================================ */
import { z } from 'zod';

export const loginSchema = z.object({
    body: z.object({
        email: z.email({ error: 'Email invalido' }),
        password: z.string({ error: 'La contraseña es obligatoria' }).min(1, 'La contraseña es obligatoria'),
    })
});

export type ILoginDTO = z.infer<typeof loginSchema>['body'];