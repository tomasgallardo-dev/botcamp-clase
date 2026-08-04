// ============================================================
//  CONTROLADOR: Turnos
//  Descripción: Lógica de negocio de los turnos (listar, crear,
//  eliminar, filtrar por especialidad, actualizar).
//  NOTA: Esta es la versión MÁS COMPLETA (unifica master + rama
//  feature/especialidades que solo tenía getTurnos, createTurno,
//  deleteTurno).
// ============================================================

// aca se definen los controladores para manejar las rutas relacionadas con los turnos
const Turno = require('../models/Turno.js');
const respuestaEstandar = require('../utils/respuestaEstandar.js')


// Controlador para obtener todos los turnos
const getTurnos = async (req, res) => {
    try {
        const turnos = await Turno.find({ activo: true })
            .populate('paciente');

        return respuestaEstandar(res, 200, true, 'Turnos obtenidos exitosamente', turnos);
    } catch (error) {
        return respuestaEstandar(res, 500, false, 'Error interno del servidor', error.message);
    }
};
// Controlador para crear un nuevo turno usando el try catch para manejar errores de validación y errores internos del servidor
const createTurno = async (req, res) => {
    try {

        const origenPeticion = req.headers['x-origen'];
        const tokenSeguridad = req.headers['authorization'];

        console.log("🌎 Peticion realizada desde:", origenPeticion);

        if (tokenSeguridad != 'token123') {
            return respuestaEstandar(res, 401, false, 'no tiene permisos');
        }
        
        const esUrgente = req.query.urgencia === 'true';

        const datosDelTurno = {
            paciente: req.body.paciente,
            especialidad: req.body.especialidad,
            fechaTurno: req.body.fechaTurno
        };

        if (esUrgente) {
            datosDelTurno.estado = 'atendido';
            datosDelTurno.observaciones = 'ingreso por guardia medica';
            console.log("ALERTA: registrado un turno de urgencia");
        }

        const nuevoTurno = await Turno.create(datosDelTurno);
        return respuestaEstandar(res, 201, true, 'Turno creado exitosamente', nuevoTurno);
    } catch (error) {
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
        const turnoEliminado = await Turno.findByIdAndUpdate(
            id,
            { activo: false },
            { new: true }
        );
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