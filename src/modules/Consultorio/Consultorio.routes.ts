// ============================================================
//  RUTAS: Consultorio
//  Endpoints de consultorios. Cuelgan de /api/v1/consultorios.
//  CRUD simple. Al listar/update el controller hace populate doble
//  (médico + especialidad).
// ============================================================

const express = require('express');
const router = express.Router();
const { getConsultorios, createConsultorio, updateConsultorio, deleteConsultorio } = require('./Consultorio.controller');

router.get('/', getConsultorios);
router.post('/', createConsultorio);
router.put('/:id', updateConsultorio);
router.delete('/:id', deleteConsultorio);

module.exports = router;