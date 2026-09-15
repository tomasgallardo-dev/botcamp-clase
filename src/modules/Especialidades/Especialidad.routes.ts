// ============================================================
//  RUTAS: Especialidades
//  Endpoints de especialidades. Cuelgan de /api/v1/especialidades.
//  CRUD simple (GET/POST/PUT/DELETE), todo duro (sin soft delete).
// ============================================================

const express = require("express");
const router = express.Router();
const { getEspecialidades, createEspecialidad, updateEspecialidad, deleteEspecialidad } = require('./Especialidad.controller');

router.get("/", getEspecialidades);
router.post("/", createEspecialidad);
router.put("/:id", updateEspecialidad);
router.delete("/:id", deleteEspecialidad);

module.exports = router;