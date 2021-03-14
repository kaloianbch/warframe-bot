const stringTable = require('string-table');

const commons = require('../commons.js')

module.exports = {
    notification: function(fissData, tier, mission, faction){
        for(let i = fissData.length - 1; i >= 0; i--){
			if(tier != null && tier != String(fissData[i].tier).toLowerCase()
			|| mission != null && mission != String(fissData[i].missionType).toLowerCase()
			|| faction != null && faction != String(fissData[i].enemy).toLowerCase()){
				fissData.splice(i, 1)
			}
		}
		if(!Object.keys(fissData).length){
			return `No current fissures meet those parameters`
		}

		return `Here are the fissures that match those parameters:` + 
		`\n\`${stringTable.create(fissData,{ headers: ['tier', 'node', 'missionType','eta'], capitalizeHeaders: true })}\``
    }
}