/* General ToDo:

need to fix when new AI conditions start so that they don't end up with white first (not a concern for now!)

eventually, these conditions should be able to be called with arguments for values like duration, whether it is a time
or finite trial, specific lists of positions or opponents, and so on. I'd also like to create a super-general template
condition.

want to change ALL conditions to switch between time duration or ntrials easily

Instructions:

AI:
- BIG CHANGE: save board state for each move BEFORE adding move to board state
  This should make data analysis much easier.
AFC:
EVAL:
- Waiting on new position selections
*/

var M = 9,
	N = 4,
	K = 4,
	game_index = 0,
	response = 99,
	timestamp = Date.now(),
	ajax_data = {},
	ajax_freq = 1000;


var table = "debug"; // options: debug, raw_data, eyelink_pilot
var current_block = 0;
var blocks = [new Eye_Calibration, new Condition_AI(20), new Condition_AFC2(), new Condition_AFCn(), new End_Message()]

$(document).ready(function() {
	current_block = 0;
	$(".indicator").css("color","#FFFFFF");
	$(".scorebox").animate({backgroundColor:"#FFFFFF", color:"#FFFFFF", borderColor:"#FFFFFF"}, 0);
	$(".eval-element").css("opacity", 0);
	$('input[name="radio"]').off('click').attr('disabled', true).css("cursor", "none");
	instructions = new Instructions();
	instructions.run_block();
	board = new Board();
	board.create_tiles();
})
