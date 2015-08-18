var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use('/static', express.static('public'));

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/views/app.html');
});

var stock = {
	frutas : [{
		fruta : 'apple',
		cantidad : 110
	}, {
		fruta : 'pineapple',
		cantidad : 210
	}, {
		fruta : 'lemon',
		cantidad : 310
	}, {
		fruta : 'banana',
		cantidad : 410
	}, {
		fruta : 'melon',
		cantidad : 510
	}, {
		fruta : 'watermelon',
		cantidad : 610
	}, {
		fruta : 'pear',
		cantidad : 710
	}]
};

io.on('connection', function(socket) {

	console.log('usuario conectado');

	socket.emit('welcome', {
		msj : 'Welcome!',
		stock : stock
	});

	socket.on('buy', function(data) {
		broadcastStock('buy', data);

	});

	socket.on('sell', function(data) {
		broadcastStock('sell', data);
	});

	socket.on('disconnect', function() {
		console.log('usuario desconectado');
	});

});

var broadcastStock = function(action, data) {
	refreshStock(action, data);

	io.sockets.emit('repaintStock', {
		stock : stock
	});
};

var refreshStock = function(action, data) {
	stock.frutas.forEach(function(item) {
		if (data.fruta === item.fruta) {
			item.cantidad = (action === 'sell') ? item.cantidad - Math.abs(parseInt(data.cantidad)) : item.cantidad + Math.abs(parseInt(data.cantidad));
			return false;
		}
	});
};

http.listen(5000, function() {
	console.log('server start on http://localhost:5000');
});
