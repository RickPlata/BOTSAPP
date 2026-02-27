const {Client, LocalAuth, MessageMedia} = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

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
client.on('message', message => {})

module.exports = client;
