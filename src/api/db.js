const axios = require('axios');
require('dotenv').config();

const apiUrl = process.env.API_URL;

function insertEq(data){
    data1 = {
        nombre: data[1],
        lab: data[2],
        equipo: data[3],
        materia: data[4],
        incidencia: data[5]
    }
    axios.post(`${apiUrl}/api/insertEq`,data1)
        .then(response => {
            console.log('Elreporte se ha insertado exitosamente:',response.data);            
        })
        .catch(error => {
            console.error('Error al enviar los datos', error);
        })

}

function insertAd(data){
    data1 = {
        nombre: data[1],
        lab: data[2],
        materia: data[3],
        incidencia: data[4]
    }
    axios.post(`${apiUrl}/api/insertAd`,data1)
        .then(response => {
            console.log('Elreporte se ha insertado exitosamente:',response.data);            
        })
        .catch(error => {
            console.error('Error al enviar los datos', error);
        })

}

module.exports = {insertEq, insertAd}