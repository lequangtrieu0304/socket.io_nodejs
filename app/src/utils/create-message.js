const formatTime = require('date-format');

const createdMessage = (messageText) => {
    return {
        messageText,
        createdAt: formatTime("dd/MM/yyyy - hh:mm:ss", new Date()),
    }
}

module.exports = {
    createdMessage
}