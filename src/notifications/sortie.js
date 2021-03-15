const stringTable = require('string-table');

module.exports = {
    notification: function(sortieData){
		return `\n\`${stringTable.create(sortieData.variants,{ headers: ['node', 'missionType', 'modifier', 'modifierDescription'], capitalizeHeaders: true })}\``
    }
}
