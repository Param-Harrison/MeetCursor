/*
 * Serve content over a socket
 */

var usernames = {}, conversation = [], time;

module.exports = function (socket, io) {
  socket.on('adduser', function(data) {
    if(isEmpty(usernames)) {
      time = (new Date()).getTime();
    }
  	socket.username = data.name;
  	if(!usernames[data.name]) { 
      usernames[data.name] = {};
      var initial = data.name.split(' ');
      if(initial.length > 1) initial = initial[0][0] + initial[1][0];
      else initial = initial[0][0];
      usernames[data.name].initial = initial;
  	  usernames[data.name].name = data.name;
    }
  	usernames[data.name].pos = data.pos;
	  io.sockets.emit('updateusers', usernames);
  });

  socket.on('addChat', function(data) {
    if(data.text)
      conversation.push(data);
    io.sockets.emit('updateCoverso', conversation);
  });

  socket.on('StartTime', function() {
    io.sockets.emit('StartTime', { 'time': time.toString(), 'currenttime': (new Date()).getTime().toString() });
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', function() {
    delete usernames[socket.username];
    io.sockets.emit('updateusers', usernames);
  });

  socket.on('disconnectuser', function() {
    socket.disconnect();
  });
};

function isEmpty(obj) {
  for(var prop in obj) {
    if(obj.hasOwnProperty(prop))
      return false;
  }
  return true;
}