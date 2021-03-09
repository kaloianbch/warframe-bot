require('dotenv').config()
const fs = require('fs');
const Discord = require('discord.js');

const warframeStateGet = require('./warframeStateGet.js')
const watchAlerts = require('./watchAlerts.js')


const client = new Discord.Client();
const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));

let wfChannel;
let wfState;
let updateTimer;
let prefix = process.env.PREFIX

client.commands = new Discord.Collection();

for (const file of commandFiles) {

	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}


client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);

    client.channels.fetch(process.env.CHANNEL_ID)
    .then(channel => {
        channel.send("Cephalon Cord is booting up. Please hold all queries...");
        wfChannel = channel;
    })

    //Initial API data fetch
    wfState = await warframeStateGet.getPlatformState();
    //timer to update the API data every minute
    updateTimer = setInterval(function() {
        let promise = warframeStateGet.getPlatformState();
        promise.then((state) => {
            wfState = state;
        })
        watchAlerts.watchCheck(wfChannel);
    }, 15000);

    wfChannel.send("Cephalon Cord is now online. Greetings Tenno.");
});

client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const commandInput = args.shift().toLowerCase();

	if (!client.commands.has(commandInput)) {
        message.reply('this command is not known to me.');
        return;
    }
    
    const command = client.commands.get(commandInput);

    try {
        command.execute(message, args, wfState);
    } catch (error) {
        console.error(error);
        message.channel.send(`I\'ve been thinking, ${message.author}...I thought you\'d want to know.`
        + `\n(Command Execution Error)`);
    }

});

client.login(process.env.TOKEN);