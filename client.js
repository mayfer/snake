function SnakeClient(context, game, network, shadow_context) {
    var sc = this;
    sc.context = context;
    sc.shadow_context = shadow_context;
    sc.network = network;
    sc.socket = network.socket;
    sc.game = game;

    sc.offset = 10;
    sc.width = context.width - sc.offset * 2;
    sc.height = context.height - sc.offset * 2;

    sc.grid_size_x = sc.width / game.grid.width;
    sc.grid_size_y = sc.height / game.grid.height;

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


        var ctx = sc.context;
        ctx.fillStyle = "rgb(57, 60, 58)";
        ctx.fillRect(0, 0, ctx.width, sc.grid_size_y);
        ctx.fillRect(0, sc.grid_size_y, sc.grid_size_x, ctx.height);
        ctx.fillRect(5, ctx.height - sc.grid_size_y, ctx.width, sc.grid_size_y);
        ctx.fillRect(ctx.width - sc.grid_size_x, sc.grid_size_y, sc.grid_size_x, ctx.height - 2*sc.grid_size_y);

        ctx.translate(10, 10);

        return sc;
    }

    sc.i_am_the_snake = function() {
        return sc.game.snake.session_id == sc.network.public_id;
    }

    sc.draw_snake = function() {
        var ctx = sc.context;
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
        ctx.clearRect(0, 0, sc.width, sc.height);
        sc.draw_snake();
        sc.draw_apples();

        var snapshot = ctx.getImageData(0, 0, ctx.width*2, ctx.height*2);
        sc.shadow_context.putImageData(snapshot, 0, 0);
        //window.requestAnimFrame(sc.render);
    }

    return sc;
}
