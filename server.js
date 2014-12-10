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
    io.sockets.emit('snake', game.snake);
}, 50);

setInterval(function(){
    io.sockets.emit('apples', game.apples);
}, 50);
    

io.on('connection', function(socket){
    socket.public_id = hash(socket.id);
    console.log('connected', socket.id, socket.public_id);

    if(game.snake.session_id === null) {
        game.snake.session_id = socket.public_id;
        console.log("set snake", socket.public_id);
    } else {
        console.log("added apple", socket.public_id);
        game.add_apple(socket.public_id);
    }
    socket.emit('id', {
        public_id: socket.public_id,
        snake_id: game.snake.session_id,
    });

    socket.on('disconnect', function () {
        console.log('disconnected', socket.id, socket.public_id);
        if(game.snake && game.snake.session_id == socket.public_id) {
            // set the snake to the next person
            var next = game.apples_list[0];
            if(next) {
                game.snake.session_id = next;

                // remove the apple who became the snake
                game.remove_apple(next);
                console.log('set the next snake to', next);
            } else {
                game.snake.session_id = null;
                console.log('removed snake');
            }
        } else {
            game.remove_apple(socket.public_id);
            console.log('removed apple', socket.public_id);
        }
    });

    socket.on('snake', function(snake){
        game.snake = snake;
    });
    socket.on('key', function(key){

        if(socket.public_id in game.apples) {
            var apple = game.apples[socket.public_id];
            game.move(apple, key);
        } else if(game.snake.session_id == socket.public_id) {
            game.move(game.snake, key);
            game.update_snake_tail(key);
        }
    });
    socket.on('next_key', function(key){
        game.snake.next = key;
    });
});

http.listen(8003, function(){
    console.log('listening on *:8003');
});
app.use(express.static(__dirname));


function hash(s) {
    return s.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);              
}

