// aca se definen los controladores para manejar las rutas relacionadas con los turnos
const Turno = require('../models/Turno.js');
const respuestaEstandar = require('../utils/respuestaEstandar.js')


// Controlador para obtener todos los turnos
const getTurnos = async (req, res) => {
    try {
        const turnos = await Turno.find()
            .populate('paciente');

        return respuestaEstandar(res, 200, true, 'Turnos obtenidos exitosamente', turnos);
    } catch (error) {
        return respuestaEstandar(res, 500, false, 'Error interno del servidor', error.message);
    }
};
// Controlador para crear un nuevo turno usando el try catch para manejar errores de validación y errores internos del servidor
const createTurno = async (req, res) => {
    try {

        const nuevoTurno = await Turno.create(req.body);
        return respuestaEstandar(res, 201, true, 'Turno creado exitosamente', nuevoTurno);
    } catch (error) {
        // si el error es de validación, se devuelve un mensaje de error con los detalles de la validación
        if (error.name === 'ValidationError') {
            const errores = Object.values(error.errors).map(err => err.message);
            return respuestaEstandar(res, 400, false, 'Error de validación', errores);
    }

        return respuestaEstandar(res, 500, false, 'Error interno del servidor', error.message);
    }
};

// Controlador para eliminar un turno por su ID
const deleteTurno = async (req, res) => {
    try {
        const { id } = req.params;
        const turnoEliminado = await Turno.findByIdAndDelete(id);
        // si no se encuentra el turno con el ID proporcionado, se devuelve un mensaje de error
        if (!turnoEliminado) {
            return respuestaEstandar(res, 404, false, `Turno no encontrado con ID ${id}`);
        }
        //si el turno se elimina exitosamente, se devuelve un mensaje de éxito con los datos del turno eliminado
        return respuestaEstandar(res, 200, true, 'Turno eliminado exitosamente', turnoEliminado);
    } catch (error) {
        return respuestaEstandar(res, 500, false, 'Error interno del servidor', error.message);
    }
};
// Controlador para obtener turnos filtrados por especialidad
const getTurnosPorEspecialidad = async (req, res) => {
    try {
        const { especialidad } = req.params;

        const turnos = await Turno.find({ especialidad: especialidad.toLowerCase() });

        if (turnos.length === 0) {
            return respuestaEstandar(res, 404, false, `No se encontraron turnos para la especialidad "${especialidad}"`);
        }

        return respuestaEstandar(res, 200, true, 'Turnos encontrados', turnos);
    } catch (error) {
        return respuestaEstandar(res, 500, false, 'Error interno del servidor', error.message);
    }
};

// Controlador para actualizar un turno completo (PUT)
const updateTurno = async (req, res) => {
    try {
        const { id } = req.params;

        const turnoActualizado = await Turno.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!turnoActualizado) {
            return respuestaEstandar(res, 404, false, `Turno no encontrado con ID ${id}`);
        }

        return respuestaEstandar(res, 200, true, 'Turno actualizado exitosamente', turnoActualizado);
    } catch (error) {
        if (error.name === 'ValidationError') {
            const errores = Object.values(error.errors).map(err => err.message);
            return respuestaEstandar(res, 400, false, 'Error de validación', errores);
        }
        return respuestaEstandar(res, 500, false, 'Error interno del servidor', error.message);
    }
};

// Controlador para actualizar solo la especialidad de un turno (PATCH)
const updateEspecialidad = async (req, res) => {
    try {
        const { id } = req.params;
        const { especialidad } = req.body;

        if (!especialidad) {
            return respuestaEstandar(res, 400, false, 'Debés enviar la especialidad para actualizar');
        }

        const turnoActualizado = await Turno.findByIdAndUpdate(
            id,
            { especialidad },
            { new: true, runValidators: true }
        );

        if (!turnoActualizado) {
            return respuestaEstandar(res, 404, false, `Turno no encontrado con ID ${id}`);
        }

        return respuestaEstandar(res, 200, true, 'Especialidad actualizada exitosamente', turnoActualizado);
    } catch (error) {
        if (error.name === 'ValidationError') {
            const errores = Object.values(error.errors).map(err => err.message);
            return respuestaEstandar(res, 400, false, 'Error de validación', errores);
        }
        return respuestaEstandar(res, 500, false, 'Error interno del servidor', error.message);
    }
};

module.exports = { getTurnos, createTurno, deleteTurno, getTurnosPorEspecialidad, updateTurno, updateEspecialidad };