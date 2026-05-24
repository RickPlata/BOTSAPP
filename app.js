const {Client, LocalAuth, MessageMedia} = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const {insertEq, insertAd} = require('./src/api/db');

const report = new Map();
//var conexion = setInterval(conectar, 2700000);

//Inicialización del cliente
const client = new Client({
    authStrategy: new LocalAuth()
});

console.log("-> El cliente se esta iniciando")

//Generación de código qr
client.on('qr', qr => {
    qrcode.generate(qr,{small: true})
});

client.on('ready', () => {
    console.log('->El cliente está listo');
    listenMessage(); //Detección de mensajes
});

client.initialize();

//Función para detectar y responder mensajes
const listenMessage = () => {
    client.on('message',(msg) => {

        const {from, body} = msg;
        let txt = body.normalize("NFD")
                      .replace(/[\u0300-\u036f]/g, "")
                      .toLowerCase();

                //Algoritmo de deteccion de mensajes
                //Saludo
                if(txt === 'hola' || txt === 'ola' || txt === 'buenos dias' || txt === 'buenas tardes' || txt === 'buenas noches' || txt === 'buen dia'){
                    if(report.has(from)){
                        sendMessage(from, 'Hola de nuevo, tu sesión sigue activa recuerda cerrarla enviando un *0* o también puedes continuar enviando tu reporte');
                    }else{
                        sendMessage(from, '*Bienvenido al sistema de incidencias de laboratorios de computación* \n Ingresa la opción deseada \n \n 1.- Reporte de falla técnica \n 2.- Reporte administrativo \n 0.- Para salir \n También puedes solicitar un horario enviando tu grupo *por ejemplo "1cv1" o "9cv12"* (Cuento con todos los horarios de ICE). \n \n Si necesitas ayuda para saber cómo enviar el reporte y cómo funcionan otros comandos, envía una *h* para obtener ayuda');
                    }
                //Guardado de sesion en el Map
                }else if (txt === '1'){
                    sendMessage(from, 'Para hacer un reporte sobre una falla en un equipo envía los siguientes datos anteponiendo un guion alto *-* antes de cada dato (como se ve en la imagen de ejemplo), después de cada dato recibirás un mensaje de confirmación: \n \n *Nombre* \n *Laboratorio* \n *Numero del equipo* \n *Materia* \n *Descripción del reporte* \n \n Una vez guardados los datos escribe *G* para guardar el reporte. \n \n En caso de que te equivoques o quieras corregir un dato escribe la palabra *del* para borrar los datos o presiona *0* si quieres salir.\n \n Si necesitas ayuda para saber cómo enviar el reporte y cómo funcionan otros comandos, envía una *h* para obtener ayuda');
                    report.set(from, ['1'])
                }else if (txt === '2'){
                    sendMessage(from, 'Para hacer un reporte sobre una incidente administrativa envía los siguientes datos anteponiendo una guión alto *"-"* antes de cada dato (como se ve en la imagen de ejemplo), después de cada dato recibirás un mensaje de confirmación: \n \n *Nombre* \n *Laboratorio* \n *Materia* \n *Descripción del reporte* \n \n Una vez guardados los datos escribe *G* para guardar el reporte. \n \n En caso de que te equivoques o quieras cambiar algún dato escribe la palabra *del* para borrar los datos.\n \n Si necesitas ayuda para saber cómo enviar el reporte y cómo funcionan otros comandos, envía una *h* para obtener ayuda');
                    report.set(from, ['2'])
                //Deteccion de la entrada de datos    
                }else if (txt.charAt(0) === '-'){
                    report.get(from).push(body.slice(1,250));
                    if (report.get(from)[0] === '1'){
                        sendMessage(from, 'Dato recibido \n\n' + '*Nombre:*  ' + report.get(from)[1] +'\n' + '*Lab:*  ' + report.get(from)[2] +'\n'+ '*Equipo:*  ' + report.get(from)[3] +'\n' + '*Materia:*  ' + report.get(from)[4] +'\n' + '*Reporte:*  ' + report.get(from)[5] + '\n\n' + 'recuerda enviar una letra g cuando termines para guardar tu reporte');
                    }else if (report.get(from)[0] === '2' ){
                        sendMessage(from, 'Dato recibido \n\n' + '*Nombre:*  ' + report.get(from)[1] +'\n' + '*Lab:*  ' + report.get(from)[2] +'\n'+ '*Materia:*  ' + report.get(from)[3] +'\n' + '*Reporte:*  ' + report.get(from)[4] + '\n\n' + 'recuerda enviar una letra g cuando termines para guardar tu reporte');
                    }else{
                        sendMessage(from, 'Dato recibido');
                    }
                //Guardado del reporte
                }else if(txt === 'g'){
                    if(report.get(from).length === 6){
                        insertEq(report.get(from));
                        console.log(report.get(from));
                        sendMessage(from, 'El reporte se ha guardado con éxito y se atenderá a la brevedad posible. \n Hasta luego');
                        report.delete(from);
                    }else if (report.get(from).length === 5){
                        insertAd(report.get(from));
                        console.log(report.get(from));
                        sendMessage(from, 'El reporte se ha guardado con éxito. y se atenderá a la brevedad posible. \n Hasta luego');
                        report.delete(from);
                    }else{
                        delDatos();
                        sendMessage(from, '*Hubo un error al guardar el reporte.* Intentalo de nuevo enviando los datos en el mismo orden');
                        console.log(report.get(from));
                    }
                //Borrado de datos
                }else if (txt === 'del'){
                    report.delete(from);
                    sendMessage(from, 'Datos borrados, ingresa nuevamente la opcion deseada \n\n *1* para reporte técnico \n *2* para reporte administrativo');
                //Cierre de sesion
                }else if(txt === '0'){
                    report.delete(from);
                    if(report.has(from)) report.delete(from);
                    console.log(`Sesion finalizada por ${from}`);
                    sendMessage(from, 'Sesión finalizada, Hasta luego');
                //Envio de imagenes de ayuda
                }else if(txt === 'h'){
                    sendMessage(from, 'Las siguientes imágenes te ayudarán a saber cómo usar el asistente');
                    sendMedia(from, 'tutoreporte.jpg');
                    sendMedia(from, 'del.jpg');
                    sendMedia(from, 'g.jpg')
                //Envio de horarios
                }else if (txt.length > 3 && txt.length <= 5 && (txt.charAt(0) === '1' || txt.charAt(0) === '2' || txt.charAt(0) === '3' || txt.charAt(0) === '4' || txt.charAt(0) === '5' || txt.charAt(0) === '6' || txt.charAt(0) === '7' || txt.charAt(0) === '8' || txt.charAt(0) === '9')){
                    sendMessage(from, `El Horario que del grupo ${txt} es el siguiente`);
                    sendHorario(from, txt + '.png');
                //Opcion no listada o invalida
                }else{
                    sendMessage(from,'Opción invalida');
                }
        console.log(from, txt);
    })
}

//Función para enviar archivos
const sendMedia = (to, file) => {
    const mediaFile = MessageMedia.fromFilePath(`./mediaSend/${file}`)
    client.sendMessage(to, mediaFile)
}

//Función para enviar mensajes
const sendMessage = (to, message) => {
    client.sendMessage(to, message)
}
//Funcion para enviar un horario
const sendHorario = (to, file) => {
    const mediaFile = MessageMedia.fromFilePath(`./mediaSend/horarios/${file}`)
    client.sendMessage(to, mediaFile,)
}
