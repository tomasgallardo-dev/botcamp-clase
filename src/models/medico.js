// ============================================================
//  MODELO: Medico
//  Descripción: Define la estructura de datos de los médicos de
//  la salita municipal.
//  Agregado por la rama: feature/medico
//  NOTA: especialidad es un ObjectId que referencia al modelo
//  "Especialidad" (integración con feature/especialidades).
// ============================================================

const mongoose = require('mongoose');

const medicoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre del médico es obligatorio'],
        uppercase: true,
    },
    matricula: {
        type: String,
        required: [true, 'La matrícula es obligatoria'],
        unique: [true, 'Esta matrícula ya está registrada'],
    },
    especialidad: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Especialidad',
        required: true,
        },
    telefono: {
        type: String,
        required: [true, 'El teléfono es obligatorio'],
    },
    email: {
        type: String,
        required: [true, 'El email es obligatorio'],
        unique: [true, 'Este email ya está registrado'],
        match: [/\S+@\S+\.\S+/, 'El email debe tener un formato válido'],
    },
    activo: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});

medicoSchema.set('toJSON', {
    transform: (documento, medicoRetorno) => {
        medicoRetorno.id = medicoRetorno._id;
        delete medicoRetorno._id;
        delete medicoRetorno.__v;
        return medicoRetorno;
    }
});

module.exports = mongoose.model('Medico', medicoSchema);