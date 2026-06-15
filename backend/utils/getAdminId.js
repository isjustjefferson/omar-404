const db = require('../config/db');
const cache = require('./cache');

async function getAdminId(usuario) {
    if (usuario.perfil === 'admin') {
        return usuario.id;
    }

    const cacheKey = `admin_id:operador:${usuario.id}`;
    const cached = await cache.get(cacheKey);
    if (cached) return cached;

    const result = await db.query(
        `SELECT admin_id FROM usuarios WHERE id = $1`,
        [usuario.id]
    );

    if (!result.rows[0]?.admin_id) {
        throw new Error('Operador sem administrador vinculado.');
    }

    const admin_id = result.rows[0].admin_id;
    await cache.set(cacheKey, admin_id, 300);
    return admin_id;
}

module.exports = getAdminId;