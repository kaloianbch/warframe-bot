const https = require('https');

let days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

module.exports = {
    getWfStatInfo: function (path) {
        try{
            return new Promise((resolve, reject) => {
                https.get(path, (response) => {
                    let chunks_of_data = [];
            
                    response.on('data', (fragments) => {
                        chunks_of_data.push(fragments);
                    });
            
                    response.on('end', () => {
                        console.log(`API fetch resolved for: ${path}`)
                        let response_body = Buffer.concat(chunks_of_data);
                        resolve(JSON.parse(response_body));
                    });
            
                    response.on('error', (error) => {
                        console.log(`API fetch failed for: ${path}`, error)
                        reject(error);
                    });
                });
            });
        }
        catch(err){
            console.log(err);
        }
    },
    
    dateTimeMsgFormat : function (ISOdate) {
        let dateTill = new Date(ISOdate);
        let dateCurr = new Date(Date.now());
        let timeDiff = dateTill.getTime() - Date.now();

        if(timeDiff > 86400000){    // more than 24 hours left
            return `on ${dateToString(dateTill)} at ${timeToString(dateTill)}`

        }
        else{
            if (timeDiff/3600000 + dateCurr.getHours() > 23.0){
                return `tomorrow at ${timeToString(dateTill)}`
            } else {
                return `today at ${timeToString(dateTill)}`
            }
        }
    },

    timeLeftMsgFormat : function (ISOdate) {
        let timeDiff = Date.parse(ISOdate) - Date.now();
        let days = parseInt(timeDiff/86400000);
        let hours = parseInt((timeDiff - days * 86400000)/3600000);
        let minutes = parseInt((timeDiff - (days * 86400000 + hours * 3600000))/60000);

        return `${days != 0 ? `${days}d ` : ``}${hours != 0 ? `${hours}h ` : ``}${minutes != 0 ? `${minutes}m` : ``}`
    },

    timeLeftWithSecMsgFormat : function (ISOdate) { //TODO - code smell bad
        let timeDiff = Date.parse(ISOdate) - Date.now();
        let days = parseInt(timeDiff/86400000);
        let hours = parseInt((timeDiff - days * 86400000)/3600000);
        let minutes = parseInt((timeDiff - (days * 86400000 + hours * 3600000))/60000);
        let seconds = parseInt((timeDiff - (days * 86400000 + hours * 3600000 + minutes *60000))/1000);

        return `${days != 0 ? `${days}d ` : ``}${hours != 0 ? `${hours}h ` : ``}${minutes != 0 ? `${minutes}m` : ``}${seconds != 0 ? `${seconds}s` : ``}`
    }
}


function timeToString (dateTime){
    return `${timeAddZero(dateTime.getHours())}:${timeAddZero(dateTime.getMinutes())}`
}
function dateToString (dateTime){
    return `${days[dateTime.getDay() - 1]} (${months[dateTime.getMonth()]} ${getOrdinalSuffix(dateTime.getDate())})`;
}

function getOrdinalSuffix(num) {
    lowDigit = num % 10;
    teenDigit = num % 100;

    if (teenDigit == 11 
        || teenDigit == 12
        || teenDigit == 13){
        return `${num}th`;
    }

    switch(lowDigit) {
        case 1:
            return `${num}st`;
        case 2:
            return `${num}nd`;
        case 3:
            return `${num}rd`;
        default:
            return `${num}th`;
    }
}

function timeAddZero(num) {
    if (num > 9){
        return num;
    } else{
        return `0${num}`;
    }
}
