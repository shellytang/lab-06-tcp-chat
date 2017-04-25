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

// ee.emit(command, client, data.toString().split(' ').slice(1).join(' '));

ee.on('@all', (client, string) => {
  pool.forEach(c => c.socket.write(`${client.nickName}: ${string}`));

});

// ee.on('error', (err) => {
//   console.error('whoops! there was an error');
// });


// 192.168.1.9

server.on('connection', function(socket) {

  //instantiate a new client
  let client = new Client(socket);
  pool.push(client);
  pool.forEach(c => c.socket.write(`${client.nickName} has connected!\n`));

  socket.on('data', data => {
    //split turns string into array by the space
    //shift() returns the first item of an array
    //trim() removes whitespace from both sides
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

    ee.emit('default', client, data.toString());
  });

// error event handler
  // socket.on('error', function(error){
  //   throw error;
  // });

});

server.listen(PORT, () => console.log(`Listening on: ${PORT}`));
