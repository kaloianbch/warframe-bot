require('dotenv').config()
module.exports = {
	name: 'time',
	description: 'Provides time till Baro Ki\'Teer(aka Void Traider) arrives.' + 
	' If Baro Ki\'Teer is in fact here, will return a list of his current inventory.',
	execute(message, args, wfState) {
		if (!args.length) {
			return message.channel.send(`Please provide a location for your querry, ${message.author}.\n Use the \`` 
			+ process.env.PREFIX + 'help\` command if you require an explanation.' );
		}
		
	},
};