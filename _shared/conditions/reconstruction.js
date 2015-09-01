function Reconstruction() {
	var that = this;
	this.ntrials = AFCn_positions.length;
	this.duration = 20;
	this.start_time = Date.now();
	this.end_time = this.start_time + 60000 * this.duration;
	this.states = _.shuffle(AFCn_positions);
	this.current_trial = 0;
	this.current_position = {};
	this.stimDisplay = 3000;
	this.stimDelay = 1000;
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
		$('#submit').prop('disabled', true);
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
				// click handler
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
						$('#submit').prop('disabled', false);
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
						$('#submit').prop('disabled', false);
					}}, '.tile, .tile .blackPiece, .tile .whitePiece')
			}, that.stimDelay);
		}, that.stimDisplay);
	}

	this.do_trial = function() {
		player.score = 36
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
				ajax_submit_response(board, player);
				for(i=0; i<M*N; i++) {
					if(that.bp[i] != board.black_position[i]) {
						player.score -= 1
					} else if(that.wp[i] != board.white_position[i]) {
						player.score -= 1
					}
				}
				$('#score-text').text(player.score + " / 36");
				that.current_trial ++;
				setTimeout(that.do_trial, 5000);
			});
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
		console.log("running reconstruction");
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

var AFCn_positions = [
    new State('011100001100011010011100000001010001', '100011000011100100100010110000001110', 23, 28, 'BLACK'),
    new State('000000000010100010000000000100100010', '000010001000001000000010100000001000', 11, 23, 'BLACK'),
    new State('000010000011101000010010000001100100', '001101100100010100000101000000001000', 28, 7, 'BLACK'),
    new State('000000000000001100000010100000001000', '000000000000010000000101000000110000', 16, 12, 'BLACK'),
    new State('000000000010100010000001000100100010', '000010101000001000000010100000001000', 11, 7, 'BLACK'),
    new State('000010010001000000000101100000100001', '000101101000001010000010000000001000', 31, 15, 'BLACK'),
    new State('000000000000001100000010100000001100', '000000100000010000000101000000110000', 12, 16, 'BLACK'),
    new State('011000000001000000001100000000100000', '000000000000000010000010000001011000', 24, 4, 'WHITE'),
    new State('000000000000011000000100000000011001', '000000100000100000001010000000100000', 4, 5, 'WHITE'),
    new State('000011100000101110000011000000000000', '000100010000010001000000100100101000', 31, 20, 'WHITE'),
    new State('000000000000001000001010100000001000', '001010000000000000100101000000000000', 30, 16, 'BLACK'),
    new State('000000000000001100000000100000001000', '000000000000010000000001000000110000', 16, 33, 'BLACK'),
    new State('001100100001110000011100010000011010', '010001010000001100100011100100100100', 10, 29, 'WHITE'),
    new State('000001000001100000001010000000000000', '000010000000001000000001000000001000', 24, 13, 'WHITE'),
    new State('000001001000010100000001000000001001', '001010000001101000010000010000000000', 7, 3, 'BLACK'),
    new State('000001100000001110000010000000000000', '000000000000010001000000100100100000', 29, 7, 'WHITE'),
    new State('000000000000010000001011100000101100', '000110000000101000000100010000010000', 5, 1, 'WHITE'),
    new State('100110000001000000001000000010010000', '010000000010101000000111000000000000', 24, 29, 'BLACK'),
    new State('001000000000001100000001100000010000', '000010010000110000000010000000001000', 16, 25, 'BLACK'),
    new State('001101100000010000001101000010010000', '000010000000101000000010000101101100', 34, 7, 'WHITE'),
    new State('100000001000000000000101000100100000', '000001000000110000000000000000001001', 22, 15, 'WHITE'),
    new State('000001000000110000001100000000100000', '000110000000001000000011000001000000', 10, 24, 'BLACK'),
    new State('000001000001100000001010000000000000', '000010000000001000000001000000011000', 21, 10, 'BLACK'),
    new State('001001110011101000001100100100110100', '010100000100010110110011000011001010', 25, 17, 'WHITE'),
    new State('000000000010110000000100000000000000', '000000000001000000000000000101010000', 30, 22, 'BLACK'),
    new State('000011000000010000000000000000000000', '000100000000000000000100000000000000', 12, 22, 'WHITE'),
    new State('001100100001011100000100100000100000', '100011000000100010000011000000001100', 20, 34, 'WHITE'),
    new State('000000000001100000000100000000000000', '000000000000001000000010100000000000', 10, 13, 'BLACK'),
    new State('001100100001011100000100100010100000', '100011000000100010010011000000001100', 31, 29, 'WHITE'),
    new State('000000000001010000001001000000101000', '001100000000100000000110000000000000', 4, 5, 'WHITE'),
    new State('001001000100010000010001010000110001', '000000100001101100001110000000001000', 24, 33, 'WHITE'),
    new State('000101000011010001011010000000100000', '101000000000101110000100010100000000', 18, 4, 'WHITE'),
    new State('000101000000011000000000000000011000', '000000010000100100000011000000000100', 4, 21, 'BLACK'),
    new State('000100010000010000000110000001001000', '000011000000000100000001100000110000', 12, 25, 'BLACK'),
    new State('000101000000011000011100000000011000', '001010000000100100100011000001100000', 11, 27, 'BLACK'),
    new State('001000000001000000001100000000000000', '000000000000000010000010000001001000', 12, 31, 'BLACK'),
    new State('000000000000010000000010100000011000', '000011000000001000000001000000000000', 6, 3, 'WHITE'),
    new State('000000000000100000001010000100100000', '000000000000001000000100010000001000', 5, 23, 'WHITE'),
    new State('000000000001010000001100000000000000', '000001000000000000010001000000000000', 14, 12, 'WHITE'),
    new State('100000100010000001000000000100010000', '000000011000001100000001000000000001', 30, 9, 'BLACK'),
    new State('000000000010100010000000000100100000', '000010001000000000000000100000001000', 14, 13, 'WHITE'),
    new State('000000100001100110000101000000000010', '010100010000001000010010110000000000', 10, 2, 'BLACK'),
    new State('000100000000001000000011000001010000', '000001000000110000001100000000100000', 24, 15, 'BLACK'),
    new State('000001001000000100000000000000001001', '001010000001100000000000010000000000', 14, 24, 'BLACK'),
    new State('100000001010100000000101000000110000', '000110000001000100001010000010000000', 5, 2, 'WHITE'),
    new State('000000000001011000000100000000000000', '000000000000100000000000100000010100', 29, 22, 'BLACK'),
    new State('000100100000010000001100000000001000', '000001000000001100000011000000000000', 25, 24, 'WHITE'),
    new State('000000000000100000000010100001001000', '001001000000010000000101000000000000', 31, 30, 'BLACK'),
    new State('001000000001010000010100000001000000', '000001000000100000001001000000010000', 32, 4, 'WHITE'),
    new State('000000000000100000000101000000010000', '000110000000010000000010000000000000', 5, 15, 'BLACK'),
    new State('000000000001110000000001000000101000', '000100000010001000000110000000000000', 31, 20, 'WHITE'),
    new State('000100000001100000000100000000000000', '000000000000010000010000000000110000', 4, 32, 'BLACK'),
    new State('001000000000001000000001100000010000', '000010000000110000000010000000001000', 15, 7, 'BLACK'),
    new State('000101000000000000101000100000000000', '000000000000010000000111000000000000', 4, 14, 'WHITE'),
    new State('100110000001000000001000100010010000', '010000000010101000000111000000000000', 32, 13, 'WHITE'),
    new State('000000000000000000000010000000100110', '000000000000001100000000100000010000', 32, 13, 'BLACK'),
    new State('001101100000010000001101000000010000', '000010000000101000000010000001101100', 34, 24, 'WHITE'),
    new State('000001010000000100000001010000000000', '000000000000010000000000100000010001', 4, 32, 'WHITE'),
    new State('000000000000011000000101000000000100', '000100000000100100010000000000000000', 11, 5, 'WHITE'),
    new State('000100000000010000000101000000000000', '000000000000101000000010000000000100', 5, 2, 'BLACK'),
    new State('000000000000110000000001000000010000', '000100000001000000000100000000000000', 19, 27, 'WHITE'),
    new State('000001000000100000001010000000000100', '000000000000001100000001000000011000', 7, 21, 'BLACK'),
    new State('000110000001000000010111000000101000', '010001000010110000001000100100000000', 14, 15, 'WHITE'),
    new State('000000000001110000001000000000000000', '000000000010001000000010000000000000', 30, 21, 'WHITE'),
    new State('000001100000110000000000000000000000', '000000000000001000000110000000000000', 23, 4, 'WHITE'),
    new State('000000000000100000001011010000001000', '001010000001010000000100100000000000', 5, 31, 'BLACK'),
    new State('001000100000001100000001100000010000', '000010010000110000000010000000001100', 16, 25, 'BLACK'),
    new State('000000000000100000000110000000000000', '000000000000001100000001000000000000', 20, 32, 'BLACK'),
    new State('000000000001000100000010000000000100', '000101000000010000000001000000000000', 6, 4, 'BLACK'),
    new State('000000000000000000000011000000010000', '000000000000110000000100000000000000', 15, 14, 'BLACK'),
    new State('000100010000101000000010100000100000', '011010100000010000000100000000000000', 29, 23, 'WHITE'),
    new State('000000000000010100000001000000010100', '000100000000100000001110000000000000', 7, 19, 'BLACK'),
    new State('000010000000001000000110000000000000', '000000000000100000001000000000100000', 10, 31, 'WHITE'),
    new State('000000000001100000001100000000001100', '000100000000011000000011000000000000', 31, 30, 'WHITE'),
    new State('001110000000111000000000000000000100', '010001000001000100000001100000001000', 21, 22, 'BLACK'),
    new State('000010000000100000000110000000000000', '000000000000001100000001000000000000', 13, 31, 'WHITE'),
    new State('000101001000000100000011000000010100', '000010010000011000000000010000101000', 24, 34, 'WHITE'),
    new State('000000000000011000010010000010000000', '001010000010100000001000000000000000', 30, 3, 'BLACK'),
    new State('000000000001011100001100000001000000', '001001000000100010000000100000010100', 22, 32, 'BLACK'),
    new State('000000000001110000000000000010000000', '000001000010001000000010000000000000', 21, 30, 'BLACK'),
    new State('000000000000110000000000000100000000', '000000000000000000000000000001100000', 31, 14, 'WHITE'),
    new State('001011000010010000000100000000010000', '000100000001100000000010000001100000', 27, 19, 'WHITE')];
