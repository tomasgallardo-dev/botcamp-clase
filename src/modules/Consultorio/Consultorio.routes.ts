// ============================================================
//  RUTAS: Consultorio
//  Endpoints de consultorios. Cuelgan de /api/v1/consultorios.
//  CRUD simple. Al listar/update el controller hace populate doble
//  (médico + especialidad).
// ============================================================

const express = require('express');
const router = express.Router();
const { getConsultorios, createConsultorio, updateConsultorio, deleteConsultorio } = require('./Consultorio.controller');

const { validarSchema } = require('../../middlewares/validarDatos.middleware');
const { crearConsultorioSchema, actualizarConsultorioSchema } = require('./dtos/Consultorio.schema');

router.get('/', getConsultorios);
router.post('/', validarSchema(crearConsultorioSchema), createConsultorio);
router.put('/:id', validarSchema(actualizarConsultorioSchema), updateConsultorio);
router.delete('/:id', deleteConsultorio);

module.exports = router;