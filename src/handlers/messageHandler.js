const {sendMedia, sendMessage, sendHorario} = require('./msgFunctions');
const {insertEq, insertAd} = require('../api/db');

// Map para almacenar sesiones de usuarios
const report = new Map();

const replyMsg = (client, message) => {
     const {from, body} = message;
     let txt = body.normalize("NFD")
                   .replace(/[\u0300-\u036f]/g, "")
                   .toLowerCase();
     
     let status = report.get(from);
     let session = {
          idStatus: 0,
          name: "",
          order: "",
          adress:"",
          creationDate: new Date(),
     };

     if(!status){
          report.set(from,session)
     };
 }

module.exports = {replyMsg};
