const express = require('express');
const router = express.Router();
const autenticar = require('../middlewares/auth');
const usuarioController = require('../controllers/usuarioController');

router.get('/me', autenticar, usuarioController.getMe);
router.put('/me', autenticar, usuarioController.updateMe);
router.delete('/me', autenticar, usuarioController.deleteMe);

router.get('/', autenticar, usuarioController.getAll);

module.exports = router;