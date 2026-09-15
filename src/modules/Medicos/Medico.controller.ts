// ============================================================
//  CONTROLADOR: Medicos
//  Mismo patrón que Paciente.controller.ts.
//  DIFERENCIA clave: getMedicos hace .populate('especialidad') porque
//  `especialidad` es un ObjectId referenciado -> sin populate el frontend
//  recibiría solo un ID (por eso "no aparecían" los médicos antes del fix).
// ============================================================

import type { Request, Response } from 'express';
import type { ICrearMedicoDTO, IActualizarMedicoDTO } from './dtos/MedicoDTO';

const Medico = require('./Medico');
const respuestaEstandar = require('../../utils/respuestaEstandar.js');
const { esErrorDuplicado } = require('../../utils/manejoErrores.js');

// GET /api/v1/medicos  -> SOLO activos (soft "apagado" vía campo activo)
const getMedicos = async (req: Request, res: Response) => {
    try {
        // populate('especialidad') => reemplaza el ObjectId de especialidad
        // por el documento Especialidad completo en la respuesta.
        const medicos = await Medico.find({ activo: true }).populate('especialidad');
        return respuestaEstandar(res, 200, true, 'Médicos obtenidos exitosamente', medicos);
    } catch (error: any) {
        return respuestaEstandar(res, 500, false, 'Error interno del servidor', error.message);
    }
};

// POST /api/v1/medicos
// OJO: req.body.especialidad debe ser un ObjectId válido de la colección
// Especialidad (un string que no sea un _id válido da error en Mongo).
const createMedico = async (req: Request<{}, {}, ICrearMedicoDTO>, res: Response) => {
    try {
        const nuevoMedico = await Medico.create(req.body);
        return respuestaEstandar(res, 201, true, 'Médico creado exitosamente', nuevoMedico);
    } catch (error: any) {
        if (error.name === 'ValidationError') {
            const errores = Object.values(error.errors).map((err: any) => err.message);
            return respuestaEstandar(res, 400, false, 'Error de validación', errores);
        }
        if (esErrorDuplicado(error)) {
            // matricula o email unique duplicados => 409.
            return respuestaEstandar(res, 409, false, 'Ya existe un médico con ese dato', error.keyValue);
        }
        return respuestaEstandar(res, 500, false, 'Error interno del servidor', error.message);
    }
};

// DELETE /api/v1/medicos/:id (borrado duro, sin integridad referencial:
// queda el flag de Pendiente en AGENTS.md.)
const deleteMedico = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const { id } = req.params;
        const medicoEliminado = await Medico.findByIdAndDelete(id);

        if (!medicoEliminado) {
            return respuestaEstandar(res, 404, false, `Médico no encontrado con ID ${id}`);
        }

        return respuestaEstandar(res, 200, true, 'Médico eliminado exitosamente', medicoEliminado);
    } catch (error: any) {
        return respuestaEstandar(res, 500, false, 'Error interno del servidor', error.message);
    }
};

// PUT /api/v1/medicos/:id
const updateMedico = async (req: Request<{ id: string }, {}, IActualizarMedicoDTO>, res: Response) => {
    try {
        const { id } = req.params;
        const medicoActualizado = await Medico.findByIdAndUpdate(id, req.body, {
            new: true,            // devolver el documento actualizado
            runValidators: true,  // re-validar contra el schema
        });

        if (!medicoActualizado) {
            return respuestaEstandar(res, 404, false, `Médico no encontrado con ID ${id}`);
        }

        return respuestaEstandar(res, 200, true, 'Médico actualizado exitosamente', medicoActualizado);
    } catch (error: any) {
        if (error.name === 'ValidationError') {
            const errores = Object.values(error.errors).map((err: any) => err.message);
            return respuestaEstandar(res, 400, false, 'Error de validación', errores);
        }
        if (esErrorDuplicado(error)) {
            return respuestaEstandar(res, 409, false, 'Ya existe un médico con ese dato', error.keyValue);
        }
        return respuestaEstandar(res, 500, false, 'Error interno del servidor', error.message);
    }
};

module.exports = { getMedicos, createMedico, deleteMedico, updateMedico };