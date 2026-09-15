// ============================================================
//  MODELO: Especialidad
//  Colección de especialidades médicas (cardiologia, pediatria, ...).
//  OJO "dos mundos": acá el nombre es ÚNICO y va en mayúsculas.
//  Medico y Consultorio hacen ref (ObjectId) a esta colección; el modelo
//  Turno en cambio guarda la especialidad como STRING en minúsculas.
// ============================================================

import { Schema, model } from 'mongoose';

const especialidadSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'La especialidad del médico es obligatorio'],
        uppercase: true,
        unique: [true, 'Esta especialidad ya está registrada'], // duplicado -> error 11000 -> 409
    },
    descripcion: {
        type: String,
        default: '',   // si no se manda, queda string vacío
    },
}, {
    timestamps: true,
});

// Misma normalización _id -> id que en todos los modelos.
especialidadSchema.set('toJSON', {
    transform: (documento: any, especialidadRetorno: any) => {
        especialidadRetorno.id = especialidadRetorno._id;
        delete especialidadRetorno._id;
        delete especialidadRetorno.__v;
        return especialidadRetorno;
    }
});

module.exports = model('Especialidad', especialidadSchema);