
function Network() {
    var net = this;
    net.game = null;
    net.socket = io();

    net.socket.on('snake', function(msg){
        net.game.set_snake(msg);
    });
    net.socket.on('apples', function(msg){
        net.game.set_apples(msg);
    });

    net.socket.on('public_id', function(public_id){
        net.public_id = public_id;
    });

    return this;
}
