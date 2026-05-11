const db = require('../config/db.js');

const Falecido = {
    async criar({ nome, data_nascimento, data_falecimento, causa_morte, cliente_id, admin_id }) {
        if (!nome || !data_falecimento) {
            console.log(nome, data_nascimento, data_falecimento);
            throw new Error('Nome e daata de falecimento são obrigatórios.');
        }

        const result = await db.query(
            `INSERT INTO falecidos (nome, data_nascimento, data_falecimento, causa_morte, cliente_id, admin_id)
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [nome, data_nascimento, data_falecimento, causa_morte, cliente_id, admin_id]
        );
        return result.rows[0];
    },

    async listarTodos(admin_id) {
        const result = await db.query(
            `SELECT f.*, c.nome AS nome_cliente
            FROM falecidos f
            LEFT JOIN clientes c ON f.cliente_id = c.id
            WHERE f.admin_id = $1
            ORDER BY f.criado_em DESC`,
            [admin_id]
        );
        return result.rows;
    },

    async buscarPorId(id, admin_id) {
        const result = await db.query(
            `SELECT f.*, c.nome AS nome_cliente
            FROM falecidos f
            LEFT JOIN clientes c ON f.cliente_id = c.id
            WHERE f.id = $1 AND f.admin_id = $2`,
            [id, admin_id]
        );
        return result.rows[0];
    },

    async atualizar(id, { nome, data_nascimento, data_falecimento, causa_morte, cliente_id }, admin_id) {
        const result = await db.query(
            `UPDATE falecidos
            SET nome = $1, data_nascimento = $2, data_falecimento = $3, causa_morte = $4, cliente_id = $5
            WHERE id = $6 AND admin_id = $7 RETURNING *`,
            [nome, data_nascimento, data_falecimento, causa_morte, cliente_id, id, admin_id]
        );
        return result.rows[0];
    },

    async deletar(id, admin_id) {
        await db.query(
            `DELETE FROM falecidos WHERE id = $1 AND admin_id =  $2`,
            [id, admin_id]
        );
    }
};

module.exports = Falecido;

//será necessário avaliar se todos esses métodos serão definitivos