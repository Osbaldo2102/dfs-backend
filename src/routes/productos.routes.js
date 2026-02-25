const express = require('express');
const controller = require('../controllers/productos.controller');
const { asyncHandler } = require('../utils/asyncHandler');
const { authMiddleware } = require('../auth');

const router = express.Router();

//rutas 
router.get('/', asyncHandler(controller.getAllVisible))
router.get('/all', asyncHandler(controller.getAll))
router.get('/search', asyncHandler(controller.search))
router.get('/:id', asyncHandler(controller.getById))
router.post('/', authMiddleware, requireRole('admin'), asyncHandler(controller.create));
router.put('/:id', asyncHandler(controller.update))
router.delete('/:id', asyncHandler(controller.remove));

module.exports = { router };