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

var my_game = new game.game();

var my_server = http.createServer(function (req, res) {
	if (req.url == "/") {
		res.writeHead(200);
		res.end(index);
	} else if (req.url == "/client.js") {
		res.writeHead(200);
		res.end(client_js);
	}
});

const io = require("socket.io")(my_server);

io.on("connection", function(socket) {
	console.log("connect");

	socket.on("disconnect", function() {
		console.log("disconnect");
		//TODO: remove player
	});

	socket.on("hello", function (data) {
		if (my_game.is_name_allowed(data.name)) {
			my_game.players.push(new game.player(socket, data.name, my_game.players.length));
			io.emit("data", my_game.get_data());
			console.log("send data");
		} else {
			socket.emit("kick", {
				reason : "Invalid name"
			})
		}
	})
});

my_server.listen(8080);
console.log("Server running");
