'use strict';

const Client = require('.model/client');
const net = require('net');
const EE = require('events').EventEmitter;
const ee = new EE();
const server = net.createServer();
const PORT = process.env.PORT || 3000;
const pool = [];

server.on('connection', socket => {
  let client = new Client(socket);
  pool.push(client);
  pool.forEach(c => c.socket.write(`${client.userName} has connected!\n`));

  socket.on('data', data => {
    let command = data.toString().split('').shift().trim();
    if(command.startsWith('/all')) {
      ee.emit(command, client, data.toString().split(' ').slice(1).join(' '));
      return;
    }

    ee.emit('default', client, data.toString());

  });

});

server.listen(PORT, () => console.log(`Listening on: ${PORT}`));
