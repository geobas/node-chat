$(function(){
    var socket = io.connect();
    var $messageForm = $('#messageForm');
    var $message = $('#message');
    var $chat = $('#chatWindow');
    var $usernameForm = $('#usernameForm');
    var $users = $('#users')
    var $username = $('#username');
    var $error = $('#error');

    Cookies.remove('username');

    $usernameForm.submit(function(e){
        e.preventDefault();
        if ( $username.val().length > 0 ) {
            Cookies.set('username', $username.val(), { expires: 7, path: '' });
            socket.emit('new user', $username.val(), function(data){
                if(data){
                    $('#namesWrapper').hide();
                    $('#mainWrapper').show();
                } else {
                    $error.show();
                    $error.html('Username is already taken');
                }
            });
            $username.val('');
        } else {
            $error.show();
            $error.html('No username given.');
        }
    });

    socket.on('usernames', function(data){
        var html = '';
        var username = Cookies.get('username');
        var current = false;
        for(i = 0; i < data.length; i++){
            if ( username != undefined && data[i] == username )
                html += '<p class="current">' + data[i] + '</p>';
            else
                html += '<p>' + data[i] + '</p>';
        }
        $users.html(html);

    })

    $messageForm.submit(function(e){
        e.preventDefault();
        if ( $message.val().length > 0 ) {
            socket.emit('send message', $message.val());
            $message.val('');
        }
    });

    socket.on('new message', function(data){
        $chat.append('<strong>'+ data.user + '</strong>: '+data.msg+'<br/>');
    });
});