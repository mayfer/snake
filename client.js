function SnakeClient(context, snake, socket, cursors_context) {
    var sc = this;
    sc.context = context;
    sc.cursors_context = cursors_context;
    sc.socket = socket;
    sc.snake = snake;

    var calc_offset = function(e){
        sc.canvas_offset = $('#container').offset();
    }
    calc_offset();
    $(window).resize(calc_offset);

    sc.init = function() {
        $(document).on('key', function(e) {
            sc.socket.emit('key', sc.cursor);
        });

        return sc;
    }


    sc.draw_snake = function() {
        var ctx = sc.context;
        ctx.fillStyle = "#333333";
        if(snake.snake) {
            ctx.fillRect(
                snake.snake.x * snake.grid.size,
                snake.snake.y * snake.grid.size,
                snake.grid.size,
                snake.grid.size
            );
        }
    }

    sc.draw_apples = function() {
        var ctx = sc.context;
        ctx.fillStyle = "#ffffff";
        for(var sid in snake.apples) {
            var apple = snake.apples[sid];
            ctx.fillRect(
                apple.x * snake.grid.size,
                apple.y * snake.grid.size,
                snake.grid.size,
                snake.grid.size
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
