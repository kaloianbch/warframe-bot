const stringTable = require('string-table');
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
				return message.reply(`\n${baroInvListMsg(baroInfo)}`);
			} else{
				return message.reply(`\n${baroTimeTillMsg(baroInfo)}`);
			}
		})
	},
};

function baroInvListMsg(data) {
	let ducTotal = 0;
	let credTotal = 0;
	for(item of data.inventory){
		ducTotal += item.ducats;
		credTotal += item.credits;
		//todo insert comma
	}
	data.inventory.push({item: "TOTAL:", ducats: ducTotal, credits: credTotal})

	return `Baro Ki'Teer is currently at ${data.location}. He will depart ${commons.dateTimeMsgFormat(data.expiry)} (${commons.timeLeftMsgFormat(data.expiry)} from now).
	\nHere is a list of his current inventory:\n\`${stringTable.create(data.inventory)}\``
}

function baroTimeTillMsg(data) {
	return `Baro Ki'Teer will arive next ${commons.dateTimeMsgFormat(data.activation)} (${commons.timeLeftMsgFormat(data.activation)} from now) at ${data.location}.`
}