const stringTable = require('string-table');
const inv = require('../commands/inv.js');

const commons = require('../commons.js')

module.exports = {
    notification: function(invData, reward, faction){
        let printData = []
        for(let i = invData.length - 1; i >= 0; i--){
        
			if(!invData[i].completed 
                && (reward == null || String(invData[i].attacker.reward.itemString).toLowerCase().includes(reward) 
                || String(invData[i].defender.reward.itemString).toLowerCase().includes(reward))
                && (faction == null || String(invData[i].attackingFaction).toLowerCase().includes(faction) 
                || (String(invData[i].defendingFaction).toLowerCase().includes(faction) && !invData[i].vsInfestation))){
				printData.push({
                    "node": invData[i].node,
                    "description": invData[i].desc,
                    "attackers": invData[i].attackingFaction,
                    "attackers\' reward": invData[i].vsInfestation ? "none" : invData[i].attacker.reward.itemString,
                    "defenders": invData[i].defendingFaction,
                    "defenders\' reward": invData[i].defender.reward.itemString,
                    "eta": invData[i].eta,
                });
			}
		}
		if(!Object.keys(printData).length){
			return null
		}
        
        return `\n\`${stringTable.create(printData,{ 
            headers: ['node', 'description', 'attackers','attackers\' reward','defenders','defenders\' reward','eta'], capitalizeHeaders: true })}\``
    }
}