-- Database: `games_research`
--

-- --------------------------------------------------------

--
-- Table structure for table `debug`
--

CREATE TABLE IF NOT EXISTS `debug` (
`alpha_index` int(11) NOT NULL,
  `initials` varchar(16) NOT NULL,
  `color` int(11) NOT NULL,
  `game_index` int(11) NOT NULL,
  `move_index` int(11) NOT NULL,
  `game_status` varchar(63) NOT NULL,
  `black_position` varchar(60) NOT NULL,
  `white_position` varchar(60) NOT NULL,
  `response` int(11) NOT NULL,
  `duration` bigint(20) NOT NULL,
  `timestamp` bigint(20) NOT NULL,
  `mouse_t` longtext NOT NULL,
  `mouse_x` longtext NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=403 DEFAULT CHARSET=utf8;