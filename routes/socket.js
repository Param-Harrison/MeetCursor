/*
 * Serve content over a socket
 */

module.exports = function (socket, io, usernames, conversation) {
  socket.on('adduser', function(data) {
  	socket.username = data.name;
  	usernames[data.name] = {};
    var initial = data.name.split(' ');
    if(initial.length > 1) initial = initial[0][0] + initial[1][0];
    else initial = initial[0][0];
    usernames[data.name].initial = initial;
  	usernames[data.name].name = data.name;
  	usernames[data.name].pos = data.pos;
	  io.sockets.emit('updateusers', usernames);
  });

  socket.on('addChat', function(data) {
    conversation.push(data);
    io.sockets.emit('updateCoverso', conversation);
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', function() {
    delete usernames[socket.username];
    io.sockets.emit('updateusers', usernames);
  });
};