// you'll be a happier person if you turn on text wrap for this file.

/* functional variables */

var M = 9,
	N = 4,
	K = 4,
	game_index = 0,
	response = 99,
	timestamp = Date.now(),
	ajax_data = {},
	ajax_freq = 1000;

/* aesthetic variables */

var win_color = "#22ddaa",
	MoveSound = new buzz.sound("./static/sounds/stone3.ogg"),
	square_bkgcolor = "#999999",
	square_highlight = "#bbbbbb";

/* instruction and consent html strings */

consent_html = "<div class='consent-text'><p><b>Welcome!</b><br><br><br>Today you will be performing tasks related to a simple, two-player board game.<br><br><br>To play the game, you and your opponent take turns placing pieces on a 4x9 board. To win the game, you must place four of your own pieces in a row horizontally, vertically, or diagonally. You can place pieces on any unoccupied square (unlike Connect-4, where the pieces drop to the bottom row.)<br><br><br>You may take a break anytime during the experiment. If you have questions at any point, please ask the experimenter.<br><br><br>When you are ready, please press the <b>Next</b> button below.</p></div>"

initials_field_html ="<form id='name-input' role='form'><div class='form-group'><label for='name-input-field'>Please enter a nickname and press enter.</label><br><input id='name-input-field' type='text' placeholder='Your Name' maxlength='16'></div></form>"

instAI = "<p class='instructions-text'>You will now play the game against a computer opponent.<br><br>In the picture below, there is a blank game board. Above the board there is a message that shows you when it is your turn and when your opponent is thinking. When it is your turn, you can make a move by clicking the square where you would like to place your piece. You and your opponent will take turns going first. After every game, the computer will change its settings.</p><img src='./static/AI_demo.png'></img>"
instAFC = "<p class='instructions-text'>You will now be shown a board and asked to choose one of two moves. The <b>only</b> possible choices are indicated by a dotted outline of a piece. The color of the dotted outlines, as well as a message above the board, will indicate what color you are currently playing.<br><br>The picture below shows an example. As it says above the board, you are playing Black. To make a choice, click on one of the squares with the dotted outline.</p><img src='./static/AFC_demo.png'></img>";
instEVAL = '<p class="instructions-text">You will now be shown a board and asked to judge your chances of winning. It is <b>always your turn</b>, and the message above the board will tell you what color you are playing.<br><br>The picture below shows an example. As it says above the board, you are playing White. Below the board is a row of buttons, labeled <b>Losing</b> on the left, <b>Winning</b> on the right, and <b>Equal</b> in the middle. Please click on the button that best describes your chances of winning the game.</p><img src="./static/EVAL_demo.png"></img>';

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
			"table":String(table)};
			p.mouse_x = [];
			p.mouse_t = [];
	return $.ajax({type:"POST", url:"./scripts/submit.php", dataType:"JSON", data:data})
}

function ajax_retrieve_response() {
	data = {"table":String(table)}
	return $.ajax({type:"GET", url:"./scripts/retrieve.php", dataType:"JSON", data:data})
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

//temp_opp_list = temp_opp_list.slice(1441, 2431)

/*temp_opp_list = every_n(temp_opp_list, 80)*/
temp_opp_list=[[0,1,2,3,4],[5,6,7,8,9],[10,11,12,13,14],[15,16,17,18,19],[20,21,22,23,24],[25,26,27,28,29]]

waiting_html = '<div class="wait-container"> <div class="wait-block"></div> <div class="wait-block"></div> <div class="wait-block"></div> <div class="wait-block"></div> <div class="wait-block"></div> <div class="wait-block"></div> <div class="wait-block"></div> <div class="wait-block"></div> <div class="wait-block"></div> <div class="wait-block"></div> <div class="wait-block"></div> <div class="wait-block"></div> <div class="wait-block"></div> <div class="wait-block"></div> <div class="wait-block"></div> <div class="wait-block"></div> </div>'