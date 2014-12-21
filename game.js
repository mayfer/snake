(function(game){

    game.grid = {
        height: 56,
        width: 84,
        block_size: 4,
    }

    game.snake = {
        session_id: null,
        tail: [],
        length: 2,
        x: Math.floor(Math.random() * game.grid.width / game.grid.block_size),
        y: Math.floor(Math.random() * game.grid.height / game.grid.block_size),
        next: "up",
        prev: null,
    };
    game.apples_list = [];
    game.apples = {
        '0': {
            x: Math.floor(Math.random() * game.grid.width / game.grid.block_size),
            y: Math.floor(Math.random() * game.grid.height / game.grid.block_size),
        }
    };

    game.update_snake_tail = function() {
        if(game.snake.tail.length == game.snake.length) {
            game.snake.tail.shift();
        }
        game.snake.tail.push({x: game.snake.x, y: game.snake.y});
    }
    game.grow_snake_tail = function() {
        game.snake.length += 1;
    }

    game.add_apple = function(public_id, x, y) {
        if(x == undefined || y == undefined) {
            // random spot for the apple, repeat until it's off the snake
            var on_snake = true;
            while(on_snake == true) {
                x = Math.floor(Math.random() * game.grid.width / game.grid.block_size);
                y = Math.floor(Math.random() * game.grid.height / game.grid.block_size);
                var tail = game.snake.tail;
                on_snake = false;
                for(var i=0; i < tail.length; i++) {
                    if(tail[i].x == x && tail[i].y == y) {
                        on_snake = true;
                    }
                }
            }
        }
        game.apples[public_id] = {
            x: x,
            y: y,
        }
        if(public_id != '0') {
            game.apples_list.push(public_id);
        }
    }

    game.remove_apple = function(public_id) {
        delete game.apples[public_id];
        var i = game.apples_list.indexOf(public_id);
        if(i != -1) {
            game.apples_list.splice(i, 1);
        }
    }

    game.reset_snake = function() {
        game.snake.x = 10;
        game.snake.y = 10;
        game.snake.tail = [];
        game.snake.length = 2;
    }

    game.move_object = function(object, direction) {
        if(direction == "up") {
            object.y -= 1;
        } else if(direction == "down") {
            object.y += 1;
        } else if(direction == "left") {
            object.x -= 1;
        } else if(direction == "right") {
            object.x += 1;
        }

        var width = game.grid.width / game.grid.block_size;
        var height = game.grid.height / game.grid.block_size;

        // wrap around
        if(object.x < 0) {
            object.x = width + object.x;
        } else if(object.x >= width) {
            object.x = object.x % width;
        }
        if(object.y < 0) {
            object.y = height + object.y;
        } else if(object.y >= height) {
            object.y = object.y % height;
        }
    }

    game.move_snake = function() {
        var next = game.snake.next;
        var snake = game.snake;

        var snake_alive = true;

        if(next) {
            game.move_object(snake, next);

            // if there is a tail already in that position kill the snake
            for(var i=0; i<game.snake.tail.length; i++) {
                var tail = game.snake.tail[i];
                if(snake.x == tail.x && snake.y == tail.y) {
                    var snake_alive = false;
                }
            }
            game.update_snake_tail();
            game.snake.prev = game.snake.next;

            for(var id in game.apples) {
                var apple = game.apples[id];
                if(snake.x == apple.x && snake.y == apple.y) {
                    game.eat_apple(id);
                }
            }
        }
        return snake_alive;
    }

    game.eat_apple = function(id) {
        game.remove_apple(id);
        game.add_apple(id);
        game.grow_snake_tail();
    }

    game.move_apple = function(apple, key) {
        game.move_object(apple, key);
    }

})(typeof game === 'undefined'? this['game']={}: game);
