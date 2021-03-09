module.exports = {
    getBaroMsg: function (baroInfo) {
        if (!baroInfo.active){
			return 'Baro Ki\'Teer wii arrive in ' + baroInfo.startString;
		} else{
			//TODO inv list
            return 'oops';
		}
    },
    
}
