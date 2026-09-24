// Turno.schema.ts -> valida el body de POST /turnos (paciente, especialidad,
// fecha, medico, urgencia). Lo usa Turno.routes.ts via validarSchema.
import { z } from 'zod';
import { EspecialidadTurno } from '../types/TurnoEspecialidad.const';
import { TurnoEstado } from '../types/TurnoEstado.enum';

// Expresión regular para validar ObjectId de MongoDB
const ObjectIdRegex = /^[0-9a-fA-F]{24}$/;

// esquema de validación para crear un turno
export const CrearTurnoSchema = z.object({

        body: z.object({

        paciente: z.string({ error: 'El ID del paciente es obligatorio' }).min(1, "El ID del paciente es obligatorio"),

        especialidad: z.enum(EspecialidadTurno, { error: 'La especialidad no es válida' }),
        
        fechaTurno: z.string({ error: 'La fecha del turno es obligatoria' }).refine(
            (value) => !isNaN(new Date(value).getTime()),
            { error: 'La fecha del turno no es válida' }
        ),
        
        medico: z.string().regex(ObjectIdRegex).nullish(),  // opcional o null

        estado: z.enum(TurnoEstado, {
            error: "Estado de turno no valido"
        }).optional(), 

        urgente: z.boolean().optional(),

        
    }),

    query: z.object({
        urgencia: z.enum(['true', 'false']).optional()
    })
});

export type ICrearTurnoDTO = z.infer<typeof CrearTurnoSchema>['body'];
export type IQueryUrgencia = z.infer<typeof CrearTurnoSchema>['query'];