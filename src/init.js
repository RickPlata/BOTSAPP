const {Client, LocalAuth, MessageMedia} = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const {replyMsg} = require('./handlers/messageHandler');

// Inicializar el cliente de WhatsApp Web
const client = new Client({
    authStrategy: new LocalAuth()
});

// Evento: Generar código QR
client.on('qr', qr => {
    console.log('📱 Escanea el código QR para conectarte:');
    qrcode.generate(qr, { small: true });
});

// Evento: Cliente listo
client.on('ready', () => {
    console.log('✅ Cliente de WhatsApp conectado y listo');
});

// Evento: Error
client.on('error', error => {
    console.error('❌ Error del cliente:', error);
});

// Evento: Desconexión
client.on('disconnected', reason => {
    console.log('⚠️ Cliente desconectado:', reason);
});

//Evento mensaje recibido
client.on('message', message => {
     const {from, body} = message;
     let txt = body.normalize("NFD")
                   .replace(/[\u0300-\u036f]/g, "")
                   .toLowerCase();
     console.log(`📩 Mensaje recibido de ${from}: ${txt}`);
     replyMsg(client, message);

 })

module.exports = client;
