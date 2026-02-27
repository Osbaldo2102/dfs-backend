const express = require('express');
const router = express.Router();
const citasController = require('../controllers/citas.controller');
const { authMiddleware } = require('../auth');

// Ruta para que los clientes agenden (Pública)
router.post('/', citasController.agendarCita);
router.get('/', authMiddleware, citasController.obtenerCitas);

router.put('/:id', authMiddleware, citasController.actualizarEstadoCita); // Ruta para actualizar estado (Protegida)

// Ruta para que el Admin vea las citas (Protegida)
router.get('/', authMiddleware, citasController.obtenerCitas);

module.exports = { router };