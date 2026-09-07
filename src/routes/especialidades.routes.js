const express = require("express");
const router = express.Router();
const { getEspecialidades, createEspecialidad, updateEspecialidad, deleteEspecialidad } = require('../controllers/especialidades.controller');

router.get("/", getEspecialidades);
router.post("/", createEspecialidad);
router.put("/:id", updateEspecialidad);
router.delete("/:id", deleteEspecialidad);  // ✅ Nueva ruta

module.exports = router;