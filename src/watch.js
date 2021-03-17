const fs = require('fs');

const commons = require('./commons.js')
const config = require('../res/bot-config.json');

module.exports = {
    watchCheck: function (channel, bot) {
        let subList = [];

		for (const file of fs.readdirSync('./res/subs').filter(file => file.endsWith('.json'))) {
            try{
                let subInfo = {}
                subInfo.userID = file.replace('.json', '');
                subInfo.subData = JSON.parse(fs.readFileSync(`./res/subs/${file}`));
                
                subList.push(subInfo);
            } catch(error){
                console.error(error)
            }
		}

        commons.getWfStatInfo(config.WFStatApiURL).then((state) => {
            console.log('fetch time: ' + new Date(state.timestamp));
            let subNotStr;

            for (sub of subList){
                for (entry of sub.subData){
                    switch(entry.command) {
                        case('baro'):
                        break;
    
                        case('fissure'):
                            subNotStr = notifyWrapper(entry.command, state.fissures, entry.args,  bot)
                        break;
    
                        case('invasion'):
                        break;
    
                        case('sortie'):
                        break;
    
                        case('time'):
                            //TODO
                        break;
                        
                        default:
                        break;  
                    }
                }
            }
            
            bot.lastWatch = Date.parse(state.timestamp)

            if(subNotStr !== null){
                bot.users.fetch(subList[0].userID).then(function(user) {
                    try{
                        user.send(`Notification for you opperator:\n${subNotStr}`)
                    } catch(error){
                        channel.send(`Failed to send a DM to ${user}. Have you enabled DMs?`)
                    }
                });
            }
        })
    }
}

function notifyWrapper(command, data, args, bot){
    try {
        return  bot.commands.get(command).notification(data, args, bot.lastWatch);
    } catch (error) {
        console.error(error);
        return null;
    }
}