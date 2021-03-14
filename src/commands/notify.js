const config = require('../../res/bot-config.json');
module.exports = {
	name: 'notify',
	description: '',
	aliases: ['watch', 'alert'],
	usage: '[command name]',
	cooldown: 5,

	execute(message, args) {
		return message.author.send(`\n${'boop'}`).then(msg => {
			const filter = (reaction, user) => {
				return config.emotes.test.includes(reaction.emoji.name) && user.id === message.author.id;
			};

			msg.react("👍").then(() => { 
				msg.react("👎");
			});

			msg.awaitReactions(filter, {max: 1}).then(data => {
				console.log(data);
			})
		});

		
	},
};