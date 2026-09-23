/* ============================================================
    Recepcion.schema.ts   (reemplaza a RecepcionDTO.ts)
    Valida el body de POST /api/v1/recepcion/ingreso.
    REUTILIZA crearPacienteSchema.shape.body para datosPaciente
    (un schema se compone con otro schema -> DRY, como el profe).
 ============================================================ */
import { z } from 'zod';
import { EspecialidadTurno } from '../../Turno/types/TurnoEspecialidad.const';
import { TurnoEstado } from '../../Turno/types/TurnoEstado.enum';
import { crearPacienteSchema } from '../../Pacientes/dtos/Paciente.Schema';

const ObjectIdRegex = /^[0-9a-fA-F]{24}$/;

// Body de POST /api/v1/recepcion/ingreso (paciente + turno juntos).
export const registrarIngresoSchema = z.object({
    body: z.object({
        datosPaciente: crearPacienteSchema.shape.body,
        especialidad: z.enum(EspecialidadTurno, { error: 'La especialidad no es válida' }),
        fechaTurno: z.iso.date({ error: 'formato de fecha invalido' }),
        estado: z.enum(TurnoEstado, { error: 'El estado de turno no es válido' }).optional(),
        observaciones: z.string().optional(),
        medico: z.string().regex(ObjectIdRegex).nullish(),  // opcional o null
    })
});

export type IRegistrarIngresoDTO = z.infer<typeof registrarIngresoSchema>['body'];