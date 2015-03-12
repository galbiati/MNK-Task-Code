function Eye_Calibration() {
	var that = this;
	this.ntrials = calibration_positions.length;
	this.duration = 20;
	this.start_time = Date.now();
	this.end_time = this.start_time + 60000 * this.duration;
	this.states = calibration_positions
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
		$(document).on("keydown", function(e) {
			if(e.keyCode==32){
				$(document).off('keydown');
				p.move_end = Date.now();
				var choice = that.current_trial
				p.game_index ++;
				p.move = parseInt(choice);
				p.duration = p.move_end - p.move_start
				var send_promise = ajax_submit_response(b,p);
				send_promise.done(function() {
					that.current_trial ++;
					setTimeout(that.do_trial, 1000)
				}); // keycode should be space bar
			}
		})
	}

	this.do_trial = function() {
		if(that.current_trial < that.ntrials) {
			board = new Board();
			board.create_tiles();
			board.game_status = "eyecal";
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
		}
	}

	this.run_block = function() {
		$("html, #scale-label, input[type=radio], .scorebox").css("cursor", "default");
		console.log("Run, Forest, run!");
		$(".indicator").html("<h1></h1>").css("color","#FFFFFF");
		board = new Board();
		board.create_tiles();
		board.highlight_tiles();
		$('#block-modal .modal-body').html("<b>You're done with this part of the task.</b><br><br>Please take a break and find the experimenter when you are ready to continue.");
		$('#block-modal').modal('show');
		$(document).on('keydown', function(e) {
			if (e.keyCode==192){
				$('#block-modal .modal-body').html(instAFC);
				$(document).off('keydown').on('keydown', function(e){
					if (e.keyCode==192){
						$(document).off('keydown');
						$('#block-modal').modal('hide');
						that.do_trial();
					}
				});
			}
		});
	}
}

var calibration_positions = [
	new State('000000000000000000000000000000000000', '100000000000000000000000000000000000', 23, 28, 'BLACK')
	];