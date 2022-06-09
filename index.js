var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io')(server);

app.use(express.static(__dirname +'/public'));

var usernames = {};

io.sockets.on('connection', function (socket) {
	 
	 socket.on('user image', function (data) {
        socket.broadcast.emit('imageAdd', socket.username, data);
    });

	socket.on('sendchat', function (data) {
		io.sockets.in(socket.room).emit('updatechat', socket.username, data);
	});

	socket.on('adduser', function (username , roomname) {

        socket.join(roomname);
        socket.room = roomname;
     socket.username = username;
     
        usernames[username+'_'+roomname] = username;
 socket.emit('updatechat', 'SERVER', 'you have connected --- '+ username );
     socket.broadcast.to(socket.room).emit('updatechat', 'SERVER'
 , username + ' has connected');
     io.sockets.in(socket.room).emit('updateusers', usernames);
 });

	socket.on('disconnect', function(){
		delete usernames[socket.username];
		io.sockets.emit('updateusers', usernames);
		socket.broadcast.emit('updatechat', 'SERVER'
		, socket.username + ' has disconnected');
	});
});




app.get('/', function(req, res){
	res.sendFile(__dirname+'/public/index.html');
});

server.listen(2020, function(){
	console.log('Server running at port 2020');
});