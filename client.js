function SnakeClient(context, game, network, cursors_context) {
    var sc = this;
    sc.context = context;
    sc.cursors_context = cursors_context;
    sc.network = network;
    sc.socket = network.socket;
    sc.game = game;

    sc.grid_size_x = context.width / game.grid.width;
    sc.grid_size_y = context.height / game.grid.height;

    var calc_offset = function(e){
        sc.canvas_offset = $('#container').offset();
    }
    calc_offset();
    $(window).resize(calc_offset);

    sc.move = function(key) {
        if(sc.network.public_id in sc.game.apples) {
            var apple = sc.game.apples[sc.network.public_id];
            if(key == "up") {
                apple.y -= 1;
            } else if(key == "down") {
                apple.y += 1;
            } else if(key == "left") {
                apple.x -= 1;
            } else if(key == "right") {
                apple.x += 1;
            }
            sc.socket.emit('apple_key', key);
        } else if(sc.game.snake.session_id == sc.network.public_id) {
            sc.game.snake.next = key;
            sc.socket.emit('snake_key', key);
        }
    }

    sc.init = function() {
        var arrow_keys = {
            38: 'up',
            40: 'down',
            37: 'left',
            39: 'right',
        }
        var arrow_key_states = {
            38: false,
            40: false,
            37: false,
            39: false,
        }
        $(document).keydown(function(e) {
            var keycode = e.which;

            if(keycode in arrow_keys) {
                e.preventDefault();
                if(arrow_key_states[keycode] == false) {
                    var arrow = arrow_keys[keycode];
                    sc.move(arrow);
                    arrow_key_states[keycode] = true;
                }
            }

        });
        $(document).keyup(function(e) {
            var keycode = e.which;

            if(keycode in arrow_keys) {
                arrow_key_states[keycode] = false;
            }
        });

        // sc.run_snake();

        return sc;
    }

    sc.i_am_the_snake = function() {
        return sc.game.snake.session_id == sc.network.public_id;
    }

    sc.draw_snake = function() {
        var ctx = sc.context;
        ctx.fillStyle = "rgba(50, 50, 50, 0.8)";
        if(sc.game.snake) {
            for(var i=0; i<sc.game.snake.tail.length; i++) {
                var coordinate = sc.game.snake.tail[i];
                ctx.fillRect(
                    coordinate.x * sc.grid_size_x * sc.game.grid.block_size,
                    coordinate.y * sc.grid_size_y * sc.game.grid.block_size,
                    sc.grid_size_x * sc.game.grid.block_size,
                    sc.grid_size_y * sc.game.grid.block_size
                );
            }
        }
    }

    sc.draw_apples = function() {
        var ctx = sc.context;
        ctx.fillStyle = "rgba(50, 50, 50, 0.8)";
        ctx.strokeSize = 4;

        var offsets = [
            {x: 1, y: 0},
            {x: 1, y: 2},
            {x: 0, y: 1},
            {x: 2, y: 1},
        ];
        var pixel_size_x = sc.grid_size_x * sc.game.grid.block_size / 3;
        var pixel_size_y = sc.grid_size_y * sc.game.grid.block_size / 3;

        for(var sid in sc.game.apples) {
            var apple = sc.game.apples[sid];
            for(var i=0; i<offsets.length; i++) {
                var offset = offsets[i];
                ctx.fillRect(
                    apple.x * sc.grid_size_x * sc.game.grid.block_size + pixel_size_x * offset.x,
                    apple.y * sc.grid_size_y * sc.game.grid.block_size + pixel_size_y * offset.y,
                    pixel_size_x,
                    pixel_size_y
                );
            }
        }
    }

    sc.frame = 0;

    sc.render = function() {
        var ctx = sc.context;
        ctx.clearRect(0, 0, ctx.width, ctx.height);
        sc.draw_snake();
        sc.draw_apples();

        //window.requestAnimFrame(sc.render);
    }

    return sc;
}
