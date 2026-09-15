// ============================================================
//  CONTROLADOR: Especialidades
//  Mismo patrón que Paciente.controller.ts: cada función = una ruta,
//  try/catch, y respuestas con respuestaEstandar.
//  Ver el controller de Pacientes para la explicación detallada del
//  patrón (generics de Request, ValidationError, esErrorDuplicado).
// ============================================================

import type { Request, Response } from 'express';
import type { ICrearEspecialidadDTO, IActualizarEspecialidadDTO } from './dtos/EspecialidadDTO';

const Especialidad = require('./Especialidad');
const respuestaEstandar = require('../../utils/respuestaEstandar.js');
const { esErrorDuplicado } = require('../../utils/manejoErrores.js');

// GET /api/v1/especialidades
const getEspecialidades = async (req: Request, res: Response) => {
    try {
        const especialidades = await Especialidad.find();
        return respuestaEstandar(res, 200, true, 'Especialidades obtenidos exitosamente', especialidades);
    } catch (error: any) {
        return respuestaEstandar(res, 500, false, 'Error interno del servidor', error.message);
    }
};

// POST /api/v1/especialidades
const createEspecialidad = async (req: Request<{}, {}, ICrearEspecialidadDTO>, res: Response) => {
    try {
        const nuevaEspecialidad = await Especialidad.create(req.body);
        return respuestaEstandar(res, 201, true, 'Especialidad creada exitosamente', nuevaEspecialidad);
    } catch (error: any) {
        if (error.name === 'ValidationError') {
            const errores = Object.values(error.errors).map((err: any) => err.message);
            return respuestaEstandar(res, 400, false, 'Error de validación', errores);
        }
        if (esErrorDuplicado(error)) {
            // campo "nombre" es unique => mismo nombre da 409.
            return respuestaEstandar(res, 409, false, 'Ya existe una especialidad con ese nombre', error.keyValue);
        }
        return respuestaEstandar(res, 500, false, 'Error interno del servidor', error.message);
    }
};

// PUT /api/v1/especialidades/:id
const updateEspecialidad = async (req: Request<{ id: string }, {}, IActualizarEspecialidadDTO>, res: Response) => {
    try {
        const { id } = req.params;
        const especialidadActualizada = await Especialidad.findByIdAndUpdate(id, req.body, {
            new: true,            // devolver el documento actualizado
            runValidators: true,  // re-validar contra el schema
        });

        if (!especialidadActualizada) {
            return respuestaEstandar(res, 404, false, `Especialidad no encontrada con ID ${id}`);
        }

        return respuestaEstandar(res, 200, true, 'Especialidad actualizada exitosamente', especialidadActualizada);
    } catch (error: any) {
        if (error.name === 'ValidationError') {
            const errores = Object.values(error.errors).map((err: any) => err.message);
            return respuestaEstandar(res, 400, false, 'Error de validación', errores);
        }
        if (esErrorDuplicado(error)) {
            return respuestaEstandar(res, 409, false, 'Ya existe una especialidad con ese nombre', error.keyValue);
        }
        return respuestaEstandar(res, 500, false, 'Error interno del servidor', error.message);
    }
};

// DELETE /api/v1/especialidades/:id (borrado duro)
const deleteEspecialidad = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const { id } = req.params;
        const especialidadEliminada = await Especialidad.findByIdAndDelete(id);

        if (!especialidadEliminada) {
            return respuestaEstandar(res, 404, false, `Especialidad no encontrada con ID ${id}`);
        }

        return respuestaEstandar(res, 200, true, 'Especialidad eliminada exitosamente', especialidadEliminada);
    } catch (error: any) {
        return respuestaEstandar(res, 500, false, 'Error interno del servidor', error.message);
    }
};

module.exports = { getEspecialidades, createEspecialidad, updateEspecialidad, deleteEspecialidad };