// ============================================================
//  CONTROLADOR: Turnos
//  Mismo patrón que todos los controllers: las funciones que ejecutan
//  las rutas, cada una con try/catch y respuestaEstandar.
//  Particularidades:
//   - Al leer turnos se usa .populate('paciente') para que en vez del
//     ObjectId devuelva el documento del paciente completo.
//   - Para crear, multiplexa: query ?urgencia=true o body.urgente.
//   - El borrado es SOFT (activo:false) + estado CANCELADO.
// ============================================================

import type { Request, Response } from 'express';
import { TurnoEstado } from './types/TurnoEstado.enum';      // import "de valores" (real, se usa en runtime)
import type { ICrearTurnoDTO, IQueryUrgencia } from './dtos/Turno.schema';

const Turno = require('./Turno.model.js');
const respuestaEstandar = require('../../utils/respuestaEstandar.js');

// GET /api/v1/turnos  (y GET /api/v1/turnos?id=xxx)
const getTurnos = async (req: Request, res: Response) => {
    try {
        const { id } = req.query;

        // Si viene id, buscar por findById (funcionalidad antigua que se siguió
        // manteniendo por compatibilidad; hoy existe también GET /:id).
        if (id) {
            const turno = await Turno.findById(id).populate('paciente');
            if (!turno) {
                return respuestaEstandar(res, 404, false, 'Turno no encontrado');
            }
            return respuestaEstandar(res, 200, true, 'Turno obtenido exitosamente', turno);
        }

        // activo:true => soft delete: solo turnos "vivos".
        // populate('paciente') => reemplaza el ObjectId de paciente por el
        // documento completo (útil para mostrar datos en el frontend).
        const turnos = await Turno.find({ activo: true })
            .populate('paciente');

        return respuestaEstandar(res, 200, true, 'Turnos obtenidos exitosamente', turnos);
    } catch (error: any) {
        return respuestaEstandar(res, 500, false, 'Error interno del servidor', error.message);
    }
};

// GET /api/v1/turnos/:id
const getTurnoById = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const { id } = req.params;
        const turno = await Turno.findById(id).populate('paciente');

        if (!turno) {
            return respuestaEstandar(res, 404, false, `Turno no encontrado con ID ${id}`);
        }

        return respuestaEstandar(res, 200, true, 'Turno obtenido exitosamente', turno);
    } catch (error: any) {
        return respuestaEstandar(res, 500, false, 'Error interno del servidor', error.message);
    }
};

// POST /api/v1/turnos
// Ajuste 5 aplicado: firma tipada con ICrearTurnoDTO (body) e IQueryUrgencia (query).
const createTurno = async (req: Request<{}, {}, ICrearTurnoDTO, IQueryUrgencia>, res: Response) => {
    try {
        // "Urgencia" puede llegar por DOS lados (compatibilidad frontend):
        //   - query: /api/v1/turnos?urgencia=true
        //   - body:  { "urgente": true }
        const esUrgente = req.query.urgencia === 'true' || req.body.urgente === true;

        // Armamos a mano el objeto que se guarda (así controlamos exactamente
        // qué campos pasan, y le añadimos la lógica de urgencia).
        // OJO: medico puede venir como string vacío/undefined; mongoose lo
        // acepta porque en el schema tiene default null y es opcional.
        const datosDelTurno: any = {
            paciente: req.body.paciente,
            especialidad: req.body.especialidad,
            fechaTurno: req.body.fechaTurno,
            medico: req.body.medico
        };

        if (esUrgente) {
            // Un turno de guardia/urgencia nace como ATENDIDO con esa nota.
            datosDelTurno.estado = TurnoEstado.ATENDIDO;
            datosDelTurno.observaciones = 'ingreso por guardia medica';
            console.log("ALERTA: registrado un turno de urgencia");
        }

        const nuevoTurno = await Turno.create(datosDelTurno);

        // Re-buscamos el turno recién creado con el paciente "populado"
        // (create no permite populate), para devolver la respuesta completa.
        const turnoPopulado = await Turno.findById(nuevoTurno._id).populate('paciente');

        return respuestaEstandar(res, 201, true, 'Turno creado exitosamente', turnoPopulado);
    } catch (error: any) {
        if (error.name === 'ValidationError') {
            const errores = Object.values(error.errors).map((err: any) => err.message);
            return respuestaEstandar(res, 400, false, 'Error de validación', errores);
        }
        return respuestaEstandar(res, 500, false, 'Error interno del servidor', error.message);
    }
};

