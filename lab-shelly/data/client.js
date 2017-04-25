'use strict';

const uuid = require('node-uuid');

// module.exports = function(socket) {
//   this.socket = socket;
//   this.nickName = uuid.v4();
//   this.userName = `${Math.random()}`;
// };


module.exports = function(socket){
  this.socket = socket;
  this.nickname = `${Math.random()}`;
  this.userName = uuidV4();
};
