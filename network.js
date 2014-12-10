
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
        for(var session_id in msg) {
            if(net.public_id == session_id) {
                // ?
                if(!(session_id in net.gameclient.game.apples)) {
                    net.gameclient.game.apples[session_id] = msg[session_id];
                }
            } else {
                net.gameclient.game.apples[session_id] = msg[session_id];
            }
        }
    });

    net.socket.on('id', function(id){
        net.public_id = id.public_id;
        net.gameclient.game.snake.session_id = id.snake_id;

            console.log('id', id);
        if(id.public_id == id.snake_id) {
            net.gameclient.run_snake();
            console.log('i am snake');
        }
    });

    return this;
}
