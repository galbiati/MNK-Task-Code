function End_Message() {
	this.run_block = function() {
		$(".indicator").css("color", "#FFFFFF");
		$('#block-modal .modal-footer').remove();
		$('#block-modal .modal-body').html("<p><b>Thanks for participating!</b><br><br>Please let the experimenter know you are finished.</p>");
		$('#block-modal').modal('show');
	}
}
