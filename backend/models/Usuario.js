const db = require('../config/db.js');

const Usuario = {
    async criar({ nome, email, senha, perfil = 'operador' }) {
        const result = await db.query(
            `INSERT INTO usuarios (nome, email, senha, perfil)
            VALUES ($1, $2, $3, $4) RETURNING *`,
            [nome, email, senha, perfil]
        );
        return result.rows[0]
    },
    
    async buscarPorEmail(email) {
        const result = await db.query(
            `SELECT * FROM usuarios WHERE email = $1`,
            [email]
        );
        return result.rows[0];
    },

    async buscarPorID(id) {
        const result = await db.query(
            `SELECT id, nome, email, perfil, criado_em  FROM usuarios WHERE id = $1`,
            [id]
        );
        return result.rows[0];
    },

    async atualizar(id, { nome, email }){
        const result = await db.query(
            `UPDATE usuarios SET nome = $1, email = $2 WHERE id = $3 RETURNING id, nome, email, perfil, criado_em`,
            [nome, email, id]
        );
        return result.rows[0];
    },

    async deletar(id) {
        const result = await db.query(`DELETE FROM usuarios WHERE id = $1`);
    },

    async listarTodos() {
        const result = await db.query(
            `SELECT * FROM usuarios ORDER BY criado_em DESC`
        );
        return result.rows;
    }
}

module.exports = Usuario;