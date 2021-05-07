const fs = require('fs');

const commons = require('./commons.js');
const config = require('../res/bot-config.json');

// gets subs from files generated from notify command
function getSubs() {
  const subList = [];
  const subFilesList = fs.readdirSync('./res/subs')
    .filter((file) => file.endsWith('.json'));

  subFilesList.forEach((file) => {
    try {
      const subInfo = {};
      subInfo.userID = file.replace('.json', '');
      subInfo.subData = JSON.parse(fs.readFileSync(`./res/subs/${file}`));

      subList.push(subInfo);
    } catch (error) {
      console.error(error);
    }
  });

  return subList;
}

function notifyWrapper(command, data, args, bot) {
  try {
    return bot.commands.get(command).notification(data, args, bot.lastWatch);
  } catch (error) {
    console.error(error);
    return null;
  }
}

// TODO - remove switch case, add something generic
// passes args and api info to commands own function
function checkNotificationsForEntry(entry, state, bot) {
  let subNotificationStr;

  switch (entry.command) {
    case ('baro'):
      subNotificationStr = notifyWrapper(entry.command, state.voidTrader, entry.args, bot);
      break;

    case ('fissure'):
      subNotificationStr = notifyWrapper(entry.command, state.fissures, entry.args, bot);
      break;

    case ('invasion'):
      subNotificationStr = notifyWrapper(entry.command, state.invasions, entry.args, bot);
      break;

    case ('sortie'):
      subNotificationStr = notifyWrapper(entry.command, state.sortie, entry.args, bot);
      break;

    case ('arbitration'):
      subNotificationStr = notifyWrapper(entry.command, state.arbitration, entry.args, bot);
      break;

    case ('time'):
      // TODO
      break;

    default:
      break;
  }

  return subNotificationStr;
}

// entry function, returns new last checked timestamp
async function watchCheck(botChannel, bot) {
  console.log(`\nwatchCheck at: ${new Date(Date.now())}\nlast Check at: ${new Date(bot.lastWatch)}\n`);

  const subscribers = await getSubs();
  const wfState = await commons.getWfStatInfo(config.WFStatApiURL);

  subscribers.forEach((sub) => {
    console.log(`User: ${sub.userID}`);

    sub.subData.forEach((entry) => {
      const notifyStr = checkNotificationsForEntry(entry, wfState, bot);

      console.log(`return string:${notifyStr}`);

      if (notifyStr) {
        bot.users.fetch(sub.userID).then((user) => {
          try {
            user.send(`Notification for you operator:\n${notifyStr}`);
          } catch (error) {
            botChannel.send(`Failed to send a DM to ${user}. Have you enabled DMs?`);
          }
        });
      }
    });
  });

  return Date.parse(wfState.timestamp);
}

module.exports.notificationsCheck = watchCheck;
