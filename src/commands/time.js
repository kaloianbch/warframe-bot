const config = require('../../res/bot-config.json');
const commons = require('../commons.js');

module.exports = {
  name: 'time',
  description: 'Provides the current time cycle of a given location and the time left of the current cycle.',
  aliases: ['cycle'],
  usage: `${config.prefix}time [location]`,
  example: `${config.prefix}time earth, ${config.prefix}time cetus`,
  cooldown: 5,
  validArgs: ['cycle'],

  execute(message, args) {
    if (!args.length) {
      return message.reply(`\nYou need to specify a location. Please look at \`${config.prefix}help time\` for more information.`);
    }
    const argsFound = commons.valiateArgs(args, this.validArgs, config.validArgsData);
    if (argsFound.invalid.length) {
      return message.reply(`\nthe argument(s) '${argsFound.invalid}' are unknown. Please look at \`${config.prefix}help time\` for more information.`);
    }

    console.log(`Time args: place-${argsFound.valid.cycle.path}`);
    commons.getWfStatInfo(`${config.WFStatApiURL}/${argsFound.valid.cycle.path}`).then((timeData) => {
      switch (argsFound.valid.cycle.path) {
        case '/cambionCycle':
          return message.reply(`\nIt is currently **${timeData.active.charAt(0).toUpperCase() + timeData.active.slice(1)}** on ${argsFound.valid.cycle.name} (${commons.timeLeftMsgFormat(timeData.expiry, true)} left)`);
        default:
          return message.reply(`\nIt is currently **${timeData.state}** on ${argsFound.valid.cycle.name} (${commons.timeLeftMsgFormat(timeData.expiry, true)} left)`);
      }
    });
  },
};
