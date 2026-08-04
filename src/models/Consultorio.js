// ============================================================
//  MODELO: Consultorio
//  Descripción: Define la estructura de datos de los consultorios
//  de la salita municipal. Un consultorio agrupa a un médico con
//  una especialidad y tiene su ubicación física (número, piso,
//  dirección) y datos de contacto (teléfono, email).
// ============================================================

// Importamos mongoose. (Se corrige el typo original "moongose" → "mongoose")
const mongoose = require('mongoose');

// Definimos el esquema de la colección "consultorios" en MongoDB.
const consultorioSchema = new mongoose.Schema({
    // ----------------------------------------------------------
    // medico: referencia al modelo "Medico".
    // Guardamos el ObjectId del médico que atiende en este consultorio.
    // Con `uppercase: true` mongoose transforma el texto a mayúsculas.
    // ----------------------------------------------------------
    medico: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Medico',
        required: [true, 'El nombre del médico es obligatorio'],
        uppercase: true,
    },

    // ----------------------------------------------------------
    // especialidad: referencia al modelo "Especialidad".
    // Guardamos el ObjectId de la especialidad que se atiende aquí.
    // ----------------------------------------------------------
    especialidad: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Especialidad',
        required: [true, 'La especialidad es obligatoria'],
    },

    // ----------------------------------------------------------
    // numeroConsultorio: número identificador del consultorio.
    // Ej: "101". Validación: entre 1 y 3 dígitos.
    // ----------------------------------------------------------
    numeroConsultorio: {
        type: String,
        required: [true, 'El número de consultorio es obligatorio'],
        match: [/^[0-9]{1,3}$/, 'El número de consultorio no es válido'],
    },

    // ----------------------------------------------------------
    // piso: piso donde se encuentra el consultorio.
    // Validación: entre 1 y 2 dígitos.
    // ----------------------------------------------------------
    piso: {
        type: String,
        required: [true, 'El piso es obligatorio'],
        match: [/^[0-9]{1,2}$/, 'El piso no es válido'],
    },

    // ----------------------------------------------------------
    // direccion: dirección física del consultorio.
    // ----------------------------------------------------------
    direccion: {
        type: String,
        required: [true, 'La dirección es obligatoria'],
    },

    // ----------------------------------------------------------
    // telefono: teléfono de contacto del consultorio.
    // Es un objeto anidado con código de área y número.
    // ----------------------------------------------------------
    telefono: {
        // Código de área: entre 2 y 5 dígitos. Ej: "11"
        codigoArea: {
            type: String,
            required: true,
            match: [/^[0-9]{2,5}$/, 'El código de área no es válido']
        },
        // Número de teléfono: entre 7 y 10 dígitos. Ej: "41234567"
        numero: {
            type: String,
            required: true,
            match: [/^[0-9]{7,10}$/, 'El número de teléfono no es válido']
        },
    },

    // ----------------------------------------------------------
    // email: correo electrónico del consultorio.
    // Debe ser único (no puede repetirse) y con formato válido.
    // ----------------------------------------------------------
    email: {
        type: String,
        required: [true, 'El correo electrónico del consultorio es obligatorio'],
        unique: [true, 'El correo electrónico del consultorio debe ser único'],
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'El correo electrónico no es válido']
    }
}, {
    // timestamps: agrega createdAt y updatedAt automáticamente.
    timestamps: true,
});

// Exportamos el modelo "Consultorio" basado en el esquema definido.
module.exports = mongoose.model('Consultorio', consultorioSchema);

