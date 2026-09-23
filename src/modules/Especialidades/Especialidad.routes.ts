// ============================================================
//  RUTAS: Especialidades
//  Endpoints de especialidades. Cuelgan de /api/v1/especialidades.
//  CRUD simple (GET/POST/PUT/DELETE), todo duro (sin soft delete).
// ============================================================

const express = require("express");
const router = express.Router();
const { getEspecialidades, createEspecialidad, updateEspecialidad, deleteEspecialidad } = require('./Especialidad.controller');

const { validarSchema } = require('../../middlewares/validarDatos.middleware');
const { crearEspecialidadSchema, actualizarEspecialidadSchema } = require('./dtos/Especialidad.schema');

router.get("/", getEspecialidades);
router.post("/", validarSchema(crearEspecialidadSchema), createEspecialidad);
router.put("/:id", validarSchema(actualizarEspecialidadSchema), updateEspecialidad);
router.delete("/:id", deleteEspecialidad);

module.exports = router;