const express = require('express');
const controller = require('../controllers/users.controllers');
const { authMiddleware, requireRole } = require('../auth');

const router = express.Router();

router.post('/login', controller.loginUser)
router.post('/create', authMiddleware, requireRole('admin'), controller.create)

module.exports = { router }