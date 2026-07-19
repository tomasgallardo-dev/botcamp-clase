const express = require("express");
const router = express.Router();
const { getPacientes, createPaciente, deletePaciente } = require('../controllers/pacientes.controller');

//Rutas
router.get("/", getPacientes);
router.post("/", createPaciente);
router.delete("/:id", deletePaciente);

module.exports = router;
