const { MessageMedia } = require('whatsapp-web.js');

function createMessenger(client) {
  const sendMessage = (to, message) => client.sendMessage(to, message);

  const sendMedia = (to, file) => {
    const mediaFile = MessageMedia.fromFilePath(`./mediaSend/${file}`);
    return client.sendMessage(to, mediaFile);
  };

  const sendHorario = (to, file) => {
    const mediaFile = MessageMedia.fromFilePath(`./mediaSend/horarios/${file}`);
    return client.sendMessage(to, mediaFile);
  };

  return { sendMessage, sendMedia, sendHorario };
}

module.exports = { createMessenger };

