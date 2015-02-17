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

socket.on('changeCookies', function (changes) {
    $.cookie(changes.key, changes.value);
});

socket.on('setName', function(newName) {
    $('#name').text(newName.name);
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
    return '<div><span class="cmn-msg-name" style="color: ' + message.color + '">' +
        message.name.replace(/(.{30}).+/, '$1...') + ' (' + formatTimestamp(message.date) + '):</span> ' +
        message.text + '</div>';
}

function buildSystemMessageNode(message) {
    return '<div class="sys-msg">' + message.text + '</div>';
}

function scrollToBottom(element) {
    element.animate({scrollTop: element[0].scrollHeight}, 'slow');
}

function formatTimestamp(datetimeString) {
    datetime = new Date(datetimeString);
    var time = [datetime.getHours(), datetime.getMinutes(), datetime.getSeconds()];
    for(var i = 0; i < time.length; i++) { if(time[i] < 10) time[i] = '0' + time[i]; }
    return time[0] + ':' + time[1] + ':' + time[2];
}