var server_address = 'http://localhost:3000';
var socket = io.connect(server_address);

socket.on('get history', function (history) {
    console.log(history);
    for(var i in history) {
        $('#messages').append(buildMessageNode(history[i]));
    }
});

socket.on('update history', function (message) {
    $('#messages').append(buildMessageNode(message));
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

function buildMessageNode(message) {
    return '<div><span>' + message.name + ':</span> ' + message.message + '</div>';
}