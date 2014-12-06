(function(snake){

    snake.settings = {
        height: 400,
        width: 600,
    }

    snake.grid = {
        size: 15,
    }

    snake.snake = null;
    snake.apples_list = [];
    snake.apples = {
    };

    snake.calculate_ball = function() {
        var s = snake.settings;

        snake.last_timestamp = current_timestamp;

    }

    snake.remove_apple = function(public_id) {
        delete snake.apples[public_id];
        var i = snake.apples_list.indexOf(public_id);
        if(i != -1) {
            snake.apples_list.splice(i, 1);
        }
    }

})(typeof snake === 'undefined'? this['snake']={}: snake);
