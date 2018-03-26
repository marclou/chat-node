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

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('New user connected');

    socket.emit('newMessage', {
        createdAt: 123,
        from: 'Server',
        text: 'Ohoh'
    });

    socket.on('createMessage', (message) => {
        console.log(message);
    });

    io.on('disconnect', () => {
        console.log('User disconnected');
    })
});

server.listen(port, () => {
    console.log('Listen on port '+port);
});
