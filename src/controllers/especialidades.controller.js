// ============================================================
//  CONTROLADOR: Especialidades
//  Descripción: Lógica de negocio de las especialidades médicas
//  (listar y crear).
//  Agregado por la rama: feature/especialidades
// ============================================================

const Especialidades = require('../models/especialidades.js');
const respuestaEstandar = require('../utils/respuestaEstandar.js');

// Controlador para obtener todos las especialidades
const getEspecialidades = async (req, res) => {
    try {
        const especialidad = await Especialidades.find();
        return respuestaEstandar(res, 200, true, 'Especialidades obtenidos exitosamente', especialidad);
    } catch (error) {
        return respuestaEstandar(res, 500, false, 'Error interno del servidor', error.message);
    }
};

// Controlador para crear una nueva especialidad
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

module.exports = { getEspecialidades, createEspecialidad};