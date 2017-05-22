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

const http = require("http");
const fs = require("fs");
const game = require(__dirname + "/game.js");

var index = fs.readFileSync("./index.html");
var client_js = fs.readFileSync("./js/client.js");
var images = {
	player_blue : fs.readFileSync("./img/player_blue.png"),
	player_red : fs.readFileSync("./img/player_red.png"),
	tree : fs.readFileSync("./img/tree.png"),
	dirt : fs.readFileSync("./img/dirt.png"),

	weapons : {
		sword : fs.readFileSync("./img/sword.png"),
		sword_attack : fs.readFileSync("./img/sword_attack.png"),
		sword_short : fs.readFileSync("./img/sword_short.png")
	}
};

var my_game = new game.game();

var my_server = http.createServer(function (req, res) {
	if (req.url == "/") {
		res.writeHead(200);
		res.end(index);
	} else if (req.url == "/client.js") {
		res.writeHead(200);
		res.end(client_js);
	} else if (req.url == "/img/sword.png") {
		res.writeHead(200, {"Content-Type" : "image/png"});
		res.end(images.weapons.sword);
	} else if (req.url == "/img/sword_attack.png") {
		res.writeHead(200, {"Content-Type" : "image/png"});
		res.end(images.weapons.sword_attack);
	} else if (req.url == "/img/player_red.png") {
		res.writeHead(200, {"Content-Type" : "image/png"});
		res.end(images.player_red);
	} else if (req.url == "/img/player_blue.png") {
		res.writeHead(200, {"Content-Type" : "image/png"});
		res.end(images.player_blue);
	} else if (req.url == "/img/dirt.png") {
		res.writeHead(200, {"Content-Type" : "image/png"});
		res.end(images.dirt);
	}
});

const io = require("socket.io")(my_server);

io.on("connection", function(socket) {
	console.log("connect");

	socket.on("disconnect", function() {
		console.log("disconnect");
		var pl = my_game.get_player_index_by_socket_id(socket.id);
		if(pl != undefined) {
			my_game.leave(pl);
			io.emit("data", my_game.get_data());
		}
	});

	socket.on("hello", function (data) {
		if (my_game.is_name_allowed(data.name)) {
			my_player = new game.player(socket, data.name, my_game.get_player_id(), (my_game.players.length%2==0) ? 0:1);
			console.log((my_game.players.length%2==0) ? 0:1);
			my_game.players.push(my_player);
			io.emit("data", my_game.get_data());
			console.log("send data, id: " + my_player.player_id);

			my_player.socket.on("move", function(data) {
				var pl = my_game.get_player_by_socket_id(socket.id);
				if(pl) {
					pl.pos.x = data.x;
					pl.pos.y = data.y;
					pl.attack = data.attack;

					for(var i = 0; i < my_game.players.length; i++) {
						if(pl.player_id != my_game.players[i].player_id) {
							if(pl.attack){
								if(pl.attack_dir==0){
									if((my_game.players[i].x>=pl.x+8)&&(my_game.players[i].x<=pl.x+24)&&(my_game.players[i].y+16>=pl.y+9)&&(my_game.players[i].y+16<=pl.y+11))
										my_game.players[i].hp-=3;
								}else{
									if((my_game.players[i].x<=pl.x-8)&&(my_game.players[i].x>=pl.x-24)&&(my_game.players[i].y+16>=pl.y+9)&&(my_game.players[i].y+16<=pl.y+11))
										my_game.players[i].hp-=3;
								}
								console.log(my_game.players[i].hp);
							}
							
							my_game.players[i].socket.emit("moved", {
								player_id : pl.player_id,
								x : data.x,
								y : data.y,
								hp : data.hp,
								attack : data.attack,
								attack_dir : data.attack_dir
							});
						}
					}
				}
			});
		} else {
			socket.emit("kick", {
				reason : "Invalid name"
			})
		}
	});
});

my_server.listen(8080);
console.log("Server running");
