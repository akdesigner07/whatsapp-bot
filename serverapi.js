require('dotenv').config();

const express = require('express');
const axios = require('axios');

const app = express();

app.use(express.json());

const TOKEN = process.env.TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;


// Verification Route
app.get('/webhook', (req, res) => {

    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token === VERIFY_TOKEN) {
        return res.status(200).send(challenge);
    }

    res.sendStatus(403);
});


// Receive Messages
app.post('/webhook', async (req, res) => {

    try {

        const message =
            req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

        if (message) {

            const from = message.from;
            const text = message.text?.body;

            console.log('Message:', text);

            // Reply
            await axios.post(
                `https://graph.facebook.com/v23.0/${PHONE_NUMBER_ID}/messages`,
                {
                    messaging_product: 'whatsapp',
                    to: from,
                    text: {
                        body: `You said: ${text}`
                    }
                },
                {
                    headers: {
                        Authorization: `Bearer ${TOKEN}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
        }

        res.sendStatus(200);

    } catch (error) {

        console.log(error.response?.data || error.message);

        res.sendStatus(500);
    }
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server Running on ${PORT}`);
});