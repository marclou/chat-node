var socket = io();

socket.on('connect', function() {
    console.log('connected !');
});

socket.on('disconnect', function() {
    console.log('disconnected..');
});

socket.on('newMessage', function(message) {
    const { from, text } = message;
    const li = jQuery('<li></li>');

    li.text(`${from} : ${text}`);

    jQuery('#messages').append(li);
});


jQuery('#message-form').on('submit', function(e) {
    e.preventDefault();

    socket.emit('createMessage', {
        from: 'User',
        text: jQuery('[name=message]').val(),
        createdAt: new Date().getTime()
    });
});
