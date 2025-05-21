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

// app.post('/webhook', express.json(), (req, res) => {
//     const log = req.body.log;
//     if (!log) {
//         return res.status(400).send("No log provided.");
//     }

//     // Pushメッセージとして送信（ユーザーIDを固定 or データ内に含めてもOK）
//     const userId = process.env.LINE_USER_ID; // LINEユーザーID
//     client.pushMessage(userId, {
//         type: 'text',
//         text: `nohup.out 更新:\n${log}`
//     })
//     .then(() => res.status(200).send('OK'))
//     .catch(err => {
//         console.error(err);
//         res.status(500).send('Error');
//     });
// });

// LINEからのメッセージイベント処理（ユーザーIDを返信）
app.post('/webhook', line.middleware(config), (req, res) => {
    Promise.all(req.body.events.map(async (event) => {
        if (event.type === 'message' && event.message.type === 'text') {
            const userId = event.source.userId;
            return client.replyMessage(event.replyToken, {
                type: 'text',
                text: `あなたのユーザーIDは: ${userId}`
            });
        } else {
            return Promise.resolve(null);
        }
    }))
    .then((result) => res.json(result));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on ${port}`);
});
