require('dotenv').config()
const Discord = require('discord.js');

const warframestatGet = require('./warframestatGet')

const client = new Discord.Client();
const wfChannelID = process.env.CHANNEL_ID

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.channels.fetch(wfChannelID)
    .then(channel => {
        (async function() {
            let state = await warframestatGet.updatePlatformState();
            channel.send(state.timestamp);
        })();
    })
});

client.login(process.env.TOKEN);