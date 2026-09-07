const mongoose = require('mongoose');

const consultorioSchema = new mongoose.Schema({
    medico: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Medico',
        required: [true, 'El nombre del médico es obligatorio'],
    },
    especialidad: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Especialidad',
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
    telefono: {
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
        unique: [true, 'El correo electrónico del consultorio debe ser único'],
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'El correo electrónico no es válido']
    }
}, {
    timestamps: true,
});

// ✅ AGREGADO: Transformar _id → id
consultorioSchema.set('toJSON', {
    transform: (documento, consultorioRetorno) => {
        consultorioRetorno.id = consultorioRetorno._id;
        delete consultorioRetorno._id;
        delete consultorioRetorno.__v;
        return consultorioRetorno;
    }
});

module.exports = mongoose.model('Consultorio', consultorioSchema);