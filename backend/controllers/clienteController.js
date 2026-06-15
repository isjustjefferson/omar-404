const Cliente = require('../models/Cliente');
const { publicar } = require('../events/publisher');
const getAdminId = require('../utils/getAdminId');
const cache = require('../utils/cache');

const CACHE_TTL = 60;

const clienteController = {
    async getAll(req, res) {
        try {
            const admin_id = await getAdminId(req.usuario);
            const cacheKey = `clientes:admin:${admin_id}`;

            const cached = await cache.get(cacheKey);
            if (cached) return res.json(cached);
            
            const clientes = await Cliente.listarTodos(admin_id);
            await cache.set(cacheKey, clientes, CACHE_TTL);
            return res.json(clientes);
        } catch (err) {
            return res.status(500).json({
                erro: err.message
            });
        }
    },

    async getById(req, res) {
        try {
            const admin_id = await getAdminId(req.usuario);
            const cliente = await Cliente.buscarComFalecidos(req.params.id, admin_id);
            if (!cliente) {
                return res.status(404).json({
                    erro: 'Cliente não encontrado.'
                });
            }
            return res.json(cliente);
        } catch (err) {
            return res.status(500).json({
                erro: err.message
            });
        }
    },

    async create(req, res) {
        try {
            const admin_id = await getAdminId(req.usuario);
            const cliente = await Cliente.criar({ ...req.body, admin_id });

            console.log('CLIENTE COMPLETO:', cliente);

            await cache.deletar(`clientes:admin:${admin_id}`);
            await publicar('cliente:cadastrado', {
                id: cliente.id,
                nome: cliente.nome,
                cpf: cliente.cpf,
                telefone: cliente.telefone,
                email: cliente.email,
                admin_id: cliente.admin_id,
                criado_em: cliente.criado_em
            });

            return res.status(201).json(cliente);
        } catch (err) {
            console.log(err);
            return res.status(400).json({
                erro: err.message
            });
        }
    },

   async update(req, res) {
    try {
        const admin_id = await getAdminId(req.usuario);
        const cliente = await Cliente.buscarPorId(req.params.id, admin_id);
        if(!cliente) {
            return res.status(404).json({
                erro: 'Cliente não encontrado.'
            });
        }
        const atualizado = await Cliente.atualizar(req.params.id, req.body, admin_id);
        
        await cache.deletar(`clientes:admin${admin_id}`);
        await publicar('cliente:atualizado', {
            id: atualizado.id,
            nome: atualizado.nome,
            cpf: atualizado.cpf,
            telefone: atualizado.telefone,
            email: atualizado.email,
            admin_id: atualizado.admin_id,
            criado_em: atualizado.criado_em
        });

        return res.json(atualizado);
    } catch (err) {
        return res.status(500).json({
            erro: err.message
        });
    }
},

    async delete(req, res) {
        try {
            const admin_id = await getAdminId(req.usuario);
            const cliente = await Cliente.buscarPorId(req.params.id, admin_id);
            if (!cliente) {
                return res.status(404).json({
                    erro: 'Cliente não encontrado.'
                });
            }
            await Cliente.deletar(req.params.id, admin_id);
            await cache.deletar(`clientes:admin:${admin_id}`);
            await publicar('cliente:removido', {
                id: cliente.id
            });

            return res.json({
                mensagem: 'Cliente removido com sucesso.'
            });
        } catch (err) {
            if (err.code === '23503') {
                return res.status(400).json({
                    erro: 'Não é possível removeu um cliente que possui falecidos vinculados.'
                });
            }

            return res.status(500).json({
                erro: err.message
            });
        }
    }
}

module.exports = clienteController;