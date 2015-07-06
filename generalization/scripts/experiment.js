/* General ToDo:

need to fix when new AI conditions start so that they don't end up with white first (not a concern for now!)

eventually, these conditions should be able to be called with arguments for values like duration, whether it is a time
or finite trial, specific lists of positions or opponents, and so on. I'd also like to create a super-general template
condition.

want to change ALL conditions to switch between time duration or ntrials easily

Instructions:

AI:
AFC:
EVAL:
- Implement new selections
*/

var M = 9,
	N = 4,
	K = 4,
	game_index = 0,
	response = 99,
	timestamp = Date.now(),
	ajax_data = {},
	ajax_freq = 1000;


var table = "generalization";
var current_block = 0;

// Experiments
var eye_tracking = [new Eye_Calibration(), 
				new Condition_AI(20),
				new Eye_Calibration(), 
				new Condition_AFC2(), 
				new End_Message()]

var generalization = [ new Condition_AI(30), new Condition_AFC2(), new Condition_Evaluation(), new End_Message()]

var blocks = generalization

// Launch!

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
