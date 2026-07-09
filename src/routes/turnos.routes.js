// src/routes/turnos.routes.js
const express = require("express");
const router = express.Router();
const turnosController = require("../controllers/turnos.controller");

// Acá van TODAS las rutas de la salita
router.get("/", turnosController.getTurnos);
router.post("/", turnosController.createTurno);
router.delete("/:id", turnosController.deleteTurno);
router.get(
  "/especialidad/:especialidad",
  turnosController.getTurnosPorEspecialidad,
);

module.exports = router;
