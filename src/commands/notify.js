const fs = require('fs');
const readline = require('readline');

const commons = require('../commons.js');
const config = require('../../res/bot-config.json');

function addNotification(userId, commandName, commandArgs) {
  let subData = [];
  try {
    const existingSubData = fs.readFileSync(`./res/subs/${userId}.json`);
    subData = JSON.parse(existingSubData);
  } catch (err) {
    console.log(`${userId}.json doesn't exist or can't be opened. A new file will be created.`);
  }

  subData.push(JSON.parse(`{"command": "${commandName}", "args": ${JSON.stringify(commandArgs)}}`));

  try {
    fs.writeFileSync(`./res/subs/${userId}.json`, JSON.stringify(subData));
  } catch (err) {
    console.error(err);
    return false;
  }
  return true;
}

function defaultNotification(message, notifyCommand, args) {
  args.splice(0, 1);
  const argsFound = commons.valiateArgs(args, notifyCommand.validArgs, config.validArgsData);
  if (argsFound.invalid.length) { message.reply(`\nthe argument(s) '${argsFound.invalid}' are unknown. They will be skipped`); }

  console.log(`Notify args: type-${notifyCommand.name}, other args-${JSON.stringify(argsFound.valid)}`);
  if (!addNotification(message.author.id, notifyCommand.name, argsFound.valid)) {
    return message.reply('there was an issue completing your request. You know who to blame.');
  }
  return message.reply(`\n You've been signed up for a notification whenever a **${notifyCommand.name}** with these argument(s) appears:\n${JSON.stringify(argsFound.valid)}`);
}

function timeNotification(message, notifyCommand, args) {
  args.splice(0, 1);
  // TODO - what is time really?
}

function clearNotification(message) {
  try {
    fs.unlinkSync(`./res/subs/${message.author.id}.json`);
  } catch (error) {
    console.log(error);
    return message.reply(' there was an issue completing your request. You know who to blame.');
  }
  return message.reply(' your list is cleared.');
}

function listNotification(message) {
  fs.readFile(`./res/subs/${message.author.id}.json`, (error, data) => {
    if (error) {
      console.log(error);
      return message.reply(' You do not appear to have any notifications set up');
    }
    const userData = JSON.parse(data);
    const reply = [];
    userData.forEach((sub) => {
      reply.push(`\ncommand: ${sub.command} args: ${JSON.stringify(sub.args)}`);
    });
    message.author.send(`Here's a list of your current notifications:${reply}`, { split: true });
    return message.reply('I have sent you a list in your DMs'); // TODO - what if I'm in my DM's when I ask for this data?
  });
}

function hellNotification(message) {
  const rl = readline.createInterface({
    input: fs.createReadStream('./res/sus.txt'),
    output: process.stdout,
    terminal: false,
  });

  rl.on('line', (line) => {
    if (line.trim() !== '') { message.channel.send(line); }
  });
  return true;
}

module.exports = {
  name: 'notify',
  description: 'You can pass the notify command any other command that returns a list (baro, fissure, etc.) '
      + 'along with it valid arguments for that command and you will be signed up to recieve a DM from the bot whenever that filtered event occurs.\n\n'
      + `The **${config.prefix}notify time** command differs where you have to pass it a cycle to be notified for and can pass it X minutes(as a number) `
      + 'after the [location] argument to recieve the DM that many minutes beforehand.\n\n'
      + `use **${config.prefix}notify list** to get a DM of all your currently set notification, and **${config.prefix}notify clear** to clear them all`,
  aliases: ['not', 'watch', 'alert'],
  usage: `${config.prefix}notify [command name] [command arguments] {time cycle} {minutes till time cycle becomes active}`,
  example: `${config.prefix}notify fissure axi rescue, ${config.prefix}notify baro, ${config.prefix}notify time cetus night 10`,
  cooldown: 5,

  execute(message, args) { // TODO currently allows duplicate entries
    if (!args.length) {
      return message.reply('\n soon(tm)');
    }
    const commandsList = [];
    let notifyCommand = null;

    const commandFiles = fs.readdirSync('./src/commands').filter((file) => file.endsWith('.js'));
    commandFiles.forEach((file) => {
      const command = require(`./${file}`);
      commandsList.push(command);
    });

    commandsList.push({ name: 'list' });
    commandsList.push({ name: 'clear' });

    commandsList.forEach((command) => {
      if (command.name === args[0]) {
        notifyCommand = command;
        return;
      }
      if (command.aliases !== undefined) {
        command.aliases.forEach((alias) => {
          if (alias === args[0]) {
            notifyCommand = command;
          }
        });
      }
    });

    if (notifyCommand == null) {
      return message.reply(`'${args[0]}' is not a valid argument for a command. Please use ${config.prefix}help notify for more information`);
    }

    switch (notifyCommand.name) {
      case ('notify'):
        return hellNotification(message);

      case ('time'):
        return timeNotification(message, notifyCommand, args);

      case ('help'):
        return message.reply('don\'t test me');

      case ('list'):
        return listNotification(message);

      case ('clear'):
        return clearNotification(message);

      default:
        return defaultNotification(message, notifyCommand, args);
    }
  },
};
