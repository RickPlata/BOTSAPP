const {MessageMedia} = require('whatsapp-web.js');

//Función para enviar archivos
const sendMedia = (client, to, file) => {
    const mediaFile = MessageMedia.fromFilePath(`./mediaSend/${file}`)
    client.sendMessage(to, mediaFile)
}

//Función para enviar mensajes
const sendMessage = (client, to, message) => {
    client.sendMessage(to, message)
}

//Funcion para enviar un horario
const sendHorario = (client, to, file) => {
    const mediaFile = MessageMedia.fromFilePath(`./mediaSend/horarios/${file}`)
    client.sendMessage(to, mediaFile)
}

module.exports = {sendMedia, sendMessage, sendHorario};