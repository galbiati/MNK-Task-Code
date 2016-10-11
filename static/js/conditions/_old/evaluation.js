function Condition_Evaluation() {
	var that = this;
	this.duration = 20;
	this.start_time = Date.now();
	this.end_time = this.start_time + 60000 * this.duration;
	this.instructions = "String of instructions...";
	this.states = _.shuffle(evaluation_positions);
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
	}
}