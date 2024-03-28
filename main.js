// require('dotenv').config();
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
  if (before) {
    if (before.fromMe == false) {
      const sender = await before.getContact();
      const sender_name = sender.name;
      const sender_number = sender.number;
      const sender_id = sender.pushname;
      msg = "Name: " + sender_name + "\n";
      msg += "Number: +" + sender_number + "\n";
      msg += "UserName: " + sender_id + "\n";
      msg += "Deleted: \n" + before.body;
      console.log(msg, "\n");
      client.sendMessage(client.info.me._serialized, msg);
    }
  }
});

client.initialize();
