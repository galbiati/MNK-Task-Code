function Condition_AFC2() {
	var that = this;
	this.ntrials = AFC2_positions.length;
	this.duration = 20;
	this.start_time = Date.now();
	this.end_time = this.start_time + 60000 * this.duration;
	this.instructions = "String of instructions...";
	this.states = _.shuffle(AFC2_positions);
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
			board.game_status = "AFC2";
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
	}
}