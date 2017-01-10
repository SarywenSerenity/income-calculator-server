'use strict';

var moment = require('moment');

exports.log = function log(message) {
    console.log(moment().format('MMMM Do YYYY, h:mm:ss a'), message);
}