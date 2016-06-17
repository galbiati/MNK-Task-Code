<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset = "utf-8">
		<meta http-equiv = "X-UA-Compatible" content = "IE=edge">
		<meta name="viewport" content="width=device-width">
		<meta name="description" content="">
		<meta name="author" content="Ma Lab">

		<title>24</title>

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
						<h2 class="modal-title">Good game!</h2>
						</div>
					<div class="modal-body">
						<h5>When you are ready, please press the button to play again.</h5>
					</div>
					<div class="modal-footer">
						<button class="btn btn-large btn-warning" id="next-trial">Play</button>
					</div>
				</div>
			 </div>
		</div>
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
            <div class="row text-center eval-element radio-bar">
                <div class="container-fluid col-xs-4 col-xs-offset-4" id="evaluation-radio"><input type="radio" name="radio" value="1"></div>
                <div class="container-fluid col-xs-4" id="evaluation-radio"><input type="radio" name="radio" value="2"></div>
                <div class="container-fluid col-xs-4" id="evaluation-radio"><input type="radio" name="radio" value="3"></div>
                <div class="container-fluid col-xs-4" id="evaluation-radio"><input type="radio" name="radio" value="4"></div>
                <div class="container-fluid col-xs-4" id="evaluation-radio"><input type="radio" name="radio" value="5"></div>
                <div class="container-fluid col-xs-4" id="evaluation-radio"><input type="radio" name="radio" value="6"></div>
                <div class="container-fluid col-xs-4" id="evaluation-radio"><input type="radio" name="radio" value="7"></div>
            </div>
            <div class="row eval-element" id="scale-label">
        		<div class="col-xs-4 col-xs-offset-4 scale-label-left"><p>Losing</p></div>
        		<div class="col-xs-4 col-xs-offset-8 scale-label-center"><p>Equal</p></div>
        		<div class="col-xs-4 col-xs-offset-8 scale-label-right"><p>Winning</p></div>
			</div>
		</div>

	</body>

	<script src="../_shared/scripts/util.js"></script>
	<script src="./params.js"></script>
	<script src="../_shared/scripts/game.js"></script>
	<script src="../_shared/conditions/AI.js"></script>
	<script src="../_shared/conditions/AFC2.js"></script>
	<script src="../_shared/conditions/AFCn.js"></script>
	<script src="../_shared/conditions/evaluation.js"></script>
	<script src="../_shared/conditions/eye_calibration.js"></script>
	<script src="../_shared/conditions/instructions.js"></script>
	<script src="../_shared/conditions/debrief.js"></script>
	<script src="../_shared/experiments.js"></script>
	<script src="./experiment.js"></script>

</html>
