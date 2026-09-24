// ============================================================
//  CONTROLADOR: Consultorio
//  Mismo patrón que Paciente.controller.ts.
//  Al listar/editamos popula con .populate('medico') y
//  .populate('especialidad') porque ambos son referencias (ObjectId).
// ============================================================

import type { Request, Response } from 'express';
import type { ICrearConsultorioDTO, IActualizarConsultorioDTO } from './dtos/Consultorio.schema';

const Consultorio = require('./Consultorio.model');
const respuestaEstandar = require('../../utils/respuestaEstandar');
const { esErrorDuplicado } = require('../../utils/manejoErrores.js');

// GET /api/v1/consultorios
const getConsultorios = async (req: Request, res: Response) => {
    try {
        // Doble populate: convertimos los IDs referenciados en documentos.
        const consultorios = await Consultorio.find()
            .populate('medico')
            .populate('especialidad');

        return respuestaEstandar(res, 200, true, 'Consultorios obtenidos exitosamente', consultorios);
    } catch (error: any) {
        return respuestaEstandar(res, 500, false, 'Error interno del servidor', error.message);
    }
};

// POST /api/v1/consultorios
const createConsultorio = async (req: Request<{}, {}, ICrearConsultorioDTO>, res: Response) => {
    try {
        const nuevoConsultorio = await Consultorio.create(req.body);
        return respuestaEstandar(res, 201, true, 'Consultorio creado exitosamente', nuevoConsultorio);
    } catch (error: any) {
        if (error.name === 'ValidationError') {
            const errores = Object.values(error.errors).map((err: any) => err.message);
            return respuestaEstandar(res, 400, false, 'Error de validación', errores);
        }
        if (esErrorDuplicado(error)) {
            return respuestaEstandar(res, 409, false, 'Ya existe un consultorio con ese dato', error.keyValue);
        }
        return respuestaEstandar(res, 500, false, 'Error interno del servidor', error.message);
    }
};

// PUT /api/v1/consultorios/:id
const updateConsultorio = async (req: Request<{ id: string }, {}, IActualizarConsultorioDTO>, res: Response) => {
    try {
        const { id } = req.params;
        const consultorioActualizado = await Consultorio.findByIdAndUpdate(id, req.body, {
            new: true,            // devolver el documento actualizado
            runValidators: true,  // re-validar contra el schema
        }).populate('medico').populate('especialidad');

        if (!consultorioActualizado) {
            return respuestaEstandar(res, 404, false, 'Consultorio no encontrado');
        }

        return respuestaEstandar(res, 200, true, 'Consultorio actualizado exitosamente', consultorioActualizado);
    } catch (error: any) {
        if (error.name === 'ValidationError') {
            const errores = Object.values(error.errors).map((err: any) => err.message);
            return respuestaEstandar(res, 400, false, 'Error de validación', errores);
        }
        if (esErrorDuplicado(error)) {
            return respuestaEstandar(res, 409, false, 'Ya existe un consultorio con ese dato', error.keyValue);
        }
        return respuestaEstandar(res, 500, false, 'Error interno del servidor', error.message);
    }
};

// DELETE /api/v1/consultorios/:id (borrado duro)
const deleteConsultorio = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const { id } = req.params;
        const consultorioBorrado = await Consultorio.findByIdAndDelete(id);

        if (!consultorioBorrado) {
            return respuestaEstandar(res, 404, false, 'Consultorio no encontrado');
        }

        return respuestaEstandar(res, 200, true, 'Consultorio eliminado exitosamente', consultorioBorrado);
    } catch (error: any) {
        return respuestaEstandar(res, 500, false, 'Error interno del servidor', error.message);
    }
};

module.exports = { getConsultorios, createConsultorio, updateConsultorio, deleteConsultorio };