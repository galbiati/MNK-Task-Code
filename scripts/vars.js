/* functional variables */

var M = 9,
	N = 4,
	K = 4,
	game_index = 0,
	response = 99,
	timestamp = Date.now(),
	ajax_data = {},
	ajax_freq = 1000;

/* aesthetic variables */

var win_color = "#22ddaa",
	MoveSound = new buzz.sound("./static/sounds/stone3.ogg"),
	square_bkgcolor = "#999999",
	square_highlight = "#bbbbbb";