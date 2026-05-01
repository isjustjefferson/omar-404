const express = require('express');
const router = express.Router();
const autenticar = require('../middlewares/auth');
const clienteController = require('../controllers/clienteController');

router.get('/', autenticar, clienteController.getAll);
router.get('/:id', autenticar, clienteController.getById);
router.post('/', autenticar, clienteController.create);
router.put('/:id', autenticar, clienteController.update);
router.delete('/:id', autenticar, clienteController.delete);

module.exports = router;