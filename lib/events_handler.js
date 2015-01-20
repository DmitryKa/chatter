module.exports = function (io) {
    var history = "";
    io.on('connection', function (socket) {
        socket.emit('get history', history );
        socket.on('new message', function(message) {
            var name = socket.handshake.headers.cookie.match(/name=((\w+(%20)*)+)(;|$)/)[1];
            name = decodeURIComponent(name);
            var full_message = name + ': ' + message + '\n';
            history = history + full_message;
            socket.broadcast.emit('update history', full_message);
            socket.emit('update history', full_message);
        })
    });
}
