var clip, trial_start
var clip_files = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95]
var clip_played = []
//humans: 1; computers: 0
var clip_answers = [1,0,0,1,1,1,0,1,1,0,1,0,0,0,0,0,0,1,1,0,1,1,0,0,0,1,1,0,0,0,1,0,1,1,1,1,0,0,0,1,1,1,0,1,0,0,1,0,1,1,0,0,0,0,0,0,1,1,0,1,1,1,1,1,1,1,1,0,0,1,0,1,0,1,0,0,0,1,1,0,0,1,0,0,1,1,0,1,0,0,1,0,1,1,0,1,]

var stim_source = $('#stim-source') //document.getElementById('stim-source');
var player = document.getElementById('turing-stim');
var n_trials = clip_files.length;
var trial_no = 0;
var completion = 0;
var feedback, answer;
var progress_notification_interval = Math.floor(n_trials / 6)

player.defaultPlaybackRate = 1

$(window).load(function(){
    $('#block-modal').modal('show');
});

$(document).ready(function() {
    i = Math.floor(Math.random() * clip_files.length);
    clip = clip_files[i]
    $('#slider-labels p').hide();
    initPlayer();
    loadVideo(clip);
    trial_start = Date.now();
    $('.submit-btn').on('click', function(e) { submitHandler(e); }).prop('disabled', true).hide();
    $('.play-btn').on('click', function(e) { playHandler(e); });
    player.addEventListener('ended',function(e) { endHandler(e); });
    $('#slider').on('click', function(e) { sliderchangeHandler(e); }).hide();
    $('#next-trial').on('click', function() { $('#feedback-modal').modal('hide'); });
})

function initPlayer() {
    player.controls = false;
}

function loadVideo(clipno) {
    // add optional callback
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        console.log("State: ", this.readyState, "Status: ", this.status);
        if (this.readyState == 4 && this.status == 200) {
            var url = window.URL || window.webkitURL;

            // fade out - not working
            /*
            $('#turing-stim video').bind('ended', function(){
                $(this).parent().fadeOut(slow)
            })
            */

            stim_source.attr('src', url.createObjectURL(this.response));
            player.load();
            // fading in after loading but there is still a flash
            // player.style.opacity = 0.5;
            // player.oncanplaythrough = function() {
            //     fade(player, 25);
            // }

        } else if (this.readyState == 4) {
            console.log(this.status);
        } else {
            //not ready yet
        }
    }

    xhr.open('GET', getClip(clipno));
    xhr.responseType = 'blob';
    xhr.send();

    $('#slider').prop('disabled', true).hide();
    $('.play-btn').prop('disabled', false);

}

function playHandler(e){
    player.play();
    document.getElementById('play').value = "Play next";
    $('.play-btn').prop('disabled', true).fadeOut('slow');
    $('#feedback-text').text("");
}

function endHandler(e){
    $('#slider').prop('disabled', false).fadeIn('slow');
    $('#slider-labels p').fadeIn();
}

function sliderchangeHandler(e){
    $('.submit-btn').prop('disabled', false);
    $('.submit-btn').fadeIn('slow');
}

function submit_response(val) {
    var response = {
        choice: val,
        start: trial_start,
        timestamp: Date.now(),
        clip_id: clip,
        feedback: feedback
    }

    return $.ajax({type: 'POST', url: '/turing', dataType:'JSON', data:response})
}

function submitHandler(e) {
    var val = $('#slider').val();
    answer = clip_answers[i]
    feedback = ((val>=50) == answer);
    $('#slider').val(50)

    feedback_message = (feedback==1) ? "Correct!" : "Incorrect."

    $('#slider').fadeOut('slow').promise().done(function() { $('#feedback-text').text(feedback_message).fadeIn('slow'); });

    res = submit_response(val);
    res.done(console.log('Data sent!'));
    clip_played.push(clip_files[i]);
    clip_files.splice(i,1);
    clip_answers.splice(i,1);
    if (clip_files.length!==0){
        i = Math.floor(Math.random() * clip_files.length);
        trial_no ++;
        completion = Math.floor(100 * trial_no / n_trials)
        $('#remaining-trials').text(String(completion) + '%');

        if ((trial_no % progress_notification_interval) == 0) {
            $('#feedback-modal').modal('show')
        }
        // calculate whether to display progress modal
    }
    else{
        $('#end-modal').modal('show');
    }

    clip = clip_files[i];
    $('.submit-btn').prop('disabled', true).fadeOut('slow');

    loadVideo(clip);
    $('#slider').fadeOut('slow').promise().done(function(){
        $('.play-btn').fadeIn('slow');
    });
    $('#slider-labels p').hide();

}

function getClip(clipno) {
    var clip_prefix = 'static/media/video/turing_videos/'
    return clip_prefix + String(clipno) + '.mp4'
}

// for video to fade in
// function fade(element, time) {
//     var op = 0;
//     var timer = setInterval(function() {
//     if (op >= 1) clearInterval(timer);
//     element.style.opacity = op;
//     element.style.filter = 'alpha(opacity=' + op * 100 + ")";
//     op += op * 0.1 || 0.1;
//     }, time);
// }
