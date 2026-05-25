const express = require("express");
const axios = require("axios");

const app = express();

app.use(express.json());

app.post("/webhook", async (req, res) => {

    const message =
    req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    if(message){

        const from = message.from;

        await axios.post(
            "https://graph.facebook.com/v22.0/PHONE_ID/messages",
            {
                messaging_product: "whatsapp",
                to: from,
                text: {
                    body: "Hello from Node.js bot 🚀"
                }
            },
            {
                headers: {
                    Authorization: "Bearer YOUR_TOKEN"
                }
            }
        );
    }

    res.sendStatus(200);
});

app.listen(3000, () => {
    console.log("Server running");
});