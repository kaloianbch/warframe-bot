const stringTable = require('string-table');

const config = require('../../res/bot-config.json');
const commons = require('../commons.js');

function baroInvListMsg(data) {
  let ducTotal = 0;
  let credTotal = 0;
  data.inventory.forEach((item) => {
    ducTotal += item.ducats;
    credTotal += item.credits;
    // todo insert comma
  });
  data.inventory.push({ item: 'TOTAL:', ducats: ducTotal, credits: credTotal });

  return `Baro Ki'Teer is currently at ${data.location}. He will depart ${commons.dateTimeMsgFormat(data.expiry)} (${commons.timeLeftMsgFormat(data.expiry)} from now).\nHere is a list of his current inventory:\n\`${stringTable.create(data.inventory)}\``;
}

function baroTimeTillMsg(data) {
  return `Baro Ki'Teer will arive next ${commons.dateTimeMsgFormat(data.activation)} (${commons.timeLeftMsgFormat(data.activation)} from now) at ${data.location}.`;
}

module.exports = {
  name: 'baro',
  description: 'Provides time till Baro Ki\'Teer(aka Void Traider) arrives. If Baro Ki\'Teer is in fact here, this command will return a list of his current inventory.',
  aliases: ['voidtrader', 'baro ki\'teer', 'ki\'teer'],
  usage: `${config.prefix}baro`,
  cooldown: 5,

  execute(message) {
    commons.getWfStatInfo(`${config.WFStatApiURL}/voidTrader`).then((baroData) => message.reply(`\n${this.notification(baroData)}`));
  },
  notification(baroData, args, lastCheckedDate) {
    console.log(`Baro args: lastchecked-${lastCheckedDate}`);
    if (baroData.active) { // TODO - fix for notifications(keeps notifiying after init)
      return baroInvListMsg(baroData);
    }
    if (lastCheckedDate !== undefined) {
      return null;
    }
    return baroTimeTillMsg(baroData);
  },
};
