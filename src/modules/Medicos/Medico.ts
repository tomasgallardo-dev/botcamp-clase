// ============================================================
//  MODELO: Medico
//  Cada médico pertenece a una Especialidad.
//  OJO: `especialidad` es una REFERENCIA (ObjectId) a la colección
//  Especialidad. Por eso al listar hay que hacer .populate('especialidad')
//  para que en vez del ID devuelva el documento completo.
// ============================================================

import { Schema, model } from 'mongoose';

const medicoSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre del médico es obligatorio'],
        uppercase: true,
    },
    matricula: {
        type: String,
        required: [true, 'La matrícula es obligatoria'],
        unique: [true, 'Esta matrícula ya está registrada'], // duplicado -> 409
    },
    especialidad: {
        type: Schema.Types.ObjectId,  // guarda el _id de un documento Especialidad
        ref: 'Especialidad',           // <-- la colección referenciada
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
        // NO usa select:false -> al borrar se hace delete duro (findByIdAndDelete).
    },
}, {
    timestamps: true,
});

// Misma normalización _id -> id que en los demás modelos.
medicoSchema.set('toJSON', {
    transform: (documento: any, medicoRetorno: any) => {
        medicoRetorno.id = medicoRetorno._id;
        delete medicoRetorno._id;
        delete medicoRetorno.__v;
        return medicoRetorno;
    }
});

module.exports = model('Medico', medicoSchema);