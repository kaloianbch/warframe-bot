require('dotenv').config()
module.exports = {
	name: 'help',
	description: 'List all of my commands or info about a specific command.',
	aliases: ['commands'],
	usage: '[command name]',
	cooldown: 5,

	execute(message, args) {
		const data = [];
        const { commands } = message.client;
        console.log(commands)

        if (!args.length) {
            data.push('Here\'s a list of all my commands: ');
            data.push(commands.map(command => command.name).join(', '));
            data.push(`\nYou can send \`${process.env.PREFIX}help [command name]\` to get info on a specific command.`);
            
            return message.reply(`\n${data}`, { split: true })
        }

        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if (!command) {
            return message.reply('that is not a valid command.');
        }

        data.push(`**Name:** ${command.name}`);

        if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
        if (command.description) data.push(`**Description:** ${command.description}`);
        if (command.usage) data.push(`**Usage:** ${process.env.PREFIX}${command.name} ${command.usage}`);

        return message.reply(`\n${data}`, { split: true })
	},
};