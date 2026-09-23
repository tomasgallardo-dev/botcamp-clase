// ============================================================
//  RUTAS: Medicos
//  Endpoints de médicos. Cuelgan de /api/v1/medicos.
//  CRUD simple. Al listar el controller hace populate de especialidad
//  (por eso el frontend recibió "id" en vez del nombre antes del fix).
// ============================================================

const express = require("express");
const router = express.Router();
const { getMedicos, createMedico, deleteMedico, updateMedico } = require('./Medico.controller');

const { validarSchema } = require('../../middlewares/validarDatos.middleware');
const { crearMedicoSchema, actualizarMedicoSchema } = require('./dtos/Medico.schema');

router.get("/", getMedicos);
router.post("/", validarSchema(crearMedicoSchema), createMedico);
router.put("/:id", validarSchema(actualizarMedicoSchema), updateMedico);
router.delete("/:id", deleteMedico);

module.exports = router;