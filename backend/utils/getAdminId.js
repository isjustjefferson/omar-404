const db = require('../config/db');

async function getAdminId(usuario) {
    if (usuario.perfil === 'admin') {
        return usuario.id;
    }

    const result = await db.query(
        `SELECT admin_id FROM usuarios WHERE id = $1`,
        [usuario.id]
    );

    if (!result.rows[0]?.admin_id) {
        throw new Error('Operador sem administrador vinculado.');
    }

    return result.rows[0].admin_id;
}

module.exports = getAdminId;