var Message = require('../models/message');

module.exports = function (io) {
    io.on('connection', function (socket) {
        sendInOutMessage(socket, 'joins');

        Message.find(function(err, messages){
            if(err) {
                console.log(err);
            } else {
                socket.emit('get history', messages );
            }
        });
        socket.on('new message', function(text) {
            if(!text) return;
            var name = getName(socket);
            if(name == null) return;

            var message = new Message({ name: name, text: text });
            message.save(function (err) {
                if(err) {
                    console.log(err);
                } else {
                    socket.broadcast.emit('common message', message);
                    socket.emit('common message', message);
                }
            });

        });
        socket.on('disconnect', function() {
            sendInOutMessage(socket, 'leaves');
        });
    });
};

function getName (socket) {
    var match = socket.handshake.headers.cookie.match(/name=((\w+(%20|.)*)+)(;|$)/);
    if (match == null) return null;
    var escapedName = match[1];
    return decodeURIComponent(escapedName);
}

function sendInOutMessage(socket, status) {
    var message = 'User ' + getName(socket) + ' ' + status;
    var systemMessage = { text: message};
    socket.broadcast.emit('system message', systemMessage);
}