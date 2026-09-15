// ============================================================
//  Interfaz de Turno: forma del documento guardado en "turnos".
//  Solamente tipos (se borra al compilar); la validación real la hace
//  el schema (Turno.ts).
// ============================================================

import type { Types } from 'mongoose';
import { EspecialidadTurno } from './TurnoEspecialidad.const';  // tipo derivado de la lista
import { TurnoEstado } from './TurnoEstado.enum';               // tipo derivado del enum

interface ITurno {
    _id?: Types.ObjectId;
    paciente: Types.ObjectId;      // referencia a un documento Paciente
    especialidad: EspecialidadTurno;
    fechaTurno: Date;
    medico?: Types.ObjectId | null; // referencia a un documento Medico (opcional)
    estado?: TurnoEstado;
    observaciones?: string;
    activo?: boolean;               // soft delete
    createdAt?: Date;
}

export default ITurno;