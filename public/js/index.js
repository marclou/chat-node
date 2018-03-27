var socket = io();

socket.on('connect', function() {
    console.log('connected !');
});

socket.on('disconnect', function() {
    console.log('disconnected..');
});

socket.on('newMessage', function(message) {
    var { from, text } = message;
    var li = jQuery('<li></li>');

    li.text(`${from} : ${text}`);

    jQuery('#messages').append(li);
});

socket.on('newLocationMessage', function(message) {
    var { from, url } = message;
    var li = jQuery('<li></li>');
    var a = jQuery('<a target="_blank"> My current location </a>');

    li.text(`${from}: `);
    a.attr('href', url);
    li.append(a);
    jQuery('#messages').append(li);
})


jQuery('#message-form').on('submit', function(e) {
    e.preventDefault();

    socket.emit('createMessage', {
        from: 'User',
        text: jQuery('[name=message]').val(),
        createdAt: new Date().getTime()
    });
});

var locationButton = jQuery('#send-location');

locationButton.on('click', function() {
	if (!navigator.geolocation) {
		return alert('Not supported by your browser..');
	}

	navigator.geolocation.getCurrentPosition(emitLocation, errorLocation, locationOptions);
});


function emitLocation(location) {
    socket.emit('createLocationMessage', {
        lat: location.coords.latitude,
        lng: location.coords.longitude
    });
};

function errorLocation() {
    return alert('Can not fetch location');
};

var locationOptions = {
  enableHighAccuracy: false,
  timeout: 7000,
  maximumAge: Infinity
};
