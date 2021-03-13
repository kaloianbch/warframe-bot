require('dotenv').config()
const fs = require('fs');
const Discord = require('discord.js');

const commons = require('./commons.js')
const watchAlerts = require('./watchAlerts.js')

const bot = new Discord.Client();
const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));

let wfState;        // var for api data
let updateTimer;    // ref for interval in order to stop it for restarts
let prefix = process.env.PREFIX;

bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();

//populate commands list from files in commands folder
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	bot.commands.set(command.name, command);
}

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
    for (alias of command.aliases) {   
	    bot.aliases.set(alias, command);
    }
}

// bot init
bot.on('ready', () => {
    console.log(`Logged in as ${bot.user.tag}!`);

    bot.channels.fetch(process.env.CHANNEL_ID)
    .then(channel => {
        channel.send(`Cephalon Cord is now online. Greetings Tenno.`);
        
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
bot.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;
	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const commandInput = args.shift().toLowerCase();
    console.log(`command: ${commandInput}, args: ${args}`);

    let command;

    
	if (bot.commands.has(commandInput)) {
        command = bot.commands.get(commandInput);
    } else if (bot.aliases.has(commandInput)){
        command = bot.aliases.get(commandInput);
    } else{
        message.reply(`the command '${commandInput}' is not known to me.\nUse \`${prefix}help\` to get a list of commands`);
        return;
    }

    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.channel.send(`I\'ve been thinking, ${message.author}...I thought you'd want to know.`
        + `\n(Command Execution Error)`);
    }

});

bot.login(process.env.TOKEN);