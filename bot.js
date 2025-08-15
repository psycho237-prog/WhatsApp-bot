const express = require('express');
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const path = require('path');

// =============================
// Persistent session storage
// =============================
const SESSION_PATH = path.join('/mnt/data', 'whatsapp_session');

// =============================
// Express server (keep-alive for Railway)
// =============================
const app = express();
app.get('/', (req, res) => res.send('✅ WhatsApp bot is running.'));
app.listen(process.env.PORT || 3000, () => console.log('🌐 Web server started.'));

// =============================
// Ensure media folder exists
// =============================
const mediaFolder = path.join('/mnt/data', 'saved_media');
if (!fs.existsSync(mediaFolder)) {
    fs.mkdirSync(mediaFolder, { recursive: true });
}

// =============================
// Initialize WhatsApp client
// =============================
const client = new Client({
    authStrategy: new LocalAuth({
        dataPath: SESSION_PATH
    }),
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

// =============================
// WhatsApp events
// =============================
client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
    console.log('📲 Scan the QR code above with WhatsApp.');
});

client.on('ready', () => {
    console.log('✅ Bot is online and ready!');
});

client.on('message', async msg => {
    const text = msg.body.toLowerCase();

    // Basic reply
    if (text === 'hi') {
        return msg.reply('Hello! I am your WhatsApp bot 🤖');
    }

    // Save "View Once" or any media
    if (text === '!save') {
        if (msg.hasMedia) {
            const media = await msg.downloadMedia();
            const filePath = path.join(mediaFolder, `${Date.now()}.${media.mimetype.split('/')[1]}`);
            fs.writeFileSync(filePath, media.data, { encoding: 'base64' });
            msg.reply(`✅ Media saved to server: ${filePath}`);
        } else if (msg.hasQuotedMsg) {
            const quoted = await msg.getQuotedMessage();
            if (quoted.hasMedia) {
                const media = await quoted.downloadMedia();
                const filePath = path.join(mediaFolder, `${Date.now()}.${media.mimetype.split('/')[1]}`);
                fs.writeFileSync(filePath, media.data, { encoding: 'base64' });
                msg.reply(`✅ Media saved to server: ${filePath}`);
            } else {
                msg.reply('⚠️ No media found in the quoted message.');
            }
        } else {
            msg.reply('⚠️ Send or reply to a "View Once" media with `!save`.');
        }
    }

    // Convert tagged image to sticker
    if (text === '!sticker') {
        if (msg.hasQuotedMsg) {
            const quoted = await msg.getQuotedMessage();
            if (quoted.hasMedia) {
                const media = await quoted.downloadMedia();
                await client.sendMessage(
                    msg.from,
                    new MessageMedia(media.mimetype, media.data, 'sticker.webp'),
                    { sendMediaAsSticker: true }
                );
            } else {
                msg.reply('⚠️ No image found in the quoted message.');
            }
        } else {
            msg.reply('⚠️ Reply to an image with `!sticker` to convert it.');
        }
    }
});

client.initialize();
