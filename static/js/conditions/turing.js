// Todos
// Get all filenames: waiting
// Get correct answers: waiting

// poster: no idea
// Slider Aesthetics: redo the colors: white for no-clue, red for computer and green for human (jut 2 colors)

var clip, trial_start
var clip_files = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
//initiate an array for storing played videos - just for safety?
var clip_played = []
var clip_answers = [0, 1, 1, 0, 0, 1, 0, 1, 0, 1]

var stim_source = $('#stim-source') //document.getElementById('stim-source');
var player = document.getElementById('turing-stim');
player.defaultPlaybackRate = 10.0

$(document).ready(function() {
    //i = 0

    //assuming all videoclips will be played; if only want to play a subset,
    //use a counter to keep track
    i = Math.floor(Math.random() * clip_files.length);

    clip = clip_files[i]
    $('.slidertext').addClass("hidden");
    initPlayer();
    loadVideo(clip);
    trial_start = Date.now();
    $('.submit-btn').on('click', function(e) { submitHandler(e); }).prop('disabled', true).hide();
    $('.play-btn').on('click', function(e) { playHandler(e); });
    player.addEventListener('ended',function(e) { endHandler(e); }); 
    $('#slider').on('click', function(e) { sliderchangeHandler(e); }).hide();
    
})

function initPlayer() {
    player.controls = false;
}

function loadVideo(clipno) { 
    // add optional callback
    stim_source.attr('src', getClip(clipno));
    player.load();
    $('#slider').prop('disabled', true).hide();
    $('.play-btn').prop('disabled', false);

}

function playHandler(e){
    player.play();
    $('.play-btn').prop('disabled', true).hide();
    $('#feedbacktext').text("");
}

function endHandler(e){
    $('#slider').prop('disabled', false).fadeIn(1000);
    $('.slidertext').removeClass("hidden").addClass("visible");
}

function sliderchangeHandler(e){
    $('.submit-btn').prop('disabled', false);
    $('.submit-btn').fadeIn(1000);
}

function submit_response(val) {
    var response = {
        choice: val,
        start: trial_start,
        timestamp: Date.now(),
        clip_id: clip
    }

    return $.ajax({type: 'POST', url: '/turing', dataType:'JSON', data:response})
}

function submitHandler(e) {
    var val = $('#slider').val();
    feedback = ((val<50) == clip_answers[i]);
    //$('#feedbacktext').text(String(feedback));
    if (feedback == 1){
        $('#feedbacktext').text("Yes, that was correct!"); 
    }
    else{
        $('#feedbacktext').text("Sorry, that was not correct.");
    }
    res = submit_response(val);
    res.done(console.log('Data sent!'));

    clip_played.push(clip_files.splice(i,1)[0]);
    //i++;
    i = Math.floor(Math.random() * clip_files.length);
    
    /* no need with this shuffling method
    if (i >= clip_files.length) {
        i = 0;
    }
    */

    $('.submit-btn').prop('disabled', true).hide();
    $('.play-btn').fadeIn();
    $('.slidertext').removeClass("visible").addClass("hidden");

    clip = clip_files[i];
    loadVideo(clip);
}

function getClip(clipno) {
    var clip_prefix = '../static/media/video/turing_videos/'
    return clip_prefix + String(clipno) + '.mp4'
}