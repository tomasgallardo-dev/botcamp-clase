// ============================================================
//  RUTAS: Consultorio
//  Descripción: Define los endpoints (URLs) relacionados con
//  los consultorios y los conecta con sus controladores.
//  Todas estas rutas cuelgan de: /api/v1/consultorios
// ============================================================

// Importamos express para poder crear un router.
const express = require('express');
const router = express.Router();

// Importamos las funciones del controlador que manejan cada petición.
const {
    getConsultorios,     // GET    -> listar consultorios
    createConsultorio,   // POST   -> crear un consultorio
    deleteConsultorio    // DELETE -> eliminar un consultorio
} = require('../controllers/consultorio.controller');

// ------------------------------------------------------------
// GET  /api/v1/consultorios
// Lista todos los consultorios (con médico y especialidad populados).
// ------------------------------------------------------------
router.get('/', getConsultorios);

// ------------------------------------------------------------
// POST /api/v1/consultorios
// Crea un nuevo consultorio.
// El body debe enviar: medico, especialidad, numeroConsultorio, piso, direccion, telefono, email.
// ------------------------------------------------------------
router.post('/', createConsultorio);

// ------------------------------------------------------------
// DELETE /api/v1/consultorios/:id
// Elimina un consultorio por su ID.
// ------------------------------------------------------------
router.delete('/:id', deleteConsultorio);

// Exportamos el router para que app.js lo pueda usar.
module.exports = router;

