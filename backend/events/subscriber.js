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
    });

    await subscriber.subscribe('falecido:cadastrado', (mensagem) => {
        const dados = JSON.parse(mensagem);
        console.log('Evento recebido - falecido:cadastrado: ', dados);
        io.emit('falecido:cadastrado', dados);
    });

    await subscriber.subscribe('contrato:cancelado', (mensagem) => {
        const dados = JSON.parse(mensagem);
        console.log('Evento recebido - contrato:cancelado:', dados);
        io.emit('contrato:cancelado', dados);
    })
}

module.exports = { conectarSubscriber };