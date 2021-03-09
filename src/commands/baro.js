const commons = require('../commons.js')

module.exports = {
	name: 'baro',
	description: 'Provides time till Baro Ki\'Teer(aka Void Traider) arrives.' + 
	' If Baro Ki\'Teer is in fact here, will return a list of his current inventory.',
	execute(message, args, wfState) {
		return message.channel.send(commons.getBaroMsg(wfState.voidTrader));
	},
};