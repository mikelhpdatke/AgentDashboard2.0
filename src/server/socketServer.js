const net = require('net');
const utils = require('./utils');

let clients = require('./clients.json');

net
  .createServer(socket => {
    socket.name = `${socket.remoteAddress}:${socket.remotePort}`;

    const newClient = {
      socket,
      address: socket.name,
      ip: socket.remoteAddress,
      port: socket.remotePort,
      active: true,
      currentTask: null,
    };

    socket.on('data', data => {
      const task = null;
      message = utils.storeData();
    });

    socket.on('end', () => {
      for (let i = 0; i < clients.length; i++) {
        if (clients[i].socket === socket) {
          clients[i].active = false;
          clients[i].socket = null;
        }
      }
    });

    clients = utils.addClient(clients, newClient);

    send_cmd(socket.name, '1', '1');

    function broadcast(message, sender) {
      clients.forEach(client => {
        if (client === sender) {
          return;
        }
        client.write(message);
      });
      process.stdout.write(message);
    }
  })
  .listen(8888);

function send_cmd(socket_name, task, message) {
  let client = null;
  for (let i = 0; i < clients.length; i++) {
    const socket = clients[i];
    if (socket.address == socket_name) {
      client = socket.socket;
      clients[i].currentTask = task;
      break;
    }
  }
  client.write(message);
}

function getClients() {
  return clients;
}

console.log('Chat server running at port 8888\n');
