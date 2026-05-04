const express = require('express');
const router = express.Router();
const autenticar = require('../middlewares/auth');
const servicoController = require('../controllers/servicoController');

router.get('/', autenticar, servicoController.getAll);
router.get('/:id', autenticar, servicoController.getById);
router.post('/', autenticar, servicoController.create);
router.put('/:id', autenticar, servicoController.update);
router.patch('/:id/status', autenticar, servicoController.updateStatus);
router.delete('/:id', autenticar, servicoController.delete);

module.exports = router;