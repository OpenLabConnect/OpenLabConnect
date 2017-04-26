'use strict';

/**
 * Convert from HEX to ASCII
 * @param  {String} hexa Hex string
 * @return {String} Ascii string
 */
exports.hexToAscii = function(hexa) {
  var hex = hexa.toString(); //force conversion
  var str = '';
  for (var i = 0; i < hex.length; i += 2) {
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  }
  return str;
};