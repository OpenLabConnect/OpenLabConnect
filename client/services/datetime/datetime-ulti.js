'use strict';
angular.module('openAim')
  .factory('DateTimeUtil', function() {
    return {
      toUTC: function(dateTime) {
        // Get timeStamp from dateTime
        dateTime = dateTime instanceof Date ? dateTime.getTime() : dateTime;
        // Get the time difference between UTC time and local time, in minutes
        // Convert timezoneOffset from minutes to milisecond
        var timezoneOffset = new Date().getTimezoneOffset() * 60 * 1000;
        var modifyTime = dateTime - timezoneOffset; // subtract the time difference
        return modifyTime;
      }
    };
  });
