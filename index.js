const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { Configuration, OpenAIApi } = require("openai");
const { toChatML, get_message } = require("gpt-to-chatgpt")

require('dotenv').config()

const client = new Client();

client.on('qr', (qr) => {
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.initialize();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

client.on('message', message => {
    console.log(message.body);

    if(message.body.startsWith("!")) {
        runCompletion(message.body.substring(1)).then(result => message.reply(result));
    }
});

async function runCompletion (message) {
    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: toChatML(message)
    });
    return get_message(completion.data);
}