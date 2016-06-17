/* i/o functions */

function ws_submit_response(b, p) {
    
    
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
    return $.ajax({type:"POST", url:"../_shared/scripts/submit.php", dataType:"JSON", data:data})
}

function ajax_retrieve_response() {
    data = {"table":String(table)}
    return $.ajax({type:"GET", url:"../_shared/scripts/retrieve.php", dataType:"JSON", data:data})
}

function unpack_tiles(dataString) {
    var output_list = [];
    dataString = dataString.split("");
    for (i = 0; i < dataString.length; i++) {
        if (dataString[i] === "1") {
            output_list.push(i)
        }
    }
    return output_list
}

function unpack_response(data, b, p) {
    b.move_index = parseInt(data.move_index);
    p.game_index = parseInt(data.game_index);
    b.game_status = parseInt(data.game_status)
    b.black_position = restore_array(data.black_position)
    b.white_position = restore_array(data.white_position)
    b.last_move = parseInt(data.response)
    p.last_initials = parseInt(data.initials)

    return data
}

function ajax_poll(b, p, promise, callback) {
    promise.then(function(data) { unpack_response(data, b, p); }).done(function(data) {
        if(p.initials != p.last_initials) {
            callback();
        } else {
            console.log(b.black_position.join(""));
            console.log(b.white_position.join(""));
            setTimeout(function() {
                get_promise = ajax_retrieve_response();
                ajax_poll(b, p, get_promise, callback);
            }, ajax_freq);
        }
    })
}