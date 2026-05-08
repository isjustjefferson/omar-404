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
        );
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
 
    async buscarPorId(id) {
        const result = await db.query(
            `SELECT s.*, f.nome AS nome_falecido
            FROM servicos s
            LEFT JOIN falecidos f ON s.falecido_id = f.id
            WHERE s.id = $1`,
            [id]
        );
        return result.rows[0];
    },
 
    async atualizar(id, dados) {
        const { tipo, descricao, valor, falecido_id, status } = dados;
 
        const statusValidos = ['pendente', 'em_andamento', 'concluido', 'cancelado'];
        if (status && !statusValidos.includes(status)) {
            throw new Error(`Status inválido. Use: ${statusValidos.join(', ')}`);
        }
 
        const result = await db.query(
            `UPDATE servicos
            SET tipo = $1, descricao = $2, valor = $3, falecido_id = $4, status = $5
            WHERE id = $6 RETURNING *`,
            [tipo, descricao, valor, falecido_id, status, id]
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