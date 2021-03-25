const requestPromise = require('request-promise');

function getOrdinalSuffix(num) {
  const lowDigit = num % 10;
  const teenDigit = num % 100;

  if (teenDigit === 11
        || teenDigit === 12
        || teenDigit === 13) {
    return `${num}th`;
  }

  switch (lowDigit) {
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
  if (num > 9) {
    return num;
  }
  return `0${num}`;
}

function timeToString(dateTime) {
  return `${timeAddZero(dateTime.getHours())}:${timeAddZero(dateTime.getMinutes())}`;
}
function dateToString(dateTime) {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  return `${days[dateTime.getDay() - 1]} (${months[dateTime.getMonth()]} ${getOrdinalSuffix(dateTime.getDate())})`;
}

function dateTimeMsgFormat(ISOdate) {
  const dateTill = new Date(ISOdate);
  const dateCurr = new Date(Date.now());
  const timeDiff = dateTill.getTime() - Date.now();

  if (timeDiff > 86400000) { // more than 24 hours left
    return `on ${dateToString(dateTill)} at ${timeToString(dateTill)}`;
  }

  if (timeDiff / 3600000 + dateCurr.getHours() > 23.0) {
    return `tomorrow at ${timeToString(dateTill)}`;
  }
  return `today at ${timeToString(dateTill)}`;
}

function timeLeftMsgFormat(ISOdate) {
  const timeDiff = Date.parse(ISOdate) - Date.now();
  const days = parseInt(timeDiff / 86400000, 10);
  const hours = parseInt((timeDiff - days * 86400000) / 3600000, 10);
  const minutes = parseInt((timeDiff - (days * 86400000 + hours * 3600000)) / 60000, 10);

  return `${days !== 0 ? `${days}d ` : ''}${hours !== 0 ? `${hours}h ` : ''}${minutes !== 0 ? `${minutes}m` : ''}`;
}

function timeLeftWithSecMsgFormat(ISOdate) { // TODO - code smell bad
  const timeDiff = Date.parse(ISOdate) - Date.now();
  const days = parseInt(timeDiff / 86400000, 10);
  const hours = parseInt((timeDiff - days * 86400000) / 3600000, 10);
  const minutes = parseInt((timeDiff - (days * 86400000 + hours * 3600000)) / 60000, 10);
  const seconds = parseInt(
    (timeDiff - (days * 86400000 + hours * 3600000 + minutes * 60000)) / 1000, 10,
  );

  return `${days !== 0 ? `${days}d ` : ''}${hours !== 0 ? `${hours}h ` : ''}${minutes !== 0 ? `${minutes}m` : ''}${seconds !== 0 ? `${seconds}s` : ''}`;
}

function getWfStatInfo(path) {
  return requestPromise({
    method: 'GET',
    uri: path,
    headers: { 'User-Agent': 'Request-Promise', 'Content-Type': 'application/json' },
    json: true,
  })
    .then((data) => data)
    .catch((err) => {
      console.error(err);
    });
}

function valiateArgs(args, validArgTypes, validArgsList) {
  const returnArgs = { valid: {}, invalid: [] };
  for (let i = 0; i < args.length; i += 1) {
    let argIsValid = false;
    for (argType of validArgTypes) {
      for (validArg in validArgsList[argType]) {
        if (i < args.length - 1 && validArg == (`${args[i]} ${args[i + 1]} ${args[i + 2]}`)) {
          i += 2;
          argIsValid = true;
          if (returnArgs.valid[argType] === undefined) {
            returnArgs.valid[argType] = validArgsList[argType][validArg];
          }
        }
        if (i < args.length && validArg == (`${args[i]} ${args[i + 1]}`)) {
          i += 1;
          argIsValid = true;
          if (returnArgs.valid[argType] === undefined) {
            returnArgs.valid[argType] = validArgsList[argType][validArg];
          }
        } else if (validArg == (args[i])) {
          argIsValid = true;
          if (returnArgs.valid[argType] === undefined) {
            returnArgs.valid[argType] = validArgsList[argType][validArg];
          }
        }
      }
    }
    if (!argIsValid) {
      returnArgs.invalid.push(args[i]);
    }
  }
  return returnArgs;
}

module.exports.dateTimeMsgFormat = dateTimeMsgFormat;
module.exports.timeLeftMsgFormat = timeLeftMsgFormat;
module.exports.timeLeftWithSecMsgFormat = timeLeftWithSecMsgFormat;
module.exports.getWfStatInfo = getWfStatInfo;
module.exports.valiateArgs = valiateArgs;
