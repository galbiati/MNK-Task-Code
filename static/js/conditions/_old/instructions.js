function Instructions(intro_text) {
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
			$("#welcome-modal .modal-body").empty().append(intro_text);
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