const fs = require('fs');
const Discord = require('discord.js');

const commons = require('./commons.js')
const watchAlerts = require('./watchAlerts.js')
const config = require('../res/bot-config.json');


const bot = new Discord.Client();
const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));

let updateTimer;    // ref for interval in order to stop it for restarts

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
    bot.channels.fetch(config.botChannel)
    .then(channel => {
        channel.send(`${bot.user.username} is now online, greetings Tenno.\nFor a list of my commands please use \`${config.prefix}help\``);
        
        //timer for !watch updates
        updateTimer = setInterval(function() {
        let promise = commons.getWfStatInfo(config.WFStatApiURL);
        promise.then((state) => {
            watchAlerts.watchCheck(channel, state);
        })
    }, 60000);
    })
});

//command handler
bot.on('message', message => {
	if (!message.content.startsWith(config.prefix) || message.author.bot) return;
	const args = message.content.slice(config.prefix.length).trim().split(/ +/).map(arg => arg.toLowerCase());
	const commandInput = args.shift().toLowerCase();
    console.log(`command: ${commandInput}, args: ${args}`);

    let command;

    
	if (bot.commands.has(commandInput)) {
        command = bot.commands.get(commandInput);
    } else if (bot.aliases.has(commandInput)){
        command = bot.aliases.get(commandInput);
    } else{
        message.reply(`the command '${commandInput}' is not known to me.\nUse \`${config.prefix}help\` to get a list of commands`);
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

bot.login(config.token);