// ============================================================
//  MODELO: Turno
//  Relaciona un PACIENTE con una ESPECIALIDAD/medico en una fecha.
//  OJO con la especialidad: en Turno es STRING (lowercase, enum),
//  mientras que en Medico/Consultorio es REFERENCIA (ObjectId) a
//  la colección Especialidad. Son "dos mundos" distintos (pendiente).
// ============================================================

import { Schema, model, Document } from 'mongoose';
import ITurno from './types/Turno.interface';
import { TurnoEstado } from './types/TurnoEstado.enum';
import { EspecialidadTurno } from './types/TurnoEspecialidad.const';

const turnoSchema = new Schema<ITurno>({
    paciente: {
        // ObjectId + ref = RELACIÓN (referencia) a la colección Pacientes.
        // Guardamos el ID de otro documento, no el documento completo.
        type: Schema.Types.ObjectId,
        ref: 'Paciente',
        required: [true, 'El nombre del paciente es obligatorio'],
    },
    especialidad: {
        type: String,   // mundo STRING: guardamos el nombre de la especialidad
        required: true,
        lowercase: true, // todo a minúsculas al guardar
        enum: {          // solo admite los valores de TurnoEspecialidad.const.ts
            values: EspecialidadTurno,
            message: '{VALUE} no es una especialidad válida',
        },
        // Normaliza: saca los acentos (ej: "cardiología" -> "cardiologia")
        // para que coincida con la lista del enum.
        set: function(value: string) {
            if (!value) return value;
            return value
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '');
        }
    },
    fechaTurno: {
        type: Date,
        required: [true, 'La fecha del turno es obligatoria'],
        validate: {
            validator: function(value: Date) {
                return value >= new Date();  // el turno no puede ser en el pasado
            },
            message: 'La fecha del turno debe ser una fecha futura',
        },
    },
    medico: {
        // Referencia a la colección Medicos. Opcional (default null):
        // un turno puede crearse sin médico asignado (guardia, etc.).
        type: Schema.Types.ObjectId,
        ref: 'Medico',
        default: null,
    },
    estado: {
        type: String,
        enum: {
            values: Object.values(TurnoEstado), // toma los valores del enum (pendiente/atendido/cancelado)
            message: '{VALUE} no es un estado válido',
        },
        default: TurnoEstado.PENDIENTE,
    },

    observaciones: {
        type: String,
        maxlength: [500, 'Las observaciones no pueden superar los 500 caracteres']
    },
    activo: {
        type: Boolean,
        default: true,
        select: false    // SOFT DELETE: el campo existe pero NO se devuelve al leer
                         // por defecto. Borrar un turno = poner activo:false.
    }
}, {
    timestamps: true,    // mongoose agrega y mantiene createdAt / updatedAt solo
});

// Misma normalización que en los otros modelos: _id -> id, sin __v.
turnoSchema.set('toJSON', {
    transform: (documento: Document, turnoRetorno: Record<string, any>) => {
        turnoRetorno.id = turnoRetorno._id;
        delete turnoRetorno._id;
        delete turnoRetorno.__v;
        return turnoRetorno;
    }
});

module.exports = model('Turno', turnoSchema);