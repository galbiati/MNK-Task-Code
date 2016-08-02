/* Free Play Against Computer */

// This is the constructor function and various important variables for the AI condition
// The subject simply plays games for a set duration against a computer opponent
// The opponent is selected with a one-up one-down step function

function Timed_AI(dur) {
	var that = this;
	this.duration = dur; // in minutes
	this.start_time = Date.now()
	this.end_time = this.start_time + 60000 * this.duration
	this.current_trial = 0;
	this.opponents = opponent_list;
	this.current_opponent = _.sample(this.opponents[Math.floor(this.opponents.length/2)]);
	this.timelist = [5000, 10000, 20000];
	this.colorlist = ['red', 'blue', 'green'];
	this.auto_refresh = "";
	this.timeridx = 0; 
	this.timerStart = 0;
	this.timerCurrent = 0;
	this.timerStartColor = 0;
	this.timerCurrentColor = 0;
	this.timerheight = 0;
	this.timerStartHeight = 0;
	this.original_initials = 0;
	this.is_first_move = true;

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

	this.reset_timer = function(numTimer, visTimer) {
		that.auto_refresh = "";
		//that.timerheight = ((that.timerCount * 15) + 'px');
		numTimer.text(that.timerStart/1000);
		visTimer.animate({height: that.timerStartHeight}, {duration: 300});
      	visTimer.animate({backgroundColor: that.timerStartColor});
      	that.timerCurrent = that.timerStart;
    }

	this.draw_time = function(numTimer, visTimer) {
		that.timeridx = Math.floor(3*Math.random())
		that.timerStart = that.timelist[that.timeridx];
		that.timerCurrent = that.timelist[that.timeridx];
		that.timerStartColor = that.colorlist[that.timeridx];
		that.timerCurrentColor = that.timerStartColor;
		that.timerStartHeight = (that.timerStart * ((403/20)/1000) + 'px');
		numTimer.text(that.timerStart/1000);
		player.initials = that.original_initials + '_' + String(that.timeridx);
		that.current_opponent = that.current_opponent + (30*(that.timeridx+1));

	}

    this.start_timer = function(numTimer, visTimer) {
		if (that.auto_refresh !== "") {
	      return;
	    }
    	that.auto_refresh = setInterval(function() {
        	that.timerCurrent += -1000;
        	$(numTimer).text(that.timerCurrent/1000);
        	console.log(that.timerCurrent);
	        if (that.timerCurrent <= 0) {
	        	Beep(1200, 500);
	            numTimer.text('0');
	            board.game_status = 'timeout';
	            clearInterval(that.auto_refresh);
	            that.draw_time(numTimer,visTimer);
	            that.reset_timer($('#numTimer'),$('#visTimer'));
	            that.reset_timer($('#numTimerOpp'),$('#visTimerOpp'));
	            $('#feedback-constraint').text(that.timerStart/1000);
	            $('#feedback-constraint').css('color', that.timerStartColor);
	            $('#feedback-modal-title').text('Time ran out!');
	            player.opponent_score ++
	            player.duration = Date.now() - player.move_start;
	            var send_promise = ajax_submit_response(board, player);
	            send_promise.done(function() {
		            $('#feedback-modal').modal('show');
					$('html').css('cursor', 'default');
				});
	            
	        } else if (that.timerCurrent/1000 <= 5) {
	          	visTimer.animate({backgroundColor: that.colorlist[0]});
     		} else if (that.timerCurrent/1000 <= 10) {
          		visTimer.animate({backgroundColor: that.colorlist[1]});
      		} else { 
	      		visTimer.css('background-color', that.colorlist[2]);
	      	};

	      	if (that.timerCurrent/1000 == 2) {
	      		Beep(300, 250);
	      	} else if (that.timerCurrent/1000 == 1) {
	      		Beep(600, 250);
	      	}

   		}, 1000);
    	visTimer.stop(true, true).animate({height: '0px'}, {duration:that.timerStart-250, easing:'linear', queue:false});
	};
     
	this.stop_timer = function(numTimer, visTimer) {
		clearInterval(that.auto_refresh);
      	visTimer.stop().animate({height: that.timerStartHeight});
	}

	this.action = function(b, p) {
		p.move_start = Date.now();
		b.highlight_tiles();
		$(".indicator").html("<h1>Your turn</h1>").css("color","#000000");
		$('.canvas').css("cursor", "pointer");
		$('.usedTile, .usedTile div').css("cursor", "default");
		that.reset_timer($('#numTimer'),$('#visTimer'));
		that.start_timer($('#numTimer'),$('#visTimer'));
		$('.tile').off('click').css("cursor", "pointer").on('click', function(e) {
			p.move_end = Date.now();
			$('.tile').off('mouseenter').off('mouseleave').off('click');
			$('.canvas, .canvas div').css("cursor", "default");
			that.stop_timer($('#numTimer'),$('#visTimer'));
			that.reset_timer($('#numTimer'),$('#visTimer'));
			that.reset_timer($('#numTimerOpp'),$('#visTimerOpp'));
			$(".indicator").html(waiting_html+ "<h1>Waiting for opponent</h1>").css("color","#333333");
			p.move = parseInt(e.target.id);
			b.move_index ++;
			b.add_piece(p.move, p.color);
			MoveSound.play();
			b.show_last_move(p.move, p.color);
			b.evaluate_win(p.color);
			if(b.game_status=="win" || b.game_status=="draw"){ 
				p.score ++;
				that.draw_time($('#numTimer'),$('#visTimer'));
				that.reset_timer($('#numTimer'),$('#visTimer'));
				that.reset_timer($('#numTimerOpp'),$('#visTimerOpp'));
				$('#feedback-constraint').text(that.timerStart/1000);
	            $('#feedback-constraint').css('color', that.timerStartColor); 
			};
			p.duration = p.move_end - p.move_start
			var send_promise = ajax_submit_response(b, p);
			if(b.game_status == "ready" || b.game_status == "playing") {
				that.start_timer($('#numTimerOpp'),$('#visTimerOpp'));};
			send_promise.done(function() {
				get_promise = ajax_retrieve_response();
				if(b.game_status == "ready" || b.game_status == "playing") {
					ajax_poll(b, p, get_promise, function() { that.opponent_action(b,p) })
					}
			});
		})
	}

	this.opponent_action = function(b, p) {
		that.stop_timer($('#numTimerOpp'),$('#visTimerOpp'));
		that.reset_timer($('#numTimerOpp'),$('#visTimerOpp'));
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
			$('.tile').css("cursor", "default");
			if(p.color==1){ $(".indicator").html(waiting_html + "<h1>Waiting for opponent</h1>").css("color","#333333"); that.start_timer($('#numTimerOpp'),$('#visTimerOpp'));}
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
		player.opponent_color = 1;
		that.original_initials = player.initials;
		that.draw_time($('#numTimer'),$('#visTimer'));
		that.reset_timer($('#numTimer'),$('#visTimer'));
		that.reset_timer($('#numTimerOpp'),$('#visTimerOpp'));
		$('#feedback-constraint').text(that.timerStart/1000);
		$('#block-modal .modal-body').empty().append(instTimedAI);
		$('#block-modal').modal('show');
		$(document).on('keydown', function(e) {
			if (e.keyCode == 192) {
				e.preventDefault();
				// $("html, #scale-label, input[type=radio]").css("cursor", "none");
				$('#block-modal').modal('hide');
				// that.do_trial(board, player);
				$('#feedback-constraint').css('color', that.timerStartColor);
				$('#feedback-modal-title').text('Ready?')
				$('#feedback-modal').modal('show');
				$(document).off('keydown');
			}
		});
		$('#feedback-modal button').on('click', function() {
			$('#feedback-modal').modal('hide')
			//$("#scale-label, input[type=radio]").css("cursor", "none");
			
			if (that.is_first_move) {
				that.is_first_move = false
			} else {
				that.current_trial ++;
				player.game_index ++;
				that.current_opponent = that.change_opponent(player) + 30*(that.timeridx + 1);
				player.color = (player.color + 1)%2
				player.opponent_color = (player.opponent_color + 1)%2
			}
			
			board = new Board();
			board.create_tiles();
			that.do_trial(board, player);
		});
		$('#feedback-modal').on('hidden.bs.modal', function() {
				$('#feedback-modal-title').text('Good game!');
		});
	}
}

var opponent_list = [[0,1,2,3,4],[5,6,7,8,9],[10,11,12,13,14],[15,16,17,18,19],[20,21,22,23,24],[25,26,27,28,29]]