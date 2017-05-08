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

module.exports = {
	chunk : function () {

	},

	player : function (socket, name) {
		this.socket = socket;
		this.hp = 100;
		this.name = name;
		this.pos = {
			x : 0,
			y : 0
		};
	},

	game : function () {
		this.map = {
			width : 50,
			height : 50,
			data : []
		};

		this.players = [];

		this.get_data = function(my_player) {
			data = [];
			for(var i = 0; i < this.players.length; i++) {
				var p = this.players[i];
				data.push({
					pos_x : p.pos.x,
					pos_y : p.pos.y,
					name : p.name
				});
			}

			return data;
		};
	}
};
