const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const registerHandlers = require('./handlers');

function startWhatsapp(onQr) {
  const client = new Client({ authStrategy: new LocalAuth() });

  console.log('-> El cliente se esta iniciando');

  client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
    if (typeof onQr === 'function') onQr(qr);
  });

  client.on('ready', () => {
    console.log('-> El cliente está listo');
    registerHandlers(client);
  });

  client.initialize();

  return client;
}

module.exports = startWhatsapp;

