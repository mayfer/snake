(function(snake){

    snake.settings = {
        height: 400,
        width: 600,
    }

    snake.grid = {
        height: 48,
        width: 84,
    }

    snake.snake = null;
    snake.apples_list = [];
    snake.apples = {
    };

    snake.calculate_ball = function() {
        var s = snake.settings;

        snake.last_timestamp = current_timestamp;

    }

    snake.add_apple = function(public_id, x, y) {
        if(x == undefined || y == undefined) {
            x = 10;
            y = 10;
        }
        snake.apples[public_id] = {
            x: x,
            y: y,
        }
        snake.apples_list.push(public_id);
    }

    snake.remove_apple = function(public_id) {
        delete snake.apples[public_id];
        var i = snake.apples_list.indexOf(public_id);
        if(i != -1) {
            snake.apples_list.splice(i, 1);
        }
    }

})(typeof snake === 'undefined'? this['snake']={}: snake);
