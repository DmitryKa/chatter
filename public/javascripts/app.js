var server_address = 'http://localhost:3000';
var socket = io.connect(server_address);

socket.on('get history', function (history) {
    console.log(history);
    for(var i in history) {
        $('#messages').append(buildCommonMessageNode(history[i]));
    }
});

socket.on('common message', function (message) {
    $('#messages').append(buildCommonMessageNode(message));
})

socket.on('system message', function(message) {
    $('#messages').append(buildSystemMessageNode(message));
})

function sendByEnter(event) {
    if (event.keyCode == 13) {
        sendMessage();
    }
}

function sendMessage() {
    var message = $('#newMessage').val();
    if(!message) return;

    socket.emit('new message', message );
    $('#newMessage').val('');
}

function buildCommonMessageNode(message) {
    return '<div><span>' + message.name + ':</span> ' + message.text + '</div>';
}

function buildSystemMessageNode(message) {
    return '<div>' + message.text + '</div>';
}