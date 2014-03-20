/*
 * Serve content over a socket
 */

module.exports = function (socket, io, usernames) {
  socket.on('adduser', function(data) {
  	socket.username = data.name;
  	usernames[data.name] = {};
  	usernames[data.name].name = data.name;
  	usernames[data.name].pos = data.pos;
	io.sockets.emit('updateusers', usernames);
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', function() {
    delete usernames[socket.username];
    io.sockets.emit('updateusers', usernames);
  });
};