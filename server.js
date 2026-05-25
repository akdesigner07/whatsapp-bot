const express = require('express');
const qrcode = require('qrcode-terminal');

const { Client, LocalAuth } = require('whatsapp-web.js');

const app = express();

app.get('/', (req, res) => {
    res.send('Bot Running');
});

const client = new Client({
    authStrategy: new LocalAuth(),

    puppeteer: {
        headless: true,
      args: [
            '--no-sandbox',
            '--disable-setuid-sandbox'
        ]
    }
});

client.on('qr', (qr) => {

    console.log('Scan QR Below:\n');

    qrcode.generate(qr, {
        small: true
    });
});

client.on('ready', () => {
    console.log('WhatsApp Bot Ready!');
});

client.on('message', message => {

    console.log(message.body);

    if (message.body.toLowerCase() === 'hi') {
        message.reply('Hello 👋');
    }

});

client.initialize();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server Running on ${PORT}`);
});