const express = require('express');
const router = express.Router();
const autenticar = require('../middlewares/auth');
const { apenasAdmin } = require('../middlewares/perfil');
const usuarioController = require('../controllers/usuarioController');

router.get('/', autenticar, apenasAdmin, usuarioController.getAll);
router.get('/me', autenticar, apenasAdmin, usuarioController.getMe);
router.put('/me', autenticar, apenasAdmin, usuarioController.updateMe);
router.delete('/me', autenticar, apenasAdmin, usuarioController.deleteMe);

module.exports = router;