const config = require('../../res/bot-config.json');
const commons = require('../commons.js')
const baroNotification = require('../notifications/baro.js')

module.exports = {
	name: 'baro',
	description: 'Provides time till Baro Ki\'Teer(aka Void Traider) arrives.' + 
	' If Baro Ki\'Teer is in fact here, this command will return a list of his current inventory.',
	aliases: ['voidtrader', 'baro ki\'teer', 'ki\'teer'],
	usage: `${config.prefix}baro`,
	cooldown: 5,

	execute(message, args) {
		let baroPromise =  commons.getWfStatInfo(config.WFStatApiURL + '/voidTrader')
		baroPromise.then((baroData) => {
			return message.reply(`\n${baroNotification.notification(baroData)}`);
		})
	},
};