const db = require('../config/db.js');

const Servico = {
    async criar({ tipo, descricao, valor, falecido_id }) {
        if (!tipo || !valor || !falecido_id) {
            throw new Error('Tipo, valor e falecido são obrigatórios.');
        }

        const result = await db.query(
            `INSERT INTO servicos (tipo, descricao, valor, falecido_id)
            VALUES ($1, $2, $3, $4) RETURNING *`,
            [tipo, descricao, valor, falecido_id]
        )
        return result.rows[0];
    },

    async listarTodos() {
        const result = await db.query(
            `SELECT s.*, f.nome AS nome_falecido
            FROM servicos s
            LEFT JOIN falecidos f ON s.falecido_id = f.id
            ORDER BY s.criado_em DESC`
        );
        return result.rows;
    },

    async atualizarStatus(id, status) {
        const statusValidos = ['pendente', 'em_andamento', 'concluido', 'cancelado'];
        if(!statusValidos.includes(status)) {
            throw new Error(`Status inválido. Use: ${statusValidos.join(', ')}`);
        }

        const result = await db.query(
            `UPDATE servicos SET status = $1 WHERE id = $2 RETURNING *`,
            [status, id]
        );
        return result.rows[0];
    }
};

module.exports = Servico;

//será necessário avaliar se todos esses métodos serão definitivos