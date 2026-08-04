// ============================================================
//  CONTROLADOR: HistoriaClinica
//  Descripción: Contiene la lógica (funciones) que maneja las
//  peticiones HTTP relacionadas con las historias clínicas.
//  Cada función se conecta con el modelo HistoriaClinica para
//  leer o escribir en la base de datos.
// ============================================================

// Importamos el modelo HistoriaClinica para poder consultar la base de datos.
const HistoriaClinica = require('../models/HistoriaClinica');
// Importamos la función que da formato estándar a las respuestas de la API.
const respuestaEstandar = require('../utils/respuestaEstandar');

// ------------------------------------------------------------
// GET /historias-clinicas
// Obtiene todas las historias clínicas activas (no borradas).
// Permite filtrar por query params:
//   ?pacienteId=...  -> filtra por paciente
//   ?medicoId=...    -> filtra por médico
//   ?fecha=...       -> filtra por fecha
//   ?sintomas=a,b,c -> filtra por síntomas (separados por coma)
// ------------------------------------------------------------
const getHistoriasClinicas = async (req, res) => {
    try {
        // Extraemos los filtros opcionales que vienen en la URL (query params).
        const { pacienteId, medicoId, fecha, sintomas } = req.query;

        // El filtro base: solo traemos las historias clínicas activas.
        const filter = { activo: true };

        // Si viene pacienteId, lo agregamos al filtro.
        if (pacienteId) {
            filter.paciente = pacienteId;
        }
        // Si viene medicoId, lo agregamos al filtro.
        if (medicoId) {
            filter.medico = medicoId;
        }
        // Si viene fecha, lo agregamos al filtro.
        if (fecha) {
            filter.fecha = fecha;
        }
        // Si viene sintomas (separados por coma), filtramos con $in
        // que busca documentos cuyo arreglo de síntomas contenga cualquiera de ellos.
        if (sintomas) {
            filter.sintomas = { $in: sintomas.split(',') };
        }

        // Ejecutamos la consulta a la base de datos con el filtro armado.
        const historiasClinicas = await HistoriaClinica.find(filter);

        // Respondemos con formato estándar: 200 = OK.
        return respuestaEstandar(res, 200, true, 'Historias clínicas obtenidas exitosamente', historiasClinicas);
    } catch (error) {
        // Si ocurre un error interno, respondemos con 500.
        return respuestaEstandar(res, 500, false, 'Error al obtener las historias clínicas', error.message);
    }
}

// ------------------------------------------------------------
// GET /historias-clinicas/:id
// Obtiene UNA sola historia clínica por su ID.
// ------------------------------------------------------------
const getHistoriaClinicaById = async (req, res) => {
    try {
        // Extraemos el id que viene en la URL (parámetro de ruta).
        const { id } = req.params;
        // Buscamos en la base por su _id.
        const historiaClinica = await HistoriaClinica.findById(id);

        // Respondemos con la historia clínica encontrada (o null si no existe).
        return respuestaEstandar(res, 200, true, 'Historia clínica obtenida exitosamente', historiaClinica);
    } catch (error) {
        // Si el ID tiene formato inválido, mongoose lanza un error y caemos acá.
        return respuestaEstandar(res, 500, false, 'Error al obtener la historia clínica', error.message);
    }
}

// ------------------------------------------------------------
// POST /historias-clinicas
// Crea una NUEVA historia clínica con los datos enviados en el body.
// ------------------------------------------------------------
const createHistoriaClinica = async (req, res) => {
    try {
        // mongoose valida automáticamente los datos contra el esquema.
        const nuevaHistoriaClinica = await HistoriaClinica.create(req.body);

        // 201 = Created (recurso creado exitosamente).
        return respuestaEstandar(res, 201, true, 'Historia clínica creada exitosamente', nuevaHistoriaClinica);
    } catch (error) {
        // Si falla la validación de los datos, mongoose lanza ValidationError.
        if (error.name === 'ValidationError') {
            // Extraemos los mensajes de error de cada campo.
            const errores = Object.values(error.errors).map(err => err.message);
            // 400 = Bad Request (los datos enviados no son válidos).
            return respuestaEstandar(res, 400, false, 'Error de validación', errores);
        }
        // Cualquier otro error interno → 500.
        return respuestaEstandar(res, 500, false, 'Error al crear la historia clínica', error.message);
    }
}

// ------------------------------------------------------------
// DELETE /historias-clinicas/:id
// Elimina (borrado lógico) una historia clínica.
// En vez de borrar el documento, cambiamos activo a false,
// así el historial se conserva en la base de datos.
// ------------------------------------------------------------
const deleteHistoriaClinica = async (req, res) => {
    try {
        // Extraemos el id de la URL.
        const { id } = req.params;

        // findByIdAndUpdate: buscamos por id y actualizamos.
        // { new: true } -> devuelve el documento YA actualizado.
        const historiaBorrada = await HistoriaClinica.findByIdAndUpdate(
            id,
            { activo: false },
            { new: true }
        );

        // Si no se encontró ninguna historia clínica con ese id:
        if (!historiaBorrada) {
            return respuestaEstandar(res, 404, false, `Historia clínica no encontrada con ID ${id}`);
        }

        // Si se encontró, respondemos con éxito y el documento marcado como inactivo.
        return respuestaEstandar(res, 200, true, 'Historia clínica eliminada exitosamente', historiaBorrada);
    } catch (error) {
        // Si el ID tiene formato inválido → 400.
        return respuestaEstandar(res, 400, false, 'ID con formato invalido', error.message);
    }
};

// Exportamos todas las funciones para que las rutas puedan usarlas.
module.exports = {
    getHistoriasClinicas,
    getHistoriaClinicaById,
    createHistoriaClinica,
    deleteHistoriaClinica
};

