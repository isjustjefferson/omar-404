const express = require('express');
const router = express.Router();
const autenticar = require('../middlewares/auth');
const { apenasAdmin } = require('../middlewares/perfil');
const servicoController = require('../controllers/servicoController');

router.get('/', autenticar, servicoController.getAll);
router.get('/:id', autenticar, servicoController.getById);
router.post('/', autenticar, apenasAdmin, servicoController.create);
router.put('/:id', autenticar, apenasAdmin, servicoController.update);
router.patch('/:id/status', autenticar, apenasAdmin, servicoController.updateStatus);
router.delete('/:id', autenticar, apenasAdmin, servicoController.delete);

module.exports = router;