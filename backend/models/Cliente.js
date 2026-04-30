const db = require('../config/db.js');

const Cliente = {
    async criar({ nome, cpf, telefone, email }) {
        if (!nome || !cpf) {
            throw new Error('Nome e CPF são obrigatórios.');
        }

        const result = await db.query(
            `INSERT INTO clientes (nome, cpf, telefone, email)
            VALUES ($1, $2, $3, $4) RETURNING *`,
            [nome, cpf, telefone, email]
        );
        return result.rown[0];
    },

    async listarTodos() {
        const result = await db.query(
            `SELECT * FROM clientes ORDER BY criado_em DESC`
        );
        return result.rows;
    },

    async atualizar(id, { nome, telefone, email }) {
        const result = await db.query(
            `UPDATE cliente SET nome = $1, telefone = $2, email = $3
            WHERE id = $4 RETURINING *`,
            [nome, telefone, email, id]
        );
        return result.rows[0];
    }
};

module.exports = Cliente;

//será necessário avaliar se todos esses métodos serão definitivos