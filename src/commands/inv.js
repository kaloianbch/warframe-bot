const stringTable = require('string-table');

const config = require('../../res/bot-config.json');
const commons = require('../commons.js');

module.exports = {
  name: 'invasion',
  description: 'Provides a list of current invasions. Can be filtered by factions which the player can work against(for getting death marks, etc.) and by reward',
  aliases: ['inv', 'invasions', 'offensive', 'offensives', 'sieges', 'siege'],
  usage: `${config.prefix}invasion [reward type] / [attackable faction] (arguments can be in any order)`,
  example: `${config.prefix}invasion fieldron, ${config.prefix}invasion twin viper wraith, ${config.prefix}invasion grineer`,
  cooldown: 5,
  validArgs: ['faction', 'invReward'],

  execute(message, args) {
    const argsFound = commons.valiateArgs(args, this.validArgs, config.validArgsData);
    if (argsFound.invalid.length) { message.reply(`\nthe argument(s) '${argsFound.invalid}' are unknown. I will search without them.`); }

    commons.getWfStatInfo(`${config.WFStatApiURL}/invasions`).then((invData) => {
      // TODO - over 2000 char coverage
      const filteredReply = this.notification(invData, argsFound.valid);

      if (filteredReply === null) { return message.reply('\nNo current invasions meet those parameters'); }
      return message.reply(`\nHere are the invasions that match those parameters:${filteredReply}`);
    });
  },

  notification(invData, args, lastCheckedDate) {
    console.log(`Invasion args: reward-${args.invReward}, faction-${args.faction}, lastchecked-${lastCheckedDate}`);
    const printData = [];
    invData.forEach((entry) => {
      if (
        !entry.completed
          && (lastCheckedDate === undefined
              || (lastCheckedDate <= Date.parse(entry.activation)))
          && (args.invReward == null
              || String(entry.attacker.reward.itemString).toLowerCase().includes(args.invReward)
              || String(entry.defender.reward.itemString).toLowerCase().includes(args.invReward))
          // the faction arg is only relevant if they aren't fighting back the infested,
          // hence the check
          && (args.faction == null
              || String(entry.attackingFaction).toLowerCase().includes(args.faction)
              || (String(entry.defendingFaction).toLowerCase().includes(args.faction)
                  && !entry.vsInfestation))
      ) {
        printData.push({
          node: entry.node,
          description: entry.desc,
          attackers: entry.attackingFaction,
          // if the attackers are infested they don't have a reward so that field is undefined
          "attackers' reward": entry.vsInfestation ? 'none' : entry.attacker.reward.itemString,
          defenders: entry.defendingFaction,
          "defenders' reward": entry.defender.reward.itemString,
          eta: entry.eta,
        });
      }
    });
    if (!printData.length) {
      return null;
    }

    return `\n\`${stringTable.create(printData, { headers: ['node', 'description', 'attackers', 'attackers\' reward', 'defenders', 'defenders\' reward', 'eta'], capitalizeHeaders: true })}\``;
  },
};
