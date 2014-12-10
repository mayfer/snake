
function Network() {
    var net = this;
    net.gameclient = null;
    net.socket = io();

    net.socket.on('snake', function(msg){
        var g = net.gameclient.game;
        if(net.public_id == g.snake.session_id) {
            // ?
        } else {
            g.snake = msg;
        }
    });
    net.socket.on('apples', function(msg){
        net.gameclient.game.apples = msg;
    });

    net.socket.on('public_id', function(public_id){
        net.public_id = public_id;
    });

    return this;
}
