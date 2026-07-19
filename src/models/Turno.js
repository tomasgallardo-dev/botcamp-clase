const mongoose = require('mongoose');
//aca se define el modelo de datos para los turnos, con sus respectivos campos y validaciones
const turnoSchema = new mongoose.Schema({
    paciente: {
        type: String,
        required: [true, 'El nombre del paciente es obligatorio'],
        uppercase: true,
    },
    dni: {
        type: String,
        required: [true, 'El DNI del paciente es obligatorio'],
        match: [/^[0-9]{8,10}$/, 'El DNI debe contener entre 8 y 10 dígitos'],
    },
    especialidad: {
        type: String,
        required: true,
        lowercase: true, 
        enum: {
            values: ['cardiologia', 'dermatologia', 'clinica medica',  'pediatria','neurologia', 'traumatologia', 'odontologia', 'oftalmologia', 'ginecologia', 'psiquiatria','geriatria', 'endocrinologia', 'gastroenterologia', 'urologia', 'otorrinolaringologia', 'reumatologia', 'neumonologia', 'oncologia', 'hematologia', 'inmunologia', 'infectologia', 'bacteriologia'],
            message: '{VALUE} no es una especialidad válida',
        },
    },
    fechaTurno: {
        type: Date,
        required: [true, 'La fecha del turno es obligatoria'],
        validate: {
            validator: function(value) {
                return value >= new Date();
            },
            message: 'La fecha del turno debe ser una fecha futura',
        },
    },
    estado: {
        type: String,
        enum: {
            values: ['pendiente', 'atendido', 'cancelado'],
            message: '{VALUE} no es un estado válido',
        },
    }, 
}, {
        timestamps: true,
});

turnoSchema.set('toJSON', {
    transform: (documento, turnoRetorno) => {
        turnoRetorno.id = turnoRetorno._id;
        delete turnoRetorno._id;
        delete turnoRetorno.__v;
    }
});

module.exports = mongoose.model('Turno', turnoSchema);