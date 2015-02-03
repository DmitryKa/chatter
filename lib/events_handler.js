var Message = require('../models/message');
var logger = require('log4js').getLogger('events_handler');
var config = require('../config');

module.exports = function (io) {
    io.on('connection', function (socket) {
        logger.debug('New client connected');
        sendInOutMessage(socket, 'joins');

        Message.find(function(err, messages){
            if(err) {
                logger.error(err);
            } else {
                socket.emit('get history', messages );
            }
        });
        socket.on('new message', function(text) {
            logger.debug('Receive new message: ' + text);
            if(!text) {
                logger.debug('Message text is empty');
                return;
            }

            if(text.charAt(0) == '/') {
                processSystemMessage(socket, text);
            } else {
                processPlainMessage(socket, text);
            }
        });
        socket.on('disconnect', function() {
            logger.debug('Client disconnected');
            sendInOutMessage(socket, 'leaves');
        });
    });
};

function getName (socket) {
    logger.debug('Get name from cookies');
    var name = socket.request.cookies.name;
    logger.debug('Name: ' + name);
    return name;
}
function getColor (socket) {
    logger.debug('Get color from cookies');
    var color = socket.request.cookies.color;
    if(!color) {
        logger.debug('Color is not defined, use default');
        color = config.get('defaultColor');
    }
    logger.debug('Color: ' + color);
    return color;
}

function sendInOutMessage(socket, status) {
    var message = 'User ' + getName(socket) + ' ' + status;
    var systemMessage = { text: message};
    socket.broadcast.emit('system message', systemMessage);
}

function processPlainMessage(socket, text) {
    var name = getName(socket);
    if(name == null) return;

    var messageColor = getColor(socket);

    var message = new Message({name: name, text: text, color: messageColor});
    message.save(function (err) {
        if (err) {
            logger.error(err);
        } else {
            logger.debug('Retranslate received message');
            socket.broadcast.emit('common message', message);
            socket.emit('common message', message);
            logger.debug('Message retranslated ');
        }
    });
}

function processSystemMessage(socket, text) {
    var words = text.split(' ');
    var command = words[0].toLowerCase().substring(1, words[0].length);
    switch (command) {
        case 'color':
            if(words[1].match('#[a-fA-F0-9]{6}')) {
                var newColor = words[1];
                socket.request.cookies['color'] = newColor;
                socket.emit('system message', { text: 'Color updated: ' + newColor });
            } else {
                socket.emit('system message', { text: 'Invalid syntax, read /help' });
            }
            break;
        case 'name':
            socket.emit('system message', { text: 'Command not implemented yet: ' + text });
            break;
        case 'help':
            socket.emit('system message', { text: 'Command not implemented yet: ' + text });
            break;
        default:
            socket.emit('system message', { text: 'Command not found: ' + text });
    }
}