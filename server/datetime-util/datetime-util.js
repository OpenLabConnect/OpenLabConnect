'use strict';

const DateFormat = require('dateformat');
const UTCFormat = 'dd/mm/yyyy';
const ISOFormat = 'yyyy-mm-dd';

// Convert datetime object to timestamp
function convertToTimestamp (objDate) {
  var timestamp;
  if (objDate instanceof Date)
    { timestamp = objDate.getTime(); }
  else if (typeof(objDate) == 'string') {
    // Check date is invalid Date
    var dateElements = objDate.split('/');
    var date = new Date(dateElements[1] + '/' + dateElements[0] + '/' + dateElements[2]);
    timestamp = isNaN(date.getDate()) ? parseInt(objDate) : date.getTime();
  } else if (isNaN(objDate))
    { timestamp = null; }
    else {
      timestamp = objDate;
    }
  return timestamp;
}
// Convert date time to UTC
exports.toUTC = function (objDate) {
  let timestamp = convertToTimestamp(objDate);
  // Get UTC string from timestamp
  let utc = new Date(timestamp).toUTCString();
  // Remove time GMT
  let date = utc.split(' ').slice(0, 4).join(' ');
  return DateFormat(date, UTCFormat);
};

exports.toGMT = function (objDate) {
  let timestamp = convertToTimestamp(objDate);
  return DateFormat(parseInt(timestamp), UTCFormat);
};
// Format: yyyy-mm-dd
exports.toISO = function (objDate) {
  let timestamp = convertToTimestamp(objDate);
  return DateFormat(parseInt(timestamp), ISOFormat);
};