require('dotenv').config()
const Discord = require('discord.js');

const warframestatGet = require('./warframestatGet')

const client = new Discord.Client();


let wfChannel;
let wfState;
let updateTimer;


client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);

    client.channels.fetch(process.env.CHANNEL_ID)
    .then(channel => {
        channel.send("Cephalon Cord is booting up. Please hold all queries...");
        wfChannel = channel;
    })

    //Initial API data fetch
    wfState = await warframestatGet.getPlatformState();
    //timer to update the API data every minute
    updateTimer = setInterval(function() {
        wfState = warframestatGet.getPlatformState();
    }, 60000);

    wfChannel.send("Cephalon Cord is now online. Greetings Tenno.");
});

client.login(process.env.TOKEN);