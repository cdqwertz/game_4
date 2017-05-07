var http = require("http");
const mapWidth=150;
const mapHeight=100;
var grid[mapWidth][mapHeight];

function gameStarted(){
	
}

var my_server = http.createServer(function (request, res) {
	res.writeHead(200);
	res.end("Hello World");
	res.sendFile(__dirname + '/../index.html');
	
});
function processReq(){
	
}
my_server.listen(8080);
console.log("Server running");
