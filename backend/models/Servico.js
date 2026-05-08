const db = require('../config/db.js');

const Servico = {
    async criar({ tipo, descricao, valor, falecido_id, cliente_id }) {
        if (!tipo || !valor || !falecido_id || !cliente_id) {
            throw new Error('Tipo, valor, falecido e cliente são obrigatórios.');
        }

        const result = await db.query(
            `INSERT INTO servicos (tipo, descricao, valor, falecido_id, cliente_id)
            VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [tipo, descricao, valor, falecido_id, cliente_id]
        );
        return result.rows[0];
    },

    async listarTodos() {
        const result = await db.query(
            `SELECT s.*, f.nome AS nome_falecido, c.nome AS nome_cliente
            FROM servicos s
            LEFT JOIN falecidos f ON s.falecido_id = f.id
            LEFT JOIN clientes c ON s.cliente_id = c.id
            ORDER BY s.criado_em DESC`
        );
        return result.rows;
    },

    async buscarPorId(id) {
        const result = await db.query(
            `SELECT s.*, f.nome AS nome_falecido, c.nome AS nome_cliente
            FROM servicos s
            LEFT JOIN falecidos f ON s.falecido_id = f.id
            LEFT JOIN clientes c ON s.cliente_id = c.id
            WHERE s.id = $1`,
            [id]
        );
        return result.rows[0];
    },

    async atualizar(id, dados) {
        const { tipo, descricao, valor, falecido_id, cliente_id, status } = dados;

        const statusValidos = ['pendente', 'em_andamento', 'concluido', 'cancelado'];
        if (status && !statusValidos.includes(status)) {
            throw new Error(`Status inválido. Use: ${statusValidos.join(', ')}`);
        }

        const result = await db.query(
            `UPDATE servicos
            SET tipo = $1, descricao = $2, valor = $3, falecido_id = $4, cliente_id = $5, status = $6
            WHERE id = $7 RETURNING *`,
            [tipo, descricao, valor, falecido_id, cliente_id, status, id]
        );
        return result.rows[0];
    },

    async atualizarStatus(id, status) {
        const statusValidos = ['pendente', 'em_andamento', 'concluido', 'cancelado'];
        if (!statusValidos.includes(status)) {
            throw new Error(`Status inválido. Use: ${statusValidos.join(', ')}`);
        }

        const result = await db.query(
            `UPDATE servicos SET status = $1 WHERE id = $2 RETURNING *`,
            [status, id]
        );
        return result.rows[0];
    },

    async deletar(id) {
        await db.query(`DELETE FROM servicos WHERE id = $1`, [id]);
    }
};

module.exports = Servico;
