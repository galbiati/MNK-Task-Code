/* General ToDo:

need to fix when new AI conditions start so that they don't end up with white first (not a concern for now!)

eventually, these conditions should be able to be called with arguments for values like duration, whether it is a time
or finite trial, specific lists of positions or opponents, and so on. I'd also like to create a super-general template
condition.

eventually, we will have a second version replacing our current data saves by ajax with the appropriate psiturk functions.

Instructions:

AI:
- fix durations (Bas' program)
- pass random seed from browser to Bas' program (do entirely in php to skip ajax? will this be variable?)

AFC:

EVAL:

Puzzle:
- design and implement

Gamble:
- design and implement

Other:
- implement final/debriefing block?

*/

var current_block = 0;
var blocks = [new Condition_AI(), new Condition_AFC(), new Condition_Evaluation(), new End_Message()]

/* condition functions */

function Instructions() {
	var that = this
	this.instructions = {
		pages: [/*inst0, inst1, inst2 "<h1 class='welcome-text'>Please press start to begin!</h1>"*/],
		consent: consent_html,
		initials_field: initials_field_html
	};
	this.current_page = 0;

	this.start_experiment = function() {
		board = new Board();
		board.create_tiles();
		$('#welcome-modal').modal('hide');
		blocks[current_block].run_block();
	}

	this.button = $("#welcome-modal .modal-footer .btn")
	this.button_action = function() { 
		that.current_page += 1;
		if (that.current_page < that.instructions.pages.length) {
			$("#welcome-modal .modal-body").empty().append(that.instructions.pages[that.current_page]);
		}
		else if (that.current_page == that.instructions.pages.length) {
			$("#welcome-modal .modal-body").empty().append(that.instructions.consent);
			that.button.text("Next");
		}
		else {
			player = new Player();
			player.initials = Date.now();
			track_mouse(player);
			that.start_experiment();
			/*$("#welcome-modal .modal-footer").remove();
			$("#welcome-modal .modal-body").empty().append(that.instructions.initials_field)
			that.button.text("Start").prop("disabled", true).off("click", that.button_action)
			$("#name-input").on('keydown', function(e) { 
				if(e.keyCode == 13) {
					e.preventDefault();
					player = new Player();
					player.initials = $("#name-input-field").val();
					$("#leftScorebox h2").text(player.initials);
					$("#rightScorebox h2").text("Computer");
					track_mouse(player);
					that.start_experiment(); /*
				/* $("#welcome-modal .modal-body").empty().append("<h1>Press start to begin!</h1>");
				that.button.prop("disabled", false).on("click", that.start_experiment);*/ /*}
			}); */
		}
	}

	this.read = function() {
		$("#welcome-modal .modal-body").append(this.instructions.consent); /*.append(this.instructions.pages[this.current_page]); */
		this.button.on("click", that.button_action)
		$("#welcome-modal").modal('show');
	}
}

function End_Message() {
	this.run_block = function() {
		$(".indicator").css("color", "#FFFFFF");
		$('#block-modal .modal-footer').remove();
		$('#block-modal .modal-body').html("<p><b>Thanks for participating!</b><br><br>Please let the experimenter know you are finished.</p>");
		$('#block-modal').modal('show');
	}
}

