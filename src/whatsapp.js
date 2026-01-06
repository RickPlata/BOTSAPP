const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const registerHandlers = require('./handlers');

function startWhatsapp() {
  const client = new Client({ authStrategy: new LocalAuth() });

  console.log('-> El cliente se esta iniciando');

  client.on('qr', qr => qrcode.generate(qr, { small: true }));

  client.on('ready', () => {
    console.log('->El cliente está listo');
    registerHandlers(client);
  });

  client.initialize();
}

module.exports = startWhatsapp;

