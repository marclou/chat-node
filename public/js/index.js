var socket = io();

socket.on('newMessage', function(message) {
    var { from, text ,createdAt } = message;
    var li = jQuery('<li></li>');

    li.text(`${from} ${createdAt} : ${text}`);

    jQuery('#messages').append(li);
});

socket.on('newLocationMessage', function(message) {
    var { from, url, createdAt } = message;
    var li = jQuery('<li></li>');
    var a = jQuery('<a target="_blank"> My current location </a>');

    li.text(`${from} ${createdAt}: `);
    a.attr('href', url);
    li.append(a);
    jQuery('#messages').append(li);
})


jQuery('#message-form').on('submit', function(e) {
    e.preventDefault();
    var messageTextBox = jQuery('[name=message]');

    socket.emit('createMessage', {
        from: 'User',
        text: messageTextBox.val(),
        createdAt: new Date().getTime()
    }, function() {
        messageTextBox.val('');
    });
});


// Location stuffs
var locationButton = jQuery('#send-location');

locationButton.on('click', function() {
	if (!navigator.geolocation) {
		return alert('Not supported by your browser..');
	}

    locationButton.attr('disabled', 'disabled').text('Sending...');

	navigator.geolocation.getCurrentPosition(emitLocation, errorLocation, locationOptions);
});


function emitLocation(location) {
    locationButton.removeAttr('disabled').text('Send Location');
    socket.emit('createLocationMessage', {
        lat: location.coords.latitude,
        lng: location.coords.longitude
    });
};

function errorLocation() {
    locationButton.removeAttr('disabled').text('Send Location');
    return alert('Can not fetch location');
};

var locationOptions = {
  enableHighAccuracy: false,
  timeout: 7000,
  maximumAge: 10000
};
