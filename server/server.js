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
        from: 'Admin',
        text: 'Welcome on chat app bro ;)'
    });
    socket.broadcast.emit('newMessage', {
        from: 'Admin',
        text: 'New user joined!'
    })

    socket.on('createMessage', (message) => {
        io.emit('newMessage', {
            from: message.from,
            text: message.text,
            createdAt: new Date().getTime()
        });
    });

    io.on('disconnect', () => {
        console.log('User disconnected');
    })
});

server.listen(port, () => {
    console.log('Listen on port '+port);
});
