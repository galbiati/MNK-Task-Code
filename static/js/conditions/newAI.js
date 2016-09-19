function Condition_AI(dur, opp_list, player) {
    var that = this;
    this.duration = dur
    this.start_time = Date.now();
    this.end_time = this.start_time + 60000*this.duration;

    this.current_trial = 0;

    this.opp_list = opp_list;
    this.current_opponent = sample_array(opp_list[Math.floor(opp_list.length/2)]);

    this.p = player;
    this.b = new Board();

    this.change_opponent = function(p) {
        var ol = that.opp_list.length;
        var first = Math.floor(ol/2);
        var tier = p.opponent_score - p.score + first_opp;
        if (tier > ol - 1) {
            var new_opp = that.opp_list[ol - 1]
        } else if (tier < 0) {
            var new_opp = that.opp_list[0]
        } else {
            var new_opp = that.opp_list[tier]
        }

        return sample_array(new_opp)
    }

    this.init_turn = function() {
        that.p.move_start = Date.now();
        that.b.highlight_tiles() // probably better way to write this
        $('.indicator').html('<h1>Your turn</h1>').css('color', '#000000');
        $('.canvas, .tile').css('cursor', 'pointer');
        $('.usedTile, .usedTile div').css('cursor', 'default');
    }

    this.afterPromise = function() {
        get_promise = ajax_retrieve_response();
        if(that.b.game_status == 'ready' || that.b.game_status == 'playing') {
            ajax_poll(that.b, that.p, get_promise, function() { that.opponent_action(that.b, that.p); });
        }
    }

    this.tileClickHandler = function(e) {
        // ideally this will be split up into canvas aesthetics, board aesthetics, and io stuff
        that.p.move_end = Date.now();
        $('.tile').off('mousenter').off('mouseleave').off('click');
        $('.canvas, .canvas div').css('cursor', 'none');
        $('.indicator').html('<h1>Waiting for opponent</h1>').css('color', '#333333');
        that.p.move = parseInt(e.target.id);
        that.b.move_index ++;
        that.b.add_piece(that.p.move, that.p.color);
        that.b.show_last_move(that.p.move, that.p.color);
        MoveSound.play();
        that.b.evaluate_win(that.p.color); // move this to server!
        if(that.b.game_status=='win' || that.b.game_status=='draw'){ that.p.score ++ }
        that.p.duration = that.p.move_end - that.p.move_start;

        // the below will need to be modified for websocket version 
        var send_promise = ajax_submit_response(that.b, that.p);
        send_promise.done(function() { that.afterPromise(); })

    }

    this.action = function() {
        that.init_turn(); // aesthetics
        $('.tile').off('click').on('click', function(e) { that.tileClickHandler(e); });
    }
}