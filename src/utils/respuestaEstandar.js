// ============================================================
//  UTILIDAD: respuestaEstandar
//  Descripción: Función que da un formato UNIFORME a todas las
//  respuestas JSON de la API. De esta forma el frontend siempre
//  recibe la misma estructura:
//  {
//    success: true/false,
//    timestamp: fecha-hora de la respuesta,
//    message: mensaje legible,
//    total: cantidad de elementos (si data es un arreglo),
//    data: los datos reales (o null)
//  }
// ============================================================

const respuestaEstandar = (res, status, success, message, data = null) => {
    return res.status(status).json({
        success,
        timestamp: new Date().toISOString(),
        message,
        total: Array.isArray(data) ? data.length : data ? 1 : 0,
        data
    });
};

module.exports = respuestaEstandar;