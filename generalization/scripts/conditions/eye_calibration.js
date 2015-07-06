function Eye_Calibration() {
	var that = this;
	this.ntrials = calibration_positions.length;
	this.start_time = Date.now();
	this.states = calibration_positions
	this.current_trial = 0;
	this.current_position = {};

	this.load_game = function(b, position_list) {
		b.loaded_game = position_list[that.current_trial]
		b.black_position = restore_array(b.loaded_game.boards.black_position);
		b.white_position = restore_array(b.loaded_game.boards.white_position);
		for(i=0; i<M*N; i++){
			if(b.black_position[i] == 1) {
				b.add_piece(i, 0)
				$('.blackPiece').append('<p class="fixcross">+</div>')
			} else if(b.white_position[i] == 1) {
				b.add_piece(i, 1)
				$('.whitePiece').append('<p class="fixcross">+</div>')
			}
		}
	}

	this.action = function(b,p) {
		p.move_start = Date.now()
		$('.canvas, .canvas div').css('cursor', 'none');
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
				});
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
			player.game_index = 0;
			blocks[current_block].run_block();
		}
	}

	this.prompts = function(tha, is_first) {
		if(player.game_index != 0) {
			$('#block-modal .modal-body').html("<b>You're done with the previous task.</b><br><br>Please ask the experimenter to continue.");
			$('#block-modal').modal('show');
			$(document).on('keydown', function(e) {
				if (e.keyCode==192){
					$('#block-modal .modal-body').html(instCal);
					$(document).off('keydown').on('keydown', function(e){
						if (e.keyCode==192){
							$(document).off('keydown');
							$('#block-modal').modal('hide');
							tha.do_trial();
						}
					});
				}
			});
		} else {
			$('#block-modal .modal-body').html(instCal);
			$('#block-modal').modal('show');
			$(document).off('keydown').on('keydown', function(e){
				if (e.keyCode==192){
					$(document).off('keydown');
					$('#block-modal').modal('hide');
					tha.do_trial();
				}
			});
		}
	}

	this.run_block = function() {
		$("html, #scale-label, input[type=radio], .scorebox").css("cursor", "default");
		console.log("Run, Forest, run!");
		$(".indicator").html("<h1></h1>").css("color","#FFFFFF");
		board = new Board();
		board.create_tiles();
		that.prompts(that);
	}
}

var calibration_positions = [
	new State('000000000000000000000000000000000000', '100000000000000000000000000000000000', 0, 1, 'WHITE'),
	new State('000000000000000000000000000000000000', '010000000000000000000000000000000000', 0, 1, 'WHITE'),
	new State('000000000000000000000000000000000000', '001000000000000000000000000000000000', 0, 1, 'WHITE'),
	new State('000000000000000000000000000000000000', '000100000000000000000000000000000000', 0, 1, 'WHITE'),
	new State('000000000000000000000000000000000000', '000010000000000000000000000000000000', 0, 1, 'WHITE'),
	new State('000000000000000000000000000000000000', '000001000000000000000000000000000000', 0, 1, 'WHITE'),
	new State('000000000000000000000000000000000000', '000000100000000000000000000000000000', 0, 1, 'WHITE'),
	new State('000000000000000000000000000000000000', '000000010000000000000000000000000000', 0, 1, 'WHITE'),
	new State('000000000000000000000000000000000000', '000000001000000000000000000000000000', 0, 1, 'WHITE'),
	new State('000000000000000000000000000000000000', '000000000100000000000000000000000000', 0, 1, 'WHITE'),
	new State('000000000000000000000000000000000000', '000000000010000000000000000000000000', 0, 1, 'WHITE'),
	new State('000000000000000000000000000000000000', '000000000001000000000000000000000000', 0, 1, 'WHITE'),
	new State('000000000000000000000000000000000000', '000000000000100000000000000000000000', 0, 1, 'WHITE'),
	new State('000000000000000000000000000000000000', '000000000000010000000000000000000000', 0, 1, 'WHITE'),
	new State('000000000000000000000000000000000000', '000000000000001000000000000000000000', 0, 1, 'WHITE'),
	new State('000000000000000000000000000000000000', '000000000000000100000000000000000000', 0, 1, 'WHITE'),
	new State('000000000000000000000000000000000000', '000000000000000010000000000000000000', 0, 1, 'WHITE'),
	new State('000000000000000000000000000000000000', '000000000000000001000000000000000000', 0, 1, 'WHITE'),
	new State('000000000000000000000000000000000000', '000000000000000000100000000000000000', 0, 1, 'WHITE'),
	new State('000000000000000000000000000000000000', '000000000000000000010000000000000000', 0, 1, 'WHITE'),
	new State('000000000000000000000000000000000000', '000000000000000000001000000000000000', 0, 1, 'WHITE'),
	new State('000000000000000000000000000000000000', '000000000000000000000100000000000000', 0, 1, 'WHITE'),
	new State('000000000000000000000000000000000000', '000000000000000000000010000000000000', 0, 1, 'WHITE'),
	new State('000000000000000000000000000000000000', '000000000000000000000001000000000000', 0, 1, 'WHITE'),
	new State('000000000000000000000000000000000000', '000000000000000000000000100000000000', 0, 1, 'WHITE'),
	new State('000000000000000000000000000000000000', '000000000000000000000000010000000000', 0, 1, 'WHITE'),
	new State('000000000000000000000000000000000000', '000000000000000000000000001000000000', 0, 1, 'WHITE'),
	new State('000000000000000000000000000000000000', '000000000000000000000000000100000000', 0, 1, 'WHITE'),
	new State('000000000000000000000000000000000000', '000000000000000000000000000010000000', 0, 1, 'WHITE'),
	new State('000000000000000000000000000000000000', '000000000000000000000000000001000000', 0, 1, 'WHITE'),
	new State('000000000000000000000000000000000000', '000000000000000000000000000000100000', 0, 1, 'WHITE'),
	new State('000000000000000000000000000000000000', '000000000000000000000000000000010000', 0, 1, 'WHITE'),
	new State('000000000000000000000000000000000000', '000000000000000000000000000000001000', 0, 1, 'WHITE'),
	new State('000000000000000000000000000000000000', '000000000000000000000000000000000100', 0, 1, 'WHITE'),
	new State('000000000000000000000000000000000000', '000000000000000000000000000000000010', 0, 1, 'WHITE'),
	new State('000000000000000000000000000000000000', '000000000000000000000000000000000001', 0, 1, 'WHITE')
	];