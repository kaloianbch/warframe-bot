const config = require('../../res/bot-config.json');
module.exports = {
	name: 'help',
	description: 'List all of my commands or info about a specific command.',
	aliases: ['commands'],
	usage: `${config.prefix}help [command name]`,
	cooldown: 5,

	execute(message, args) {
        const { commands } = message.client;

        if (!args.length) {

            return message.reply(`\nHere's a list of all my commands:\n${commands.map(command => `**${command.name}**`).join('\n')}`
            + `\nYou can send \`${config.prefix}help [command name]\` to get info on a specific command.`)
        }

        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if (!command) {
            return message.reply('that is not a valid command.');
        }

        let data = []

        data.push(`**Name:** ${command.name}`);

        if (command.aliases) data.push(`\n**Aliases:** ${command.aliases.join(', ')}`);
        if (command.description) data.push(`\n**Description:** ${command.description}`);
        if (command.usage) data.push(`\n**Usage:** ${command.usage}`);
        if (command.example) data.push(`\n**Example:** ${command.example}`);

        return message.reply(`\n${data}`)
	},
};