//diccionario de saludos
const {randomInit} = require("mysql/lib/protocol/Auth");
const saludos = [
    "¡Hola! 👋 Bienvenido a nuestro servicio. ¿En qué podemos ayudarte?",
    "¡Hola! 😊 ¿Cómo estás? Te compartimos nuestras opciones:",
    "¡Bienvenido! 🎉 Estamos aquí para servirte. Selecciona una opción:",
    "¡Hola! 👋 Gracias por contactarnos. ¿Qué deseas hacer?"
];

//diccionario de opciones del menú principal
const opt = "Por favor en envía el número de la opción deseada \n 1.- Hacer pedido\n 2.- Consultar estatus\n 3.- Pedir catálogo";


//mensajes de confirmación
const confirmacion = {
    pedidoRecibido: "✅ Tu pedido ha sido recibido. Nos comunicaremos pronto para confirmarlo.",
    gracias: "¡Gracias por tu compra! 🙏",
    error: "❌ Ocurrió un error. Por favor, intenta de nuevo.",
    preguntarAyuda: "¿Necesitas algo más? Escribe 'menú' para volver al inicio."
};

//mensajes para consulta de estatus
const estatus = {
    titulo: "📦 ESTADO DE TU PEDIDO",
    pendiente: "⏳ Tu pedido está siendo procesado",
    enviado: "🚚 Tu pedido ha sido enviado",
    entregado: "✅ Tu pedido ha sido entregado",
    cancelado: "❌ Tu pedido ha sido cancelado"
};

//mensajes para pedir catálogo
const catalogo = {
    titulo: "📸 NUESTRO CATÁLOGO",
    disponible: "Aquí está nuestro catálogo de productos disponibles.",
    proximamente: "⏳ El catálogo se enviará próximamente.",
    error: "❌ No pudimos enviar el catálogo. Intenta más tarde."
};

//mensajes de validación
const validacion = {
    nombreRequerido: "Por favor, dinos tu nombre:",
    direccionRequerida: "¿Cuál es tu dirección de entrega?",
    numeroInvalido: "❌ Por favor ingresa un número válido.",
    opcionInvalida: "❌ Opción no reconocida. Por favor selecciona del menú."
};

//menú con emojis para visualización
const menuPrincipal = {
    titulo: "📋 MENÚ PRINCIPAL",
    instruccion: "Selecciona una opción escribiendo el número:",
    opciones: opt,
    footer: "Escribe 'help' si necesitas ayuda"
};

const saludo = () => {
    let number = Math.floor(Math.random() * saludos.length);
    return saludos[number];
}


module.exports = {
    saludos,
    opt,
    confirmacion,
    estatus,
    catalogo,
    validacion,
    menuPrincipal,
    saludo
};
