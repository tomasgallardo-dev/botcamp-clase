const mongoose = require('mongoose');

const pacientesSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre del paciente es obligatorio'],
        uppercase: true,
    },

    dni: {
        type: String,
        required: [true, 'El DNI del paciente es obligatorio'],
        match: [/^[0-9]{7,8}$/, 'El DNI debe contener entre 7 y 8 dígitos'],
    },
    fechaNacimiento: {
        type: Date,
        required: [true, 'La fecha de nacimiento del paciente es obligatoria'],
        validate: {
            validator: function(value) {
                return value <= new Date();
            },
            message: 'La fecha de nacimiento debe ser una fecha pasada',
        },
    },
    sexo: {
        type: String,
        required: [true, 'El sexo del paciente es obligatorio'],
        enum: {
            values: ['Masculino', 'Femenino'],
            message: 'El sexo debe ser Masculino o Femenino'
        },
    },

    direccion: {
        calle:{
            type: String,
            required: [true, 'La calle es obligatoria'],
            uppercase: true,
        },
        numero: {
            type: String,
            required: [true, 'El número de la dirección es obligatorio'],
        },
        ciudad: {
            type: String,
            required: [true, 'La ciudad es obligatoria'],
        },
        provincia: {
            type: String,
            required: [true, 'La provincia es obligatoria'],
        }
    },

    telefono: {
        codpais: {
            type: String,
            required: [true, 'El código de país es obligatorio'],
            match: [/^\+\d{1,3}$/, 'El código de país debe comenzar con + seguido de 1 a 3 dígitos'],
        },
        codigoArea: {
            type: String,
            required: [true, 'El código de área es obligatorio'],
            match: [/^\d{1,4}$/, 'El código de área debe contener entre 1 y 4 dígitos'],
        },
        numero: {
            type: String,
            required: [true, 'El número de teléfono es obligatorio'],
            match: [/^\d{6,9}$/, 'El número de teléfono debe contener entre 6 y 9 dígitos'],
        },
    },
    correoelectronico: {
        type: String,
        required: [true, 'El correo electrónico es obligatorio'],
        unique: [true, 'El correo electrónico ya está registrado'],
        match: [/\S+@\S+\.\S+/, 'El correo electrónico debe tener un formato válido'],
    },
    historialMedico: {
        obraSocial: {
            type: String,
            enum: {
                values: ['OSDE', 'PAMI','SWISS MEDICAL', 'GALENO', 'MEDIFE','IOSFA', 'OTRO', 'NINGUNA'],
                message: '{VALUE} no es una obra social válida'
            },
            required: true,
            uppercase: true,
            set: function(value) {
                return value
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '')
                    .toUpperCase();
            }
        },

        numAfiliado: {
            type: String,
            required: [
                function() {
                    return this.historialMedico.obraSocial !== 'NINGUNA';
                },
                'El número de afiliado es obligatorio si tiene obra social',
            ],
        },

        gruposSanguineos: {
            type: String,
            enum: {
                values: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
                message: '{VALUE} no es un grupo sanguíneo válido',
            },
        },
        alergias: {
            type: [String],
            default: [],
        },
        enfermedadesPrevias: {
            type: [String],
            default: [],
        },
    },
});

module.exports = mongoose.model('Paciente', pacientesSchema, 'pacientes');