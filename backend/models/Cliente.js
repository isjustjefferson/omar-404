const db = require('../config/db.js');
 
function validarCPF(cpf) {
    const cpfLimpo = cpf.replace(/[.\-]/g, '');
 
    if (cpfLimpo.length !== 11) return false;
    if (/^(\d)\1+$/.test(cpfLimpo)) return false;
 
    let soma = 0;
    for (let i = 0; i < 9; i++) soma += parseInt(cpfLimpo[i]) * (10 - i);
    let primeiro = 11 - (soma % 11);
    if (primeiro >= 10) primeiro = 0;
    if (primeiro !== parseInt(cpfLimpo[9])) return false;
 
    soma = 0;
    for (let i = 0; i < 10; i++) soma += parseInt(cpfLimpo[i]) * (11 - i);
    let segundo = 11 - (soma % 11);
    if (segundo >= 10) segundo = 0;
    if (segundo !== parseInt(cpfLimpo[10])) return false;
 
    return true;
}
 
const Cliente = {
    async criar({ nome, cpf, telefone, email }) {
        if (!nome || !cpf) {
            throw new Error('Nome e CPF são obrigatórios.');
        }
 
        const cpfValido = validarCPF(cpf);
        if (!cpfValido) {
            throw new Error('CPF inválido.');
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
            WHERE id = $4 RETURNING *`,
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