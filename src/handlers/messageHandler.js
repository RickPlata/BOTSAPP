const {sendMedia, sendMessage, sendHorario} = require('./msgFunctions');
const {insertEq, insertAd} = require('../api/db');

// Map para almacenar sesiones de usuarios
const report = new Map();

const replyMsg = (client, message) => {
     const {from, body} = message;
     let txt = body.normalize("NFD")
                   .replace(/[\u0300-\u036f]/g, "")
                   .toLowerCase();
     if (repor.has(from)){

     }else{
          report.set(from, {
               idStatus: 0,
               created_at: new Date(),
               name: "",
               order: null,
               products: "",
               comments: "",
               address: ""
          })
     }
 }

module.exports = {replyMsg};
