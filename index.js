'use strict';
require('dotenv').config();
const express = require('express');
const line = require('@line/bot-sdk');

const config = {
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.CHANNEL_SECRET,
};

const app = express();
const client = new line.Client(config);

app.post('/webhook', express.json(), (req, res) => {
    const log = req.body.log;
    if (!log) {
        return res.status(400).send("No log provided.");
    }

    const userId = process.env.LINE_USER_ID;
    client.pushMessage(userId, {
        type: 'text',
        text: `nohup.out 更新:\n${log}`
    })
    .then(() => res.status(200).send('OK'))
    .catch(err => {
        console.error(err);
        console.log(log)
        res.status(500).send('Error');
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on ${port}`);
});
