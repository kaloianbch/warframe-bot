const fs = require('fs');

const commons = require('../commons.js')
const config = require('../../res/bot-config.json');

module.exports = {
	name: 'notify',
	description: `You can pass the notify command any other command that returns a list (baro, fissure, etc.)` + 
	`along with it valid arguments for that command and you will be signed up to recieve a DM from the bot whenever that filtered event occurs.` +
	`The ${config.prefix}notify time command differs where you have to pass it a cycle to be notified for and can pass it X minutes(as a number) after the [location] argument to recieve the DM that many minutes beforehand`,
	aliases: ['not', 'watch', 'alert'],
	usage: `${config.prefix}notify [command name] [command arguments] {time cycle} {minutes till time cycle becomes active}`,
	example: `${config.prefix}notify fissure axi rescue, ${config.prefix}notify baro, ${config.prefix}notify time cetus night 10`,
	cooldown: 5,

	execute(message, args) {
		if (!args.length) {
            return message.reply(`\n soon(tm)`)
        }
		let commandsList = [], notificationType = null;

		for (const file of fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'))) {
			const command = require(`./${file}`);
			commandsList.push(command);
		}
		
		for(command of commandsList){
			if (command.name == args[0]){
				notificationType = command;
				break;
			}
			for (i in command.aliases){
				if (command.aliases[i] == args[0]){
					notificationType = command;
					break;
				}
			}
		}

		if(notificationType == null){
			return message.reply(`'${args[0]}' is not a valid argument for a command. Please use ${config.prefix}help notify for more information`)
		}

		switch(notificationType.name) {
			case('notify'):	//TODO - something special
				return message.channel.send(`\`ha ha\``)

			case('time'):
				return message.reply('maybe some other time')
			default:
				args.splice(0,1)
				let argsFound = commons.valiateArgs(args, notificationType.validArgs, config.validArgsData);
				if(argsFound.invalid.length){message.reply(`\nthe argument(s) '${argsFound.invalid}' are unknown. They will be skipped`)}
				//TODO write to file
				console.log(`Notify args: type-${notificationType.name}, other args-${JSON.stringify(argsFound.valid)}`)
			break;
		}

	},
};