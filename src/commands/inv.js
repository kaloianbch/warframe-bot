const config = require('../../res/bot-config.json');
const commons = require('../commons.js')
const invNotification = require('../notifications/inv.js')

module.exports = {
	name: 'invasion',
	description: 'Provides a list of current invasions. Can be filtered by factions which the player can work against(for getting death marks, etc.) and by reward',
	aliases: ['inv', 'invasions', 'offensive', 'offensives','sieges','siege'],
	usage: `${config.prefix}invasion [reward type] / [attackable faction] (arguments can be in any order)`,
	example: `${config.prefix}invasion fieldron, ${config.prefix}invasion twin viper wraith, ${config.prefix}invasion grineer`,
	cooldown: 5,

	execute(message, args) {
		let rewArg = null, factArg = null;
        for (let i = 0; i < args.length; i++){
            let isValid = false
            for (faction in config.validArgsData.faction){
                if (faction == (args[i]) && factArg == null){
                    isValid = true; 
                    if(factArg == null) { factArg = config.validArgsData.faction[faction] }
                }
            }
            for (reward in config.validArgsData.invReward){
				if (i < args.length - 1 && reward == (`${args[i]} ${args[i + 1]} ${args[i + 2]}`)){ 
                    i += 2;
                    isValid = true; 
                    if(rewArg == null) { rewArg = config.validArgsData.invReward[reward] }
                }
                if (i < args.length && reward == (`${args[i]} ${args[i + 1]}`)){ 
                    i++;
                    isValid = true; 
                    if(rewArg == null) { rewArg = config.validArgsData.invReward[reward] }
                }
                else if(reward == (args[i])){
                    isValid = true; 
                    if(rewArg == null) { rewArg = config.validArgsData.invReward[reward] }
                }
            }
            if(!isValid){message.reply(`\nthe argument '${args[i]}' is unknown. I will search without it.`)}
        }
        console.log(`Invasion args: reward-${rewArg}, faction-${factArg}`)
		let invPromise =  commons.getWfStatInfo(config.WFStatApiURL + '/invasions')
		invPromise.then((invData) => {
            //TODO - over 2000 char coverage
			let filteredReply = invNotification.notification(invData, rewArg, factArg);

            if (filteredReply === null){ return message.reply(`\nNo current invasions meet those parameters`) }
			return message.reply(`\nHere are the invasions that match those parameters:` + filteredReply);
		})
	},
};