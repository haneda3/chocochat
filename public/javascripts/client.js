var socket = io.connect();

socket.on('connect', function() {
  emit('login');
});

socket.on('disconnect', function(client) {
});

socket.on('recieve', function(data) {
  addChat(data);
});

function addChat(data) {
  var item = $('<li>').append($('<small>').append(data.time));

  if (data.type === 'login') {
    item.addClass('alert alert-success').append($('<div>').append(data.user + 'がログインしました'));
  } else if (data.type === 'logout') {
    item.addClass('alert alert-danger').append($('<div>').append(data.user + 'がログアウトしました'));
  } else if (data.type === 'chat') {
    var msg = data.value.replace(/[!@$%<>'"&|]/g, '');
    item.addClass('well well-sm').append($('<div>').text(msg)).children('small').prepend(data.user + '：');
  } else {
    item.addClass('alert alert-danger').append($('<div>').append('不正なメッセージを受信しました'));
  }

  $('#chat-area').prepend(item).hide().fadeIn(800);
}

function emit(type, msg) {
  socket.emit('notice', {
    type : type,
    user : $('#username').val(),
    value : msg,
  });
}

function sendMessage() {
  var msg = $('#message').val();
  $('#message').val("");
  emit('chat', msg);

  var data = new Object;
  data.type = 'chat';
  data.user = $('#username').val();
  data.time = new Date();
  data.value = msg;
  addChat(data);
}

$(document).ready(function() {
  $(window).on('beforeunload', function(e) {
    emit('logout');
  });

  $('#send').click(sendMessage);
});
