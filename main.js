require('dotenv').config();
const qrcode = require('qrcode-terminal');

const { Client, LocalAuth } = require('whatsapp-web.js');

const client = new Client({
        authStrategy: new LocalAuth()
});

client.on('loading_screen', (percent, message) => {
        console.log('Loading:', percent, message);
});

client.on('qr', qr => {
        qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
        console.log('Client is ready!\n');
});

client.on('message_revoke_everyone', async (after, before) => {
        if (before.fromMe == true) {
                const chatName = process.env.CHAT_NAME;
                const chats = await client.getChats();

                if (process.env.CHAT_ID) {
                        chatId = process.env.CHAT_ID
                } else {
                        for (const chat of chats) {
                                if (chat.name === chatName) {
                                        chatId = chat.id._serialized
                                        console.log(`Save to .env file`)
                                        console.log(`CHAT_ID='${chat.id._serialized}'`);
                                        break;
                                }
                        }
                }

                const sender = await before.getContact();
                const msg = sender.name + " deleted: " + before.body
                client.sendMessage(chatId, msg);
                // console.log(before);
        }
});


client.initialize();
