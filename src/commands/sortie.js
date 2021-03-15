const stringTable = require('string-table');

const config = require('../../res/bot-config.json');
const commons = require('../commons.js')


module.exports = {
	name: 'sortie',
	description: 'Provides information about the current sortie',
	aliases: ['daily'],
	usage: `${config.prefix}sortie`,
	cooldown: 5,

	execute(message, args) {
        let sortiePromise =  commons.getWfStatInfo(config.WFStatApiURL + '/sortie')
		sortiePromise.then((sortieData) => {
            return message.reply(`\nThe current sortie is:**\n${sortieData.boss}** (**${sortieData.faction}**) with ` + 
            `**${commons.timeLeftMsgFormat(sortieData.expiry)}** left till it expires.\nHere are the missions:${this.notification(sortieData)}`)
        });
	},

	
    notification: function(sortieData){
		return `\n\`${stringTable.create(sortieData.variants,{ headers: ['node', 'missionType', 'modifier', 'modifierDescription'], capitalizeHeaders: true })}\``
    }
};