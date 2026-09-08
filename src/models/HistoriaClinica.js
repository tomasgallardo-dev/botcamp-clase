const mongoose = require('mongoose');

// Definimos el esquema de la colección "historiaclinicas" en MongoDB.
const HistoriaClinicaSchema = new mongoose.Schema({
    paciente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Paciente',
        required: [true, 'El ID del paciente es obligatorio'],
    },
    medico: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Medico',
    },
    fecha: {
        type: Date,
        required: [true, 'La fecha del historia clinica es obligatoria'],
    },

    antecedentes: {
        // Alergias que tiene el paciente (arreglo de textos, ej: ['Penicilina'])
        alergias: {
            type: [String],
            default: []
        },
        // Enfermedades crónicas (ej: ['Diabetes', 'Hipertensión'])
        enfermedadesCronicas: {
            type: [String],
            default: []
        },
        // Medicamentos que toma habitualmente
        medicamentosHabituales: {
            type: [String],
            default: []
        },
        // Cirugías que le realizaron en el pasado
        cirugiasPrevias: {
            type: [String],
            default: []
        },
        // Internaciones hospitalarias previas
        internacionesPrevias: {
            type: [String],
            default: []
        },
        // Antecedentes familiares de enfermedades
        antecedentesFamiliares: {
            type: [String],
            default: []
        },
        // Vacunas aplicadas
        vacunas: {
            type: [String],
            default: []
        },
        // Hábitos del paciente (tabaquismo, alcohol, actividad física)
        habitos: {
            // ¿Fuma? true/false
            tabaquismo: {
                type: Boolean,
                default: false
            },
            // ¿Consume alcohol? true/false
            alcohol: {
                type: Boolean,
                default: false
            },
            // Nivel de actividad física: Ninguna, Baja, Moderada o Alta
            actividadFisica: {
                type: String,
                enum: ['Ninguna', 'Baja', 'Moderada', 'Alta'],
                default: 'Ninguna'
            }
        },
        // Otros antecedentes relevantes (máximo 500 caracteres)
        otros: {
            type: String,
            maxlength: 500
        }
    },

    motivoConsulta: {
        type: String,
        required: [true, 'El motivo de la consulta es obligatorio']
    },
    sintomas: {
        type: [String],
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
        select: false
    },

}, {
    timestamps: true,
});

HistoriaClinicaSchema.set('toJSON', {
    transform: (documento, historiaClinicaRetorno) => {
        historiaClinicaRetorno.id = historiaClinicaRetorno._id;
        delete historiaClinicaRetorno._id;
        delete historiaClinicaRetorno.__v;
    }
});

module.exports = mongoose.model('HistoriaClinica', HistoriaClinicaSchema);