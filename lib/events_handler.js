var Message = require('../models/message');

module.exports = function (io) {
    io.on('connection', function (socket) {
        sendInOutMessage(socket, 'joins');

        Message.find(function(err, messages){
            socket.emit('get history', messages );
        });
        socket.on('new message', function(text) {
            if(!text) return;
            var name = getName(socket);

            var message = new Message({ name: name, text: text });
            message.save(function (err) {
                if(err) {
                    console.log(err);
                }
                socket.broadcast.emit('update history', message);
                socket.emit('update history', message);
            });

        });
        socket.on('disconnect', function() {
            sendInOutMessage(socket, 'leaves');
        });
    });
};

function getName (socket) {
    var escapedName = socket.handshake.headers.cookie.match(/name=((\w+(%20)*)+)(;|$)/)[1];
    return decodeURIComponent(escapedName);
}

function sendInOutMessage(socket, status) {
    var message = '"' + getName(socket) + '" ' + status;
    var systemMessage = { name: 'System', text: message};
    socket.broadcast.emit('update history', systemMessage);
}