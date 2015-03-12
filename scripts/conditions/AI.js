/* Free Play Against Computer */

// This is the constructor function and various important variables for the AI condition
// The subject simply plays games for a set duration against a computer opponent
// The opponent is selected with a one-up one-down step function

function Condition_AI(dur) {
	var that = this;
	this.duration = dur; // in minutes
	this.start_time = Date.now()
	this.end_time = this.start_time + 60000 * this.duration
	this.current_trial = 0;
	this.opponents =  opponent_list;
	this.current_opponent = _.sample(this.opponents[Math.floor(this.opponents.length/2)]);

	this.change_opponent = function(p) {
		var first_opp = Math.floor(that.opponents.length/2);
		var lvl = p.opponent_score - p.score + first_opp
		if (lvl > that.opponents.length - 1) {
			var new_opp = that.opponents[that.opponents.length - 1]
		} else if (lvl < 0) {
			var new_opp = that.opponents[0]
		} else {
			var new_opp = that.opponents[lvl]
		}
		return _.sample(new_opp)
	}

	this.action = function(b, p) {
		p.move_start = Date.now();
		b.highlight_tiles();
		$(".indicator").html("<h1>Your turn</h1>").css("color","#000000");
		$('.canvas').css("cursor", "pointer");
		$('.usedTile, .usedTile div').css("cursor", "default");
		$('.tile').off('click').css("cursor", "pointer").on('click', function(e) {
			p.move_end = Date.now();
			$('.tile').off('mouseenter').off('mouseleave').off('click');
			$('.canvas, .canvas div').css("cursor", "none");
			$(".indicator").html(waiting_html+ "<h1>Waiting for opponent</h1>").css("color","#333333");
			p.move = parseInt(e.target.id);
			b.move_index ++;
			b.add_piece(p.move, p.color);
			MoveSound.play();
			b.show_last_move(p.move, p.color);
			b.evaluate_win(p.color);
			if(b.game_status=="win" || b.game_status=="draw"){ p.score ++ }
			p.duration = p.move_end - p.move_start
			var send_promise = ajax_submit_response(b, p);
			send_promise.done(function() {
				get_promise = ajax_retrieve_response();
				if(b.game_status == "ready" || b.game_status == "playing") {
					ajax_poll(b, p, get_promise, function() { that.opponent_action(b,p) })
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
		} else { // if (Date.now() < that.end_time) {
			$('.tile').css("cursor", "none");
			if(p.color==1){ $(".indicator").html(waiting_html + "<h1>Waiting for opponent</h1>").css("color","#333333");}
			var first_send_promise = ajax_submit_response(b,p);
			first_send_promise.done(function() {
				var get_promise = ajax_retrieve_response();
				ajax_poll(b, p, get_promise, function() {
					if(p.color == 0) {
            that.action(b,p);
					} else {
						$(".indicator").html(waiting_html + "<h1>Waiting for opponent</h1>").css("color","#333333");
						that.opponent_action(b,p);
					}
				});
			})
		}
	}

	this.run_block = function(){
		board = new Board();
		board.create_tiles();
		board.highlight_tiles();
		player.color = 0;
		$('#block-modal .modal-body').empty().append(instAI);
		$('#block-modal').modal('show');
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

var opponent_list = [[0,1,2,3,4],[5,6,7,8,9],[10,11,12,13,14],[15,16,17,18,19],[20,21,22,23,24],[25,26,27,28,29]]
