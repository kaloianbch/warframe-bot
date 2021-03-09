module.exports = {
	name: 'baro',
	description: 'Provides time till Baro Ki\'Teer(aka Void Traider) arrives.' + 
	' If Baro Ki\'Teer is in fact here, will return a list of his current inventory.',
	execute(message, args, wfState) {
		baroInfo = wfState.voidTrader
		if (!baroInfo.active){
			message.channel.send('Baro Ki\'Teer wii arrive in ' + wfState.voidTrader.startString);
		} else{
			//TODO inv list
		}
	},
};