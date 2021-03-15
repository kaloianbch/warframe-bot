const config = require('../../res/bot-config.json');
const commons = require('../commons.js')
const sortieNotification = require('../notifications/sortie.js')


module.exports = {
	name: 'sortie',
	description: 'Provides information about the current sortie',
	aliases: ['daily'],
	usage: `${config.prefix}sortie`,
	cooldown: 5,

	execute(message, args) {
        let sortiePromise =  commons.getWfStatInfo(config.WFStatApiURL + '/sortie')
		sortiePromise.then((sortieData) => {
            return message.reply(`\nThe current sortie is:\n${sortieData.boss} (${sortieData.faction}) with ` + 
            `${commons.timeLeftMsgFormat(sortieData.expiry)} left till it expires. Here are the missions:${sortieNotification.notification(sortieData)}`)
        });
	},
};