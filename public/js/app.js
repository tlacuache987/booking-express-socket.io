$(document).ready(function() {
	var welcome = function(msj) {
		$("#welcomeMsg").text(msj);
	};

	var isSelectDraw = false;

	var drawSelect = function(stock) {
		$("#frutasSelect").empty();

		var $select = $("<select>").attr("name", "frutasSelect");

		stock.frutas.forEach(function(entry) {
			var $op = $("<option>").attr("value", entry.fruta).text(entry.fruta);

			$select.append($op);

			$("#frutasSelect").append($select);
		});
		isSelectDraw = true;
	};

	var drawStock = function(stock) {
		$("#stock tbody").empty();

		var i = 1;
		stock.frutas.forEach(function(entry) {

			var $tr = $("<tr>");

			var $td = $("<td>").text(entry.fruta);
			$tr.append($td);

			$td = $("<td>").text(entry.cantidad);
			$tr.append($td);

			if (i % 2 == 0)
				$tr.addClass('alt');

			$("#stock tbody").append($tr);
			i++;
		});

	};

	var socket = io();

	$("#buyBtn").on('click', function(event) {
		event.preventDefault();
		sendEvent('buy');
	});

	$("#sellBtn").on('click', function(event) {
		event.preventDefault();
		sendEvent('sell');
	});

	var sendEvent = function(event) {
		var value = $("#cantidadTxt").val().trim();
		
		if(value===""||isNaN(value)){
			alertify.alert("Please enter a integer number.");
			$("#cantidadTxt").val("")
		}else{
			socket.emit(event, {
				fruta : $("#frutasSelect option:selected").text(),
				cantidad : value
			});
		}
	};

	socket.on('welcome', function(data) {
		welcome(data.msj);

		drawStock(data.stock);

		drawSelect(data.stock);
	});

	socket.on('repaintStock', function(data) {
		drawStock(data.stock);
	});

}); 