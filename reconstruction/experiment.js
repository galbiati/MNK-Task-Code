var table = "reconstruction";
var blocks = reconstruction;
var current_block = 0;

// Launch!

$(document).ready(function() {
	$('html').on('contextmenu', function(e) { e.preventDefault(); });
	current_block = 0;
	$('#submit').hide();
	$('#score-row').hide();
	$(".indicator").css("color","#FFFFFF");
	instructions = new Instructions();
	instructions.run_block();
	board = new Board();
	board.create_tiles();
})
