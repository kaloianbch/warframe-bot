const fs = require('fs');

const config = require('../../res/bot-config.json');

module.exports = {
	name: 'notify',
	description: '',
	aliases: ['watch', 'alert'],
	usage: '[command name]',
	cooldown: 5,

	execute(message, args) {
		if (!args.length) {
            //send dm form
        }
		let notificationTypes = []
		for (const file of fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'))) {
			const type = require(`./${file}`);
			notificationTypes.push(type);
		}
		console.log(notificationTypes)
	},
};