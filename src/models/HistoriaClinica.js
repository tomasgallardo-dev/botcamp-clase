// ============================================================
//  MODELO: HistoriaClinica
//  Descripción: Define la estructura de datos de la historia
//  clínica de cada paciente en la base de MongoDB.
//  Esta historia clínica se crea cuando un paciente es atendido
//  por un médico y queda registrado todo el detalle de la consulta.
// ============================================================

// Importamos mongoose para poder definir el esquema (schema) y el modelo.
const mongoose = require('mongoose');

// Definimos el esquema de la colección "historiaclinicas" en MongoDB.
const HistoriaClinicaSchema = new mongoose.Schema({
    // ----------------------------------------------------------
    // paciente: referencia al modelo "Paciente".
    // Guardamos el ObjectId del paciente al que pertenece esta historia clínica.
    // Con `ref: 'Paciente'` podemos usar .populate() para traer sus datos completos.
    // ----------------------------------------------------------
    paciente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Paciente',
        required: [true, 'El ID del paciente es obligatorio'],
    },

    // ----------------------------------------------------------
    // medico: referencia al modelo "Medico".
    // Guardamos el ObjectId del médico que atendió la consulta.
    // No es obligatorio (puede quedar sin asignar al principio).
    // ----------------------------------------------------------
    medico: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Medico',
    },

    // ----------------------------------------------------------
    // fecha: fecha en la que se realizó la consulta / historia clínica.
    // Obligatoria y debe ser una fecha futura (o actual).
    // ----------------------------------------------------------
    fecha: {
        type: Date,
        required: [true, 'La fecha del historia clinica es obligatoria'],
        validate: {
            validator: function(value) {
                return value >= new Date();
            },
            message: 'La fecha del historia clinica debe ser una fecha futura'
        }
    },

    // ----------------------------------------------------------
    // antecedentes: bloque con los datos históricos del paciente.
    // Se agrupan en un objeto anidado para mantener el orden.
    // ----------------------------------------------------------
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

    // ----------------------------------------------------------
    // motivoConsulta: motivo por el cual el paciente consultó.
    // Es un campo obligatorio.
    // ----------------------------------------------------------
    motivoConsulta: {
        type: String,
        required: [true, 'El motivo de la consulta es obligatorio']
    },

    // ----------------------------------------------------------
    // sintomas: lista de síntomas que presenta el paciente.
    // Ej: ['fiebre', 'tos', 'dolor de cabeza']
    // ----------------------------------------------------------
    sintomas: {
        type: [String],
        default: []
    },

    // ----------------------------------------------------------
    // diagnostico: diagnóstico que determinó el médico.
    // Campo obligatorio.
    // ----------------------------------------------------------
    diagnostico: {
        type: String,
        required: [true, 'El diagnóstico es obligatorio'],
    },

    // ----------------------------------------------------------
    // tratamiento: tratamiento indicado para el paciente.
    // Campo obligatorio.
    // ----------------------------------------------------------
    tratamiento: {
        type: String,
        required: [true, 'El tratamiento es obligatorio'],
    },

    // ----------------------------------------------------------
    // observaciones: notas adicionales del médico (máximo 500 caracteres).
    // No es obligatorio.
    // ----------------------------------------------------------
    observaciones: {
        type: String,
        maxlength: [500, 'Las observaciones no pueden superar los 500 caracteres'],
    },

    // ----------------------------------------------------------
    // activo: sirve para hacer "borrado lógico".
    // En vez de eliminar el registro de la base, se marca como inactivo
    // (activo: false). De esta forma se conserva el historial.
    // `select: false` hace que por defecto NO se traiga en las consultas.
    // ----------------------------------------------------------
    activo: {
        type: Boolean,
        default: true,
        select: false
    },

}, {
    // timestamps: mongoose agrega automáticamente createdAt y updatedAt.
    timestamps: true,
});

// ------------------------------------------------------------
// Configuración del formato de salida (toJSON).
// Cuando express devuelve el documento con res.json(), transforma:
//   - _id  -> id
//   - quita _id y __v (versión interna de mongoose)
// De esta forma la API devuelve un objeto más limpio.
// ------------------------------------------------------------
HistoriaClinicaSchema.set('toJSON', {
    transform: (documento, historiaClinicaRetorno) => {
        historiaClinicaRetorno.id = historiaClinicaRetorno._id;
        delete historiaClinicaRetorno._id;
        delete historiaClinicaRetorno.__v;
    }
});

// Exportamos el modelo "HistoriaClinica" basado en el esquema definido.
module.exports = mongoose.model('HistoriaClinica', HistoriaClinicaSchema);

