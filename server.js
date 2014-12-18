var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var game = require('./game.js').game;

app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, 'index.html'));
});


setInterval(function(){
    io.sockets.emit('apples', game.apples);
}, 50);


var snake_interval = setInterval(function() {
    var snake_alive = game.move_snake();
    io.sockets.emit('snake', game.snake);

    if(snake_alive == false) {
        console.log('snake died');
        io.sockets.emit('snake_died', {});
        var next = game.apples_list[0];
        var snake_id = game.snake.session_id;
        if(next) {
            game.snake.session_id = next;
            game.remove_apple(next);
            game.add_apple(snake_id);
        } else {
            game.snake.session_id = null;
        }
        game.reset_snake();
    }
}, 200);

var public_ids = {};



io.on('connection', function(socket){
    socket.public_id = hash(socket.id);
    public_ids[socket.public_id] = socket.id;

    // console.log('connected', socket.id, socket.public_id);

    if(game.snake.session_id === null) {
        game.snake.session_id = socket.public_id;
        // console.log("set snake", socket.public_id);
    } else {
        // console.log("added apple", socket.public_id);
        game.add_apple(socket.public_id);
    }
    socket.emit('id', {
        public_id: socket.public_id,
        snake_id: game.snake.session_id,
    });
    socket.emit('apples', game.apples);

    socket.on('disconnect', function () {
        // console.log('disconnected', socket.id, socket.public_id);

        if(game.snake && game.snake.session_id == socket.public_id) {
            // set the snake to the next person
            var next = game.apples_list[0];
            if(next) {
                game.snake.session_id = next;
                game.remove_apple(next);
            } else {
                game.snake.session_id = null;
            }
        } else {
            game.remove_apple(socket.public_id);
            io.sockets.emit('remove_apple', {
                public_id: socket.public_id,
            });
        }
    });

    socket.on('apple_key', function(key){
        if(socket.public_id in game.apples) {
            var apple = game.apples[socket.public_id];
            game.move_apple(apple, key);
            io.sockets.emit('apple', {
                public_id: socket.public_id,
                apple: apple,
            });
        }
    });
    socket.on('snake_key', function(key){
        if(game.snake.session_id == socket.public_id) {
            var prev = game.snake.prev;

            if( !(key == "up" && prev == "down")
            && !(key == "down" && prev == "up")
            && !(key == "right" && prev == "left")
            && !(key == "left" && prev == "right") ) {
                game.snake.next = key;
            }
        }
    });
});


var port = parseInt(process.argv[2]) || 8003;
http.listen(port, function(){
    console.log('listening on *:'+port);
});
app.use(express.static(__dirname));


function hash(s) {
    return s.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);              
}

