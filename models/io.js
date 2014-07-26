var socketio = require('socket.io');
var dateformat = require('dateformat');

//mongoose
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var UserSchema = new Schema({
  type: String,
  user: String,
  value: String,
  time: Date
});
/*
var MessageScheme = new Schema({
  channel_id: Number,
  type: String,
  user: String,
  value: String,
  time: Date,
});
*/
mongoose.model('User', UserSchema);
//mongoose.model('Message', MessageScheme);
mongoose.connect('mongodb://localhost/chocochat');
var User = mongoose.model('User');
//var MessageModel = mongoose.model('Message');

module.exports = io;

function io(server) {

  // Socket.IO
  var sio = socketio.listen(server);
//  sio.set('transports', [ 'websocket' ]);

  // 接続
  sio.sockets.on('connection', function(socket) {
    console.log("conntected");
    User.find(function(err, docs) {
      //console.log(docs);
      docs.forEach(function(doc) {
        console.log(doc);
        socket.emit('recieve', {
          type : doc.type,
          user : doc.user,
          value : doc.value,
          time : doc.time,
        });
      });
    });

    // 通知受信
    socket.on('notice', function(data) {
      var user = new User();
      user.type = data.type;
      user.user = data.user;
      user.value = data.value;
      user.time = new Date();
      user.save(function(err) {
      if (err) {
         console.log(err); }
      });
      // すべてのクライアントへ通知を送信
      // ブロードキャスト
      socket.broadcast.emit('recieve', {
        type : data.type,
        user : data.user,
        value : data.value,
        time : dateformat(new Date(), 'yyyy-mm-dd HH:MM:ss'),
      });
    });

    // 切断
    socket.on("disconnect", function() {
    });
  });
}
