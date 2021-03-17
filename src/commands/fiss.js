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

		commons.getWfStatInfo(config.WFStatApiURL + '/fissures').then((fissData) => {
			let filteredReply = this.notification(fissData, argsFound.valid);

            if (filteredReply === null){ return message.reply(`\nNo current fissures meet those parameters`) }
			return message.reply(`\nHere are the fissures that match those parameters:` + filteredReply);
		})
	},

    notification: function(fissData, args, lastCheckedDate){
		console.log(`Fissure args: tier-${args.fiss}, mission-${args.mission}, faction-${args.faction}, lastchecked-${lastCheckedDate}`)
		let printData = []
		let now = Date.now();
        for(i in fissData){ //TODO - cleaner, generic args check
			if((lastCheckedDate === undefined || (lastCheckedDate <= Date.parse(fissData[i].activation) && Date.parse(fissData[i].activation) <= now))
			&& (args.fiss === undefined || String(fissData[i].tier).toLowerCase().includes(args.fiss)) 
			&& (args.mission === undefined || String(fissData[i].missionType).toLowerCase() == (args.mission))
			&& (args.faction === undefined || String(fissData[i].enemy).toLowerCase().includes(args.faction))){
				printData.push(fissData[i]);
			}
		}
		if(!Object.keys(printData).length){
			return null
		}

		return `\n\`${stringTable.create(printData,{ headers: ['tier', 'node', 'missionType','enemy','eta'], capitalizeHeaders: true })}\``
    }
};