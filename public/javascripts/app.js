var server_address = location.href;
var socket = io.connect(server_address);

socket.on('get history', function (history) {
    var messages = $('#messages');
    for(var i in history) {
        messages.append(buildCommonMessageNode(history[i]));
    }
    scrollToBottom(messages);
});

socket.on('common message', function (message) {
    var messages = $('#messages');
    messages.append(buildCommonMessageNode(message));
    scrollToBottom(messages);
});

socket.on('system message', function(message) {
    var messages = $('#messages');
    messages.append(buildSystemMessageNode(message));
    scrollToBottom(messages);
});

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
    return '<div><span class="cmn-msg-name" style="color: ' + message.color + '">' + message.name + ':</span> ' +
        message.text + '</div>';
}

function buildSystemMessageNode(message) {
    return '<div class="sys-msg">' + message.text + '</div>';
}

function scrollToBottom(element) {
    element.animate({ scrollTop: element[0].scrollHeight}, 'slow');
}