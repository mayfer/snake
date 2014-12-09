function SnakeClient(context, snake, network, cursors_context) {
    var sc = this;
    sc.context = context;
    sc.cursors_context = cursors_context;
    sc.network = network;
    sc.socket = network.socket;
    sc.snake = snake;

    sc.grid_size = context.width / snake.grid.width;
    sc.pixel_size = 4;

    var calc_offset = function(e){
        sc.canvas_offset = $('#container').offset();
    }
    calc_offset();
    $(window).resize(calc_offset);

    sc.move = function(key) {
        if(sc.network.public_id in sc.snake.apples) {
            var object = sc.snake.apples[sc.network.public_id];
        } else if(sc.snake.snake.session_id == sc.network.public_id) {
            var object = sc.snake.snake;
        }
        if(key == "up") {
            object.y -= 1;
        } else if(key == "down") {
            object.y += 1;
        } else if(key == "left") {
            object.x -= 1;
        } else if(key == "right") {
            object.x += 1;
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
                    sc.socket.emit('key', arrow);
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


        return sc;
    }


    sc.draw_snake = function() {
        var ctx = sc.context;
        ctx.fillStyle = "rgba(50, 50, 50, 0.8)";
        if(snake.snake) {
            ctx.fillRect(
                snake.snake.x * sc.grid_size * sc.pixel_size,
                snake.snake.y * sc.grid_size * sc.pixel_size,
                sc.grid_size * sc.pixel_size,
                sc.grid_size * sc.pixel_size
            );
        }
    }

    sc.draw_apples = function() {
        var ctx = sc.context;
        ctx.fillStyle = "rgba(50, 50, 50, 0.8)";
        for(var sid in snake.apples) {
            var apple = snake.apples[sid];
            ctx.fillRect(
                apple.x * sc.grid_size * sc.pixel_size,
                apple.y * sc.grid_size * sc.pixel_size,
                sc.grid_size * sc.pixel_size,
                sc.grid_size * sc.pixel_size
            );
        }
    }

    sc.frame = 0;

    sc.render = function() {
        var ctx = sc.context;
        ctx.clearRect(0, 0, ctx.width, ctx.height);
        sc.draw_snake();
        sc.draw_apples();

        window.requestAnimFrame(sc.render);
    }

    sc.move_snake = function(x, y) {
        sc.snake.snake.x = x;
        sc.snake.snake.y = y;
    }

    sc.set_snake = function(snake) {
        sc.snake.snake = snake;
    }
    sc.set_apples = function(apples) {
        sc.snake.apples = apples;
    }

    return sc;
}
