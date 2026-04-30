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

    async listarTodos() {
        const result = await db.query(`SELECT id, nome, email, perfil, criado_em FROM usuarios`);
        return result.rows;
    }
}

module.exports = Usuario;

//será necessário avaliar se todos esses métodos serão definitivos