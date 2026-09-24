// ============================================================
//  CONTROLADOR: Recepcion
//  registrarIngreso es el más distinto de todos: crea DOS documentos en
//  una sola transacción atómica.
//  Transacción = si falla el segundo, se DESHACE el primero (rollback).
//  Requiere MongoDB corriendo como replica set (los standalone NO soportan
//  transacciones multi-documento -> error).
// ============================================================

import type { Request, Response } from 'express';
import type { IRegistrarIngresoDTO } from './dtos/Recepcion.schema';

const mongoose = require('mongoose');
const Turno = require('../Turno/Turno.model.js');            // requiere el modelo (usa .js por compatibilidad)
const Paciente = require('../Paciente/Paciente.model.js');
const respuestaEstandar = require('../../utils/respuestaEstandar.js');

// POST /api/v1/recepcion/ingreso
const registrarIngreso = async (req: Request<{}, {}, IRegistrarIngresoDTO>, res: Response) => {
    // SESSION = la "caja" donde se encierran todas las operaciones de la
    // transacción. startTransaction la arranca.
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // El body agrupa paciente + turno en un solo POST.
        const { datosPaciente, especialidad, fechaTurno, estado, observaciones, medico } = req.body;

        // 1er documento: el paciente. OJO: .create recibe un ARRAY y {session}
        // para que la creación participe de la transacción.
        const [nuevoPaciente] = await Paciente.create([datosPaciente], { session });

        // 2do documento: el turno, apuntando al paciente recién creado.
        // medico es opcional (default null) -> acepta null explícito.
        const [nuevoTurno] = await Turno.create([{
            paciente: nuevoPaciente._id,
            especialidad,
            fechaTurno,
            estado: estado || 'pendiente',
            observaciones,
            medico: medico || null,
        }], { session });

        // Recién acá se hace efectivo TODO (si algo falló arriba, el catch
        // hace abortTransaction y no queda nada a medias).
        await session.commitTransaction();
        session.endSession();

        // Devuelve el turno con su paciente "populado" (documento completo).
        const turnoCompleto = await Turno.findById(nuevoTurno.id).populate('paciente');

        return respuestaEstandar(res, 201, true, "Ingreso paciente nuevo", turnoCompleto)
    } catch (error: any) {
        // Rollback: deshace cualquier cosa escrita por la sesión.
        await session.abortTransaction();
        session.endSession();

        if (error.name === 'ValidationError') {
            const errores = Object.values(error.errors).map((err: any) => err.message);
            return respuestaEstandar(res, 400, false, 'Error de validación', errores);
        }

        return respuestaEstandar(res, 400, false, "Transacción abortada", error.message)
    }
};

module.exports = { registrarIngreso };