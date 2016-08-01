var table = "reconstruction";
var blocks = memtask;
var current_block = 0;
instCal = instCal2;

// Launch!

$(document).ready(function() {
	$('html').on('contextmenu', function(e) { e.preventDefault(); });
	current_block = 0;
	$('#submit').hide();
	$('#score-row').hide();
	$(".indicator").css("color","#FFFFFF");
	instructions = new Instructions(inst2);
	instructions.run_block();
	board = new Board();
	board.create_tiles();
})
