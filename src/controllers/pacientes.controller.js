const Paciente = require('../models/Pacientes.model.js');
const respuestaEstandar = require('../utils/respuestaEstandar.js')
const { esErrorDuplicado } = require('../utils/manejoErrores.js')

// controlador para obtener todos los pacientes
const getPacientes = async (req, res) => {
    try {
        const { obraSocial, dni } = req.query;

        const filtro = {};

        if (obraSocial) {
            filtro['historialMedico.obraSocial'] = obraSocial.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
        }

        if (dni) {
            filtro.dni = dni;
        }

        console.log("🟢 Filtro armado:", filtro);

        const pacientes = await Paciente.find(filtro);

        return respuestaEstandar(res, 200, true, 'Pacientes obtenidos exitosamente', pacientes);
    } catch (error) {
        return respuestaEstandar(res, 500, false, 'Error interno del servidor', error.message);
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

        if (esErrorDuplicado(error)) {
            return respuestaEstandar(res, 409, false, 'Ya existe un paciente con ese dato', error.keyValue);
        }

        return respuestaEstandar(res, 500, false, 'Error interno del servidor', error.message);
    }
};

// Controlador para obtener un paciente por su ID
const getPacienteById = async (req, res) => {
    try {
        const { id } = req.params;
        const paciente = await Paciente.findById(id);

        if (!paciente) {
            return respuestaEstandar(res, 404, false, `Paciente no encontrado con ID ${id}`);
        }

        return respuestaEstandar(res, 200, true, 'Paciente obtenido exitosamente', paciente);
    } catch (error) {
        return respuestaEstandar(res, 500, false, 'Error interno del servidor', error.message);
    }
};

// Controlador para actualizar los datos de un paciente
const updatePaciente = async (req, res) => {
    try {
        const { id } = req.params;
        const pacienteActualizado = await Paciente.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true });

        if (!pacienteActualizado) {
            return respuestaEstandar(res, 404, false, `Paciente no encontrado con ID ${id}`);
        }

        return respuestaEstandar(res, 200, true, 'Paciente actualizado exitosamente', pacienteActualizado);
    } catch (error) {
        if (error.name === 'ValidationError') {
            const errores = Object.values(error.errors).map(err => err.message);
            return respuestaEstandar(res, 400, false, 'Error de validación', errores);
        }

        if (esErrorDuplicado(error)) {
            return respuestaEstandar(res, 409, false, 'Ya existe un paciente con ese dato', error.keyValue);
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

//Controlador para actualizar la informacion del paciente
const agregarConsulta = async (req, res) => {
    try {
        const { id } = req.params;
        const datosConsulta = req.body;

        const pacienteActualizado = await Paciente.findByIdAndUpdate(
            id,
            {$push: {"historialMedico.consultas": datosConsulta} },
            {new: true, runValidators: true});

        if (!pacienteActualizado) {
            return respuestaEstandar(res, 404, false, `Paciente no encontrado con ID ${id}`);
        }
        return respuestaEstandar(res, 200, true, 'Se modifico al paciente exitosamente', pacienteActualizado);
    } catch (error) {
    if (error.name === 'ValidationError') {
                    const errores = Object.values(error.errors).map(err => err.message);
                    return respuestaEstandar(res, 400, false, 'Error de validación', errores);
    }

        return respuestaEstandar(res, 500, false, 'Error interno del servidor', error.message);
    }
};

module.exports = { getPacientes, getPacienteById, createPaciente, updatePaciente, deletePaciente, agregarConsulta};