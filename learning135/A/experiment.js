var table = "learningA";
var blocks = learning.odd;
var current_block = 0;
var MoveSound = new buzz.sound("../../_shared/sounds/stone3.ogg");
// Launch!

$(document).ready(function() {
	current_block = 0;
	$(".indicator").css("color","#FFFFFF");
	$(".scorebox").animate({backgroundColor:"#FFFFFF", 
		color:"#FFFFFF", 
		borderColor:"#FFFFFF"}, 0);
	$(".eval-element").css("opacity", 0);
	$('input[name="radio"]').off('click').attr('disabled', true).css("cursor", "none");
	instructions = new Instructions();
	instructions.run_block();
	board = new Board();
	board.create_tiles();
})