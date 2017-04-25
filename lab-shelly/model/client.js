'use strict';

const uuidV4 = require('uuid/v4');

// socket will house information every time data is emitted
module.exports = function(socket) {
  this.socket = socket;
  this.userName = uuidV4();
  this.nickName = `guest-${Math.floor(Math.random()*20 + 1)}`;
};
