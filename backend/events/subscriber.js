const { createClient } = require('redis');

const subscriber = createClient({ url: process.env.REDIS_URL });

subscriber.on('error', err => console.error('Erro no Redis subscriber:', err));

async function conectarSubscriber(io) {
    await subscriber.connect();
    console.log('Redis subscriber conectado.');

    await subscriber.subscribe('contrato:criado', (mensagem) => {
        const dados = JSON.parse(mensagem);
        console.log('Evento recebido - contrato:criado:', dados);
        io.emit('contrato:criado', dados);
    });

    await subscriber.subscribe('sepultamento:confirmado', (mensagem) => {
        const dados = JSON.parse(mensagem);
        console.log('Evento recebido - sepultamento:confirmado:', dados);
        io.emit('sepultamento:confirmado', dados);
    }, 50);
}

module.exports = { conectarSubscriber };