const { insertEq, insertAd } = require('./db');
const { createMessenger } = require('./messages');

module.exports = function registerHandlers(client) {
  const { sendMessage, sendMedia, sendHorario } = createMessenger(client);
  const report = new Map();

  client.on('message', (msg) => {
    const { from } = msg;
    const body = msg.body || '';
    // Normalizar seguro: body puede no tener normalize en algunos casos
    const normalize = (s) => (typeof s === 'string' && s.normalize) ? s.normalize('NFD').replace(/[\u0300-\u036f]/g, '') : s;
    const txt = (normalize(body) || '').toLowerCase();

    // Saludo
    if (txt === 'hola' || txt === 'ola' || txt === 'buenos dias' || txt === 'buenas tardes' || txt === 'buenas noches' || txt === 'buen dia') {
      if (report.has(from)) {
        sendMessage(from, 'Hola de nuevo, tu sesión sigue activa recuerda cerrarla enviando un *0* o también puedes continuar enviando tu reporte');
      } else {
        sendMessage(from, '*Bienvenido al sistema de incidencias de laboratorios de computación* \n Ingresa la opción deseada \n \n 1.- Reporte de falla técnica \n 2.- Reporte administrativo \n 0.- Para salir \n También puedes solicitar un horario enviando tu grupo *por ejemplo "1cv1" o "9cv12"* (Cuento con todos los horarios de ICE). \n \n Si necesitas ayuda para saber cómo enviar el reporte y cómo funcionan otros comandos, envía una *h* para obtener ayuda');
      }

    // Opción 1
    } else if (txt === '1') {
      sendMessage(from, 'Para hacer un reporte sobre una falla en un equipo envía los siguientes datos anteponiendo un guion alto *-* antes de cada dato (como se ve en la imagen de ejemplo), después de cada dato recibirás un mensaje de confirmación: \n \n *Nombre* \n *Laboratorio* \n *Numero del equipo* \n *Materia* \n *Descripción del reporte* \n \n Una vez guardados los datos escribe *G* para guardar el reporte. \n \n En caso de que te equivoques o quieras corregir un dato escribe la palabra *del* para borrar los datos o presiona *0* si quieres salir.\n \n Si necesitas ayuda para saber cómo enviar el reporte y cómo funcionan otros comandos, envía una *h* para obtener ayuda');
      report.set(from, ['1']);

    // Opción 2
    } else if (txt === '2') {
      sendMessage(from, 'Para hacer un reporte sobre una incidente administrativa envía los siguientes datos anteponiendo una guión alto *"-"* antes de cada dato (como se ve en la imagen de ejemplo), después de cada dato recibirás un mensaje de confirmación: \n \n *Nombre* \n *Laboratorio* \n *Materia* \n *Descripción del reporte* \n \n Una vez guardados los datos escribe *G* para guardar el reporte. \n \n En caso de que te equivoques o quieras cambiar algún dato escribe la palabra *del* para borrar los datos.\n \n Si necesitas ayuda para saber cómo enviar el reporte y cómo funcionan otros comandos, envía una *h* para obtener ayuda');
      report.set(from, ['2']);

    // Entrada de datos (prefijo -)
    } else if (txt.startsWith('-')) {
      if (!report.has(from)) {
        sendMessage(from, 'No tienes una sesión activa. Envía *1* o *2* para iniciar un reporte.');
      } else {
        const arr = report.get(from);
        arr.push(body.slice(1, 250));
        report.set(from, arr);

        if (arr[0] === '1') {
          sendMessage(from, 'Dato recibido \n\n' + '*Nombre:*  ' + (arr[1] || '') + '\n' + '*Lab:*  ' + (arr[2] || '') + '\n' + '*Equipo:*  ' + (arr[3] || '') + '\n' + '*Materia:*  ' + (arr[4] || '') + '\n' + '*Reporte:*  ' + (arr[5] || '') + '\n\n' + 'recuerda enviar una letra g cuando termines para guardar tu reporte');
        } else if (arr[0] === '2') {
          sendMessage(from, 'Dato recibido \n\n' + '*Nombre:*  ' + (arr[1] || '') + '\n' + '*Lab:*  ' + (arr[2] || '') + '\n' + '*Materia:*  ' + (arr[3] || '') + '\n' + '*Reporte:*  ' + (arr[4] || '') + '\n\n' + 'recuerda enviar una letra g cuando termines para guardar tu reporte');
        } else {
          sendMessage(from, 'Dato recibido');
        }
      }

    // Guardado del reporte
    } else if (txt === 'g') {
      if (!report.has(from)) {
        sendMessage(from, 'No hay reporte para guardar. Inicia con *1* o *2*.');
      } else {
        const arr = report.get(from);
        if (arr[0] === '1' && arr.length === 6) {
          insertEq(arr);
          sendMessage(from, 'El reporte se ha guardado con éxito y se atenderá a la brevedad posible. \n Hasta luego');
          report.delete(from);
        } else if (arr[0] === '2' && arr.length === 5) {
          insertAd(arr);
          sendMessage(from, 'El reporte se ha guardado con éxito y se atenderá a la brevedad posible. \n Hasta luego');
          report.delete(from);
        } else {
          report.delete(from);
          sendMessage(from, '*Hubo un error al guardar el reporte.* Intentalo de nuevo enviando los datos en el mismo orden');
        }
      }

    // Borrado de datos
    } else if (txt === 'del') {
      report.delete(from);
      sendMessage(from, 'Datos borrados, ingresa nuevamente la opcion deseada \n\n *1* para reporte técnico \n *2* para reporte administrativo');

    // Cierre de sesión
    } else if (txt === '0') {
      report.delete(from);
      console.log(`Sesion finalizada por ${from}`);
      sendMessage(from, 'Sesión finalizada, Hasta luego');

    // Ayuda (imágenes)
    } else if (txt === 'h') {
      sendMessage(from, 'Las siguientes imágenes te ayudarán a saber cómo usar el asistente');
      sendMedia(from, 'tutoreporte.jpg');
      sendMedia(from, 'del.jpg');
      sendMedia(from, 'g.jpg');

    // Horarios (grupos)
    } else if (txt.length > 3 && txt.length <= 5 && /^[1-9]/.test(txt.charAt(0))) {
      sendMessage(from, `El Horario que del grupo ${txt} es el siguiente`);
      sendHorario(from, `${txt}.png`);

    // Opción inválida
    } else {
      sendMessage(from, 'Opción invalida');
    }

    console.log(from, txt);
  });
};
