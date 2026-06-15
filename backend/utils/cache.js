const { createClient } = require('redis');

const cacheCliente = createClient({ url: process.env.REDIS_URL });
cacheCliente.on('error', err => console.error('Erro no cache Redis: ', err));

async function conectarCache() {
    await cacheCliente.connect();
    console.log('Redis cache conectado.');
}

async function get(key) {
    const valor = await cacheCliente.get(key);
    return valor ? JSON.parse(valor) : null;
}

async function set(key, valor, ttlSegundos = 60) {
    await cacheCliente.setEx(key, ttlSegundos, JSON.stringify(valor));
}

async function deletar(key) {
    await cacheCliente.del(key);
}

module.exports = { conectarCache, get, set, deletar };