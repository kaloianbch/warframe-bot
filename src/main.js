require('dotenv').config()
const fs = require('fs');
const Discord = require('discord.js');

const commons = require('./commons.js')
const watchAlerts = require('./watchAlerts.js')

const client = new Discord.Client();
const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));

let wfState;        // var for api data
let updateTimer;    // ref for interval in order to stop it for restarts
let prefix = process.env.PREFIX;

//populate commands list from files in commands folder
client.commands = new Discord.Collection();
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

// bot init
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);

    client.channels.fetch(process.env.CHANNEL_ID)
    .then(channel => {
        channel.send("Cephalon Cord is now online. Greetings Tenno.");
        
        //timer for !watch updates
        updateTimer = setInterval(function() {
        let promise = commons.getWfStatInfo();
        promise.then((state) => {
            wfState = state;
        })

        watchAlerts.watchCheck(channel);
    }, 60000);
    })
});

//command handler
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