var win_color = "#22ddaa",
	MoveSound = new buzz.sound(window.location.host+"/static/audio/stone3.ogg"),
	square_bkgcolor = "#999999",
	square_highlight = "#bbbbbb";

/* utility funcs */

function build_array(mDim,nDim,fillVal) {
	return Array.apply(null, new Array(mDim*nDim)).map(Number.prototype.valueOf,fillVal);
}

function restore_array(dataString) {
	dataString = dataString.split("");
	for (i = 0; i < dataString.length; i += 1) {
		dataString[i] = parseInt(dataString[i]);
	};
	return dataString;
}



function track_mouse(p) {
		$(".canvas").on('mousemove', function(e) {
			p.mouse_t.push(Date.now())
			var loc = [e.pageX, e.pageY]
			p.mouse_x.push(loc);
	})
}

function every_n(list, n) {
	new_list = []
	for(i=0; i<list.length; i++) {
		if(i%n == 0){
			new_list.push(list[i])
		}
	}
	return new_list
}

function Positions(black_pos,white_pos) {
	this.black_position = black_pos
	this.white_position = white_pos;
}

function Choices(choiceA,choiceB) {
	this.A = choiceA;
	this.B = choiceB;
}

function State(black_pos, white_pos, choiceA, choiceB, color) {
	this.boards = new Positions(black_pos, white_pos);
	this.choices = new Choices(choiceA, choiceB);
	this.color = color == "BLACK" ? 0 : 1;
}