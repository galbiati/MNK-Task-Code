<?php
define("HOST", "127.0.0.1:3306");
define("USER", "root");
define("PW", "gomoku");
define("DB", "games_research");

$connect = mysql_connect(HOST,USER,PW)
or die('Could not connect to mysql server.' );

mysql_select_db(DB, $connect)
or die('Could not select database.');

$table = mysql_real_escape_string($_POST['table']);
$initials = mysql_real_escape_string($_POST['initials']);
$color =  mysql_real_escape_string($_POST['color']);
$game_index = mysql_real_escape_string($_POST['game_index']);
$move_index = mysql_real_escape_string($_POST['move_index']);
$game_status = mysql_real_escape_string($_POST['game_status']);
$black_position = mysql_real_escape_string($_POST['black_position']);
$white_position = mysql_real_escape_string($_POST['white_position']);
$response = mysql_real_escape_string($_POST['response']);
$duration = mysql_real_escape_string($_POST['duration']);
$timestamp = mysql_real_escape_string($_POST['timestamp']);
$mouse_t = mysql_real_escape_string($_POST['mouse_t']);
$mouse_x = mysql_real_escape_string($_POST['mouse_x']);
$opponent_color = mysql_real_escape_string($_POST['opponent_color']);
$opponent_strength = mysql_real_escape_string($_POST['opponent_strength']);

$sql = "insert into $table
		(initials, color, game_index, move_index, game_status,
			black_position, white_position, response, duration,
			timestamp, mouse_t, mouse_x)
		values
		('$initials', '$color', '$game_index', '$move_index',
			'$game_status', '$black_position', '$white_position',
			'$response', '$duration', '$timestamp', '$mouse_t', '$mouse_x')";

$result = mysql_query($sql);

if ($game_status == "playing" || $game_status == "ready") {
	$initials = $opponent_strength;
	if ($opponent_color == 0) {
		$input_color = "BLACK";
	} else {
		$input_color = "WHITE";
	}

	if ($game_status == "ready") {
		if((intval($game_index) % 2) == 0) {
			$game_status = "ready";
		} else {
			$move_index = strval(intval($moveIndex) + 1);
			exec("MNK.exe $opponent_strength $black_position $white_position $input_color $timestamp", $program_output, $return);
			$response = $program_output[0];
			$black_position = $program_output[1];
			$white_position = $program_output[2];
			$game_status = $program_output[3];
			$timestamp = $program_output[4];
		}
		$sql = "insert into $table
			(initials, color, game_index, move_index, game_status,
				black_position, white_position, response, timestamp)
			values
			('$initials', '$opponent_color', '$game_index', '$move_index',
				'$game_status', '$black_position', '$white_position',
				'$response', '$timestamp')";
	    $result = mysql_query($sql);
	} elseif ($game_status == "win" ) {
	} elseif ($game_status == "draw") {
	} else {
		$move_index = strval(intval($move_index) + 1);
		exec("MNK.exe $opponent_strength $black_position $white_position $input_color $timestamp", $program_output, $return);
		$black_position = $program_output[1];
		$white_position = $program_output[2];
		$response = $program_output[0];
		$game_status = $program_output[3];
		$timestamp = $program_output[4];

		$sql = "insert into $table
			(initials, color, game_index, move_index, game_status,
				black_position, white_position, response, timestamp)
			values
			('$initials', '$opponent_color', '$game_index', '$move_index',
				'$game_status', '$black_position', '$white_position',
				'$response', '$timestamp')";
		$result = mysql_query($sql);
	}
}

echo json_encode($response);
?>
