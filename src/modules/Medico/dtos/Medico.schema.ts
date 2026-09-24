/* ============================================================
    Medico.schema.ts   (reemplaza a MedicoDTO.ts)
    Body de POST/PUT /api/v1/medicos validado con zod.
    OJO: `especialidad` es el ObjectId de una colección Especialidad
    (un string cualquiera rompe en Mongo, por eso se exige el formato).
 ============================================================ */
import { z } from 'zod';

const ObjectIdRegex = /^[0-9a-fA-F]{24}$/;

export const crearMedicoSchema = z.object({
    body: z.object({
        nombre: z.string({ error: 'El nombre del médico es obligatorio' }).min(2, 'El nombre del médico es obligatorio'),
        matricula: z.string({ error: 'La matrícula es obligatoria' }).min(1, 'La matrícula es obligatoria'),
        especialidad: z.string({ error: 'La especialidad es obligatoria' })
            .regex(ObjectIdRegex, 'La especialidad debe ser un ObjectId válido'),
        telefono: z.string({ error: 'El teléfono es obligatorio' }).min(1, 'El teléfono es obligatorio'),
        email: z.email({ error: 'Email invalido' }),
    })
});

export const actualizarMedicoSchema = z.object({
    body: crearMedicoSchema.shape.body.partial(),
});

export type ICrearMedicoDTO = z.infer<typeof crearMedicoSchema>['body'];
export type IActualizarMedicoDTO = z.infer<typeof actualizarMedicoSchema>['body'];