const { createClient } = require('redis');

const subscriber = createClient({ url: process.env.REDIS_URL });

subscriber.on('error', err => console.error('Erro no Redis subscriber:', err));

async function conectarSubscriber(io) {
    await subscriber.connect();
    console.log('Redis subscriber conectado.');

    const eventos = [
        'contrato:criado',
        'contrato:atualizado',
        'contrato:cancelado',
        'sepultamento:confirmado',
        'falecido:cadastrado',
        'operador:cadastrado',
        'operador:removido',
        'usuario:logado'
    ];

    for (const evento of eventos) {
        await subscriber.subscribe(evento, (mensagem) => {
            const dados = JSON.parse(mensagem);
            console.log(`Evento recebido - ${evento}: `, dados);
            io.emit(evento, dados);
        });
    }
}

module.exports = { conectarSubscriber };