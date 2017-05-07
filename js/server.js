const http = require("http");
const fs = require('fs');

const map = {
	width : 50,
	height : 50,
	data : []
}

var index = fs.readFileSync("./index.html")
var client_js = fs.readFileSync("./js/client.js")

var my_server = http.createServer(function (req, res) {
	if (req.url == "/") {
		res.writeHead(200);
		res.end(index);
	} else if (req.url == "/client.js") {
		res.writeHead(200);
		res.end(client_js);
	}
})

my_server.listen(8080);
console.log("Server running");
