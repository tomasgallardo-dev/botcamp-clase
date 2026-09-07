const Especialidades = require('../models/especialidades.js');
const respuestaEstandar = require('../utils/respuestaEstandar.js');

const getEspecialidades = async (req, res) => {
    try {
        const especialidad = await Especialidades.find();
        return respuestaEstandar(res, 200, true, 'Especialidades obtenidos exitosamente', especialidad);
    } catch (error) {
        return respuestaEstandar(res, 500, false, 'Error interno del servidor', error.message);
    }
};

const createEspecialidad = async (req, res) => {
    try {
        const nuevaEspecialidad = await Especialidades.create(req.body);
        return respuestaEstandar(res, 201, true, 'Especialidad creada exitosamente', nuevaEspecialidad);
    } catch (error) {
        if (error.name === 'ValidationError') {
            const errores = Object.values(error.errors).map(err => err.message);
            return respuestaEstandar(res, 400, false, 'Error de validación', errores);
        }
        return respuestaEstandar(res, 500, false, 'Error interno del servidor', error.message);
    }
};

const updateEspecialidad = async (req, res) => {
    try {
        const { id } = req.params;
        const especialidadActualizada = await Especialidades.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!especialidadActualizada) {
            return respuestaEstandar(res, 404, false, `Especialidad no encontrada con ID ${id}`);
        }

        return respuestaEstandar(res, 200, true, 'Especialidad actualizada exitosamente', especialidadActualizada);
    } catch (error) {
        if (error.name === 'ValidationError') {
            const errores = Object.values(error.errors).map(err => err.message);
            return respuestaEstandar(res, 400, false, 'Error de validación', errores);
        }
        return respuestaEstandar(res, 500, false, 'Error interno del servidor', error.message);
    }
};

// ✅ NUEVO: Eliminar especialidad
const deleteEspecialidad = async (req, res) => {
    try {
        const { id } = req.params;
        const especialidadEliminada = await Especialidades.findByIdAndDelete(id);

        if (!especialidadEliminada) {
            return respuestaEstandar(res, 404, false, `Especialidad no encontrada con ID ${id}`);
        }

        return respuestaEstandar(res, 200, true, 'Especialidad eliminada exitosamente', especialidadEliminada);
    } catch (error) {
        return respuestaEstandar(res, 500, false, 'Error interno del servidor', error.message);
    }
};

module.exports = { getEspecialidades, createEspecialidad, updateEspecialidad, deleteEspecialidad };