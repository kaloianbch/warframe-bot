const stringTable = require('string-table');

const config = require('../../res/bot-config.json');
const commons = require('../commons.js')


module.exports = {
	name: 'arbitration',
	description: 'Provides information about the current arbitration. You can provide a mission type as an argument if you to see the arbitration only if it is that mission(for use with notifications command)',
	aliases: ['arbi'],
	usage: `${config.prefix}arbitration [mission type]`,
	example: `${config.prefix}arbitration, ${config.prefix}arbitration disruption`,
	cooldown: 5,
	validArgs: ['mission'],


	execute(message, args) {
		let argsFound = commons.valiateArgs(args, this.validArgs, config.validArgsData);
        if(argsFound.invalid.length){message.reply(`\nthe argument(s) '${argsFound.invalid}' are unknown. I will search without them.`)}

       	commons.getWfStatInfo(config.WFStatApiURL + '/arbitration').then((arbiData) => {
			let filteredReply = this.notification(arbiData, argsFound.valid);

			if (filteredReply === null){
				return  message.reply(`\nThe current arbitration is not a mission: ${argsFound.valid.mission}`)
			}
			
            return message.reply(`\n${filteredReply}`)
        });
	},

	
    notification: function(arbiData, args, lastCheckedDate){
		console.log(`Sortie args: lastchecked-${lastCheckedDate} mission-${args.mission}`)
	
		if((lastCheckedDate === undefined || lastCheckedDate <= Date.parse(arbiData.activation))
		&&(args.mission === undefined || String(arbiData.type).toLowerCase() == (args.mission))) {

			return `The current arbitration is **${arbiData.type}** on **${arbiData.node}** vs **${arbiData.enemy}** (**eta: ${commons.timeLeftWithSecMsgFormat(arbiData.expiry)}**)`
		}
		return null;
    }
};