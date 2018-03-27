var socket = io();

function scrollToBottom() {
    var messages = jQuery('#messages');
    var newMessage = messages.children('li:last-child');

    var clientHeight = messages.prop('clientHeight');
    var scrollHeight = messages.prop('scrollHeight');
    var scrollTop = messages.prop('scrollTop');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        messages.scrollTop(scrollHeight);
    }


};

socket.on('newMessage', function(message) {
    var { from, text ,createdAt } = message;
    var template = jQuery('#message-template').html();
    var html = Mustache.render(template, {
        text,
        from,
        createdAt
    });

    jQuery('#messages').append(html);
    scrollToBottom();
});

socket.on('newLocationMessage', function(message) {
    var { from, url, createdAt } = message;
    var template = jQuery("#location-message-template").html();
    var html = Mustache.render(template, {
        from,
        createdAt,
        url
    });

    jQuery('#messages').append(html);
    scrollToBottom();
});


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