// ============================================================
//  MODELO: Consultorio
//  Un consultorio físico: le asignamos un médico y una especialidad
//  (ambos por REFERENCIA -> hay que .populate() al leer), más datos
//  de ubicación y contacto.
// ============================================================

import { Schema, model } from 'mongoose';

const consultorioSchema = new Schema({
    medico: {
        type: Schema.Types.ObjectId,  // referencia
        ref: 'Medico',                 // a la colección Medicos
        required: [true, 'El nombre del médico es obligatorio'],
    },
    especialidad: {
        type: Schema.Types.ObjectId,  // referencia
        ref: 'Especialidad',           // a la colección Especialidades
        required: [true, 'La especialidad es obligatoria'],
    },
    numeroConsultorio: {
        type: String,
        required: [true, 'El número de consultorio es obligatorio'],
        match: [/^[0-9]{1,3}$/, 'El número de consultorio no es válido'],
    },
    piso: {
        type: String,
        required: [true, 'El piso es obligatorio'],
        match: [/^[0-9]{1,2}$/, 'El piso no es válido'],
    },
    direccion: {
        type: String,
        required: [true, 'La dirección es obligatoria'],
    },
    telefono: {            // subdocumento anidado (igual que en Paciente)
        codigoArea: {
            type: String,
            required: true,
            match: [/^[0-9]{2,5}$/, 'El código de área no es válido']
        },
        numero: {
            type: String,
            required: true,
            match: [/^[0-9]{7,10}$/, 'El número de teléfono no es válido']
        },
    },
    email: {
        type: String,
        required: [true, 'El correo electrónico del consultorio es obligatorio'],
        unique: [true, 'El correo electrónico del consultorio debe ser único'], // duplicado -> 409
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'El correo electrónico no es válido']
    }
}, {
    timestamps: true,
});

// Misma normalización _id -> id que en los demás modelos.
consultorioSchema.set('toJSON', {
    transform: (documento: any, consultorioRetorno: any) => {
        consultorioRetorno.id = consultorioRetorno._id;
        delete consultorioRetorno._id;
        delete consultorioRetorno.__v;
        return consultorioRetorno;
    }
});

module.exports = model('Consultorio', consultorioSchema);