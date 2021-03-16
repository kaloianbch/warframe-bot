const fs = require('fs');
const readline = require('readline');

const commons = require('../commons.js')
const config = require('../../res/bot-config.json');

module.exports = {
	name: 'notify',
	description: `You can pass the notify command any other command that returns a list (baro, fissure, etc.) ` + 
	`along with it valid arguments for that command and you will be signed up to recieve a DM from the bot whenever that filtered event occurs.\n\n` +
	`The **${config.prefix}notify time** command differs where you have to pass it a cycle to be notified for and can pass it X minutes(as a number) ` +
	`after the [location] argument to recieve the DM that many minutes beforehand.\n\n` +
	`use **${config.prefix}notify list** to get a DM of all your currently set notification, and **${config.prefix}notify clear** to clear them all`,
	aliases: ['not', 'watch', 'alert'],
	usage: `${config.prefix}notify [command name] [command arguments] {time cycle} {minutes till time cycle becomes active}`,
	example: `${config.prefix}notify fissure axi rescue, ${config.prefix}notify baro, ${config.prefix}notify time cetus night 10`,
	cooldown: 5,

	execute(message, args) {	//TODO currently allows duplicate entries
		if (!args.length) {
            return message.reply(`\n soon(tm)`)
        }
		let commandsList = [], notifyCommand = null;

		for (const file of fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'))) {
			const command = require(`./${file}`);
			commandsList.push(command);
		}

		commandsList.push({name:'list'})
		commandsList.push({name:'clear'})

		
		for(command of commandsList){
			if (command.name == args[0]){
				notifyCommand = command;
				break;
			}
			for (i in command.aliases){
				if (command.aliases[i] == args[0]){
					notifyCommand = command;
					break;
				}
			}
		}

		if(notifyCommand == null){
			return message.reply(`'${args[0]}' is not a valid argument for a command. Please use ${config.prefix}help notify for more information`)
		}

		let argsFound;
		switch(notifyCommand.name) {
			case('notify'):
				return hellNotification(message)

			case('time'):
				return timeNotification(message, notifyCommand, args)

			case('help'):
				return message.reply(`don't test me`)

			case('list'):
				return listNotification(message);
			
			case('clear'):
				return clearNotification(message);
				
			default:
				return defaultNotification(message, notifyCommand, args);
		}

	},
};

function defaultNotification(message, notifyCommand, args){
	args.splice(0,1)
	argsFound = commons.valiateArgs(args, notifyCommand.validArgs, config.validArgsData);
	if(argsFound.invalid.length){message.reply(`\nthe argument(s) '${argsFound.invalid}' are unknown. They will be skipped`)}
	
	console.log(`Notify args: type-${notifyCommand.name}, other args-${JSON.stringify(argsFound.valid)}`)
	if(!addNotification(message.author.id, notifyCommand.name, argsFound.valid)){
		return message.reply('there was an issue completing your request. You know who to blame.')
	}
	return message.reply(`\n You've been signed up for a notification whenever a **${notifyCommand.name}** ` +	//TODO less debugy reply
	`with these argument(s) appears:\n${JSON.stringify(argsFound.valid)}`)
}

function timeNotification(message, notifyCommand, args){
	args.splice(0,1)
	argsFound = commons.valiateArgs(args, notifyCommand.validArgs, config.validArgsData);
	for(i in argsFound.invalid){	//TODO multiple int args are ignored aside from the first valid one
		if (parseInt(argsFound.invalid[i]) !== NaN){
			if(argsFound.valid.time === undefined){argsFound.valid.time = parseInt(argsFound.invalid[i])}
			argsFound.invalid.splice(i,1)
			break;
		}
	}

	if(argsFound.invalid.length){message.reply(`\nthe argument(s) '${argsFound.invalid}' are unknown. They will be skipped`)}
	
	console.log(`Notify args: type-${notifyCommand.name}, other args-${JSON.stringify(argsFound.valid)}`)
	if(!addNotification(message.author.id, notifyCommand.name, argsFound.valid)){
		return message.reply(' there was an issue completing your request. You know who to blame.')
	}
	return message.reply(`\n You've been signed up for a notification whenever a **${notifyCommand.name}** ` +	//TODO less debugy reply
	`with these argument(s) appears:\n${JSON.stringify(argsFound.valid)}`)
}

function clearNotification(message){
	try {
		fs.unlinkSync(`./res/subs/${message.author.id}.json`);
	} catch (error) {
		console.log(error);
		return message.reply(' there was an issue completing your request. You know who to blame.')
	}
	return message.reply(' your list is cleared.')
}

function listNotification(message){
	fs.readFile(`./res/subs/${message.author.id}.json`, (error, data) => {
		if (error) {
			console.log(error);
			return message.reply(' there was an issue completing your request. You know who to blame.')
		}
		let userData = JSON.parse(data) 
		let reply = [];
		for (i in userData){
			reply.push(`\ncommand: ${userData[i].command} args: ${JSON.stringify(userData[i].args)}`)
		}
		console.log(reply)
		return message.reply(`Here's a list of your current notifications:${reply}`,{split: true})
	});
}

function hellNotification(message){
	const rl = readline.createInterface({
		input: fs.createReadStream('./res/sus.txt'),
		output: process.stdout,
		terminal: false
	});
	
	rl.on('line', (line) => {
		if(line.trim() !== ''){message.channel.send(line)}
	});
	return true;
}

function addNotification(userId, commandName, commandArgs){
	fs.readFile(`./res/subs/${userId}.json`, (error, data) => {
		if (error) {
			console.log(`${userId}.json doesn't exist or can't be opened. Making a new one.`)
		} 
		let subData = []
		if (data !== undefined){ subData = JSON.parse(data) }

		subData.push(JSON.parse(`{"command": "${commandName}", "args": ${JSON.stringify(commandArgs)}}`))

		try { 
			fs.writeFileSync(`./res/subs/${userId}.json`, JSON.stringify(subData)); 
		} catch(err) { 
			console.error(err); 
			return false
		}
	});
	return true; 
}