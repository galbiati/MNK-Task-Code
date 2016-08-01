<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset = "utf-8">
		<meta http-equiv = "X-UA-Compatible" content = "IE=edge">
		<meta name="viewport" content="width=device-width">
		<meta name="description" content="">
		<meta name="author" content="Ma Lab">

		<title>generalization</title>

		<!-- Libraries - may remove some later -->
		<script src="../_shared/libs/jquery-1.11.1.min.js"></script>
		<script src="../_shared/libs/underscore-min.js"></script>
		<script src="../_shared/libs/jquery-ui-1.10.4.custom/js/jquery-ui-1.10.4.custom.min.js"></script>
		<script src="../_shared/libs/bootstrap.min.js"></script>
		<script src="../_shared/libs/buzz.min.js"></script>
		<!-- Custom CSS -->
		<link href = "../_shared/styles/bootstrap.min.css" rel = "stylesheet">
		<link href = "../_shared/styles/stylesheet.css" rel="stylesheet">
		<style>
		    #timerContainer {
		    	left: 10px;
			    height: 412px;
			    /* border:1px solid red;*/			    
			    width: 90px;
			    position:relative;
		    }
		    
		    #visTimer{
		        height: 403px;
		        width: 88px;
		        background-color: white;
		        position: absolute;
		        bottom: 6px;
		    }
		    
   			}
   			#feedback-constraint {
   				color: 'black';
   			}
   			#numTimerContainer {
		    	left: 10px;
		    	top: -27px;
			    /*border:1px solid red; */
			    width: 88px;
			    position:relative;
			    text-align: center;

		    }
		    #numTimer {
		    	text-align: center;
		    	font-size: 60px;
		    	width: 88px;
			    position:absolute;
		    }

		    #block-modal .modal-dialog {
		    	width: 65vw;
		    	height: 80vh;
		    	min-height: 500px;
		    	left:17.5vw;
		    	top:7vh;
		    }

		    #block-modal .modal-dialog .modal-content {
		    	height:80vh;
		    	min-height: 500px;
		    	overflow: hidden;
		    }
		</style>   
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
						<h2 class="modal-title" id="feedback-modal-title">Good game!</h2>
						</div>
					<div class="modal-body">
<!-- 						<h3 id='feedback-constraint'></h3> -->
						<p>Next game: <b id='feedback-constraint' style='font-size: 2em'></b> seconds per move.</p>
					
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
				<div class="container-fluid col-xs-6">
					<div id='timerContainer'><div id='visTimer'></div></div>
				</div>
            </div>
            <div class="row">
                <div class="col-xs-4 col-xs-offset-16 _blank_"></div>
            </div>

            <div class="row">
            	<div class='container col-xs-6 col-xs-offset-30'>
            		<div id='numTimerContainer'><div id='numTimer'></div></div>
            	</div>
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
	<script>
		var audioCtx = new AudioContext()
		var hifreq = 2000,
			mifreq = 1000,
			lofreq = 500;

		function makeDistortionCurve(amount) {
			  var k = typeof amount === 'number' ? amount : 50,
			    n_samples = 44100,
			    curve = new Float32Array(n_samples),
			    deg = Math.PI / 180,
			    i = 0,
			    x;
			  for ( ; i < n_samples; ++i ) {
			    x = i * 2 / n_samples - 1;
			    curve[i] = ( 3 + k ) * x * 20 * deg / ( Math.PI + k * Math.abs(x) );
			  }
			  return curve;
		};

		function Beep(freq, dur) {
			var endfunc = arguments[2];
			var osc1 = audioCtx.createOscillator();
			var osc2 = audioCtx.createOscillator();
			var gain = audioCtx.createGain();
			var disto = audioCtx.createWaveShaper();
			osc1.connect(disto);
			osc2.connect(disto);
			disto.connect(gain);
			gain.connect(audioCtx.destination);

			osc1.type = 'sawtooth';
			osc1.frequency.value = freq - 100;

			osc2.type='sawtooth';
			osc2.frequency.value = freq + 100;

			disto.curve = makeDistortionCurve(100);
			disto.oversample = '4x';

			osc1.start(0);
			osc2.start(0);
			setTimeout(function() {
				osc1.stop();
				osc2.stop();
				endfunc();
			}, dur);
		}

	</script>
	<script src="../_shared/scripts/util.js"></script>
	<script src="./params.js"></script>
	<script src="../_shared/scripts/game.js"></script>
	<script src="../_shared/conditions/instructions.js"></script>
	<script src="../_shared/conditions/debrief.js"></script>
	<script src="../_shared/conditions/timed_ai.js"></script>
	<script>
		var timed_ai = [new Timed_AI(50), new End_Message()]
		var blocks = timed_ai;
	</script>
	<script src="./experiment.js"></script>
</html>
