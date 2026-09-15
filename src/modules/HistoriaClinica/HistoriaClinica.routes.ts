// ============================================================
//  RUTAS: HistoriaClinica
//  Endpoints de historias clínicas. Cuelgan de /api/v1/historias-clinicas.
//  Filtros opcionales en GET: ?pacienteId, ?medicoId, ?fecha, ?sintomas
//  El DELETE es soft (activo:false).
// ============================================================

const express = require('express');
const router = express.Router();
const { getHistoriasClinicas, getHistoriaClinicaById, createHistoriaClinica, deleteHistoriaClinica } = require('./HistoriaClinica.controller');

router.get('/', getHistoriasClinicas);
router.get('/:id', getHistoriaClinicaById);
router.post('/', createHistoriaClinica);
router.delete('/:id', deleteHistoriaClinica);

module.exports = router;