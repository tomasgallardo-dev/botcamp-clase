const mongoose = require('mongoose');

const especialidadSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'La especialidad del médico es obligatorio'],
        uppercase: true,
        unique: [true, 'Esta especialidad ya está registrada'],
    },
    descripcion: {
        type: String,
        default: '',
    },
}, {
    timestamps: true,
});

especialidadSchema.set('toJSON', {
    transform: (documento, especialidadRetorno) => {
        especialidadRetorno.id = especialidadRetorno._id;
        delete especialidadRetorno._id;
        delete especialidadRetorno.__v;
        return especialidadRetorno;
    }
});

module.exports = mongoose.model('Especialidad', especialidadSchema);