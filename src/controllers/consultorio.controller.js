// ============================================================
//  CONTROLADOR: Consultorio
//  Descripción: Contiene la lógica (funciones) que maneja las
//  peticiones HTTP relacionadas con los consultorios.
//  Cada función se conecta con el modelo Consultorio para
//  leer o escribir en la base de datos.
// ============================================================

// Importamos el modelo Consultorio para poder consultar la base de datos.
const Consultorio = require('../models/Consultorio');
// Importamos la función que da formato estándar a las respuestas de la API.
const respuestaEstandar = require('../utils/respuestaEstandar');

// ------------------------------------------------------------
// GET /consultorios
// Obtiene todos los consultorios registrados.
// Usamos .populate() para traer también los datos completos
// del médico y de la especialidad asociados (en vez de solo su ID).
// ------------------------------------------------------------
const getConsultorios = async (req, res) => {
    try {
        // Buscamos todos los consultorios y completamos las referencias.
        const consultorios = await Consultorio.find()
            .populate('medico')          // Trae el documento completo del médico
            .populate('especialidad');   // Trae el documento completo de la especialidad

        // Respondemos con formato estándar: 200 = OK.
        return respuestaEstandar(res, 200, true, 'Consultorios obtenidos exitosamente', consultorios);
    } catch (error) {
        // Si ocurre un error interno, respondemos con 500.
        return respuestaEstandar(res, 500, false, 'Error interno del servidor', error.message);
    }
};

// ------------------------------------------------------------
// POST /consultorios
// Crea un NUEVO consultorio con los datos enviados en el body.
// ------------------------------------------------------------
const createConsultorio = async (req, res) => {
    try {
        // mongoose valida automáticamente los datos contra el esquema.
        const nuevoConsultorio = await Consultorio.create(req.body);

        // 201 = Created (recurso creado exitosamente).
        return respuestaEstandar(res, 201, true, 'Consultorio creado exitosamente', nuevoConsultorio);
    } catch (error) {
        // Si falla la validación de los datos, mongoose lanza ValidationError.
        if (error.name === 'ValidationError') {
            // Extraemos los mensajes de error de cada campo.
            const errores = Object.values(error.errors).map(err => err.message);
            // 400 = Bad Request (los datos enviados no son válidos).
            return respuestaEstandar(res, 400, false, 'Error de validación', errores);
        }
        // Cualquier otro error interno → 500.
        return respuestaEstandar(res, 500, false, 'Error interno del servidor', error.message);
    }
};

// ------------------------------------------------------------
// DELETE /consultorios/:id
// Elimina un consultorio por su ID (borrado FÍSICO con findByIdAndDelete).
// ------------------------------------------------------------
const deleteConsultorio = async (req, res) => {
    try {
        // Extraemos el id de la URL.
        const { id } = req.params;

        // findByIdAndDelete: busca y elimina el documento directamente.
        const consultorioBorrado = await Consultorio.findByIdAndDelete(id);

        // Si no se encontró ningún consultorio con ese id:
        if (!consultorioBorrado) {
            return respuestaEstandar(res, 404, false, 'Consultorio no encontrado');
        }

        // Si se encontró, respondemos con éxito y el documento eliminado.
        return respuestaEstandar(res, 200, true, 'Consultorio eliminado exitosamente', consultorioBorrado);
    } catch (error) {
        // Si el ID tiene formato inválido → 500 (o 400 según preferencia).
        return respuestaEstandar(res, 500, false, 'Error interno del servidor', error.message);
    }
};

// Exportamos todas las funciones para que las rutas puedan usarlas.
module.exports = {
    getConsultorios,
    createConsultorio,
    deleteConsultorio
};

