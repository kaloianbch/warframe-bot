const requestPromise = require('request-promise');

// appends suffix to number
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

// formats time string by adding a zero to the front
function timeAddZero(num) {
  if (num > 9) {
    return num;
  }
  return `0${num}`;
}
// returns xx:xx formatted time from Date object
function timeToString(dateTime) {
  return `${timeAddZero(dateTime.getHours())}:${timeAddZero(dateTime.getMinutes())}`;
}
// returns date as formatted string
function dateToString(dateTime) {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  return `${days[dateTime.getDay() - 1]} (${months[dateTime.getMonth()]} ${getOrdinalSuffix(dateTime.getDate())})`;
}

// takes an ISO 8601 date(what the API uses) and returns a more readable string format
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

// returns time left till given date down to seconds, if specified
function timeLeftMsgFormat(ISOdate, addSeconds) {
  const timeDiff = Date.parse(ISOdate) - Date.now();
  const days = parseInt(timeDiff / 86400000, 10);
  const hours = parseInt((timeDiff - days * 86400000) / 3600000, 10);
  const minutes = parseInt((timeDiff - (days * 86400000 + hours * 3600000)) / 60000, 10);
  let seconds = 0;
  console.log(ISOdate);
  if (addSeconds) {
    seconds = parseInt(
      (timeDiff - (days * 86400000 + hours * 3600000 + minutes * 60000)) / 1000, 10,
    );
  }

  return `${days !== 0 ? `${days}d ` : ''}${hours !== 0 ? `${hours}h ` : ''}${minutes !== 0 ? `${minutes}m` : ''}${seconds !== 0 ? `${seconds}s` : ''}`;
}

// fetches api json
function getWfStatInfo(path) {
  return requestPromise({
    method: 'GET',
    uri: path,
    headers: { 'User-Agent': 'Request-Promise', 'Content-Type': 'application/json' },
    json: true,
  })
    .then((data) => data)
    .catch((err) => {
      // TODO - tell the user something went wrong
      console.error(err);
    });
}

// validates args for a command. args types are given in the command using this method
function validateArgs(args, validArgTypes, argsMap) {
  const returnArgs = { valid: {}, invalid: [] };
  let skipCount = 0;

  args.forEach((arg, i) => {
    // skip the current arg if it was part of an already identified one
    if (skipCount) {
      skipCount -= 1;
      return;
    }
    let isArgValid = false;
    validArgTypes.forEach((argType) => {
      // checks the current arg and the following 2 for cases such as
      // mobile defence, karak wraith blueprint, etc.
      Object.keys(argsMap[argType]).forEach((validArg) => {
        // check if the next 2 words are part of this arg
        if (validArg === (`${args[i]} ${args[i + 1]} ${args[i + 2]}`)) {
          skipCount += 2;
          isArgValid = true;
          if (returnArgs.valid[argType] === undefined) {
            returnArgs.valid[argType] = argsMap[argType][validArg];
          }
          return;
        }
        // check if the next word are part of this arg
        if (validArg === (`${args[i]} ${args[i + 1]}`)) {
          skipCount += 1;
          isArgValid = true;
          if (returnArgs.valid[argType] === undefined) {
            returnArgs.valid[argType] = argsMap[argType][validArg];
          }
          return;
        }
        // check if the current word is the arg
        if (validArg === arg) {
          isArgValid = true;
          if (returnArgs.valid[argType] === undefined) {
            returnArgs.valid[argType] = argsMap[argType][validArg];
          }
        }
      });
    });
    if (!isArgValid) {
      returnArgs.invalid.push(arg);
    }
  });

  return returnArgs;
}

module.exports.dateTimeMsgFormat = dateTimeMsgFormat;
module.exports.timeLeftMsgFormat = timeLeftMsgFormat;
module.exports.getWfStatInfo = getWfStatInfo;
module.exports.valiateArgs = validateArgs;
