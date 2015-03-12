function Instructions() {
	var that = this
	this.pages = [];
	this.current_page = 0;

	this.start_experiment = function() {
		$('#welcome-modal').modal('hide');
		blocks[current_block].run_block();
	}

	this.button = $("#welcome-modal .modal-footer .btn")
	this.button_action = function() {
		that.current_page += 1;
		if (that.current_page < that.pages.length) {
			$("#welcome-modal .modal-body").empty().append(that.pages[that.current_page]);
		}
		else if (that.current_page == that.pages.length) {
			$("#welcome-modal .modal-body").empty().append(instruction_text);
			that.button.text("Next");
		}
		else {
			player = new Player();
			player.initials = Date.now();
			track_mouse(player);
			that.start_experiment();
		}
	}

	this.run_block = function() {
		$("#welcome-modal .modal-body").append(instruction_text);
		this.button.on("click", that.button_action)
		$("#welcome-modal").modal('show');
	}
}

var instruction_text = "<div class='consent-text'><p><b>Welcome!</b><br><br><br>Today you will be performing tasks related to a simple, two-player board game.<br><br><br>To play the game, you and your opponent take turns placing pieces on a 4x9 board. To win the game, you must place four of your own pieces in a row horizontally, vertically, or diagonally. You can place pieces on any unoccupied square (unlike Connect-4, where the pieces drop to the bottom row.)<br><br><br>You may take a break anytime during the experiment. If you have questions at any point, please ask the experimenter.<br><br><br>When you are ready, please press the <b>Next</b> button below.</p></div>"
