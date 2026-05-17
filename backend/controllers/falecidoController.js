const Falecido = require('../models/Falecido');
const { publicar } = require('../events/publisher');
const getAdminId = require('../utils/getAdminId');

const falecidoController = {
    async getAll(req, res) {
        try {
            const admin_id = await getAdminId(req.usuario);
            const falecidos = await Falecido.listarTodos(admin_id);
            return res.json(falecidos);
        } catch (err) {
            return res.status(500).json({
                erro: err.message
            });
        }
    },

    async getById(req, res) {
        try {
            const admin_id = await getAdminId(req.usuario);
            const falecido = await Falecido.buscarPorId(req.params.id, admin_id);
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
            const admin_id = await getAdminId(req.usuario);
            const { 
                nome,
                data_nascimento, 
                data_falecimento, 
                causa_morte, 
                cliente_id 
            } = req.body;


            if (!nome || !data_falecimento || !cliente_id) {
                return res.status(400).json({ erro: 'Nome, data de falecimento e cliente são obrigatórios.' });
            }

            if (data_nascimento && data_falecimento) {
                const nascimento = new Date(data_nascimento);
                const falecimento = new Date(data_falecimento);

                if (falecimento < nascimento) {
                    return res.status(400).json({
                        erro: 'A data de falecimento não deve ser posterior ao nascimento.'
                    })
                }
            }

            if (new Date(data_falecimento) > new Date()) {
                return res.status(400).json({
                    erro: 'A data de falecimento não pode ser uma data futura.'
                })
            }

            if (new Date(data_nascimento) > new Date()) {
                return res.status(400).json({
                    erro: 'A data de nascimento não pode ser uma data futura.'
                })
            }

            const falecido = await Falecido.criar({
                nome,
                data_nascimento, 
                data_falecimento, 
                causa_morte, 
                cliente_id,
                admin_id
            });

            await publicar('falecido:cadastrado', {
                id: falecido.id,
                nome: falecido.nome,
                data_nascimento: falecido.data_nascimento,
                data_falecimento: falecido.data_falecimento,
                causa_morte: falecido.causa_morte,
                cliente_id: falecido.cliente_id,
                criado_em: falecido.criado_em
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
        const admin_id = await getAdminId(req.usuario);
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
            },
            admin_id
        );

        if (!falecido) {
            return res.status(404).json({ erro: 'Falecido não encontrado' });
        }

        await publicar('falecido:atualizado', {
            id: falecido.id,
            nome: falecido.nome,
            data_nascimento: falecido.data_nascimento,
            data_falecimento: falecido.data_falecimento,
            causa_morte: falecido.causa_morte,
            cliente_id: falecido.cliente_id,
        });

        return res.json(falecido);
    } catch (err) {
        return res.status(500).json({ erro: err.message });
    }
},

    async delete(req, res) {
    try {
        const admin_id = await getAdminId(req.usuario);
        const falecido = await Falecido.buscarPorId(req.params.id, admin_id);
        if(!falecido) {
            return res.status(404).json({
                erro: 'Falecido não encontrado.'
            });
        }
        await Falecido.deletar(req.params.id, admin_id);
        
        await publicar('falecido:removido', { id: req.params.id });
        
        return res.json({
            mensagem: 'Falecido removido com sucesso.'
        });
    } catch (err) {
        return res.status(500).json({
            erro: err.message
        });
    }
}
};

module.exports = falecidoController;