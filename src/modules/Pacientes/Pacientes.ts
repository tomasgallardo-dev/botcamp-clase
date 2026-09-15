// ============================================================
//  MODELO: Paciente
//  Define el SCHEDULE (esquema) de un paciente en MongoDB.
//  Mongoose usa esto para:
//    - Validar documentos en el momento de guardar (required, enum, match...)
//    - Convertir el JSON recibido del frontend en algo que Mongo entienda
//  Cada par  propiedad: { type, required, ... }  se llama "field schema".
//  Este archivo EXPORTA el modelo con module.exports (CommonJS), por eso
//  el controller lo importa con:  const Paciente = require('./Pacientes');
// ============================================================

import { Schema, model, Document } from 'mongoose';
import IPaciente from './types/Paciente.interface';

// new Schema({...}) describe la forma que tendrán los documentos.
const pacientesSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre del paciente es obligatorio'], // required con [bool, mensaje]
        uppercase: true,        // mongoose transforma el valor a mayúsculas ANTES de guardar
    },
    apellido: {
        type: String,
        required: [true, 'El apellido del pacinete es obligatorio'],
        uppercase: true,
    },
    dni: {
        type: String,
        required: [true, 'El DNI del paciente es obligatorio'],
        match: [/^[0-9]{7,8}$/, 'El DNI debe contener entre 7 y 8 dígitos'], // validación con regex
    },
    fechaNacimiento: {
        type: Date,
        required: [true, 'La fecha de nacimiento del paciente es obligatoria'],
        // validate = validación PERSONALIZADA (función que devuelve true/false).
        validate: {
            // value es el dato que se está escribiendo.
            validator: function(value: Date) {
                // No se puede nacer en el futuro.
                return value <= new Date();
            },
            message: 'La fecha de nacimiento debe ser una fecha pasada',
        },
    },
    sexo: {
        type: String,
        required: [true, 'El sexo del paciente es obligatorio'],
        enum: {                       // whitelist: solo admite estos valores
            values: ['Masculino', 'Femenino', 'Otro'],
            message: 'El sexo debe ser Masculino, Femenino u Otro'
        },
    },
    // Subdocumento: "direccion" NO es una colección aparte, vive adentro
    // del documento paciente. mongoose lo anida automáticamente.
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
        unique: [true, 'El correo electrónico ya está registrado'], // índice único -> error 11000 al duplicar
        match: [/\S+@\S+\.\S+/, 'El correo electrónico debe tener un formato válido'],
    },
    historialMedico: {
        obraSocial: {
            type: String,
            // SIN enum a propósito: el frontend permite escribir obras sociales
            // nuevas (no solo las 8 de OBRAS_SOCIALES). Solo se exige que exista.
            required: true,
            uppercase: true,
            // set = FUNCIÓN de transformación: corre sobre el valor ANTES
            // de guardarlo. Acá normalizamos: sin acentos + mayúsculas.
            // (ej: "Swiss Medical" -> "SWISS MEDICAL", "IóSFA" -> "IOSFA")
            set: function(value: string) {
                return value
                    .normalize('NFD')                 // separa acentos en letra + acento
                    .replace(/[\u0300-\u036f]/g, '')  // elimina los "acentos sueltos"
                    .toUpperCase();
            }
        },
        numAfiliado: {
            type: String,
            // required condicional: es obligatorio SOLO si la persona tiene obra social.
            // OJO: `this` acá NO es la función, es el documento en construcción.
            required: [
                function(this: any) {
                    return this.historialMedico.obraSocial !== 'NINGUNA';
                },
                'El número de afiliado es obligatorio si tiene obra social',
            ],
        },
        // Array de subdocumentos: cada consulta es un objeto dentro de historialMedico.
        consultas: [
            {
                fecha: {
                    type: Date,
                    default: Date.now   // si no se manda, toma la fecha actual
                },
                diagnostico: {
                    type: String,
                    required: [true, 'El diagnostico es obligatorio...'],
                },
                tratamiento: {
                    type: String,
                },
                medico: {
                    type: String,
                    required: [true, 'Poner el nombre del medico/a que se va a atender']
                }
            }
        ]
    },
});

//

// VIRTUAL: campo CALCULADO que NO se guarda en la base. Se arma al leer
// el documento. Acá se calcula la edad a partir de fechaNacimiento.
// (viene de la feature "Pacientes: edad virtual calculada")
pacientesSchema.virtual('edad').get(function () {
    if (!this.fechaNacimiento) return null;
    const hoy = new Date();
    const nacimiento = new Date(this.fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    // Si todavía no cumplió años este año, restamos 1.
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) edad--;
    return edad;
});

// toJSON: mongoose llama a este transform cuando convierte el documento a
// JSON (por ejemplo al mandarlo como respuesta). Acá normalizamos el shape:
//   _id -> id   (los clientes siempre usan "id")
// y borramos la versión interna del documento (__v).
pacientesSchema.set('toJSON', {
    virtuals: true,                    // incluye los campos virtuales (edad) en el JSON
    transform: (documento: any, pacienteRetorno: any) => {
        pacienteRetorno.id = pacienteRetorno._id;
        delete pacienteRetorno._id;
        delete pacienteRetorno.__v;
        return pacienteRetorno;
    }
});

// Crea y exporta el modelo. El 3er argumento "pacientes" fija el nombre de
// la colección en Mongo (si no va, mongoose lo pluraliza solo).
module.exports = model('Paciente', pacientesSchema, 'pacientes');