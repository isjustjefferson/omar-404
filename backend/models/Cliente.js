const db = require('../config/db.js');
const axios = require('axios');

async function validarCPF(cpf) {
    const cpfLimpo = cpf.replace(/[.\-]/g, '');

    try {
        const response = await axios.get(`https://brasilapi.com.br/api/cpf/v1/${cpfLimpo}`);
        return response.status === 200;
    } catch (err) {
        return false;
    }
}

const Cliente = {
    async criar({ nome, cpf, telefone, email }) {
        if (!nome || !cpf) {
            throw new Error('Nome e CPF são obrigatórios.');
        }

        const cpfValido = await validarCPF(cpf);
        if (!cpfValido) {
            throw new Error('CPF inválido ou não encontrado.');
        }

        const existe = await db.query(
            `SELECT id FROM clientes WHERE cpf = $1`,
            [cpf]
        );
        if (existe.rows.length > 0) {
            throw new Error('CPF já cadastrado.');
        }

        const result = await db.query(
            `INSERT INTO clientes (nome, cpf, telefone, email)
            VALUES ($1, $2, $3, $4) RETURNING *`,
            [nome, cpf, telefone, email]
        );
        return result.rows[0];
    },

    async listarTodos() {
        const result = await db.query(
            `SELECT * FROM clientes ORDER BY criado_em DESC`
        );
        return result.rows;
    },

    async buscarPorId(id) {
        const result = await db.query(
            `SELECT * FROM clientes WHERE id = $1`,
            [id]
        );
        return result.rows[0];
    },

    async buscarComFalecidos(id) {
        const cliente = await db.query(
            `SELECT * FROM clientes WHERE id = $1`,
            [id]
        );

        if (cliente.rows.length === 0) return null;

        const falecidos = await db.query(
            `SELECT * FROM falecidos WHERE cliente_id = $1 ORDER BY criado_em DESC`,
            [id]
        );

        return {
            ...cliente.rows[0],
            falecidos: falecidos.rows
        };
    },

    async atualizar(id, { nome, telefone, email }) {
        const result = await db.query(
            `UPDATE clientes SET nome = $1, telefone = $2, email = $3
            WHERE id = $4 RETURINING *`,
            [nome, telefone, email, id]
        );
        return result.rows[0];
    },

    async deletar(id) {
        await db.query(
            `DELETE FROM clientes WHERE id = $1`,
            [id]
        );
    }
};

module.exports = Cliente;

//será necessário avaliar se todos esses métodos serão definitivos