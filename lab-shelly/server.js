'use strict';

const Client = require('./model/client');
const net = require('net');
const EE = require('events').EventEmitter;
const ee = new EE();
const server = net.createServer();
const PORT = process.env.PORT || 3000;
const pool = [];

// set up emitters
ee.on('default', (client, string) => {
  client.socket.write(`Not a valid command: ${string.split(' ', 1)}\n`);
});

ee.on('@all', (client, string) => {
  pool.forEach(c => c.socket.write(`${client.nickName}: ${string}`));
});

ee.on('@nick', (client, string) => {
  //grab current nickName and assigning to variable of old name before changing
  let oldNickName = client.nickName;
  client.nickName = string;
  pool.forEach(c => c.socket.write(`${oldNickName} changed nickname to: ${client.nickName}\n`));
});
// ee.on('error', (err) => {
//   console.error('whoops! there was an error');
// });
ee.on('@dm', (client, string) => {
  // client.nickName = string;
  let dmNickName = string.split(' ').shift().trim();
  let dmMessage = string.split(' ').slice(1).join(' ');
  pool.forEach(function(c) {
    if(dmNickName === c.nickName) {
      c.socket.write(`${client.nickName}: ${dmMessage}`);
    }
  });
});

server.on('connection', function(socket) {

  //instantiate a new client
  let client = new Client(socket);
  pool.push(client);
  pool.forEach(c => c.socket.write(`${client.nickName} has connected!\n`));

  socket.on('data', data => {
    //split turns string into array by the space
    //shift() returns the first item of an array
    //trim() removes whitespace from both sides
    //grabs first text or command and removes everything else
    let command = data.toString().split(' ').shift().trim();

    if(command.startsWith('@all')) {
      console.log(data.toString().split(' ').slice(1).join(' '));
      //slice(1) removes the first index item
      //join returns it back into string
      //this removes the @all from message and converts back to string
      //command = @all
      ee.emit(command, client, data.toString().split(' ').slice(1).join(' '));
      return;
    }

    if(command.startsWith('@nick')) {
      // console.log(data.toString().split(' ').slice(1).join(' '));
      // let newNick = data.toString().split(' ').slice(1).shift().trim();
      // console.log(newNick);
      //slice(1) removes the first index item
      //join returns it back into string
      //this removes the @all from message and converts back to string
      //command = @all
      ee.emit(command, client, data.toString().split(' ').slice(1).shift().trim());
      return;
    }

    if(command.startsWith('@dm')) {
      console.log(data.toString().split(' ').slice(1).join(' '));
      ee.emit(command, client, data.toString().split(' ').slice(1).join(' '));
      return;
    }

    ee.emit('default', client, data.toString());
  });
//close event to remove from client pool
  socket.on('close', () => {
    pool.splice(pool.indexOf(client),1);
    let leftUser = client.nickName;
    console.log(leftUser + ' has left the chat');
    return;
  });
//how do you replicate this?
  socket.on('error', (err) => {
    console.error('There was an error!', err);
  });

});

server.listen(PORT, () => console.log(`Listening on: ${PORT}`));
