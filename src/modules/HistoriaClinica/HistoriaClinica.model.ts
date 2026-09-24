// ============================================================
//  MODELO: HistoriaClinica
//  Registro clínico de un paciente (una consulta = un documento).
//  Relación con Paciente por referencia (ObjectId).
//  IGUAL que Turno: usa SOFT DELETE (campo `activo` con select:false),
//  borrar = poner activo:false en vez de borrar el documento.
// ============================================================

import { Schema, model } from 'mongoose';

const HistoriaClinicaSchema = new Schema({
    paciente: {
        type: Schema.Types.ObjectId,  // referencia
        ref: 'Paciente',
        required: [true, 'El ID del paciente es obligatorio'],
    },
    medico: {
        type: Schema.Types.ObjectId,  // referencia (opcional)
        ref: 'Medico',
    },
    fecha: {
        type: Date,
        required: [true, 'La fecha de la historia clínica es obligatoria'],
        // NOTA: acá NO hay validación de fecha futura (se corrigió: admite
        // cualquier fecha, incluso pasada, porque es un registro histórico).
    },
    // antecedentes = subdocumento agrupador (vive dentro del documento).
    // Cada campo es un array de strings con default [] (si no llega, []).
    antecedentes: {
        alergias: { type: [String], default: [] },
        enfermedadesCronicas: { type: [String], default: [] },
        medicamentosHabituales: { type: [String], default: [] },
        cirugiasPrevias: { type: [String], default: [] },
        internacionesPrevias: { type: [String], default: [] },
        antecedentesFamiliares: { type: [String], default: [] },
        vacunas: { type: [String], default: [] },
        habitos: {
            tabaquismo: { type: Boolean, default: false },
            alcohol: { type: Boolean, default: false },
            actividadFisica: {
                type: String,
                enum: ['Ninguna', 'Baja', 'Moderada', 'Alta'],
                default: 'Ninguna'
            }
        },
        otros: { type: String, maxlength: 500 }
    },
    motivoConsulta: {
        type: String,
        required: [true, 'El motivo de la consulta es obligatorio']
    },
    sintomas: {
        type: [String],   // array de strings
        default: []
    },
    diagnostico: {
        type: String,
        required: [true, 'El diagnóstico es obligatorio'],
    },
    tratamiento: {
        type: String,
        required: [true, 'El tratamiento es obligatorio'],
    },
    observaciones: {
        type: String,
        maxlength: [500, 'Las observaciones no pueden superar los 500 caracteres'],
    },
    activo: {
        type: Boolean,
        default: true,
        select: false    // soft delete: no se devuelve al leer; se filtra por activo:true
    },
}, {
    timestamps: true,
});

// Misma normalización _id -> id que en los demás modelos.
HistoriaClinicaSchema.set('toJSON', {
    transform: (documento: any, historiaClinicaRetorno: any) => {
        historiaClinicaRetorno.id = historiaClinicaRetorno._id;
        delete historiaClinicaRetorno._id;
        delete historiaClinicaRetorno.__v;
        return historiaClinicaRetorno;
    }
});

module.exports = model('HistoriaClinica', HistoriaClinicaSchema);