const Usuario = require('../models/Usuario');

const usuarioController = {
    async getMe(req, res) {
        try {
            const usuario = await Usuario.buscarPorID(req.usuario.id);
            
            if (!usuario) {
                return res.status(404).json({
                    erro: 'Usuário não encontrado.'
                });
            }

            return res.json(usuario);
        } catch (err) {
            return res.status(500).json({
                erro: err.message
            });
        }
    },

    async updateMe(req, res) {
        try {
            const { nome, email } = req.body;
            const atualizado = await Usuario.atualizar(req.usuario.id, { nome, email });
            return res.json(atualizado);
        } catch (err) {
            return res.status(500).json({
                erro: err.message
            });
        }
    },

    async deleteMe(req, res) {
        try {
            await Usuario.deletar(req.usuario.id);
            return res.json({
                mensagem: 'Conta removida com sucesso.'
            });
        } catch (err) {
            return res.status(500).json({
                erro: err.message
            });
        }
    },

    async getAll(req, res) {
        try {
            const usuarios = await Usuario.listarTodos();
            return res.json(usuarios);
        } catch (err) {
            return res.status(500).json({ erro: err.message });
        }
    }
}

module.exports = usuarioController;