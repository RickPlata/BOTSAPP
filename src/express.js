//crear una aplicacion de express para exponer el codigo qr de whatsapp-web.js 
//y permitir a los usuarios escanear el codigo qr para iniciar sesion en whatsapp-web.js
//instanciando la funcion de inicializacion en whatsapp.js
const startWhatsapp = require('./whatsapp');
const express = require('express');
const QRCode = require('qrcode');
const app = express();

const port = 3000;

let lastQr = null;

startWhatsapp(qr => {
	// guardar el último QR recibido para servirlo por HTTP
	lastQr = qr;
});

app.get('/whatsapp/qr', async (req, res) => {
	if (!lastQr) return res.status(404).send('QR no disponible todavía');
	try {
		const dataUrl = await QRCode.toDataURL(lastQr);
		res.send(`<html><body style="display:flex;align-items:center;justify-content:center;height:100vh;"><img src="${dataUrl}" alt="WhatsApp QR"/></body></html>`);
	} catch (err) {
		res.status(500).send('Error generando QR');
	}
});

app.listen(port, () => console.log(`Servidor escuchando en http://localhost:${port}`));

