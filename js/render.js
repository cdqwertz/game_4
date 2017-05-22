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

var renderer = new function() {
	this.objects = [];

	this.push = function(image, x, y) {
		this.objects.push({
			img : image,
			x : x,
			y : y
		});
	};


	this.render = function() {
		for (var i = 0; i < this.objects.length; i++) {
			var j = i + 1;
			while (j < this.objects.length && this.objects[i].y < obj[j].y) {
				var a = this.objects[j];
				this.objects[j] = this.objects[i];
				this.objects[i] = this.objects[j];
			}
		}

		for (var i = 0; i < this.objects.length; i++) {
			var obj = this.objects[i];
			ctx.drawImage(obj.img, obj.x, obj.y);
		}

		this.objects = [];
	};
}();
