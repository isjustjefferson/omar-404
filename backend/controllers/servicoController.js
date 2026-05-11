const Servico = require('../models/Servico');
const { publicar } = require('../events/publisher');
const getAdminId = require('../utils/getAdminId');

const servicoController = {
    async getAll(req, res) {
        try {
            const admin_id = await getAdminId(req.usuario);
            const servicos = await Servico.listarTodos(admin_id);
            return res.json(servicos);
        } catch (err) {
            return res.status(500).json({
                erro: err.message
            });
        }
    },

    async getById(req, res) {
        try {
            const admin_id = await getAdminId(req.usuario);
            const servico = await Servico.buscarPorId(req.params.id, admin_id);
            if (!servico) {
                return res.status(404).json({
                    erro: 'Serviço não encontrado.'
                });
            }
            return res.json(servico);
        } catch (err) {
            return res.status(500).json({
                erro: err.message
            });
        }
    },

    async create(req, res) {
        try {
            const admin_id = await getAdminId(req.usuario);
            const servico = await Servico.criar(req.body, admin_id);
            
            await publicar('contrato:criado', {
                id: servico.id,
                tipo: servico.tipo,
                descricao: servico.descricao,
                data_velorio: servico.data_velorio,
                valor: servico.valor,
                falecido_id: servico.falecido_id,
                cliente_id: servico.cliente_id,
                criado_em: servico.criado_em,
                admin_id: servico.admin_id
            });

            return res.status(201).json(servico);
        } catch (err) {
            return res.status(400).json({
                erro: err.message
            });
        }
    },

    async update(req, res) {
        try {
            const admin_id = await getAdminId(req.usuario);
            const servico = await Servico.buscarPorId(req.params.id, admin_id);
            if (!servico) {
                return res.status(404).json({
                    erro: 'Serviço não encontrado.'
                });
            }
            const atualizado = await Servico.atualizar(req.params.id, req.body, admin_id);
            
            await publicar('contrato:atualizado', {
                id: atualizado.id,
                tipo: atualizado.yipo,
                valor: atualizado.valor,
                status: atualizado.status,
                admin_id: atualizado.admin_id
            });
            
            return res.json(atualizado);
        } catch (err) {
            return res.status(500).json({
                erro: err.message
            });
        }
    },

    async updateStatus(req, res) {
        try {
            const admin_id = await getAdminId(req.usuario);
            const { status } = req.body;
            const servico = await Servico.atualizarStatus(req.params.id, status, admin_id);
            
            if (!servico) {
                return res.status(404).json({
                    erro: 'Serviço não encontrado'
                });
            }

            if (status === 'concluido') {
                await publicar('sepultamento:confirmado', {
                    id: servico.id,
                    tipo: servico.tipo,
                    status: servico.status,
                    data_velorio: servico.data_velorio,
                    data_sepultamento: servico.data_sepultamento,
                    falecido_id: servico.falecido_id,
                    cliente_id: servico.cliente_id,
                    admin_id: servico.admin_id
                });
            }

            if (status === 'cancelado') {
                await publicar('contrato:cancelado', {
                    id: servico.id,
                    tipo: servico.tipo,
                    status: servico.status,
                    data_velorio: servico.data_velorio,
                    data_sepultamento: servico.data_sepultamento,
                    falecido_id: servico.falecido_id,
                    cliente_id: servico.cliente_id,
                    admin_id: servico.admin_id
                });
            }

            return res.json(servico);
        } catch (err) {
            return res.status(400).json({
                erro: err.message
            });
        }
    },

    async delete(req, res) {
        try {
            const admin_id = await getAdminId(req.usuario);
            const servico = await Servico.buscarPorId(req.params.id, admin_id);
            if (!servico) {
                return res.status(404).json({
                    erro: 'Serviço não encontrado.'
                });
            }     
            await Servico.deletar(req.params.id, admin_id);
            return res.json({
                mensagem: 'Serviço removido com sucesso.'
            });
        } catch (err) {
            return res.status(500).json({
                erro: err.message
            });
        }
    }
};

module.exports = servicoController;