const config = require('../../res/bot-config.json');
const commons = require('../commons.js')
const fissNotification = require('../notifications/fiss.js')

tierArgs = ['lith', 'meso', 'neo', 'axi', 'requem']
missTypeArgs = ['']
module.exports = {
	name: 'fissure',
	description: 'Provides current list of relic missions either not filtered, or filtered by tier or mission type',
	aliases: ['fiss', 'fish', 'relic', 'relics', 'fissures'],
	usage: `${config.prefix}fissure [relic tier] / [mission type] / [faction] (arguments can be in any order)`,
	example: `${config.prefix}fissure axi, ${config.prefix}fissure rescue, ${config.prefix}fissure mobile defense meso grineer`,
	cooldown: 5,

	execute(message, args) {
        let tierArg = null, missArg = null, factArg = null;
        for (let i = 0; i < args.length; i++){
            let isValid = false
            for (tier in config.validArgsData.fiss){
                if (tier == (args[i])){ 
                    isValid = true; 
                    if(tierArg == null) { tierArg = config.validArgsData.fiss[tier] }
                }
            }
            for (faction in config.validArgsData.faction){
                if (faction == (args[i]) && factArg == null){
                    isValid = true; 
                    if(factArg == null) { factArg = config.validArgsData.faction[faction] }
                }
            }
            for (mission in config.validArgsData.mission){
                if (i < args.length && mission == (`${args[i]} ${args[i + 1]}`)){ 
                    i++;
                    isValid = true; 
                    if(missArg == null) { missArg = config.validArgsData.mission[mission] }
                }
                else if(mission == (args[i])){
                    isValid = true; 
                    if(missArg == null) { missArg = config.validArgsData.mission[mission] }
                }
            }
            if(!isValid){message.reply(`\nthe argument '${args[i]}' is unknown. I will search without it.`)}
        }
        console.log(`Fissure args: tier-${tierArg}, mission-${missArg}, faction-${factArg}`)

		let fissPromise =  commons.getWfStatInfo(config.WFStatApiURL + '/fissures')
		fissPromise.then((fissData) => {
			return message.reply(`\nHere are the fissures that match those parameters:` + 
            fissNotification.notification(fissData, tierArg, missArg, factArg));
		})
	},
};