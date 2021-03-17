const fs = require('fs');

const commons = require('./commons.js')
const config = require('../res/bot-config.json');

module.exports = {
    watchCheck: function (channel, bot, lastWatch) {
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
            for (i in subList){
                let userID = subList[i].userID  //TODO - figure out why it breaks without this

                for(notice of subList[i].subData){
                    let notifyData;
                    let command = bot.commands.get(notice.command);
                    switch(command.name) {
                        case('baro'):
                            notifyData = notifyWrapper(command, state.voidTrader, notice.args, lastWatch)
                        break;
    
                        case('fissure'):
                            notifyData = notifyWrapper(command, state.fissures, notice.args, lastWatch)
                        break;
    
                        case('invasion'):
                            notifyData = notifyWrapper(command, state.invasions, notice.args, lastWatch)
                        break;
    
                        case('sortie'):
                            notifyData = notifyWrapper(command, state.sortie, notice.args, lastWatch)
                        break;
    
                        case('time'):
                            //TODO
                            notifyData = null;
                        break;
                        
                        default:
                            notifyData = null;
                        break;  
                    }    
                    if(notifyData !== null){
                        console.log(`found ${JSON.stringify(notifyData)} for ${userID}`)
                        bot.users.fetch(userID).then(function(user) {
                            try{
                                user.send(`Notification for you opperator:\n${notifyData}`)
                            } catch(error){
                                channel.send(`Failed to send a DM to ${user}. Have you enabled DMs?`)
                            }
                        });
                    }
                }
            }
        })
    }
}

function notifyWrapper(command, data, args, lastWatch){
    try {
        return command.notification(data, args, lastWatch);
    } catch (error) {
        console.error(error);
        return null;
    }
}