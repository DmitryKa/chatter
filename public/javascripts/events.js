var server_address = 'http://localhost:3000';
var socket = io.connect(server_address);

socket.on('get history', function (history) {
    $('#messages').val(history);
});

socket.on('update history', function (message) {
    $('#messages').val($('#messages').val() + message);
})

function send_by_enter(event) {
    if (event.keyCode == 13) {
        send_message();
    }
}

function send_message() {
    var message = $('#newMessage').val();
    socket.emit('new message', message );
    $('#newMessage').val('');
}