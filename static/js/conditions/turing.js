// Todos
// Shuffling
// Get all filenames
// Get correct answers

// Make it nice :)
// poster
// feedback text
// button centering + color + style + disappearing
// Slider Aesthetics


var clip, trial_start
var clip_files = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
var clip_answers = [0, 1, 0, 1, 0, 1, 0, 1, 0, 1]

var stim_source = $('#stim-source') //document.getElementById('stim-source');
var player = document.getElementById('turing-stim');
player.defaultPlaybackRate = 10.0

$(document).ready(function() {
    i = 0
    clip = clip_files[i]
    initPlayer();
    loadVideo(clip);
    trial_start = Date.now();
    $('.submit-btn').on('click', function(e) { submitHandler(e); }).prop('disabled', true).hide();
    $('.play-btn').on('click', function(e) { playHandler(e); })
    player.addEventListener('ended',function(e) { endHandler(e); }) 
    $('#slider').on('click', function(e) { sliderchangeHandler(e); })
})

function initPlayer() {
    player.controls = false;
}

function loadVideo(clipno) { 
    // add optional callback
    stim_source.attr('src', getClip(clipno));
    player.load();
    $('#slider').prop('disabled', true);
    $('.play-btn').prop('disabled', false);

}

function playHandler(e){
    player.play();
    $('.play-btn').prop('disabled', true).hide();
    $('.submit-btn').show();
    $('#feedbacktext').text("");
}

function endHandler(e){
    $('#slider').prop('disabled', false);
}

function sliderchangeHandler(e){
    $('.submit-btn').prop('disabled', false);
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
    $('#feedbacktext').text(String(feedback));
    res = submit_response(val);
    res.done(console.log('Data sent!'));
    i ++ ;
    if (i >= clip_files.length) {
        i = 0;
    }
    $('.submit-btn').prop('disabled', true).hide();
    $('.play-btn').show();
    clip = clip_files[i];
    loadVideo(clip);
}

function getClip(clipno) {
    var clip_prefix = '../static/media/video/turing_videos/'
    return clip_prefix + String(clipno) + '.mp4'
}