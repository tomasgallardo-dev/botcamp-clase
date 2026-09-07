const Turno = require('../models/Turno.js');
const respuestaEstandar = require('../utils/respuestaEstandar.js');

// Controlador para obtener todos los turnos
const getTurnos = async (req, res) => {
    try {
        const { id } = req.query;

        // ✅ CORREGIDO: Si viene id, buscar por findById
        if (id) {
            const turno = await Turno.findById(id).populate('paciente');
            if (!turno) {
                return respuestaEstandar(res, 404, false, 'Turno no encontrado');
            }
            return respuestaEstandar(res, 200, true, 'Turno obtenido exitosamente', turno);
        }

        const turnos = await Turno.find({ activo: true })
            .populate('paciente');

        return respuestaEstandar(res, 200, true, 'Turnos obtenidos exitosamente', turnos);
    } catch (error) {
        return respuestaEstandar(res, 500, false, 'Error interno del servidor', error.message);
    }
};

// Controlador para crear un nuevo turno
const createTurno = async (req, res) => {
    try {
        const esUrgente = req.query.urgencia === 'true';

        const datosDelTurno = {
            paciente: req.body.paciente,
            especialidad: req.body.especialidad,
            fechaTurno: req.body.fechaTurno,
            medico: req.body.medico
        };

        if (esUrgente) {
            datosDelTurno.estado = 'atendido';
            datosDelTurno.observaciones = 'ingreso por guardia medica';
            console.log("ALERTA: registrado un turno de urgencia");
        }

        const nuevoTurno = await Turno.create(datosDelTurno);

        // ✅ Populate del paciente para devolver datos completos
        const turnoPopulado = await Turno.findById(nuevoTurno._id).populate('paciente');

        return respuestaEstandar(res, 201, true, 'Turno creado exitosamente', turnoPopulado);
    } catch (error) {
        if (error.name === 'ValidationError') {
            const errores = Object.values(error.errors).map(err => err.message);
            return respuestaEstandar(res, 400, false, 'Error de validación', errores);
        }
        return respuestaEstandar(res, 500, false, 'Error interno del servidor', error.message);
    }
};

const deleteTurno = async (req, res) => {
    try {
        const { id } = req.params;
        const turnoEliminado = await Turno.findByIdAndUpdate(
            id,
            { activo: false },
            { new: true }
        );
        if (!turnoEliminado) {
            return respuestaEstandar(res, 404, false, `Turno no encontrado con ID ${id}`);
        }
        return respuestaEstandar(res, 200, true, 'Turno eliminado exitosamente', turnoEliminado);
    } catch (error) {
        return respuestaEstandar(res, 500, false, 'Error interno del servidor', error.message);
    }
};

const getTurnosPorEspecialidad = async (req, res) => {
    try {
        const { especialidad } = req.params;

        const turnos = await Turno.find({ 
            especialidad: especialidad.toLowerCase(),
            activo: true  // ✅ Filtrar solo activos
        }).populate('paciente');

        if (turnos.length === 0) {
            return respuestaEstandar(res, 404, false, `No se encontraron turnos para la especialidad "${especialidad}"`);
        }

        return respuestaEstandar(res, 200, true, 'Turnos encontrados', turnos);
    } catch (error) {
        return respuestaEstandar(res, 500, false, 'Error interno del servidor', error.message);
    }
};

const updateTurno = async (req, res) => {
    try {
        const { id } = req.params;

        const turnoActualizado = await Turno.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        }).populate('paciente');

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

const marcarAtendido = async (req, res) => {
    try {
        const { id } = req.params;

        const turnoActualizado = await Turno.findByIdAndUpdate(id, { estado: 'atendido' }, { new: true }).populate('paciente');

        if (!turnoActualizado) {
            return respuestaEstandar(res, 404, false, `Turno no encontrado con ID ${id}`);
        }

        return respuestaEstandar(res, 200, true, 'Turno marcado como atendido', turnoActualizado);
    } catch (error) {
        return respuestaEstandar(res, 500, false, 'Error interno del servidor', error.message);
    }
};

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

module.exports = { getTurnos, createTurno, deleteTurno, getTurnosPorEspecialidad, updateTurno, updateEspecialidad, marcarAtendido };