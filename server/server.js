'use strict'

const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');

const app = express();
const publicPath = path.join(__dirname, '..', '/public');
const port = process.env.PORT || '3000';
const server = http.createServer(app);
const io = socketIO(server);
const { Users } = require('./utils/users');
const { generateMessage, generateLocationMessage } = require('./utils/message.js');
const { isRealString } = require('./utils/validation');
const users = new Users();

app.use(express.static(publicPath));

io.on('connection', (socket) => {


    socket.on('join', (params, callback) => {
        const { name, room } = params;

        if (!isRealString(name) || !isRealString(name)) {
            return callback('Name and room are required');
        }
        socket.join(room);
        users.removeUser(socket.id);
        users.addUser(socket.id, name, room);

        io.to(room).emit('updateUserList', users.getUserList(room));
        socket.emit('newMessage', generateMessage('Admin', `Welcome on room ${room}`));
        socket.broadcast.to(room).emit('newMessage', generateMessage('Admin', `${name} jas joined.`));
        callback();
    });

    socket.on('createMessage', (message, callback) => {
        io.emit('newMessage', generateMessage(message.from, message.text));
        callback();
    });

    socket.on('createLocationMessage', (coords) => {
        io.emit('newLocationMessage', generateLocationMessage('Admin', coords.lat, coords.lng));
    });

    socket.on('disconnect', () => {
        const user = users.removeUser(socket.id);
        const { room, name } = user;

        if(user) {
            console.log(user);
            io.to(room).emit('updateUserList', users.getUserList(room));
            io.to(room).emit('newMessage', generateMessage('Admin', `${name} has left.`));
        }
    })
});

server.listen(port, () => {
    console.log('Listen on port '+port);
});
