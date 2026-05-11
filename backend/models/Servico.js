const db = require('../config/db.js');

const Servico = {
    async criar({ tipo, descricao, valor, data_velorio, data_sepultamento, falecido_id, cliente_id, admin_id }) {
        if (!tipo || !valor || !falecido_id || !cliente_id) {
            throw new Error('Tipo, valor, falecido e cliente são obrigatórios.');
        }

        const result = await db.query(
            `INSERT INTO servicos (tipo, descricao, valor, data_velorio, data_sepultamento, falecido_id, cliente_id, admin_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [tipo, descricao, valor, data_velorio, data_sepultamento, falecido_id, cliente_id, admin_id]
        );
        return result.rows[0];
    },

    async listarTodos(admin_id) {
        const result = await db.query(
            `SELECT s.*, f.nome AS nome_falecido, c.nome AS nome_cliente
            FROM servicos s
            LEFT JOIN falecidos f ON s.falecido_id = f.id
            LEFT JOIN clientes c ON s.cliente_id = c.id
            WHERE s.admin_id = $1
            ORDER BY s.criado_em DESC`,
            [admin_id]
        );
        return result.rows;
    },

    async buscarPorId(id, admin_id) {
        const result = await db.query(
            `SELECT s.*, f.nome AS nome_falecido, c.nome AS nome_cliente
            FROM servicos s
            LEFT JOIN falecidos f ON s.falecido_id = f.id
            LEFT JOIN clientes c ON s.cliente_id = c.id
            WHERE s.id = $1 AND s.admin_id = $2`,
            [id, admin_id]
        );
        return result.rows[0];
    },

    async atualizar(id, dados, admin_id) {
        const { tipo, descricao, valor, data_velorio, data_sepultamento, falecido_id, cliente_id, status } = dados;

        const statusValidos = ['pendente', 'em_andamento', 'concluido', 'cancelado'];
        if (status && !statusValidos.includes(status)) {
            throw new Error(`Status inválido. Use: ${statusValidos.join(', ')}`);
        }

        const result = await db.query(
            `UPDATE servicos
            SET tipo = $1, descricao = $2, valor = $3, data_velorio = $4, data_sepultamento = $5, falecido_id = $6, cliente_id = $7, status = $8
            WHERE id = $9 AND admin_id = $10 RETURNING *`,
            [tipo, descricao, valor, data_velorio, data_sepultamento, falecido_id, cliente_id, status, id, admin_id]
        );
        return result.rows[0];
    },

    async atualizarStatus(id, status, admin_id) {
        const statusValidos = ['pendente', 'em_andamento', 'concluido', 'cancelado'];
        if (!statusValidos.includes(status)) {
            throw new Error(`Status inválido. Use: ${statusValidos.join(', ')}`);
        }

        const result = await db.query(
            `UPDATE servicos SET status = $1 WHERE id = $2 AND admin_id = $3 RETURNING *`,
            [status, id, admin_id]
        );
        return result.rows[0];
    },

    async deletar(id, admin_id) {
        await db.query(
            `DELETE FROM servicos WHERE id = $1 AND admin_id = $2`, 
            [id, admin_id]
        );
    }
};

module.exports = Servico;
