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
const { generateMessage, generateLocationMessage } = require('./utils/message.js');

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('New user connected');

    socket.emit('newMessage', generateMessage('Admin', 'Welcome on chat app!'));
    socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined !'))

    socket.on('createMessage', (message) => {
        io.emit('newMessage', generateMessage(message.from, message.text));
    });

    socket.on('createLocationMessage', (coords) => {
        io.emit('newLocationMessage', generateLocationMessage('Admin', coords.lat, coords.lng));
    });

    io.on('disconnect', () => {
        console.log('User disconnected');
    })
});

server.listen(port, () => {
    console.log('Listen on port '+port);
});
