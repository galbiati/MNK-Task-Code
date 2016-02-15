/* Free Play Against Computer */

// This is the constructor function and various important variables for the AI condition
// The subject simply plays games for a set duration against a computer opponent
// The opponent is selected with a one-up one-down step function

function Demo(dur) {
	var that = this;
	this.ntrials = recon_pos.length;
	this.duration = 20;
	this.start_time = Date.now();
	this.end_time = this.start_time + 60000 * this.duration;
	this.states = _.shuffle(recon_pos);
	this.current_trial = 0;
	this.current_position = {};
	this.stimDisplay = 0;
	this.stimDelay = 0;
	this.bp = []
	this.wp = []

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
		that.bp = b.black_position;
		that.wp = b.white_position;
	}

	this.action = function(b, p) {
		$('#submit').prop('disabled', true).hide();
		$('#score-row').hide();
		p.move_start = Date.now()
		$('.canvas, .canvas div').css('cursor', 'default');
		$('.canvas').off()
		setTimeout(function() {
			ajax_submit_response(b, p);
			$(".indicator").html("<h1></h1>");
			board = new Board();
			board.create_tiles();
			board.game_status = 'recon';
			$('.canvas').off()
			setTimeout(function() { 
				$('.tile').css('cursor', 'pointer');
				$('.canvas').off().on({click: function toggle_bpiece(e) {
						console.log("click!");
						i = (e.target.id) ? e.target.id : $(e.target).parent().attr("id")
						i = parseInt(i);
						p.move = i;
						p.color = 0;
						tid = '#' + i.toString();
						console.log(i);
						if(board.black_position[i] == 0) {
							if(board.white_position[i] == 1) {
								$(tid).empty();
								board.white_position[i] = 0;
							}
							board.add_piece(i, 0);
							$(tid).removeClass('usedTile').addClass('tile');
						} else {
							$(tid).empty();
							board.black_position[i] = 0;
						}
						ajax_submit_response(board, p);
						board.move_index += 1;
						$('#submit').prop('disabled', false).show();
					}, contextmenu: function toggle_wpiece(e) {
						e.preventDefault();
						console.log("right click!");
						i = (e.target.id) ? e.target.id : $(e.target).parent().attr("id")
						i = parseInt(i);
						p.move = i
						p.color = 1;
						tid = '#' + i.toString();
						console.log(i);
						if(board.white_position[i] == 0) {
							if(board.black_position[i] == 1) {
								$(tid).empty();
								board.black_position[i] = 0;
							}
							board.add_piece(i, 1);
							$(tid).removeClass('usedTile').addClass('tile');
						} else {
							$(tid).empty();
							board.white_position[i] = 0;
						}
						ajax_submit_response(board, p);
						board.move_index += 1
						$('#submit').prop('disabled', false).show();
					}}, '.tile, .tile .blackPiece, .tile .whitePiece')
			}, that.stimDelay);
		}, that.stimDisplay);
	}

	this.do_trial = function() {
		player.score = 36;
		player.move = 99;
		$('#score-text').text('');
		if(that.current_trial < that.ntrials) {
			board = new Board();
			board.create_tiles();
			board.game_status = "recon";
			$('.canvas').off();
			$('#submit').off('click').on('click', function() {

				$('.canvas').off();
				$('.canvas, .canvas div').css('cursor', 'default');
				$('#submit').prop('disabled', true);
				
				for(i=0; i<M*N; i++) {
					if(that.bp[i] != board.black_position[i]) {
						player.score -= 1
					} else if(that.wp[i] != board.white_position[i]) {
						player.score -= 1
					}
				}
				board.game_status = 'reconf';
				player.move = player.score;
				ajax_submit_response(board, player);
				$('#score-text').text((player.score / .36).toFixed(1) + ' %');
				$('#score-row').show();
				that.current_trial ++;

				if((that.current_trial % 34) == 0) {
					$('#feedback-modal').modal('show');
					$('#next-trial').off().on('click', function() {
						$('#feedback-modal').modal('hide');
						setTimeout(that.do_trial, 500);
					});
				} else { setTimeout(that.do_trial, 5000); }
			});
			that.load_game(board, that.states);
			board.game_status = 'reconi'
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
		console.log("running reconstruction");
		$(".scorebox").animate({backgroundColor:"#FFFFFF", color:"FFFFFF", borderColor:"#FFFFFF"}, 2000);
		$(".indicator").html("<h1>You are playing <b>BLACK</b></h1>").css("color","#FFFFFF");
		board = new Board();
		board.create_tiles();
		board.highlight_tiles();
		that.do_trial();
	}
}

var recon_pos = [new State('000000000000000000000000000000000000', '000000000000000000000000000000000000', 0, 1, 'BLACK')]