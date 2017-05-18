function Player() {
  // Remove initials, use username instead

  this.name = 'username' // placeholder

  // Remove these
	this.initials = $("#nameInputField").val();
	this.last_initials = this.initials;

  
	this.color = 0
	this.score = 0
	this.opponent_score = 0
	this.game_index = 0
	this.scorebox = $('#leftScorebox')
	this.scoretext = $('#leftScorebox p')
	this.opponent_scorebox = $('#rightScorebox')
	this.opponent_scoretext = $('#rightScorebox p')
	this.opponent_color = 1
	this.opponent_initials = "QQ"
	this.show_name = $("#leftScorebox h2").text(this.initials);
	this.move = 99
	this.move_start = 0
	this.move_end = 0
	this.duration = 0
	this.mouse_t = [];
	this.mouse_x = [];
}
