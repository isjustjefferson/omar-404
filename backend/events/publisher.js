const { createClient } = require('redis');

const publisher = createClient({
    url: process.env.REDIS_URL
});

publisher.on('error', (err) =>
    console.error('Erro no Redis publisher:', err)
);

async function conectarPublisher() {
    await publisher.connect();
    console.log('Redis publisher conectado.');
}

async function publicar(evento, dados) {

    console.log('EVENTO:', evento);
    console.log('DADOS ENVIADOS AO REDIS:', dados);

    await publisher.publish(evento, JSON.stringify(dados));

    console.log(`Evento publicado: ${evento}`);
}

module.exports = {
    conectarPublisher,
    publicar
};
