
function Network() {
    var net = this;
    net.gameclient = null;
    net.socket = io();

    net.socket.on('snake', function(msg){
        net.gameclient.game.snake = msg;
        net.gameclient.render();
    });
    net.socket.on('apples', function(msg){
        net.gameclient.game.apples = msg;
        net.gameclient.render();
    });
    net.socket.on('apple', function(msg){
        net.gameclient.game.apples[msg.public_id] = msg.apple;
        net.gameclient.render();
    });
    net.socket.on('remove_apple', function(msg){
        delete net.gameclient.game.apples[msg.public_id];
        net.gameclient.render();
    });

    net.socket.on('id', function(id){
        net.public_id = id.public_id;
        net.gameclient.game.snake.session_id = id.snake_id;

    });

    return this;
}
