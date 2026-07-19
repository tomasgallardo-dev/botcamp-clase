const Paciente = require('../models/Pacientes.js');

const respuestaEstandar = (res, status, success, message, data = null) => {
    return res.status(status).json({
        success,
        timestamp: new Date().toISOString(),
        message,
        total: Array.isArray(data) ? data.length : data ? 1 : 0,
        data,
    });
};

// controlador para obtener todos los pacientes
const getPacientes = async (req, res) => {
    try {
        const pacientes = await Paciente.find();

        return respuestaEstandar (res, 200, true, 'Pacientes obtenidos exitosamente', pacientes)
    } catch (error) {
        return respuestaEstandar (res, 500, false, 'Error interno del servidor', error.message);
    }
};

// Controlador para crear un nuevo paciente
const createPaciente = async (req, res) => {
    try {
        const nuevoPaciente = await Paciente.create(req.body);
        return respuestaEstandar(res, 201, true, 'Paciente creado exitosamente', nuevoPaciente);
    } catch (error) {
        if (error.name === 'ValidationError') {
                    const errores = Object.values(error.errors).map(err => err.message);
                    return respuestaEstandar(res, 400, false, 'Error de validación', errores);
    }

        return respuestaEstandar(res, 500, false, 'Error interno del servidor', error.message);
    }
};

// Controlador para eliminar un paciente por su ID
const deletePaciente = async (req, res) => {
    try {
        const { id } = req.params;
        const pacienteEliminado = await Paciente.findByIdAndDelete(id);

        if (!pacienteEliminado) {
            return respuestaEstandar(res, 404, false, `Paciente no encontrado con ID ${id}`);
        }

        return respuestaEstandar(res, 200, true, 'Paciente eliminado exitosamente', pacienteEliminado);
    } catch (error) {
        return respuestaEstandar(res, 500, false, 'Error interno del servidor', error.message);
    }
};

module.exports = { getPacientes, createPaciente, deletePaciente};