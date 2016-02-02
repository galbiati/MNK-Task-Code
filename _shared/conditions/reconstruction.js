function Reconstruction() {
	var that = this;
	this.ntrials = AFCn_positions.length;
	this.duration = 20;
	this.start_time = Date.now();
	this.end_time = this.start_time + 60000 * this.duration;
	this.states = _.shuffle(recon_pos);
	this.current_trial = 0;
	this.current_position = {};
	this.stimDisplay = 10000;
	this.stimDelay = 500;
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
		$(".indicator").html("<h1>Try to remember this arrangement:</h1>").css("color","#000000");
		
		console.log("displaying stimulus...");
		setTimeout(function() {
			
			console.log("hiding stimulus...");
			ajax_submit_response(b, p);
			$(".indicator").html("<h1>Please wait...</h1>");
			board = new Board();
			board.create_tiles();
			board.game_status = 'recon';
			$('.canvas').off()
			setTimeout(function() { 
				
				console.log("reconstructing...");
				$('.indicator').html("<h1>Please reconstruct the arrangement.</h1>");
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
						p.color = 1;1;
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
				$('#score-text').text(player.score + " / 36");
				$('#score-row').show();
				that.current_trial ++;

				if((that.current_trial % 20) == 0) {
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
		$('#block-modal .modal-body').html(instRec);
		$('#block-modal').modal('show');
		$(document).off('keydown').on('keydown', function(e){
			if (e.keyCode==192){
				$('#block-modal').modal('hide');
				that.do_trial();
				$(document).off('keydown');
			}
		});
	}
}

var recon_pos = [
	new State('000101000000100000001011010000001100', '000010000001010001110000100001010000', 0, 1, 'BLACK'), 
	new State('100101000000001000000101000010101000', '010000100000100000010010100001000100', 0, 1, 'BLACK'), 
	new State('001100000000110100001101000000000001', '000011100000000000000000010001101100', 0, 1, 'BLACK'), 
	new State('001100000000001000001011000000000000', '000000000011000000000000010001011000', 0, 1, 'BLACK'), 
	new State('001101000010000100001000000000000100', '100000000000001000000011000100001000', 0, 1, 'BLACK'), 
	new State('000000000010000000001000010100011000', '000000000000101000010001000000100000', 0, 1, 'BLACK'), 
	new State('000000000001110000000010100010100000', '011110100000000000000100000000001000', 0, 1, 'BLACK'), 
	new State('000000000010001000100100000001100000', '000000101001010100000000000000000100', 0, 1, 'BLACK'), 
	new State('011000000000001100000010100000001000', '000101000000000000101100010001000000', 0, 1, 'BLACK'), 
	new State('001001000000000100010111000000010000', '000000000000111010001000000001100000', 0, 1, 'BLACK'), 
	new State('000000100000100110010101000000110000', '000101010101000000000000110011000000', 0, 1, 'BLACK'), 
	new State('100000000000111100100100000000001000', '011100010000000000000000100100010000', 0, 1, 'BLACK'), 
	new State('000000000011010000010100000001010001', '001100000000001000001000000010100010', 0, 1, 'BLACK'), 
	new State('000000000001110110000000000000010010', '010110010000000000000000110001000000', 0, 1, 'BLACK'), 
	new State('000010100000000100100100000000100000', '000100000001100000000010000000001100', 0, 1, 'BLACK'), 
	new State('000000000001110100101011000000000100', '001011000000000000000100010100101000', 0, 1, 'BLACK'), 
	new State('000000000000110000000011100000100000', '000110010001000000000000000000000100', 0, 1, 'BLACK'), 
	new State('001100010001010000010000010000000000', '000011000000000000001011000000011000', 0, 1, 'BLACK'), 
	new State('000000000000011010011010010001100000', '010101000001100000000000100100011000', 0, 1, 'BLACK'), 
	new State('001101000001010000000000000000001110', '000000010000101000010101000001000000', 0, 1, 'BLACK'), 
	new State('000001011000001000000000100000000100', '000010100000000000000000000000011010', 0, 1, 'BLACK'), 
	new State('000000000000101000000011000000100100', '000011100000000100000100100000000000', 0, 1, 'BLACK'), 
	new State('010000100000010100000000100000010000', '001110000000001000000000000000000100', 0, 1, 'BLACK'), 
	new State('000100000001000100000100000000111000', '010000000000111000000000000001000100', 0, 1, 'BLACK'), 
	new State('010110000011001000010010000000100000', '001001100000100000001100100000010000', 0, 1, 'BLACK'), 
	new State('000001000001001000011010000010110000', '001000000010110100000101000001000000', 0, 1, 'BLACK'), 
	new State('001001000000001000001010000000010000', '000110100000010000000001000000001000', 0, 1, 'BLACK'), 
	new State('000100100000001000000100000000101000', '000011000000100100000010000000000000', 0, 1, 'BLACK'), 
	new State('010001000000100000011100000000010000', '000110000000010000100011000000000000', 0, 1, 'BLACK'), 
	new State('000101000000110100000010000000000010', '000010000001001000000101100000001000', 0, 1, 'BLACK'), 
	new State('000001000001100100000001000000111000', '000000010000011000000110000001000100', 0, 1, 'BLACK'), 
	new State('000010000000011000000010100000100000', '000100100000100000000100000000010000', 0, 1, 'BLACK'), 
	new State('000001000000000000100110100000000001', '100000000000000000000001000000001110', 0, 1, 'BLACK'), 
	new State('000000000000011000000110000001010000', '000011000000100000000001000000001100', 0, 1, 'BLACK'), 
	new State('001000000010000000001110000000110000', '100000000000100000010001000001001000', 0, 1, 'BLACK'), 
	new State('000100000010000000101000000111000000', '000000000101100000010100000000100000', 0, 1, 'BLACK'), 
	new State('000000000011100000001100000100110000', '010100000100010000110000000011000000', 0, 1, 'BLACK'), 
	new State('000000000001011010000100100000100000', '000000010100100100000010000001010000', 0, 1, 'BLACK'), 
	new State('000001010000010010001010000000100110', '000000000010001101000001100000011000', 0, 1, 'BLACK'), 
	new State('000111000001100000011001000000101000', '001000100010010000000110000110010000', 0, 1, 'BLACK')
];
