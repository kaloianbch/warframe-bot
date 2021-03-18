const stringTable = require('string-table');

const config = require('../../res/bot-config.json');
const commons = require('../commons.js')


module.exports = {
	name: 'sortie',
	description: 'Provides information about the current sortie. You can provide a mission type as an argument if you don\'t want to see sorties with that mission(for use with notifications command)',
	aliases: ['daily'],
	usage: `${config.prefix}sortie [mission type]`,
	example: `${config.prefix}sortie, ${config.prefix}sortie spy`,
	cooldown: 5,
	validArgs: ['mission'],


	execute(message, args) {
		let argsFound = commons.valiateArgs(args, this.validArgs, config.validArgsData);
        if(argsFound.invalid.length){message.reply(`\nthe argument(s) '${argsFound.invalid}' are unknown. I will search without them.`)}

       	commons.getWfStatInfo(config.WFStatApiURL + '/sortie').then((sortieData) => {
			let filteredReply = this.notification(sortieData, argsFound.valid);

			if (filteredReply === null){
				return  message.reply(`\nThe current sortie contains mission: ${argsFound.valid.mission}`)
			}
			
            return message.reply(`\n${filteredReply}`)
        });
	},

	
    notification: function(sortieData, args, lastCheckedDate){
		console.log(`Sortie args: lastchecked-${lastCheckedDate} mission-${args.mission}`)
	
		if((lastCheckedDate === undefined || (lastCheckedDate <= Date.parse(sortieData.activation)))) {
			for(sortieMission of sortieData.variants){
				if(String(sortieMission.missionType).toLowerCase() == (args.mission)){
					return null;
				}
			}

			return `The current sortie is:**\n${sortieData.boss}** (**${sortieData.faction}**) with **${commons.timeLeftMsgFormat(sortieData.expiry)}** left till it expires.` +
			`\nHere are the missions:\n\`${stringTable.create(sortieData.variants,{
				headers: ['node', 'missionType', 'modifier', 'modifierDescription'], capitalizeHeaders: true 
			})}\``;
		}
		return null;
    }
};