function Condition_AI() {
	var that = this;
	this.ntrials = 5;
	this.duration = 30; // in minutes
	this.start_time = Date.now()
	this.end_time = this.start_time + 60000 * this.duration
	this.instructions = "String of instructions...";
	this.current_trial = 0;
	this.opponents =  temp_opp_list 
	this.current_opponent = _.sample(this.opponents[Math.floor(this.opponents.length/2)]);

	this.change_opponent = function(p) {
		var lvl_adjust = 1.2*(p.score - p.opponent_score)/(p.score + p.opponent_score)
		var new_opp = Math.floor(.5*that.opponents.length*(1 - lvl_adjust))
		if (new_opp > that.opponents.length - 1) {
			new_opp = _.sample(that.opponents[that.opponents.length - 1])
		} else if (new_opp < 0) {
			new_opp = _.sample(that.opponents[0])
		}
		return _.sample(that.opponents[new_opp])
	}
	
	this.action = function(b, p) {
		p.move_start = Date.now();
		b.highlight_tiles();
		p.scorebox.animate({"border-color":win_color, "border-width":'10px'}, 200);
		$(".indicator").html("<h1>Your turn</h1>").css("color","#000000");
		$('.canvas').css("cursor", "pointer");
		$('.usedTile, .usedTile div').css("cursor", "default");
		$('.tile').off('click').css("cursor", "pointer").on('click', function(e) {
			p.move_end = Date.now();
			$('.tile').off('mouseenter').off('mouseleave').off('click');
			$('.canvas, .canvas div').css("cursor", "none");
			$(".indicator").html(waiting_html+ "<h1>Waiting for opponent</h1>").css("color","#333333");
			p.move = parseInt(e.target.id);
			b.move_index ++
			b.add_piece(p.move, p.color)
			MoveSound.play();
			b.show_last_move(p.move, p.color);
			b.evaluate_win(p.color)
			if(b.game_status=="win" || b.game_status=="draw"){
				p.score ++
				p.scoretext.text(p.score)
			} else {
				p.opponent_scorebox.animate({"border-color":win_color, "border-width":'10px'}, 200)
			}
			p.scorebox.animate({"border-color":'#AAAAAA', "border-width":'2px'}, 200);
			p.duration = p.move_end - p.move_start
			var send_promise = ajax_submit_response(b, p);
			send_promise.done(function() {
				get_promise = ajax_retrieve_response();
				if(b.game_status == "ready" || b.game_status == "playing") {
					ajax_poll(b, p, get_promise, function() { that.opponent_action(b,p)})
				}
			});
		})
	}

	this.opponent_action = function(b, p) {
		b.add_piece(b.last_move, p.opponent_color);
		MoveSound.play();
		b.show_last_move(b.last_move, p.opponent_color);
		b.evaluate_win(p.opponent_color);
		if(b.game_status=="win"){
				p.opponent_score ++
				p.opponent_scoretext.text(p.opponent_score)
			}
		p.opponent_scorebox.animate({"border-color":'#AAAAAA', "border-width":'2px'}, 200)
		if(b.game_status == "playing") {
			that.action(b, p);
		}
	}

	this.do_trial = function(b, p) {
		if (that.current_trial == 0) {
			that.start_time = Date.now()
			that.end_time = that.start_time + 60000 * that.duration
			var first_send_promise = ajax_submit_response(b, p);
			first_send_promise.done(function() {
				var get_promise = ajax_retrieve_response();
				ajax_poll(b, p, get_promise, function() {
					that.action(b,p);
				})
			})
		} else if (Date.now() < that.end_time) {
			$('.tile').css("cursor", "none");
			if(p.color==1){
				p.opponent_scorebox.animate({"border-color":win_color, "border-width":'10px'}, 200);
				$(".indicator").html(waiting_html + "<h1>Waiting for opponent</h1>").css("color","#333333");
			}
			var first_send_promise = ajax_submit_response(b,p);
			first_send_promise.done(function() {
				var get_promise = ajax_retrieve_response();
				ajax_poll(b, p, get_promise, function() {
					if(p.color == 0) {
						that.action(b,p);
					} else {
						$(".indicator").html(waiting_html + "<h1>Waiting for opponent</h1>").css("color","#333333");
						p.opponent_scorebox.animate({"border-color":'#AAAAAA', "border-width":'2px'}, 200)
						that.opponent_action(b,p);
					}
				});
			})
		}
	}

	this.run_block = function(){
		$(".scorebox").animate({backgroundColor:"#EEEEEE", color:"#333333", borderColor:"#AAAAAA"}, 2000);
		board = new Board();
		board.create_tiles();
		board.highlight_tiles();
		player.color = 0;
		$('#block-modal .modal-body').empty().append(instAI);
		$('#block-modal').modal('show');
		/*$('#block-modal button').off('click').on('click',*/
		$(document).on('keydown', function(e) {
			if (e.keyCode == 192) {
				e.preventDefault();
				$("html, #scale-label, input[type=radio]").css("cursor", "none");
				$('#block-modal').modal('hide');
				that.do_trial(board, player);
				$(document).off('keydown');
			}
		});
		$('#feedback-modal button').on('click', function() {
			$('#feedback-modal').modal('hide');
			$("html, #scale-label, input[type=radio]").css("cursor", "none");
			that.current_trial ++;
			player.game_index ++;
			that.current_opponent = that.change_opponent(player);
			player.color = (player.color + 1)%2
			player.opponent_color = (player.opponent_color + 1)%2
			board = new Board();
			board.create_tiles();
			that.do_trial(board, player);
		})
	}
}

