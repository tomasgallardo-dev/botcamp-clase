// ============================================================
//  CONTROLADOR: Pacientes
//  Un controller es la función que ejecuta cada ruta. Viaja así:
//   ruta (Paciente.routes.ts) -> controller (este archivo) -> modelo
//  Su trabajo: leer lo que llega (req), hablar con la base (el modelo)
//  y armar la respuesta (con el formato de respuestaEstandar).
// ============================================================

// `import type` importa SOLO tipos => TypeScript lo borra al compilar,
// no genera ningún require en runtime. (import { X } sin "type" sí existe
// en el código final si X es un valor.)
import type { Request, Response } from 'express';
import type { ICrearPacienteDTO, IActualizarPacienteDTO, IFiltroPacientesQuery, IAgregarConsultaDTO } from './dtos/Paciente.schema';

// require() = importación REAL (runtime, CommonJS).
// El modelo se exporta con module.exports, por eso lo traemos con require.
const Paciente = require('./Paciente.model');
const respuestaEstandar = require('../../utils/respuestaEstandar.js');
const { esErrorDuplicado } = require('../../utils/manejoErrores.js');

// ---------------------------------------------------------------
// GET /api/v1/pacientes
// La firma tipa la petición: Request<Params, ResBody, ReqBody, ReqQuery>.
// Acá solo usamos el query (filter), por eso los 3 primeros están vacíos {}
// y el 4to es IFiltroPacientesQuery:  req.query.obraSocial / req.query.dni
// ---------------------------------------------------------------
const getPacientes = async (req: Request<{}, {}, {}, IFiltroPacientesQuery>, res: Response) => {
    try {
        // req.query trae lo que viene en la URL:  /?obraSocial=pami&dni=12345678
        const { obraSocial, dni } = req.query;

        // Objeto "filtro" que se construye dinámicamente y se le pasa a
        // find(). Si no hay filtros, queda {} = traer TODO.
        // OJO: Record<string, any> desactiva "noUncheckedIndexedAccess"
        // (cuando escribís filtro.clave no sabés si existe de antemano).
        const filtro: Record<string, any> = {};

        if (obraSocial) {
            // Normalizamos igual que hace el schema al guardar (sin acentos,
            // en mayúscula) para que el filtro matchee lo que hay en la base.
            filtro['historialMedico.obraSocial'] = obraSocial.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
        }

        if (dni) {
            filtro.dni = dni;
        }

        console.log("🟢 Filtro armado:", filtro);

        // await = esperamos la promesa de MongoDB. find() devuelve un ARRAY.
        const pacientes = await Paciente.find(filtro);

        // Respuesta con el formato uniforme: respuestaEstandar(res, status, success, message, data)
        return respuestaEstandar(res, 200, true, 'Pacientes obtenidos exitosamente', pacientes);
    } catch (error: any) {
        // Cualquier error imprevisto = 500 (el errorHandler NO entra acá
        // porque no usamos next(err); respondemos directo).
        return respuestaEstandar(res, 500, false, 'Error interno del servidor', error.message);
    }
};

// POST /api/v1/pacientes
// Request<{}, {}, ICrearPacienteDTO>: el BODY debe cumplir el DTO.
const createPaciente = async (req: Request<{}, {}, ICrearPacienteDTO>, res: Response) => {
    try {
        // El modelo valida req.body contra el schema (required, enum, match...)
        // y si está todo bien, lo inserta en Mongo.
        const nuevoPaciente = await Paciente.create(req.body);
        // 201 = "recurso creado"
        return respuestaEstandar(res, 201, true, 'Paciente creado exitosamente', nuevoPaciente);
    } catch (error: any) {
        // ValidationError = error del schema de Mongoose (campo requerido,
        // regex, enum, fecha...). Los mensajes vienen en error.errors.
        if (error.name === 'ValidationError') {
            // Object.values(...) => "errores": { campo1: Error, campo2: Error }
            // y .map(...) extrae solo el mensaje de cada uno -> array de strings.
            const errores = Object.values(error.errors).map((err: any) => err.message);
            return respuestaEstandar(res, 400, false, 'Error de validación', errores);
        }

        // code 11000 = índice único violado (email duplicado). NO es un
        // ValidationError, por eso se chequea aparte y responde 409.
        if (esErrorDuplicado(error)) {
            return respuestaEstandar(res, 409, false, 'Ya existe un paciente con ese dato', error.keyValue);
        }

        return respuestaEstandar(res, 500, false, 'Error interno del servidor', error.message);
    }
};

