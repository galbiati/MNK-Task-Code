<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset = "utf-8">
		<meta http-equiv = "X-UA-Compatible" content = "IE=edge">
		<meta name="viewport" content="width=device-width">
		<meta name="description" content="">
		<meta name="author" content="Ma Lab">

		<title>reconstruction</title>

		<!-- Libraries - may remove some later -->
		<script src="../_shared/libs/jquery-1.11.1.min.js"></script>
		<script src="../_shared/libs/underscore-min.js"></script>
		<script src="../_shared/libs/jquery-ui-1.10.4.custom/js/jquery-ui-1.10.4.custom.min.js"></script>
		<script src="../_shared/libs/bootstrap.min.js"></script>
		<script src="../_shared/libs/buzz.min.js"></script>
		<!-- Custom CSS -->
		<link href = "../_shared/styles/bootstrap.min.css" rel = "stylesheet">
		<link href = "../_shared/styles/stylesheet.css" rel="stylesheet">
	</head>

	<body>
		<!-- welcome modal -->
		<div class="modal fade" id="welcome-modal" data-backdrop="static" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-body">
					</div>
					<div class="modal-footer">
						<button class="btn btn-large btn-warning">Next</button>
					</div>
				</div>
			</div>
		</div>

		<!-- block modal -->
		<div class="modal fade" id="block-modal" data-backdrop="static" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true">
			<div class="modal-dialog modal-sm">
				<div class="modal-content">
					<div class="modal-body">
					</div>
				</div>
			 </div>
		</div>

		<!-- feedback modal -->
		<div class="modal fade" id="feedback-modal" data-backdrop="static" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true">
				<div class="modal-dialog modal-sm">
				<div class="modal-content">
					<div class="modal-header">
						<h2 class="modal-title">Great work!</h2>
						</div>
					<div class="modal-body">
						<h5>Feel free to take a short break. When you are ready, please press the button to continue.</h5>
					</div>
					<div class="modal-footer">
						<button class="btn btn-large btn-warning" id="next-trial">Continue</button>
					</div>
				</div>
			 </div>
		</div>

		<!-- container -->
		<div class="container-fluid">
			<div class="row">
				<div class="indicator col-xs-24 col-sm-offset-6">
					<h1></h1>
				</div>
			</div>
			<div class="row">
				<div class="container-fluid col-xs-24 col-xs-offset-6 canvas-container"> <!--col-xs-offset-1-->
					<div class="canvas"></div>
				</div>
            </div>
            <div class="row">
                <div class="col-xs-4 col-xs-offset-16 _blank_"></div>
            </div>
			<div class='row' id='button-row'>
				<div class='col-xs-4 col-xs-offset-16'>
					<center><button class='btn btn-large btn-warning' id='submit'>Submit</button></center>
				</div>
			</div>
			<div class="row" id='score-row'>
				<div class='col-xs-10 col-xs-offset-13'>
					<center><h2>Your Score</h2>
					<h3 id='score-text'></h3></center>
				</div>
		</div>

	</body>

	<script src="../_shared/scripts/util.js"></script>
	<script src="./params.js"></script>
	<script src="../_shared/scripts/game.js"></script>
	<script src="../_shared/conditions/AI.js"></script>
	<script src="../_shared/conditions/AFC2.js"></script>
	<script src="../_shared/conditions/AFCn.js"></script>
	<script src="../_shared/conditions/reconstruction.js"></script>
	<script src="../_shared/conditions/evaluation.js"></script>
	<script src="../_shared/conditions/eye_calibration.js"></script>
	<script src="../_shared/conditions/instructions.js"></script>
	<script src="../_shared/conditions/debrief.js"></script>
	<script src="../_shared/experiments.js"></script>
	<script src="./experiment.js"></script>

</html>
