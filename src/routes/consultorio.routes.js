const express = require('express');
const router = express.Router();
const {
    getConsultorios,
    createConsultorio,
    updateConsultorio,  // ✅ Importado
    deleteConsultorio
} = require('../controllers/consultorio.controller');

router.get('/', getConsultorios);
router.post('/', createConsultorio);
router.put('/:id', updateConsultorio);  // ✅ Nueva ruta
router.delete('/:id', deleteConsultorio);

module.exports = router;