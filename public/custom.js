var socket = io();
var userName ;

$(document).ready(function () {
	socket = io.connect('http://localhost:2020');
	socket.on('connect', addUser);
	socket.on('updatechat', processMessage);
	socket.on('updateusers', userList);

	$('#datasend').on('click',sendMessage);
	$('#data').keypress(processEnterPress);
	$('#imagefile').on('change', function(e){
		var file = e.originalEvent.target.files[0];
		var reader = new FileReader();
		reader.onload = function(evt){
			socket.emit('user image', evt.target.result);
		};
		reader.readAsDataURL(file);
		$('#imagefile').val('');
	});

	

});
socket.on('imageAdd', function(data, image){
	$('#output')
	.append(
		$('<p class="fileElement">').append($('<b>').text(data + ': '), '<a class="chatLink" target="_blank" href="'+ image +'">'+'<img style="width:200px" class="send-img" src="'+image+'"/></a>'
		)
	);
});

function addUser() {
	userName = prompt("Enter your name: ");
	roomName = prompt('Enter Room');
	socket.emit('adduser', userName, roomName);
}



function processMessage(username, data) {
	$('#output')
	.append(
		$('<p style="background-color:dodgerblue; border-radius:5px; padding:5px; margin-bottom:8px; color:white;">').append($('<b>').text(username +': '), '<span>'+data+'</span>'
		)
	);
}

function userList(data) {
	$('#roomName').text(roomName);
	$('#userlist').empty();
	$.each(data, function (key, value) {
        if (key.endsWith(roomName)) {

            $('#userlist').append('<li style="margin-left:20px" class="userActive">' + value + '</li>');
        }
       
    });
}

function sendMessage() {
	var message = $('#data').val();
	$('#data').val('');
	socket.emit('sendchat', message);
	$('#data').focus();
}

function processEnterPress(e) {
	if (e.which == 13) {
		e.preventDefault();
		$(this).blur();
		$('#datasend').focus().click();
	}
}

