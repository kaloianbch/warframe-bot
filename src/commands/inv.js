const stringTable = require('string-table');

const config = require('../../res/bot-config.json');
const commons = require('../commons.js')

module.exports = {
	name: 'invasion',
	description: 'Provides a list of current invasions. Can be filtered by factions which the player can work against(for getting death marks, etc.) and by reward',
	aliases: ['inv', 'invasions', 'offensive', 'offensives','sieges','siege'],
	usage: `${config.prefix}invasion [reward type] / [attackable faction] (arguments can be in any order)`,
	example: `${config.prefix}invasion fieldron, ${config.prefix}invasion twin viper wraith, ${config.prefix}invasion grineer`,
	cooldown: 5,
    validArgs: ['faction', 'invReward'],

	execute(message, args) {
        let argsFound = commons.valiateArgs(args, this.validArgs, config.validArgsData);
        if(argsFound.invalid.length){message.reply(`\nthe argument(s) '${argsFound.invalid}' are unknown. I will search without them.`)}

		commons.getWfStatInfo(config.WFStatApiURL + '/invasions').then((invData) => {
            //TODO - over 2000 char coverage
			let filteredReply = this.notification(invData, argsFound.valid);

            if (filteredReply === null){ return message.reply(`\nNo current invasions meet those parameters`) }
			return message.reply(`\nHere are the invasions that match those parameters:` + filteredReply);
		})
	},

    notification: function(invData, args, lastCheckedDate){
        console.log(`Invasion args: reward-${args.invReward}, faction-${args.faction}, lastchecked-${lastCheckedDate}`)
        let printData = []
        for(let i = invData.length - 1; i >= 0; i--){
        
			if(!invData[i].completed 
                && (lastCheckedDate === undefined 
                    || (lastCheckedDate < Date.parse(fissData.activation) && Date.parse(fissData.activation) < Date.now))
                && (args.invReward == null || String(invData[i].attacker.reward.itemString).toLowerCase().includes(args.invReward)
                    || String(invData[i].defender.reward.itemString).toLowerCase().includes(args.invReward))
                && (args.faction == null || String(invData[i].attackingFaction).toLowerCase().includes(args.faction) 
                    || (String(invData[i].defendingFaction).toLowerCase().includes(args.faction) && !invData[i].vsInfestation))){
				printData.push({
                    "node": invData[i].node,
                    "description": invData[i].desc,
                    "attackers": invData[i].attackingFaction,
                    "attackers\' reward": invData[i].vsInfestation ? "none" : invData[i].attacker.reward.itemString,
                    "defenders": invData[i].defendingFaction,
                    "defenders\' reward": invData[i].defender.reward.itemString,
                    "eta": invData[i].eta,
                });
			}
		}
		if(!Object.keys(printData).length){
			return null
		}
        
        return `\n\`${stringTable.create(printData,{ 
            headers: ['node', 'description', 'attackers','attackers\' reward','defenders','defenders\' reward','eta'], capitalizeHeaders: true })}\``
    }
};