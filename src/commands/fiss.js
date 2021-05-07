const stringTable = require('string-table');

const config = require('../../res/bot-config.json');
const commons = require('../commons.js');

module.exports = {
  name: 'fissure',
  description: 'Provides current list of relic missions either not filtered, or filtered by tier or mission type',
  aliases: ['fiss', 'fish', 'relic', 'relics', 'fissures'],
  usage: `${config.prefix}fissure [relic tier] / [mission type] / [faction] (arguments can be in any order)`,
  example: `${config.prefix}fissure axi, ${config.prefix}fissure rescue, ${config.prefix}fissure mobile defense meso grineer`,
  cooldown: 5,
  validArgs: ['fiss', 'faction', 'mission'],

  execute(message, args) {
    const argsFound = commons.valiateArgs(args, this.validArgs, config.validArgsData);
    if (argsFound.invalid.length) { message.reply(`\nthe argument(s) '${argsFound.invalid}' are unknown. I will search without them.`); }

    commons.getWfStatInfo(`${config.WFStatApiURL}/fissures`).then((fissData) => {
      const filteredReply = this.notification(fissData, argsFound.valid);

      if (filteredReply === null) { return message.reply('\nNo current fissures meet those parameters'); }
      return message.reply(`\nHere are the fissures that match those parameters:${filteredReply}`);
    });
  },

  notification(fissData, args, lastCheckedDate) {
    console.log(`Fissure args: tier-${args.fiss}, mission-${args.mission}, faction-${args.faction}, lastchecked-${lastCheckedDate}`);
    const printData = [];
    fissData.forEach((entry) => {
      if ((lastCheckedDate === undefined || lastCheckedDate <= Date.parse(entry.activation))
          && (args.fiss === undefined
              || String(entry.tier).toLowerCase().includes(args.fiss))
          && (args.mission === undefined
              || String(entry.missionType).toLowerCase() === (args.mission))
          && (args.faction === undefined
              || String(entry.enemy).toLowerCase().includes(args.faction))) {
        printData.push(entry);
      }
    });
    if (!printData.length) {
      return null;
    }
    return `\n\`${stringTable.create(printData, { headers: ['tier', 'node', 'missionType', 'enemy', 'eta'], capitalizeHeaders: true })}\``;
  },
};
