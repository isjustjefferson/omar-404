const Servico = require('../models/Servico');
const { publicar } = require('../events/publisher');

const servicoController = {
    async getAll(req, res) {
        try {
            const servicos = await Servico.listarTodos();
            return res.json(servicos);
        } catch (err) {
            return res.status(500).json({
                erro: err.message
            });
        }
    },

    async getById(req, res) {
        try {
            const servico = await Servico.buscarPorId(req.params.id);
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
            const servico = await Servico.criar(req.body);
            
            await publicar('contrato:criado', {
                id: servico.id,
                tipo: servico.tipo,
                valor: servico.valor,
                falecido_id: servico.falecido_id,
                cliente_id: servico.cliente_id,
                criado_em: servico.criado_em
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
            const servico = await Servico.buscarPorId(req.params.id);
            if (!servico) {
                return res.status(404).json({
                    erro: 'Serviço não encontrado.'
                });
            }
            const atualizado = await Servico.atualizar(req.params.id, req.body);
            return res.json(atualizado);
        } catch (err) {
            return res.status(500).json({
                erro: err.message
            });
        }
    },

    async updateStatus(req, res) {
        try {
            const { status } = req.body;
            const servico = await Servico.atualizarStatus(req.params.id, status);
            
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
                    data_sepultamento: servico.data_sepultamento,
                    falecido_id: servico.falecido_id
                });
            }

            if (status === 'cancelado') {
                await publicar('contrato:cancelado', {
                    id: servico.id,
                    tipo: servico.tipo,
                    status: servico.status,
                    data_sepultamento: servico.data_sepultamento,
                    falecido_id: servico.falecido_id
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
            const servico = await Servico.buscarPorId(req.params.id);
            if (!servico) {
                return res.status(404).json({
                    erro: 'Serviço não encontrado.'
                });
            }     
            await Servico.deletar(req.params.id);
            return res.json({
                erro: 'Serviço removido com sucesso.'
            });
        } catch (err) {
            return res.status(500).json({
                erro: err.message
            });
        }
    }
};

module.exports = servicoController;