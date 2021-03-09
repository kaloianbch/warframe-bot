require('dotenv').config()
const Discord = require('discord.js');

const warframestatGet = require('./warframestatGet')

const client = new Discord.Client();
const wfChannelID = process.env.CHANNEL_ID

let wfState, wfPrevState;


client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);

    //Initial API data fetch
    wfState = await warframestatGet.updatePlatformState();
    wfPrevState = wfState;

    client.channels.fetch(wfChannelID)
    .then(channel => {
        channel.send(wfState.timestamp);
    })
});

client.login(process.env.TOKEN);