const config = require('../../res/bot-config.json');
const commons = require('../commons.js')

module.exports = {
	name: 'time',
	description: 'Provides the current time cycle of a given location and the time left of the current cycle.',
	aliases: ['cycle'],
	usage: `${config.prefix}time [location]`,
	example: `${config.prefix}time earth, ${config.prefix}time cetus`,
	cooldown: 5,

	execute(message, args) {
        if (!args.length) {
            return message.reply(`\nYou need to specify a location. Please look at \`${config.prefix}help time\` for more information.`)
        }

		let locArg = null, factArg = null;
        for (let i = 0; i < args.length; i++){
            let isValid = false
            for (location in config.validArgsData.cycle){
				if (i < args.length - 1 && location == (`${args[i]} ${args[i + 1]} ${args[i + 2]}`)){ 
                    i += 2;
                    isValid = true; 
                    if(locArg == null) { locArg = config.validArgsData.cycle[location] }
                }
                if (i < args.length && location == (`${args[i]} ${args[i + 1]}`)){ 
                    i++;
                    isValid = true; 
                    if(locArg == null) { locArg = config.validArgsData.cycle[location] }
                }
                else if(location == (args[i])){
                    isValid = true; 
                    if(locArg == null) { locArg = config.validArgsData.cycle[location] }
                }
            }
            if(!isValid){return message.reply(`\nthe argument '${args[i]}' is unknown. Please look at \`${config.prefix}help time\` for more information.`)}
        }
        console.log(`Time args: place-${locArg.path}`)
		let timePromise =  commons.getWfStatInfo(config.WFStatApiURL + locArg.path)
		timePromise.then((timeData) => {
            switch(locArg.path) {
                case '/cambionCycle':
                    let time = timeData.active.charAt(0).toUpperCase() + timeData.active.slice(1)
                    return message.reply(`\nIt is currently **${time}** on ${locArg.name} (${commons.timeLeftWithSecMsgFormat(timeData.expiry)} left)`);
                default:
                    return message.reply(`\nIt is currently **${timeData.state}** on ${locArg.name} (${commons.timeLeftWithSecMsgFormat(timeData.expiry)} left)`);
              }  
		})
	},
};