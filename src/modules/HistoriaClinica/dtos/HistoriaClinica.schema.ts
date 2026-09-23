/* ============================================================
    HistoriaClinica.schema.ts   (reemplaza a HistoriaClinicaDTO.ts)
    Body de POST /api/v1/historias-clinicas validado con zod +
    tipo del query de GET (?pacienteId&?medicoId&?fecha&?sintomas).
    `fecha` admite cualquier fecha (registro histórico, sin futuro).
 ============================================================ */
import { z } from 'zod';

const ObjectIdRegex = /^[0-9a-fA-F]{24}$/;

// Subdocumento anidado (igual que en el modelo): todo opcional con arrays.
const antecedentesSchema = z.object({
    alergias: z.array(z.string()).optional(),
    enfermedadesCronicas: z.array(z.string()).optional(),
    medicamentosHabituales: z.array(z.string()).optional(),
    cirugiasPrevias: z.array(z.string()).optional(),
    internacionesPrevias: z.array(z.string()).optional(),
    antecedentesFamiliares: z.array(z.string()).optional(),
    vacunas: z.array(z.string()).optional(),
    habitos: z.object({
        tabaquismo: z.boolean().optional(),
        alcohol: z.boolean().optional(),
        actividadFisica: z.enum(['Ninguna', 'Baja', 'Moderada', 'Alta']).optional(),
    }).optional(),
    otros: z.string().max(500, 'Los otros no pueden superar los 500 caracteres').optional(),
});

export const crearHistoriaClinicaSchema = z.object({
    body: z.object({
        paciente: z.string({ error: 'El ID del paciente es obligatorio' })
            .regex(ObjectIdRegex, 'El paciente debe ser un ObjectId válido'),
        medico: z.string().regex(ObjectIdRegex, 'El médico debe ser un ObjectId válido').optional(),
        fecha: z.iso.date({ error: 'formato de fecha invalido' }),
        antecedentes: antecedentesSchema.optional(),
        motivoConsulta: z.string({ error: 'El motivo de la consulta es obligatorio' }).min(1, 'El motivo de la consulta es obligatorio'),
        sintomas: z.array(z.string()).optional(),
        diagnostico: z.string({ error: 'El diagnóstico es obligatorio' }).min(1, 'El diagnóstico es obligatorio'),
        tratamiento: z.string({ error: 'El tratamiento es obligatorio' }).min(1, 'El tratamiento es obligatorio'),
        observaciones: z.string().max(500, 'Las observaciones no pueden superar los 500 caracteres').optional(),
    })
});

// Query de GET /historias-clinicas (los GET no pasan por validarSchema,
// pero el controller usa este tipo para tipar req.query).
export const filtroHistoriaClinicaQuerySchema = z.object({
    query: z.object({
        pacienteId: z.string().optional(),
        medicoId: z.string().optional(),
        fecha: z.string().optional(),
        sintomas: z.string().optional(),   // llega "a,b,c", el controller lo parte por coma
    })
});

export type ICrearHistoriaClinicaDTO = z.infer<typeof crearHistoriaClinicaSchema>['body'];
export type IFiltroHistoriaClinicaQuery = z.infer<typeof filtroHistoriaClinicaQuerySchema>['query'];