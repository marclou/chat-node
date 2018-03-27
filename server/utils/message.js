const moment = require('moment');

const generateMessage = (from, text) => {
    return {
        from,
        text,
        createdAt: moment().format('h:mm a')
    };
};

const generateLocationMessage = (from, lat, lng) => {
    return {
        from,
        url: `https://google.com/maps?q=${lat},${lng}`,
        createdAt: moment().format('h:mm a')
    };
};

module.exports = {
    generateMessage,
    generateLocationMessage
};