// DELETE /api/v1/turnos/:id (soft delete)
const deleteTurno = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const { id } = req.params;
        // NO borramos el documento: lo "apagamos" (activo:false) y lo
        // marcamos como CANCELADO. Así el histórico queda intacto.
        const turnoEliminado = await Turno.findByIdAndUpdate(
            id,
            { activo: false, estado: TurnoEstado.CANCELADO },
            { new: true }
        );
        if (!turnoEliminado) {
            return respuestaEstandar(res, 404, false, `Turno no encontrado con ID ${id}`);
        }
        return respuestaEstandar(res, 200, true, 'Turno eliminado exitosamente', turnoEliminado);
    } catch (error: any) {
        return respuestaEstandar(res, 500, false, 'Error interno del servidor', error.message);
    }
};

// GET /api/v1/turnos/especialidad/:especialidad
const getTurnosPorEspecialidad = async (req: Request<{ especialidad: string }>, res: Response) => {
    try {
        const { especialidad } = req.params;

        // Especialidad guardada en minúsculas => normalizamos el param igual.
        const turnos = await Turno.find({
            especialidad: especialidad.toLowerCase(),
            activo: true  // ✅ Filtrar solo activos
        }).populate('paciente');

        if (turnos.length === 0) {
            return respuestaEstandar(res, 404, false, `No se encontraron turnos para la especialidad "${especialidad}"`);
        }

        return respuestaEstandar(res, 200, true, 'Turnos encontrados', turnos);
    } catch (error: any) {
        return respuestaEstandar(res, 500, false, 'Error interno del servidor', error.message);
    }
};

// PUT /api/v1/turnos/:id (update general)
const updateTurno = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const { id } = req.params;

        const turnoActualizado = await Turno.findByIdAndUpdate(id, req.body, {
            new: true,            // devolver el documento actualizado
            runValidators: true,  // re-validar contra el schema
        }).populate('paciente');

        if (!turnoActualizado) {
            return respuestaEstandar(res, 404, false, `Turno no encontrado con ID ${id}`);
        }

        return respuestaEstandar(res, 200, true, 'Turno actualizado exitosamente', turnoActualizado);
    } catch (error: any) {
        if (error.name === 'ValidationError') {
            const errores = Object.values(error.errors).map((err: any) => err.message);
            return respuestaEstandar(res, 400, false, 'Error de validación', errores);
        }
        return respuestaEstandar(res, 500, false, 'Error interno del servidor', error.message);
    }
};

// DELETE /api/v1/turnos/atendidos  (limpiar los atendidos del panel)
const limpiarAtendidos = async (req: Request, res: Response) => {
    try {
        // Soft-delete: solo "apago" los que están ATENDIDO y aún activos.
        const resultado = await Turno.updateMany(
            { estado: TurnoEstado.ATENDIDO, activo: true },
            { activo: false }
        );
        return respuestaEstandar(res, 200, true, 'Turnos atendidos eliminados', { eliminados: resultado.modifiedCount });
    } catch (error: any) {
        return respuestaEstandar(res, 500, false, 'Error interno del servidor', error.message);
    }
};

// PATCH /api/v1/turnos/:id/atendido (marcar como atendido)
const marcarAtendido = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const { id } = req.params;

        const turnoActualizado = await Turno.findByIdAndUpdate(id, { estado: TurnoEstado.ATENDIDO }, { new: true }).populate('paciente');

        if (!turnoActualizado) {
            return respuestaEstandar(res, 404, false, `Turno no encontrado con ID ${id}`);
        }

        return respuestaEstandar(res, 200, true, 'Turno marcado como atendido', turnoActualizado);
    } catch (error: any) {
        return respuestaEstandar(res, 500, false, 'Error interno del servidor', error.message);
    }
};

// PATCH /api/v1/turnos/:id/especialidad (cambiar solo la especialidad)
const updateEspecialidad = async (req: Request<{ id: string }>, res: Response) => {
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
    } catch (error: any) {
        if (error.name === 'ValidationError') {
            const errores = Object.values(error.errors).map((err: any) => err.message);
            return respuestaEstandar(res, 400, false, 'Error de validación', errores);
        }
        return respuestaEstandar(res, 500, false, 'Error interno del servidor', error.message);
    }
};

module.exports = { getTurnos, getTurnoById, createTurno, deleteTurno, getTurnosPorEspecialidad, updateTurno, updateEspecialidad, marcarAtendido, limpiarAtendidos };