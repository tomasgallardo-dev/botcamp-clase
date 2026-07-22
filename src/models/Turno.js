const mongoose = require('mongoose');
//aca se define el modelo de datos para los turnos, con sus respectivos campos y validaciones
const turnoSchema = new mongoose.Schema({
    paciente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pacientes',
        required: [true, 'El nombre del paciente es obligatorio'],
    },
    especialidad: {
        type: String,
        required: true,
        lowercase: true,
        enum: {
            values: ['cardiologia', 'dermatologia', 'clinica medica', 'pediatria', 'neurologia', 'traumatologia', 'odontologia', 'oftalmologia', 'ginecologia', 'psiquiatria', 'geriatria', 'endocrinologia', 'gastroenterologia', 'urologia', 'otorrinolaringologia', 'reumatologia', 'neumonologia', 'oncologia', 'hematologia', 'inmunologia', 'infectologia', 'bacteriologia'],
            message: '{VALUE} no es una especialidad válida',
        },
        set: function(value) {
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
        default: 'pendiente',
    },
}, {
    timestamps: true,
});

turnoSchema.set('toJSON', {
    transform: (documento, turnoRetorno) => {
        turnoRetorno.id = turnoRetorno._id;
        delete turnoRetorno._id;
        delete turnoRetorno.__v;
        return turnoRetorno;
    }
});

module.exports = mongoose.model('Turno', turnoSchema);