const express = require('express');
const router = express.Router();
const citasController = require('../controllers/citas.controller');
const { authMiddleware } = require('../auth');

// 1. Rutas de utilidad (Disponibilidad)
router.get('/disponibles', citasController.obtenerHorariosDisponibles);

// 2. Ruta para agendar (Pública o con Auth dependiendo de tu flujo)
router.post('/', citasController.agendarCita);

// 3. Ruta principal para obtener citas (ADMIN)
// Nota: Solo dejamos una definición para evitar conflictos
router.get('/', authMiddleware, citasController.obtenerCitas);

// 4. Ruta para actualizar (Confirmar/Cancelar)
router.put('/:id', authMiddleware, citasController.actualizarEstadoCita);

module.exports = { router };