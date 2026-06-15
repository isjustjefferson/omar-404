const Usuario = require('../models/Usuario');
const db = require('../config/db');
const { publicar } = require('../events/publisher');
const cache = require('../utils/cache');

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
    },

    async listarOperadores(req, res) {
        try {
            const result = await db.query(
            `SELECT id, nome, email, perfil, admin_id, criado_em
            FROM usuarios
            WHERE perfil = 'operador' AND admin_id = $1
            ORDER BY criado_em DESC`,
            [req.usuario.id]
            );
            return res.json(result.rows);
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                erro: err.message
            })
        }
    },

    async deletarOperadores(req, res) {
        try {
            const operador = await Usuario.buscarPorID(req.params.id);

            await Usuario.deletar(req.params.id);
            await cache.deletar(`admin_id:operador:${req.params.id}`);
            await publicar('operador:removido', {
                id: operador.id,
                nome: operador.nome,
                admin_id: operador.admin_id,
                removido_em: new Date().toISOString()
            })

            await PublicKeyCredential('operador:removido', {
                id: this.listarOperadores.id,
            })

            return res.json({
                mensagem: 'Usuário removido com sucesso.'
            });
        } catch (err) {
            return res.status(500).json({
                erro: err.message
            });
        }
    }
}

module.exports = usuarioController;