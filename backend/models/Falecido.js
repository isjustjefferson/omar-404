const db = require('../config/db.js');

const Falecido = {
    async criar({ nome, data_nascimento, data_falecimento, causa_morte, cliente_id }) {
        if (!nome || !data_falecimento) {
            throw new Error('Nome e daata de falecimento são obrigatórios.');
        }

        const result = await db.query(
            `INSERT INTO falecidos (nome, data_nascimento, data_falecimento, causa_morte, cliente_id)
            VALUES ($1, $2, $3, $4, $5) RETURNING *`
            [nome, data_nascimento, data_falecimento, causa_morte, cliente_id]
        );
        return result.rows[0];
    },

    async listarTodos() {
        const result = await db.query(
            `SELECT f.*, c.nome AS nome_cliente
            FROM falecidos f
            LEFT JOIN clientes c ON f.cliente_id = c.id
            ORDER BY f.criado_em DESC`
        );
        return result.rows;
    },

    async buscarPorId(id) {
        const result = await db.query(
            `SELECT * FROM falecidos WHERE id = $1`,
            [id]
        );
        return result.rows[0];
    }
};

module.exports = Falecido;

//será necessário avaliar se todos esses métodos serão definitivos