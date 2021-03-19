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

            for (sub of subList){
                console.log('User: ' + sub.userID)
                for (entry of sub.subData){
                    let subNotificationStr;

                    switch(entry.command) {
                        case('baro'):
                            subNotificationStr = notifyWrapper(entry.command, state.voidTrader, entry.args,  bot)
                        break;
    
                        case('fissure'):
                            subNotificationStr = notifyWrapper(entry.command, state.fissures, entry.args,  bot)
                        break;
    
                        case('invasion'):
                            subNotificationStr = notifyWrapper(entry.command, state.invasions, entry.args,  bot)
                        break;
    
                        case('sortie'):
                            subNotificationStr = notifyWrapper(entry.command, state.sortie, entry.args,  bot)
                        break;

                        case('arbitration'):
                            subNotificationStr = notifyWrapper(entry.command, state.arbitration, entry.args,  bot)
                        break;
    
                        case('time'):
                            //TODO
                        break;
                        
                        default:
                            subNotificationStr = null;
                        break;  
                    }

                    console.log('return string:' + subNotificationStr)

                    if(subNotificationStr !== null){
                        bot.users.fetch(sub.userID).then(function(user) {
                            try{
                                user.send(`Notification for you opperator:\n${subNotificationStr}`)
                            } catch(error){
                                channel.send(`Failed to send a DM to ${user}. Have you enabled DMs?`)
                            }
                        });
                    }
                }
            }
            
            bot.lastWatch = Date.parse(state.timestamp)
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