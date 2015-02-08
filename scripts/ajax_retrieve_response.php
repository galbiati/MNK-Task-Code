<?php
define("HOST", "127.0.0.1:3306");
define("USER", "root");
define("PW", "gomoku");
define("DB", "games_research");

$connect = mysql_connect(HOST,USER,PW)
or die('Could not connect to mysql server.' );

mysql_select_db(DB, $connect)
or die('Could not select database.');

$table = "raw_data";
$sql = "select initials, color, game_index, move_index, 
		game_status, black_position, white_position, response,
		duration, timestamp, mouse_t, mouse_x 
		from $table order by alpha_index desc limit 1";
$result = mysql_fetch_array(mysql_query($sql));

$initials = $result[0];
$color = $result[1];
$game_index = $result[2];
$move_index = $result[3];
$game_status = $result[4];
$black_position = $result[5];
$white_position = $result[6];
$response = $result[7];
$duration = $result[8];
$timestamp = $result[9];
$mouse_t = $result[10];
$mouse_x = $result[11];

$d = array( 'move_index' => $move_index ,
			'game_index' => $game_index ,
			'initials' => $initials ,
			'game_status' => $game_status ,
			'black_position' => $black_position , 
			'white_position' => $white_position , 
			'response' => $response 
		  );

echo json_encode($d);
?>