// GET /api/v1/pacientes/:id
// Request<{ id: string }>: la URL tiene un parámetro "id", que sale en req.params.
const getPacienteById = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const { id } = req.params;
        // findById: busca por _id directamente.
        const paciente = await Paciente.findById(id);

        if (!paciente) {
            // No existe: respuesta 404 con el mismo formato.
            return respuestaEstandar(res, 404, false, `Paciente no encontrado con ID ${id}`);
        }

        return respuestaEstandar(res, 200, true, 'Paciente obtenido exitosamente', paciente);
    } catch (error: any) {
        return respuestaEstandar(res, 500, false, 'Error interno del servidor', error.message);
    }
};

// PUT /api/v1/pacientes/:id  (actualizar)
// IActualizarPacienteDTO es Partial<...>: permite mandar solo algunos campos.
const updatePaciente = async (req: Request<{ id: string }, {}, IActualizarPacienteDTO>, res: Response) => {
    try {
        const { id } = req.params;
        // findByIdAndUpdate(id, datos, opciones)
        //   new: true         -> devuelve el documento YA actualizado (no el viejo)
        //   runValidators:true-> VUELVE a validar el body contra el schema
        //                        (si no, las reglas del schema no se aplican)
        const pacienteActualizado = await Paciente.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true });

        if (!pacienteActualizado) {
            return respuestaEstandar(res, 404, false, `Paciente no encontrado con ID ${id}`);
        }

        return respuestaEstandar(res, 200, true, 'Paciente actualizado exitosamente', pacienteActualizado);
    } catch (error: any) {
        if (error.name === 'ValidationError') {
            const errores = Object.values(error.errors).map((err: any) => err.message);
            return respuestaEstandar(res, 400, false, 'Error de validación', errores);
        }

        if (esErrorDuplicado(error)) {
            return respuestaEstandar(res, 409, false, 'Ya existe un paciente con ese dato', error.keyValue);
        }

        return respuestaEstandar(res, 500, false, 'Error interno del servidor', error.message);
    }
};

// DELETE /api/v1/pacientes/:id
// Borrado DURO: findByIdAndDelete borra el documento de verdad.
const deletePaciente = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const { id } = req.params;
        const pacienteEliminado = await Paciente.findByIdAndDelete(id);

        if (!pacienteEliminado) {
            return respuestaEstandar(res, 404, false, `Paciente no encontrado con ID ${id}`);
        }

        return respuestaEstandar(res, 200, true, 'Paciente eliminado exitosamente', pacienteEliminado);
    } catch (error: any) {
        return respuestaEstandar(res, 500, false, 'Error interno del servidor', error.message);
    }
};

// PATCH /api/v1/pacientes/:id  (agregar consulta al historial)
const agregarConsulta = async (req: Request<{ id: string }, {}, IAgregarConsultaDTO>, res: Response) => {
    try {
        const { id } = req.params;
        const datosConsulta = req.body;

        // $push = operador de Mongo para AGREGAR un elemento a un array.
        // Acá pusheamos la consulta nueva a historialMedico.consultas.
        const pacienteActualizado = await Paciente.findByIdAndUpdate(
            id,
            { $push: { "historialMedico.consultas": datosConsulta } },
            { new: true, runValidators: true });

        if (!pacienteActualizado) {
            return respuestaEstandar(res, 404, false, `Paciente no encontrado con ID ${id}`);
        }
        return respuestaEstandar(res, 200, true, 'Se modifico al paciente exitosamente', pacienteActualizado);
    } catch (error: any) {
        if (error.name === 'ValidationError') {
            const errores = Object.values(error.errors).map((err: any) => err.message);
            return respuestaEstandar(res, 400, false, 'Error de validación', errores);
        }

        return respuestaEstandar(res, 500, false, 'Error interno del servidor', error.message);
    }
};

// Exportamos un OBJETO con todas las funciones para que Paciente.routes.ts
// las desestructure: const { getPacientes, ... } = require('./Paciente.controller');
module.exports = { getPacientes, getPacienteById, createPaciente, updatePaciente, deletePaciente, agregarConsulta };