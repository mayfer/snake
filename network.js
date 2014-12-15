
function Network() {
    var net = this;
    net.gameclient = null;
    net.socket = io();

    net.socket.on('snake', function(msg){
        net.gameclient.render();
        var g = net.gameclient.game;
        g.snake = msg;
    });
    net.socket.on('apples', function(msg){
        net.gameclient.render();
        net.gameclient.game.apples = msg;
    });

    net.socket.on('id', function(id){
        net.public_id = id.public_id;
        net.gameclient.game.snake.session_id = id.snake_id;

    });

    return this;
}
