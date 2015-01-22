module.exports = function (io) {
    var history = [];
    io.on('connection', function (socket) {
        sendInOutMessage(socket, 'joins');

        socket.emit('get history', history );
        socket.on('new message', function(message) {
            if(!message) return;
            var name = getName(socket);

            var message = { name: name, message: message };
            history.push(message);

            socket.broadcast.emit('update history', message);
            socket.emit('update history', message);
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
    var systemMessage = { name: 'System', message: message};
    socket.broadcast.emit('update history', systemMessage);
}