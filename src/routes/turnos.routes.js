// src/routes/turnos.routes.js
const express = require("express");
const router = express.Router();
const { getTurnos, createTurno, deleteTurno, getTurnosPorEspecialidad,
  updateTurno,
  updateEspecialidad, } = require('../controllers/turnos.controller');

// Acá van TODAS las rutas de la salita
router.get("/", getTurnos);
router.post("/", createTurno);
router.delete("/:id", deleteTurno);
router.get("/especialidad/:especialidad", getTurnosPorEspecialidad);
router.put("/:id", updateTurno);
router.patch("/:id/especialidad", updateEspecialidad);

module.exports = router;
