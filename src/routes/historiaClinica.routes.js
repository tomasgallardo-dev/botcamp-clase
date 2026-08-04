// ============================================================
//  RUTAS: HistoriaClinica
//  Descripción: Define los endpoints (URLs) relacionados con
//  las historias clínicas y los conecta con sus controladores.
//  Todas estas rutas cuelgan de: /api/v1/historias-clinicas
// ============================================================

// Importamos express para poder crear un router.
const express = require('express');
const router = express.Router();

// Importamos las funciones del controlador que manejan cada petición.
const {
    getHistoriasClinicas,       // GET   -> listar historias clínicas
    getHistoriaClinicaById,     // GET   -> obtener una por id
    createHistoriaClinica,      // POST  -> crear una nueva
    deleteHistoriaClinica       // DELETE-> eliminar (borrado lógico)
} = require('../controllers/historiaClinica.controller');

// ------------------------------------------------------------
// GET  /api/v1/historias-clinicas
// Lista todas las historias clínicas activas.
// Acepta filtros opcionales: ?pacienteId, ?medicoId, ?fecha, ?sintomas
// ------------------------------------------------------------
router.get('/', getHistoriasClinicas);

// ------------------------------------------------------------
// GET  /api/v1/historias-clinicas/:id
// Obtiene UNA historia clínica según su ID.
// ------------------------------------------------------------
router.get('/:id', getHistoriaClinicaById);

// ------------------------------------------------------------
// POST /api/v1/historias-clinicas
// Crea una nueva historia clínica.
// El body debe enviar: paciente, fecha, motivoConsulta, diagnostico, tratamiento, etc.
// ------------------------------------------------------------
router.post('/', createHistoriaClinica);

// ------------------------------------------------------------
// DELETE /api/v1/historias-clinicas/:id
// Elimina (lógicamente) una historia clínica por su ID.
// ------------------------------------------------------------
router.delete('/:id', deleteHistoriaClinica);

// Exportamos el router para que app.js lo pueda usar.
module.exports = router;