function Condition_AFC() {
	var that = this;
	this.ntrials = AFC_states.length;
	this.duration = 20;
	this.start_time = Date.now();
	this.end_time = this.start_time + 60000 * this.duration;
	this.instructions = "String of instructions...";
	this.states = _.shuffle(AFC_states);
	this.current_trial = 0;
	this.current_position = {}

	this.load_game = function(b, position_list) {
		b.loaded_game = position_list[that.current_trial]
		b.black_position = restore_array(b.loaded_game.boards.black_position);
		b.white_position = restore_array(b.loaded_game.boards.white_position);
		for(i=0; i<M*N; i++){
			if(b.black_position[i] == 1) {			
				b.add_piece(i, 0)
			} else if(b.white_position[i] == 1) {
				b.add_piece(i, 1)
			}
		}
	}

	this.action = function(b,p) {
		p.move_start = Date.now()
		var choices = [b.loaded_game.choices.A, b.loaded_game.choices.B];
		var choice_selector = $("#" + choices[0] + ",#" + choices[1])
		$('.canvas, .canvas div').css('cursor', 'default');
		if(b.loaded_game.color == 0) {
			choice_selector.css('cursor', 'pointer').append("<div class='blackChoice'></div>");
			$('.blackChoice').on('mouseenter', function() { $(this).stop(true, true).animate({backgroundColor:"#000000"}, 100); })
			$('.blackChoice').on('mouseleave', function() { $(this).stop(true, true).animate({backgroundColor:square_bkgcolor}, 100); })
			$(".indicator").html("<h1>You are playing <b>BLACK</b></h1>").css("color","#000000");
		} else {
			choice_selector.css('cursor', 'pointer').append("<div class='whiteChoice'></div>");
			$('.whiteChoice').on('mouseenter', function() { $(this).stop(true, true).animate({backgroundColor:"#FFFFFF"},100); })
			$('.whiteChoice').on('mouseleave', function() { $(this).stop(true, true).animate({backgroundColor:square_bkgcolor}, 100); })
			$(".indicator").html("<h1>You are playing <b>WHITE</b></h1>").css("color","#000000");
		}
		choice_selector.on("click", function(e) {
			p.move_end = Date.now();
			var choice = (e.target.id) ? e.target.id : $(e.target).parent().attr("id")
			$('.blackChoice, .whiteChoice').remove();
			p.game_index ++;
			p.move = parseInt(choice);
			if(b.loaded_game.color == 0) {
				$("#" + choice).append("<div class='blackPiece'></div>")
			} else {
				$("#" + choice).append("<div class='whitePiece'></div>")
			}
			p.duration = p.move_end - p.move_start
			var send_promise = ajax_submit_response(b,p);
			send_promise.done(function() {
				that.current_trial ++;
				setTimeout(that.do_trial, 1000)
			})
		})
	}

	this.do_trial = function() {
		if(that.current_trial < that.ntrials) {
			board = new Board();
			board.create_tiles();
			board.game_status = "AFC";
			that.load_game(board, that.states);
			that.action(board, player);
		} else {
			current_block ++;
			player.game_index ++;
			blocks[current_block].run_block();
		}
	}

	this.countdown = function(i) {
		if(i>0) {
			$('#block-modal button').text(i);
			setTimeout(function(){that.countdown(i-1)}, 1000);
		} else {
			$('#block-modal .modal-body').html(instAFC);
			$('#block-modal button').text("Start").prop('disabled', false);
		}
	}

	this.run_block = function() {
		$("html, #scale-label, input[type=radio], .scorebox").css("cursor", "default");
		console.log("Run, Forest, run!");
		$(".scorebox").animate({backgroundColor:"#FFFFFF", color:"FFFFFF", borderColor:"#FFFFFF"}, 2000);
		$(".indicator").html("<h1>You are playing <b>BLACK</b></h1>").css("color","#FFFFFF");
		board = new Board();
		board.create_tiles();
		board.highlight_tiles();
		$('#block-modal .modal-body').html("<b>You're done with this part of the task.</b><br><br>Please take a break and find the experimenter when you are ready to continue.");
		$('#block-modal').modal('show');
		/*$('#block-modal button').off('click').prop('disabled', true).on('click', */
		$(document).on('keydown', function(e) {
			if (e.keyCode==192){
				$('#block-modal .modal-body').html(instAFC);
				$(document).off('keydown').on('keydown', function(e){
					if (e.keyCode==192){
						$('#block-modal').modal('hide');
						that.do_trial();
						$(document).off('keydown');
					}
				});
			}
		});
		//that.countdown(30);
	}
}

