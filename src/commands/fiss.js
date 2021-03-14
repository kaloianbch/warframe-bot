const config = require('../../res/bot-config.json');
const commons = require('../commons.js')
const fissNotification = require('../notifications/fiss.js')

tierArgs = ['lith', 'meso', 'neo', 'axi', 'requem']
missTypeArgs = ['']
module.exports = {
	name: 'fissure',
	description: 'Provides current list of relic missions either not filtered, or filtered by tier or mission type',
	aliases: ['fiss', 'relic', 'relics', 'fissures'],
	usage: `${config.prefix}fissure [relic tier] / [mission type] / [faction] (arguments can be in any order)`,
	example: `${config.prefix}fissure axi, ${config.prefix}fissure rescue, ${config.prefix}fissure mobile defense meso grineer`,
	cooldown: 5,

	execute(message, args) {
        let tierArg = null, missArg = null, factArg = null;
        for (i in args){
            for (tier in config.validArgsData.fiss){
                if (tier == (args[i]) && tierArg == null){ tierArg = config.validArgsData.fiss[tier] }
            }
            for (faction in config.validArgsData.faction){
                if (faction == (args[i]) && factArg == null){ factArg = config.validArgsData.faction[faction] }
            }
            for (mission in config.validArgsData.mission){
                if (i < args.length && mission == (`${args[i]} ${args[parseInt(i) + 1]}`) && missArg == null){ 
                    missArg = config.validArgsData.mission[mission]; 
                    i += 1;
                }
                else if(mission == (args[i]) && missArg == null){missArg = config.validArgsData.mission[mission]}
            }
        }
        console.log(`Fissure args: tier-${tierArg}, mission-${missArg}, faction-${factArg}`)

		let fissPromise =  commons.getWfStatInfo(config.WFStatApiURL + '/fissures')
		fissPromise.then((fissData) => {
			return message.reply(`\n${fissNotification.notification(fissData, tierArg, missArg, factArg)}`);
		})
	},
};