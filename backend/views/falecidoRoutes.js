const express = require('express');
const router = express.Router();
const autenticar = require('../middlewares/auth');
const falecidoController = require('../controllers/falecidoController');

router.get('/', autenticar, falecidoController.getAll);
router.get('/:id', autenticar, falecidoController.getById);
router.post('/', autenticar, falecidoController.create);
router.put('/:id', autenticar, falecidoController.update);
router.delete('/:id', autenticar, falecidoController.delete);

module.exports = router;