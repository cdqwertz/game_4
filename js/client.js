/*

License for Code
----------------

The MIT License (MIT)

Copyright (c) 2017 cd2 (cdqwertz) <cdqwertz@gmail.com> and Namenlossss

Permission is hereby granted, free of charge, to any person obtaining a copy of this
software and associated documentation files (the "Software"), to deal in the Software
without restriction, including without limitation the rights to use, copy, modify, merge,
publish, distribute, sublicense, and/or sell copies of the Software, and to permit
persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or
substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
DEALINGS IN THE SOFTWARE.

*/

var canvas;
var ctx;
var last_time = 0;

var game_state = 1;
var socket = io();

var players = [];
var local_player = {
	x : 0,
	y : 0,
	name : "",
	speed : 20,
	id : -1
};

var input = {
	up : false,
	down : false,
	left : false,
	right : false
};

function load() {
	canvas = document.getElementById("canvas");
	canvas.width = 300;
	canvas.height = 150;
	ctx = canvas.getContext("2d");

	window.requestAnimationFrame(update);
}

function update(t) {
	var dtime = t - last_time;
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	if(game_state == 0) {
		// move player
		if(input.up) {
			local_player.y -= local_player.speed * (dtime/1000.0);
		}

		if(input.down) {
			local_player.y += local_player.speed * (dtime/1000.0);
		}

		if(input.left) {
			local_player.x -= local_player.speed * (dtime/1000.0);
		}

		if(input.right) {
			local_player.x += local_player.speed * (dtime/1000.0);
		}

		// Placeholder
		ctx.fillRect(local_player.x, local_player.y, 16, 16);
	} else if (game_state == 1) {
		local_player.name = prompt("Enter your nickname");

		socket.emit("hello", {
			name : local_player.name
		});

		game_state = 2;
	} else if (game_state == 2) {

	}

	last_time = t;
	window.requestAnimationFrame(update);
}

// get data (player pos)

socket.on("data", function(data) {
	players = [];
	console.log(JSON.stringify(data));
	for(var i = 0; i < data.length; i++) {
		if (data[i].name == local_player.name) {
			local_player.id = data[i].id
			local_player.x = data[i].pos_x
			local_player.y = data[i].pos_y
		} else {
			players[data[i].id] = {
				x : data[i].pos_x,
				y : data[i].pos_y,
				name : data[i].name,
				id : data[i].id
			};
		}
	}

	if(game_state == 2) {
		game_state = 0;
	}
});

// kick player

socket.on("kick", function(data) {
	game_state = 1;
	alert(data.reason);
});

// input

document.onkeydown = function (e) {
	console.log(e.which);

	if(e.which == 37) {
		input.left = true;
	} else if(e.which == 38) {
		input.up = true;
	} else if(e.which == 39) {
		input.right = true;
	} else if(e.which == 40) {
		input.down = true;
	}
};

document.onkeyup = function (e) {
	console.log(e.which);

	if(e.which == 37) {
		input.left = false;
	} else if(e.which == 38) {
		input.up = false;
	} else if(e.which == 39) {
		input.right = false;
	} else if(e.which == 40) {
		input.down = false;
	}
}
