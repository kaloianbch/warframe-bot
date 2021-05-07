const fs = require('fs');
const Discord = require('discord.js');

const watch = require('./watch.js');
const config = require('../res/bot-config.json');

const bot = new Discord.Client();
const commandFiles = fs.readdirSync('./src/commands').filter((file) => file.endsWith('.js'));

bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();
// used to see if a new mission has shown up since previous check
bot.lastWatch = Date.now() - config.updateTick;

// populate commands hash map from files in commands folder
commandFiles.forEach((file) => {
  const command = require(`./commands/${file}`);
  bot.commands.set(command.name, command);
});

// same but makes a hash map for all the aliases
commandFiles.forEach((file) => {
  const command = require(`./commands/${file}`);
  command.aliases.forEach((alias) => {
    bot.aliases.set(alias, command);
  });
});

// bot init
bot.on('ready', async () => {
  console.log(`Logged in as ${bot.user.tag}!`);
  const botChannel = await bot.channels.fetch(config.botChannel);

  botChannel.send(`${bot.user.username} is now online, greetings Tenno.\nFor a list of my commands please use \`${config.prefix}help\``);

  // timer for !watch updates
  setInterval(async () => {
    bot.lastWatch = await watch.notificationsCheck(botChannel, bot);
  }, config.updateTick);
});

// command handler
bot.on('message', (message) => {
  if (!message.content.startsWith(config.prefix) || message.author.bot) return;
  const args = message.content.slice(config.prefix.length).trim().split(/ +/).map((arg) => arg.toLowerCase());
  const commandInput = args.shift().toLowerCase();
  console.log(`command: ${commandInput}, args: ${args}`);

  let command;

  if (bot.commands.has(commandInput)) {
    command = bot.commands.get(commandInput);
  } else if (bot.aliases.has(commandInput)) {
    command = bot.aliases.get(commandInput);
  } else {
    message.reply(`the command '${commandInput}' is not known to me.\nUse \`${config.prefix}help\` to get a list of commands`);
    return;
  }

  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.channel.send(`I've been thinking, ${message.author}...I thought you'd want to know.\n(Command Execution Error)`);
  }
});

bot.login(config.token);

// graceful shutdown
process.on('SIGINT', () => {
  bot.destroy();
  process.exit();
});

process.on('SIGTERM', () => {
  bot.destroy();
  process.exit();
});
