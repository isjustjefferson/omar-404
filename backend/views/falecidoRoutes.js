const express = require('express');
const router = express.Router();
const autenticar = require('../middlewares/auth');
const { apenasAdmin } = require('../middlewares/perfil');
const falecidoController = require('../controllers/falecidoController');

router.get('/', autenticar, falecidoController.getAll);
router.get('/:id', autenticar, falecidoController.getById);
router.post('/', autenticar, apenasAdmin, falecidoController.create);
router.put('/:id', autenticar, apenasAdmin, falecidoController.update);
router.delete('/:id', autenticar, apenasAdmin, falecidoController.delete);

module.exports = router;