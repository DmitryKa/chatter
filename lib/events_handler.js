module.exports = function (io) {
    var history = [];
    io.on('connection', function (socket) {
        socket.emit('get history', history );
        socket.on('new message', function(message) {
            if(!message) return;
            var name = socket.handshake.headers.cookie.match(/name=((\w+(%20)*)+)(;|$)/)[1];
            name = decodeURIComponent(name);

            var message = { name: name, message: message };
            history.push(message);

            socket.broadcast.emit('update history', message);
            socket.emit('update history', message);
        })
    });
}
