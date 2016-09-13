// Todos
//   Slider + submit button
//   No early choices

var clip, trial_start
var clip_files = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
var clip_answers = [0, 1, 0, 1, 0, 1, 0, 1, 0, 1]

var stim_source = $('#stim-source') //document.getElementById('stim-source');
var player = document.getElementById('turing-stim');

$(document).ready(function() {
    i = 0
    clip = clip_files[i]
    initPlayer();
    loadVideo(clip);
    trial_start = Date.now();
    $('.response-btn').on('click', function(e) { responseHandler(e); }).prop('disabled', false);
    $('.play-btn').on('click', function(e) { playHandler(e); })
})

function initPlayer() {
    player.controls = false;
}

function loadVideo(clipno) { 
    // add optional callback
    stim_source.attr('src', getClip(clipno));
    player.load();
    $('.play-btn').prop('disabled', false);
}

function playHandler(e){
    player.play();
    $('.play-btn').prop('disabled', true);
    $('#feedbacktext').text("");
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

function responseHandler(e) {
    player.pause();
    var val = (e.target.id) ? e.target.id : $(e.target).parent().attr("id");
    val = (val=="human")? 1:0;
    feedback = (val == clip_answers[i]);
    $('#feedbacktext').text(String(feedback));
    res = submit_response(val);
    res.done(console.log('Data sent!'));
    i ++ ;
    if (i >= clip_files.length) {
        i = 0;
    }
    $('.response-btn').prop('disabled', true);
    clip = clip_files[i];
    loadVideo(clip);
    $('.response-btn').prop('disabled', false);

}

function getClip(clipno) {
    var clip_prefix = '../static/media/video/turing_videos/'
    return clip_prefix + String(clipno) + '.mp4'
}