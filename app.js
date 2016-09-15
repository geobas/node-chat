// Module dependencies.
var application_root = __dirname;
var express = require('express');

// Get port from environment
var port = process.env.PORT || '3000';

app = express();
server = require('http').createServer(app); // Create HTTP server
app.use(express.static(application_root)); // Where to serve static content

io = require('socket.io').listen(server);

usernames = [];

// connection setup
io.sockets.on('connection', function(socket){

    socket.on('new user', function(data, callback) {
        if(usernames.indexOf(data) != -1){
            callback(false);
        } else {
            callback(true);
            socket.username = data;
            usernames.push(socket.username);
            updateUsernames();
        }
    });

    // update usernames
    function updateUsernames() {
        io.sockets.emit('usernames', usernames);
    }

    // Send Message
    socket.on('send message', function(data) {
        io.sockets.emit('new message', {msg: data, user: socket.username});
    });

    // Disconnect
    socket.on('disconnect', function(data) {
        if(!socket.username) return;
        usernames.splice(usernames.indexOf(socket.username), 1);
        updateUsernames();
    });
});

// home page route
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

// Listen on provided port
server.listen(port, function() {
  console.log('app listening on port ' + port);
});