const express = require('express');
const router = express.Router();
const adminRegisterController = require('../controllers/adminRegisterController');

router.post('/solicitar', adminRegisterController.solicitar);
router.post('/confirmar', adminRegisterController.confirmar);

module.exports = router;