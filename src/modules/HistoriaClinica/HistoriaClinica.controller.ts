// ============================================================
//  CONTROLADOR: HistoriaClinica
//  Mismo patrón que los demás controllers.
//  Particularidades:
//   - GET listo filtra por query: ?pacienteId, ?medicoId, ?fecha, ?sintomas
//   - GET por id NO devuelve 404 si no existe (devuelve null en data).
//   - Delete es SOFT (activo:false).
// ============================================================

import type { Request, Response } from 'express';
import type { ICrearHistoriaClinicaDTO, IFiltroHistoriaClinicaQuery } from './dtos/HistoriaClinicaDTO';

const HistoriaClinica = require('./HistoriaClinica.js');
const respuestaEstandar = require('../../utils/respuestaEstandar.js');

// GET /api/v1/historias-clinicas  (?pacienteId&?medicoId&?fecha&?sintomas)
const getHistoriasClinicas = async (req: Request<{}, {}, {}, IFiltroHistoriaClinicaQuery>, res: Response) => {
    try {
        const { pacienteId, medicoId, fecha, sintomas } = req.query;

        // Filtro que se arma dinámicamente; empieza solo con activo:true
        // (soft delete) y se le van sumando condiciones.
        const filter: Record<string, any> = { activo: true };

        if (pacienteId) {
            filter.paciente = pacienteId;
        }

        if (medicoId) {
            filter.medico = medicoId;
        }

        if (fecha) {
            filter.fecha = fecha;
        }

        if (sintomas) {
            // $in = Mongo: busca docs cuyo array sintomas contenga CUALQUIERA
            // de los valores. El query llega "a,b,c" y lo partimos por coma.
            filter.sintomas = { $in: sintomas.split(',') };
        }

        const historiasClinicas = await HistoriaClinica.find(filter);

        return respuestaEstandar(res, 200, true, 'Historias clínicas obtenidas exitosamente', historiasClinicas);
    } catch (error: any) {
        return respuestaEstandar(res, 500, false, 'Error al obtener las historias clínicas', error.message);
    }
};

// GET /api/v1/historias-clinicas/:id
const getHistoriaClinicaById = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const { id } = req.params;
        const historiaClinica = await HistoriaClinica.findById(id);

        // NOTA: acá no se valida null (devuelve data:null y 200, no 404).
        return respuestaEstandar(res, 200, true, 'Historia clínica obtenida exitosamente', historiaClinica);
    } catch (error: any) {
        return respuestaEstandar(res, 500, false, 'Error al obtener la historia clínica', error.message);
    }
};

// POST /api/v1/historias-clinicas
const createHistoriaClinica = async (req: Request<{}, {}, ICrearHistoriaClinicaDTO>, res: Response) => {
    try {
        const nuevaHistoriaClinica = await HistoriaClinica.create(req.body);

        return respuestaEstandar(res, 201, true, 'Historia clínica creada exitosamente', nuevaHistoriaClinica);
    } catch (error: any) {
        if (error.name === 'ValidationError') {
            const errores = Object.values(error.errors).map((err: any) => err.message);
            return respuestaEstandar(res, 400, false, 'Error de validación', errores);
        }
        return respuestaEstandar(res, 500, false, 'Error al crear la historia clínica', error.message);
    }
};

// DELETE /api/v1/historias-clinicas/:id (soft delete: activo:false)
const deleteHistoriaClinica = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const { id } = req.params;

        const historiaBorrada = await HistoriaClinica.findByIdAndUpdate(
            id,
            { activo: false },
            { new: true }
        );

        if (!historiaBorrada) {
            return respuestaEstandar(res, 404, false, `Historia clínica no encontrada con ID ${id}`);
        }

        return respuestaEstandar(res, 200, true, 'Historia clínica eliminada exitosamente', historiaBorrada);
    } catch (error: any) {
        // ID con formato inválido (no es un ObjectId de 24 hex) lanza acá.
        return respuestaEstandar(res, 400, false, 'ID con formato invalido', error.message);
    }
};

module.exports = {
    getHistoriasClinicas,
    getHistoriaClinicaById,
    createHistoriaClinica,
    deleteHistoriaClinica
};