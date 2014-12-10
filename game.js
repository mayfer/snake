(function(game){

    game.grid = {
        height: 56,
        width: 84,
        block_size: 4,
    }

    game.move = function(object, key) {
        if(key == "up") {
            object.y -= 1;
        } else if(key == "down") {
            object.y += 1;
        } else if(key == "left") {
            object.x -= 1;
        } else if(key == "right") {
            object.x += 1;
        }
        var width = game.grid.width / game.grid.block_size;
        var height = game.grid.height / game.grid.block_size;

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

    game.snake = {
        session_id: null,
        tail: [],
        length: 5,
        x: 5,
        y: 5,
        next: null,
    };
    game.apples_list = [];
    game.apples = {
    };

    game.update_snake_tail = function() {
        if(game.snake.tail.length == game.snake.length) {
            game.snake.tail.shift();
        }
        game.snake.tail.push({x: game.snake.x, y: game.snake.y})
    }
    game.grow_snake_tail = function() {
        game.snake.lwngth += 1;
    }

    game.add_apple = function(public_id, x, y) {
        if(x == undefined || y == undefined) {
            x = 10;
            y = 10;
        }
        game.apples[public_id] = {
            x: x,
            y: y,
        }
        game.apples_list.push(public_id);
    }

    game.remove_apple = function(public_id) {
        delete game.apples[public_id];
        var i = game.apples_list.indexOf(public_id);
        if(i != -1) {
            game.apples_list.splice(i, 1);
        }
    }
    game.move_snake = function() {
        var key = game.snake.next;
        var snake = game.snake;
        game.move(snake, key);
        game.update_snake_tail(key);
    }

})(typeof game === 'undefined'? this['game']={}: game);
