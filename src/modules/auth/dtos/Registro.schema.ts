/* ============================================================
    Registro.schema.ts
    Body de POST /api/v1/auth/registro validado con zod.
    `rol` es opcional: si no va, el modelo asigna RECEPCIONISTA.
 ============================================================ */
import { z } from 'zod';

export const registroSchema = z.object({
    body: z.object({
        email: z.email({ error: 'Email invalido' }),
        user: z.string({ error: 'El nombre de usuario es obligatorio' }).min(3, 'El nombre de usuario debe tener al menos 3 caracteres'),
        password: z.string({ error: 'La contraseña es obligatoria' }).min(6, 'La contraseña debe tener al menos 6 caracteres'),
        rol: z.enum(['ADMIN', 'RECEPCIONISTA']).optional(),
    })
});

export type IRegistroDTO = z.infer<typeof registroSchema>['body'];