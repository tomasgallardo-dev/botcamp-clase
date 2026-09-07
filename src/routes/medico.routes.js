//  RUTAS: Medico
//  Descripción: Endpoints de médicos. Todas cuelgan de
//  /api/v1/medicos

const express = require("express");
const router = express.Router();
const { getMedicos, createMedico, deleteMedico, updateMedico } = require('../controllers/medico.controller');

router.get("/", getMedicos);
router.post("/", createMedico);
router.put("/:id", updateMedico);
router.delete("/:id", deleteMedico);

module.exports = router;