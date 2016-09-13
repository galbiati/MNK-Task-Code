// Todos
//   Play button
//   Slider + submit button
//   No controls
//   Feedback
//   No early choices
//   

var clip, trial_start
var clip_files = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

var stim_source = $('#stim-source') //document.getElementById('stim-source');
var player = document.getElementById('turing-stim');

$(document).ready(function() {
    i = 0
    clip = clip_files[i]
    initPlayer();
    loadVideo(clip);
    trial_start = Date.now();
    player.play() // probably want custom function for playing, to add callbacks etc
    $('.response-btn').on('click', function(e) {
        buttonHandler(e);
    }).prop('disabled', false);
})

function initPlayer() {
    player.controls = false;
}

function loadVideo(clipno) { 
    // add optional callback
    stim_source.attr('src', getClip(clipno));
    player.load();
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

function buttonHandler(e) {
    player.pause();
    var val = (e.target.id) ? e.target.id : $(e.target).parent().attr("id");
    res = submit_response(val);
    res.done(console.log('Data sent!'));
    i ++;
    if (i >= clip_files.length) {
        i = 0;
    }
    $('.response-btn').prop('disabled', true);
    clip = clip_files[i];
    loadVideo(clip)
    player.play();
    $('.response-btn').prop('disabled', false);
}

function getClip(clipno) {
    var clip_prefix = '../static/media/video/turing_videos/'
    return clip_prefix + String(clipno) + '.mp4'
}