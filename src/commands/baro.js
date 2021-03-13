const commons = require('../commons.js')

module.exports = {
	name: 'baro',
	description: 'Provides time till Baro Ki\'Teer(aka Void Traider) arrives.' + 
	' If Baro Ki\'Teer is in fact here, this command will return a list of his current inventory.',
	aliases: ['voidtrader', 'baro ki\'teer', 'ki\'teer'],
	usage: '',
	cooldown: 5,

	execute(message, args) {
		let baroPromise =  commons.getWfStatInfo('\\voidTrader')
		baroPromise.then((baroInfo) => {
			if (baroInfo.active){
				return message.channel.send(baroInvListMsg(baroInfo));
			} else{
				return message.channel.send(baroTimeTillMsg(baroInfo));
			}
		})
	},
};

function baroInvListMsg(data) {
	return(data.id)	//TODO - item table
}

function baroTimeTillMsg(data) {

	return 'Baro Ki\'Teer will arive next ' + commons.dateTimeMsgFormat(data.activation) + ' (' + 'stubTimeDiff' + 'from now) at ' + data.location + '.'
}