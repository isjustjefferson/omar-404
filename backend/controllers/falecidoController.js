const Falecido = require('../models/Falecido');

const falecidoController = {
    async getAll(req, res) {
        try {
            const falecidos = await Falecido.listarTodos();
            return res.json(falecidos);
        } catch (err) {
            return res.status(500).json({
                erro: err.message
            });
        }
    },

    async getById(req, res) {
        try {
            const falecido = await Falecido.buscarPorId(req.params.id);
            if (!falecido) {
                return res.status(404).json({
                    erro: 'Falecido não encontrado.'
                });
            }
            return res.json(falecido);
        } catch (err) {
            return res.status(500).json({
                erro: err.message
            });
        }
    },

    async create(req, res) {
        try {
            const { 
                nome,
                data_nascimento, 
                data_falecimento, 
                causa_morte, 
                cliente_id 
            } = req.body;


            if (!nome || !data_falecimento || !cliente_id) {
                return res.status(400).json({ erro: 'Nome, data de falecimento e cliente_id são obrigatórios.' });
            }

            const falecido = await Falecido.criar({
                nome,
                data_nascimento, 
                data_falecimento, 
                causa_morte, 
                cliente_id
            });

            return res.status(201).json(falecido);
        } catch (err) {
            return res.status(400).json({
                erro: err.message
            });
        }
    },

    async update(req, res) {
        try {
            const {
                nome,
                data_nascimento,
                data_falecimento,
                causa_morte,
                cliente_id
            } = req.body;

            const falecido = await Falecido.atualizar(
                req.params.id,
                {
                    nome,
                    data_nascimento,
                    data_falecimento,
                    causa_morte,
                    cliente_id
                }
            );

            if (!falecido) {
                return res.status(404).json({
                    erro: 'Falecido não encontrado'
                });
            }

            return res.json(falecido);
        } catch (err) {
            return res.status(500).json({
                erro: err.message
            });
        }
    },

    async delete(req, res) {
        try {
            const falecido = await Falecido.buscarPorId(req.params.id);
            if(!falecido) {
                return res.status(404).json({
                    erro: 'Falecido não encontrado.'
                });
            }
            await Falecido.deletar(req.params.id);
            return res.json({
                mensagem: 'Falecido removido com sucesso;'
            });
        } catch (err) {
            return res.status(500).json({
                erro: err.message
            });
        }
    }
};

module.exports = falecidoController;