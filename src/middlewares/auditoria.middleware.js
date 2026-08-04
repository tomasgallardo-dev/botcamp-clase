
// ============================================================
//  MIDDLEWARE: auditoria
//  Descripción: Se ejecuta en TODAS las peticiones antes de
//  llegar a las rutas. Su función es loguear en la consola del
//  servidor cada petición recibida, mostrando la hora, el método
//  HTTP (GET, POST, etc.) y la ruta solicitada.
//  Luego llama a next() para continuar con la siguiente función.
// ============================================================

const auditoriaMunicipal = (req, res, next) => {
    const horaActual = new Date().toLocaleTimeString();
    const metodo = req.method;
    const ruta = req.originalUrl;

    console.log(`[${horaActual}] ${metodo} ${ruta}`);

    next();

};

module.exports = auditoriaMunicipal;