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
       commons.getWfStatInfo(config.WFStatApiURL + '/sortie').then((sortieData) => {
            return message.reply(`\nThe current sortie is:**\n${sortieData.boss}** (**${sortieData.faction}**) with ` + 
            `**${commons.timeLeftMsgFormat(sortieData.expiry)}** left till it expires.\nHere are the missions:${this.notification(sortieData)}`)
        });
	},

	
    notification: function(sortieData, args, lastCheckedDate){
		if(lastCheckedDate === undefined || (lastCheckedDate < Date.parse(fissData.activation) && Date.parse(fissData.activation) < Date.now)) {
			return `\n\`${stringTable.create(sortieData.variants,{
				headers: ['node', 'missionType', 'modifier', 'modifierDescription'], capitalizeHeaders: true 
			})}\``;
		}
		return null;
    }
};