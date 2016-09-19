// To Dos
// move evaluate win to server (edit board file as well)
// further break down event handlers etc

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

    this.submit_response = function() {
        data = {
            'initials':String(that.p.initials),
            'color':String(that.p.color),
            'gi':String(that.p.game_index),
            'mi':String(that.b.move_index),
            'status':String(that.b.game_status),
            'bp':String(that.b.black_position.join('')),
            'wp':String(that.b.white_position.join('')),
            'response':String(that.p.move),
            'rt':String(that.p.duration),
            'ts':String(Date.now()),
            'mt':String(that.p.mouse_t.join(',')),
            'mxy':String(that.p.mouse_x.join(';')),
            'opponent':String(that.current_opponent)
        };
        that.p.mouse_x = [];
        that.p.mouse_t = [];

        return $.ajax({type:'POST', url:'/AI', dataType:'JSON', data:data})
    }

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
        send_promise.done(that.afterPromise);

    }

    this.action = function() {
        that.init_turn(); // aesthetics
        $('.tile').off('click').on('click', function(e) { that.tileClickHandler(e); });
    }

    this.opponent_action = function() {
        that.b.add_piece(that.b.last_move, that.p.opponent_color);
        that.b.show_last_move(that.b.last_move, that.p.opponent_color);
        MoveSound.play()
        that.b.evaluate_win(p.opponent_color); // move to server!
        if (that.b.game_status == 'win') {
            that.p.opponent_score ++;
        } else if (that.b.game_status == 'playing') {
            that.action();
        }
    }

    this.trial_start_promise = function() {
        var get_promise = ajax_retrieve_response();
        ajax_poll(that.b, that.p, get_promise, function() {
            if (that.p.color==0) { 
                that.action(); 
            } else {
                $('.indicator').html('<h1>Wating for opponent</h1>').css('color', '#333333');
                that.opponent_action();
            }
        })
    }

    this.first_trial = function() {
        // expand to allow for color setting?
        that.start_time = Date.now();
        that.end_time = that.start_time + 60000*that.duration;
        var send_promise = ajax_submit_response(that.b, that.p);
        send_promise.done(that.trial_start_promise);
    }

    this.further_trial = function() {
        $('.tile').css('cursor', 'none');
        if (that.p.color==1) { 
            $('.indicator').html('<h1>Waiting for opponent</h1>').css('color', '#333333');
        }
        var send_promise = ajax_submit_response(that.b, that.p);
        send_promise.done(that.trial_start_promise);
    }

    this.do_trial = function() {
        if (that.current_trial == 0) {
            that.first_trial();
        } else if (Date.now() < that.end_time) {
            that.further_trial()
        }
    }

    this.run_block = function() {
        // abstract handlers below as above

        that.b = new Board();
        that.b.create_tiles();
        that.b.highlight_tiles();
        that.p.color = 0;
        that.p.opponent_color = 1;
        $('#block-modal .modal-body').empty().append(instAI);
        $('#block-modal').modal('show');
        $(document).on('keydown', function(e) {
            if (e.keyCode == 192) {
                e.preventDefault();
                $('html').css('cursor', 'none');
                $('#block-modal').modal('hide');
                that.do_trial();
                $(document).off('keydown');
            }
        });
        $('#feedback-modal button').on('click', function() {
            $('#feedback-modal').modal('hide');
            $('html').css('cursor', 'none');
            that.current_trial ++;
            that.p.game_index ++;
            that.current_opponent = that.change_opponent(that.p);
            that.p.color = (that.p.color + 1)%2;
            that.p.opponent_color = (that.p.color + 1)%2;
            that.b = new Board();
            board.create_tiles();
            that.do_trial();
        });

    }

}

function ajax_submit_response(b, p) {
    // console.log(b.black_position.join(""));
    // console.log(b.white_position.join(""));
    data = {"initials":String(p.initials),
            "color":String(p.color),
            "game_index":String(p.game_index),
            "move_index":String(b.move_index),
            "game_status":String(b.game_status),
            "black_position":String(b.black_position.join("")),
            "white_position":String(b.white_position.join("")),
            "response":String(p.move),
            "duration":String(p.duration),
            "timestamp":String(Date.now()),
            "mouse_t":String(p.mouse_t.join(",")),
            "mouse_x":String(p.mouse_x.join(";")),
            "opponent_color":String(p.opponent_color),
            "opponent_strength":String(blocks[current_block].current_opponent),
            "table":String(table)};
            p.mouse_x = [];
            p.mouse_t = [];
    return $.ajax({type:"POST", url:"/", dataType:"JSON", data:data})
}

var opponent_list = [[0,1,2,3,4],[5,6,7,8,9],[10,11,12,13,14],[15,16,17,18,19],[20,21,22,23,24],[25,26,27,28,29]]