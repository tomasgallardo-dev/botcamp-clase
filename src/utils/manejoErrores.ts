// ============================================================
//  UTILIDAD: manejoErrores
//  Describe: clasifica errores de MongoDB que NO son ValidationError
//  (violación de índice único, code 11000) -> hoy los controllers
//  responden 409 cuando esErrorDuplicado devuelve true.
// ============================================================

const esErrorDuplicado = (error: any): boolean => {
    return Boolean(error) && error.code === 11000;
};

module.exports = { esErrorDuplicado };