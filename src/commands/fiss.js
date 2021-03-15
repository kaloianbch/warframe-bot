const stringTable = require('string-table');

const config = require('../../res/bot-config.json');
const commons = require('../commons.js')

tierArgs = ['lith', 'meso', 'neo', 'axi', 'requem']
missTypeArgs = ['']
module.exports = {
	name: 'fissure',
	description: 'Provides current list of relic missions either not filtered, or filtered by tier or mission type',
	aliases: ['fiss', 'fish', 'relic', 'relics', 'fissures'],
	usage: `${config.prefix}fissure [relic tier] / [mission type] / [faction] (arguments can be in any order)`,
	example: `${config.prefix}fissure axi, ${config.prefix}fissure rescue, ${config.prefix}fissure mobile defense meso grineer`,
	cooldown: 5,
    validArgs: ['fiss', 'faction', 'mission'],

	execute(message, args) {
        let argsFound = commons.valiateArgs(args, this.validArgs, config.validArgsData);
        if(argsFound.invalid.length){message.reply(`\nthe argument(s) '${argsFound.invalid}' are unknown. I will search without them.`)}

        console.log(`Fissure args: tier-${argsFound.valid.fiss}, mission-${argsFound.valid.mission}, faction-${argsFound.valid.faction}`)

		commons.getWfStatInfo(config.WFStatApiURL + '/fissures').then((fissData) => {
			let filteredReply = this.notification(fissData, argsFound.valid.fiss, argsFound.valid.mission, argsFound.valid.faction);

            if (filteredReply === null){ return message.reply(`\nNo current fissures meet those parameters`) }
			return message.reply(`\nHere are the fissures that match those parameters:` + filteredReply);
		})
	},

    notification: function(fissData, tier, mission, faction){
        for(let i = fissData.length - 1; i >= 0; i--){
			if(tier != null && tier != String(fissData[i].tier).toLowerCase()
			|| mission != null && mission != String(fissData[i].missionType).toLowerCase()
			|| faction != null && faction != String(fissData[i].enemy).toLowerCase()){
				fissData.splice(i, 1)
			}
		}
		if(!Object.keys(fissData).length){
			return null
		}

		return `\n\`${stringTable.create(fissData,{ headers: ['tier', 'node', 'missionType','enemy','eta'], capitalizeHeaders: true })}\``
    }
};