function Condition_Evaluation() {
	var that = this;
	this.duration = 20;
	this.start_time = Date.now();
	this.end_time = this.start_time + 60000 * this.duration;
	this.instructions = "String of instructions...";
	this.states = _.shuffle(EVAL_states);
	this.ntrials = this.states.length
	this.color_indicators = ["BLACK", "WHITE"];
	this.current_trial = 0;
	this.current_position = {}

	this.load_game = function(b, position_list) {
		b.loaded_game = position_list[that.current_trial];
		b.black_position = restore_array(b.loaded_game.boards.black_position);
		b.white_position = restore_array(b.loaded_game.boards.white_position);
		for(i=0; i<M*N; i++){
			if(b.black_position[i] == 1) {			
				b.add_piece(i, 0)
			} else if(b.white_position[i] == 1) {
				b.add_piece(i, 1)
			}
		}
		$(".indicator").html("<h1>You are playing <b>" + that.color_indicators[b.loaded_game.color].toUpperCase() + "</b></h1>").css("color","#000000");
	}

	this.action = function(b,p) {
		$('.canvas, .canvas div').css('cursor', 'default');
		p.move_start = Date.now();
		setTimeout(function(){$('input[name="radio"]').attr('disabled', false).css("cursor","pointer")}, 500)
		$('input[name="radio"]').on('click', function(e) {
			p.move_end = Date.now();
			$('input[name="radio"]').off('click').attr('disabled', true).css("cursor","default");
			p.move = $(this).attr('value');
			p.duration = p.move_end - p.move_start
			var send_promise = ajax_submit_response(b, p);
			send_promise.done(function() {
				that.current_trial ++;
				setTimeout(that.do_trial, 500);
			});
		});
	}

	this.do_trial = function() {
		if(that.current_trial < that.ntrials) {
			board = new Board();
			board.create_tiles();
			$('.tile').css('cursor', 'default');
			$('input[name="radio"]').prop('checked', false);
			board.game_status = "EVAL";
			that.load_game(board, that.states);
			that.action(board, player);
		} else {
			$(".eval-element").animate({"opacity":"0.0"}, 500)
			current_block ++;
			player.game_index ++;
			blocks[current_block].run_block();
		}
	}

	this.countdown = function(i) {
		if(i>0) {
			$('#block-modal button').text(i);
			setTimeout(function(){that.countdown(i-1)}, 1000);
		} else {
			$('#block-modal .modal-body').html(instEVAL);
			$('#block-modal button').text("Start").prop('disabled', false);
		}
	}

	this.run_block = function() {
		$("html, #scale-label, input[type=radio], .scorebox").css("cursor", "default");
		$(".scorebox").animate({backgroundColor:"#FFFFFF", color:"FFFFFF", borderColor:"#FFFFFF"}, 2000);
		$(".indicator").html("<h1>You are playing <b>BLACK</b></h1>").css("color","#FFFFFF");
		$(".eval-element").animate({"opacity":"1.0"}, 500)
		board = new Board();
		board.create_tiles();
		board.highlight_tiles();
		$('#block-modal .modal-body').html("<b>Please take a break before beginning the next task!</b><br><br>");
		$('#block-modal').modal('show');
				$('#block-modal .modal-body').html("<b>You're done with this part of the task.</b><br><br>Please take a break and find the experimenter when you are ready to continue.");
		$('#block-modal').modal('show');
		/*$('#block-modal button').off('click').prop('disabled', true).on('click', */
		$(document).on('keydown', function(e) {
			if (e.keyCode==192){
				$('#block-modal .modal-body').html(instEVAL);
				$(document).off('keydown').on('keydown', function(e){
					if (e.keyCode==192){
						$('#block-modal').modal('hide');
						that.do_trial();
						$(document).off('keydown');
					}
				});
			}
		});
		/*$('#block-modal button').off('click').prop('disabled', true).on('click', function() {
			$('#block-modal').modal('hide');
			that.do_trial();
		});*/
		//that.countdown(30)
	}

}

function Condition_Puzzle() {

}

function Condition_Gamble() {
	
}

$(document).ready(function() {
	current_block = 0;
	$(".indicator").css("color","#FFFFFF");
	$(".scorebox").animate({backgroundColor:"#FFFFFF", color:"#FFFFFF", borderColor:"#FFFFFF"}, 0);
	$(".eval-element").css("opacity", 0);
	$('input[name="radio"]').off('click').attr('disabled', true).css("cursor", "none");
	instructions = new Instructions();
	//console.log(instructions.instructions)
	instructions.read();
	board = new Board();
	board.create_tiles();
})