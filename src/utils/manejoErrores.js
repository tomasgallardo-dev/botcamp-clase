// ============================================================
//  UTILIDAD: manejoErrores
//  Descripción: Ayuda a clasificar errores de MongoDB que no
//  son ValidationError (por ejemplo, violación de índice único,
//  código 11000, que hoy caerían en el catch genérico de 500).
// ============================================================

// Devuelve true si el error es una violación de índice único (dato duplicado).
// En Mongo, cuando un campo `unique` ya existe, el driver lanza un error con
// code === 11000. Esos errores NO son ValidationError, por eso los
// controllers los chequean aparte y responden 409 (conflicto).
const esErrorDuplicado = (error) => {
    return Boolean(error) && error.code === 11000;
};

// Exportamos un OBJETO con el helper. En el controller se desestructura:
// const { esErrorDuplicado } = require('../../utils/manejoErrores.js');
module.exports = { esErrorDuplicado };