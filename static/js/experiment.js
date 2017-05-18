var table = "generalization";
var blocks = [new Demo(60)];
var current_block = 0;

// Launch!

$(document).ready(function() {
	current_block = 0;
	
	board = new Board();
	board.create_tiles()
	player = new Player();
	player.initials = Date.now();
	track_mouse(player);
	blocks[current_block].run_block()
})
