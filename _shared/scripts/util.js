var win_color = "#22ddaa",
	MoveSound = new buzz.sound("../_shared/sounds/stone3.ogg"),
	square_bkgcolor = "#999999",
	square_highlight = "#bbbbbb";

/* instruction and consent html strings */

instAI = "<p class='instructions-text'>You will now play the game against a computer opponent.<br><br>In the picture below, there is a blank game board. Above the board there is a message that shows you when it is your turn and when your opponent is thinking. When it is your turn, you can make a move by clicking the square where you would like to place your piece. You and your opponent will take turns going first. After every game, the computer will change its settings.</p><img src='../_shared/images/AI_demo.png'></img>"
instTimedAI = "<p class='instructions-text'>You will now play the game against a computer opponent.<br><br>You will start with a blank game board as depicted below. Above the board, there will be a message that shows when it is your turn and when your opponent is thinking. When it is your turn, you can make a move by clicking on the square where you would like to place your piece. You have limited time to make each move. You can see the timer to the right of the board.<br><br>In different games, the time limit will be <b style='color:red'>5</b>, <b style='color:blue'>10</b>, or <b style='color:green'>20</b> seconds per move. If you run out of time, you lose the game! You and your opponent will take turns going first. After every game, the computer settings will change.</p><img src='../_shared/images/timed_ai_demo.png'></img>"
instAFC = "<p class='instructions-text'>You will now be shown a board and asked to choose one of two moves. The <b>only</b> possible choices are indicated by a dotted outline of a piece. The color of the dotted outlines, as well as a message above the board, will indicate what color you are currently playing.<br><br>The picture below shows an example. As it says above the board, you are playing Black. To make a choice, click on one of the squares with the dotted outline.</p><img src='../_shared/images/AFC_demo.png'></img>";
instEVAL = '<p class="instructions-text">You will now be shown a board and asked to judge your chances of winning. It is <b>always your turn</b>, and the message above the board will tell you what color you are playing.<br><br>The picture below shows an example. As it says above the board, you are playing White. Below the board is a row of buttons, labeled <b>Losing</b> on the left, <b>Winning</b> on the right, and <b>Equal</b> in the middle. Please click on the button that best describes your chances of winning the game.</p><img src="../_shared/images/EVAL_demo.png"></img>';
instCal = '<p class="instructions-text">In this calibration, you will be shown a game board on which playing pieces will appear one at a time. When a game piece appears, you should <b>look at the crosshairs</b> on the piece and press the <b>space bar</b>.</p>';
instRec = '<p class="instructions-text">Today, you will be shown positions from the game you have been playing. Your task is to memorize the position. You will have 10 seconds to <b>study the position</b>. You will then <b>recreate the position</b>.<br><br>To place a black piece on the board or to change a white piece to a black one, click with the left mouse button. To place a white piece on the board or to change a black piece to a white one, click with the right mouse button. To remove a black piece, click it with the left mouse button, and to remove a white piece, click it with the right mouse button.</p>'
instruction_text = "<div class='consent-text'><p><b>Welcome!</b><br><br><br>Today you will be performing tasks related to a simple, two-player board game.<br><br><br>To play the game, you and your opponent take turns placing pieces on a 4x9 board. To win the game, you must place four of your own pieces in a row horizontally, vertically, or diagonally. You can place pieces on any unoccupied square (unlike Connect-4, where the pieces drop to the bottom row.)<br><br><br>You may take a break anytime during the experiment. If you have questions at any point, please ask the experimenter.<br><br><br>When you are ready, please press the <b>Next</b> button below.</p></div>"
inst2 = "<div class='consent-text'><p><b>Welcome!</b><br><br><br>When you are ready, please press the <b>Next</b> button below.</p></div>"
instMem = '<p class="instructions-text">Today, you will be shown arrangements of black and white circles on a rectangular grid. Your task is to memorize the arrangement. You will have 10 seconds to <b>study the arrangement</b>. You will then <b>recreate the arrangement</b>.<br><br>To place a black circle on the grid or to change a white circle to a black one, click with the left mouse button. To place a white circle on the grid or to change a black circle to a white one, click with the right mouse button. To remove a black circle, click it with the left mouse button, and to remove a white circle, click it with the right mouse button.</p>'

