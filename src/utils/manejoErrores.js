// ============================================================
//  UTILIDAD: manejoErrores
//  Descripción: Ayuda a clasificar errores de MongoDB que no
//  son ValidationError (por ejemplo, violación de índice único,
//  código 11000, que hoy caerían en el catch genérico de 500).
// ============================================================

// Devuelve true si el error es una violación de índice único (dato duplicado)
const esErrorDuplicado = (error) => {
    return Boolean(error) && error.code === 11000;
};

module.exports = { esErrorDuplicado };