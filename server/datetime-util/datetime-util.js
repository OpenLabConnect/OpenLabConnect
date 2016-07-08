'use strict';

const DateFormat = require('dateformat');
const Format = 'dd/mm/yyyy';
const ISOFormat = 'yyyy-mm-dd';

// Convert datetime object to timestamp
function convertToTimestamp (objDate) {
  var timestamp;
  if (objDate instanceof Date)
    { timestamp = objDate.getTime(); }
  else if (typeof(objDate) == 'string') {
    // Check date is invalid Date
    var date = new Date(objDate);
    timestamp = isNaN(date.getDate()) ? parseInt(objDate) : date.getTime();
  } else if (isNaN(objDate))
    { timestamp = null; }
  return timestamp;
}
// Convert date time to UTC
exports.toUTC = function (objDate) {
  let timestamp = convertToTimestamp(objDate);
  // Get UTC string from timestamp
  let utc = new Date(timestamp).toUTCString();
  // Remove time GMT
  let date = utc.split(' ').slice(0, 4).join(' ');
  return DateFormat(date, Format);
};

exports.toGMT = function (objDate) {
  let timestamp = convertToTimestamp(objDate);
  return DateFormat(parseInt(timestamp), Format);
};
// Format: yyyy-mm-dd
exports.toISO = function (objDate) {
  let timestamp = convertToTimestamp(objDate);
  return DateFormat(parseInt(timestamp), ISOFormat);
};