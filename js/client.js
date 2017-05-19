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
	speed : 30,
	speed_run : 40,
	id : -1,
	team : -1,

	attack : false,
	attack_dir : 0
};

var input = {
	up : false,
	down : false,
	left : false,
	right : false,
	run : false
};

var images = {
	player_red : new Image(),
	player_blue : new Image(),
	sword : new Image()
};

images.player_red.src = "/img/player_red.png";
images.player_blue.src = "/img/player_blue.png";
images.sword.src = "/img/sword.png";

function load() {
	canvas = document.getElementById("canvas");
	canvas.width = 640;
	canvas.height = 320;
	ctx = canvas.getContext("2d");

	window.requestAnimationFrame(update);
}

function update(t) {
	var dtime = t - last_time;
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	if(game_state == 0) {
		if(input.up || input.down || input.left || input.right) {
			// move player
			var my_speed = (input.run ? local_player.speed_run : local_player.speed);

			if(input.up) {
				local_player.y -= my_speed * (dtime/1000.0);
			}

			if(input.down) {
				local_player.y += my_speed * (dtime/1000.0);
			}

			if(input.left) {
				local_player.x -= my_speed * (dtime/1000.0);
			}

			if(input.right) {
				local_player.x += my_speed * (dtime/1000.0);
			}

			socket.emit("move", {
				x : local_player.x,
				y : local_player.y
			});
		}

		draw_player(local_player);

		// draw other players
		for(var i = 0; i < players.length; i++) {
			if (players[i]) {
				if(players[i].team == 0) {
					ctx.drawImage(images.player_blue, Math.round(players[i].x), Math.round(players[i].y));
				} else if(players[i].team == 1) {
					ctx.drawImage(images.player_red, Math.round(players[i].x), Math.round(players[i].y));
				}

				// draw weapon
				ctx.drawImage(images.sword, Math.round(players[i].x) + 8, Math.round(players[i].y) - 2);
			}
		}
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

// used to draw player

function draw_player(pl) {
	ctx.translate(Math.round(pl.x), Math.round(pl.y));

	// flip player
	if(pl.attack_dir == 1) {
		ctx.translate(16, 0);
		ctx.scale(-1, 1);
	}

	// draw player
	if(pl.team == 0) {
		ctx.drawImage(images.player_blue, 0, 0);
	} else if (pl.team == 1) {
		ctx.drawImage(images.player_red, 0, 0);
	}

	// undo transformations
	if(pl.attack_dir == 1) {
		ctx.scale(-1, 1);
		ctx.translate(-16, 0);
	}

	ctx.translate(-Math.round(pl.x), -Math.round(pl.y));

	// draw weapon
	ctx.translate(Math.round(pl.x) + 8, Math.round(pl.y) - 2);

	if(pl.attack_dir == 1) {
		ctx.scale(-1, 1);
	}

	ctx.drawImage(images.sword, 0, 0);

	if(pl.attack_dir == 1) {
		ctx.scale(-1, 1);
	}

	ctx.translate(-(Math.round(pl.x) + 8), -(Math.round(pl.y) - 2));
}

// get data (player pos, ids, ...)
// when a new player joins the game

socket.on("data", function(data) {
	players = [];
	for(var i = 0; i < data.length; i++) {
		if (data[i].name == local_player.name) {
			local_player.id = data[i].id
			local_player.x = data[i].pos_x
			local_player.y = data[i].pos_y
			local_player.team = data[i].team
		} else {
			players[data[i].id] = {
				x : data[i].pos_x,
				y : data[i].pos_y,
				name : data[i].name,
				id : data[i].id,
				team : data[i].team
			};
		}
	}

	if(game_state == 2) {
		game_state = 0;
	}
});

socket.on("moved", function (data) {
	// set new pos
	players[data.player_id].x = data.x;
	players[data.player_id].y = data.y;
})

// kick player

socket.on("kick", function(data) {
	game_state = 1;
	alert(data.reason);
});

// input

document.onkeydown = function (e) {
	if(e.which == 37 || e.which == 65) {
		input.left = true;
	} else if(e.which == 38 || e.which == 87) {
		input.up = true;
	} else if(e.which == 39 || e.which == 68) {
		input.right = true;
	} else if(e.which == 40 || e.which == 83) {
		input.down = true;
	} else if (e.which == 16) {
		input.run = true;
	}
};

document.onkeyup = function (e) {
	if(e.which == 37 || e.which == 65) {
		input.left = false;
	} else if(e.which == 38 || e.which == 87) {
		input.up = false;
	} else if(e.which == 39 || e.which == 68) {
		input.right = false;
	} else if(e.which == 40 || e.which == 83) {
		input.down = false;
	} else if (e.which == 16) {
		input.run = false;
	}
};

document.onmousedown = function(event) {
	var x = event.pageX / (window.innerWidth/640);
	//var y = event.pageY / canvas.style.height;
	local_player.attack_dir = (x > local_player.x ? 0 : 1);
	local_player.attack = true;
}

document.onmouseup = function(event) {
	local_player.attack = false;
}