instCal2 = '<p class="instructions-text">In this calibration, you will be shown a grid on which white circles will appear one at a time. When a circle appears, you should <b>look at the crosshairs</b> on the circle and press the <b>space bar</b>.</p>';
/* utility funcs */

function build_array(mDim,nDim,fillVal) {
	return Array.apply(null, new Array(mDim*nDim)).map(Number.prototype.valueOf,fillVal);
}

function restore_array(dataString) {
	dataString = dataString.split("");
	for (i = 0; i < dataString.length; i += 1) {
		dataString[i] = parseInt(dataString[i]);
	};
	return dataString;
}

/* i/o functions */

function ajax_submit_response(b, p) {
	data = {"initials":String(p.initials),
			"color":String(p.color),
			"game_index":String(p.game_index),
			"move_index":String(b.move_index),
			"game_status":String(b.game_status),
			"black_position":String(b.black_position.join("")),
			"white_position":String(b.white_position.join("")),
			"response":String(p.move),
			"duration":String(p.duration),
			"timestamp":String(Date.now()),
			"mouse_t":String(p.mouse_t.join(",")),
			"mouse_x":String(p.mouse_x.join(";")),
			"opponent_color":String(p.opponent_color),
			"opponent_strength":String(blocks[current_block].current_opponent),
			"table":String(table)
	};
	p.mouse_x = [];
	p.mouse_t = [];
	console.log(data);
	return $.ajax({type:"POST", url:"../_shared/scripts/submit.php", dataType:"JSON", data:data})
}

function ajax_retrieve_response() {
	data = {"table":String(table)}
	return $.ajax({type:"GET", url:"../_shared/scripts/retrieve.php", dataType:"JSON", data:data})
}

function unpack_tiles(dataString) {
	var output_list = [];
	dataString = dataString.split("");
	for (i = 0; i < dataString.length; i++) {
		if (dataString[i] === "1") {
			output_list.push(i)
		}
	}
	return output_list
}

function unpack_response(data, b, p) {
	b.move_index = parseInt(data.move_index);
	p.game_index = parseInt(data.game_index);
	b.game_status = parseInt(data.game_status)
	b.black_position = restore_array(data.black_position)
	b.white_position = restore_array(data.white_position)
	b.last_move = parseInt(data.response)
	p.last_initials = parseInt(data.initials)

	return data
}

function ajax_poll(b, p, promise, callback) {
	promise.then(function(data) { unpack_response(data, b, p); }).done(function(data) {
		if(p.initials != p.last_initials) {
			callback();
		} else {
			console.log(b.black_position.join(""));
			console.log(b.white_position.join(""));
			setTimeout(function() {
				get_promise = ajax_retrieve_response();
				ajax_poll(b, p, get_promise, callback);
			}, ajax_freq);
		}
	})
}

function track_mouse(p) {
		$(".canvas").on('mousemove', function(e) {
			p.mouse_t.push(Date.now())
			var loc = [e.pageX, e.pageY]
			p.mouse_x.push(loc);
	})
}

function every_n(list, n) {
	new_list = []
	for(i=0; i<list.length; i++) {
		if(i%n == 0){
			new_list.push(list[i])
		}
	}
	return new_list
}

function Positions(black_pos,white_pos) {
	this.black_position = black_pos
	this.white_position = white_pos;
}

function Choices(choiceA,choiceB) {
	this.A = choiceA;
	this.B = choiceB;
}

function State(black_pos, white_pos, choiceA, choiceB, color) {
	this.boards = new Positions(black_pos, white_pos);
	this.choices = new Choices(choiceA, choiceB);
	this.color = color == "BLACK" ? 0 : 1;
}

var waiting_html = ''//'<div class="wait-container"> <div class="wait-block"></div> <div class="wait-block"></div> <div class="wait-block"></div> <div class="wait-block"></div> <div class="wait-block"></div> <div class="wait-block"></div> <div class="wait-block"></div> <div class="wait-block"></div> <div class="wait-block"></div> <div class="wait-block"></div> <div class="wait-block"></div> <div class="wait-block"></div> <div class="wait-block"></div> <div class="wait-block"></div> <div class="wait-block"></div> <div class="wait-block"></div> </div>'
