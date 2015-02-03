var Message = require('../models/message');
var logger = require('log4js').getLogger('events_handler');

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

function sendInOutMessage(socket, status) {
    var message = 'User ' + getName(socket) + ' ' + status;
    var systemMessage = { text: message};
    socket.broadcast.emit('system message', systemMessage);
}

function processPlainMessage(socket, text) {
    var name = getName(socket);
    if(name == null) return;

    var message = new Message({name: name, text: text});
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
    socket.emit('system message', { text: 'Command not found' });
}