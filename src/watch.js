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

        console.log('Watch check at:' + Date.now())

        commons.getWfStatInfo(config.WFStatApiURL).then((state) => {
            let newCheck = Date.now();
            for (i in subList){
                let userID = subList[i].userID  //TODO - figure out why it breaks without this

                for(notice of subList[i].subData){
                    let notifyData;
                    let command = bot.commands.get(notice.command);
                    switch(command.name) {
                        case('baro'):
                            notifyData = notifyWrapper(command, state.voidTrader, notice.args,  bot.lastWatch)
                        break;
    
                        case('fissure'):
                            notifyData = notifyWrapper(command, state.fissures, notice.args,  bot.lastWatch)
                        break;
    
                        case('invasion'):
                            notifyData = notifyWrapper(command, state.invasions, notice.args,  bot.lastWatch)
                        break;
    
                        case('sortie'):
                            notifyData = notifyWrapper(command, state.sortie, notice.args,  bot.lastWatch)
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
            bot.lastWatch = newCheck;
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