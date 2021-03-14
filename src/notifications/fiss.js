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
			return null
		}

		return `\n\`${stringTable.create(fissData,{ headers: ['tier', 'node', 'missionType','enemy','eta'], capitalizeHeaders: true })}\``
    }
}